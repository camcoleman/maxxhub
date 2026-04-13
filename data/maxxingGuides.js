export const MAXXING_CATEGORIES = [
  {
    id: 'looksmaxxing',
    title: 'Looksmaxxing',
    subtitle: 'Upgrade appearance and grooming',
    steps: [
      'Keep a consistent grooming routine: haircut, skincare, and hygiene.',
      'Wear fitted basics in clean color palettes and keep shoes fresh.',
      'Prioritize posture, hydration, and sunlight for a healthier baseline.',
      'Track photos weekly to spot what style and habits improve your look.',
    ],
  },
  {
    id: 'gymmaxxing',
    title: 'Gymmaxxing',
    subtitle: 'Build strength, muscle, and discipline',
    steps: [
      'Follow a simple program with progressive overload 3-5 days per week.',
      'Hit protein targets daily and fuel workouts with whole foods.',
      'Sleep 7-9 hours so training adaptations and recovery can happen.',
      'Log lifts and body metrics each week, then adjust with intent.',
    ],
  },
  {
    id: 'wealthmaxxing',
    title: 'Wealthmaxxing',
    subtitle: 'Increase income and financial control',
    steps: [
      'Set a weekly deep-work block focused on your highest-value skill.',
      'Build one monetizable project, service, or offer and ship it quickly.',
      'Use a simple budget with automatic saving and emergency-fund targets.',
      'Review spending and revenue every Sunday to tighten weak spots.',
    ],
  },
  {
    id: 'rizzmaxxing',
    title: 'Rizzmaxxing',
    subtitle: 'Level up confidence and social presence',
    steps: [
      'Practice warm eye contact, clear speech, and relaxed body language.',
      'Start one conversation daily with curiosity-first questions.',
      'Listen actively, mirror energy naturally, and avoid over-talking.',
      'Reflect after social interactions to improve timing, tone, and presence.',
    ],
  },
  {
    id: 'sleepmaxxing',
    title: 'Sleepmaxxing',
    subtitle: 'Recover hard and protect your energy',
    steps: [
      'Lock in a fixed sleep and wake time, even on weekends.',
      'Cut caffeine 8+ hours before bed and dim screens at night.',
      'Keep your room cool, dark, and quiet to improve sleep quality.',
      'Use a wind-down routine: stretch, journal, and plan tomorrow.',
    ],
  },
];

export const MAXXING_GUIDES = MAXXING_CATEGORIES.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {});
