import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildSitemapLastmod, isSitemapJunkPath } from './src/lib/sitemapDates.ts';

const SITEMAP_LASTMOD = buildSitemapLastmod();

export default defineConfig({
  site: 'https://kaydeep0.github.io',
  base: '/eigenstate-research',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter(page) {
        return !isSitemapJunkPath(new URL(page).pathname);
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (isSitemapJunkPath(path)) return undefined;
        const lastmod = SITEMAP_LASTMOD[path];
        if (lastmod) {
          item.lastmod = lastmod;
        } else {
          delete item.lastmod;
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
