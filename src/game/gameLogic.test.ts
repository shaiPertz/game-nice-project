import {
  calculateWinner,
  isBoardFull,
  createEmptyBoard,
  WINNING_LINES,
  BOARD_SIZE,
  type SquareValue,
} from './gameLogic';

describe('createEmptyBoard', () => {
  it('returns a board of 9 nulls', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(BOARD_SIZE);
    expect(board.every((cell) => cell === null)).toBe(true);
  });
});

describe('calculateWinner', () => {
  it('returns null for an empty board', () => {
    expect(calculateWinner(createEmptyBoard())).toBeNull();
  });

  it('returns null when there is no winner', () => {
    // X O X
    // X O O
    // O X X  -> no line
    const board: SquareValue[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(calculateWinner(board)).toBeNull();
  });

  it('detects a win in the top row', () => {
    const board: SquareValue[] = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
    expect(calculateWinner(board)).toEqual({ winner: 'X', line: [0, 1, 2] });
  });

  it('detects a win in a column', () => {
    const board: SquareValue[] = ['O', 'X', null, 'O', 'X', null, 'O', null, null];
    expect(calculateWinner(board)).toEqual({ winner: 'O', line: [0, 3, 6] });
  });

  it('detects a win on the main diagonal', () => {
    const board: SquareValue[] = ['X', 'O', null, 'O', 'X', null, null, null, 'X'];
    expect(calculateWinner(board)).toEqual({ winner: 'X', line: [0, 4, 8] });
  });

  it('detects a win on the anti-diagonal', () => {
    const board: SquareValue[] = [null, null, 'O', null, 'O', 'X', 'O', 'X', 'X'];
    expect(calculateWinner(board)).toEqual({ winner: 'O', line: [2, 4, 6] });
  });

  it('detects a winner for every defined winning line', () => {
    for (const line of WINNING_LINES) {
      const board = createEmptyBoard();
      line.forEach((index) => {
        board[index] = 'X';
      });
      expect(calculateWinner(board)).toEqual({ winner: 'X', line });
    }
  });
});

describe('isBoardFull', () => {
  it('is false for an empty board', () => {
    expect(isBoardFull(createEmptyBoard())).toBe(false);
  });

  it('is false when at least one cell is empty', () => {
    const board: SquareValue[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
    expect(isBoardFull(board)).toBe(false);
  });

  it('is true when every cell is filled', () => {
    const board: SquareValue[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(isBoardFull(board)).toBe(true);
  });
});
