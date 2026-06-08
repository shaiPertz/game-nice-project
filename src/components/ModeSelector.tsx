import { GAME_MODES, type GameMode } from '../game/gameMode';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className={styles.selector}>
      <span className={styles.label}>מצב משחק:</span>
      <div className={styles.buttons} role="group" aria-label="מצב משחק">
        {GAME_MODES.map((option) => {
          const isSelected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              className={[styles.button, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
              aria-pressed={isSelected}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
