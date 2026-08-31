/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6C5CE7',
          50: '#F4F3FE',
          100: '#E9E7FD',
          200: '#D3CFFA',
          300: '#B5AEF5',
          400: '#9188EE',
          500: '#6C5CE7',
          600: '#5A48D6',
          700: '#4A38B8',
          800: '#3D3197',
          900: '#332A7A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        phone: '0 25px 60px -15px rgba(0,0,0,0.35)',
        panel: '0 6px 24px -8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
