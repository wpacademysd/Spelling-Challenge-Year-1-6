import React from "react";
import {
  Play,
  Sliders,
  HelpCircle,
  Calendar,
  BookOpen,
  BarChart3,
  Award,
} from "lucide-react";
import { GAME_CONFIG } from "../config";
import { playTileClickSound } from "../utils/audio";
import { YearLevel } from "../data/words";
import { isDailyChallengeCompletedToday } from "../utils/storage";

interface MainMenuProps {
  currentYear: YearLevel;
  currentLevel: "EASY" | "MEDIUM" | "HARD";
  timerMode: boolean;
  onStartGame: () => void;
  onOpenSelectLevel: () => void;
  onOpenHowToPlay: () => void;
  onOpenDailyChallenge: () => void;
  onOpenPracticeMode: () => void;
  onOpenProgress: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  currentYear,
  currentLevel,
  timerMode,
  onStartGame,
  onOpenSelectLevel,
  onOpenHowToPlay,
  onOpenDailyChallenge,
  onOpenPracticeMode,
  onOpenProgress,
}) => {
  const isDailyDone = isDailyChallengeCompletedToday();

  const levelBadges = {
    EASY: { label: "EASY", color: "bg-emerald-100 text-emerald-800 border-emerald-300", emoji: "🟢" },
    MEDIUM: { label: "MEDIUM", color: "bg-amber-100 text-amber-900 border-amber-300", emoji: "🟡" },
    HARD: { label: "HARD", color: "bg-rose-100 text-rose-900 border-rose-300", emoji: "🔴" },
  }[currentLevel];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center animate-pop">
      {/* Floating Emojis Mascot Badge */}
      <div className="relative mb-3 select-none">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-4 border-amber-500 shadow-xl flex items-center justify-center text-5xl sm:text-6xl transform hover:rotate-3 transition-transform">
          🏆
        </div>
        <div className="absolute -top-2 -left-2 text-2xl animate-bounce">
          🍎
        </div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce delay-100">
          🐱
        </div>
        <div className="absolute -bottom-1 -left-3 text-2xl animate-pulse">
          ✏️
        </div>
        <div className="absolute -bottom-1 -right-3 text-2xl animate-pulse delay-75">
          ⭐
        </div>
      </div>

      {/* Main Title as requested */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight leading-tight mb-1.5 drop-shadow-xs">
        {GAME_CONFIG.gameTitle}
      </h1>

      {/* Tagline as requested */}
      <p className="text-sm sm:text-base font-black text-amber-800 tracking-wide mb-4">
        {GAME_CONFIG.TAGLINE}
      </p>

      {/* Active Settings Pill */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => {
            playTileClickSound();
            onOpenSelectLevel();
          }}
          className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1 cursor-pointer hover:bg-blue-200"
        >
          <span>📘 Year {currentYear}</span>
        </button>

        <button
          onClick={() => {
            playTileClickSound();
            onOpenSelectLevel();
          }}
          className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1 cursor-pointer hover:opacity-90 ${levelBadges.color}`}
        >
          <span>{levelBadges.emoji}</span>
          <span>{levelBadges.label}</span>
          <span className="text-[10px] underline ml-0.5 text-slate-500">Change</span>
        </button>

        {timerMode && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1">
            <span>⏱️ Time Mode</span>
          </span>
        )}
      </div>

      {/* Main 3 Action Buttons requested in prompt: START GAME, SELECT LEVEL, HOW TO PLAY */}
      <div className="w-full space-y-3 mb-5">
        {/* 1. START GAME */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onStartGame();
          }}
          className="btn-tactile w-full py-4 sm:py-4.5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl sm:text-2xl tracking-wider border-3 border-emerald-600 flex items-center justify-center gap-3 shadow-xl cursor-pointer"
        >
          <Play size={26} className="fill-white" />
          <span>START GAME</span>
        </button>

        {/* 2. SELECT LEVEL */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onOpenSelectLevel();
          }}
          className="btn-tactile w-full py-3.5 rounded-3xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base sm:text-lg tracking-wider border-3 border-amber-500 flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Sliders size={20} className="text-amber-900" />
          <span>SELECT LEVEL & YEAR</span>
        </button>

        {/* 3. HOW TO PLAY */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onOpenHowToPlay();
          }}
          className="btn-tactile w-full py-3 rounded-3xl bg-white hover:bg-amber-50 text-slate-800 font-extrabold text-base tracking-wider border-2 border-amber-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <HelpCircle size={20} className="text-amber-600" />
          <span>HOW TO PLAY</span>
        </button>
      </div>

      {/* Upgraded Feature Modes: Daily Challenge, Practice Mode, My Progress */}
      <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-black text-slate-700 mb-2">
        {/* Daily Challenge Button */}
        {GAME_CONFIG.enableDailyChallenge && (
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onOpenDailyChallenge();
            }}
            className="btn-tactile-sm p-2.5 rounded-2xl bg-amber-100/90 hover:bg-amber-200/90 text-amber-950 border border-amber-300 shadow-2xs cursor-pointer flex flex-col items-center justify-center"
          >
            <Calendar size={20} className="text-amber-700 mb-1" />
            <span className="leading-tight">Daily Challenge</span>
            {isDailyDone ? (
              <span className="text-[10px] text-emerald-700 font-extrabold mt-0.5">⭐ Done!</span>
            ) : (
              <span className="text-[10px] text-amber-800 font-bold mt-0.5">10 Words</span>
            )}
          </button>
        )}

        {/* Practice Mode */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onOpenPracticeMode();
          }}
          className="btn-tactile-sm p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs cursor-pointer flex flex-col items-center justify-center"
        >
          <BookOpen size={20} className="text-emerald-700 mb-1" />
          <span className="leading-tight">Practice Mode</span>
          <span className="text-[10px] text-emerald-800 font-bold mt-0.5">No Scores</span>
        </button>

        {/* My Progress */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onOpenProgress();
          }}
          className="btn-tactile-sm p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs cursor-pointer flex flex-col items-center justify-center"
        >
          <BarChart3 size={20} className="text-purple-700 mb-1" />
          <span className="leading-tight">My Progress</span>
          <span className="text-[10px] text-purple-800 font-bold mt-0.5">Stats & Badges</span>
        </button>
      </div>
    </div>
  );
};
