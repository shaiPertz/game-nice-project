import { useState } from 'react';
import {
  calculateWinner,
  isBoardFull,
  createEmptyBoard,
  type Player,
} from './game/gameLogic';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { PlayerSetup } from './components/PlayerSetup';
import styles from './App.module.css';

const DEFAULT_X_NAME = 'שחקן X';
const DEFAULT_O_NAME = 'שחקן O';

function App() {
  const [squares, setSquares] = useState(createEmptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [playerXName, setPlayerXName] = useState('');
  const [playerOName, setPlayerOName] = useState('');

  // Derived state — recomputed on every render, never stored.
  const win = calculateWinner(squares);
  const isDraw = !win && isBoardFull(squares);
  const currentMark: Player = xIsNext ? 'X' : 'O';

  const nameFor = (mark: Player): string => {
    if (mark === 'X') return playerXName.trim() || DEFAULT_X_NAME;
    return playerOName.trim() || DEFAULT_O_NAME;
  };

  const handleSquareClick = (index: number) => {
    // Ignore clicks on filled squares or after the game has ended.
    if (squares[index] || win) return;

    const nextSquares = squares.slice();
    nextSquares[index] = currentMark;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setSquares(createEmptyBoard());
    setXIsNext(true);
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

      <GameStatus
        currentPlayerName={nameFor(currentMark)}
        currentPlayerMark={currentMark}
        winnerName={win ? nameFor(win.winner) : null}
        isDraw={isDraw}
      />

      <Board
        squares={squares}
        winningLine={win?.line ?? null}
        isGameOver={Boolean(win) || isDraw}
        onSquareClick={handleSquareClick}
      />

      <button type="button" className={styles.reset} onClick={handleReset}>
        משחק חדש
      </button>
    </main>
  );
}

export default App;
