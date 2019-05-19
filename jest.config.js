module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__tests__/**/*.spec.ts',
    '!src/**/__mocks__/**/*.ts',
  ],
  coverageReporters: ['lcov', 'text-summary'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
