/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#070A13',
          2: '#0A0E19',
        },
        panel: {
          DEFAULT: '#0D1320',
          2: '#111827',
          3: '#16202F',
        },
        edge: {
          DEFAULT: '#1E2A3A',
          soft: 'rgba(148, 163, 184, 0.12)',
        },
        brand: {
          DEFAULT: '#8B7CF6',
          50: '#F4F3FE',
          100: '#E9E7FD',
          200: '#D3CFFA',
          300: '#B5AEF5',
          400: '#9786EF',
          500: '#8B7CF6',
          600: '#6C5CE7',
          700: '#5344C8',
          800: '#3D3197',
          900: '#2A2366',
        },
        mint: {
          DEFAULT: '#34F5C5',
          400: '#5CF8D3',
          500: '#34F5C5',
          600: '#14CDA0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,124,246,0.35), 0 0 24px -4px rgba(139,124,246,0.4)',
        'glow-mint': '0 0 0 1px rgba(52,245,197,0.35), 0 0 24px -4px rgba(52,245,197,0.35)',
        panel: '0 8px 28px -12px rgba(0,0,0,0.55)',
        float: '0 14px 40px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        ticker: 'ticker 22s linear infinite',
      },
    },
  },
  plugins: [],
}