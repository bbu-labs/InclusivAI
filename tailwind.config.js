/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        inclusivai: {
          primary: "#156579",
          secondary: "#f6a823",
          accent: "#06b6d4",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-content": "#1f2937",
        },
      },
    ],
  },
};
