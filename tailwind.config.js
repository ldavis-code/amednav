/** @type {import('tailwindcss').Config} */

/*
 * AMedNav Color System
 *   Primary   — Deep Navy   #12284C  oklch(0.265 0.069 264)
 *   Secondary — Mid Blue    #2E7FC1  oklch(0.605 0.125 245)
 *   Accent    — Warm Coral  #E27B5E  oklch(0.705 0.138 38)
 *   Surface   — Soft White  #F7F1EA  oklch(0.955 0.012 70)
 *   Ink       — Charcoal    #232832  oklch(0.245 0.013 260)
 *
 * Usage ratio: 60% Surface / 25% Navy / 10% Coral / 5% Blue.
 * Coral is a spice, not a base — keep it under ~10% of visible surface.
 */

const navy = {
  50:  '#E8ECF4',
  100: '#CDD5E5',
  200: '#9AACCB',
  300: '#6782B1',
  400: '#3A5C97',
  500: '#20416E',
  600: '#12284C', // Deep Navy — primary brand color
  700: '#0E1F3B',
  800: '#0A1628',
  900: '#060E1C',
  950: '#03060F',
};

const blue = {
  50:  '#EAF2FA',
  100: '#CFE0F2',
  200: '#9FC1E5',
  300: '#6FA2D7',
  400: '#4A91CC',
  500: '#2E7FC1', // Mid Blue — secondary / links / verified chrome
  600: '#256699',
  700: '#1B4D73',
  800: '#12344D',
  900: '#091A26',
};

const coral = {
  50:  '#FDF3EE',
  100: '#FBE2D7',
  200: '#F6C0AB',
  300: '#F09D80',
  400: '#E98A6D',
  500: '#E27B5E', // Warm Coral — accent
  600: '#C46141',
  700: '#A14C30',
  800: '#7C3924',
  900: '#572618',
};

const surface = '#F7F1EA'; // Soft White — page surfaces, cards, negative space
const ink     = '#232832'; // Charcoal — body text (never pure black)

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic AMedNav palette
        navy,
        blue,
        coral,
        surface,
        ink,

        // Backward-compat aliases: existing markup using `plum-*` and `canvas`
        // renders in the navy / surface palette without a per-file rename.
        plum: navy,
        canvas: surface,

        // High contrast text colors (retained for body/secondary copy)
        'accessible': {
          'dark':      '#1e293b', // slate-800 — primary text
          'muted':     '#374151', // gray-700  — secondary text (7:1)
          'secondary': '#475569', // slate-600 — tertiary text (5.5:1)
          'light':     '#f1f5f9', // slate-100 — text on dark backgrounds
        },
      },
      fontFamily: {
        // Inter handles everything transactional: body, buttons, nav, forms.
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
        // Instrument Serif handles display / emotion: headlines, pull quotes,
        // stat numbers, the wordmark. Never in buttons or body copy.
        serif: [
          'Instrument Serif',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
      },
      fontSize: {
        'xs':   ['0.875rem',  { lineHeight: '1.5' }], // 14px minimum
        'sm':   ['0.9375rem', { lineHeight: '1.5' }], // 15px minimum
        'base': ['1rem',      { lineHeight: '1.6' }], // 16px
      },
      minHeight: { 'touch': '44px' },
      minWidth:  { 'touch': '44px' },
      spacing:   { 'touch': '44px' },
    },
  },
  plugins: [],
}
