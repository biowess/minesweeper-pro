import React, { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Cell } from './Cell';
import { useGameStore } from '../state/useGameStore';
import { useMeasure } from '../../../shared/hooks/useMeasure';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export const Board: React.FC = () => {
  const { board, config, reveal, toggleFlag, initGame, status, activeTool } = useGameStore();
  const { ref, bounds } = useMeasure<HTMLDivElement>();

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (activeTool === 'flag') {
      toggleFlag(r, c);
    } else {
      reveal(r, c);
    }
  }, [activeTool, toggleFlag, reveal]);

  const handleRightClick = useCallback((e: React.MouseEvent | React.TouchEvent | React.PointerEvent, r: number, c: number) => {
    e.preventDefault();
    toggleFlag(r, c);
  }, [toggleFlag]);

  if (!board) return null;

  // Sizing Logic
  const gap = 4;
  const padding = 24; // 12px padding inside the card
  
  let cellSize = 38; // Default max
  if (bounds.width > 0 && bounds.height > 0) {
    const availableWidth = bounds.width - padding;
    const availableHeight = bounds.height - padding;
    
    const maxCellWidth = (availableWidth - (config.cols - 1) * gap) / config.cols;
    const maxCellHeight = (availableHeight - (config.rows - 1) * gap) / config.rows;
    
    // Clamp between 24px and 38px
    cellSize = Math.max(24, Math.floor(Math.min(maxCellWidth, maxCellHeight, 38)));
  }

  return (
    <div ref={ref} className="flex-1 w-full h-full p-2 lg:p-[20px] relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
        panning={{ velocityDisabled: false }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center m-auto p-4">
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="perf-base-shadow bg-[var(--color-sapphire-card)] backdrop-blur-2xl p-3 md:p-5 rounded-2xl border border-cyan-500/20 shadow-[0_10px_40px_rgba(3,7,18,0.8),inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_0_20px_rgba(56,189,248,0.05)] select-none inline-block relative overflow-hidden flex-none"
          >
            {status === 'won' && (
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                className="win-shimmer absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent -skew-x-12 z-20 pointer-events-none"
              />
            )}
            <div 
              className="grid flex-none"
              style={{ 
                gap: gap + 'px',
                gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`, 
                gridTemplateRows: `repeat(${config.rows}, ${cellSize}px)` 
              }}
            >
              {board.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                  <Cell
                    key={cell.id}
                    cell={cell}
                    size={cellSize}
                    onClick={handleCellClick}
                    onRightClick={handleRightClick}
                  />
                ))
              )}
            </div>
          </motion.div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
