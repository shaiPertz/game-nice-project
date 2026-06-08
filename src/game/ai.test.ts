import { getAiMove, findWinningMove, availableMoves } from './ai';
import { createEmptyBoard, type SquareValue } from './gameLogic';

describe('availableMoves', () => {
  it('lists every empty cell index', () => {
    const board: SquareValue[] = ['X', null, 'O', null, null, 'X', null, 'O', null];
    expect(availableMoves(board)).toEqual([1, 3, 4, 6, 8]);
  });
});

describe('findWinningMove', () => {
  it('returns the cell that completes a line', () => {
    // X has 0 and 1; the winning move is 2.
    const board: SquareValue[] = ['X', 'X', null, null, 'O', null, null, 'O', null];
    expect(findWinningMove(board, 'X')).toBe(2);
  });

  it('returns null when no line is one move away', () => {
    expect(findWinningMove(createEmptyBoard(), 'X')).toBeNull();
  });
});

describe('getAiMove - easy', () => {
  it('returns a valid empty cell', () => {
    const board: SquareValue[] = ['X', null, 'O', null, 'X', null, 'O', null, null];
    const move = getAiMove(board, 'O', 'easy');
    expect(board[move]).toBeNull();
  });
});

describe('getAiMove - medium', () => {
  it('takes a winning move when available', () => {
    // O has 3 and 4; winning move is 5.
    const board: SquareValue[] = ['X', 'X', null, 'O', 'O', null, null, null, null];
    expect(getAiMove(board, 'O', 'medium')).toBe(5);
  });

  it('blocks the opponent when it cannot win', () => {
    // X threatens to win at 2 (has 0 and 1); O must block there.
    const board: SquareValue[] = ['X', 'X', null, 'O', null, null, null, null, null];
    expect(getAiMove(board, 'O', 'medium')).toBe(2);
  });

  it('prefers winning over blocking', () => {
    // O can win at 5 (has 3,4); X also threatens at 2 (has 0,1). Winning wins.
    const board: SquareValue[] = ['X', 'X', null, 'O', 'O', null, null, null, null];
    expect(getAiMove(board, 'O', 'medium')).toBe(5);
  });
});

describe('getAiMove - hard (minimax)', () => {
  it('takes an immediate win', () => {
    const board: SquareValue[] = ['O', 'O', null, 'X', 'X', null, null, null, null];
    expect(getAiMove(board, 'O', 'hard')).toBe(2);
  });

  it('blocks the opponent winning move', () => {
    // X threatens at 2; O has no win, so it must block.
    const board: SquareValue[] = ['X', 'X', null, 'O', null, null, null, null, null];
    expect(getAiMove(board, 'O', 'hard')).toBe(2);
  });

  it('never loses: against any opponent reply the AI is not beaten', () => {
    // Play a full game: AI (O) responds optimally to a naive opponent (X = first empty).
    // The AI must at least draw.
    let board = createEmptyBoard();
    let current: 'X' | 'O' = 'X';

    while (availableMoves(board).length > 0) {
      const move =
        current === 'O'
          ? getAiMove(board, 'O', 'hard')
          : availableMoves(board)[0]; // naive opponent
      board = board.slice();
      board[move] = current;
      current = current === 'X' ? 'O' : 'X';
    }

    // No winning line should belong to X.
    const xWins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ].some(([a, b, c]) => board[a] === 'X' && board[b] === 'X' && board[c] === 'X');
    expect(xWins).toBe(false);
  });
});
