import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/works': 'http://localhost:8080',
    },
  },
});
