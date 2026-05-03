export type CellState = 'hidden' | 'revealed' | 'flagged' | 'exploded' | 'wrongFlagged';

export interface Cell {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;
  state: CellState;
  id: string;
}

export interface BoardConfig {
  rows: number;
  cols: number;
  mines: number;
  safeFirstClickRadius: 0 | 1;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface GameState {
  config: BoardConfig;
  board: Cell[][] | null;
  status: GameStatus;
  firstMoveMade: boolean;
  flagsPlaced: number;
  revealedCount: number;
  startTime: number | null;
  endTime: number | null;
}
