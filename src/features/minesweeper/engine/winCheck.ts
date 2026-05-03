import { BoardConfig, Cell } from './types';

export function checkWin(board: Cell[][], config: BoardConfig): boolean {
  const { rows, cols, mines } = config;
  let revealedCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].state === 'revealed') {
        revealedCount++;
      }
    }
  }

  const safeCells = (rows * cols) - mines;
  return revealedCount === safeCells;
}
