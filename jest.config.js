module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx)', '**/?(*.)+(spec|test).+(ts|tsx)'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: "jsdom",
    moduleNameMapper:{
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
      },
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    collectCoverageFrom: [
      'src/**/*.tsx',
      '!src/App.tsx',
      '!src/main.tsx'
    ],
  };