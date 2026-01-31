/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3CA4F4',
          dark: '#2A8FD9',
        },
        dark: {
          DEFAULT: '#1E1E1E',
          50: '#2D2D2D',
          100: '#1A1A1A',
        },
        gray: {
          50: '#F9FAFB',
          light: '#DFDFDF',
          medium: '#8E8E8E',
        },
      },
      borderRadius: {
        'card': '15px',
      },
    },
  },
  plugins: [],
}
