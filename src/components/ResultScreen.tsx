import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { WordItem, YearLevel } from "../data/words";
import { playWinFanfare, playTileClickSound, EnglishAccent } from "../utils/audio";
import { AudioListenButton } from "./AudioListenButton";
import {
  RotateCcw,
  Home,
  Sliders,
  Trophy,
  Star,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  BarChart3,
  Calendar,
} from "lucide-react";
import { GAME_CONFIG } from "../config";
import { Achievement } from "../utils/storage";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  bestStreak: number;
  timeFormatted: string; // e.g. "2:35"
  level: "EASY" | "MEDIUM" | "HARD";
  year: YearLevel;
  sessionWords: WordItem[];
  isMuted: boolean;
  accent: EnglishAccent;
  newlyUnlockedAchievement?: Achievement | null;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onChangeYear: () => void;
  onOpenProgress: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  correctCount,
  bestStreak,
  timeFormatted,
  level,
  year,
  sessionWords,
  isMuted,
  accent,
  newlyUnlockedAchievement,
  onPlayAgain,
  onNextLevel,
  onChangeYear,
  onOpenProgress,
  onGoHome,
}) => {
  const maxBaseScore = totalQuestions * GAME_CONFIG.POINTS_PER_CORRECT;

  // Star ratings based on prompt:
  // 90–100 = ⭐⭐⭐
  // 70–89 = ⭐⭐
  // Below 70 = ⭐
  let starCount = 1;
  let feedbackText = GAME_CONFIG.STARS.ONE.label;
  if (score >= 90) {
    starCount = 3;
    feedbackText = GAME_CONFIG.STARS.THREE.label;
  } else if (score >= 70) {
    starCount = 2;
    feedbackText = GAME_CONFIG.STARS.TWO.label;
  }

  useEffect(() => {
    playWinFanfare();

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });

      if (score >= 70) {
        setTimeout(() => {
          confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
        }, 300);
      }
    } catch {
      // ignore
    }
  }, [score]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-pop">
      {/* Celebration Main Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden mb-5">
        {/* Top Trophy */}
        <div className="w-18 h-18 mx-auto rounded-3xl bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-amber-600 mb-2 shadow-md animate-bounce">
          <Trophy size={40} />
        </div>

        {/* Title from prompt: GREAT JOB! */}
        <h2 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight mb-1">
          GREAT JOB!
        </h2>
        <p className="text-amber-800 font-bold text-xs sm:text-sm mb-3">
          Year {year} • {level} Mode Completed
        </p>

        {/* Rating Stars */}
        <div className="flex items-center justify-center gap-2.5 my-3">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= starCount;
            return (
              <div
                key={starIndex}
                className={`transition-all duration-300 ${
                  isEarned ? "scale-110 animate-star" : "opacity-30 grayscale"
                }`}
              >
                <Star
                  size={starIndex === 2 ? 46 : 38}
                  className={
                    isEarned
                      ? "text-amber-400 fill-amber-400 drop-shadow-md"
                      : "text-slate-300 fill-slate-300"
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Score & Detailed Stats Box as requested */}
        <div className="my-4 p-4 rounded-3xl bg-amber-50/80 border-2 border-amber-200 max-w-sm mx-auto">
          {/* Main Score */}
          <div className="mb-2">
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
              Final Score
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight">
              {score} <span className="text-lg text-amber-600">/ {maxBaseScore}</span>
            </div>
            <p className="text-xs font-bold text-amber-800 mt-0.5">{feedbackText}</p>
          </div>

          {/* Correct, Best Streak, Time Breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-amber-200/80 text-center">
            <div className="p-1.5 rounded-xl bg-white border border-amber-100">
              <span className="text-[10px] font-bold text-slate-500 block">Correct</span>
              <span className="text-sm font-black text-emerald-700">
                {correctCount} / {totalQuestions}
              </span>
            </div>

            <div className="p-1.5 rounded-xl bg-white border border-amber-100">
              <span className="text-[10px] font-bold text-slate-500 block">Best Streak</span>
              <span className="text-sm font-black text-orange-600 flex items-center justify-center gap-0.5">
                <Flame size={13} className="fill-orange-500 text-orange-500" />
                <span>{bestStreak}</span>
              </span>
            </div>

            <div className="p-1.5 rounded-xl bg-white border border-amber-100">
              <span className="text-[10px] font-bold text-slate-500 block">Time</span>
              <span className="text-sm font-black text-slate-800 flex items-center justify-center gap-0.5">
                <Clock size={13} className="text-slate-500" />
                <span>{timeFormatted}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Newly Unlocked Achievement Banner (if any) */}
        {newlyUnlockedAchievement && (
          <div className="animate-pop p-3 rounded-2xl bg-purple-50 border-2 border-purple-300 max-w-sm mx-auto mb-2 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
              Achievement Unlocked! 🎉
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5 font-black text-purple-950 text-sm">
              <span>{newlyUnlockedAchievement.icon}</span>
              <span>{newlyUnlockedAchievement.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Words in this session with audio */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-md mb-5">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider text-center mb-3">
          Review Session Words ({sessionWords.length})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {sessionWords.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-xl">{item.emoji}</span>
                <span className="font-black text-xs sm:text-sm text-slate-800 uppercase tracking-wide truncate">
                  {item.word}
                </span>
              </div>
              <AudioListenButton
                word={item.word}
                size="sm"
                isMuted={isMuted}
                accent={accent}
                label=""
                className="shrink-0 !p-1.5 !rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5 Requested Action Buttons: PLAY AGAIN, NEXT LEVEL, CHANGE YEAR, MY PROGRESS, HOME */}
      <div className="w-full space-y-2.5">
        {/* PLAY AGAIN */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onPlayAgain();
          }}
          className="btn-tactile w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base sm:text-lg tracking-wider border-2 border-emerald-600 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <RotateCcw size={20} />
          <span>PLAY AGAIN</span>
        </button>

        {/* NEXT LEVEL */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onNextLevel();
          }}
          className="btn-tactile w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm sm:text-base tracking-wider border-2 border-amber-500 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowRight size={18} />
          <span>NEXT LEVEL</span>
        </button>

        {/* CHANGE YEAR */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onChangeYear();
          }}
          className="btn-tactile w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-sm sm:text-base tracking-wider border-2 border-blue-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Sliders size={18} />
          <span>CHANGE YEAR</span>
        </button>

        <div className="flex gap-2.5">
          {/* MY PROGRESS */}
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onOpenProgress();
            }}
            className="btn-tactile-sm flex-1 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold text-xs sm:text-sm tracking-wider border-2 border-purple-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BarChart3 size={17} />
            <span>MY PROGRESS</span>
          </button>

          {/* HOME */}
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onGoHome();
            }}
            className="btn-tactile-sm flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm tracking-wider border-2 border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Home size={17} />
            <span>HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
