/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-navy': '#0a0f1c',
        'neon-green': '#00ff9d',
        'cyber-blue': '#00d4ff',
        'cyber-purple': '#bd00ff',
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 157, 0.5)',
        'neon-green-lg': '0 0 40px rgba(0, 255, 157, 0.6)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
