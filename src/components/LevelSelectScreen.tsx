import React from "react";
import { Play, Check, ArrowLeft, Timer, Flame, BookOpen } from "lucide-react";
import { CATEGORIES, Category, CATEGORY_ICONS, YearLevel } from "../data/words";
import { playTileClickSound } from "../utils/audio";

interface LevelSelectScreenProps {
  currentYear: YearLevel;
  currentLevel: "EASY" | "MEDIUM" | "HARD";
  currentCategory: "ALL" | Category;
  timerMode: boolean;
  onSelectYear: (year: YearLevel) => void;
  onSelectLevel: (level: "EASY" | "MEDIUM" | "HARD") => void;
  onSelectCategory: (category: "ALL" | Category) => void;
  onToggleTimerMode: (enabled: boolean) => void;
  onStartGame: () => void;
  onBackToMenu: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  currentYear,
  currentLevel,
  currentCategory,
  timerMode,
  onSelectYear,
  onSelectLevel,
  onSelectCategory,
  onToggleTimerMode,
  onStartGame,
  onBackToMenu,
}) => {
  const years: { year: YearLevel; label: string; desc: string; sample: string }[] = [
    { year: 1, label: "YEAR 1", desc: "Short & very basic", sample: "cat, dog, sun, hat, bus" },
    { year: 2, label: "YEAR 2", desc: "Easy, slightly longer", sample: "apple, rabbit, pencil, chair" },
    { year: 3, label: "YEAR 3", desc: "Intermediate words", sample: "banana, window, teacher, kitchen" },
    { year: 4, label: "YEAR 4", desc: "More challenging", sample: "bicycle, library, hospital, breakfast" },
    { year: 5, label: "YEAR 5", desc: "Complex spellings", sample: "different, important, restaurant" },
    { year: 6, label: "YEAR 6", desc: "Advanced primary", sample: "knowledge, necessary, education" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-pop">
      {/* Back button */}
      <div className="w-full flex justify-start mb-3">
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onBackToMenu();
          }}
          className="btn-tactile-sm flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-300 cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
          CUSTOMIZE YOUR CHALLENGE
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-800">
          Choose your Year, Difficulty, and Mode
        </p>
      </div>

      {/* 1. YEAR SELECTOR (YEAR 1 - YEAR 6) */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md mb-4">
        <span className="text-xs font-black uppercase tracking-wider text-amber-950 block text-center mb-3">
          1. CHOOSE PRIMARY YEAR (TAHUN 1–6)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {years.map((y) => {
            const isSelected = currentYear === y.year;
            return (
              <button
                key={y.year}
                type="button"
                onClick={() => {
                  playTileClickSound();
                  onSelectYear(y.year);
                }}
                className={`btn-tactile p-3 rounded-2xl text-left border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-600 shadow-md scale-[1.02]"
                    : "bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm sm:text-base tracking-wide">{y.label}</span>
                  {isSelected && <Check size={16} className="text-white" />}
                </div>
                <p className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                  {y.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DIFFICULTY LEVEL (EASY, MEDIUM, HARD) */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md mb-4">
        <span className="text-xs font-black uppercase tracking-wider text-amber-950 block text-center mb-3">
          2. CHOOSE DIFFICULTY LEVEL
        </span>

        <div className="space-y-2.5">
          {/* EASY */}
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onSelectLevel("EASY");
            }}
            className={`btn-tactile w-full p-3.5 rounded-2xl text-left border-2 cursor-pointer transition-all flex items-center justify-between ${
              currentLevel === "EASY"
                ? "bg-emerald-50 border-emerald-500 ring-3 ring-emerald-200 shadow-sm"
                : "bg-slate-50 border-slate-200 hover:bg-emerald-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟢</span>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">EASY</h4>
                <p className="text-[11px] font-bold text-slate-600">
                  Picture + Audio + 4 spelling choices. Pick the right one!
                </p>
              </div>
            </div>
            {currentLevel === "EASY" && <Check size={18} className="text-emerald-600" />}
          </button>

          {/* MEDIUM */}
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onSelectLevel("MEDIUM");
            }}
            className={`btn-tactile w-full p-3.5 rounded-2xl text-left border-2 cursor-pointer transition-all flex items-center justify-between ${
              currentLevel === "MEDIUM"
                ? "bg-amber-50 border-amber-500 ring-3 ring-amber-200 shadow-sm"
                : "bg-slate-50 border-slate-200 hover:bg-amber-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟡</span>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">MEDIUM</h4>
                <p className="text-[11px] font-bold text-slate-600">
                  Picture + Audio + Scrambled letters. Tap tiles in order!
                </p>
              </div>
            </div>
            {currentLevel === "MEDIUM" && <Check size={18} className="text-amber-600" />}
          </button>

          {/* HARD */}
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onSelectLevel("HARD");
            }}
            className={`btn-tactile w-full p-3.5 rounded-2xl text-left border-2 cursor-pointer transition-all flex items-center justify-between ${
              currentLevel === "HARD"
                ? "bg-rose-50 border-rose-500 ring-3 ring-rose-200 shadow-sm"
                : "bg-slate-50 border-slate-200 hover:bg-rose-50/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">HARD</h4>
                <p className="text-[11px] font-bold text-slate-600">
                  Audio ONLY! No picture shown. Type the correct spelling!
                </p>
              </div>
            </div>
            {currentLevel === "HARD" && <Check size={18} className="text-rose-600" />}
          </button>
        </div>
      </div>

      {/* 3. TIMER MODE: NORMAL VS TIME CHALLENGE */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md mb-4">
        <span className="text-xs font-black uppercase tracking-wider text-amber-950 block text-center mb-3">
          3. TIMER MODE
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onToggleTimerMode(false);
            }}
            className={`btn-tactile p-3 rounded-2xl text-center border-2 cursor-pointer ${
              !timerMode
                ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <span className="text-xl block mb-1">🧘</span>
            <span className="font-black text-xs sm:text-sm block">NORMAL MODE</span>
            <span className="text-[10px] block opacity-85">No timer pressure</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onToggleTimerMode(true);
            }}
            className={`btn-tactile p-3 rounded-2xl text-center border-2 cursor-pointer ${
              timerMode
                ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <span className="text-xl block mb-1">⏱️</span>
            <span className="font-black text-xs sm:text-sm block">TIME CHALLENGE</span>
            <span className="text-[10px] block opacity-85">20 seconds / question</span>
          </button>
        </div>
      </div>

      {/* 4. WORD CATEGORY (OR ALL) */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-md mb-6">
        <span className="text-xs font-black uppercase tracking-wider text-slate-600 block text-center mb-2.5">
          4. CATEGORY (OPTIONAL)
        </span>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onSelectCategory("ALL");
            }}
            className={`btn-tactile-sm px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border ${
              currentCategory === "ALL"
                ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            🌟 All Categories (Mix)
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playTileClickSound();
                onSelectCategory(cat);
              }}
              className={`btn-tactile-sm px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer border ${
                currentCategory === cat
                  ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span className="ml-0.5">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={() => {
          playTileClickSound();
          onStartGame();
        }}
        className="btn-tactile w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl tracking-wider border-2 border-emerald-600 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        <Play size={22} className="fill-white" />
        <span>START PLAYING (Year {currentYear} • {currentLevel}) ➔</span>
      </button>
    </div>
  );
};
