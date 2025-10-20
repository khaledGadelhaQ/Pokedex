/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    "bg-type-normal",
    "bg-type-fire",
    "bg-type-water",
    "bg-type-electric",
    "bg-type-grass",
    "bg-type-ice",
    "bg-type-fighting",
    "bg-type-poison",
    "bg-type-ground",
    "bg-type-flying",
    "bg-type-psychic",
    "bg-type-bug",
    "bg-type-rock",
    "bg-type-ghost",
    "bg-type-dragon",
    "bg-type-dark",
    "bg-type-steel",
    "bg-type-fairy",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro-display": [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        "sf-pro-text": [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Main colors from Figma
        "pokedex-bg": "#F9F9F9",
        "dark-1": "#1F2029",
        "grey-1": "#919698",
        "grey-2": "#ACB2C1",
        "grey-3": "#BABEC2",
        "grey-border": "#E6E6E8",
        "search-bg": "#EFF0F1",

        // Pokémon type colors from Figma
        "type-normal": "#A3ACAE",
        "type-fire": "#FD7D25",
        "type-water": "#4592C3",
        "type-electric": "#F4D23C",
        "type-grass": "#95C24D",
        "type-ice": "#A0D5E8",
        "type-fighting": "#D14B5A",
        "type-poison": "#BA7EC8",
        "type-ground": "#D78555",
        "type-flying": "#A1BBF3",
        "type-psychic": "#F88FB2",
        "type-bug": "#99CAAB",
        "type-rock": "#C9B787",
        "type-ghost": "#7B62A3",
        "type-dragon": "#0B6DC4",
        "type-dark": "#5A5465",
        "type-steel": "#63AEB9",
        "type-fairy": "#ECA0E5",

        // Stats colors
        "stat-red": "#DF6563",
        "stat-green": "#70C18F",

        // Level badge colors
        "level-purple": "#643CC0",
        "level-teal": "#40CEBA",
        "level-orange": "#E78B1A",
      },
      backgroundImage: {
        "detail-gradient": "linear-gradient(180deg, #7ECD8B 0%, #89E2B3 100%)",
        "team-gradient": "linear-gradient(109.73deg, #46469C 0%, #7E32E0 100%)",
        "favorites-gradient":
          "linear-gradient(109.73deg, #65CB9A 0%, #15D0DC 100%)",
        "level-purple-gradient":
          "linear-gradient(109.73deg, rgba(70, 70, 156, 0.2) 0%, rgba(126, 50, 224, 0.2) 100%)",
        "level-teal-gradient":
          "linear-gradient(109.73deg, rgba(101, 203, 154, 0.2) 0%, rgba(21, 208, 220, 0.2) 100%)",
        "level-orange-gradient":
          "linear-gradient(109.73deg, rgba(237, 202, 77, 0.3) 0%, rgba(231, 142, 29, 0.233826) 66.17%, rgba(228, 112, 5, 0.2) 100%)",
      },
      boxShadow: {
        card: "0px 15px 15px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
