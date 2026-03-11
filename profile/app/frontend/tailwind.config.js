/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00e5a0',
        secondary: '#38bdf8',
        accent: '#a78bfa',
        warm: '#fbbf24',
        dark: '#06060e',
        darker: '#0d0f1a',
        border: '#1a1d2e',
      },
      fontFamily: {
        space: ['Space Mono', 'monospace'],
      },
      animation: {
        'orb-1': 'orb-float-1 15s ease-in-out infinite',
        'orb-2': 'orb-float-2 20s ease-in-out infinite',
        'float-cube': 'float-cube 8s ease-in-out infinite',
      },
      keyframes: {
        'orb-float-1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(30px, -30px)' },
          '50%': { transform: 'translate(-10px, 20px)' },
          '75%': { transform: 'translate(-20px, -40px)' },
        },
        'orb-float-2': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-40px, 30px)' },
          '50%': { transform: 'translate(20px, -20px)' },
          '75%': { transform: 'translate(30px, 40px)' },
        },
        'float-cube': {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '50%': { transform: 'translateY(-20px) rotateX(180deg) rotateY(180deg) rotateZ(90deg)' },
        },
      },
      backdropFilter: {
        'blur-xl': 'blur(20px)',
      },
    },
  },
  plugins: [],
}
