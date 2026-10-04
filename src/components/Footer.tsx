import React from "react";
import { GAME_CONFIG } from "../config";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-4 text-center mt-auto border-t border-amber-200/60 bg-amber-100/50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-bold text-slate-600">
        <p className="tracking-wide text-amber-900 font-extrabold">
          {GAME_CONFIG.FOOTER_TEXT}
        </p>
      </div>
    </footer>
  );
};
