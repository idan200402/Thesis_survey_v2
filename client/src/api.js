const BASE = import.meta.env.DEV ? "http://localhost:3001" : "";

export async function submitSurvey(survey) {
  const res = await fetch(`${BASE}/api/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(survey)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Submit failed");
  return data;
}
