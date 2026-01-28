/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0a0a0a',
        'luxury-charcoal': '#121212',
        'luxury-gold': '#D4AF37',
        'luxury-gold-hover': '#B5952F',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
