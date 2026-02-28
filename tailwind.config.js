export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // Primary Colors - Teal
        primary: {
          DEFAULT: "#058789",
          dark: "#047071",
          light: "#5fc4eb",
        },
        // Secondary Colors - Gold
        secondary: {
          DEFAULT: "#ba9d20",
          dark: "#9b7b18",
        },
        // Accent Colors
        accent: {
          DEFAULT: "#5fc4eb",
          blue: "#5fc4eb",
          gold: "#b7b065",
          teal: "#058789",
          yellow: "#ba9d20",
        },
        // Additional Brand Colors
        light: "#b7b065",
        gold: "#b7b065",
        // Body & Background
        bodycolor: "#566593",
        bodybg: "#ffffff",
        heading: "#058789",
      },
    },
  },
};
