/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        ink: "#172033",
        muted: "#667085",
        paper: "#f7f4ee",
        line: "#d9ded7",
        readiness: "#2563eb",
        implementation: "#15803d",
        quality: "#7c3aed",
        equity: "#d97706",
        tealGroup: "#0f766e",
        blueGroup: "#2563eb",
        purpleGroup: "#7c3aed",
        amberGroup: "#d97706"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};
