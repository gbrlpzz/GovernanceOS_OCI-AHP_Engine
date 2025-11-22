/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        swiss: {
          black: '#000000',
          white: '#FFFFFF',
          gray: '#F2F2F2',
          border: '#E5E5E5',
          darkborder: '#000000',
          text: '#000000',
          muted: '#666666',
          blue: '#0044FF',
          red: '#FF3333',
        }
      },
      borderRadius: {
        DEFAULT: '0px',
        'none': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        'full': '0px',
      },
      boxShadow: {
        'sharp': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'hover': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'flat': '0px 0px 0px 0px rgba(0, 0, 0, 0)',
      },
      backgroundImage: {
        'stripe-pattern': 'repeating-linear-gradient(45deg, #F2F2F2, #F2F2F2 10px, #FFFFFF 10px, #FFFFFF 20px)',
        'grid-pattern': 'linear-gradient(to right, #E5E5E5 1px, transparent 1px), linear-gradient(to bottom, #E5E5E5 1px, transparent 1px)',
      },
      animation: {
        'spin-square': 'spin-square 1.5s cubic-bezier(0.45, 0, 0.55, 1) infinite',
      },
      keyframes: {
        'spin-square': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(90deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(270deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    }
  },
  plugins: [],
}