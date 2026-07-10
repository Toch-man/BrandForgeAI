/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          600: '#7c3aed',
          700: '#6D28D9',
          800: '#5b21b6',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
