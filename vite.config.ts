import type { UserConfigFn, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tsconfigPaths from 'vite-tsconfig-paths';
// https 开发服务提供证书支持,解决并发限制
import mkcert from 'vite-plugin-mkcert';

const defineConfig: UserConfigFn = ({ command, mode }) => {
  const config: UserConfig = {
    server: {
      https: true,
      open: true,
      proxy: {
        '/recommend_api': {
          target: 'https://api.juejin.cn',
          changeOrigin: true,
          headers: {
            Origin: '',
            Referer: '',
          },
        },
      },
    },
    plugins: [react(), tsconfigPaths(), legacy(), mkcert({})],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react'],
            'react-dom': ['react-dom'],
          },
        },
      },
    },
  };
  return config;
};

export default defineConfig;
