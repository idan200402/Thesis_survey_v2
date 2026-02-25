import React, { useMemo, useState } from "react";

export default function About({ participant, setParticipant, onNext }) {
  const [touched, setTouched] = useState(false);

  const isValid = useMemo(() => {
    return (
      participant.prolificId.trim().length > 0 &&
      participant.consent &&
      participant.age !== "" &&
      participant.gender &&
      participant.education &&
      participant.country.trim().length > 0
    );
  }, [participant]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>About yourself</h1>
          <p style={styles.subtitle}>
            Please provide the following information.
          </p>
        </header>

        <section style={styles.card}>
          <div style={styles.cardInner}>
            <FormField label="Age">
              <input
                type="number"
                value={participant.age}
                onChange={(e) => setParticipant({ age: e.target.value })}
                style={styles.input}
              />
            </FormField>

            <FormField label="Prolific ID">
              <input
                type="text"
                value={participant.prolificId}
                onChange={(e) =>
                  setParticipant({ prolificId: e.target.value })
                }
                style={styles.input}
              />
            </FormField>

            <FormField label="Gender">
              <select
                value={participant.gender}
                onChange={(e) =>
                  setParticipant({ gender: e.target.value })
                }
                style={styles.input}
              >
                <option value="">Choose...</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="prefer_not">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Education">
              <select
                value={participant.education}
                onChange={(e) =>
                  setParticipant({ education: e.target.value })
                }
                style={styles.input}
              >
                <option value="">Choose...</option>
                <option value="highschool">High school</option>
                <option value="bachelor">Bachelor</option>
                <option value="grad">Graduate school</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Country">
              <input
                type="text"
                value={participant.country}
                onChange={(e) =>
                  setParticipant({ country: e.target.value })
                }
                style={styles.input}
              />
            </FormField>

            <div style={styles.consentBox}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={participant.consent}
                  onChange={(e) =>
                    setParticipant({ consent: e.target.checked })
                  }
                />
                <span style={{ marginLeft: 8 }}>
                  I agree to participate in this survey
                </span>
              </label>
            </div>
          </div>
        </section>

        {touched && !isValid && (
          <p style={styles.error}>
            Please complete all fields and agree to participate.
          </p>
        )}

        <footer style={styles.footer}>
          <button
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

/* ---------- Reusable Form Field ---------- */

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

/* ---------- Shared Styles (Same Design Language) ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 16px",
    background: "#f7f7fb",
  },
  container: {
    maxWidth: 860,
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
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
  },
  cardInner: {
    padding: 20,
  },
  label: {
    display: "block",
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 6,
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  consentBox: {
    borderTop: "1px solid #eee",
    paddingTop: 16,
    marginTop: 10,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: "#111827",
  },
  error: {
    marginTop: 14,
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    marginTop: 22,
    display: "flex",
    justifyContent: "center",
  },
  primaryButton: {
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    padding: "10px 20px",
    borderRadius: 12,
    boxShadow: "0 6px 14px rgba(17, 24, 39, 0.18)",
    transition: "all 120ms ease",
  },
};
