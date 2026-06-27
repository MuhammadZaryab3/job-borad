/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0EFFE',
          100: '#E0DEFE',
          400: '#9D95FB',
          500: '#6C63FF',
          600: '#5A52E0',
          700: '#4840C2',
        },
        dark: {
          900: '#1E1B4B',
          800: '#252258',
          700: '#2D2A6A',
        },
        surface: '#F5F5FF',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(108,99,255,0.08)',
        'card-hover': '0 8px 32px rgba(108,99,255,0.16)',
      }
    },
  },
  plugins: [],
}
