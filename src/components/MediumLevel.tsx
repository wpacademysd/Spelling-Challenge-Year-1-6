import React, { useState, useEffect, useMemo } from "react";
import { WordItem, CATEGORY_ICONS } from "../data/words";
import { AudioListenButton } from "./AudioListenButton";
import {
  playCorrectSound,
  playWrongSound,
  playTileClickSound,
  playRemoveSound,
  EnglishAccent,
} from "../utils/audio";
import { ArrowRight, RotateCcw, Shuffle, Delete, Lightbulb, Flame } from "lucide-react";

interface MediumLevelProps {
  wordItem: WordItem;
  isMuted: boolean;
  accent: EnglishAccent;
  streak: number;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
  onListenTrack?: () => void;
}

interface LetterTile {
  id: string;
  char: string;
}

export const MediumLevel: React.FC<MediumLevelProps> = ({
  wordItem,
  isMuted,
  accent,
  streak,
  onCorrect,
  onWrong,
  onNext,
  onListenTrack,
}) => {
  const targetChars = useMemo(() => wordItem.word.toUpperCase().split(""), [wordItem.word]);

  const initialTiles = useMemo<LetterTile[]>(() => {
    const tiles: LetterTile[] = targetChars.map((char, index) => ({
      id: `${char}-${index}`,
      char,
    }));

    let shuffled = [...tiles];
    let attempts = 0;
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      attempts++;
    } while (
      shuffled.map((t) => t.char).join("") === wordItem.word.toUpperCase() &&
      attempts < 10
    );

    return shuffled;
  }, [wordItem.id, targetChars]);

  const [bankTiles, setBankTiles] = useState<LetterTile[]>([]);
  const [placedTiles, setPlacedTiles] = useState<LetterTile[]>([]);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintBox, setShowHintBox] = useState(false);

  useEffect(() => {
    setBankTiles(initialTiles);
    setPlacedTiles([]);
    setIsAnsweredCorrectly(false);
    setShowFeedback(null);
    setIsShaking(false);
    setHintUsed(false);
    setShowHintBox(false);
  }, [initialTiles]);

  const handleSelectTile = (tile: LetterTile) => {
    if (isAnsweredCorrectly) return;
    playTileClickSound();

    const newPlaced = [...placedTiles, tile];
    const newBank = bankTiles.filter((t) => t.id !== tile.id);

    setPlacedTiles(newPlaced);
    setBankTiles(newBank);
    setShowFeedback(null);

    if (newPlaced.length === targetChars.length) {
      checkSpelling(newPlaced);
    }
  };

  const handleRemovePlacedTile = (tile: LetterTile) => {
    if (isAnsweredCorrectly) return;
    playRemoveSound();

    setPlacedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setBankTiles((prev) => [...prev, tile]);
    setShowFeedback(null);
  };

  const handleBackspace = () => {
    if (isAnsweredCorrectly || placedTiles.length === 0) return;
    playRemoveSound();
    const lastTile = placedTiles[placedTiles.length - 1];
    setPlacedTiles((prev) => prev.slice(0, -1));
    setBankTiles((prev) => [...prev, lastTile]);
    setShowFeedback(null);
  };

  const handleClearAll = () => {
    if (isAnsweredCorrectly || placedTiles.length === 0) return;
    playRemoveSound();
    setPlacedTiles([]);
    setBankTiles(initialTiles);
    setShowFeedback(null);
  };

  const handleShuffleBank = () => {
    playTileClickSound();
    setBankTiles((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  const handleUseHint = () => {
    if (hintUsed) return;
    playTileClickSound();
    setHintUsed(true);
    setShowHintBox(true);
  };

  const checkSpelling = (currentPlaced: LetterTile[]) => {
    const spelledWord = currentPlaced.map((t) => t.char).join("");
    const isCorrect = spelledWord.toLowerCase() === wordItem.word.toLowerCase();

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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual & Audio Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-3 border-amber-200 text-center relative overflow-hidden mb-4">
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

        {/* Emoji illustration */}
        <div className="my-1 select-none">
          <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
            {wordItem.emoji}
          </div>
        </div>

        {/* Hint Box (Shows definition + Starts with: First letter) */}
        {showHintBox && (
          <div className="animate-pop my-2 p-2.5 rounded-2xl bg-yellow-50 border-2 border-yellow-300 max-w-sm mx-auto text-xs font-bold text-yellow-950">
            <div>💡 <strong>Clue:</strong> {wordItem.hint}</div>
            <div className="mt-1 font-black text-amber-900">
              Starts with: <span className="text-base font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">{targetChars[0]}</span>
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
            size="md"
            label="LISTEN"
            onListen={onListenTrack}
          />
        </div>
      </div>

      {/* Feedback Banner */}
      <div className="w-full h-11 flex items-center justify-center mb-3">
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
            <span className="text-rose-100 text-xs font-bold">Tap letters to rearrange</span>
          </div>
        )}
      </div>

      {/* Placed Word Answer Slots */}
      <div
        className={`w-full bg-white/90 rounded-2xl p-3.5 border-2 border-amber-300 mb-4 flex flex-col items-center justify-center shadow-inner ${
          isShaking ? "animate-shake bg-rose-50 border-rose-400" : ""
        }`}
      >
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
          Your Answer ({placedTiles.length}/{targetChars.length})
        </span>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 min-h-[52px]">
          {targetChars.map((_, index) => {
            const tile = placedTiles[index];
            const isFilled = !!tile;

            return (
              <button
                key={`slot-${index}`}
                type="button"
                onClick={() => tile && handleRemovePlacedTile(tile)}
                disabled={!isFilled || isAnsweredCorrectly}
                title={tile ? "Tap to remove letter" : `Empty slot ${index + 1}`}
                className={`w-10 h-12 sm:w-12 sm:h-14 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all select-none ${
                  isAnsweredCorrectly
                    ? "bg-emerald-500 text-white border-2 border-emerald-600 shadow-md scale-105"
                    : isFilled
                    ? "btn-tactile bg-amber-400 text-amber-950 border-2 border-amber-500 cursor-pointer shadow-xs hover:bg-amber-300"
                    : "bg-slate-100 text-slate-300 border-2 border-dashed border-slate-300"
                }`}
              >
                {tile ? tile.char : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action helpers: Shuffle, Backspace, Clear */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-1">
        <button
          type="button"
          onClick={handleShuffleBank}
          disabled={isAnsweredCorrectly || bankTiles.length <= 1}
          className="btn-tactile-sm flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 cursor-pointer disabled:opacity-50"
        >
          <Shuffle size={14} />
          <span>Shuffle</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleBackspace}
            disabled={isAnsweredCorrectly || placedTiles.length === 0}
            className="btn-tactile-sm flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 cursor-pointer disabled:opacity-50"
          >
            <Delete size={14} />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={isAnsweredCorrectly || placedTiles.length === 0}
            className="btn-tactile-sm flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold border border-rose-300 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Bank of Scrambled Letters */}
      <div className="w-full bg-white rounded-3xl p-4 border-3 border-amber-300 shadow-md mb-4">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 text-center mb-2.5">
          Tap the letters in the correct order:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {bankTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={isAnsweredCorrectly}
              onClick={() => handleSelectTile(tile)}
              className="btn-tactile w-11 h-12 sm:w-14 sm:h-15 rounded-2xl bg-sky-400 hover:bg-sky-300 active:bg-sky-500 text-white font-black text-xl sm:text-2xl border-2 border-sky-600 flex items-center justify-center cursor-pointer shadow-xs select-none"
            >
              {tile.char}
            </button>
          ))}
          {bankTiles.length === 0 && !isAnsweredCorrectly && (
            <p className="text-xs font-bold text-slate-400 italic py-1">
              All letters placed! Checking...
            </p>
          )}
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
