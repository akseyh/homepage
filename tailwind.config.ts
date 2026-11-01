import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "#10b981",
      },
      fontFamily: {
        mono: ["JetBrains Mono Variable", "ui-monospace", "monospace"],
        sans: ["Inter Variable", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
