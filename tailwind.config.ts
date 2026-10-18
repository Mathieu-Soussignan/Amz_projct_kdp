import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        display: ["var(--font-syne)", "var(--font-fraunces)", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        linen: {
          50: "#FDFBF7",
          100: "#F6F2EC",
          200: "#EBE3D5",
          300: "#DCD0BC",
        },
        autumn: {
          saffron: "#D97736",
          rust: "#C86D3B",
          bark: "#9C6644",
          deep: "#6F3618",
        },
        noel: {
          pine: "#1E4D3B",
          velvet: "#277455",
          crimson: "#C0392B",
          rose: "#E06D8C",
        },
        espresso: {
          800: "#28201B",
          900: "#17120F",
        },
        amazon: {
          DEFAULT: "#FF9900",
          warm: "#F7941D",
          dark: "#131921",
        },
      },
      boxShadow: {
        "physical-book":
          "-14px 22px 38px -6px rgba(23, 18, 15, 0.28), -4px 6px 14px -2px rgba(23, 18, 15, 0.18), inset 3px 0 6px rgba(255, 255, 255, 0.35)",
        "physical-book-hover":
          "-22px 34px 52px -8px rgba(23, 18, 15, 0.36), -6px 10px 20px -3px rgba(23, 18, 15, 0.22)",
        "editorial-card":
          "0 20px 50px -15px rgba(23, 18, 15, 0.08), 0 1px 2px rgba(23, 18, 15, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
