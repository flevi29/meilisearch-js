// @TODO Remove this once merged with eslint updates
// eslint-disable-next-line tsdoc/syntax
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.ts?(x)'],
  verbose: true,
  testPathIgnorePatterns: ['meilisearch-test-utils', 'env'],
  collectCoverage: true,
  coverageThreshold: {
    global: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.test.json' } },
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  projects: [
    {
      preset: 'ts-jest/presets/default-esm',
      moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
      transform: { '^.+\\.ts$': ['ts-jest', { useESM: true }] },
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.ts?(x)'],
      testPathIgnorePatterns: ['meilisearch-test-utils', 'env/'],
    },
  ],
}

module.exports = config
