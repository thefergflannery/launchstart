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
        // Design system — dark #0a0a0a + #00ff88 accent
        lc: {
          bg:           '#0a0a0a',
          fg:           '#f0f0f0',
          accent:       '#00ff88',
          'accent-dim': 'rgba(0,255,136,0.10)',
          purple:       '#00ff88', // legacy alias → accent
          'purple-light': 'rgba(0,255,136,0.08)',
          muted:        '#888888',
          border:       '#222222',
          card:         '#111111',
        },
        pass:  '#22c55e',
        amber: '#f59e0b',
        fail:  '#ef4444',
      },
      fontFamily: {
        display: ['var(--font-syne)',  'sans-serif'],
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
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
