import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the build works under the /react-auto-scroll/ subpath on GitHub Pages.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      // Use the component source from this repository, so the demo always shows the current code.
      '@brianmcallister/react-auto-scroll': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
    // The component source imports React, so resolve it from the demo's own dependencies.
    dedupe: ['react', 'react-dom'],
  },
});
