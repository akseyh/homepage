/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,pug,js}"],
  theme: {
    extend: {},
  },
  separator: '_',
  plugins: [require('@tailwindcss/typography'),],
}

