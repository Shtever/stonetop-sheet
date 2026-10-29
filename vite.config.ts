import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Base path matches the GitHub Pages repo name so asset URLs resolve
// correctly when served from https://<user>.github.io/stonetop-sheet/.
export default defineConfig({
  base: '/stonetop-sheet/',
  plugins: [
    react(),
    VitePWA({
      // Manifest icons are added in Phase 5 (PWA polish) once real art exists.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Stonetop Character Sheet',
        short_name: 'Stonetop',
        description: 'Offline character tracker for Stonetop',
        theme_color: '#f3ead9',
        background_color: '#f3ead9',
        display: 'standalone',
        start_url: '/stonetop-sheet/',
        scope: '/stonetop-sheet/',
      },
    }),
  ],
});
