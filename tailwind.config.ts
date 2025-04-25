/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-sidebar":
          "linear-gradient(to bottom left, #FDCE1C 2%, #FE881C 10%, #FE881C 80%, #FDCE1C 100%)",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateX(-10%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateX(0)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        hueRotate: {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "slide-bottom": {
          "0%": {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(-5px)",
          },
        },
      },
      animation: {
        "slide-bottom":
          "slide-bottom 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        hueRotate: "hueRotate 5s infinite linear",
        "spin-slow": "spin 3s linear infinite",
        "spin-fast": "spin 1s linear infinite",
        "bounce-slow": "bounce 2s infinite",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
      },
    },
  },

  plugins: [],
};
