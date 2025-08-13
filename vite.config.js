import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/workers"
  server: {
    proxy: {
      '/api': {
        target: 'https://n8n.srv853599.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
