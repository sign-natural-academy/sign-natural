import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite config using Tailwind "v4 plugin" approach.
 * If you use classic tailwind.config.js, remove tailwindcss() plugin and use PostCSS.
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
});
