/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        luxury: ["'Playfair Display'", 'serif'],
      },
      colors: {
        luxuryGold: '#D4AF37',
        luxuryBlack: '#181818',
      },
    },
  },
  plugins: [],
};
