import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

/** Returns the board cell button at the given index (0-based). */
function getCell(index: number): HTMLElement {
  return screen.getByRole('button', { name: new RegExp(`^cell ${index + 1}:`) });
}

describe('App', () => {
  it('places X then O on alternating clicks', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getCell(0));
    expect(getCell(0)).toHaveTextContent('X');

    await user.click(getCell(1));
    expect(getCell(1)).toHaveTextContent('O');
  });

  it('shows whose turn it is and switches after a move', async () => {
    const user = userEvent.setup();
    render(<App />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/תור/);
    expect(status).toHaveTextContent(/\(X\)/);

    await user.click(getCell(0));
    expect(status).toHaveTextContent(/\(O\)/);
  });

  it('ignores clicks on an already-filled square', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getCell(0)); // X
    await user.click(getCell(0)); // ignored — still X, still O's turn

    expect(getCell(0)).toHaveTextContent('X');
    expect(screen.getByRole('status')).toHaveTextContent(/\(O\)/);
  });

  it('declares a winner and blocks further moves', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getCell(0)); // X
    await user.click(getCell(3)); // O
    await user.click(getCell(1)); // X
    await user.click(getCell(4)); // O
    await user.click(getCell(2)); // X wins

    expect(screen.getByRole('status')).toHaveTextContent(/המנצח/);

    await user.click(getCell(5));
    expect(getCell(5)).toHaveTextContent('');
  });

  it('uses the entered player name in the status and win message', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('שחקן X'), 'דני');
    expect(screen.getByRole('status')).toHaveTextContent('דני');

    await user.click(getCell(0));
    await user.click(getCell(3));
    await user.click(getCell(1));
    await user.click(getCell(4));
    await user.click(getCell(2)); // X (דני) wins

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/המנצח/);
    expect(status).toHaveTextContent('דני');
  });

  it('falls back to a default name when the field is empty', () => {
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('שחקן X');
  });

  it('detects a draw', async () => {
    const user = userEvent.setup();
    render(<App />);

    // X O X / X O O / O X X
    const order = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const index of order) {
      await user.click(getCell(index));
    }

    expect(screen.getByRole('status')).toHaveTextContent(/תיקו/);
  });

  it('clears the board on reset but keeps player names', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('שחקן X'), 'דני');
    await user.click(getCell(0));
    expect(getCell(0)).toHaveTextContent('X');

    await user.click(screen.getByRole('button', { name: 'משחק חדש' }));

    expect(getCell(0)).toHaveTextContent('');
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('דני');
    expect(status).toHaveTextContent(/\(X\)/);
  });

  it('highlights the winning line', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(getCell(0));
    await user.click(getCell(3));
    await user.click(getCell(1));
    await user.click(getCell(4));
    await user.click(getCell(2)); // X wins on top row

    const winningCells = within(container)
      .getAllByText(/^[XO]$/)
      .filter((el) => el.className.includes('winning'));
    expect(winningCells).toHaveLength(3);
  });
});
