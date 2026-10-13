import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#1b4332",
          deeper: "#0d2818",
          dark: "#0f3d22",
          sage: "#6b8f7a",
          cream: "#faf6ec",
          parchment: "#f2ead9",
          gold: "#c9a227",
          goldLight: "#e3c565",
          ink: "#2a241d",
          danger: "#b42318",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
