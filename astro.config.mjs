// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://vitoesposito.it',
  integrations: [mdx(), sitemap(), react()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-geist',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/GeistVF.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/GeistMonoVF.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});