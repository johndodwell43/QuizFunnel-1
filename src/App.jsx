import React, { useState, useCallback, useEffect } from 'react';
import { QUESTIONS, TOTAL_STEPS } from './data/questions.js';
import Header from './components/Header.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import QuestionScreen from './components/QuestionScreen.jsx';
import PauseScreen from './components/PauseScreen.jsx';
import OfferScreen from './components/OfferScreen.jsx';
import EmailGate from './components/EmailGate.jsx';
import { trackQuizStarted, trackStep, trackEmailGateViewed, trackEmailCaptured } from './lib/track.js';

const SELECT_DELAY_MS = 170;

export default function App() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState('email'); // email | quiz | pause | offer
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [sel, setSel] = useState(null);
  const [pause, setPause] = useState({ kind: 'pain', step: 3 });

  const isEmail = screen === 'email';
  const isQuiz = screen === 'quiz';
  const isPause = screen === 'pause';
  const isOffer = screen === 'offer';

  useEffect(() => {
    if (isEmail) trackEmailGateViewed();
  }, [isEmail]);

  // TODO: send `address` to the owned-list endpoint.
  // Unknown in this repo — no Klaviyo key, API route, or env.
  // smile.klyrosdental.com posts /api/quiz-lead; that route is not here.
  // Do not hardcode secrets. Email stays in component state only.
  const continueFromEmail = useCallback((address) => {
    setEmail(address);
    trackEmailCaptured();
    trackQuizStarted();
    setScreen('quiz');
  }, []);

  const flagged =
    answers.extraction === 'yes' || answers.pain === 'yes' || answers.loose === 'yes';

  const advance = useCallback((stepIndex, value) => {
    const q = QUESTIONS[stepIndex];
    if (value === 'yes' && q.pauseKind) {
      setPause({ kind: q.pauseKind, step: stepIndex });
      setScreen('pause');
      setSel(null);
      return;
    }
    if (stepIndex >= QUESTIONS.length - 1) {
      setScreen('offer');
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
    if (isOffer) {
      setScreen('quiz');
      setStep(QUESTIONS.length - 1);
    } else if (isPause) {
      setScreen('quiz');
      setStep(pause.step);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }, [isOffer, isPause, pause.step, step]);

  const restart = useCallback(() => {
    setStep(0);
    setScreen('quiz');
    setAnswers({});
    setSel(null);
    setPause({ kind: 'pain', step: 3 });
  }, []);

  const stepNum = isQuiz ? step + 1 : isPause ? pause.step + 1 : TOTAL_STEPS;
  const progress = isOffer ? 100 : Math.round((stepNum / TOTAL_STEPS) * 100);

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
          showBack={!(isEmail || (isQuiz && step === 0))}
          onBack={goBack}
          stepLabel={`Step ${stepNum} of ${TOTAL_STEPS}`}
          chrome={
            isEmail ? 'Quick case check' : isOffer ? 'Quick case check · Step 6 of 6' : undefined
          }
        />
        {!isEmail && <ProgressBar progress={progress} />}

        {isEmail && <EmailGate onContinue={continueFromEmail} />}
        {isQuiz && (
          <QuestionScreen question={QUESTIONS[step]} sel={sel} onPick={pick} />
        )}
        {isPause && <PauseScreen kind={pause.kind} onRestart={restart} />}
        {isOffer && <OfferScreen answers={answers} flagged={flagged} />}
      </div>
    </div>
  );
}
