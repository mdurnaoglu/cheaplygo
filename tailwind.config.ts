import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        slateBlue: "#326273",
        chartreuse: "#C9FF05",
        page: "#F8FAFC",
        ink: "#0F172A"
      },
      boxShadow: {
        card: "0 24px 48px rgba(15, 23, 42, 0.08)",
        floating: "0 28px 70px rgba(15, 23, 42, 0.22)"
      },
      backgroundImage: {
        "hero-noise":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 26%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
