import { Cell } from './types';
import { floodFill } from './floodFill';

export interface RevealResult {
  hitMine: boolean;
  revealedCount: number;
}

export function revealCell(board: Cell[][], row: number, col: number): RevealResult {
  const cell = board[row][col];

  if (cell.state !== 'hidden') {
    return { hitMine: false, revealedCount: 0 };
  }

  if (cell.hasMine) {
    cell.state = 'exploded';
    // Reveal all other mines
    for (const r of board) {
      for (const c of r) {
        if (c.hasMine && c.state !== 'exploded' && c.state !== 'flagged') {
          c.state = 'revealed'; // or we keep it 'hidden' but show mine, let's say 'revealed' and UI handles it
        }
        if (!c.hasMine && c.state === 'flagged') {
          c.state = 'wrongFlagged';
        }
      }
    }
    return { hitMine: true, revealedCount: 0 };
  }

  const revealedItems = floodFill(board, row, col);
  return { hitMine: false, revealedCount: revealedItems.length };
}
