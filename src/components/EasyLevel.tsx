import React, { useState, useEffect, useMemo } from "react";
import { WordItem, CATEGORY_ICONS } from "../data/words";
import { AudioListenButton } from "./AudioListenButton";
import {
  playCorrectSound,
  playWrongSound,
  playTileClickSound,
  EnglishAccent,
} from "../utils/audio";
import { Check, X, ArrowRight, Lightbulb, Flame } from "lucide-react";

interface EasyLevelProps {
  wordItem: WordItem;
  isMuted: boolean;
  accent: EnglishAccent;
  streak: number;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
  onListenTrack?: () => void;
}

export const EasyLevel: React.FC<EasyLevelProps> = ({
  wordItem,
  isMuted,
  accent,
  streak,
  onCorrect,
  onWrong,
  onNext,
  onListenTrack,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
  const [failedOptions, setFailedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintBox, setShowHintBox] = useState(false);

  // Shuffle the 4 options: correct word + 3 distractors
  const options = useMemo(() => {
    const list = [wordItem.word.toUpperCase(), ...wordItem.distractors.map((d) => d.toUpperCase())];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [wordItem.id]);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnsweredCorrectly(false);
    setFailedOptions([]);
    setShowFeedback(null);
    setHintUsed(false);
    setShowHintBox(false);
  }, [wordItem.id]);

  const handleSelectOption = (option: string) => {
    if (isAnsweredCorrectly || failedOptions.includes(option)) return;

    setSelectedOption(option);
    const isCorrect = option.toLowerCase() === wordItem.word.toLowerCase();

    if (isCorrect) {
      setIsAnsweredCorrectly(true);
      setShowFeedback("correct");
      playCorrectSound();
      onCorrect();
    } else {
      setShowFeedback("wrong");
      playWrongSound();
      setFailedOptions((prev) => [...prev, option]);
      onWrong();
    }
  };

  const handleUseHint = () => {
    if (hintUsed) return;
    playTileClickSound();
    setHintUsed(true);
    setShowHintBox(true);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual & Audio Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-3 border-amber-200 text-center relative overflow-hidden mb-4">
        {/* Category Pill and Hint Button */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
            <span>{CATEGORY_ICONS[wordItem.category]}</span>
            <span>{wordItem.category}</span>
          </div>

          <button
            type="button"
            onClick={handleUseHint}
            disabled={hintUsed || isAnsweredCorrectly}
            className={`btn-tactile-sm flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border transition-all cursor-pointer ${
              hintUsed
                ? "bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300"
            }`}
          >
            <Lightbulb size={14} className={hintUsed ? "" : "text-yellow-600 fill-yellow-500"} />
            <span>{hintUsed ? "Hint Used" : "💡 HINT"}</span>
          </button>
        </div>

        {/* Big Kid-friendly Emoji Illustration */}
        <div className="my-2 select-none">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-300 flex items-center justify-center text-5xl sm:text-6xl shadow-inner transition-transform hover:scale-105 duration-200">
            {wordItem.emoji}
          </div>
        </div>

        {/* Revealed Hint Box */}
        {showHintBox && (
          <div className="animate-pop my-2 p-2.5 rounded-2xl bg-yellow-50 border-2 border-yellow-300 max-w-sm mx-auto text-xs font-bold text-yellow-950">
            💡 <strong>Clue:</strong> {wordItem.hint}
          </div>
        )}

        {/* Pronunciation Audio Button */}
        <div className="flex justify-center mt-3">
          <AudioListenButton
            word={wordItem.word}
            autoPlayOnMount={true}
            isMuted={isMuted}
            accent={accent}
            size="lg"
            label="LISTEN"
            onListen={onListenTrack}
          />
        </div>
      </div>

      {/* Feedback Alert Banner */}
      <div className="w-full h-12 flex items-center justify-center mb-3">
        {showFeedback === "correct" && (
          <div className="animate-pop w-full py-2 px-4 rounded-2xl bg-emerald-500 text-white font-black text-center text-base sm:text-lg shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2">
            <span>Correct! 🎉</span>
            <span className="text-emerald-100 text-xs font-extrabold">+10 Points</span>
            {streak >= 3 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center gap-0.5">
                <Flame size={12} className="fill-white" /> {streak} Streak!
              </span>
            )}
          </div>
        )}

        {showFeedback === "wrong" && (
          <div className="animate-shake w-full py-2 px-4 rounded-2xl bg-rose-500 text-white font-black text-center text-sm sm:text-base shadow-md border-2 border-rose-600 flex items-center justify-center gap-2">
            <span>Try Again! 🤔</span>
            <span className="text-rose-100 text-xs font-bold">Pick another choice</span>
          </div>
        )}
      </div>

      {/* 4 Large Spelling Option Buttons */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 mb-5">
        {options.map((option, idx) => {
          const isFailed = failedOptions.includes(option);
          const isCorrectChoice =
            isAnsweredCorrectly && option.toLowerCase() === wordItem.word.toLowerCase();

          let btnColor = "bg-white hover:bg-amber-50 text-slate-800 border-amber-300";
          if (isCorrectChoice) {
            btnColor = "bg-emerald-500 text-white border-emerald-600 scale-[1.02] shadow-lg";
          } else if (isFailed) {
            btnColor = "bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60";
          }

          return (
            <button
              key={`${option}-${idx}`}
              type="button"
              disabled={isFailed || isAnsweredCorrectly}
              onClick={() => handleSelectOption(option)}
              className={`btn-tactile w-full py-3.5 sm:py-4 px-5 rounded-2xl font-black text-lg sm:text-xl tracking-wider border-3 cursor-pointer select-none flex items-center justify-between transition-all ${btnColor}`}
            >
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center border border-amber-200">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 text-center font-black tracking-widest">
                {option}
              </span>
              <span className="w-7 flex justify-center">
                {isCorrectChoice && <Check size={22} className="text-white animate-bounce" />}
                {isFailed && <X size={20} className="text-rose-400" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next Question Button */}
      {isAnsweredCorrectly && (
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onNext();
          }}
          className="btn-tactile animate-pop w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg tracking-wider border-2 border-emerald-600 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <span>NEXT QUESTION</span>
          <ArrowRight size={22} />
        </button>
      )}
    </div>
  );
};
