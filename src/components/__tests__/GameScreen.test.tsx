import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameScreen } from '../GameScreen';
import type { GameConfig } from '../../game/gameMode';
import type { Difficulty } from '../../game/difficulty';

const MEDIUM_MS = 10_000;
const HARD_MS = 5_000;
const AI_DELAY_MS = 500;

function pvpConfig(overrides: Partial<GameConfig> = {}): GameConfig {
  return {
    mode: 'pvp',
    difficulty: 'medium',
    playerXName: 'דני',
    playerOName: 'רותי',
    ...overrides,
  };
}

function pvcConfig(difficulty: Difficulty = 'easy'): GameConfig {
  return { mode: 'pvc', difficulty, playerXName: 'דני', playerOName: 'מחשב' };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

function setup() {
  return userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
}

function getCell(index: number): HTMLElement {
  return screen.getByRole('button', { name: new RegExp(`^cell ${index + 1}:`) });
}

function advance(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

const noop = () => {};

describe('GameScreen — gameplay (PvP)', () => {
  it('places X then O on alternating clicks', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    await user.click(getCell(0));
    expect(getCell(0)).toHaveTextContent('X');

    await user.click(getCell(1));
    expect(getCell(1)).toHaveTextContent('O');
  });

  it('shows whose turn it is, using the configured name, and switches after a move', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('דני');
    expect(status).toHaveTextContent(/\(X\)/);

    await user.click(getCell(0));
    expect(status).toHaveTextContent('רותי');
    expect(status).toHaveTextContent(/\(O\)/);
  });

  it('ignores clicks on an already-filled square', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    await user.click(getCell(0)); // X
    await user.click(getCell(0)); // ignored

    expect(getCell(0)).toHaveTextContent('X');
    expect(screen.getByRole('status')).toHaveTextContent(/\(O\)/);
  });

  it('declares the winner by name and blocks further moves', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    await user.click(getCell(0)); // X
    await user.click(getCell(3)); // O
    await user.click(getCell(1)); // X
    await user.click(getCell(4)); // O
    await user.click(getCell(2)); // X wins

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/המנצח/);
    expect(status).toHaveTextContent('דני');

    await user.click(getCell(5));
    expect(getCell(5)).toHaveTextContent('');
  });

  it('detects a draw', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    const order = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const index of order) {
      await user.click(getCell(index));
    }

    expect(screen.getByRole('status')).toHaveTextContent(/תיקו/);
  });

  it('highlights the winning line', async () => {
    const user = setup();
    const { container } = render(<GameScreen config={pvpConfig()} onExit={noop} />);

    await user.click(getCell(0));
    await user.click(getCell(3));
    await user.click(getCell(1));
    await user.click(getCell(4));
    await user.click(getCell(2)); // X wins top row

    const winningCells = within(container)
      .getAllByText(/^[XO]$/)
      .filter((el) => el.className.includes('winning'));
    expect(winningCells).toHaveLength(3);
  });

  it('restarts the board with the new-game button', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    await user.click(getCell(0));
    expect(getCell(0)).toHaveTextContent('X');

    await user.click(screen.getByRole('button', { name: 'משחק חדש' }));

    expect(getCell(0)).toHaveTextContent('');
    expect(screen.getByRole('status')).toHaveTextContent(/\(X\)/);
  });

  it('calls onExit from the back-to-home button', async () => {
    const user = setup();
    const onExit = jest.fn();
    render(<GameScreen config={pvpConfig()} onExit={onExit} />);

    await user.click(screen.getByRole('button', { name: 'חזרה לדף הבית' }));
    expect(onExit).toHaveBeenCalledTimes(1);
  });
});

describe('GameScreen — move timer', () => {
  it('forfeits the turn when time runs out without a move', () => {
    render(<GameScreen config={pvpConfig()} onExit={noop} />);
    expect(screen.getByRole('status')).toHaveTextContent(/\(X\)/);

    advance(MEDIUM_MS);

    expect(screen.getByRole('status')).toHaveTextContent(/\(O\)/);
    expect(getCell(0)).toHaveTextContent('');
  });

  it('resets the timer after a move', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    advance(4_000); // 6s left
    expect(screen.getByRole('timer')).toHaveAccessibleName(/6/);

    await user.click(getCell(0));
    expect(screen.getByRole('timer')).toHaveAccessibleName(/10/);
  });

  it('uses a shorter time on the hard difficulty', () => {
    render(<GameScreen config={pvpConfig({ difficulty: 'hard' })} onExit={noop} />);

    advance(HARD_MS);
    expect(screen.getByRole('status')).toHaveTextContent(/\(O\)/);
  });

  it('stops the timer once the game is over', async () => {
    const user = setup();
    render(<GameScreen config={pvpConfig()} onExit={noop} />);

    await user.click(getCell(0));
    await user.click(getCell(3));
    await user.click(getCell(1));
    await user.click(getCell(4));
    await user.click(getCell(2)); // X wins

    expect(screen.getByRole('status')).toHaveTextContent(/המנצח/);

    advance(MEDIUM_MS * 2);
    expect(screen.getByRole('status')).toHaveTextContent(/המנצח/);
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });
});

describe('GameScreen — vs computer', () => {
  it('lets the computer move after the human, then returns the turn to the human', async () => {
    const user = setup();
    const { container } = render(<GameScreen config={pvcConfig('easy')} onExit={noop} />);

    // Human (X) plays.
    await user.click(getCell(0));
    expect(getCell(0)).toHaveTextContent('X');
    expect(within(container).queryAllByText('O')).toHaveLength(0);

    // Computer responds after its thinking delay.
    advance(AI_DELAY_MS);

    expect(within(container).getAllByText('O')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent(/\(X\)/); // back to the human
  });
});
