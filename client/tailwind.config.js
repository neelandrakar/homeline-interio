/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          ivory: '#F7F5F0',
          white: '#FFFFFF',
          surface: '#EAE5DC',
          surfaceLight: '#F0ECE4',
          border: '#E1DED6',
          borderLight: '#ECE9E2'
        },
        charcoal: {
          900: '#1A1C18',
          800: '#242722',
          700: '#3D413A',
          600: '#545850',
          500: '#77776E',
          400: '#9B9B93',
          300: '#C2C1BA',
        },
        olive: {
          50: '#F4F6F2',
          100: '#E6EAE1',
          200: '#CCD5C3',
          300: '#ADBCA2',
          400: '#8C9F80',
          500: '#68745A', // Core brand accent
          600: '#545E49',
          700: '#424B3A',
          800: '#32392C',
          900: '#22271E',
        },
        wood: {
          50: '#FAF6F1',
          100: '#F2E8DC',
          200: '#E2CEB9',
          300: '#CFB092',
          400: '#B8906F',
          500: '#8C6D53', // Natural oak/walnut
          600: '#735741',
          700: '#5B4433',
          800: '#423226',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'site': '1440px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 39, 34, 0.05)',
        'elevated': '0 10px 30px -4px rgba(36, 39, 34, 0.08)',
        'drawer': '0 -4px 30px 0 rgba(36, 39, 34, 0.12)',
      }
    },
  },
  plugins: [],
}
