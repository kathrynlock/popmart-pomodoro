/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FBF7F0',
          100: '#F6EFF7',
          200: '#F0E8F4',
          300: '#E5D8F2',
          400: '#D3B6F0',
          500: '#C77DBB',
          600: '#B29BB8',
          700: '#9B84A6',
          800: '#8C74A0',
          900: '#4A3B52',
        },
        accent: {
          pink: '#F5A0C4',
          coral: '#FFDAB5',
          orange: '#FFC58A',
          yellow: '#FAF2A8',
          green: '#DBF0BA',
          blue: '#D0E6F7',
        },
        box: {
          blush: '#FFB8D6',
          sky: '#8FC4EE',
          butter: '#F4E77E',
          meadow: '#BEE887',
          lilac: '#D8C2F2',
          apricot: '#FFBC7E',
        },
      },
      keyframes: {
        ffBreathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.045)' },
        },
        ffWiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        ffBoxShake: {
          '0%, 100%': { transform: 'translateX(0) rotate(0)' },
          '20%': { transform: 'translateX(-7px) rotate(-6deg)' },
          '40%': { transform: 'translateX(7px) rotate(6deg)' },
          '60%': { transform: 'translateX(-5px) rotate(-4deg)' },
          '80%': { transform: 'translateX(5px) rotate(4deg)' },
        },
        ffPop: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.18)' },
          '80%': { transform: 'scale(.93)' },
          '100%': { transform: 'scale(1)' },
        },
        ffLand: {
          '0%': { transform: 'translateY(-10px) scale(1.05)' },
          '55%': { transform: 'translateY(3px) scale(.98)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        ffFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-14px) rotate(var(--r, 0deg))' },
        },
        ffShimmer: {
          '0%': { backgroundPosition: '-160% 0' },
          '100%': { backgroundPosition: '260% 0' },
        },
        ffRing: {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ffModalIn: {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        ffFade: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        ffBreathe: 'ffBreathe 2.4s ease-in-out infinite',
        ffWiggle: 'ffWiggle 2.4s ease-in-out infinite',
        ffBoxShake: 'ffBoxShake 0.42s ease-in-out infinite',
        ffPop: 'ffPop 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.5)',
        ffLand: 'ffLand 0.5s ease',
        ffFloat: 'ffFloat 11s ease-in-out infinite',
        ffModalIn: 'ffModalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        ffFade: 'ffFade 0.2s ease',
      },
    },
  },
  plugins: [],
}
