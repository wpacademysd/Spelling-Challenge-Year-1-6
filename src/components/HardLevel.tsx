import React, { useState, useEffect, useRef } from "react";
import { WordItem, CATEGORY_ICONS } from "../data/words";
import { AudioListenButton } from "./AudioListenButton";
import {
  playCorrectSound,
  playWrongSound,
  playTileClickSound,
  playRemoveSound,
  EnglishAccent,
} from "../utils/audio";
import {
  ArrowRight,
  Headphones,
  Check,
  Delete,
  RotateCcw,
  Lightbulb,
  Flame,
} from "lucide-react";

interface HardLevelProps {
  wordItem: WordItem;
  isMuted: boolean;
  accent: EnglishAccent;
  streak: number;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
  onListenTrack?: () => void;
}

export const HardLevel: React.FC<HardLevelProps> = ({
  wordItem,
  isMuted,
  accent,
  streak,
  onCorrect,
  onWrong,
  onNext,
  onListenTrack,
}) => {
  const [typedInput, setTypedInput] = useState<string>("");
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetWord = wordItem.word.toUpperCase();
  const wordLength = targetWord.length;

  useEffect(() => {
    setTypedInput("");
    setIsAnsweredCorrectly(false);
    setShowFeedback(null);
    setIsShaking(false);
    setHintUsed(false);
    setRevealedIndices([]);
  }, [wordItem.id]);

  const handleAddLetter = (char: string) => {
    if (isAnsweredCorrectly || typedInput.length >= wordLength) return;
    playTileClickSound();
    setTypedInput((prev) => prev + char.toUpperCase());
    setShowFeedback(null);
  };

  const handleBackspace = () => {
    if (isAnsweredCorrectly || typedInput.length === 0) return;
    playRemoveSound();
    setTypedInput((prev) => prev.slice(0, -1));
    setShowFeedback(null);
  };

  const handleClear = () => {
    if (isAnsweredCorrectly || typedInput.length === 0) return;
    playRemoveSound();
    setTypedInput("");
    setShowFeedback(null);
  };

  // Hard Mode Hint: Reveal one letter in its position
  const handleUseHint = () => {
    if (hintUsed || isAnsweredCorrectly) return;
    playTileClickSound();
    setHintUsed(true);

    // Find first unrevealed letter index
    const unrevealed = Array.from({ length: wordLength })
      .map((_, i) => i)
      .filter((i) => !revealedIndices.includes(i));

    if (unrevealed.length > 0) {
      const pick = unrevealed[0];
      setRevealedIndices((prev) => [...prev, pick]);

      // If user has not typed up to this index, fill it in
      setTypedInput((prev) => {
        const arr = prev.padEnd(wordLength, " ").split("");
        arr[pick] = targetWord[pick];
        return arr.join("").trimEnd();
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnsweredCorrectly || typedInput.length === 0) return;

    const isCorrect = typedInput.trim().toUpperCase() === targetWord;

    if (isCorrect) {
      setIsAnsweredCorrectly(true);
      setShowFeedback("correct");
      playCorrectSound();
      onCorrect();
    } else {
      setShowFeedback("wrong");
      setIsShaking(true);
      playWrongSound();
      onWrong();
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Audio Mystery Card - PICTURE HIDDEN as specified */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-3 border-amber-200 text-center relative overflow-hidden mb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-extrabold text-xs">
            <span>{CATEGORY_ICONS[wordItem.category]}</span>
            <span>Category: {wordItem.category}</span>
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

        {/* Mystery Box or Revealed Picture when Correct */}
        <div className="my-2 select-none">
          {isAnsweredCorrectly ? (
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-emerald-100 border-4 border-emerald-400 flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-inner animate-pop">
              <span>{wordItem.emoji}</span>
              <span className="text-xs font-black text-emerald-900 uppercase mt-1 tracking-widest">
                {targetWord}
              </span>
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-gradient-to-b from-rose-50 to-amber-100 border-4 border-rose-300 flex flex-col items-center justify-center text-slate-700 shadow-inner">
              <Headphones size={40} className="text-rose-500 animate-pulse mb-1" />
              <span className="text-[11px] font-black text-rose-950 uppercase tracking-wider">
                Listen & Type
              </span>
            </div>
          )}
        </div>

        {/* Hint Box (Shows meaning + revealed letter info) */}
        {hintUsed && !isAnsweredCorrectly && (
          <div className="animate-pop my-2 p-2 rounded-2xl bg-yellow-50 border-2 border-yellow-300 max-w-sm mx-auto text-xs font-bold text-yellow-950">
            <div>💡 <strong>Clue:</strong> {wordItem.hint}</div>
            <div className="mt-1 font-black text-emerald-800">
              One letter revealed! ({wordLength} letters total)
            </div>
          </div>
        )}

        {/* Audio Button */}
        <div className="flex justify-center mt-2">
          <AudioListenButton
            word={wordItem.word}
            autoPlayOnMount={true}
            isMuted={isMuted}
            accent={accent}
            size="lg"
            label="LISTEN TO WORD"
            onListen={onListenTrack}
          />
        </div>
      </div>

      {/* Feedback Banner */}
      <div className="w-full h-11 flex items-center justify-center mb-2">
        {showFeedback === "correct" && (
          <div className="animate-pop w-full py-2 px-4 rounded-2xl bg-emerald-500 text-white font-black text-center text-base sm:text-lg shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2">
            <span>Correct! 🎉</span>
            <span className="text-emerald-100 text-xs font-bold">+10 Points</span>
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
            <span className="text-rose-100 text-xs font-bold">Listen again and check letters</span>
          </div>
        )}
      </div>

      {/* Typing Slot Display */}
      <div
        className={`w-full bg-white rounded-3xl p-3.5 sm:p-4 border-3 border-amber-300 shadow-md mb-3 flex flex-col items-center justify-center ${
          isShaking ? "animate-shake border-rose-400 bg-rose-50" : ""
        }`}
      >
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
          Type the word ({typedInput.length}/{wordLength})
        </span>

        {/* Letter Boxes */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 min-h-[50px] mb-2.5">
          {Array.from({ length: wordLength }).map((_, index) => {
            const char = typedInput[index];
            const isFilled = !!char;
            const isHintLetter = revealedIndices.includes(index);

            return (
              <div
                key={`hard-slot-${index}`}
                className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl font-black text-xl sm:text-2xl flex items-center justify-center select-none transition-all ${
                  isAnsweredCorrectly
                    ? "bg-emerald-500 text-white border-2 border-emerald-600 shadow-sm"
                    : isFilled
                    ? isHintLetter
                      ? "bg-yellow-300 text-yellow-950 border-2 border-yellow-500"
                      : "bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-xs"
                    : "bg-slate-100 text-slate-300 border-2 border-dashed border-slate-300"
                }`}
              >
                {char || ""}
              </div>
            );
          })}
        </div>

        {/* Physical Keyboard Input */}
        <input
          ref={inputRef}
          type="text"
          value={typedInput}
          onChange={(e) => {
            if (isAnsweredCorrectly) return;
            const sanitized = e.target.value
              .replace(/[^a-zA-Z]/g, "")
              .slice(0, wordLength)
              .toUpperCase();
            setTypedInput(sanitized);
            setShowFeedback(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Type here or use keys below..."
          className="w-full max-w-xs text-center py-1.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          disabled={isAnsweredCorrectly}
        />
      </div>

      {/* On-screen Kid-Friendly Touch Keyboard */}
      <div className="w-full bg-slate-200/90 rounded-3xl p-2.5 sm:p-3 border-2 border-slate-300 shadow-inner mb-3 select-none">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={`row-${rIdx}`} className="flex justify-center gap-1 mb-1 sm:mb-1.5">
            {row.map((letter) => (
              <button
                key={letter}
                type="button"
                disabled={isAnsweredCorrectly}
                onClick={() => handleAddLetter(letter)}
                className="btn-tactile w-7 sm:w-9 h-10 sm:h-11 rounded-xl bg-white hover:bg-amber-100 active:bg-amber-400 text-slate-900 font-black text-sm sm:text-base border border-slate-300 flex items-center justify-center cursor-pointer shadow-xs"
              >
                {letter}
              </button>
            ))}
          </div>
        ))}

        <div className="flex justify-center items-center gap-2 mt-1.5">
          <button
            type="button"
            disabled={isAnsweredCorrectly || typedInput.length === 0}
            onClick={handleClear}
            className="btn-tactile-sm px-3 h-10 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs border border-rose-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>

          <button
            type="button"
            disabled={isAnsweredCorrectly || typedInput.length === 0}
            onClick={() => handleSubmit()}
            className="btn-tactile flex-1 max-w-[180px] h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm border-2 border-amber-500 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 shadow-xs"
          >
            <Check size={16} />
            <span>CHECK ✓</span>
          </button>

          <button
            type="button"
            disabled={isAnsweredCorrectly || typedInput.length === 0}
            onClick={handleBackspace}
            className="btn-tactile-sm px-3 h-10 rounded-xl bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold text-xs border border-slate-400 flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <Delete size={14} />
            <span>Del</span>
          </button>
        </div>
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
