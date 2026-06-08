import { test, expect, type Page } from '@playwright/test';

/** Locator for a board cell by its 0-based index. */
function cell(page: Page, index: number) {
  return page.getByRole('button', { name: new RegExp(`^cell ${index + 1}:`) });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('players enter names and X wins with the name shown', async ({ page }) => {
  await page.getByLabel('שחקן X').fill('דני');
  await page.getByLabel('שחקן O').fill('רותי');

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
  // X O X / X O O / O X X
  const order = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  for (const index of order) {
    await cell(page, index).click();
  }

  await expect(page.getByRole('status')).toContainText('תיקו');
});

test('reset clears the board and returns to player X, keeping names', async ({ page }) => {
  await page.getByLabel('שחקן X').fill('דני');

  await cell(page, 0).click();
  await expect(cell(page, 0)).toHaveText('X');

  await page.getByRole('button', { name: 'משחק חדש' }).click();

  await expect(cell(page, 0)).toHaveText('');
  const status = page.getByRole('status');
  await expect(status).toContainText('דני'); // name preserved
  await expect(status).toContainText('(X)'); // back to X's turn
});

test('on hard difficulty a player forfeits the turn when time runs out', async ({ page }) => {
  // Hard = 5 seconds per move.
  await page.getByRole('button', { name: 'קשה' }).click();

  const status = page.getByRole('status');
  await expect(status).toContainText('(X)');

  // Make no move; after the timer expires the turn passes to O.
  await expect(status).toContainText('(O)', { timeout: 8_000 });

  // No mark was placed on the board.
  await expect(cell(page, 0)).toHaveText('');
});
