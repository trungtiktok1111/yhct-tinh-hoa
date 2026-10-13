import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#14532d",
          dark: "#0f3d22",
          cream: "#faf7ec",
          gold: "#c9a227",
          danger: "#b42318",
        },
      },
    },
  },
  plugins: [],
};
export default config;
