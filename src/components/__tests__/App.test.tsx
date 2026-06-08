import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('App navigation', () => {
  it('moves from the home screen to the game and back', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Home screen first — no board yet.
    expect(screen.getByRole('button', { name: 'התחל משחק' })).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'התחל משחק' }));

    // Now on the game screen — the board is shown.
    expect(screen.getByRole('grid')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'חזרה לדף הבית' }));

    // Back on the home screen.
    expect(screen.getByRole('button', { name: 'התחל משחק' })).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});
