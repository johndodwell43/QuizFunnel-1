// The quiz, in order. A "yes" on extraction / pain / loose routes to the pause screen.
export const QUESTIONS = [
  {
    key: 'arch',
    label: 'Q1 Arch',
    title: 'Where are your missing teeth?',
    sub: "A few quick questions. We pass your answers to a licensed dentist in our network, and they decide what's right for you.",
    opts: [['Upper teeth only', 'upper'], ['Lower teeth only', 'lower'], ['Both upper and lower', 'both']]
  },
  {
    key: 'teeth',
    label: 'Q2 Teeth count',
    title: 'About how many teeth are you missing?',
    sub: 'Your best guess is fine. Skip teeth with crowns or bridges.',
    opts: [['1 tooth', '1'], ['2 or 3 teeth', '2-3'], ['4 to 6 teeth', '4-6'], ['All or most of my teeth', 'most']]
  },
  {
    key: 'extraction',
    label: 'Q3 Extraction',
    title: 'Have you had a tooth removed in the last 90 days?',
    sub: '',
    opts: [['No', 'no'], ['Yes', 'yes']],
    pauseKind: 'healing'
  },
  {
    key: 'pain',
    label: 'Q4 Pain',
    title: 'Are you experiencing tooth pain or swelling?',
    sub: 'Dentists in our network ask about this before they take on a case.',
    opts: [['No, I feel fine', 'no'], ['Yes, I have pain or swelling', 'yes']],
    pauseKind: 'pain'
  },
  {
    key: 'loose',
    label: 'Q5 Loose teeth',
    title: 'Do you have any loose or shifting teeth?',
    sub: 'Dentists in our network ask about this before they take on a case.',
    opts: [['No, my teeth feel stable', 'no'], ['Yes, some teeth feel loose', 'yes']],
    pauseKind: 'loose'
  }
];

export const TOTAL_STEPS = QUESTIONS.length + 1; // questions + offer
