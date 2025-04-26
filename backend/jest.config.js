// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src/', '<rootDir>/test/'],
//   testMatch: ['**/test/**/*.test.ts'],
//   collectCoverageFrom: [
//     'src/**/*.ts',
//     '!src/index.ts',
//     '!src/infrastructure/database/data-source.ts',
//     '!src/**/*.d.ts'
//   ],
//   coverageDirectory: 'coverage',
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1'
//   },
//   setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/test/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],


};