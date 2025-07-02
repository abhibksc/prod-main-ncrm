/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e0aaff",
          200: "#b185db",
          300: "#9d4edd",
          400: "#7b2cbf",
          500: "#5a189a",
          600: "#3c096c",
          700: "#240046",
          800: "#10002b",
        },
        secondary: {
          500: "var(--theme-color)", // Main dynamic color
          "500-10": "rgb(var(--theme-color-rgb) / 0.1)", // Use Tailwind’s opacity syntax
          "500-20": "rgb(var(--theme-color-rgb) / 0.2)",
          "500-30": "rgb(var(--theme-color-rgb) / 0.3)",
          "500-40": "rgb(var(--theme-color-rgb) / 0.4)",
          "500-50": "rgb(var(--theme-color-rgb) / 0.5)",
          "500-60": "rgb(var(--theme-color-rgb) / 0.6)",
          "500-70": "rgb(var(--theme-color-rgb) / 0.7)",
          "500-80": "rgb(var(--theme-color-rgb) / 0.8)",
          "500-90": "rgb(var(--theme-color-rgb) / 0.9)",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        "500-10": "rgb(var(--theme-color-rgb) / 0.1)", // Uses Tailwind's opacity syntax
        "500-50": "rgb(var(--theme-color-rgb) / 0.5)", // Hover state
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      backgroundImage: {
        dotted: "url('/dot-bg2.jpg')",
      },
    },
  },
  plugins: [],
};
