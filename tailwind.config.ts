import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        bg: {
          primary: "#0A0A0B",
          secondary: "#111114",
          card: "#1A1A1F",
          elevated: "#222228",
        },
        bronze: {
          dark: "#8B6914",
          DEFAULT: "#C9A227",
          light: "#D4A843",
          glow: "rgba(201, 162, 39, 0.15)",
        },
        silver: {
          dark: "#3A3A48",
          DEFAULT: "#C0C1C8",
          light: "#E0E1E8",
        },
        text: {
          primary: "#F0F0F4",
          secondary: "#B0B1B8",
          muted: "#757580",
        },
        success: "#2D6A4F",
        error: "#7B2D2D",
        warning: "#7B5E1A",
        border: {
          DEFAULT: "#2A2A35",
          active: "#C9A227",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        heading: ["'Montserrat'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'Roboto Mono'", "monospace"],
      },
      fontSize: {
        "hero-desktop": ["96px", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "hero-tablet": ["72px", { lineHeight: "1.0" }],
        "hero-mobile": ["48px", { lineHeight: "1.0" }],
        "h1-desktop": ["64px", { lineHeight: "1.1" }],
        "h1-tablet": ["48px", { lineHeight: "1.1" }],
        "h1-mobile": ["36px", { lineHeight: "1.1" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        bronze: "0 0 20px rgba(201, 162, 39, 0.3), 0 0 60px rgba(201, 162, 39, 0.1)",
        "bronze-sm": "0 0 10px rgba(201, 162, 39, 0.2)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 0 30px rgba(201, 162, 39, 0.12), 0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-bronze": "linear-gradient(135deg, #8B6914, #C9A227)",
        "gradient-bronze-hover": "linear-gradient(135deg, #C9A227, #D4A843)",
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
