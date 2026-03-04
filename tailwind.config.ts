import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lc: {
          bg: '#F3F2EF',
          fg: '#0C0B09',
          purple: '#9177CF',
          'purple-light': '#EDE8F8',
          muted: '#74675A',
          border: '#D4D1CB',
          card: '#FAFAF8',
        },
        pass: '#16A34A',
        amber: '#D97706',
        fail: '#DC2626',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
