/**
 * Audio Engine: Web Speech API for English Pronunciation + Web Audio API for Sound Effects
 * Supports US (🇺🇸) and UK (🇬🇧) accents with graceful fallback.
 * Safe, offline-ready, zero external audio asset dependencies.
 */

export type EnglishAccent = "US" | "UK";

let isAudioMuted = false;
let currentAccent: EnglishAccent = "US";

// AudioContext singleton for synthesised sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Configure mute state
 */
export function setAudioMuted(muted: boolean) {
  isAudioMuted = muted;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("spelling_game_muted", muted ? "true" : "false");
    } catch {
      // ignore
    }
  }
}

export function getAudioMuted(): boolean {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("spelling_game_muted");
      if (saved !== null) {
        isAudioMuted = saved === "true";
      }
    } catch {
      // ignore
    }
  }
  return isAudioMuted;
}

/**
 * Accent Configuration (US vs UK)
 */
export function setEnglishAccent(accent: EnglishAccent) {
  currentAccent = accent;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("spelling_game_accent", accent);
    } catch {
      // ignore
    }
  }
}

export function getEnglishAccent(): EnglishAccent {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("spelling_game_accent");
      if (saved === "UK" || saved === "US") {
        currentAccent = saved;
      }
    } catch {
      // ignore
    }
  }
  return currentAccent;
}

/**
 * Pronounce an English word using Web Speech API.
 * Ensures proper English voice selection (en-US or en-GB, never Indonesian).
 */
export function speakEnglishWord(
  word: string,
  options: { rate?: number; pitch?: number; accent?: EnglishAccent } = {}
): Promise<void> {
  return new Promise((resolve) => {
    if (isAudioMuted) {
      resolve();
      return;
    }

    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !window.SpeechSynthesisUtterance
    ) {
      // Speech synthesis not supported; resolve safely so game continues smoothly
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const accent = options.accent ?? currentAccent;
      const targetLang = accent === "UK" ? "en-GB" : "en-US";

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = targetLang;
      utterance.rate = options.rate ?? 0.88; // Slightly deliberate for primary school students
      utterance.pitch = options.pitch ?? 1.05;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // First try to match target accent (UK or US)
        let matchedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith(targetLang.toLowerCase()) &&
            (v.name.includes("Google") ||
              v.name.includes("Natural") ||
              v.name.includes("Daniel") ||
              v.name.includes("Samantha") ||
              v.name.includes("Oliver") ||
              v.name.includes("George") ||
              v.name.includes("Arthur"))
        );

        if (!matchedVoice) {
          matchedVoice = voices.find((v) =>
            v.lang.toLowerCase().startsWith(targetLang.toLowerCase())
          );
        }

        // Graceful fallback: any English voice available
        if (!matchedVoice) {
          matchedVoice =
            voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ||
            voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ||
            voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      // Timeout safety fallback: some browser engines stall callbacks
      const timer = setTimeout(() => {
        resolve();
      }, 3500);

      utterance.onend = () => {
        clearTimeout(timer);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * Preload speech synthesis voices
 */
export function initSpeechVoices() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Sound Effect: Correct answer (cheerful rising arpeggio C5 -> E5 -> G5 -> C6)
 */
export function playCorrectSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  } catch {
    // ignore
  }
}

/**
 * Sound Effect: Streak bonus chime (triumphant double chime)
 */
export function playStreakSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [659.25, 880, 1174.66, 1318.5]; // E5, A5, D6, E6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.46);
    });
  } catch {
    // ignore
  }
}

/**
 * Sound Effect: Wrong answer / Lose Life (gentle descending tone)
 */
export function playWrongSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  } catch {
    // ignore
  }
}

/**
 * Sound Effect: Out of Lives / Time's Up
 */
export function playOutOfLivesSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [340, 280, 220, 160];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.12, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.22);
    });
  } catch {
    // ignore
  }
}

/**
 * Sound Effect: Button / Tile tap
 */
export function playTileClickSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // ignore
  }
}

/**
 * Sound Effect: Backspace / Remove letter
 */
export function playRemoveSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // ignore
  }
}

/**
 * Sound Effect: Level Complete victory fanfare
 */
export function playWinFanfare() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 },
      { f: 523.25, t: 0.16, d: 0.15 },
      { f: 523.25, t: 0.32, d: 0.15 },
      { f: 659.25, t: 0.48, d: 0.35 },
      { f: 783.99, t: 0.85, d: 0.2 },
      { f: 1046.5, t: 1.08, d: 0.6 },
    ];

    const now = ctx.currentTime;
    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.24, now + t);
      gain.gain.exponentialRampToValueAtTime(0.005, now + t + d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + d + 0.05);
    });
  } catch {
    // ignore
  }
}
