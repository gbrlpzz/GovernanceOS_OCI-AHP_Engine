import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Only define the API key to avoid overwriting process.env.NODE_ENV which breaks React
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});