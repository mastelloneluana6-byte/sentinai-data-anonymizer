import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aurora: {
          pink: "#ff2d95",
          purple: "#7c3aed",
          azure: "#38bdf8",
        },
      },
      backgroundImage: {
        "aurora-radial":
          "radial-gradient(1200px circle at 10% 10%, rgba(255,45,149,0.35), transparent 45%), radial-gradient(900px circle at 90% 20%, rgba(124,58,237,0.32), transparent 40%), radial-gradient(800px circle at 70% 90%, rgba(56,189,248,0.28), transparent 45%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        shimmer: "shimmer 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
