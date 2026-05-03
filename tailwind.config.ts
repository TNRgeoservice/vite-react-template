import type { Config } from 'tailwindcss';

/**
 * TNR MapHub — Tailwind config
 * All tokens mirror CSS custom properties in src/app/globals.css
 * (source of truth: design_handoff_maphub/colors_and_type.css).
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark GIS surfaces
        bg:   '#0d1520',
        bg2:  '#162030',
        bg3:  '#1e2d42',
        brd:  '#213045',

        // Text ramp
        tx:   '#dce8f5',
        tx2:  '#7a9ab8',
        txd:  '#3d5672',

        // Brand + entity
        acc:  '#00e676',
        acc2: '#00c853',
        land: '#40c4ff',
        road: '#ffb300',
        poly: '#b388ff',
        red:  '#ff5252',
        danger: '#ff5252',

        // Status aliases
        'status-available': '#00e676',
        'status-reserved':  '#ffb300',
        'status-sold':      '#ff5252',

        // Print sheet (parchment)
        'print-bg':     '#f1ead9',
        'print-card':   '#f7f1e3',
        'print-ink':    '#2a1f12',
        'print-ink2':   '#6b5640',
        'print-muted':  '#a89680',
        'print-brd':    '#d9ccb0',
        'print-accent': '#8b5a2b',
        'print-price':  '#ede0c4',
      },

      fontFamily: {
        // Brand face: Mitr (Thai + Latin) — IBM Plex Sans Thai kept as fallback
        sans: ['var(--font-sans)', 'IBM Plex Sans Thai', 'Sarabun', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // Mobile-first compact scale
        'xs-t':   ['10px',   { lineHeight: '1.45' }],
        'sm-t':   ['11.5px', { lineHeight: '1.45' }],
        'body-t': ['13px',   { lineHeight: '1.55' }],
        'md-t':   ['14px',   { lineHeight: '1.45' }],
        'lg-t':   ['15px',   { lineHeight: '1.3'  }],
        'xl-t':   ['17px',   { lineHeight: '1.15' }],
        '2xl-t':  ['20px',   { lineHeight: '1.15', letterSpacing: '-0.2px' }],
      },

      fontWeight: {
        extralight: '200',
        light:      '300',
        regular:    '400',
        medium:     '500',
        semibold:   '600',
        bold:       '700',
      },

      borderRadius: {
        'xs-t':  '5px',
        'sm-t':  '7px',
        'md-t':  '9px',
        'lg-t':  '12px',
        'xl-t':  '14px',
        '2xl-t': '18px',
        pill:    '999px',
      },

      spacing: {
        sp1: '4px',
        sp2: '6px',
        sp3: '8px',
        sp4: '10px',
        sp5: '12px',
        sp6: '16px',
        sp7: '20px',
        sp8: '24px',

        // Fixed chrome
        'top-h': '52px',
        'bar-h': '62px',
        fbt:     '44px',
        tbi:     '36px',
      },

      boxShadow: {
        fab:   '0 3px 14px rgba(0, 0, 0, .5)',
        float: '0 4px 20px rgba(0, 0, 0, .55)',
        modal: '0 -8px 40px rgba(0, 0, 0, .65)',
        popup: '0 8px 30px rgba(0, 0, 0, .65)',
      },

      transitionTimingFunction: {
        'tnr-ease': 'cubic-bezier(.4, 0, .2, 1)',
      },
      transitionDuration: {
        'tnr-fast': '150ms',
        'tnr-mid':  '250ms',
        'tnr-slow': '320ms',
      },

      backdropBlur: {
        tnr: '6px',
      },

      keyframes: {
        'gps-pulse': {
          '0%':   { boxShadow: '0 0 0 0 rgba(0, 230, 118, .4)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(0, 230, 118, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 230, 118, 0)' },
        },
      },
      animation: {
        'gps-pulse': 'gps-pulse 1s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
