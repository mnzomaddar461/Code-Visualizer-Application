/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ এটাই মূল fix — class based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}