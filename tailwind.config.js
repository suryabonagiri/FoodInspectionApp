/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { civic: { 50: '#edf4e9', 100: '#d9e7d2', 600: '#477451', 700: '#2d593d', 900: '#193d2a' } },
      boxShadow: { card: '0 10px 30px rgba(23, 55, 51, .08)' }
    }
  },
  plugins: []
}
