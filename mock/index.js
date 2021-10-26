const fs = require('fs');
const path = require('path');
// mock数据
const mock = require('./mock');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// ****mocker-api的配置,不知道roadhog和mockerapi谁抄谁****
// *****
const proxy = {
  // -----代理proxy的配置-----
  _proxy: {
    proxy: {
      // key值如何定义参考： https://www.npmjs.com/package/path-to-regexp
      '/recommend_api/(.*)': 'https://api.juejin.cn/',
      '/users/(.*)': 'https://api.github.com/',
      // 示例----api =>http://localhost:9999/api
      '/api/(.*)': 'http://localhost:9999/',
    },
    pathRewrite: {
      // '^/juejin/': '/',
    },
    httpProxy: {
      options: {
        changeOrigin: true,
        // 重写origin,changeOrigin不会改origin,只改host
        headers: {
          Origin: '',
          Referer: '',
        },
      },
      listeners: {
        proxyReq: (proxyReq, req, res, options) => {
          // console.log(proxyReq, options);
        },
      },
    },
  },
  ...mock,
};
module.exports = proxy;
