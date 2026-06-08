import { useEffect, useState } from 'react';

/** How often the countdown updates, in milliseconds (controls bar smoothness). */
const TICK_MS = 100;

interface UseCountdownOptions {
  /** Total time for the countdown, in milliseconds. */
  durationMs: number;
  /** Change this value to restart the countdown from `durationMs`. */
  resetKey: unknown;
  /** When false, the countdown is paused (e.g. the game is over). */
  isRunning: boolean;
  /** Called once when the time reaches 0 while running. Must be stable (useCallback). */
  onExpire: () => void;
}

/**
 * A reusable countdown timer. Returns the remaining time in milliseconds.
 * Restarts whenever `resetKey` or `durationMs` change, and fires `onExpire`
 * once when it reaches 0.
 */
export function useCountdown({ durationMs, resetKey, isRunning, onExpire }: UseCountdownOptions): number {
  const [remainingMs, setRemainingMs] = useState(durationMs);

  // Restart the countdown during render when the turn or duration changes — React's
  // recommended "adjust state when a prop changes" pattern (no effect needed).
  const [trackedKey, setTrackedKey] = useState(resetKey);
  const [trackedDuration, setTrackedDuration] = useState(durationMs);
  if (trackedKey !== resetKey || trackedDuration !== durationMs) {
    setTrackedKey(resetKey);
    setTrackedDuration(durationMs);
    setRemainingMs(durationMs);
  }

  // Tick down while running; the interval restarts when the turn/duration changes.
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - TICK_MS));
    }, TICK_MS);

    return () => clearInterval(intervalId);
  }, [isRunning, resetKey, durationMs]);

  // Notify the caller once the time runs out. The render-time reset above moves
  // `remainingMs` off 0 on the next turn, so this fires a single time per countdown.
  useEffect(() => {
    if (isRunning && remainingMs === 0) {
      onExpire();
    }
  }, [isRunning, remainingMs, onExpire]);

  return remainingMs;
}
