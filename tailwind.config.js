/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#16a34a",     // Leaf Green (Primary)
          dark: "#14532d",      // Dark Green (Hover)
          light: "#dcfce7",     // Light Green (Backgrounds)
          orange: "#f97316",    // Orange (CTA Buttons)
          yellow: "#eab308",    // Stars/Highlights
          gray: "#f3f4f6",      // Background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern Font (Google Fonts se link karna padega)
      }
    },
  },
  plugins: [],
}