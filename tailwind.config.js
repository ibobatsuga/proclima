/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#253067',
          dark: '#1c244f',
          light: '#313d80',
          50: '#f0f2fb',
          100: '#e1e5f7',
        },
        brandOrange: {
          DEFAULT: '#EA6216',
          dark: '#C14E2A',
          light: '#f57a36',
          50: '#fff5ef',
        },
        surface: {
          DEFAULT: '#F6F5EF',
          light: '#FFFFFF',
          alt: '#F6F9FF',
          dark: '#EAE8DE'
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
