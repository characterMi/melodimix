import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xss: "440px",
        ...defaultTheme.screens,
      },
      keyframes: {
        skeleton: {
          "0%": { transform: "translate(-100%, -100%) rotateZ(45deg)" },
          "100%": { transform: "translate(100%, 150%) rotateZ(45deg)" },
        },
        spinner: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        grow: {
          "0%": { transform: "scale(1, 1)" },
          "50%": { transform: "scale(1, 0.4)" },
        },
      },
      animation: {
        skeleton: "skeleton 8s linear infinite",
        spinner: "spinner 1s linear infinite",
        grow: "grow 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
