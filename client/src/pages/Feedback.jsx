import React, { useMemo, useState } from "react";
import { submitSurvey } from "../api.js";

function Likert({ value, onChange }) {
  const labels = [
    "Strongly disagree",
    "Disagree",
    "Neither",
    "Agree",
    "Strongly agree",
  ];

  return (
    <div style={styles.likertRow} role="radiogroup" aria-label="Likert scale">
      {labels.map((lab, i) => {
        const v = i + 1;
        const selected = value === v;

        return (
          <label
            key={lab}
            style={{
              ...styles.likertPill,
              ...(selected ? styles.likertPillSelected : null),
            }}
          >
            <input
              type="radio"
              checked={selected}
              onChange={() => onChange(v)}
              style={styles.radioHidden}
            />
            <span>{lab}</span>
          </label>
        );
      })}
    </div>
  );
}

function QuestionBlock({ title, children }) {
  return (
    <div style={styles.qBlock}>
      <div style={styles.qTitle}>{title}</div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

export default function Feedback({ feedback, setFeedback, survey, onDone }) {
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const isValid = useMemo(() => {
    return (
      feedback.accuracyImportance &&
      feedback.incorrectInfoOk &&
      feedback.admitDontKnowBest &&
      feedback.trustWhenAdmits &&
      feedback.chatgptExperience // ✅ you ask it, so validate it too
    );
  }, [feedback]);

  async function handleSubmit() {
    setTouched(true);
    setErr("");
    if (!isValid) return;

    setSubmitting(true);
    try {
      const payload = {
        meta: { ...survey.meta, finishedAt: new Date().toISOString() },
        participant: survey.participant,
        feedback: survey.feedback,
        answers: survey.answers.map((a) => ({
          trialId: a.trialId,
          shownOrder: a.shownOrder,
          chosenOptionId: a.chosenOptionId,
        })),
      };

      const res = await submitSurvey(payload);
      onDone(res.id);
    } catch (e) {
      setErr(e.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Feedback</h1>
          <p style={styles.subtitle}>
            Select the option that best matches your level of agreement.
          </p>
        </header>

        <section style={styles.card}>
          <div style={styles.cardInner}>
            <QuestionBlock title='I believe that it is important for ChatGPT (or similar models) to provide only accurate information.'>
              <Likert
                value={feedback.accuracyImportance}
                onChange={(v) => setFeedback({ accuracyImportance: v })}
              />
            </QuestionBlock>

            <QuestionBlock title="I believe that it is important for ChatGPT (or similar models) to provide information even if it is incorrect.">
              <Likert
                value={feedback.incorrectInfoOk}
                onChange={(v) => setFeedback({ incorrectInfoOk: v })}
              />
            </QuestionBlock>

            <QuestionBlock title="I believe that it is best that ChatGPT (or similar models) admits it does not know rather than providing incorrect information.">
              <Likert
                value={feedback.admitDontKnowBest}
                onChange={(v) => setFeedback({ admitDontKnowBest: v })}
              />
            </QuestionBlock>

            <QuestionBlock title="When ChatGPT (or similar models) admits it does not know, it allows me to trust it better.">
              <Likert
                value={feedback.trustWhenAdmits}
                onChange={(v) => setFeedback({ trustWhenAdmits: v })}
              />
            </QuestionBlock>

            <QuestionBlock title="I have significant experience using ChatGPT (or similar models).">
              <Likert
                value={feedback.chatgptExperience}
                onChange={(v) => setFeedback({ chatgptExperience: v })}
              />
            </QuestionBlock>

            <div style={styles.commentsBlock}>
              <label style={styles.label}>Comments (optional)</label>
              <textarea
                rows={4}
                value={feedback.comments}
                onChange={(e) => setFeedback({ comments: e.target.value })}
                style={styles.textarea}
                placeholder="Any additional thoughts…"
              />
            </div>
          </div>
        </section>

        {touched && !isValid && (
          <p style={styles.error}>Please answer all rating questions.</p>
        )}
        {err && <p style={styles.error}>{err}</p>}

        <footer style={styles.footer}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              ...styles.primaryButton,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 16px",
    background: "#f7f7fb",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    margin: 0,
    fontSize: 28,
    letterSpacing: "-0.02em",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 1.5,
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
  },
  cardInner: {
    padding: 20,
    display: "grid",
    gap: 18,
  },

  qBlock: {
    border: "1px solid #eef2f7",
    borderRadius: 12,
    padding: 14,
    background: "#ffffff",
  },
  qTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.5,
  },

  likertRow: {
    display: "grid",
    gap: 8,
  },

  // pill option
  likertPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(17, 24, 39, 0.06)",
    transition: "border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
    userSelect: "none",
  },
  likertPillSelected: {
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    boxShadow: "0 10px 18px rgba(17, 24, 39, 0.18)",
  },
  radioHidden: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    width: 1,
    height: 1,
  },

  commentsBlock: {
    borderTop: "1px solid #eef2f7",
    paddingTop: 14,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 800,
    color: "#111827",
    marginBottom: 8,
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
    lineHeight: 1.5,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
  },

  error: {
    marginTop: 14,
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },

  footer: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
  },
  primaryButton: {
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    padding: "10px 18px",
    borderRadius: 12,
    boxShadow: "0 10px 18px rgba(17, 24, 39, 0.18)",
  },
};
