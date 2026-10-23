import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const api = { '/api': { target: process.env.VITE_API_PROXY ?? 'http://localhost:3000', changeOrigin: true } };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Datos compartidos con el backend (planes y catálogo).
    alias: { '@shared': fileURLToPath(new URL('../shared', import.meta.url)) },
  },
  server: { port: 5173, proxy: api, fs: { allow: ['..'] } },
  preview: { port: 4173, proxy: api },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => (/node_modules\/(gsap|lenis)/.test(id) ? 'motion' : undefined),
      },
    },
  },
});
