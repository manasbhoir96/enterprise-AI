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
        void: {
          950: "#000000",
          900: "#050811",
          850: "#0B0F19", // Deep Void Background
          800: "#101626",
          700: "#172036",
        },
        hologram: {
          cyan: "#00E5FF", // Hologram Cyan
          neon: "#00FFA3", // Bull Market Neon
          purple: "#7000FF", // Quantum Purple
          risk: "#FF3366", // Risk Alert Red
        },
        gold: {
          50: "#FDFBF7",
          100: "#FAF4E8",
          200: "#F3E5C8",
          300: "#E9D29F",
          400: "#DCBA6E",
          500: "#C5A059", // Imperial Banking Gold
          600: "#B38A3E", // Rich 24K Gold
          700: "#8E6A2B",
          800: "#6C4F22",
          900: "#4A3516",
        },
        nexus: {
          950: "#050811",
          900: "#0B0F19",
          850: "#111728",
          800: "#192238",
          700: "#223050",
          600: "#32446D",
          accent: "#00E5FF",
          cyan: "#00E5FF",
          emerald: "#00FFA3",
          purple: "#7000FF",
          rose: "#FF3366",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        hologramCyan: "0 0 25px rgba(0, 229, 255, 0.35)",
        neonGreen: "0 0 25px rgba(0, 255, 163, 0.35)",
        quantumPurple: "0 0 25px rgba(112, 0, 255, 0.35)",
        riskRed: "0 0 25px rgba(255, 51, 102, 0.35)",
        glassCard: "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
        hologramGlow: "0 0 20px rgba(0, 229, 255, 0.25), 0 0 60px rgba(112, 0, 255, 0.15)",
      },
    },
  },
  plugins: [],
};
