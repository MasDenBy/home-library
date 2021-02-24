module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
      '**/?(*.)+(spec|test).ts?(x)'
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },

    // Code Coverage
    collectCoverage: false,
    coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  }