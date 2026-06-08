import { useState } from 'react';
import {
  DEFAULT_GAME_MODE,
  COMPUTER_NAME,
  type GameConfig,
  type GameMode,
} from '../game/gameMode';
import { DEFAULT_DIFFICULTY, type Difficulty } from '../game/difficulty';
import { ModeSelector } from './ModeSelector';
import { DifficultySelector } from './DifficultySelector';
import { PlayerSetup } from './PlayerSetup';
import styles from './HomeScreen.module.css';

const DEFAULT_X_NAME = 'שחקן X';
const DEFAULT_O_NAME = 'שחקן O';

interface HomeScreenProps {
  onStart: (config: GameConfig) => void;
  /** Restores the previous choices when returning from a game. */
  initialConfig?: GameConfig | null;
}

export function HomeScreen({ onStart, initialConfig }: HomeScreenProps) {
  const [mode, setMode] = useState<GameMode>(initialConfig?.mode ?? DEFAULT_GAME_MODE);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialConfig?.difficulty ?? DEFAULT_DIFFICULTY,
  );
  const [playerXName, setPlayerXName] = useState(initialConfig?.playerXName ?? '');
  const [playerOName, setPlayerOName] = useState(initialConfig?.playerOName ?? '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onStart({
      mode,
      difficulty,
      playerXName: playerXName.trim() || DEFAULT_X_NAME,
      // Against the computer the opponent is always "מחשב".
      playerOName: mode === 'pvc' ? COMPUTER_NAME : playerOName.trim() || DEFAULT_O_NAME,
    });
  };

  return (
    <main className={styles.home}>
      <h1 className={styles.title}>איקס עיגול</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <ModeSelector value={mode} onChange={setMode} />
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
        <PlayerSetup
          mode={mode}
          playerXName={playerXName}
          playerOName={playerOName}
          onPlayerXNameChange={setPlayerXName}
          onPlayerONameChange={setPlayerOName}
        />

        <button type="submit" className={styles.start}>
          התחל משחק
        </button>
      </form>
    </main>
  );
}
