import type { Player } from '../game/gameLogic';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  /** Name of the player whose turn it is (ignored when the game is over). */
  currentPlayerName: string;
  /** Winner's name, or null if nobody has won. */
  winnerName: string | null;
  isDraw: boolean;
  /** Mark ('X'/'O') of the current player, for styling. */
  currentPlayerMark: Player;
}

export function GameStatus({ currentPlayerName, winnerName, isDraw, currentPlayerMark }: GameStatusProps) {
  if (winnerName) {
    return (
      <p className={styles.status} role="status">
        🎉 המנצח/ת: <strong>{winnerName}</strong>
      </p>
    );
  }

  if (isDraw) {
    return (
      <p className={styles.status} role="status">
        🤝 תיקו!
      </p>
    );
  }

  return (
    <p className={styles.status} role="status">
      תור:{' '}
      <strong className={currentPlayerMark === 'X' ? styles.x : styles.o}>
        {currentPlayerName} ({currentPlayerMark})
      </strong>
    </p>
  );
}
