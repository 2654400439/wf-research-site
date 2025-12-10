/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f6f7fb',
          100: '#eef0f7',
          200: '#d7dcee',
          300: '#b5c0e0',
          400: '#8b9fcc',
          500: '#667fc0',
          600: '#4c63ad',
          700: '#3c4f90',
          800: '#304072',
          900: '#2a355c',
        },
        accent: {
          50: '#f3fbff',
          100: '#d9f1ff',
          200: '#b8e4ff',
          300: '#86d2ff',
          400: '#4bb5ff',
          500: '#1f98ff',
          600: '#0c7be5',
          700: '#075fba',
          800: '#0a4f96',
          900: '#0f447b',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(17, 24, 39, 0.25)',
        card: '0 14px 40px -16px rgba(17, 24, 39, 0.28)',
      },
    },
  },
  plugins: [],
}

