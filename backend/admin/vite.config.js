import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/admin/',
  build: {
    outDir: '../../dist/admin',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
  },
});
