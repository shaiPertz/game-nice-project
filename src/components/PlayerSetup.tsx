import styles from './PlayerSetup.module.css';

interface PlayerSetupProps {
  playerXName: string;
  playerOName: string;
  onPlayerXNameChange: (name: string) => void;
  onPlayerONameChange: (name: string) => void;
}

export function PlayerSetup({
  playerXName,
  playerOName,
  onPlayerXNameChange,
  onPlayerONameChange,
}: PlayerSetupProps) {
  return (
    <fieldset className={styles.setup}>
      <legend className={styles.legend}>שמות השחקנים</legend>

      <div className={styles.field}>
        <label htmlFor="player-x" className={styles.label}>
          שחקן X
        </label>
        <input
          id="player-x"
          type="text"
          className={styles.input}
          value={playerXName}
          placeholder="שחקן X"
          maxLength={20}
          onChange={(event) => onPlayerXNameChange(event.target.value)}
        />
      </div>

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
    </fieldset>
  );
}
