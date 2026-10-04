import React, { useState, useEffect } from "react";
import {
  loadUserStats,
  getUnlockedAchievementIds,
  ACHIEVEMENTS_LIST,
  getWordsToPractice,
  clearWordsToPractice,
  UserStats,
} from "../utils/storage";
import { WORDS_DATABASE, WordItem } from "../data/words";
import { AudioListenButton } from "./AudioListenButton";
import { playTileClickSound, EnglishAccent } from "../utils/audio";
import {
  ArrowLeft,
  Trophy,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Trash2,
  Lock,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface MyProgressScreenProps {
  isMuted: boolean;
  accent: EnglishAccent;
  onBackToMenu: () => void;
}

export const MyProgressScreen: React.FC<MyProgressScreenProps> = ({
  isMuted,
  accent,
  onBackToMenu,
}) => {
  const [stats, setStats] = useState<UserStats>({
    gamesPlayed: 0,
    wordsCorrect: 0,
    bestScore: 0,
    bestStreak: 0,
    dailyChallengesCompleted: 0,
    practiceWordsCount: 0,
  });
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [practiceWordIds, setPracticeWordIds] = useState<string[]>([]);

  useEffect(() => {
    setStats(loadUserStats());
    setUnlockedIds(getUnlockedAchievementIds());
    setPracticeWordIds(getWordsToPractice());
  }, []);

  const practiceWords: WordItem[] = practiceWordIds
    .map((id) => WORDS_DATABASE.find((w) => w.id === id || w.word.toLowerCase() === id.toLowerCase()))
    .filter((w): w is WordItem => !!w);

  const handleClearPractice = () => {
    playTileClickSound();
    clearWordsToPractice();
    setPracticeWordIds([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-pop">
      {/* Top Header with Back button */}
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

        <h2 className="text-xl font-black text-amber-950 tracking-wide flex items-center gap-1.5">
          <Trophy size={20} className="text-amber-600" />
          <span>MY PROGRESS</span>
        </h2>
      </div>

      {/* 6 Key Statistics Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        {/* Games Played */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 text-center shadow-xs">
          <span className="text-2xl block mb-0.5">🎮</span>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            Games Played
          </span>
          <span className="text-2xl font-black text-slate-900">{stats.gamesPlayed}</span>
        </div>

        {/* Words Correct */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-emerald-200 text-center shadow-xs">
          <span className="text-2xl block mb-0.5">✅</span>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            Words Correct
          </span>
          <span className="text-2xl font-black text-emerald-700">{stats.wordsCorrect}</span>
        </div>

        {/* Best Score */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-300 text-center shadow-xs">
          <span className="text-2xl block mb-0.5">🏆</span>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            Best Score
          </span>
          <span className="text-2xl font-black text-amber-700">{stats.bestScore}</span>
        </div>

        {/* Best Streak */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-orange-200 text-center shadow-xs">
          <span className="text-2xl block mb-0.5">🔥</span>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            Best Streak
          </span>
          <span className="text-2xl font-black text-orange-600">{stats.bestStreak}</span>
        </div>

        {/* Achievements Earned */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-purple-200 text-center shadow-xs">
          <span className="text-2xl block mb-0.5">🎖️</span>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            Achievements
          </span>
          <span className="text-2xl font-black text-purple-700">
            {unlockedIds.length} / {ACHIEVEMENTS_LIST.length}
          </span>
        </div>

        {/* Daily Challenges */}
        <div className="bg-white rounded-2xl p-3.5 border-2 border-sky-200 text-center shadow-xs">
          <span className="text-2xl block mb-0.5">🏅</span>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
            Daily Stars
          </span>
          <span className="text-2xl font-black text-sky-700">
            {stats.dailyChallengesCompleted}
          </span>
        </div>
      </div>

      {/* Words to Practice (Smart repetition list) */}
      <div className="w-full bg-white rounded-3xl p-5 border-3 border-amber-200 shadow-md mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <BookOpen size={18} className="text-amber-700" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Words to Practice ({practiceWords.length})
            </h3>
          </div>
          {practiceWords.length > 0 && (
            <button
              type="button"
              onClick={handleClearPractice}
              title="Clear list"
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {practiceWords.length === 0 ? (
          <div className="text-center py-5 text-slate-500">
            <span className="text-3xl block mb-1">🎉</span>
            <p className="text-xs font-bold">No words to practice right now!</p>
            <p className="text-[11px] text-slate-400">Words you miss in game sessions will appear here for easy review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {practiceWords.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-2xl bg-amber-50 border border-amber-200"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <span className="font-black text-xs sm:text-sm text-slate-800 uppercase tracking-wide block truncate">
                      {item.word}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      Year {item.year} • {item.category}
                    </span>
                  </div>
                </div>
                <AudioListenButton
                  word={item.word}
                  isMuted={isMuted}
                  accent={accent}
                  size="sm"
                  label=""
                  className="shrink-0 !p-1.5 !rounded-xl"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements Badges */}
      <div className="w-full bg-white rounded-3xl p-5 border-3 border-amber-200 shadow-md mb-6">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Award size={18} className="text-purple-600" />
          <span>Achievements</span>
        </h3>

        <div className="space-y-2.5">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isUnlocked
                    ? "bg-purple-50/80 border-purple-200 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked ? "bg-purple-200 shadow-xs" : "bg-slate-200 grayscale"
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock size={18} className="text-slate-500" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{ach.title}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-black">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
