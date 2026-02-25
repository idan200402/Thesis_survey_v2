import React from "react";

const PROLIFIC_URL =
  "https://app.prolific.com/submissions/complete?cc=C1G95G4A"; 

export default function Done() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.card}>
          <div style={styles.icon}>✓</div>

          <h1 style={styles.title}>
            Thank You for Participating
          </h1>

          <p style={styles.subtitle}>
            Your responses have been successfully recorded.
          </p>

          <div style={{ marginTop: 28 }}>
            <a
              href={PROLIFIC_URL}
              style={styles.primaryButton}
            >
              Return to Prolific
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "80px 16px",
    background: "#f7f7fb",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(17, 24, 39, 0.08)",
    padding: 48,
    textAlign: "center",
  },
  icon: {
    width: 56,
    height: 56,
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 900,
    boxShadow: "0 10px 20px rgba(17, 24, 39, 0.18)",
  },
  title: {
    margin: 0,
    fontSize: 30,
    letterSpacing: "-0.02em",
    color: "#111827",
  },
  subtitle: {
    marginTop: 14,
    fontSize: 17,
    color: "#374151",
    lineHeight: 1.6,
  },
  primaryButton: {
    display: "inline-block",
    padding: "12px 26px",
    borderRadius: 14,
    background: "#111827",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 15,
    border: "1px solid #111827",
    boxShadow: "0 10px 18px rgba(17, 24, 39, 0.18)",
    transition: "transform 120ms ease, box-shadow 120ms ease",
  },
};
