module.exports = (options = {}) => ({
  clearMocks: true,
  rootDir: '.',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testMatch: ['**/*/(spec|test).js', '**/*.(spec|test).js'],
  transform: {
    '\\.js$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  ...options,
});
