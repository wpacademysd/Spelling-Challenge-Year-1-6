import React from "react";
import { HeartCrack, RotateCcw, Play, Home } from "lucide-react";
import { playTileClickSound } from "../utils/audio";

interface OutOfLivesModalProps {
  isOpen: boolean;
  score: number;
  onTryAgain: () => void;
  onContinueWithoutLives: () => void;
  onGoHome: () => void;
}

export const OutOfLivesModal: React.FC<OutOfLivesModalProps> = ({
  isOpen,
  score,
  onTryAgain,
  onContinueWithoutLives,
  onGoHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-pop">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-rose-300 text-center">
        {/* Broken Heart Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 border-4 border-rose-400 flex items-center justify-center text-rose-500 mb-3 shadow-md">
          <HeartCrack size={44} className="animate-bounce" />
        </div>

        <h3 className="text-2xl font-black text-rose-950 tracking-tight mb-1">
          OUT OF LIVES!
        </h3>
        <p className="text-sm font-bold text-slate-600 mb-4">
          You lost all 3 hearts! Don't give up, practice makes perfect.
        </p>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 mb-5">
          <span className="text-xs font-bold text-amber-800">Current Score:</span>
          <div className="text-2xl font-black text-amber-950">{score} Points</div>
        </div>

        {/* 3 Choices: TRY AGAIN, CONTINUE WITHOUT LIVES, HOME */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onTryAgain();
            }}
            className="btn-tactile w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base tracking-wider border-2 border-emerald-600 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw size={18} />
            <span>TRY AGAIN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onContinueWithoutLives();
            }}
            className="btn-tactile w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm tracking-wider border-2 border-amber-500 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Play size={18} />
            <span>CONTINUE WITHOUT LIVES</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTileClickSound();
              onGoHome();
            }}
            className="btn-tactile-sm w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={17} />
            <span>HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
