import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Check, ExternalLink, ChevronLeft } from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import { cn } from '../../../shared/utils/cn';
import { BoardConfig } from '../engine/types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isPerformanceMode: boolean;
  onTogglePerformance: () => void;
}

const DIFFICULTIES: { name: string; label: string; config: BoardConfig }[] = [
  { name: 'beginner', label: 'Beginner (9x9, 10 mines)', config: { rows: 9, cols: 9, mines: 10, safeFirstClickRadius: 1 } },
  { name: 'intermediate', label: 'Intermediate (16x16, 40 mines)', config: { rows: 16, cols: 16, mines: 40, safeFirstClickRadius: 1 } },
  { name: 'expert', label: 'Expert (16x30, 99 mines)', config: { rows: 16, cols: 30, mines: 99, safeFirstClickRadius: 1 } },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, isPerformanceMode, onTogglePerformance }) => {
  const { config, initGame } = useGameStore();
  const [view, setView] = useState<'main' | 'about'>('main');

  const handleDifficultySelect = (newConfig: BoardConfig) => {
    initGame(newConfig);
    onClose();
  };

  const isCurrentDifficulty = (c: BoardConfig) => 
    c.rows === config.rows && c.cols === config.cols && c.mines === config.mines;

  const handleClose = () => {
    onClose();
    // setTimeout to prevent layout jump while animating out
    setTimeout(() => setView('main'), 300);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="perf-base-shadow fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-[var(--color-sapphire-card)] backdrop-blur-2xl rounded-[20px] shadow-[0_20px_60px_rgba(3,7,18,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] z-50 overflow-hidden ring-1 ring-cyan-500/20"
          >
            {view === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-800/80 shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
                  <h2 className="text-sm font-mono font-bold tracking-[3px] text-slate-200 uppercase">System Config</h2>
                  <button
                    onClick={handleClose}
                    className="p-1 -mr-1 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-800/50 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] border border-transparent hover:border-slate-700/50"
                    aria-label="Close settings"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="p-5 space-y-6 overflow-y-auto max-h-[60vh]">
                  <section className="space-y-3">
                    <h3 className="font-mono text-[10px] tracking-[3px] text-cyan-500/70 uppercase">Difficulty Parameters</h3>
                    <div className="space-y-2">
                      {DIFFICULTIES.map((diff) => {
                        const active = isCurrentDifficulty(diff.config);
                        return (
                          <button
                            key={diff.name}
                            onClick={() => handleDifficultySelect(diff.config)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]",
                              active 
                                ? "bg-cyan-500/10 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.1),inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                                : "bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                            )}
                          >
                            <span className={cn(
                              "font-medium tracking-wide text-xs",
                              active ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : "text-slate-300"
                            )}>
                              {diff.label}
                            </span>
                            {active && <Check size={16} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-mono text-[10px] tracking-[3px] text-cyan-500/70 uppercase">Operation Mode</h3>
                    <div className="space-y-2">
                      <button
                        onClick={onTogglePerformance}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                      >
                        <span className="font-medium tracking-wide text-xs text-slate-300">Performance Mode</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest",
                          isPerformanceMode ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"
                        )}>
                          {isPerformanceMode ? 'ON' : 'OFF'}
                        </div>
                      </button>
                      <p className="text-[10px] text-slate-500 px-1 leading-relaxed">
                        Reduces visual effects for smoother performance on mobile devices
                      </p>
                    </div>
                  </section>
                  
                  <section className="space-y-3">
                    <h3 className="font-mono text-[10px] tracking-[3px] text-cyan-500/70 uppercase">Diagnostics</h3>
                    <button
                      onClick={() => setView('about')}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                    >
                      <span className="font-medium tracking-wide text-xs text-slate-300">About M/NE Database</span>
                      <ExternalLink size={14} className="text-slate-500" />
                    </button>
                  </section>
                </div>
                
                <div className="bg-[#020617]/50 p-4 border-t border-slate-800/80 shadow-[0_-1px_10px_rgba(0,0,0,0.5)] flex justify-end">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 font-mono text-[11px] uppercase tracking-[2px] font-bold rounded shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_10px_rgba(34,211,238,0.1)] hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-800/80 shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView('main')}
                      className="p-1 -ml-2 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-800/50 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] border border-transparent hover:border-slate-700/50 cursor-pointer"
                      aria-label="Go back"
                    >
                      <ChevronLeft size={18} strokeWidth={2.5} />
                    </button>
                    <h2 className="text-sm font-mono font-bold tracking-[3px] text-slate-200 uppercase">Diagnostics</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 -mr-1 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-800/50 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] border border-transparent hover:border-slate-700/50 cursor-pointer"
                    aria-label="Close settings"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="p-5 space-y-6 overflow-y-auto max-h-[60vh] text-xs leading-relaxed text-slate-400 font-medium tracking-wide">
                  <div className="space-y-4">
                    <div className="text-2xl font-[800] tracking-[4px] flex items-center gap-1 text-[var(--color-sapphire-text)] drop-shadow-sm">
                      M<span className="text-[var(--color-sapphire-accent)]">/</span>NE
                    </div>
                    <p className="text-slate-300">
                      A premium, tactile recreation of the classic Minesweeper puzzle game, optimized for modern sapphire-glass interfaces and responsive mechanic actions.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-mono text-[10px] tracking-[3px] text-cyan-500/70 uppercase">Operation Protocol</h3>
                    <p>
                      Clear the board without triggering any mines. Numbers indicate how many mines are adjacent to that specific block. 
                      Use these clues to deduce safe paths to excavate.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-mono text-[10px] tracking-[3px] text-cyan-500/70 uppercase">Tactical Input</h3>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li><strong>Target:</strong> Left-click or tap.</li>
                      <li><strong>Mark:</strong> Right-click, long-press, or switch to Flag mode via the tool selector to manually mark mines.</li>
                      <li><strong>Lens:</strong> Use the mouse wheel or stretch via two-finger touch gestures to inspect large boards.</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between uppercase tracking-wider">
                    <span>Build 1.2.0</span>
                    <span>© 2026 M.O.D</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
