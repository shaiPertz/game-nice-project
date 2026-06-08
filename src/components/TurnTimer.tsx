import styles from './TurnTimer.module.css';

interface TurnTimerProps {
  remainingMs: number;
  durationMs: number;
}

/** Number of seconds at or below which the bar turns red (urgency cue). */
const URGENT_SECONDS = 3;

export function TurnTimer({ remainingMs, durationMs }: TurnTimerProps) {
  const seconds = Math.ceil(remainingMs / 1000);
  const percent = durationMs > 0 ? (remainingMs / durationMs) * 100 : 0;
  const isUrgent = seconds <= URGENT_SECONDS;

  const fillClassName = [styles.fill, isUrgent ? styles.urgent : ''].filter(Boolean).join(' ');

  return (
    <div className={styles.timer} role="timer" aria-label={`נותרו ${seconds} שניות`}>
      <div className={styles.track}>
        <div className={fillClassName} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.seconds}>{seconds}s</span>
    </div>
  );
}
