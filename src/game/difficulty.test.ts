import {
  DIFFICULTIES,
  DEFAULT_DIFFICULTY,
  getDuration,
  type Difficulty,
} from './difficulty';

describe('difficulty config', () => {
  it('defines exactly three difficulty levels', () => {
    expect(DIFFICULTIES).toHaveLength(3);
  });

  it('has unique ids', () => {
    const ids = DIFFICULTIES.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives harder levels less time', () => {
    const byId = Object.fromEntries(DIFFICULTIES.map((d) => [d.id, d.durationMs]));
    expect(byId.easy).toBeGreaterThan(byId.medium);
    expect(byId.medium).toBeGreaterThan(byId.hard);
  });

  it('uses a valid default difficulty', () => {
    expect(DIFFICULTIES.some((d) => d.id === DEFAULT_DIFFICULTY)).toBe(true);
  });
});

describe('getDuration', () => {
  it.each<[Difficulty, number]>([
    ['easy', 15_000],
    ['medium', 10_000],
    ['hard', 5_000],
  ])('returns %s = %d ms', (difficulty, expected) => {
    expect(getDuration(difficulty)).toBe(expected);
  });
});
