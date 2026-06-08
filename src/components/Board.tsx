import type { SquareValue } from '../game/gameLogic';
import { Square } from './Square';
import styles from './Board.module.css';

interface BoardProps {
  squares: SquareValue[];
  /** Indices of the winning line, or null while the game is ongoing. */
  winningLine: number[] | null;
  /** True when no more moves are allowed (winner or draw). */
  isGameOver: boolean;
  onSquareClick: (index: number) => void;
}

export function Board({ squares, winningLine, isGameOver, onSquareClick }: BoardProps) {
  return (
    <div className={styles.board} role="grid" aria-label="Tic-tac-toe board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          label={`cell ${index + 1}`}
          isWinning={winningLine?.includes(index) ?? false}
          disabled={value !== null || isGameOver}
          onClick={() => onSquareClick(index)}
        />
      ))}
    </div>
  );
}
