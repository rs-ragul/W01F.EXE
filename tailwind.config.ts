import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Syne', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'sans-serif'],
        tech: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        cyber: {
          cyan: "#00f0ff",
          blue: "#29a9ff",
          red: "#ff3b30",
          crimson: "#ff1a40",
          green: "#00ff88",
          emerald: "#10b981",
          amber: "#ffb800",
          purple: "#9d4edd",
          dark: "#030712",
          surface: "#080e1a",
          border: "#17283c",
          glow: "hsl(var(--cyber-glow))",
          "glow-secondary": "hsl(var(--cyber-glow-secondary))",
          grid: "hsl(var(--cyber-grid))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'cyber-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.4), 0 0 10px -2px rgba(0, 240, 255, 0.2)',
        'cyber-red': '0 0 25px -5px rgba(255, 59, 48, 0.4), 0 0 10px -2px rgba(255, 59, 48, 0.2)',
        'cyber-gold': '0 0 30px -5px rgba(255, 184, 0, 0.4), 0 0 10px -2px rgba(255, 184, 0, 0.2)',
        'cyber-green': '0 0 25px -5px rgba(0, 255, 136, 0.4), 0 0 10px -2px rgba(0, 255, 136, 0.2)',
        'tactical': '0 10px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--primary) / 0.5)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "scan-hud": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(150%)" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "glitch-skew": {
          "0%, 100%": { transform: "skew(0deg)" },
          "20%": { transform: "skew(-2deg)" },
          "40%": { transform: "skew(1.5deg)" },
          "60%": { transform: "skew(-1deg)" },
          "80%": { transform: "skew(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "scan-hud": "scan-hud 8s linear infinite",
        "shimmer-sweep": "shimmer-sweep 3s ease-in-out infinite",
        "radar-sweep": "radar-sweep 5s linear infinite",
        "glitch-skew": "glitch-skew 4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
