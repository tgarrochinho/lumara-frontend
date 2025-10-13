/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Use 'class' strategy for dark mode - allows manual control via className="dark"
  // Set as default in the application
  darkMode: 'class',
  theme: {
    extend: {
      // Lumara brand colors - Indigo-Violet gradient
      colors: {
        brand: {
          indigo: '#6366F1',  // Primary brand color (indigo)
          violet: '#8B5CF6',  // Secondary brand color (violet)
        },
        background: {
          dark: '#0A0E1A',    // Deep dark background for dark mode
        },
      },
      // Typography configuration
      fontFamily: {
        sans: ['Inter', 'sans-serif'],               // Primary UI font
        mono: ['SF Mono', 'Monaco', 'monospace'],    // Code/monospace font
      },
    },
  },
  plugins: [],
}
