module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['lcov', 'text-summary'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/test/specs/.*\\.spec\\.ts$',
};
