/**
 * English Spelling Challenge - Reseller Configuration
 * Easily change branding, game title, and features here.
 */

export const GAME_CONFIG = {
  // Required reseller fields
  gameTitle: "English Spelling Challenge",
  brandName: "WPACADEMY",
  footerText: "Powered by WPACADEMY SYAZWANDANIIAL",
  primaryLanguage: "English",
  enableYearMode: true,
  enableDailyChallenge: true,
  enableTimer: true,
  enableAchievements: true,

  // Legacy & uppercase aliases
  GAME_TITLE: "ENGLISH SPELLING CHALLENGE",
  TAGLINE: "Learn • Listen • Spell • Play",
  BRAND_NAME: "WPACADEMY",
  FOOTER_TEXT: "Powered by WPACADEMY SYAZWANDANIIAL",

  // Game rules
  QUESTIONS_PER_SESSION: 10,
  POINTS_PER_CORRECT: 10,
  MAX_SCORE: 100,
  TOTAL_LIVES: 3,
  TIMER_SECONDS: 20,

  // Streak bonuses
  STREAK_BONUSES: {
    3: 5,
    5: 10,
    10: 20,
  } as Record<number, number>,

  // Star ratings
  STARS: {
    THREE: { min: 90, label: "Superstar Speller! 🏆", stars: 3 },
    TWO: { min: 70, label: "Great Job! Keep going! 🌟", stars: 2 },
    ONE: { min: 0, label: "Good Effort! Practice makes perfect! 👍", stars: 1 },
  },
};
