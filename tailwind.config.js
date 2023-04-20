/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        felt1: "url('/assets/bg1.png')",
        felt2: "url('/assets/bg2.png')",
      },
    },
  },
  plugins: [],
};
