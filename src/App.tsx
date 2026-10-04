import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GAME_CONFIG } from "./config";
import { WORDS_DATABASE, WordItem, Category, YearLevel } from "./data/words";
import {
  initSpeechVoices,
  getAudioMuted,
  setAudioMuted,
  getEnglishAccent,
  setEnglishAccent,
  playTileClickSound,
  playStreakSound,
  playWrongSound,
  playOutOfLivesSound,
  EnglishAccent,
} from "./utils/audio";
import {
  loadUserStats,
  saveUserStats,
  unlockAchievement,
  addWordToPractice,
  removeWordFromPractice,
  getWordsToPractice,
  getDailyChallengeWords,
  markDailyChallengeCompleted,
  Achievement,
} from "./utils/storage";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MainMenu } from "./components/MainMenu";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { DailyChallengeModal } from "./components/DailyChallengeModal";
import { OutOfLivesModal } from "./components/OutOfLivesModal";
import { PracticeMode } from "./components/PracticeMode";
import { MyProgressScreen } from "./components/MyProgressScreen";
import { ProgressBar } from "./components/ProgressBar";
import { EasyLevel } from "./components/EasyLevel";
import { MediumLevel } from "./components/MediumLevel";
import { HardLevel } from "./components/HardLevel";
import { ResultScreen } from "./components/ResultScreen";

type ScreenState = "MENU" | "LEVEL_SELECT" | "GAME" | "RESULT" | "PRACTICE" | "PROGRESS";
type Level = "EASY" | "MEDIUM" | "HARD";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("MENU");
  const [level, setLevel] = useState<Level>("EASY");
  const [year, setYear] = useState<YearLevel>(1);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | Category>("ALL");
  const [timerMode, setTimerMode] = useState(false);

  // Audio settings
  const [isMuted, setIsMuted] = useState(false);
  const [accent, setAccent] = useState<EnglishAccent>("US");

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isOutOfLivesOpen, setIsOutOfLivesOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Active game session state
  const [sessionWords, setSessionWords] = useState<WordItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.TOTAL_LIVES);
  const [unlimitedLives, setUnlimitedLives] = useState(false);
  const [isDailyGame, setIsDailyGame] = useState(false);

  // Time & Timer tracking
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.TIMER_SECONDS);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Audio listen tracker for "Super Listener" achievement
  const [listenedIndices, setListenedIndices] = useState<Set<number>>(new Set());
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);

  // Initialize on mount
  useEffect(() => {
    initSpeechVoices();
    setIsMuted(getAudioMuted());
    setAccent(getEnglishAccent());
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      setAudioMuted(next);
      return next;
    });
  }, []);

  const handleToggleAccent = useCallback(() => {
    setAccent((prev) => {
      const next: EnglishAccent = prev === "US" ? "UK" : "US";
      setEnglishAccent(next);
      return next;
    });
  }, []);

  // Timer Countdown Effect in Game Mode
  useEffect(() => {
    if (screen !== "GAME" || !timerMode || isOutOfLivesOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time is up!
          handleTimeUp();
          return GAME_CONFIG.TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, timerMode, isOutOfLivesOpen, currentQuestionIndex]);

  // Handle Time Expired
  const handleTimeUp = () => {
    playOutOfLivesSound();
    handleWrongAnswer(true); // Treat as wrong answer
    // Advance to next question automatically if player still has lives
    setTimeout(() => {
      handleNextQuestion();
    }, 500);
  };

  // Helper to start a fresh game session
  const startNewGame = useCallback(
    (options?: {
      chosenLevel?: Level;
      chosenYear?: YearLevel;
      chosenCategory?: "ALL" | Category;
      isDaily?: boolean;
    }) => {
      const activeLevel = options?.chosenLevel ?? level;
      const activeYear = options?.chosenYear ?? year;
      const activeCategory = options?.chosenCategory ?? selectedCategory;
      const isDaily = options?.isDaily ?? false;

      if (options?.chosenLevel) setLevel(options.chosenLevel);
      if (options?.chosenYear) setYear(options.chosenYear);
      if (options?.chosenCategory) setSelectedCategory(options.chosenCategory);

      setIsDailyGame(isDaily);

      let selected: WordItem[] = [];

      if (isDaily) {
        selected = getDailyChallengeWords();
      } else {
        // Smart Question System: include words from practice list if matching year
        const practiceList = getWordsToPractice();
        let yearPool = WORDS_DATABASE.filter((w) => w.year === activeYear);

        if (activeCategory !== "ALL") {
          const categoryFiltered = yearPool.filter((w) => w.category === activeCategory);
          if (categoryFiltered.length >= 5) {
            yearPool = categoryFiltered;
          }
        }

        // Shuffle yearPool
        const shuffled = [...yearPool];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Check if any words in practiceList can be prioritized
        const priorityWords = shuffled.filter((w) => practiceList.includes(w.id));
        const regularWords = shuffled.filter((w) => !practiceList.includes(w.id));

        selected = [...priorityWords.slice(0, 3), ...regularWords].slice(
          0,
          GAME_CONFIG.QUESTIONS_PER_SESSION
        );

        // Fallback if not enough words
        if (selected.length < GAME_CONFIG.QUESTIONS_PER_SESSION) {
          const generalPool = [...WORDS_DATABASE];
          for (let i = generalPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [generalPool[i], generalPool[j]] = [generalPool[j], generalPool[i]];
          }
          selected = generalPool.slice(0, GAME_CONFIG.QUESTIONS_PER_SESSION);
        }
      }

      setSessionWords(selected);
      setCurrentQuestionIndex(0);
      setScore(0);
      setCorrectCount(0);
      setCurrentStreak(0);
      setBestStreak(0);
      setLives(GAME_CONFIG.TOTAL_LIVES);
      setUnlimitedLives(false);
      setTimeLeft(GAME_CONFIG.TIMER_SECONDS);
      setGameStartTime(Date.now());
      setElapsedSeconds(0);
      setListenedIndices(new Set());
      setNewlyUnlockedAchievement(null);
      setShowExitConfirm(false);
      setIsOutOfLivesOpen(false);
      setScreen("GAME");
    },
    [level, year, selectedCategory]
  );

  // Called when player answers correctly
  const handleCorrectAnswer = useCallback(() => {
    const currentWord = sessionWords[currentQuestionIndex];
    if (currentWord) {
      removeWordFromPractice(currentWord.id);
    }

    const nextStreak = currentStreak + 1;
    setCurrentStreak(nextStreak);
    if (nextStreak > bestStreak) {
      setBestStreak(nextStreak);
    }

    // Base score + streak bonuses
    let addedPoints = GAME_CONFIG.POINTS_PER_CORRECT;
    let bonus = 0;
    if (nextStreak === 3) {
      bonus = GAME_CONFIG.STREAK_BONUSES[3] || 5;
    } else if (nextStreak === 5) {
      bonus = GAME_CONFIG.STREAK_BONUSES[5] || 10;
    } else if (nextStreak >= 10 && nextStreak % 10 === 0) {
      bonus = GAME_CONFIG.STREAK_BONUSES[10] || 20;
    }

    if (bonus > 0) {
      playStreakSound();
      addedPoints += bonus;
    }

    setScore((prev) => prev + addedPoints);
    setCorrectCount((prev) => prev + 1);

    // Streak achievement check
    if (nextStreak >= 5) {
      const ach = unlockAchievement("hot_streak");
      if (ach) setNewlyUnlockedAchievement(ach);
    }
  }, [currentStreak, bestStreak, sessionWords, currentQuestionIndex]);

  // Called when player answers wrong
  const handleWrongAnswer = useCallback(
    (isTimeExpired = false) => {
      const currentWord = sessionWords[currentQuestionIndex];
      if (currentWord) {
        addWordToPractice(currentWord.id);
      }

      // Reset streak
      setCurrentStreak(0);

      // Deduct Life (unless in unlimited mode)
      if (!unlimitedLives) {
        setLives((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            playOutOfLivesSound();
            setIsOutOfLivesOpen(true);
            return 0;
          }
          return next;
        });
      }
    },
    [sessionWords, currentQuestionIndex, unlimitedLives]
  );

  // Advance to next question or complete game
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < sessionWords.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(GAME_CONFIG.TIMER_SECONDS);
    } else {
      // Game Complete!
      const totalElapsed = Math.round((Date.now() - gameStartTime) / 1000);
      setElapsedSeconds(totalElapsed);

      // Check Achievements
      let newAch: Achievement | null = null;
      const achFirst = unlockAchievement("first_win");
      if (achFirst) newAch = achFirst;

      if (score >= 100) {
        const achPerf = unlockAchievement("perfect_score");
        if (achPerf) newAch = achPerf;
      }

      if (level === "HARD" && score >= 70) {
        const achChamp = unlockAchievement("spelling_champion");
        if (achChamp) newAch = achChamp;
      }

      if (timerMode) {
        const achSpeed = unlockAchievement("speed_demon");
        if (achSpeed) newAch = achSpeed;
      }

      if (listenedIndices.size >= sessionWords.length) {
        const achListen = unlockAchievement("super_listener");
        if (achListen) newAch = achListen;
      }

      if (isDailyGame) {
        markDailyChallengeCompleted();
        const achDaily = unlockAchievement("daily_hero");
        if (achDaily) newAch = achDaily;
      }

      if (newAch) {
        setNewlyUnlockedAchievement(newAch);
      }

      // Update Persistent Stats
      const prevStats = loadUserStats();
      saveUserStats({
        gamesPlayed: prevStats.gamesPlayed + 1,
        wordsCorrect: prevStats.wordsCorrect + correctCount,
        bestScore: Math.max(prevStats.bestScore, score),
        bestStreak: Math.max(prevStats.bestStreak, bestStreak),
      });

      setScreen("RESULT");
    }
  }, [
    currentQuestionIndex,
    sessionWords.length,
    gameStartTime,
    score,
    level,
    timerMode,
    listenedIndices.size,
    isDailyGame,
    correctCount,
    bestStreak,
  ]);

  const handleListenTrack = useCallback(() => {
    setListenedIndices((prev) => new Set(prev).add(currentQuestionIndex));
  }, [currentQuestionIndex]);

  // Format Elapsed Time (M:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentWord = sessionWords[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/60 text-slate-800">
      {/* Universal Top Header */}
      <Header
        isMuted={isMuted}
        accent={accent}
        onToggleMute={handleToggleMute}
        onToggleAccent={handleToggleAccent}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenProgress={() => setScreen("PROGRESS")}
        onGoHome={() => {
          if (screen === "GAME") {
            setShowExitConfirm(true);
          } else {
            setScreen("MENU");
          }
        }}
        inGame={screen === "GAME"}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 flex flex-col items-center justify-center">
        {/* 1. MAIN MENU */}
        {screen === "MENU" && (
          <MainMenu
            currentYear={year}
            currentLevel={level}
            timerMode={timerMode}
            onStartGame={() => startNewGame()}
            onOpenSelectLevel={() => setScreen("LEVEL_SELECT")}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
            onOpenPracticeMode={() => setScreen("PRACTICE")}
            onOpenProgress={() => setScreen("PROGRESS")}
          />
        )}

        {/* 2. LEVEL & YEAR SELECT SCREEN */}
        {screen === "LEVEL_SELECT" && (
          <LevelSelectScreen
            currentYear={year}
            currentLevel={level}
            currentCategory={selectedCategory}
            timerMode={timerMode}
            onSelectYear={(y) => setYear(y)}
            onSelectLevel={(lvl) => setLevel(lvl)}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onToggleTimerMode={(en) => setTimerMode(en)}
            onStartGame={() => startNewGame()}
            onBackToMenu={() => setScreen("MENU")}
          />
        )}

        {/* 3. ACTIVE GAMEPLAY SCREEN */}
        {screen === "GAME" && currentWord && (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center">
            {/* Extended Progress Bar with Lives, Streak, and Timer */}
            <div className="w-full mb-3.5">
              <ProgressBar
                currentIndex={currentQuestionIndex}
                totalQuestions={sessionWords.length || GAME_CONFIG.QUESTIONS_PER_SESSION}
                score={score}
                level={level}
                year={currentWord.year}
                category={currentWord.category}
                lives={lives}
                maxLives={GAME_CONFIG.TOTAL_LIVES}
                streak={currentStreak}
                timerMode={timerMode}
                timeLeft={timeLeft}
                maxTime={GAME_CONFIG.TIMER_SECONDS}
              />
            </div>

            {/* Level Question Engine with Hint & Accent */}
            {level === "EASY" && (
              <EasyLevel
                key={currentWord.id}
                wordItem={currentWord}
                isMuted={isMuted}
                accent={accent}
                streak={currentStreak}
                onCorrect={handleCorrectAnswer}
                onWrong={handleWrongAnswer}
                onNext={handleNextQuestion}
                onListenTrack={handleListenTrack}
              />
            )}

            {level === "MEDIUM" && (
              <MediumLevel
                key={currentWord.id}
                wordItem={currentWord}
                isMuted={isMuted}
                accent={accent}
                streak={currentStreak}
                onCorrect={handleCorrectAnswer}
                onWrong={handleWrongAnswer}
                onNext={handleNextQuestion}
                onListenTrack={handleListenTrack}
              />
            )}

            {level === "HARD" && (
              <HardLevel
                key={currentWord.id}
                wordItem={currentWord}
                isMuted={isMuted}
                accent={accent}
                streak={currentStreak}
                onCorrect={handleCorrectAnswer}
                onWrong={handleWrongAnswer}
                onNext={handleNextQuestion}
                onListenTrack={handleListenTrack}
              />
            )}
          </div>
        )}

        {/* 4. RESULT SCREEN */}
        {screen === "RESULT" && (
          <ResultScreen
            score={score}
            totalQuestions={sessionWords.length || GAME_CONFIG.QUESTIONS_PER_SESSION}
            correctCount={correctCount}
            bestStreak={bestStreak}
            timeFormatted={formatTime(elapsedSeconds || 45)}
            level={level}
            year={year}
            sessionWords={sessionWords}
            isMuted={isMuted}
            accent={accent}
            newlyUnlockedAchievement={newlyUnlockedAchievement}
            onPlayAgain={() => startNewGame()}
            onNextLevel={() => {
              const nextLvl: Level =
                level === "EASY" ? "MEDIUM" : level === "MEDIUM" ? "HARD" : "EASY";
              setLevel(nextLvl);
              startNewGame({ chosenLevel: nextLvl });
            }}
            onChangeYear={() => setScreen("LEVEL_SELECT")}
            onOpenProgress={() => setScreen("PROGRESS")}
            onGoHome={() => setScreen("MENU")}
          />
        )}

        {/* 5. PRACTICE MODE */}
        {screen === "PRACTICE" && (
          <PracticeMode
            isMuted={isMuted}
            accent={accent}
            onBackToMenu={() => setScreen("MENU")}
          />
        )}

        {/* 6. MY PROGRESS / STATS */}
        {screen === "PROGRESS" && (
          <MyProgressScreen
            isMuted={isMuted}
            accent={accent}
            onBackToMenu={() => setScreen("MENU")}
          />
        )}
      </main>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
        onStartDaily={() => startNewGame({ isDaily: true })}
      />

      {/* Out of Lives Modal */}
      <OutOfLivesModal
        isOpen={isOutOfLivesOpen}
        score={score}
        onTryAgain={() => {
          setIsOutOfLivesOpen(false);
          startNewGame();
        }}
        onContinueWithoutLives={() => {
          setIsOutOfLivesOpen(false);
          setUnlimitedLives(true);
          setLives(1);
        }}
        onGoHome={() => {
          setIsOutOfLivesOpen(false);
          setScreen("MENU");
        }}
      />

      {/* Exit Game Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-amber-300 text-center">
            <span className="text-4xl block mb-2">🚪</span>
            <h3 className="text-xl font-black text-amber-950 mb-1">
              Leave Current Game?
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-5">
              Your score of {score} will be reset if you return to the main menu.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playTileClickSound();
                  setShowExitConfirm(false);
                }}
                className="btn-tactile-sm flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm border border-slate-300 cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                type="button"
                onClick={() => {
                  playTileClickSound();
                  setShowExitConfirm(false);
                  setScreen("MENU");
                }}
                className="btn-tactile-sm flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm border-2 border-rose-600 cursor-pointer"
              >
                Quit to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Resell-friendly Footer */}
      <Footer />
    </div>
  );
}
