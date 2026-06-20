import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#dce9ff",
        "on-primary-container": "#7c839b",
        "on-error-container": "#93000a",
        "surface-variant": "#d3e4fe",
        "primary-fixed": "#dae2fd",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#005236",
        "tertiary-container": "#2a1700",
        "surface-tint": "#565e74",
        "surface-container-low": "#eff4ff",
        "on-secondary-container": "#00714d",
        "surface-dim": "#cbdbf5",
        "on-primary-fixed-variant": "#3f465c",
        "on-surface": "#0b1c30",
        "tertiary-fixed-dim": "#ffb95f",
        "inverse-primary": "#bec6e0",
        "error": "#ba1a1a",
        "secondary-container": "#6cf8bb",
        "surface-container-lowest": "#ffffff",
        "on-secondary": "#ffffff",
        "error-container": "#ffdad6",
        "tertiary": "#000000",
        "secondary": "#006c49",
        "secondary-fixed-dim": "#4edea3",
        "surface-container-highest": "#d3e4fe",
        "on-tertiary-fixed": "#2a1700",
        "surface": "#f8f9ff",
        "on-primary": "#ffffff",
        "on-surface-variant": "#45464d",
        "inverse-surface": "#213145",
        "on-error": "#ffffff",
        "outline-variant": "#c6c6cd",
        "on-background": "#0b1c30",
        "primary-container": "#131b2e",
        "tertiary-fixed": "#ffddb8",
        "surface-bright": "#f8f9ff",
        "primary-fixed-dim": "#bec6e0",
        "outline": "#76777d",
        "on-tertiary-container": "#b87500",
        "inverse-on-surface": "#eaf1ff",
        "surface-container": "#e5eeff",
        "secondary-fixed": "#6ffbbe",
        "on-primary-fixed": "#131b2e",
        "primary": "#000000",
        "on-secondary-fixed": "#002113",
        "background": "#f8f9ff",
        "on-tertiary-fixed-variant": "#653e00"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "16px",
        "sidebar-collapsed": "80px",
        "sidebar-width": "280px",
        "container-padding": "24px",
        "base": "8px"
      },
      fontFamily: {
        "headline-md": ["var(--font-jakarta)", "sans-serif"],
        "label-md": ["var(--font-inter)", "sans-serif"],
        "body-lg": ["var(--font-inter)", "sans-serif"],
        "label-sm": ["var(--font-inter)", "sans-serif"],
        "headline-lg": ["var(--font-jakarta)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-jakarta)", "sans-serif"],
        "display-lg": ["var(--font-jakarta)", "sans-serif"],
        "body-md": ["var(--font-inter)", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "display-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }]
      }
    },
  },
  plugins: [],
};

export default config;
