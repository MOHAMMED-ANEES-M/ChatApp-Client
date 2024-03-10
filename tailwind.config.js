/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#66A4B3',
        'regal-darkblue': 'rgb(60,109,121)',
        'regal-lightblue': '#76A4B3',
      },
    },
  },
  plugins: [],
}