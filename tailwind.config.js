const { keyframes } = require('@emotion/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
       background: "#ffffff",
        foreground: "#27a567",
      },
      screens: {
        xs: '400px',
        sm: '600px', 
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [ require('flowbite/plugin')],
};
