/**
 * Computer opponent logic. Pure functions — no React, no DOM.
 * The strength of the AI scales with the chosen difficulty.
 */

import {
  calculateWinner,
  WINNING_LINES,
  type Player,
  type SquareValue,
} from './gameLogic';
import type { Difficulty } from './difficulty';

/** Returns the indices of all empty cells. */
export function availableMoves(squares: SquareValue[]): number[] {
  return squares.reduce<number[]>((moves, value, index) => {
    if (value === null) moves.push(index);
    return moves;
  }, []);
}

/** The mark opposing the given one. */
function opponentOf(mark: Player): Player {
  return mark === 'X' ? 'O' : 'X';
}

/**
 * Finds a move that immediately completes a line for `mark`, or null if none.
 * Used both to win (mark = AI) and to block (mark = opponent).
 */
export function findWinningMove(squares: SquareValue[], mark: Player): number | null {
  for (const [a, b, c] of WINNING_LINES) {
    const line = [a, b, c];
    const marks = line.map((i) => squares[i]);
    const owned = marks.filter((value) => value === mark).length;
    const empties = line.filter((i) => squares[i] === null);
    if (owned === 2 && empties.length === 1) {
      return empties[0];
    }
  }
  return null;
}

/** Picks a random available move. The only non-deterministic part of the AI. */
function randomMove(squares: SquareValue[]): number {
  const moves = availableMoves(squares);
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}

/**
 * Minimax with depth preference — returns the optimal move for `aiMark`.
 * Prefers faster wins and slower losses so the computer plays perfectly.
 */
function minimax(
  squares: SquareValue[],
  current: Player,
  aiMark: Player,
  depth: number,
): { score: number; move: number | null } {
  const win = calculateWinner(squares);
  if (win) {
    return { score: win.winner === aiMark ? 10 - depth : depth - 10, move: null };
  }

  const moves = availableMoves(squares);
  if (moves.length === 0) {
    return { score: 0, move: null }; // draw
  }

  const isMaximizing = current === aiMark;
  let best = {
    score: isMaximizing ? -Infinity : Infinity,
    move: null as number | null,
  };

  for (const move of moves) {
    const next = squares.slice();
    next[move] = current;
    const { score } = minimax(next, opponentOf(current), aiMark, depth + 1);

    if (isMaximizing ? score > best.score : score < best.score) {
      best = { score, move };
    }
  }

  return best;
}

/** Returns the cell index the computer should play, given the difficulty. */
export function getAiMove(squares: SquareValue[], aiMark: Player, difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return randomMove(squares);

    case 'medium': {
      const winning = findWinningMove(squares, aiMark);
      if (winning !== null) return winning;

      const blocking = findWinningMove(squares, opponentOf(aiMark));
      if (blocking !== null) return blocking;

      return randomMove(squares);
    }

    case 'hard': {
      const { move } = minimax(squares, aiMark, aiMark, 0);
      return move ?? randomMove(squares);
    }
  }
}
