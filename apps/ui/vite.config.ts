import type { UserConfig } from 'vite';

// biome-ignore lint/style/noDefaultExport: vite requires its config to be a default export
export default {
  preview: {
    port: 8000,
    strictPort: true,
  },
  resolve: {
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
