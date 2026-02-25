import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Question({
  index,
  total,
  trial,
  answer,
  setChoice,
  onNext,
  onBackToInstructions,
}) {
  const [touched, setTouched] = useState(false);
  const isValid = useMemo(() => !!answer.chosenOptionId, [answer.chosenOptionId]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Top progress */}
        <div style={styles.topRow}>
          <div style={styles.progressPill}>
            {index + 1} <span style={{ opacity: 0.7 }}>of</span> {total}
          </div>
        </div>

        {/* User question card */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardKicker}>User</div>
          </div>
          <div style={styles.questionText}>{trial.userQuestion}</div>
        </section>

        {/* Options */}
        <div style={styles.grid}>
          {trial.options.map((opt, i) => {
            const selected = answer.chosenOptionId === opt.optionId;

            return (
              <section
                key={opt.optionId}
                style={{
                  ...styles.optionCard,
                  ...(selected ? styles.optionCardSelected : null),
                }}
                aria-selected={selected}
              >
                <div style={styles.optionHeader}>
                  <div style={styles.optionTitle}>Response {i + 1}</div>
                  {selected && <div style={styles.selectedBadge}>Selected ✓</div>}
                </div>

                <div style={styles.optionBody}>
                  <div style={styles.markdown}>
                    <ReactMarkdown>{opt.text}</ReactMarkdown>
                  </div>
                </div>

                {/* Bottom area click = selects option */}
                <div style={styles.optionFooter}>
                  <button
                    type="button"
                    onClick={() => setChoice(opt.optionId)}
                    style={{
                      ...styles.choiceButton,
                      ...(selected ? styles.choiceButtonSelected : null),
                    }}
                  >
                    I prefer this response {selected ? "✓" : ""}
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* Validation */}
        {touched && !isValid && (
          <p style={styles.error}>Pick one response to continue.</p>
        )}

        {/* Navigation */}
        <footer style={styles.nav}>
          <button
            type="button"
            onClick={onBackToInstructions}
            style={styles.secondaryButton}
          >
            Back to Instructions
          </button>

          <button
            type="button"
            onClick={() => {
              setTouched(true);
              if (isValid) onNext();
            }}
            style={{
              ...styles.primaryButton,
              opacity: isValid ? 1 : 0.6,
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            Next
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
    maxWidth: 1100,
    margin: "0 auto",
  },

  topRow: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 14,
  },
  progressPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    boxShadow: "0 6px 16px rgba(17, 24, 39, 0.06)",
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardKicker: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#6b7280",
  },
  questionText: {
    fontSize: 17,
    lineHeight: 1.6,
    color: "#111827",
    whiteSpace: "pre-wrap",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },

  optionCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 120ms ease, border-color 120ms ease, transform 120ms ease",
  },

  // ✅ Selected state for the rectangle
  optionCardSelected: {
    border: "1px solid #111827",
    boxShadow: "0 12px 30px rgba(17, 24, 39, 0.14)",
    background: "#f3f4f6", // subtle highlight (same neutral palette)
  },

  optionHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid #eef2f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#111827",
  },
  selectedBadge: {
    fontSize: 12,
    fontWeight: 800,
    color: "#111827",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #111827",
    background: "#ffffff",
  },

  optionBody: {
    padding: "14px 16px",
    flex: 1,
  },
  markdown: {
    fontSize: 16,
    lineHeight: 1.7,
    color: "#111827",
  },

  optionFooter: {
    padding: "14px 16px",
    borderTop: "1px solid #eef2f7",
    background: "rgba(255,255,255,0.7)",
  },

  choiceButton: {
    width: "100%",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontSize: 14,
    fontWeight: 700,
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(17, 24, 39, 0.06)",
    transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
  },
  choiceButtonSelected: {
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    boxShadow: "0 10px 18px rgba(17, 24, 39, 0.18)",
  },

  error: {
    marginTop: 12,
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },

  nav: {
    marginTop: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontSize: 14,
    fontWeight: 700,
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(17, 24, 39, 0.06)",
  },
  primaryButton: {
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    padding: "10px 18px",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(17, 24, 39, 0.18)",
  },
};
