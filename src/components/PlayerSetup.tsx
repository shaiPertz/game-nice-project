import type { GameMode } from '../game/gameMode';
import styles from './PlayerSetup.module.css';

interface PlayerSetupProps {
  mode: GameMode;
  playerXName: string;
  playerOName: string;
  onPlayerXNameChange: (name: string) => void;
  onPlayerONameChange: (name: string) => void;
}

export function PlayerSetup({
  mode,
  playerXName,
  playerOName,
  onPlayerXNameChange,
  onPlayerONameChange,
}: PlayerSetupProps) {
  const isPvc = mode === 'pvc';

  return (
    <fieldset className={styles.setup}>
      <legend className={styles.legend}>{isPvc ? 'השם שלך' : 'שמות השחקנים'}</legend>

      <div className={styles.field}>
        <label htmlFor="player-x" className={styles.label}>
          {isPvc ? 'השם שלך' : 'שחקן X'}
        </label>
        <input
          id="player-x"
          type="text"
          className={styles.input}
          value={playerXName}
          placeholder={isPvc ? 'השם שלך' : 'שחקן X'}
          maxLength={20}
          onChange={(event) => onPlayerXNameChange(event.target.value)}
        />
      </div>

      {/* In player-vs-computer the opponent is the computer, so no second name field. */}
      {!isPvc && (
        <div className={styles.field}>
          <label htmlFor="player-o" className={styles.label}>
            שחקן O
          </label>
          <input
            id="player-o"
            type="text"
            className={styles.input}
            value={playerOName}
            placeholder="שחקן O"
            maxLength={20}
            onChange={(event) => onPlayerONameChange(event.target.value)}
          />
        </div>
      )}
    </fieldset>
  );
}
