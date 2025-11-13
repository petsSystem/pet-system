import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          50: "#fff7ed",
          100: "#FFEED0",
          200: "#FFD966",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FFA800",
          600: "#D48400",
          700: "#C66B00",
          800: "#A05E00",
          900: "#7c2d12",
        },
      },
    },
  },
  plugins: [],
};
export default config;
