import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://josedbaez2.github.io',
  base: '/pdgindustrial',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
