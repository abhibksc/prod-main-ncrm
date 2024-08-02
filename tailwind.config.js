/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e0aaff",
          200: "#c",
          300: "#9d4edd",
          400: "#7b2cbf",
          500: "#5a189a",
          600: "#3c096c",
          700: "#240046",
          800: "#10002b",
        },
      },
      backgroundImage: {
        dotted: "url('/dot-bg2.jpg')",
      },
    },
  },
  plugins: [],
};
