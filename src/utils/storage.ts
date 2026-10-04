/**
 * LocalStorage Data Manager for Stats, Achievements, Words to Practice, and Daily Challenges.
 * No login required, 100% frontend client-side.
 */

import { WordItem, WORDS_DATABASE } from "../data/words";

export interface UserStats {
  gamesPlayed: number;
  wordsCorrect: number;
  bestScore: number;
  bestStreak: number;
  dailyChallengesCompleted: number;
  practiceWordsCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: "first_win",
    title: "First Win",
    description: "Complete your first game.",
    icon: "🌟",
  },
  {
    id: "hot_streak",
    title: "Hot Streak",
    description: "Get 5 answers correct in a row.",
    icon: "🔥",
  },
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Score 100/100 in a game.",
    icon: "💯",
  },
  {
    id: "super_listener",
    title: "Super Listener",
    description: "Use audio for every question in a game session.",
    icon: "🎧",
  },
  {
    id: "spelling_champion",
    title: "Spelling Champion",
    description: "Complete Hard Mode with a passing score.",
    icon: "🏆",
  },
  {
    id: "daily_hero",
    title: "Daily Hero",
    description: "Complete a Daily Spelling Challenge.",
    icon: "🏅",
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Finish a Time Challenge game.",
    icon: "⚡",
  },
  {
    id: "practice_pro",
    title: "Practice Pro",
    description: "Study and review words in Practice Mode.",
    icon: "📚",
  },
];

const STATS_KEY = "spelling_game_stats";
const ACHIEVEMENTS_KEY = "spelling_game_achievements";
const WORDS_TO_PRACTICE_KEY = "spelling_game_words_to_practice";
const DAILY_COMPLETED_KEY = "spelling_game_daily_completed";

export function loadUserStats(): UserStats {
  if (typeof window === "undefined") {
    return {
      gamesPlayed: 0,
      wordsCorrect: 0,
      bestScore: 0,
      bestStreak: 0,
      dailyChallengesCompleted: 0,
      practiceWordsCount: 0,
    };
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    gamesPlayed: 0,
    wordsCorrect: 0,
    bestScore: 0,
    bestStreak: 0,
    dailyChallengesCompleted: 0,
    practiceWordsCount: 0,
  };
}

export function saveUserStats(stats: Partial<UserStats>) {
  if (typeof window === "undefined") return;
  try {
    const current = loadUserStats();
    const updated = { ...current, ...stats };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getUnlockedAchievementIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

/**
 * Checks and unlocks an achievement if not already earned.
 * Returns the unlocked achievement if it was newly unlocked, or null.
 */
export function unlockAchievement(achievementId: string): Achievement | null {
  if (typeof window === "undefined") return null;
  try {
    const current = getUnlockedAchievementIds();
    if (!current.includes(achievementId)) {
      const updated = [...current, achievementId];
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      const ach = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
      return ach || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getWordsToPractice(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WORDS_TO_PRACTICE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function addWordToPractice(wordId: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getWordsToPractice();
    if (!current.includes(wordId)) {
      const updated = [wordId, ...current].slice(0, 30); // keep up to 30 most recent
      localStorage.setItem(WORDS_TO_PRACTICE_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
}

export function removeWordFromPractice(wordId: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getWordsToPractice();
    const updated = current.filter((id) => id !== wordId);
    localStorage.setItem(WORDS_TO_PRACTICE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearWordsToPractice() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(WORDS_TO_PRACTICE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Daily challenge helpers based on device date YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDailyChallengeCompletedToday(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const lastDate = localStorage.getItem(DAILY_COMPLETED_KEY);
    return lastDate === getTodayDateString();
  } catch {
    return false;
  }
}

export function markDailyChallengeCompleted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const today = getTodayDateString();
    localStorage.setItem(DAILY_COMPLETED_KEY, today);

    // Increment stats
    const stats = loadUserStats();
    saveUserStats({
      dailyChallengesCompleted: stats.dailyChallengesCompleted + 1,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate deterministic 10 words for today's Daily Challenge
 */
export function getDailyChallengeWords(): WordItem[] {
  const today = getTodayDateString();
  // Simple deterministic pseudo-random hash from date string
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed = (seed * 31 + today.charCodeAt(i)) & 0xffffffff;
  }

  const pool = [...WORDS_DATABASE];
  const count = 10;
  const result: WordItem[] = [];

  // Deterministic shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const j = Math.floor(rnd * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}
