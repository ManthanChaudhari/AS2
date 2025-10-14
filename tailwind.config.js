/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: 'oklch(0.98 0.01 220)',
          100: 'oklch(0.94 0.03 220)',
          200: 'oklch(0.86 0.06 220)',
          300: 'oklch(0.76 0.12 220)',
          400: 'oklch(0.65 0.18 220)',
          500: 'oklch(0.54 0.24 220)',
          600: 'oklch(0.43 0.20 220)',
          700: 'oklch(0.35 0.16 220)',
          800: 'oklch(0.28 0.12 220)',
          900: 'oklch(0.22 0.08 220)',
          950: 'oklch(0.15 0.04 220)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'ocean': '0 4px 12px oklch(0.43 0.20 220 / 0.15)',
        'ocean-lg': '0 8px 25px oklch(0.43 0.20 220 / 0.15)',
      },
    },
  },
  plugins: [],
}