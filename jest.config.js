module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.spec.[jt]s?(x)', '**/__tests__/*.[jt]s?(x)'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': require.resolve('ts-jest'),
  },
};
