import React, { useEffect, useMemo, useState } from "react";
import Instructions from "./pages/Instructions.jsx";
import About from "./pages/About.jsx";
import Question from "./pages/Question.jsx";
import Feedback from "./pages/Feedback.jsx";
import Done from "./pages/Done.jsx";
import {makeInitialSurveyState } from "./surveySchema.js";

const LS_KEY = "survey_state_v2";

export default function App() {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved).uiStep ?? "instructions" : "instructions";
  });

  const [survey, setSurvey] = useState(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.survey ?? makeInitialSurveyState();
    }
    return makeInitialSurveyState();
  });

  // Persist single survey state (and step)
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ uiStep: step, survey }));
  }, [step, survey]);

  const questionIndex = useMemo(() => {
    if (typeof step === "string") return null;
    return step.qIndex;
  }, [step]);

  function nextFromInstructions() {
    setStep("about");
  }

  function nextFromAbout() {
    setStep({ qIndex: 0 });
  }

  function nextQuestion() {
  if (questionIndex === null) return;
  if (questionIndex < survey.trials.length - 1) setStep({ qIndex: questionIndex + 1 });
  else setStep("feedback");
}


  function finishToDone(submissionId) {
    setSurvey((prev) => ({
      ...prev,
      meta: { ...prev.meta, finishedAt: new Date().toISOString() }
    }));
    setStep({ done: true, submissionId });
  }

  // Basic guard rails
  if (step === "instructions") {
    return <Instructions onNext={nextFromInstructions} />;
  }

  if (step === "about") {
    return (
      <About
        participant={survey.participant}
        setParticipant={(patch) =>
          setSurvey((prev) => ({ ...prev, participant: { ...prev.participant, ...patch } }))
        }
        onNext={nextFromAbout}
      />
    );
  }

  if (typeof step === "object" && "qIndex" in step) {
    return (
        <Question
    index={step.qIndex}
    total={survey.trials.length}
    trial={survey.trials[step.qIndex]}
    answer={survey.answers[step.qIndex]}
    setChoice={(chosenOptionId) =>
      setSurvey((prev) => {
        const answers = prev.answers.map((a, i) =>
          i === step.qIndex ? { ...a, chosenOptionId } : a
        );
        return { ...prev, answers };
      })
    }
    onNext={nextQuestion}
    onBackToInstructions={() => setStep("instructions")}
  />

    );
  }

  if (step === "feedback") {
    return (
      <Feedback
        feedback={survey.feedback}
        setFeedback={(patch) =>
          setSurvey((prev) => ({ ...prev, feedback: { ...prev.feedback, ...patch } }))
        }
        survey={survey}
        onDone={finishToDone}
      />
    );
  }

  if (typeof step === "object" && step.done) {
  return <Done />;
}


  return null;
}
