import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // You will need this to process TSX files

export default defineConfig(({ mode }) => {
  // First, load your environment variables
  const env = loadEnv(mode, '.', '');

  // Now, return a single object containing ALL your configuration
  return {
    // The base path for GitHub Pages
    base: '/eigensound-foucault/',

    // The plugin to handle React TSX files
    plugins: [react()],

    // The section to make your API key available in the app
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    // Your alias configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});