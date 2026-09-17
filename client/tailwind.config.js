/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Grounded in the outdoor/trail subject matter -- deep conifer green
        // as the anchor, warm rust used only as a small accent (not the
        // dominant hero color), and a stone-toned neutral scale instead of
        // a plain gray or a cream/off-white background.
        pine: {
          50: '#f2f6f3',
          100: '#dfe9e1',
          200: '#b9cfbe',
          300: '#8fb096',
          400: '#5c8a67',
          500: '#3c6c48',
          600: '#2c5537',
          700: '#23432c',
          800: '#1c3524',
          900: '#152a1c',
        },
        rust: {
          400: '#c76a3e',
          500: '#b5502d',
          600: '#963f22',
        },
        stone: {
          50: '#f7f6f3',
          100: '#eeece5',
          200: '#ddd8cc',
          300: '#c3bcab',
          400: '#a39a85',
          800: '#3a352c',
          900: '#242119',
        },
        gold: {
          400: '#d4b13f',
          500: '#c9a227',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
