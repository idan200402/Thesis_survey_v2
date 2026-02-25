import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

// --- Supabase (Postgres) connection ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY; // service_role / secret key

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in server/.env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// ✅ new table name
const TABLE = "submissions_v2";

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    res.json({ ok: true, count: count ?? 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Submit survey
app.post("/api/submit", async (req, res) => {
  try {
    const payload = req.body;

    if (!payload?.participant?.consent) {
      return res.status(400).json({ ok: false, error: "Consent is required." });
    }
    if (!Array.isArray(payload?.answers) || payload.answers.length !== 10) {
      return res.status(400).json({ ok: false, error: "Expected 10 answers." });
    }
    if (payload.answers.some((a) => !a.trialId || !a.chosenOptionId)) {
      return res.status(400).json({ ok: false, error: "All trials must be answered." });
    }

    const { data, error } = await supabase
      .from(TABLE)
      .insert({ payload })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    res.json({ ok: true, id: data.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Admin: view recent submissions (dev only; remove/lock before going public)
app.get("/api/submissions_v2", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, created_at, payload")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return res.status(500).json({ ok: false, error: error.message });
    res.json({ ok: true, submissions: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the React build
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

// For client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});