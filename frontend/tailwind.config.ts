import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rausch: {
          DEFAULT: "#FF385C",
          active: "#E00B41",
          disabled: "#FFD1DA",
        },
        ink: "#222222",
        bodytext: "#3F3F3F",
        muted: {
          DEFAULT: "#6A6A6A",
          soft: "#929292",
        },
        hairline: {
          DEFAULT: "#DDDDDD",
          soft: "#EBEBEB",
          strong: "#C1C1C1",
        },
        surface: {
          soft: "#F7F7F7",
          strong: "#F2F2F2",
        },
        danger: {
          DEFAULT: "#C13515",
          hover: "#B32505",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "32px",
        full: "9999px",
      },
      boxShadow: {
        card: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.10) 0 4px 8px 0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
