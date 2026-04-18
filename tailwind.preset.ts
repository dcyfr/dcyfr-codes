/**
 * DCYFR Tailwind preset — inlined from @dcyfr/design-system for standalone deployment.
 *
 * @deprecated — Phase 1 scaffolding (2026-04-18) added a semantic-var bridge in
 * `tailwind.config.ts` + `app/globals.css`. This preset stays until all pages
 * migrate off `dcyfr-*` palette classes. See
 * openspec/changes/dcyfr-skeleton-sites-scaffolding/tasks.md Phase 1/2.
 *
 * Keep in sync with dcyfr-design-system/src/tailwind.preset.ts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TailwindConfig = Record<string, any>;

const dcyfrPreset: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        dcyfr: {
          primary: {
            DEFAULT: 'hsl(222.2, 47.4%, 11.2%)',
            50:  'hsl(222, 47%, 95%)',
            100: 'hsl(222, 47%, 90%)',
            200: 'hsl(222, 47%, 78%)',
            300: 'hsl(222, 47%, 64%)',
            400: 'hsl(222, 47%, 48%)',
            500: 'hsl(222, 47%, 32%)',
            600: 'hsl(222, 47%, 22%)',
            700: 'hsl(222, 47%, 16%)',
            800: 'hsl(222, 47%, 11%)',
            900: 'hsl(222, 47%, 7%)',
            950: 'hsl(222, 47%, 4%)',
          },
          accent: {
            DEFAULT: 'hsl(217, 91%, 60%)',
            50:  'hsl(217, 91%, 96%)',
            100: 'hsl(217, 91%, 90%)',
            200: 'hsl(217, 91%, 80%)',
            300: 'hsl(217, 91%, 72%)',
            400: 'hsl(217, 91%, 66%)',
            500: 'hsl(217, 91%, 60%)',
            600: 'hsl(217, 91%, 50%)',
            700: 'hsl(217, 91%, 40%)',
            800: 'hsl(217, 91%, 30%)',
            900: 'hsl(217, 91%, 20%)',
            950: 'hsl(217, 91%, 12%)',
          },
          neutral: {
            50:  'hsl(222, 10%, 97%)',
            100: 'hsl(222, 10%, 93%)',
            200: 'hsl(222, 10%, 85%)',
            300: 'hsl(222, 10%, 72%)',
            400: 'hsl(222, 10%, 55%)',
            500: 'hsl(222, 10%, 42%)',
            600: 'hsl(222, 10%, 32%)',
            700: 'hsl(222, 10%, 22%)',
            800: 'hsl(222, 10%, 14%)',
            900: 'hsl(222, 10%, 9%)',
          },
          success: 'hsl(142, 71%, 45%)',
          warning: 'hsl(43, 96%, 56%)',
          error:   'hsl(0, 84%, 60%)',
          info:    'hsl(217, 91%, 60%)',
        },
      },
      fontFamily: {
        'geist-sans': ['Geist', 'Geist Variable', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'Geist Mono Variable', 'ui-monospace', 'Cascadia Code', 'monospace'],
      },
      spacing: {
        'dcyfr-xs':  '0.5rem',
        'dcyfr-sm':  '0.75rem',
        'dcyfr-md':  '1rem',
        'dcyfr-lg':  '1.5rem',
        'dcyfr-xl':  '2rem',
        'dcyfr-2xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default dcyfrPreset;
