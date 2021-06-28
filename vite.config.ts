import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  root: './public',
  mode: 'development',
  publicDir: 'out',
  server: {
    port: 3005,
  },
  plugins: [tsconfigPaths({ root: '../'}), reactRefresh()],
  optimizeDeps: {
    entries: ['./app/index.ts'],
    exclude: ['jquery']
  },
});
