import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "var(--color-ink)", muted: "var(--color-muted)", surface: "var(--color-surface)", line: "var(--color-line)", accent: "var(--color-accent)" },
      maxWidth: { container: "var(--container-width)" },
      borderRadius: { token: "var(--radius)" },
    },
  },
  plugins: [],
};

export default config;
