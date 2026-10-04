import React, { useState, useMemo } from "react";
import { WORDS_DATABASE, CATEGORIES, Category, CATEGORY_ICONS, WordItem } from "../data/words";
import { AudioListenButton } from "./AudioListenButton";
import { playTileClickSound, EnglishAccent } from "../utils/audio";
import { ArrowLeft, ArrowRight, Shuffle, BookOpen, Volume2, Sparkles } from "lucide-react";
import { unlockAchievement } from "../utils/storage";

interface PracticeModeProps {
  isMuted: boolean;
  accent: EnglishAccent;
  onBackToMenu: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  isMuted,
  accent,
  onBackToMenu,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Animals");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Filter words by selected category
  const words = useMemo(() => {
    return WORDS_DATABASE.filter((w) => w.category === selectedCategory);
  }, [selectedCategory]);

  const currentWord: WordItem | undefined = words[currentIndex] || words[0];

  const handleNextWord = () => {
    playTileClickSound();
    setCurrentIndex((prev) => (prev + 1) % words.length);
    const newCount = reviewedCount + 1;
    setReviewedCount(newCount);
    if (newCount >= 5) {
      unlockAchievement("practice_pro");
    }
  };

  const handlePrevWord = () => {
    playTileClickSound();
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleSelectCategory = (cat: Category) => {
    playTileClickSound();
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-pop">
      {/* Top Bar with Back Button */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onBackToMenu();
          }}
          className="btn-tactile-sm flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-300 cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
          <BookOpen size={14} />
          <span>PRACTICE MODE (No Scores)</span>
        </div>
      </div>

      {/* Category Horizontal Selector */}
      <div className="w-full mb-4 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelectCategory(cat)}
              className={`btn-tactile-sm px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border flex items-center gap-1 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Word Flashcard */}
      {currentWord && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 text-center relative mb-5">
          {/* Category Tag & Year */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              {CATEGORY_ICONS[currentWord.category]} {currentWord.category}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Word {currentIndex + 1} of {words.length}
            </span>
          </div>

          {/* Large Emoji Picture */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-300 flex items-center justify-center text-6xl sm:text-7xl shadow-inner mb-4 transition-transform hover:scale-105 duration-200">
            {currentWord.emoji}
          </div>

          {/* Word in Large Clear Uppercase */}
          <h2 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-widest uppercase mb-1">
            {currentWord.word}
          </h2>

          <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-black border border-blue-200 mb-3">
            Year {currentWord.year} Vocabulary
          </div>

          {/* Meaning / Hint */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-slate-700 font-bold text-sm max-w-md mx-auto mb-4">
            <p className="italic">"{currentWord.hint}"</p>
          </div>

          {/* Audio Button */}
          <div className="flex justify-center">
            <AudioListenButton
              word={currentWord.word}
              isMuted={isMuted}
              accent={accent}
              size="lg"
              label="LISTEN"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons: Previous & Next */}
      <div className="w-full flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrevWord}
          className="btn-tactile flex-1 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-base border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <ArrowLeft size={18} />
          <span>PREVIOUS</span>
        </button>

        <button
          type="button"
          onClick={handleNextWord}
          className="btn-tactile flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base border-2 border-amber-500 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>NEXT WORD</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
