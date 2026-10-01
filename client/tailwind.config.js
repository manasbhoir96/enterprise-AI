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
        nexus: {
          950: "#06080F",
          900: "#0B0F19",
          850: "#101626",
          800: "#161E33",
          700: "#222D4B",
          600: "#334169",
          accent: "#6366F1",
          cyan: "#06B6D4",
          violet: "#8B5CF6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.25)",
        cyanGlow: "0 0 25px -5px rgba(6, 182, 212, 0.25)",
      },
    },
  },
  plugins: [],
};
