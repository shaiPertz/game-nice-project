import { useCallback, useState } from 'react';
import {
  calculateWinner,
  isBoardFull,
  createEmptyBoard,
  type Player,
} from './game/gameLogic';
import { DEFAULT_DIFFICULTY, getDuration, type Difficulty } from './game/difficulty';
import { useCountdown } from './hooks/useCountdown';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { PlayerSetup } from './components/PlayerSetup';
import { DifficultySelector } from './components/DifficultySelector';
import { TurnTimer } from './components/TurnTimer';
import styles from './App.module.css';

const DEFAULT_X_NAME = 'שחקן X';
const DEFAULT_O_NAME = 'שחקן O';

function App() {
  const [squares, setSquares] = useState(createEmptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [playerXName, setPlayerXName] = useState('');
  const [playerOName, setPlayerOName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  // Increments on every turn change (move, timeout, or reset) — restarts the timer.
  const [turnId, setTurnId] = useState(0);

  // Derived state — recomputed on every render, never stored.
  const win = calculateWinner(squares);
  const isDraw = !win && isBoardFull(squares);
  const isGameOver = Boolean(win) || isDraw;
  const currentMark: Player = xIsNext ? 'X' : 'O';
  const durationMs = getDuration(difficulty);

  const nameFor = (mark: Player): string => {
    if (mark === 'X') return playerXName.trim() || DEFAULT_X_NAME;
    return playerOName.trim() || DEFAULT_O_NAME;
  };

  // When time runs out the current player forfeits the turn (no mark placed).
  const skipTurn = useCallback(() => {
    setXIsNext((prev) => !prev);
    setTurnId((id) => id + 1);
  }, []);

  const remainingMs = useCountdown({
    durationMs,
    resetKey: turnId,
    isRunning: !isGameOver,
    onExpire: skipTurn,
  });

  const handleSquareClick = (index: number) => {
    // Ignore clicks on filled squares or after the game has ended.
    if (squares[index] || win) return;

    const nextSquares = squares.slice();
    nextSquares[index] = currentMark;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    setTurnId((id) => id + 1); // restart the timer for the next player
  };

  const handleReset = () => {
    setSquares(createEmptyBoard());
    setXIsNext(true);
    setTurnId((id) => id + 1); // restart the timer (names and difficulty are kept)
  };

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>איקס עיגול</h1>

      <PlayerSetup
        playerXName={playerXName}
        playerOName={playerOName}
        onPlayerXNameChange={setPlayerXName}
        onPlayerONameChange={setPlayerOName}
      />

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

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
        isGameOver={isGameOver}
        onSquareClick={handleSquareClick}
      />

      <button type="button" className={styles.reset} onClick={handleReset}>
        משחק חדש
      </button>
    </main>
  );
}

export default App;
