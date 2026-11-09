import React, { useState, useCallback, useEffect, useRef } from 'react';
import { QUESTIONS, TOTAL_STEPS } from './data/questions.js';
import Header from './components/Header.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import QuestionScreen from './components/QuestionScreen.jsx';
import EmailGate from './components/EmailGate.jsx';
import PauseScreen from './components/PauseScreen.jsx';
import OfferScreen from './components/OfferScreen.jsx';
import { resumePendingQuizLead } from './lib/pendingLead.js';
import { trackQuizStarted, trackStep } from './lib/track.js';

const SELECT_DELAY_MS = 170;

export default function App() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState('email'); // email | quiz | pause | offer
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState(null);
  const [sel, setSel] = useState(null);
  const [pause, setPause] = useState({ kind: 'healing', step: 2 });
  const leadRef = useRef(null);
  leadRef.current = lead;

  const onGate = lead === null || screen === 'email';
  const isQuiz = screen === 'quiz' && lead !== null;
  const isPause = screen === 'pause' && lead !== null;
  const isOffer = screen === 'offer' && lead !== null;

  // Fire once when the funnel first mounts. The gate is the first screen.
  useEffect(() => {
    trackQuizStarted();
  }, []);

  // A lead that failed to save is retried on the next visit and on each step.
  useEffect(() => {
    resumePendingQuizLead();
  }, [step, screen]);

  const inPersonFirst = answers.pain === 'yes' || answers.loose === 'yes';

  const advance = useCallback((stepIndex, value) => {
    const q = QUESTIONS[stepIndex];
    const saved = leadRef.current !== null;
    if (value === 'yes' && q.pauseKind) {
      setPause({ kind: q.pauseKind, step: stepIndex });
      setScreen(saved ? 'pause' : 'email');
      setSel(null);
      return;
    }
    if (stepIndex >= QUESTIONS.length - 1) {
      setScreen(saved ? 'offer' : 'email');
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
      setScreen('quiz');
      setStep(screen === 'pause' ? pause.step : QUESTIONS.length - 1);
      setSel(null);
      return;
    }
    if (screen === 'email' || lead === null) return;
    if (step > 0) {
      setStep(step - 1);
      setSel(null);
      return;
    }
    setScreen('email');
    setSel(null);
  }, [lead, pause.step, screen, step]);

  const restart = useCallback(() => {
    setStep(0);
    setScreen('email');
    setAnswers({});
    setLead(null);
    setSel(null);
    setPause({ kind: 'healing', step: 2 });
  }, []);

  const continueAfterLead = useCallback((saved) => {
    setLead(saved);
    setScreen('quiz');
    setSel(null);
  }, []);

  // Gate is step 1, questions follow, result is the last step. Same total as before.
  const stepNum = onGate ? 1 : isQuiz ? step + 2 : TOTAL_STEPS;
  const progress = isOffer || isPause ? 100 : Math.round((stepNum / TOTAL_STEPS) * 100);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: onGate ? '#d6ecff' : '#d7ecff',
        fontFamily: "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px 48px 16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className={onGate ? 'gate-screen' : isOffer ? 'shell shell-offer' : 'shell shell-flow'}
        style={{ width: '100%' }}
      >
        <Header
          showBack={!onGate}
          onBack={goBack}
          gate={onGate}
          stepLabel={onGate ? undefined : `Step ${stepNum} of ${TOTAL_STEPS}`}
        />
        <ProgressBar progress={progress} gate={onGate} />

        {onGate && (
          <EmailGate
            initialEmail={lead?.email || ''}
            initialPhone={lead?.phone || ''}
            initialEmailConsent={lead ? lead.emailMarketingConsent === true : true}
            initialSmsConsent={lead?.smsConsent === true}
            onSuccess={continueAfterLead}
          />
        )}
        {isQuiz && (
          <QuestionScreen question={QUESTIONS[step]} sel={sel} onPick={pick} />
        )}
        {isPause && <PauseScreen kind={pause.kind} onRestart={restart} />}
        {isOffer && <OfferScreen answers={answers} inPersonFirst={inPersonFirst} />}
      </div>
    </div>
  );
}
