const baseConfig = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
};

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/cli.ts'],
  coverageReporters: ['lcov', 'text-summary'],
  projects: [
    {
      displayName: 'unit',
      testRegex: '/test/unit/.*\\.spec\\.ts$',
      ...baseConfig,
    },
    {
      displayName: 'integration',
      testRegex: '/test/integration/.*\\.spec\\.ts$',
      ...baseConfig,
    },
    {
      displayName: 'e2e',
      testRegex: '/test/e2e/.*\\.spec\\.ts$',
      ...baseConfig,
    },
  ],
};
