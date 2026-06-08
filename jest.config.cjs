/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Map CSS Modules (and plain CSS) to a proxy so imports don't break in tests.
  moduleNameMapper: {
    '\\.(css|module\\.css)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  // Playwright specs live in /e2e and must not be run by Jest.
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
