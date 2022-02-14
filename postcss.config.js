/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const presetEnv = require('postcss-preset-env');
const px2viewport = require('postcss-px-to-viewport');

module.exports = ctx => ({
  plugins: [
    presetEnv({
      autoprefixer: {},
    }),
    px2viewport({
      unitToConvert: 'px',
      viewportWidth: 375,
      unitPrecision: 3,
      viewportUnit: 'vw',
      exclude: /^(?!.*node_modules\/zarm)/,
    }),
    px2viewport({
      unitToConvert: 'px',
      viewportWidth: 750,
      unitPrecision: 3,
      viewportUnit: 'vw',
      exclude: /node_modules\/zarm/i,
    }),
  ],
});
