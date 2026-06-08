/**
 * Pure game logic for Tic-Tac-Toe.
 * No React, no DOM — easy to unit-test in isolation.
 */

export type Player = 'X' | 'O';
export type SquareValue = Player | null;

/** Number of cells on the board (3x3). */
export const BOARD_SIZE = 9;

/** All 8 winning combinations: 3 rows, 3 columns, 2 diagonals. */
export const WINNING_LINES: readonly number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

export interface WinResult {
  /** The player who won. */
  winner: Player;
  /** Indices of the winning line (used to highlight it in the UI). */
  line: number[];
}

/**
 * Returns the winner and the winning line, or null if there is no winner yet.
 */
export function calculateWinner(squares: SquareValue[]): WinResult | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}

/** True when every cell is filled. */
export function isBoardFull(squares: SquareValue[]): boolean {
  return squares.every((square) => square !== null);
}

/** Creates a fresh empty board. */
export function createEmptyBoard(): SquareValue[] {
  return Array<SquareValue>(BOARD_SIZE).fill(null);
}
