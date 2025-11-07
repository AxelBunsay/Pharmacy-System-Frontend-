module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px',     // Small phones
        'sm': '640px',     // Large phones/Small tablets
        'md': '768px',     // Tablets (iPad Mini, Galaxy Tab)
        'lg': '1024px',    // Large tablets (iPad Pro)
        'xl': '1280px',    // Small laptops
        '2xl': '1536px',   // Large screens
      },
      // Use CSS variables with <alpha-value> so Tailwind's opacity shorthand
      // classes like `bg-primary/50` or `focus:ring-primary/50` work correctly.
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          50: 'rgb(var(--primary) / 0.5)',
        },
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
