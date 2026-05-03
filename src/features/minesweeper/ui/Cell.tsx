import React, { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Cell as CellType } from '../engine/types';
import { cn } from '../../../shared/utils/cn';
import { Flag, X } from 'lucide-react';

interface CellProps {
  cell: CellType;
  size: number;
  onClick: (r: number, c: number) => void;
  onRightClick: (e: React.MouseEvent | React.TouchEvent | React.PointerEvent, r: number, c: number) => void;
}

const colorMap: Record<number, string> = {
  1: 'text-sky-300 drop-shadow-[0_0_8px_rgba(125,211,252,0.6)]',
  2: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]',
  3: 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]',
  4: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]',
  5: 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]',
  6: 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]',
  7: 'text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]',
  8: 'text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.6)]',
};

export const Cell: React.FC<CellProps> = React.memo(({ cell, size, onClick, onRightClick }) => {
  const isRevealed = cell.state === 'revealed' || cell.state === 'exploded' || cell.state === 'wrongFlagged';
  const isHidden = cell.state === 'hidden' || cell.state === 'flagged';
  
  const timerRef = useRef<number | null>(null);
  const touchHandled = useRef(false);
  const startPos = useRef<{ x: number, y: number } | null>(null);

  const startPointer = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') {
      touchHandled.current = false;
      startPos.current = { x: e.clientX, y: e.clientY };
      timerRef.current = window.setTimeout(() => {
        touchHandled.current = true;
        onRightClick(e, cell.row, cell.col);
      }, 500);
    }
  }, [onRightClick, cell.row, cell.col]);

  const movePointer = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch' && startPos.current) {
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > 10 || dy > 10) {
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    }
  }, []);

  const endPointer = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') {
      if (timerRef.current) clearTimeout(timerRef.current);
      startPos.current = null;
    }
  }, []);

  const cancelPointer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startPos.current = null;
  }, []);
  
  // Animation variants
  const variants = {
    hidden: { 
      rotateX: 0, 
      backgroundColor: 'var(--color-cell-hidden)',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)',
      borderColor: 'rgba(56, 189, 248, 0.1)',
    },
    revealed: { 
      rotateX: [180, 0],
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 0 rgba(0,0,0,0)',
      borderColor: 'rgba(56, 189, 248, 0.05)',
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
    },
    exploded: {
      rotateX: [180, 0],
      backgroundColor: 'var(--color-sapphire-mine)',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 0 20px rgba(159, 18, 57, 0.6)',
      borderColor: 'rgba(225, 29, 72, 0.5)',
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const getAnimateState = () => {
    if (cell.state === 'exploded') return 'exploded';
    if (isRevealed) return 'revealed';
    return 'hidden';
  };

  return (
    <motion.button
      initial={false}
      animate={getAnimateState()}
      variants={variants}
      style={{ fontSize: Math.max(12, Math.floor(size * 0.45)) + 'px', transformStyle: 'preserve-3d' }}
      whileHover={isHidden ? { scale: 1.02, filter: 'brightness(1.15) contrast(1.1)' } : undefined}
      whileTap={isHidden ? { scale: 0.96, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 0 0 rgba(0,0,0,0)' } : undefined}
      onClick={(e) => {
        if (!touchHandled.current) onClick(cell.row, cell.col);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!touchHandled.current) onRightClick(e, cell.row, cell.col);
      }}
      onPointerDown={startPointer}
      onPointerMove={movePointer}
      onPointerUp={endPointer}
      onPointerCancel={cancelPointer}
      onPointerLeave={cancelPointer}
      className={cn(
        "relative w-full h-full flex items-center justify-center rounded-sm font-mono font-bold select-none outline-none border",
        isRevealed && "backdrop-blur-sm"
      )}
    >
      {/* Subtle internal grid sheen for hidden cells */}
      {isHidden && (
        <div className="cell-sheen absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-sm" />
      )}

      {/* Content inside cell */}
      {cell.state === 'flagged' && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        >
          <Flag size={size * 0.5} strokeWidth={3} fill="currentColor" />
        </motion.div>
      )}

      {isRevealed && !cell.hasMine && cell.adjacentMines > 0 && cell.state !== 'wrongFlagged' && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={colorMap[cell.adjacentMines]}
        >
          {cell.adjacentMines}
        </motion.span>
      )}

      {isRevealed && cell.hasMine && cell.state !== 'wrongFlagged' && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: cell.state === 'exploded' ? [1, 1.1, 1] : 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-rose-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        >
          <div className="w-[1em] h-[1em] bg-current rounded-full" />
        </motion.div>
      )}

      {cell.state === 'wrongFlagged' && (
        <div className="relative flex items-center justify-center text-rose-900/50 drop-shadow-md">
          <Flag size={size * 0.5} fill="currentColor" />
          <X size={size * 0.6} className="absolute text-rose-500 drop-shadow-[0_0_5px_currentColor]" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
});
