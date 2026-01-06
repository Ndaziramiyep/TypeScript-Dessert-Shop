/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dessert-primary': '#F59E0B',
        'dessert-secondary': '#EF4444',
        'dessert-accent': '#8B5CF6',
        'dessert-light': '#FEF3C7',
        'dessert-dark': '#92400E',
      },
      fontFamily: {
        'sweet': ['"Comic Neue"', 'cursive'],
        'display': ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}