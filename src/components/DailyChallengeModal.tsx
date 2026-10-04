import React from "react";
import {
  getTodayDateString,
  isDailyChallengeCompletedToday,
  getDailyChallengeWords,
} from "../utils/storage";
import { playTileClickSound } from "../utils/audio";
import { Calendar, Play, CheckCircle2, Award, X, Sparkles } from "lucide-react";

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDaily: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  onStartDaily,
}) => {
  if (!isOpen) return null;

  const isCompleted = isDailyChallengeCompletedToday();
  const today = getTodayDateString();
  const words = getDailyChallengeWords();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 relative text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            playTileClickSound();
            onClose();
          }}
          className="btn-tactile-sm absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-300 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-amber-600 mb-3 shadow-sm">
          <Calendar size={32} />
        </div>

        <h3 className="text-2xl font-black text-amber-950 tracking-tight mb-0.5">
          DAILY SPELLING CHALLENGE
        </h3>
        <p className="text-xs font-bold text-amber-700 mb-4">
          Today's Challenge • {today}
        </p>

        {/* Award Badge Info */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 mb-4 text-center">
          <span className="text-2xl block mb-1">🏅</span>
          <span className="text-xs font-extrabold text-amber-900 block">
            Complete the challenge to earn:
          </span>
          <span className="text-base font-black text-amber-950">
            🏅 Daily Star
          </span>
          {isCompleted && (
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              <CheckCircle2 size={14} />
              <span>Already Completed Today! ⭐</span>
            </div>
          )}
        </div>

        {/* 10 Words Preview Pill list */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-5">
          <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block mb-2">
            10 Words Curated for Today
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
            {words.map((w, idx) => (
              <span
                key={w.id}
                className="px-2 py-0.5 rounded-lg bg-white border border-slate-200"
              >
                {w.emoji} Word {idx + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={() => {
            playTileClickSound();
            onClose();
            onStartDaily();
          }}
          className="btn-tactile w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg tracking-wider border-2 border-amber-500 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Play size={20} className="fill-amber-950" />
          <span>{isCompleted ? "PLAY AGAIN (FOR FUN)" : "START TODAY'S CHALLENGE"}</span>
        </button>
      </div>
    </div>
  );
};
