/**
 * Tailwind CSS Configuration
 *
 * This file configures Tailwind CSS for the Lumara application.
 *
 * Key Features:
 * - Custom brand colors (indigo-violet gradient theme)
 * - Dark mode support with 'class' strategy
 * - Custom typography with Inter font
 * - Utility-first CSS framework for rapid UI development
 *
 * @type {import('tailwindcss').Config}
 * @see https://tailwindcss.com/docs/configuration
 */
export default {
  /**
   * Content Sources
   *
   * Tells Tailwind where to look for class names to generate CSS for.
   * This enables tree-shaking - only classes actually used are included in the final bundle.
   *
   * Includes:
   * - index.html: Root HTML file
   * - src/**/*.{js,ts,jsx,tsx}: All JavaScript/TypeScript files in src
   *
   * Tailwind scans these files and generates CSS only for classes found.
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  /**
   * Dark Mode Strategy
   *
   * Using 'class' strategy for manual dark mode control.
   * - Requires 'dark' class on a parent element (usually <html> or <body>)
   * - Example: <html class="dark"> enables dark mode styles
   * - Alternative is 'media' which uses prefers-color-scheme
   *
   * Usage in CSS:
   * - bg-white → light background
   * - dark:bg-gray-900 → dark background (only when dark class is present)
   *
   * Lumara defaults to dark mode as the primary design aesthetic.
   */
  darkMode: 'class',

  theme: {
    /**
     * Theme Extension
     *
     * Extends (not replaces) Tailwind's default theme.
     * Default utilities like 'p-4', 'text-blue-500' still work.
     */
    extend: {
      /**
       * Brand Colors
       *
       * Custom color palette for Lumara's brand identity.
       * Based on an indigo-violet gradient aesthetic representing:
       * - Clarity and focus (indigo)
       * - Creativity and insight (violet)
       *
       * Usage:
       * - bg-brand-indigo → solid indigo background
       * - text-brand-violet → violet text
       * - from-brand-indigo to-brand-violet → gradient
       * - bg-background-dark → deep dark background
       *
       * Design tokens ensure consistent branding across the application.
       */
      colors: {
        brand: {
          indigo: '#6366F1',  // Primary brand color (indigo-500 equivalent)
          violet: '#8B5CF6',  // Secondary brand color (violet-500 equivalent)
        },
        background: {
          dark: '#0A0E1A',    // Deep dark background (near-black with blue tint)
        },
      },

      /**
       * Typography Configuration
       *
       * Custom font families for different text types.
       *
       * Font Stack Strategy:
       * - Primary font first
       * - System fallbacks for each platform
       * - Generic family last
       *
       * Usage:
       * - font-sans → Inter (default for all text)
       * - font-mono → SF Mono (for code snippets, technical text)
       *
       * Note: Fonts must be loaded separately (in index.html or globals.css)
       */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },

  /**
   * Plugins
   *
   * Tailwind plugins add additional utilities, components, or functionality.
   *
   * Active plugins:
   * - @tailwindcss/typography: Prose styling for markdown/rich text content
   *   Used for rendering AI responses with proper markdown formatting
   */
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
