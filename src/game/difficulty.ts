/**
 * Difficulty configuration for the per-move timer.
 * Harder difficulty = less time to make a move.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyOption {
  id: Difficulty;
  label: string;
  /** Time allowed per move, in milliseconds. */
  durationMs: number;
}

export const DIFFICULTIES: readonly DifficultyOption[] = [
  { id: 'easy', label: 'קל', durationMs: 15_000 },
  { id: 'medium', label: 'בינוני', durationMs: 10_000 },
  { id: 'hard', label: 'קשה', durationMs: 5_000 },
];

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

/** Returns the time allowed per move (ms) for the given difficulty. */
export function getDuration(difficulty: Difficulty): number {
  const option = DIFFICULTIES.find((item) => item.id === difficulty);
  // DIFFICULTIES covers every Difficulty, so this fallback is unreachable in practice.
  return option ? option.durationMs : DIFFICULTIES[0].durationMs;
}
