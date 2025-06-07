import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

// Jest configuration
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
    '!src/**/index.ts',
    '!src/components/**/*.tsx',
    '!src/**/providers/*.tsx',
    '!src/**/page.tsx',
  ],
};

export default createJestConfig(customJestConfig);
