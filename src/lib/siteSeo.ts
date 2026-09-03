/** Shared public-site JSON-LD. No ScholarlyArticle. No invented Person page. */

export const SITE_ORIGIN = 'https://kaydeep0.github.io';
export const SITE_BASE = '/eigenstate-research';
export const SITE_HOME = `${SITE_ORIGIN}${SITE_BASE}/`;
export const FEDERATION = 'https://geniusflow-federation.vercel.app';

export function organizationNode() {
  return {
    '@type': 'Organization',
    name: 'Eigenstate Research',
    url: SITE_HOME,
  };
}

/** Machine system. Never a Person. Never Kirandeep Kaur Sekhon. */
export function geniusFlowNode() {
  return {
    '@type': 'SoftwareApplication',
    name: 'GeniusFlow',
    url: FEDERATION,
  };
}

function graph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export function webpageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  creator?: 'geniusflow';
  about?: string;
}) {
  const page: Record<string, unknown> = {
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    publisher: organizationNode(),
  };
  if (opts.creator === 'geniusflow') page.creator = geniusFlowNode();
  if (opts.about) page.about = { '@type': 'Thing', name: opts.about };
  return graph([page]);
}

export function techArticleJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return graph([
    {
      '@type': 'TechArticle',
      name: opts.name,
      description: opts.description,
      url: opts.url,
      publisher: organizationNode(),
    },
  ]);
}

export function datasetJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  creator?: 'geniusflow';
  about?: string;
}) {
  const node: Record<string, unknown> = {
    '@type': 'Dataset',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    publisher: organizationNode(),
  };
  if (opts.datePublished) node.datePublished = opts.datePublished;
  if (opts.creator === 'geniusflow') node.creator = geniusFlowNode();
  if (opts.about) node.about = { '@type': 'Thing', name: opts.about };
  return graph([node]);
}

export function reportJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  about: string;
}) {
  return graph([
    {
      '@type': 'Report',
      name: opts.name,
      description: opts.description,
      url: opts.url,
      datePublished: opts.datePublished,
      author: geniusFlowNode(),
      publisher: organizationNode(),
      about: { '@type': 'Thing', name: opts.about },
    },
  ]);
}

export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  creator?: 'geniusflow';
}) {
  const node: Record<string, unknown> = {
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    publisher: organizationNode(),
  };
  if (opts.creator === 'geniusflow') node.creator = geniusFlowNode();
  return graph([node]);
}

export function howtoJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  steps: string[];
}) {
  return graph([
    {
      '@type': 'HowTo',
      name: opts.name,
      description: opts.description,
      url: opts.url,
      publisher: organizationNode(),
      step: opts.steps.map((name, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name,
      })),
    },
  ]);
}

/** GeniusFlow machine spine. Creator is GeniusFlow. Never Person. */
export function geniusFlowCreativeWorkJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  about: string;
  reportId: string;
}) {
  return graph([
    {
      '@type': 'CreativeWork',
      name: opts.name,
      description: opts.description,
      url: opts.url,
      datePublished: opts.datePublished,
      creator: geniusFlowNode(),
      publisher: organizationNode(),
      about: { '@type': 'Thing', name: opts.about },
      identifier: opts.reportId,
    },
  ]);
}

export function itemListJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  itemNames: string[];
}) {
  return graph([
    {
      '@type': 'ItemList',
      name: opts.name,
      description: opts.description,
      url: opts.url,
      publisher: organizationNode(),
      numberOfItems: opts.itemNames.length,
      itemListElement: opts.itemNames.map((name, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
      })),
    },
  ]);
}

export function dateOnly(iso: string | undefined | null): string | undefined {
  if (!iso) return undefined;
  const m = String(iso).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : undefined;
}
