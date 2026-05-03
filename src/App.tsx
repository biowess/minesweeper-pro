/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Board } from './features/minesweeper/ui/Board';
import { TopBar } from './features/minesweeper/ui/TopBar';
import { SettingsPanel } from './features/minesweeper/ui/SettingsPanel';
import { GameOverModal } from './features/minesweeper/ui/GameOverModal';
import { SplashScreen } from './features/minesweeper/ui/SplashScreen';
import { useGameStore } from './features/minesweeper/state/useGameStore';
import { MousePointer2, Flag } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { status, config, flagsPlaced, revealedCount, activeTool, setActiveTool, initGame } = useGameStore();
  const totalCells = config.rows * config.cols;
  const safeCells = totalCells - config.mines;
  const efficiency = safeCells > 0 ? Math.round((revealedCount / safeCells) * 100) : 0;
  
  // Performance Mode logic
  const [isPerformanceMode, setIsPerformanceMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('performanceMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isPerformanceMode) {
      document.documentElement.classList.add('perf-low');
      localStorage.setItem('performanceMode', 'true');
    } else {
      document.documentElement.classList.remove('perf-low');
      localStorage.setItem('performanceMode', 'false');
    }
  }, [isPerformanceMode]);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="fixed inset-0 flex flex-col bg-[#030712] font-main text-[var(--color-sapphire-text)] antialiased overflow-y-auto lg:overflow-hidden selection:bg-blue-500/30">
        
        {/* Background ambient light */}
      <div className="ambient-light absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.05),transparent_50%)] pointer-events-none" />
      <div className="ambient-light absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(129,140,248,0.05),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-[1200px] h-full mx-auto flex flex-col lg:grid lg:grid-cols-[240px_1fr_240px] lg:grid-rows-[auto_1fr_auto] gap-4 p-4 relative z-10">
        <div className="lg:col-start-1 lg:col-end-4 flex-none">
          <TopBar onSettingsClick={() => setIsSettingsOpen(true)} />
        </div>

        {/* Stats Card (Left side) */}
        <div className="flex flex-col gap-4 order-2 lg:order-none lg:row-start-2 lg:row-end-4 lg:col-start-1">
          <div className="perf-base-shadow bg-[var(--color-sapphire-card)] backdrop-blur-xl border border-[var(--color-sapphire-border)] rounded-2xl p-5 flex flex-row lg:flex-col justify-between lg:justify-start gap-4 lg:gap-6 overflow-x-auto shadow-[0_20px_50px_rgba(3,7,18,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
              <span className="text-[10px] uppercase tracking-[2px] font-semibold text-[var(--color-sapphire-dim)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Mines Remaining</span>
              <span className="font-mono text-2xl lg:text-[32px] font-bold text-[var(--color-sapphire-text)] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {Math.max(0, config.mines - flagsPlaced).toString().padStart(3, '0')}
              </span>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
              <span className="text-[10px] uppercase tracking-[2px] font-semibold text-[var(--color-sapphire-dim)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Cells Cleared</span>
              <span className="font-mono text-2xl lg:text-[32px] font-bold text-[var(--color-sapphire-text)] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {revealedCount.toString().padStart(3, '0')}
              </span>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
              <span className="text-[10px] uppercase tracking-[2px] font-semibold text-[var(--color-sapphire-dim)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Efficiency</span>
              <span className="font-mono text-2xl lg:text-[32px] font-bold text-[var(--color-sapphire-accent)] drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
                {efficiency}%
              </span>
            </div>
          </div>

          <div className="perf-base-shadow hidden lg:flex bg-[var(--color-sapphire-card)] backdrop-blur-xl border border-[var(--color-sapphire-border)] rounded-2xl p-5 flex-col gap-3 shadow-[0_20px_50px_rgba(3,7,18,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <span className="text-[10px] uppercase tracking-[2px] font-semibold text-[var(--color-sapphire-dim)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Difficulty Scope</span>
            
            <button 
              onClick={() => initGame({ rows: 9, cols: 9, mines: 10, safeFirstClickRadius: 1 })}
              className={`p-3 rounded-xl border ${config.cols === 9 ? 'border-[var(--color-sapphire-accent)] text-[var(--color-sapphire-text)] bg-cyan-500/10 shadow-[inset_0_0_15px_rgba(56,189,248,0.1)]' : 'border-transparent bg-slate-800/30 text-[var(--color-sapphire-dim)]'} text-[12px] font-medium text-left flex justify-between items-center transition-all cursor-pointer hover:bg-slate-800/50`}
            >
              <span>Novice</span><span className="font-mono text-[10px] opacity-50">9x9</span>
            </button>
            <button 
              onClick={() => initGame({ rows: 16, cols: 16, mines: 40, safeFirstClickRadius: 1 })}
              className={`p-3 rounded-xl border ${config.cols === 16 && config.rows === 16 ? 'border-[var(--color-sapphire-accent)] text-[var(--color-sapphire-text)] bg-cyan-500/10 shadow-[inset_0_0_15px_rgba(56,189,248,0.1)]' : 'border-transparent bg-slate-800/30 text-[var(--color-sapphire-dim)]'} text-[12px] font-medium text-left flex justify-between items-center transition-all cursor-pointer hover:bg-slate-800/50`}
            >
              <span>Professional</span><span className="font-mono text-[10px] opacity-50">16x16</span>
            </button>
            <button 
              onClick={() => initGame({ rows: 16, cols: 30, mines: 99, safeFirstClickRadius: 1 })}
              className={`p-3 rounded-xl border ${config.cols === 30 ? 'border-[var(--color-sapphire-accent)] text-[var(--color-sapphire-text)] bg-cyan-500/10 shadow-[inset_0_0_15px_rgba(56,189,248,0.1)]' : 'border-transparent bg-slate-800/30 text-[var(--color-sapphire-dim)]'} text-[12px] font-medium text-left flex justify-between items-center transition-all cursor-pointer hover:bg-slate-800/50`}
            >
              <span>Elite</span><span className="font-mono text-[10px] opacity-50">16x30</span>
            </button>
          </div>
        </div>

        <main className="perf-base-shadow order-1 lg:order-none lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4 relative flex flex-col min-h-[50vh] lg:min-h-0 w-full overflow-hidden bg-[#060b13] border border-slate-800/50 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          <Board />
          
          {/* Tool Selector Layer (Mobile) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-[#020617]/90 backdrop-blur-xl border border-cyan-500/20 rounded-full p-1.5 shadow-[0_10px_40px_rgba(3,7,18,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] z-30 lg:hidden">
            <button 
              onClick={() => setActiveTool('reveal')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer outline-none ${activeTool === 'reveal' ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(34,211,238,0.2)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <MousePointer2 size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Target</span>
            </button>
            <button 
              onClick={() => setActiveTool('flag')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer outline-none ${activeTool === 'flag' ? 'bg-rose-500/20 border border-rose-400/40 text-rose-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(244,63,94,0.2)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <Flag size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Mark</span>
            </button>
          </div>

          <GameOverModal />
        </main>

        <div className="hidden lg:flex flex-col gap-4 order-3 lg:order-none lg:row-start-2 lg:row-end-4 lg:col-start-3">
          {/* Controls Card (Right side) */}
          <div className="perf-base-shadow hidden lg:block bg-[var(--color-sapphire-card)] backdrop-blur-xl border border-[var(--color-sapphire-border)] rounded-2xl p-5 shadow-[0_20px_50px_rgba(3,7,18,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]">
             <span className="text-[10px] uppercase tracking-[2px] font-semibold text-[var(--color-sapphire-dim)] mb-5 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Tactile Controls</span>
             <div className="flex justify-between items-center mb-3">
               <span className="text-[12px] text-slate-300 font-medium">Target / Reveal</span>
               <span className="bg-slate-900/80 border border-slate-700/50 text-cyan-100 px-2.5 py-1 rounded text-[10px] font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] tracking-widest">L-CLICK</span>
             </div>
             <div className="flex justify-between items-center mb-3">
               <span className="text-[12px] text-slate-300 font-medium">Flag / Mark</span>
               <span className="bg-slate-900/80 border border-slate-700/50 text-rose-100 px-2.5 py-1 rounded text-[10px] font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] tracking-widest">R-CLICK</span>
             </div>
          </div>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isPerformanceMode={isPerformanceMode}
        onTogglePerformance={() => setIsPerformanceMode((prev) => !prev)}
      />
    </div>
    </>
  );
}
