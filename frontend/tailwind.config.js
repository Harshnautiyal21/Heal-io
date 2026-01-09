/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        secondary: '#17a2b8',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        dark: {
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
