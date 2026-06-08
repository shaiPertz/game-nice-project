import { useCallback, useEffect, useState } from 'react';
import {
  calculateWinner,
  isBoardFull,
  createEmptyBoard,
  type Player,
} from '../game/gameLogic';
import { getDuration } from '../game/difficulty';
import { getAiMove } from '../game/ai';
import { HUMAN_MARK, COMPUTER_MARK, type GameConfig } from '../game/gameMode';
import { useCountdown } from '../hooks/useCountdown';
import { Board } from './Board';
import { GameStatus } from './GameStatus';
import { TurnTimer } from './TurnTimer';
import styles from './GameScreen.module.css';

/** How long the computer "thinks" before playing, for a natural feel. */
const AI_MOVE_DELAY_MS = 500;

interface GameScreenProps {
  config: GameConfig;
  onExit: () => void;
}

export function GameScreen({ config, onExit }: GameScreenProps) {
  const [squares, setSquares] = useState(createEmptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  // Increments on every turn change (move, timeout, or reset) — restarts the timer.
  const [turnId, setTurnId] = useState(0);

  const isPvc = config.mode === 'pvc';

  // Derived state — recomputed on every render, never stored.
  const win = calculateWinner(squares);
  const isDraw = !win && isBoardFull(squares);
  const isGameOver = Boolean(win) || isDraw;
  const currentMark: Player = xIsNext ? 'X' : 'O';
  const durationMs = getDuration(config.difficulty);

  const isComputerTurn = isPvc && currentMark === COMPUTER_MARK;
  const isHumanTurn = !isPvc || currentMark === HUMAN_MARK;

  const nameFor = (mark: Player): string =>
    mark === 'X' ? config.playerXName : config.playerOName;

  // Shared by human clicks and computer moves. The mark is passed in so the turn
  // stays driven by `xIsNext` (deriving it from the board would break after a skip).
  const placeMark = useCallback((index: number, mark: Player) => {
    setSquares((prev) => {
      if (prev[index] || calculateWinner(prev)) return prev; // occupied or game over
      const next = prev.slice();
      next[index] = mark;
      return next;
    });
    setXIsNext((prev) => !prev);
    setTurnId((id) => id + 1);
  }, []);

  // When time runs out the current player forfeits the turn (no mark placed).
  const skipTurn = useCallback(() => {
    setXIsNext((prev) => !prev);
    setTurnId((id) => id + 1);
  }, []);

  const remainingMs = useCountdown({
    durationMs,
    resetKey: turnId,
    // The timer only runs on the human's turn (in PvC the computer plays instantly).
    isRunning: !isGameOver && isHumanTurn,
    onExpire: skipTurn,
  });

  // Let the computer play on its turn.
  useEffect(() => {
    if (!isComputerTurn || isGameOver) return;

    const timeoutId = setTimeout(() => {
      const move = getAiMove(squares, COMPUTER_MARK, config.difficulty);
      placeMark(move, COMPUTER_MARK);
    }, AI_MOVE_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [isComputerTurn, isGameOver, squares, config.difficulty, placeMark]);

  const handleSquareClick = (index: number) => {
    if (squares[index] || isGameOver || isComputerTurn) return;
    placeMark(index, currentMark);
  };

  const handleRestart = () => {
    setSquares(createEmptyBoard());
    setXIsNext(true);
    setTurnId((id) => id + 1);
  };

  return (
    <main className={styles.game}>
      <h1 className={styles.title}>איקס עיגול</h1>

      <GameStatus
        currentPlayerName={nameFor(currentMark)}
        currentPlayerMark={currentMark}
        winnerName={win ? nameFor(win.winner) : null}
        isDraw={isDraw}
      />

      {!isGameOver && <TurnTimer remainingMs={remainingMs} durationMs={durationMs} />}

      <Board
        squares={squares}
        winningLine={win?.line ?? null}
        isGameOver={isGameOver || isComputerTurn}
        onSquareClick={handleSquareClick}
      />

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={handleRestart}>
          משחק חדש
        </button>
        <button type="button" className={styles.secondary} onClick={onExit}>
          חזרה לדף הבית
        </button>
      </div>
    </main>
  );
}
