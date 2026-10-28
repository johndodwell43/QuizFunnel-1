import React, { useState, useCallback, useEffect } from 'react';
import { QUESTIONS, TOTAL_STEPS } from './data/questions.js';
import Header from './components/Header.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import QuestionScreen from './components/QuestionScreen.jsx';
import EmailGate from './components/EmailGate.jsx';
import PauseScreen from './components/PauseScreen.jsx';
import OfferScreen from './components/OfferScreen.jsx';
import { trackQuizStarted, trackStep } from './lib/track.js';

const SELECT_DELAY_MS = 170;

export default function App() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState('quiz'); // quiz | email | pause | offer
  const [outcome, setOutcome] = useState('offer'); // offer | pause, applied only after email
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState(null);
  const [sel, setSel] = useState(null);
  const [pause, setPause] = useState({ kind: 'healing', step: 2 });

  const isQuiz = screen === 'quiz';
  const isEmail = screen === 'email';
  const isPause = screen === 'pause' && lead !== null;
  const isOffer = screen === 'offer' && lead !== null;

  // Fire once when the quiz first mounts (Step 1).
  useEffect(() => {
    trackQuizStarted();
  }, []);

  const inPersonFirst = answers.pain === 'yes' || answers.loose === 'yes';

  const advance = useCallback((stepIndex, value) => {
    const q = QUESTIONS[stepIndex];
    if (value === 'yes' && q.pauseKind) {
      setPause({ kind: q.pauseKind, step: stepIndex });
      setOutcome('pause');
      setScreen('email');
      setSel(null);
      return;
    }
    if (stepIndex >= QUESTIONS.length - 1) {
      setOutcome('offer');
      setScreen('email');
      setSel(null);
      return;
    }
    setStep(stepIndex + 1);
    setSel(null);
  }, []);

  const pick = useCallback(
    (key, value, index) => {
      if (sel !== null) return;
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setSel(index);
      trackStep(step + 1);
      const reduce =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => advance(step, value), reduce ? 0 : SELECT_DELAY_MS);
    },
    [sel, step, advance]
  );

  const goBack = useCallback(() => {
    if (screen === 'offer' || screen === 'pause') {
      setScreen('email');
      setSel(null);
      return;
    }
    if (screen === 'email') {
      setScreen('quiz');
      setStep(outcome === 'pause' ? pause.step : QUESTIONS.length - 1);
      setSel(null);
      return;
    }
    if (step > 0) setStep(step - 1);
  }, [outcome, pause.step, screen, step]);

  const restart = useCallback(() => {
    setStep(0);
    setScreen('quiz');
    setOutcome('offer');
    setAnswers({});
    setLead(null);
    setSel(null);
    setPause({ kind: 'healing', step: 2 });
  }, []);

  const showResults = useCallback((saved) => {
    setLead(saved);
    setScreen(outcome === 'pause' ? 'pause' : 'offer');
  }, [outcome]);

  const stepNum = isQuiz ? step + 1 : isEmail ? QUESTIONS.length + 1 : TOTAL_STEPS;
  const progress = isOffer || isPause ? 100 : Math.round((stepNum / TOTAL_STEPS) * 100);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#d7ecff',
        fontFamily: "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px 48px 16px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '100%', maxWidth: isOffer ? '960px' : '560px' }}>
        <Header
          showBack={!(isQuiz && step === 0)}
          onBack={goBack}
          stepLabel={`Step ${stepNum} of ${TOTAL_STEPS}`}
        />
        <ProgressBar progress={progress} />

        {isQuiz && (
          <QuestionScreen question={QUESTIONS[step]} sel={sel} onPick={pick} />
        )}
        {isEmail && (
          <EmailGate
            answers={answers}
            initialEmail={lead?.email || ''}
            initialFirstName={lead?.firstName || ''}
            onSuccess={showResults}
          />
        )}
        {isPause && <PauseScreen kind={pause.kind} onRestart={restart} />}
        {isOffer && <OfferScreen answers={answers} inPersonFirst={inPersonFirst} />}
      </div>
    </div>
  );
}
