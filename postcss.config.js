/* eslint-disable global-require */
const path = require('path');

module.exports = ctx => {
  const { dirname } = ctx.file;
  const { webpack } = ctx;
  const isZarm = dirname.includes(path.join('node_modules', 'zarm'));
  const isEnvDevelopment = webpack.mode === 'development';
  const isEnvProduction = webpack.mode === 'production';
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  return {
    map: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    plugins: [
      require('postcss-preset-env')({
        autoprefixer: {},
      }),
      require('postcss-px-to-viewport')({ viewportWidth: isZarm ? 375 : 750, unitPrecision: 3 }),
    ],
  };
};
