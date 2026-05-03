import { create } from 'zustand';
import { BoardConfig, Cell, GameState, GameStatus } from '../engine/types';
import { createEmptyBoard } from '../engine/board';
import { placeMines } from '../engine/generator';
import { revealCell } from '../engine/reveal';
import { checkWin } from '../engine/winCheck';

interface GameStore extends GameState {
  activeTool: 'reveal' | 'flag';
  initGame: (config?: Partial<BoardConfig>) => void;
  reveal: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  setActiveTool: (tool: 'reveal' | 'flag') => void;
  updateTimer: () => void;
}

const DEFAULT_CONFIG: BoardConfig = { rows: 16, cols: 16, mines: 40, safeFirstClickRadius: 1 };

export const useGameStore = create<GameStore>((set, get) => ({
  config: DEFAULT_CONFIG,
  board: null,
  status: 'idle',
  firstMoveMade: false,
  flagsPlaced: 0,
  revealedCount: 0,
  startTime: null,
  endTime: null,
  activeTool: 'reveal',

  setActiveTool: (tool) => set({ activeTool: tool }),

  initGame: (newConfig) => {
    const config = { ...get().config, ...newConfig };
    set({
      config,
      board: createEmptyBoard(config),
      status: 'idle',
      firstMoveMade: false,
      flagsPlaced: 0,
      revealedCount: 0,
      startTime: null,
      endTime: null,
    });
  },

  reveal: (row, col) => {
    const state = get();
    if (state.status === 'won' || state.status === 'lost') return;
    
    let currentBoard = state.board;
    if (!currentBoard) return;

    // Deep clone board for mutation safely
    const board = currentBoard.map(r => r.map(c => ({ ...c })));
    const cell = board[row][col];

    if (cell.state !== 'hidden') return;

    // First move logic
    let isFirstMove = false;
    if (!state.firstMoveMade) {
      placeMines(board, state.config, row, col);
      isFirstMove = true;
    }

    const { hitMine, revealedCount } = revealCell(board, row, col);
    
    let newStatus: GameStatus = state.status;
    let newEndTime: number | null = null;

    let newFlagsPlaced = state.flagsPlaced;

    if (hitMine) {
      newStatus = 'lost';
      newEndTime = Date.now();
    } else if (checkWin(board, state.config)) {
      newStatus = 'won';
      newEndTime = Date.now();
      // Auto-flag remaining mines
      for (const r of board) {
        for (const c of r) {
          if (c.hasMine && c.state !== 'flagged') {
            c.state = 'flagged';
            newFlagsPlaced++;
          }
        }
      }
    } else if (isFirstMove) {
      newStatus = 'playing';
    }

    set({
      board,
      status: isFirstMove && newStatus === 'idle' ? 'playing' : newStatus,
      firstMoveMade: true,
      flagsPlaced: newFlagsPlaced,
      revealedCount: state.revealedCount + revealedCount,
      startTime: isFirstMove ? Date.now() : state.startTime,
      endTime: newEndTime || state.endTime,
    });
  },

  toggleFlag: (row, col) => {
    const state = get();
    if (state.status === 'won' || state.status === 'lost') return;
    
    const board = state.board?.map(r => r.map(c => ({ ...c })));
    if (!board) return;

    const cell = board[row][col];
    let flagsDelta = 0;

    if (cell.state === 'hidden') {
      cell.state = 'flagged';
      flagsDelta = 1;
    } else if (cell.state === 'flagged') {
      cell.state = 'hidden';
      flagsDelta = -1;
    }

    set({
      board,
      flagsPlaced: state.flagsPlaced + flagsDelta,
    });
  },

  updateTimer: () => {
    // handled locally in TopBar or we can trigger re-renders
  }
}));
