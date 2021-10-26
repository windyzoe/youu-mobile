/* eslint-disable global-require */
const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const apiMocker = require('mocker-api');

const CSS_MODULE_LOCAL_IDENT_NAME = '[local]__[hash:base64:5]';
module.exports = {
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          useBuiltIns: 'entry', // browserslist环境不支持的所有垫片都导入
          // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
          // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
          corejs: {
            version: 3, // 使用core-js@3
            proposals: true,
          },
        },
      ],
    ],
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
  },
  style: {
    modules: {
      localIdentName: CSS_MODULE_LOCAL_IDENT_NAME,
    },
    postcss: {
      mode: POSTCSS_MODES.file,
    },
  },
  eslint: {
    enable: false,
    mode: ESLINT_MODES.file,
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
    },
    ...whenProd(() => ({ devtool: 'nosources-source-map' }), {}),
    plugins: [new WebpackBar(), ...when(process.env.ANALYZE === 'true', () => [new BundleAnalyzerPlugin()], [])],
    configure: (webpackConfig, { env, paths }) => {
      return craSassToLess(webpackConfig);
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    const { before } = devServerConfig;
    // eslint-disable-next-line no-param-reassign
    devServerConfig.before = (app, server) => {
      apiMocker(app, path.resolve(__dirname, 'mock/index.js'), {});
      // before(app, server);
    };
    return devServerConfig;
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
          return splitChunksConfig(webpackConfig);
        },
      },
      options: {},
    },
  ],
};

// 骚操作,把sass的配置项都替换成了less,哈哈,sass是什么鬼,运行时要ruby
const craSassToLess = webpackConfig => {
  const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
  const sassRule = oneOfRule.oneOf.find(rule => rule.test && rule.test.toString() === /\.(scss|sass)$/.toString());
  const sassRuleModule = oneOfRule.oneOf.find(rule => rule.test && rule.test.toString() === /\.module\.(scss|sass)$/.toString());
  const sassRuleModuleLoader = sassRuleModule.use.find(loader => loader.loader && loader.loader.indexOf('sass-loader') > 0);
  const sassRuleLoader = sassRule.use.find(loader => loader.loader && loader.loader.indexOf('sass-loader') > 0);
  sassRuleModule.test = /\.less$/i;
  sassRule.test = /node_modules(.*)\.less$/i;
  delete sassRule.exclude;

  sassRuleModuleLoader.loader = require.resolve('less-loader');
  sassRuleLoader.loader = require.resolve('less-loader');
  sassRuleModuleLoader.options = {
    ...sassRuleModuleLoader.options,
    lessOptions: {
      javascriptEnabled: true,
    },
  };
  sassRuleLoader.options = {
    ...sassRuleLoader.options,
    lessOptions: {
      javascriptEnabled: true,
    },
  };
  return webpackConfig;
};

// 设计一下打包方式
const splitChunksConfig = webpackConfig => {
  const { splitChunks } = webpackConfig.optimization;
  splitChunks.cacheGroups = {
    reacts: {
      name: 'reacts',
      test: /[\\/]node_modules[\\/]((react.?))/,
      priority: 10,
    },
    zarms: {
      name: 'zarms',
      test: /[\\/]node_modules[\\/](.?zarm.?)/,
      priority: 9,
    },
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      reuseExistingChunk: true,
      priority: 8,
      enforce: true, //不用enforce,可能包太小了导致重复打包
    },
  };
  return webpackConfig;
};
