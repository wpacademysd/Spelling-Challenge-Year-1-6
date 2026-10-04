import React from "react";
import { Trophy, Flame, Heart, Timer } from "lucide-react";
import { YearLevel } from "../data/words";

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  level: "EASY" | "MEDIUM" | "HARD";
  year: YearLevel;
  category?: string;
  lives: number;
  maxLives: number;
  streak: number;
  timerMode: boolean;
  timeLeft: number;
  maxTime: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  score,
  level,
  year,
  category,
  lives,
  maxLives,
  streak,
  timerMode,
  timeLeft,
  maxTime,
}) => {
  const currentQuestionNumber = Math.min(currentIndex + 1, totalQuestions);
  const percentage = Math.min(
    100,
    Math.round((currentQuestionNumber / totalQuestions) * 100)
  );

  const levelColors = {
    EASY: "bg-emerald-500 text-white border-emerald-600",
    MEDIUM: "bg-amber-500 text-white border-amber-600",
    HARD: "bg-rose-500 text-white border-rose-600",
  }[level];

  const timerRatio = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const isTimerLow = timeLeft <= 5;

  return (
    <div className="w-full bg-white rounded-3xl p-3.5 sm:p-4 shadow-md border-2 border-amber-200">
      {/* Top Indicators: Question & Badges, Lives & Streak, Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        {/* Left: Question + Year + Level */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
            Q <span className="text-amber-600 font-extrabold">{currentQuestionNumber}</span>/{totalQuestions}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-black bg-blue-100 text-blue-800 border border-blue-200">
            Year {year}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black border uppercase tracking-wider ${levelColors}`}
          >
            {level}
          </span>
        </div>

        {/* Center: Lives ❤️ and Streak 🔥 */}
        <div className="flex items-center gap-2">
          {/* 3 Lives */}
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-rose-50 border border-rose-200">
            {Array.from({ length: maxLives }).map((_, idx) => {
              const hasLife = idx < lives;
              return (
                <Heart
                  key={idx}
                  size={18}
                  className={
                    hasLife
                      ? "text-rose-500 fill-rose-500 transition-transform scale-100"
                      : "text-slate-300 fill-slate-200 scale-90"
                  }
                />
              );
            })}
          </div>

          {/* Streak Counter */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
              streak >= 3
                ? "bg-orange-500 text-white shadow-xs animate-bounce"
                : "bg-orange-50 text-orange-800 border border-orange-200"
            }`}
          >
            <Flame size={16} className={streak >= 3 ? "text-yellow-200 fill-yellow-200" : "text-orange-500"} />
            <span>Streak: {streak}</span>
          </div>
        </div>

        {/* Right: Score */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 shrink-0">
          <Trophy size={16} className="text-amber-600" />
          <span className="text-xs sm:text-sm font-black text-amber-950">
            Score: <span className="text-sm sm:text-base font-black text-amber-700">{score}</span>
          </span>
        </div>
      </div>

      {/* Main Question Progress Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner relative mb-2">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 rounded-full transition-all duration-400 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Timer Countdown Bar (Only in TIME CHALLENGE mode) */}
      {timerMode && (
        <div className="pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-black mb-1">
            <span className={`flex items-center gap-1 ${isTimerLow ? "text-rose-600 animate-pulse" : "text-slate-600"}`}>
              <Timer size={14} />
              <span>Time Left: {timeLeft}s</span>
            </span>
            {isTimerLow && (
              <span className="text-[10px] text-rose-500 font-extrabold uppercase animate-pulse">
                Hurry up! ⏳
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                isTimerLow ? "bg-rose-500" : "bg-sky-500"
              }`}
              style={{ width: `${timerRatio}%` }}
            />
          </div>
        </div>
      )}

      {category && !timerMode && (
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mt-1">
          <span>Category: <strong className="text-amber-800">{category}</strong></span>
          <span>Target: 100+ pts</span>
        </div>
      )}
    </div>
  );
};
