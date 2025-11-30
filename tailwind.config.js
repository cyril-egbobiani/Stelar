/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kavoon: ["Kavoon", "cursive"],
        geist: ["Geist", "sans-serif"], // Keep Geist
        mono: ["Geist Mono", "monospace"], // Add Geist Mono
      },
      animation: {
        "fade-in-up": "fadeInUp 180ms ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      transitionDuration: {
        180: "180ms",
      },
    },
  },
  plugins: [require("tailwind-squircle2")],
};
