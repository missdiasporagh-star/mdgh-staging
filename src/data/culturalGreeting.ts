export const culturalGreeting = {
  enabled: true,
  word: 'Akwaaba',
  subtitle: 'Welcome home',
  backgroundImage: '', // add path to image in public/ when ready, e.g. '/cycles/2026/greeting-bg.jpg'
  audio: '', // add path to audio in public/ when ready
  audioCaption: 'Tap to hear our greeting',
  durationMs: 4000,
  skipLabel: 'Skip',
} as const;

export type CulturalGreetingConfig = typeof culturalGreeting;
