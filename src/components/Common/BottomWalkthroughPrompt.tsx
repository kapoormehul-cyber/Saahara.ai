import React from 'react';
import { Sparkles, X, Compass, ArrowRight } from 'lucide-react';

interface BottomWalkthroughPromptProps {
  isOpen: boolean;
  onStartWalkthrough: () => void;
  onSkip: () => void;
}

export const BottomWalkthroughPrompt: React.FC<BottomWalkthroughPromptProps> = ({
  isOpen,
  onStartWalkthrough,
  onSkip,
}) => {
  if (!isOpen) return null;

  return (
    <aside 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300"
      role="complementary"
      aria-label="Guided tour invitation"
    >
      <div className="bg-[#180E28]/95 backdrop-blur-md border border-white/20 text-white p-4 sm:p-4.5 rounded-2xl shadow-2xl shadow-indigo-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-rose-500/20 text-rose-300 rounded-xl shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
              Would you like a guided tour of Saahara AI?
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Explore key features, safety mechanisms, and evaluator tips for AZINHACK ’26.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={onSkip}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            title="Dismiss walkthrough invitation"
          >
            Skip
          </button>

          <button
            onClick={onStartWalkthrough}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
            title="Start the guided walkthrough"
          >
            <span>Start Walkthrough</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
