import { BoardConfig, Cell } from './types';
import { shuffle } from './random';

export function placeMines(
  board: Cell[][],
  config: BoardConfig,
  firstClickRow: number,
  firstClickCol: number
): void {
  const { rows, cols, mines, safeFirstClickRadius } = config;
  const candidates: { r: number; c: number }[] = [];

  // 1. Collect candidates
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      candidates.push({ r, c });
    }
  }

  // 2. Identify safe zone
  const safeZone = new Set<string>();
  for (
    let r = firstClickRow - safeFirstClickRadius;
    r <= firstClickRow + safeFirstClickRadius;
    r++
  ) {
    for (
      let c = firstClickCol - safeFirstClickRadius;
      c <= firstClickCol + safeFirstClickRadius;
      c++
    ) {
      safeZone.add(`${r}-${c}`);
    }
  }

  // 3. Exclude safe zone from candidates
  const validCandidates = candidates.filter((pos) => !safeZone.has(`${pos.r}-${pos.c}`));

  // 4. Shuffle and select mines
  const shuffled = shuffle(validCandidates);
  const minePositions = shuffled.slice(0, mines);

  // 5. Place mines
  minePositions.forEach((pos) => {
    board[pos.r][pos.c].hasMine = true;
  });

  // 6. Compute adjacent counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].hasMine) {
        board[r][c].adjacentMines = countAdjacentMines(board, r, c, rows, cols);
      }
    }
  }
}

function countAdjacentMines(
  board: Cell[][],
  row: number,
  col: number,
  rows: number,
  cols: number
): number {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        if (board[r][c].hasMine) count++;
      }
    }
  }
  return count;
}
