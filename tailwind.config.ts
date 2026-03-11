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
        // Theme-aware palette — driven by CSS custom properties so dark/light
        // modes switch automatically. The <alpha-value> placeholder keeps
        // Tailwind opacity modifiers (bg-black/90, border-border/60, etc.) working.
        black:     'rgb(var(--color-black-rgb) / <alpha-value>)',
        white:     'rgb(var(--color-white-rgb) / <alpha-value>)',
        surface:   'rgb(var(--color-surface-rgb) / <alpha-value>)',
        border:    'rgb(var(--color-border-rgb) / <alpha-value>)',
        muted:     'rgb(var(--color-muted-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
        warn:      'rgb(var(--color-warn-rgb) / <alpha-value>)',
        fail:      'rgb(var(--color-fail-rgb) / <alpha-value>)',
        green: {
          DEFAULT: 'rgb(var(--color-green-rgb) / <alpha-value>)',
          mid:     'rgb(var(--color-green-mid-rgb) / <alpha-value>)',
          dark:    'rgb(var(--color-green-dark-rgb) / <alpha-value>)',
        },
        // Legacy aliases — do not remove (used in inline styles + report pages)
        pass:  'rgb(var(--color-green-mid-rgb) / <alpha-value>)',
        amber: 'rgb(var(--color-warn-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-syne)',    'sans-serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'radar-spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'radar': 'radar-spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
