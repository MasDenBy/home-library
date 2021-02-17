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
    collectCoverage: true,

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  }