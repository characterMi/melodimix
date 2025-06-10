import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        skeleton: {
          "0%": { transform: "translate(-100%, -100%) rotateZ(45deg)" },
          "100%": { transform: "translate(100%, 150%) rotateZ(45deg)" },
        },
        spinner: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        skeleton: "skeleton 8s linear infinite",
        spinner: "spinner 1s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
