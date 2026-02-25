import React from "react";
import ReactMarkdown from "react-markdown";
import { INSTRUCTIONS_TEXT } from "../surveySchema.js";

export default function Instructions({ onNext }) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Instructions</h1>
          <p style={styles.subtitle}>
            Please read carefully before continuing.
          </p>
        </header>

        <section style={styles.card} aria-label="Instructions text">
          <div style={styles.cardInner}>
            <div style={styles.instructionsText}>
  <ReactMarkdown
    components={{
      p: ({ children }) => <p style={styles.mdP}>{children}</p>,
      strong: ({ children }) => <strong style={styles.mdStrong}>{children}</strong>,
      ul: ({ children }) => <ul style={styles.mdUl}>{children}</ul>,
      ol: ({ children }) => <ol style={styles.mdOl}>{children}</ol>,
      li: ({ children }) => <li style={styles.mdLi}>{children}</li>,
      br: () => <br />
    }}
  >
    {INSTRUCTIONS_TEXT}
  </ReactMarkdown>
</div>
          </div>
        </section>

        <footer style={styles.footer}>
          <button
            type="button"
            onClick={onNext}
            style={styles.primaryButton}
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
    boxSizing: "border-box",
    background: "#f7f7fb",
  },
  container: {
    maxWidth: 860,
    margin: "0 auto",
  },
  header: {
    marginBottom: 16,
    textAlign: "left",
  },
  title: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: "#111827",
  },
  subtitle: {
    margin: "8px 0 0",
    fontSize: 15,
    lineHeight: 1.5,
    color: "#6b7280",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
    overflow: "hidden",
  },
  cardInner: {
    padding: 18,
  },
  instructionsText: {
    whiteSpace: "pre-wrap",
    fontSize: 20,
    lineHeight: 1.5,
    color: "#111827",
  },
  footer: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
  },
  primaryButton: {
    appearance: "none",
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(17, 24, 39, 0.18)",
    transition: "transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease",
  },
    mdP: {
    margin: "0 0 1px 0"
  },
  mdStrong: {
    fontWeight: 600
  },
  mdUl: {
    margin: "6px 0 12px 20px",
    padding: 0
  },
  mdOl: {
    margin: "6px 0 12px 20px",
    padding: 0
  },
  mdLi: {
    marginBottom: 6
  },
};
