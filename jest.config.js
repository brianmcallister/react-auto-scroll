module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'enzyme',
  setupFilesAfterEnv: ['jest-enzyme'],
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
  testPathIgnorePatterns: ['<rootDir>/dist'],
};
