/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "0.625rem",
      },
    },
  },
  plugins: [],
};
