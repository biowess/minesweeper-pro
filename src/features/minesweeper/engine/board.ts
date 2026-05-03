import { BoardConfig, Cell } from './types';

export function createEmptyBoard(config: BoardConfig): Cell[][] {
  const { rows, cols } = config;
  const board: Cell[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        hasMine: false,
        adjacentMines: 0,
        state: 'hidden',
      });
    }
    board.push(row);
  }

  return board;
}
