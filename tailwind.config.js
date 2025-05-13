/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        // Smaller text sizes for all screens
        'xs': ['clamp(0.65rem, 0.6rem + 0.15vw, 0.7rem)', { lineHeight: '1rem' }],
        'sm': ['clamp(0.7rem, 0.65rem + 0.2vw, 0.8rem)', { lineHeight: '1.2rem' }],
        'base': ['clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem)', { lineHeight: '1.4rem' }],
        'lg': ['clamp(0.9rem, 0.85rem + 0.3vw, 1rem)', { lineHeight: '1.5rem' }],
        'xl': ['clamp(1rem, 0.95rem + 0.35vw, 1.125rem)', { lineHeight: '1.6rem' }],
        '2xl': ['clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.75rem' }],
        '3xl': ['clamp(1.25rem, 1.15rem + 0.75vw, 1.5rem)', { lineHeight: '2rem' }],
        '4xl': ['clamp(1.5rem, 1.4rem + 1vw, 1.875rem)', { lineHeight: '2.25rem' }],
        '5xl': ['clamp(1.875rem, 1.7rem + 1.25vw, 2.25rem)', { lineHeight: '1' }],
        '6xl': ['clamp(2.25rem, 2rem + 1.5vw, 3rem)', { lineHeight: '1' }],
        // Additional responsive text sizes
        'mobile-xs': ['0.6rem', { lineHeight: '0.9rem' }],
        'mobile-sm': ['0.7rem', { lineHeight: '1.1rem' }],
        'mobile-base': ['0.8rem', { lineHeight: '1.3rem' }],
        'mobile-lg': ['0.9rem', { lineHeight: '1.5rem' }],
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '0.75rem',
          sm: '1.5rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem',
        },
      },
      maxWidth: {
        'content': 'min(100%, 1280px)',
        'narrow': 'min(100%, 768px)',
        'wide': 'min(100%, 1536px)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.text-responsive-xs': {
          fontSize: 'clamp(0.65rem, 0.6rem + 0.15vw, 0.7rem)',
          lineHeight: '1.4',
        },
        '.text-responsive': {
          fontSize: 'clamp(0.7rem, 0.65rem + 0.2vw, 0.8rem)',
          lineHeight: '1.4',
        },
        '.text-responsive-lg': {
          fontSize: 'clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem)',
          lineHeight: '1.4',
        },
        '.text-responsive-xl': {
          fontSize: 'clamp(0.9rem, 0.85rem + 0.3vw, 1rem)',
          lineHeight: '1.3',
        },
        '.text-responsive-2xl': {
          fontSize: 'clamp(1rem, 0.95rem + 0.35vw, 1.125rem)',
          lineHeight: '1.2',
        },
        '.text-responsive-3xl': {
          fontSize: 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)',
          lineHeight: '1.1',
        },
        '.text-responsive-4xl': {
          fontSize: 'clamp(1.25rem, 1.15rem + 0.75vw, 1.5rem)',
          lineHeight: '1.1',
        },
        '.fluid-p': {
          padding: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-px': {
          paddingLeft: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
          paddingRight: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-py': {
          paddingTop: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
          paddingBottom: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-m': {
          margin: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-mx': {
          marginLeft: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
          marginRight: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-my': {
          marginTop: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
          marginBottom: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-gap': {
          gap: 'clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem)',
        },
        '.fluid-gap-sm': {
          gap: 'clamp(0.2rem, 0.15rem + 0.35vw, 0.5rem)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}