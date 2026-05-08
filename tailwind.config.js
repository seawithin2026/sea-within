/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // ⭐ FIX: Prevent Tailwind from deleting your gold + sanctuary classes
  safelist: [
    'text-golden-400',
    'text-golden-300',
    'hover:text-golden-400',
    'hover:text-golden-300',
    'btn-golden',
    'bg-sanctuary-dark',
    'bg-sanctuary-dark/90',
    'bg-sanctuary-dark/95',
    'border-white/5',
  ],

  theme: {
    extend: {
      colors: {
        sea: {
          50: '#f0fafb',
          100: '#d0f0f4',
          200: '#a1e0e9',
          300: '#6ac8d6',
          400: '#3daebb',
          500: '#2a91a1',
          600: '#237484',
          700: '#215e6b',
          800: '#214e59',
          900: '#20424c',
          950: '#0f2a33',
        },
        sand: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e6ddd0',
          300: '#d5c5b0',
          400: '#c3a98e',
          500: '#b59476',
          600: '#a8836a',
          700: '#8c6b59',
          800: '#72584c',
          900: '#5e4940',
        },
        golden: {
          50: '#fdf9ef',
          100: '#faf0d5',
          200: '#f4dea9',
          300: '#edc873',
          400: '#e5ad43', // ⭐ Your gold
          500: '#dd9527',
          600: '#c4751d',
          700: '#a3571b',
          800: '#85451d',
          900: '#6e3a1b',
        },
        sanctuary: {
          dark: '#0a1628', // ⭐ Your deep navy
          deep: '#0d1f3c',
          glow: '#1a3a5c',
        },
      },

      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        whisper: ['Cormorant', 'Georgia', 'serif'],
      },

      animation: {
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'fade-up': 'fadeUp 1.2s ease-out forwards',
        'breathe': 'breathe 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'ripple': 'ripple 3s ease-out infinite',
        'breathPulse': 'breathPulse 10s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        breathPulse: {
          '0%': {
            transform: 'scale(1)',
            opacity: '0.8',
            boxShadow: '0 0 0px rgba(229, 173, 67, 0)',
          },
          '40%': {
            transform: 'scale(1.12)',
            opacity: '1',
            boxShadow: '0 0 55px rgba(229, 173, 67, 0.55)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0.8',
            boxShadow: '0 0 0px rgba(229, 173, 67, 0)',
          },
        },
      },
    },
  },

  plugins: [],
};
