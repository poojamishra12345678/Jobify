/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a5ff',
          500: '#3182f6',
          600: '#1c63e0',
          700: '#174fb5',
          800: '#18428f',
          900: '#193a72',
          950: '#122447'
        },
        accent: {
          50: '#effef8',
          100: '#c9fee9',
          200: '#94fcd6',
          300: '#54f2bd',
          400: '#20dea0',
          500: '#0bc287',
          600: '#049c6e',
          700: '#087c5c',
          800: '#0b624a',
          900: '#0c513f'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(15, 23, 42, 0.06)',
        card: '0 6px 24px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
