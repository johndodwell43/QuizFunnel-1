import React, { useState, useCallback, useEffect, useRef } from 'react';
import { QUESTIONS, TOTAL_STEPS } from './data/questions.js';
import Header from './components/Header.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import QuestionScreen from './components/QuestionScreen.jsx';
import EmailGate from './components/EmailGate.jsx';
import PauseScreen from './components/PauseScreen.jsx';
import OfferScreen from './components/OfferScreen.jsx';
import { trackQuizStarted, trackStep, trackQuizQ1Answered, trackQuizCompleted } from './lib/track.js';

const SELECT_DELAY_MS = 170;

export default function App() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState('lead'); // lead | quiz | pause | offer
  const [outcome, setOutcome] = useState('offer'); // offer | pause
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState(null);
  const [sel, setSel] = useState(null);
  const [pause, setPause] = useState({ kind: 'healing', step: 2 });
  const q1Tracked = useRef(false);

  const isLead = screen === 'lead';
  const isQuiz = screen === 'quiz';
  const isPause = screen === 'pause' && lead !== null;
  const isOffer = screen === 'offer' && lead !== null;

  useEffect(() => {
    trackQuizStarted();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const heading = document.querySelector('main h1');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }, [screen, step]);

  const showResult = useCallback((next) => {
    setScreen(next);
    setSel(null);
  }, []);

  const advance = useCallback((stepIndex, value) => {
    const q = QUESTIONS[stepIndex];
    if (value === 'yes' && q.pauseKind) {
      setPause({ kind: q.pauseKind, step: stepIndex });
      setOutcome('pause');
      showResult('pause');
      return;
    }
    if (stepIndex >= QUESTIONS.length - 1) {
      setOutcome('offer');
      trackQuizCompleted();
      showResult('offer');
      return;
    }
    setStep(stepIndex + 1);
    setSel(null);
  }, [showResult]);

  const pick = useCallback(
    (key, value, index) => {
      if (sel !== null) return;
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setSel(index);
      trackStep(step + 1);
      if (step === 0 && !q1Tracked.current) {
        q1Tracked.current = true;
        trackQuizQ1Answered();
      }
      const reduce =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => advance(step, value), reduce ? 0 : SELECT_DELAY_MS);
    },
    [sel, step, advance]
  );

  const goBack = useCallback(() => {
    if (screen === 'offer' || screen === 'pause') {
      setScreen('quiz');
      setStep(outcome === 'pause' ? pause.step : QUESTIONS.length - 1);
      setSel(null);
      return;
    }
    if (screen === 'quiz' && step === 0) {
      setScreen('lead');
      setSel(null);
      return;
    }
    if (step > 0) setStep(step - 1);
  }, [outcome, pause.step, screen, step]);

  const restart = useCallback(() => {
    setStep(0);
    setScreen('lead');
    setOutcome('offer');
    setAnswers({});
    setLead(null);
    setSel(null);
    setPause({ kind: 'healing', step: 2 });
    q1Tracked.current = false;
  }, []);

  const continueFromLead = useCallback((saved) => {
    setLead(saved);
    setScreen('quiz');
    setStep(0);
    setSel(null);
  }, []);

  const stepNum = isLead ? 1 : isQuiz ? step + 2 : TOTAL_STEPS;
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
          showBack={!isLead}
          onBack={goBack}
          stepLabel={`Step ${stepNum} of ${TOTAL_STEPS}`}
        />
        <ProgressBar progress={progress} />

        {isLead && (
          <EmailGate
            initialEmail={lead?.email || ''}
            initialFirstName={lead?.firstName || ''}
            savedLead={lead}
            onSuccess={continueFromLead}
          />
        )}
        {isQuiz && (
          <QuestionScreen question={QUESTIONS[step]} sel={sel} onPick={pick} />
        )}
        {isPause && <PauseScreen kind={pause.kind} onRestart={restart} />}
        {isOffer && <OfferScreen answers={answers} inPersonFirst={answers.pain === 'yes' || answers.loose === 'yes'} />}
      </div>
    </div>
  );
}
