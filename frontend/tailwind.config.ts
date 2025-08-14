import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f172a',
          100: '#0b1221',
          200: '#0f172a',
          300: '#111827'
        },
        accent: {
          DEFAULT: '#6ee7b7'
        }
      }
    }
  },
  plugins: []
} satisfies Config