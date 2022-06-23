const deepmerge = require('deepmerge');
const defaultPreset = require('@tencent/shared-jest-tester/presets/default/jest-preset');

delete defaultPreset.setupFiles;
module.exports = deepmerge(defaultPreset, {
  moduleFileExtensions: ['ts'],
  transform: {
    '^.+\\.ts$': require.resolve('ts-jest'),
  },
});
