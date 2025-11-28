/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#0B0B1E", // Deepest void
          800: "#16163F", // Deep space
          700: "#242460", // Nebula dark
          500: "#6366F1", // Star blue
          300: "#A5B4FC", // Starlight
          100: "#E0E7FF", // Bright star
        },
        accent: {
          cyan: "#06B6D4",
          purple: "#8B5CF6",
          pink: "#EC4899",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backgroundImage: {
        "space-gradient": "linear-gradient(to bottom right, #0B0B1E, #16163F)",
        glass: "rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};
