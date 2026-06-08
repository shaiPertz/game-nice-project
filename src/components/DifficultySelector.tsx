import { DIFFICULTIES, type Difficulty } from '../game/difficulty';
import styles from './DifficultySelector.module.css';

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className={styles.selector}>
      <span className={styles.label}>רמת קושי:</span>
      <div className={styles.buttons} role="group" aria-label="רמת קושי">
        {DIFFICULTIES.map((option) => {
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
