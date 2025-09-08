import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      colors: {
        brand: {
          primary: '#1C4B92', // core brand blue
          secondary: '#1E7AB6', // secondary blue
          dark: '#0A2342',
          light: '#F3F7FB',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(1000px 500px at 20% 10%, rgba(255,255,255,0.08), transparent), linear-gradient(135deg, #1C4B92 0%, #1E7AB6 100%)',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}

export default config
