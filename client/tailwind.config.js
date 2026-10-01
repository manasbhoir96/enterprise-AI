/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FDFBF7",
          100: "#FAF4E8",
          200: "#F3E5C8",
          300: "#E9D29F",
          400: "#DCBA6E",
          500: "#C5A059", // Imperial Banking Gold
          600: "#B38A3E", // Rich 24K Gold
          700: "#8E6A2B", // Deep Antique Gold
          800: "#6C4F22",
          900: "#4A3516",
        },
        ivory: {
          50: "#FFFFFF",
          100: "#FCFCFD",
          200: "#F8F9FA",
          300: "#F1F3F5",
          400: "#E5E7EB",
        },
        nexus: {
          950: "#0A0D14",
          900: "#111625",
          850: "#182035",
          800: "#1F2942",
          700: "#2B3758",
          600: "#3F4E75",
          accent: "#C5A059",
          cyan: "#0EA5E9",
          violet: "#8B5CF6",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#E11D48",
        },
      },
      fontFamily: {
        serif: ["'Cinzel'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        goldGlow: "0 8px 30px -4px rgba(197, 160, 89, 0.28)",
        goldSoft: "0 4px 20px 0 rgba(197, 160, 89, 0.14)",
        cardHover: "0 18px 40px -8px rgba(197, 160, 89, 0.22), 0 0 0 1px rgba(197, 160, 89, 0.35)",
        luxuryCard: "0 2px 14px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(197, 160, 89, 0.08)",
        glow: "0 0 25px -5px rgba(197, 160, 89, 0.3)",
        cyanGlow: "0 0 25px -5px rgba(197, 160, 89, 0.25)",
      },
    },
  },
  plugins: [],
};
