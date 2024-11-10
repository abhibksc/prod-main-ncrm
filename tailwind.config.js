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
        secondary: {
          100: "#d8f3dc",
          200: "#b7e4c7",
          300: "#95d5b2",
          400: "#74c69d",
          500: "#00BCD4",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        animation: {
          spin: "spin 1s linear infinite",
        },
      },
      backgroundImage: {
        dotted: "url('/dot-bg2.jpg')",
      },
    },
  },
  plugins: [],
};
