/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#f2f6f3',
          100: '#dfe9e1',
          600: '#2c5537',
          700: '#23432c',
          800: '#1c3524',
          900: '#152a1c',
        },
        rust: {
          500: '#b5502d',
          600: '#963f22',
        },
        slate: {
          50: '#f7f8f8',
          100: '#eef0f0',
          200: '#dde1e0',
          500: '#6b7573',
          700: '#3a4241',
          900: '#1e2322',
        },
      },
      fontFamily: {
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
