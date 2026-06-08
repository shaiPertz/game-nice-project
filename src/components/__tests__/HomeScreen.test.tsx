import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('shows two name fields in player-vs-player mode', () => {
    render(<HomeScreen onStart={jest.fn()} />);
    expect(screen.getByLabelText('שחקן X')).toBeInTheDocument();
    expect(screen.getByLabelText('שחקן O')).toBeInTheDocument();
  });

  it('shows a single name field in vs-computer mode', async () => {
    const user = userEvent.setup();
    render(<HomeScreen onStart={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'נגד מחשב' }));

    expect(screen.getByLabelText('השם שלך')).toBeInTheDocument();
    expect(screen.queryByLabelText('שחקן O')).not.toBeInTheDocument();
  });

  it('starts a PvP game with the chosen settings', async () => {
    const user = userEvent.setup();
    const onStart = jest.fn();
    render(<HomeScreen onStart={onStart} />);

    await user.click(screen.getByRole('button', { name: 'קשה' }));
    await user.type(screen.getByLabelText('שחקן X'), 'דני');
    await user.type(screen.getByLabelText('שחקן O'), 'רותי');
    await user.click(screen.getByRole('button', { name: 'התחל משחק' }));

    expect(onStart).toHaveBeenCalledWith({
      mode: 'pvp',
      difficulty: 'hard',
      playerXName: 'דני',
      playerOName: 'רותי',
    });
  });

  it('defaults empty names and sets the computer opponent in PvC', async () => {
    const user = userEvent.setup();
    const onStart = jest.fn();
    render(<HomeScreen onStart={onStart} />);

    await user.click(screen.getByRole('button', { name: 'נגד מחשב' }));
    await user.click(screen.getByRole('button', { name: 'התחל משחק' }));

    expect(onStart).toHaveBeenCalledWith({
      mode: 'pvc',
      difficulty: 'medium',
      playerXName: 'שחקן X',
      playerOName: 'מחשב',
    });
  });
});
