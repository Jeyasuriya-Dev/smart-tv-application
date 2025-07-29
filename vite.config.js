// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: './', // ✅ important for file:// based platforms like webOS

  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      renderLegacyChunks: true,
    }),
  ],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
