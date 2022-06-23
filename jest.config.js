const path = require('path');

module.exports = {
  preset: path.resolve(__dirname, './tests/presets/typescript'),
  testEnvironment: 'node',
};
