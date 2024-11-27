import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        mobile: '480px',
        // => @media (min-width: 640px) { ... }

        tablet: '768px',
        // => @media (min-width: 640px) { ... }

        tabletSmall: '992px',
        // => @media (min-width: 992px) { ... }

        laptop: '1024px',
        // => @media (min-width: 1024px) { ... }

        desktop: '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      backgroundImage: {
        noise: 'url("/images/noise.webp")',
        grid: 'url("/images/bg-grid.webp")',
        gridMob: 'url("/images/bg-grid-mob.webp")',
      },
      colors: {
        typoMain: '#B9C0D4',
        borderMain: '#4D5761',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
