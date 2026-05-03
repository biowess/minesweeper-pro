import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../state/useGameStore';
import { Trophy, Skull, RotateCcw } from 'lucide-react';

export const GameOverModal: React.FC = () => {
  const { status, initGame } = useGameStore();

  const isGameOver = status === 'won' || status === 'lost';

  return (
    <AnimatePresence>
      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="perf-base-shadow bg-[var(--color-sapphire-card)] backdrop-blur-xl px-7 py-4 rounded-full shadow-[0_10px_40px_rgba(3,7,18,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-1 ring-cyan-500/20 flex items-center gap-5">
            <div className="flex items-center gap-3">
              {status === 'won' ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
                    <Trophy size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-mono font-bold text-indigo-100 uppercase tracking-[3px] text-xs">System Cleared</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-500 flex items-center justify-center drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                    <Skull size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-mono font-bold text-rose-100 uppercase tracking-[3px] text-xs">Critical Failure</span>
                </>
              )}
            </div>
            
            <div className="w-[1px] h-8 bg-slate-800" />
            
            <button
              onClick={() => initGame()}
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 rounded-full border border-slate-700 transition-all font-semibold tracking-wider text-[11px] uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] focus:outline-none"
            >
              <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform duration-300 text-cyan-400" />
              Reboot System
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
