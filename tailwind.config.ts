import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "my-bg": "#fffffe",
        "my-headline": "#2b2c34",
        "my-paragraph": "#2b2c34",
        "my-accent-one": "#6246ea",
        "my-accent-two": "#e45858",
        "my-accent-three": "#d1d1e9",
      },
    },
  },
  plugins: [],
} satisfies Config;
