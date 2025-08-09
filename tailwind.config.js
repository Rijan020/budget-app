/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        glassLight: 'rgba(255, 255, 255, 0.15)',
        glassDark: 'rgba(30, 41, 59, 0.15)'
      },
      backdropBlur: {
        xs: '5px',
      }
    }
  },
  plugins: [],
}
