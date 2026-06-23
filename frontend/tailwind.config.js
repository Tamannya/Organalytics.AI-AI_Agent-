/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0F19',
        darkCard: '#151C2C',
        darkBorder: '#222F43',
        neonBlue: '#00F2FE',
        neonIndigo: '#4FACFE',
        neonPurple: '#818CF8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(0, 242, 254, 0.15)',
        neonPurple: '0 0 15px rgba(129, 140, 248, 0.15)',
      }
    },
  },
  plugins: [],
}
