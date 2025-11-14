/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'app-colors': {
          100: '#A9D9D4',
          200: '#80BFB4',
          300: '#94ea43',
          400: '#1E2615',
          500: '#0f0f0f'
        }
      },
      fontFamily: {
        'main-font': ['"Roboto"', 'sans-serif']
      }
    }
  },
  plugins: []
}
