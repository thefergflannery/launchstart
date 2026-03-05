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
        // Brand palette
        black:      '#0A0A0A',
        white:      '#F5F4F0',
        surface:    '#161A16',
        border:     '#1E2A1E',
        muted:      '#4A5E4A',
        secondary:  '#8FA88F',
        warn:       '#FFB400',
        fail:       '#FF4D4D',
        green: {
          DEFAULT: '#00E96A',
          mid:     '#00B851',
          dark:    '#003D1B',
        },
        // Legacy aliases — do not remove (used in inline styles + report pages)
        pass:  '#00B851',
        amber: '#FFB400',
      },
      fontFamily: {
        display: ['var(--font-syne)',    'sans-serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
