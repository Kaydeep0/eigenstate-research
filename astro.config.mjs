import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kaydeep0.github.io',
  base: '/eigenstate-research',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
