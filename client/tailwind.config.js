/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,jsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '2': '7fr 3fr',
        '2-even': '1fr 1fr'
      }
    },
  },
  plugins: [],
}