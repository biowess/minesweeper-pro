import { Cell } from './types';

export function floodFill(board: Cell[][], startRow: number, startCol: number): Cell[] {
  const rows = board.length;
  const cols = board[0].length;
  const revealedCells: Cell[] = [];
  const queue: { r: number; c: number }[] = [];
  const visited = new Set<string>();

  queue.push({ r: startRow, c: startCol });
  visited.add(`${startRow}-${startCol}`);

  while (queue.length > 0) {
    const { r, c } = queue.shift()!;
    const cell = board[r][c];

    if (cell.state !== 'hidden' || cell.hasMine) continue;

    // Reveal cell (we actually do mutation outside or we can do it here, let's just return revealed list or mutate here)
    // Mutating board here is fine if we are deep cloning in zustand or reducers
    cell.state = 'revealed';
    revealedCells.push(cell);

    // If zero, add neighbors
    if (cell.adjacentMines === 0) {
      for (let nr = r - 1; nr <= r + 1; nr++) {
        for (let nc = c - 1; nc <= c + 1; nc++) {
          if (nr === r && nc === c) continue;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const nId = `${nr}-${nc}`;
            if (!visited.has(nId)) {
              visited.add(nId);
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }
  }

  return revealedCells;
}
