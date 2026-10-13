import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        panel: "#0f1218",
        panelHover: "#141822",
        panelElevated: "#161b26",
        borderSubtle: "#1c2230",
        borderActive: "#2e384d",
        agentPros: {
          border: "#f43f5e",
          bg: "#2b0a14",
          text: "#fda4af",
        },
        agentDef: {
          border: "#be123c",
          bg: "#20060e",
          text: "#fecdd3",
        },
        agentJudge: {
          border: "#881337",
          bg: "#19050b",
          text: "#ffe4e6",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "grid-pattern": "radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-24": "24px 24px",
      },
    },
  },
  plugins: [],
};

export default config;
