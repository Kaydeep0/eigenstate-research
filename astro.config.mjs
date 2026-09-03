import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { MIM_SITEMAP_LASTMOD } from './src/lib/mimSeo.ts';

export default defineConfig({
  site: 'https://kaydeep0.github.io',
  base: '/eigenstate-research',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = MIM_SITEMAP_LASTMOD[path];
        if (lastmod) {
          item.lastmod = lastmod;
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/money-in-motion/circle-20260812-mim/': {
      status: 301,
      destination: '/eigenstate-research/geniusflow/mim/circle-20260812-mim/',
    },
    '/money-in-motion/coinbase-20260812-mim/': {
      status: 301,
      destination: '/eigenstate-research/geniusflow/mim/coinbase-20260812-mim/',
    },
    '/money-in-motion/circle-20260827-mim/': {
      status: 301,
      destination: '/eigenstate-research/geniusflow/mim/circle-20260827-mim/',
    },
  },
});
