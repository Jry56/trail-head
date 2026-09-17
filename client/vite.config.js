import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Never ship source maps to production -- keeps internals out of the
    // public bundle and shrinks the deploy artifact.
    sourcemap: false,
    // Warn if any chunk creeps back up in size so bundle bloat gets caught in CI.
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        // Split vendor code from app code, and split the biggest vendor libs
        // out on their own so a change to app code doesn't invalidate the
        // (rarely-changing) vendor cache, and the initial bundle stays small.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // react-router and react-helmet-async each pull in only their own
          // small dependency trees, so they're safe to isolate. Everything
          // else (react/react-dom and their internals like scheduler) stays
          // in one 'vendor' chunk -- splitting react itself out separately
          // caused a circular chunk (some deps need both buckets at once).
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('react-helmet-async')) return 'vendor-helmet';
          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
