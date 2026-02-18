import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#0f1117',
          850: '#141722',
          800: '#191d2a',
          700: '#23283a',
          600: '#2f354b',
          500: '#3b4260',
        },
        brand: {
          500: '#6ee7b7',
          600: '#5bd6a6',
          700: '#36b68a',
        },
        accent: {
          500: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(110,231,183,0.2), 0 20px 50px -20px rgba(110,231,183,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config
