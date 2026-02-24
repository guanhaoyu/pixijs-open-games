import { defineConfig } from 'vite';
import fullReload from 'vite-plugin-full-reload'

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    open: false
  },
  plugins: [
    // 监听 src 目录下所有 js 文件的变化，触发页面刷新
    fullReload('src/**/*.ts')
  ]
});
