import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

// biome-ignore lint/style/noDefaultExport: vite requires its config to be a default export
export default {
  plugins: [react(), tailwindcss()],
  preview: {
    port: 8000,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.json', '.ts'],
  },
  server: {
    port: 4000,
    proxy: {
      '/v1': 'http://localhost:5000',
    },
    strictPort: true,
  },
} satisfies UserConfig;
