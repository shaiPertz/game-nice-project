import type { SquareValue } from '../game/gameLogic';
import styles from './Square.module.css';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  /** Highlights the square when it is part of the winning line. */
  isWinning: boolean;
  /** Disables interaction (occupied square or finished game). */
  disabled: boolean;
  /** Human-readable label for accessibility / tests, e.g. "cell 1". */
  label: string;
}

export function Square({ value, onClick, isWinning, disabled, label }: SquareProps) {
  const className = [
    styles.square,
    value === 'X' ? styles.x : '',
    value === 'O' ? styles.o : '',
    isWinning ? styles.winning : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `${label}: ${value}` : `${label}: empty`}
    >
      {value}
    </button>
  );
}
