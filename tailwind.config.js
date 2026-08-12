/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        space: {
          900: '#02030a',
          800: '#060818',
          700: '#0a0d24',
        },
        solar: {
          gold: '#ffaa00',
          orange: '#ff6a00',
          white: '#fff2e0',
        }
      }
    },
  },
  plugins: [],
}
