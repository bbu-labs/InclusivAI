export const colors = {
  // Dark presentation backgrounds
  bgDark: "#0d1b2a",
  bgCard: "#1b2838",

  // Brand colors (DaisyUI theme)
  primary: "#156579",
  secondary: "#f6a823",
  accent: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",

  // App surface colors (inside MockPhone)
  base100: "#ffffff",
  base200: "#f2f2f2",
  baseContent: "#1f2937",

  // Gradients
  heroFrom: "#17677b",
  heroVia: "#156579",
  heroTo: "#1f3549",

  // Utility
  white: "#ffffff",
  black: "#000000",
  whiteAlpha75: "rgba(255,255,255,0.75)",
  whiteAlpha50: "rgba(255,255,255,0.5)",
  whiteAlpha20: "rgba(255,255,255,0.2)",
  whiteAlpha10: "rgba(255,255,255,0.1)",
};

export const fonts = {
  heading: "Inter, sans-serif",
  body: "Inter, sans-serif",
  mono: "JetBrains Mono, monospace",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
};

export const springConfig = {
  default: { damping: 12, mass: 0.8, stiffness: 100 },
  gentle: { damping: 15, mass: 1, stiffness: 80 },
  snappy: { damping: 10, mass: 0.5, stiffness: 150 },
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 4640;
