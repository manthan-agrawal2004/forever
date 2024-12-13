import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-router-dom', 'react-toastify'], // Ensure react-toastify is pre-bundled
  },
  build: {
    rollupOptions: {
      external: ['react-router-dom', 'react-toastify'], // Externalize react-toastify
    },
  },
});
