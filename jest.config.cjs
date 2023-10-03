module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest'],
  },
  testMatch: ['**/__tests__/*.(mjs|ts|tsx)', '**/__test__/*.(js|ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', 'example/', 'dist/'],
  setupFilesAfterEnv: ['<rootDir>/.configs/jest.setup.js'],
  moduleDirectories: ['node_modules', 'src', __dirname],
};
