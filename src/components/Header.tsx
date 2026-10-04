import React from "react";
import { Volume2, VolumeX, Home, HelpCircle, BarChart3 } from "lucide-react";
import { GAME_CONFIG } from "../config";
import { playTileClickSound, EnglishAccent } from "../utils/audio";

interface HeaderProps {
  isMuted: boolean;
  accent: EnglishAccent;
  onToggleMute: () => void;
  onToggleAccent: () => void;
  onOpenHowToPlay: () => void;
  onOpenProgress: () => void;
  onGoHome?: () => void;
  inGame?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  accent,
  onToggleMute,
  onToggleAccent,
  onOpenHowToPlay,
  onOpenProgress,
  onGoHome,
  inGame = false,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-40 px-3 sm:px-4 py-2.5 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Side: Brand or Menu button */}
        <div className="flex items-center gap-2">
          {inGame && onGoHome ? (
            <button
              onClick={() => {
                playTileClickSound();
                onGoHome();
              }}
              title="Return to Home Menu"
              className="btn-tactile-sm flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 cursor-pointer"
            >
              <Home size={17} className="text-amber-600" />
              <span>Menu</span>
            </button>
          ) : (
            <button
              onClick={() => onGoHome && onGoHome()}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform" role="img" aria-label="sparkles">
                ✨
              </span>
              <div>
                <h1 className="text-sm sm:text-base font-black text-amber-950 tracking-tight leading-none">
                  {GAME_CONFIG.gameTitle}
                </h1>
                <p className="text-[10px] font-bold text-amber-700 hidden sm:block">
                  {GAME_CONFIG.TAGLINE}
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Right Side: Accent Toggle, Progress, Sound, Help */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Accent Switcher (UK vs US) */}
          <button
            onClick={() => {
              playTileClickSound();
              onToggleAccent();
            }}
            title={`Accent: ${accent === "UK" ? "UK English" : "US English"}. Click to toggle.`}
            className="btn-tactile-sm flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-black border border-blue-200 cursor-pointer"
          >
            <span>{accent === "UK" ? "🇬🇧 UK" : "🇺🇸 US"}</span>
          </button>

          {/* My Progress Button */}
          {!inGame && (
            <button
              onClick={() => {
                playTileClickSound();
                onOpenProgress();
              }}
              title="My Progress & Stats"
              className="btn-tactile-sm flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 cursor-pointer"
            >
              <BarChart3 size={16} className="text-purple-600" />
              <span className="hidden sm:inline">Stats</span>
            </button>
          )}

          {/* How to Play Help button */}
          <button
            onClick={() => {
              playTileClickSound();
              onOpenHowToPlay();
            }}
            title="How to Play"
            className="btn-tactile-sm flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 cursor-pointer"
          >
            <HelpCircle size={16} className="text-amber-700" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={() => {
              playTileClickSound();
              onToggleMute();
            }}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className={`btn-tactile-sm flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
              isMuted
                ? "bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300"
                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300"
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="text-rose-600" />
                <span className="hidden md:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-emerald-600" />
                <span className="hidden md:inline">Sound ON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
