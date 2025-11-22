import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Fix "process is not defined" error in browser
      'process.env': {
        API_KEY: env.API_KEY,
        NODE_ENV: mode,
      },
      // Polyfill global for some older libraries
      'global': 'window',
    }
  };
});