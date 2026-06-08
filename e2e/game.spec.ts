import { test, expect, type Page } from '@playwright/test';

/** Locator for a board cell by its 0-based index. */
function cell(page: Page, index: number) {
  return page.getByRole('button', { name: new RegExp(`^cell ${index + 1}:`) });
}

interface StartOptions {
  mode?: 'pvp' | 'pvc';
  difficulty?: 'קל' | 'בינוני' | 'קשה';
  xName?: string;
  oName?: string;
}

/** Configures the home screen and starts the game. */
async function startGame(page: Page, opts: StartOptions = {}) {
  const { mode = 'pvp', difficulty, xName, oName } = opts;

  if (mode === 'pvc') {
    await page.getByRole('button', { name: 'נגד מחשב' }).click();
  }
  if (difficulty) {
    await page.getByRole('button', { name: difficulty }).click();
  }
  if (xName) {
    await page.getByLabel(mode === 'pvc' ? 'השם שלך' : 'שחקן X').fill(xName);
  }
  if (oName && mode === 'pvp') {
    await page.getByLabel('שחקן O').fill(oName);
  }

  await page.getByRole('button', { name: 'התחל משחק' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('players enter names and X wins with the name shown', async ({ page }) => {
  await startGame(page, { xName: 'דני', oName: 'רותי' });

  // The current-turn status reflects the entered name.
  await expect(page.getByRole('status')).toContainText('דני');

  // X (דני) wins on the top row.
  await cell(page, 0).click(); // X
  await cell(page, 3).click(); // O
  await cell(page, 1).click(); // X
  await cell(page, 4).click(); // O
  await cell(page, 2).click(); // X wins

  const status = page.getByRole('status');
  await expect(status).toContainText('המנצח');
  await expect(status).toContainText('דני');
});

test('a full board with no line ends in a draw', async ({ page }) => {
  await startGame(page);

  // X O X / X O O / O X X
  const order = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  for (const index of order) {
    await cell(page, index).click();
  }

  await expect(page.getByRole('status')).toContainText('תיקו');
});

test('new-game button clears the board and returns to player X', async ({ page }) => {
  await startGame(page, { xName: 'דני' });

  await cell(page, 0).click();
  await expect(cell(page, 0)).toHaveText('X');

  await page.getByRole('button', { name: 'משחק חדש' }).click();

  await expect(cell(page, 0)).toHaveText('');
  const status = page.getByRole('status');
  await expect(status).toContainText('דני'); // name kept
  await expect(status).toContainText('(X)'); // back to X's turn
});

test('on hard difficulty a player forfeits the turn when time runs out', async ({ page }) => {
  await startGame(page, { difficulty: 'קשה' }); // hard = 5 seconds per move

  const status = page.getByRole('status');
  await expect(status).toContainText('(X)');

  // Make no move; after the timer expires the turn passes to O.
  await expect(status).toContainText('(O)', { timeout: 8_000 });

  // No mark was placed on the board.
  await expect(cell(page, 0)).toHaveText('');
});

test('against the computer, the computer responds to the player move', async ({ page }) => {
  await startGame(page, { mode: 'pvc', difficulty: 'קל', xName: 'דני' });

  await expect(page.getByRole('status')).toContainText('דני');

  // Human plays X; the computer (O) should answer.
  await cell(page, 0).click();
  await expect(cell(page, 0)).toHaveText('X');

  const computerCells = page.getByRole('button', { name: /^cell \d+: O$/ });
  await expect(computerCells).toHaveCount(1, { timeout: 3_000 });
});

test('can return from the game to the home screen', async ({ page }) => {
  await startGame(page);
  await expect(page.getByRole('grid')).toBeVisible();

  await page.getByRole('button', { name: 'חזרה לדף הבית' }).click();

  await expect(page.getByRole('button', { name: 'התחל משחק' })).toBeVisible();
  await expect(page.getByRole('grid')).toHaveCount(0);
});
