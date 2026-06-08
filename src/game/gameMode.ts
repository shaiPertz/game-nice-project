import type { Difficulty } from './difficulty';

/** Whether the game is played against another person or the computer. */
export type GameMode = 'pvp' | 'pvc';

/** The chosen settings for a game, decided on the home screen. */
export interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  /** Name of player X (the human in a vs-computer game). */
  playerXName: string;
  /** Name of player O (the computer in a vs-computer game). */
  playerOName: string;
}

export interface GameModeOption {
  id: GameMode;
  label: string;
}

export const GAME_MODES: readonly GameModeOption[] = [
  { id: 'pvp', label: 'נגד שחקן' },
  { id: 'pvc', label: 'נגד מחשב' },
];

export const DEFAULT_GAME_MODE: GameMode = 'pvp';

/** In a player-vs-computer game the human plays X (first) and the computer plays O. */
export const HUMAN_MARK = 'X' as const;
export const COMPUTER_MARK = 'O' as const;
export const COMPUTER_NAME = 'מחשב';
