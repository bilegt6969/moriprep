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
        // Family Brand Colors
        primary: {
          DEFAULT: "#282624",
          light: "#474645",
          dark: "#121212",
        },
        // Accent Colors
        accent: {
          green: "#44c67f",
          orange: "#ff5310",
          blue: "#6187fe",
          brightBlue: "#018dff",
          magenta: "#f966ac",
          lime: "#34c759",
          success: "#00c454",
        },
        // Neutral Colors
        neutral: {
          warm: "#474645",
          dark: "#262626",
          medium: "#343433",
          light: "#848281",
        },
        // Background Colors
        background: {
          light: "#f6f4ef",
          DEFAULT: "#f6f4ef",
        },
        // Semantic Colors
        error: "#ff4e4e",
        warning: "#f6c30f",
        success: "#44c67f",

        // CSS Variable Mappings (for components that use var() notation)
        app: {
          blue: "var(--blue, #6187fe)",
          gray: "var(--gray, #848281)",
          green: "var(--green, #44c67f)",
          pink: "var(--pink, #f966ac)",
          beige: "var(--beige, #f6f4ef)",
          gold: "var(--gold, #febE44)",
        },
        heading: "var(--heading, #282624)",
        body: "var(--body, #282624)",
        bodyMuted: "var(--body-muted, #848281)",
      },
      fontFamily: {
        // Geist Sans fonts
        sans: [
          "Geist Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["Geist Mono", "system-ui", "monospace"],
        // EB Garamond
        "eb-garamond": [
          "EB Garamond",
          "Georgia",
          "Times New Roman",
          "Times",
          "serif",
        ],
      },
      fontSize: {
        // Match the typography scale from the original
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      spacing: {
        // Custom spacing to match the original design
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        // Match the border radius from globals.css
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "slide-up": "slideUp 0.6s ease-out both",
        "scale-in": "scaleIn 0.4s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
