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
        // Primary
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          hover: 'hsl(var(--color-primary-hover))',
          light: 'hsl(var(--color-primary-light))',
        },
        // Dark
        dark: {
          DEFAULT: 'hsl(var(--color-dark))',
          50: 'hsl(var(--color-dark-50))',
        },
        // Gray
        gray: {
          50: 'hsl(var(--color-gray-50))',
          100: 'hsl(var(--color-gray-100))',
          light: 'hsl(var(--color-gray-light))',
          medium: 'hsl(var(--color-gray-medium))',
        },
        // Status
        success: 'hsl(var(--color-success))',
        warning: 'hsl(var(--color-warning))',
        error: 'hsl(var(--color-error))',
      },
      fontSize: {
        'xs': ['0.6875rem', { lineHeight: '1.35' }],   // 11px
        'sm': ['0.8125rem', { lineHeight: '1.4' }],    // 13px
        'base': ['0.875rem', { lineHeight: '1.5' }],   // 14px
        'md': ['0.9375rem', { lineHeight: '1.5' }],    // 15px
        'lg': ['1rem', { lineHeight: '1.5' }],         // 16px
        'xl': ['1.125rem', { lineHeight: '1.4' }],     // 18px
        '2xl': ['1.25rem', { lineHeight: '1.35' }],    // 20px
        '3xl': ['1.5rem', { lineHeight: '1.3' }],      // 24px
        '4xl': ['2rem', { lineHeight: '1.2' }],        // 32px
        '5xl': ['2.5rem', { lineHeight: '1.15' }],     // 40px
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      spacing: {
        '18': '4.5rem',  // 72px
        '20': '5rem',    // 80px
      },
      maxWidth: {
        'container': '1200px',
      },
      height: {
        'header': '72px',
        'header-lg': '80px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
}
