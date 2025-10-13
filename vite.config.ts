/**
 * Vite Configuration
 *
 * This file configures Vite, the build tool and development server for Lumara.
 *
 * Key Features:
 * - React plugin with Fast Refresh (HMR) for instant updates during development
 * - Path aliases (@/*) for cleaner imports throughout the application
 * - Development server configuration with auto-open browser
 * - Production build settings with source maps for debugging
 *
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  /**
   * Vite Plugins
   *
   * @vitejs/plugin-react: Enables React Fast Refresh (HMR) and JSX transformation
   * - Provides instant feedback during development without full page reloads
   * - Preserves component state when editing
   * - Uses esbuild for fast JSX transformation
   */
  plugins: [react()],

  /**
   * Module Resolution
   *
   * Configures how modules are resolved and imported.
   *
   * Path Aliases:
   * - '@/*' maps to './src/*' for cleaner imports
   * - Example: import { Button } from '@/components/ui/Button'
   * - Must match tsconfig.app.json paths for TypeScript support
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  /**
   * Development Server Configuration
   *
   * Settings for the local development server (npm run dev).
   *
   * - port: 5173 (Vite's default port, also used by MCP tools)
   * - open: true (automatically opens browser on server start)
   * - HMR is enabled by default (no config needed)
   */
  server: {
    port: 5173,
    open: true,
  },

  /**
   * Production Build Configuration
   *
   * Settings for production builds (npm run build).
   *
   * - outDir: 'dist' (output directory for built files)
   * - sourcemap: true (generates source maps for debugging production issues)
   * - Vite automatically:
   *   - Minifies JavaScript and CSS
   *   - Tree-shakes unused code
   *   - Code-splits for optimal loading
   *   - Optimizes assets
   */
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
