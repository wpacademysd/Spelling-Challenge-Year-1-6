import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speakEnglishWord, playTileClickSound, EnglishAccent, getEnglishAccent } from "../utils/audio";

interface AudioListenButtonProps {
  word: string;
  size?: "sm" | "md" | "lg";
  autoPlayOnMount?: boolean;
  isMuted?: boolean;
  accent?: EnglishAccent;
  label?: string;
  className?: string;
  onListen?: () => void;
}

export const AudioListenButton: React.FC<AudioListenButtonProps> = ({
  word,
  size = "lg",
  autoPlayOnMount = false,
  isMuted = false,
  accent,
  label = "LISTEN",
  className = "",
  onListen,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  React.useEffect(() => {
    if (autoPlayOnMount && !isMuted) {
      const timer = setTimeout(() => {
        handleSpeak();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [word]);

  const handleSpeak = async () => {
    if (isMuted) return;
    playTileClickSound();
    if (onListen) onListen();
    setIsSpeaking(true);
    await speakEnglishWord(word, { accent });
    setIsSpeaking(false);
  };

  const effectiveAccent = accent ?? getEnglishAccent();
  const accentFlag = effectiveAccent === "UK" ? "🇬🇧" : "🇺🇸";

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs font-bold gap-1",
    md: "px-4 py-2 text-sm font-extrabold gap-1.5",
    lg: "px-6 py-3.5 text-lg font-black gap-2.5",
  }[size];

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
  }[size];

  return (
    <button
      type="button"
      onClick={handleSpeak}
      disabled={isSpeaking || isMuted}
      aria-label={`Listen to English pronunciation of ${word} in ${effectiveAccent} accent`}
      className={`btn-tactile inline-flex items-center justify-center rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-sans tracking-wide shadow-md active:bg-amber-500 cursor-pointer disabled:opacity-85 select-none ${
        isSpeaking ? "scale-105 ring-4 ring-amber-300" : ""
      } ${sizeClasses} ${className}`}
    >
      {isMuted ? (
        <VolumeX size={iconSizes} className="text-amber-800" />
      ) : (
        <Volume2
          size={iconSizes}
          className={`${isSpeaking ? "animate-bounce text-amber-900" : "text-amber-950"}`}
        />
      )}
      <span>{isSpeaking ? "Listening..." : `🔊 ${label}`}</span>
      <span className="text-xs ml-0.5 opacity-90">{accentFlag}</span>
      {isSpeaking && (
        <span className="flex gap-0.5 ml-1">
          <span className="w-1.5 h-3 bg-amber-900 rounded-full animate-pulse" />
          <span className="w-1.5 h-5 bg-amber-900 rounded-full animate-pulse delay-75" />
          <span className="w-1.5 h-2 bg-amber-900 rounded-full animate-pulse delay-150" />
        </span>
      )}
    </button>
  );
};
