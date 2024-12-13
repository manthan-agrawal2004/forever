import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-router-dom'], // Add this line
  },
  build: {
    rollupOptions: {
      external: ['react-router-dom'], // Add this line if you intend to externalize it
    },
  },
});