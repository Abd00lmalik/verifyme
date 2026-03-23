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
        'bg-base':       'var(--bg-base)',
        'bg-surface':    'var(--bg-surface)',
        'bg-elevated':   'var(--bg-elevated)',
        'bg-hover':      'var(--bg-hover)',
        'bg-input':      'var(--bg-input)',
        'border-subtle': 'var(--border-subtle)',
        'border-default':'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        accent:          'var(--accent)',
        'accent-hover':  'var(--accent-hover)',
        'accent-muted':  'var(--accent-muted)',
        'accent-text':   'var(--accent-text)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':    'var(--text-muted)',
        'text-inverse':  'var(--text-inverse)',
        success:         'var(--success)',
        'success-muted': 'var(--success-muted)',
        warning:         'var(--warning)',
        'warning-muted': 'var(--warning-muted)',
        error:           'var(--error)',
        'error-muted':   'var(--error-muted)',
        github:          'var(--github)',
        discord:         'var(--discord)',
        farcaster:       'var(--farcaster)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
