/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark1: "#222831",
        dark2: "#393E46",
        accent: "#00ADB5",
        light: "#EEEEEE",
      },
      fontFamily: {
        serif: ['"Le Jour Serif"', "serif"],
        "le-jour": ['"Le Jour Serif"', "serif"],
      },
    },
  },
  plugins: [],
};
