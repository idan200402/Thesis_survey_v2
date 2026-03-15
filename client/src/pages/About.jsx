export default function ParticipantPage({
  participant,
  setParticipant,
  onNext,
  onBack
}) {
  function updateField(field, value) {
    setParticipant((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  const isValid =
    participant.age.trim() &&
    participant.prolificId.trim() &&
    participant.gender.trim() &&
    participant.education.trim() &&
    participant.country.trim() &&
    participant.consent;

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>About yourself</h1>
        <p>Please provide the following information.</p>
      </div>

      <div className="card form-card">
        <label>Age</label>
        <input
          type="text"
          value={participant.age}
          onChange={(e) => updateField("age", e.target.value)}
        />

        <label>Prolific ID</label>
        <input
          type="text"
          value={participant.prolificId}
          onChange={(e) => updateField("prolificId", e.target.value)}
        />

        <label>Gender</label>
        <select
          value={participant.gender}
          onChange={(e) => updateField("gender", e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <label>Education</label>
        <select
          value={participant.education}
          onChange={(e) => updateField("education", e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="High School">High School</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Graduate School">Graduate School</option>
          <option value="Other">Other</option>
        </select>

        <label>Country</label>
        <input
          type="text"
          value={participant.country}
          onChange={(e) => updateField("country", e.target.value)}
        />

        <div className="checkbox-row">
          <input
            id="consent"
            type="checkbox"
            checked={participant.consent}
            onChange={(e) => updateField("consent", e.target.checked)}
          />
          <label htmlFor="consent" className="checkbox-label">
            I agree to participate in this survey
          </label>
        </div>
      </div>

      <div className="footer-actions between">
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
        <button
          className="primary-btn"
          onClick={onNext}
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}