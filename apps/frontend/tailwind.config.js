/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pokémon type colors (we'll add these based on Figma if needed)
        primary: "#EF5350",
        secondary: "#42A5F5",
      },
    },
  },
  plugins: [],
};
