import React from "react";
import { X, Volume2, Sparkles, Award, CheckCircle2 } from "lucide-react";
import { playTileClickSound } from "../utils/audio";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            playTileClickSound();
            onClose();
          }}
          className="btn-tactile-sm absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center border border-rose-300 cursor-pointer"
          aria-label="Close how to play modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <span className="text-4xl mb-1 inline-block">🎮</span>
          <h2 className="text-2xl font-black text-amber-950 tracking-wide">
            HOW TO PLAY
          </h2>
          <p className="text-sm font-bold text-amber-700">
            Learn English Spelling the Fun Way!
          </p>
        </div>

        {/* 5 Simple Rules from brief */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
              1
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                Listen to the word
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                Tap the big 🔊 <strong>LISTEN</strong> button to hear clear English pronunciation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-200">
            <span className="w-8 h-8 rounded-full bg-sky-400 text-sky-950 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
              2
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                Look at the picture
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                Use the colorful picture clue and hint to recognize the object.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="w-8 h-8 rounded-full bg-emerald-400 text-emerald-950 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
              3
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                Spell or choose the correct word
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                Pick the right option, tap the letter tiles, or type the spelling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50 border border-violet-200">
            <span className="w-8 h-8 rounded-full bg-violet-400 text-violet-950 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
              4
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                Earn points for every correct answer
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                Get <strong>+10 points</strong> for every question answered correctly!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pink-50 border border-pink-200">
            <span className="w-8 h-8 rounded-full bg-pink-400 text-pink-950 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
              5
            </span>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                Complete all questions
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                Finish 10 questions to unlock your star rating (⭐ ⭐ ⭐)!
              </p>
            </div>
          </div>
        </div>

        {/* 3 Game Modes Explainer */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-3 text-center">
            3 DIFFICULTY LEVELS
          </h3>
          <div className="grid grid-cols-1 gap-2.5 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-emerald-200">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-extrabold text-[11px]">
                EASY
              </span>
              <span>Picture + Audio + 4 spelling choices. Pick the right one!</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-amber-200">
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-extrabold text-[11px]">
                MEDIUM
              </span>
              <span>Picture + Audio + Scrambled letters. Tap tiles in order!</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-rose-200">
              <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white font-extrabold text-[11px]">
                HARD
              </span>
              <span>Audio ONLY! No pictures or word clues. Type the spelling!</span>
            </div>
          </div>
        </div>

        {/* Got It Button */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onClose();
          }}
          className="btn-tactile w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg tracking-wider border-2 border-amber-500 cursor-pointer shadow-md"
        >
          LET'S PLAY! 🚀
        </button>
      </div>
    </div>
  );
};
