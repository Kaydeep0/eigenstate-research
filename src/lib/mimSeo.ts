import { MIM_AUTHOR } from './mim';

const SITE = 'https://kaydeep0.github.io';
const BASE = '/eigenstate-research';

export const PERSON_ID = `${SITE}${BASE}/#kirandeep-kaur-sekhon`;

/** lastmod from LinkedIn PUBLISHED_AT or spine date_iso only. Never Date.now(). */
export const MIM_SITEMAP_LASTMOD: Record<string, string> = {
  [`${BASE}/money-in-motion/`]: '2026-08-31',
  [`${BASE}/money-in-motion/can-regulation-manufacture-new-source-of-treasury-demand/`]:
    '2026-08-31',
  [`${BASE}/money-in-motion/who-will-finance-americas-next-dollar/`]: '2026-08-22',
  [`${BASE}/money-in-motion/united-states-growing-case-for-yield-curve-control/`]:
    '2026-08-20',
  [`${BASE}/money-in-motion/how-congress-replaced-cliffs-with-ramps/`]: '2026-07-31',
  [`${BASE}/geniusflow/mim/circle-20260827-mim/`]: '2026-08-30',
  [`${BASE}/geniusflow/mim/coinbase-20260812-mim/`]: '2026-08-26',
  [`${BASE}/geniusflow/mim/circle-20260812-mim/`]: '2026-08-14',
};

export function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: MIM_AUTHOR.name,
    url: MIM_AUTHOR.linkedinProfile,
  };
}

export function humanArticleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  seriesName?: string;
}) {
  const isPartOf: Array<Record<string, string>> = [
    { '@type': 'CreativeWork', name: 'Money in Motion' },
  ];
  if (opts.seriesName) {
    isPartOf.push({ '@type': 'CreativeWorkSeries', name: opts.seriesName });
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: opts.headline,
        description: opts.description,
        author: { '@id': PERSON_ID },
        datePublished: opts.datePublished,
        mainEntityOfPage: opts.url,
        url: opts.url,
        isPartOf,
      },
      personJsonLd(),
    ],
  };
}

export function mimLandingJsonLd(url: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Money in Motion',
        description: `Research and writing by ${MIM_AUTHOR.name}`,
        url,
        author: { '@id': PERSON_ID },
      },
      personJsonLd(),
    ],
  };
}
