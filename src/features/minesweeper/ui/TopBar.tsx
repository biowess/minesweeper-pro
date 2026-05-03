import React from 'react';
import { useGameStore } from '../state/useGameStore';
import { useTimer } from '../hooks/useTimer';
import { Settings, Hexagon, Activity, Sparkles, XOctagon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../shared/utils/cn';

interface TopBarProps {
  onSettingsClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSettingsClick }) => {
  const { status, initGame } = useGameStore();
  const elapsed = useTimer();

  let StatusIcon = Hexagon;
  let iconColor = "text-[var(--color-sapphire-dim)] drop-shadow-none";
  
  if (status === 'playing') {
    StatusIcon = Activity;
    iconColor = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]";
  }
  if (status === 'lost') {
    StatusIcon = XOctagon;
    iconColor = "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]";
  }
  if (status === 'won') {
    StatusIcon = Sparkles;
    iconColor = "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]";
  }

  return (
    <div className="perf-base-shadow flex-row justify-between items-center px-4 md:px-8 h-[60px] md:h-[80px] bg-[var(--color-sapphire-card)] backdrop-blur-xl border border-[var(--color-sapphire-border)] shadow-2xl shadow-blue-900/10 rounded-2xl flex w-full gap-2 overflow-x-auto lg:overflow-visible">
      {/* Brand */}
      <div className="text-xl md:text-2xl font-bold tracking-[4px] flex items-center gap-1 md:gap-2 shrink-0 opacity-90 drop-shadow-sm">
        M<span className="text-[var(--color-sapphire-accent)]">/</span>NE
      </div>
      
      {/* Central HUD */}
      <div className="flex items-center gap-2 md:gap-4 bg-[var(--color-sapphire-card)] backdrop-blur-md py-1.5 md:py-2.5 px-4 md:px-6 rounded-full border border-slate-800/80 shrink-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)]">
        <div className={cn("w-2 h-2 rounded-full",
          status === 'playing' ? "bg-cyan-400 shadow-[0_0_12px_#22d3ee]" :
          status === 'won' ? "bg-indigo-400 shadow-[0_0_12px_#818cf8]" :
          status === 'lost' ? "bg-rose-500 shadow-[0_0_12px_#f43f5e]" :
          "bg-slate-600 shadow-[0_0_8px_#475569]"
        )} />
        <div className="hidden sm:block font-mono text-slate-500 text-[11px] uppercase tracking-[3px] font-semibold">
          SYS_{status}
        </div>
        <div className="hidden sm:block w-[1px] h-4 bg-slate-800" />
        <div className="font-mono text-[var(--color-sapphire-text)] font-semibold text-sm md:text-lg tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          {Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)" }}
          onClick={() => initGame()}
          className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center outline-none cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-slate-800 transition-colors"
          aria-label="Restart system"
        >
          <StatusIcon size={18} className={iconColor} strokeWidth={2.5} />
        </motion.button>
        
        <div className="w-[1px] h-6 bg-slate-800" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)" }}
          onClick={onSettingsClick}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 flex items-center justify-center outline-none cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Open system settings"
        >
          <Settings size={18} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
};
