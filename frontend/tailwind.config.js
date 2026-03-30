/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinicBlue: '#005b96', // Our premium medical blue
        clinicLight: '#f0f8ff' // Our soft background color
      }
    },
  },
  plugins: [],
}