/**
 * Complete discoverability link set for every signal report.
 * Human pages first; machine / Vercel / federation APIs always present (not omitted).
 */

import fs from 'node:fs';
import path from 'node:path';

export const FEDERATION_BASE = 'https://geniusflow-federation.vercel.app';
export const RWA_REGISTRY = 'https://geniusflow-rwa.vercel.app';
export const NETWORK_VIEW = `${RWA_REGISTRY}/federation.html`;
export const PAGES_ORIGIN = 'https://kaydeep0.github.io/eigenstate-research';

export type HumanLink = { href: string; label: string; note?: string };
export type MachineLink = { href: string; label: string; note?: string };
export type VercelAppLink = {
  href: string;
  label: string;
  feed_url?: string;
  federation_card?: string;
  broken_stub?: boolean;
  note?: string;
};

export type EntityBuildInfo = {
  preferred_feed: string;
  chain_hash: string;
  federation_card_url: string;
  vercel_apps: Array<{
    origin: string;
    feed_url: string;
    federation_card: string;
    data_source?: string;
  }>;
  feeds?: Array<{
    url: string;
    data_source?: string;
    broken_stub?: boolean;
    engine_report?: boolean;
  }>;
};

export type BuildsIndex = {
  generated_at?: string;
  manifest_url?: string;
  node_id?: string;
  granth_head?: string;
  granth_length?: number;
  chain_verified?: boolean;
  entities?: Record<string, EntityBuildInfo>;
};

let _index: BuildsIndex | null = null;

export function loadBuildsIndex(): BuildsIndex {
  if (_index) return _index;
  const file = path.join(process.cwd(), 'public', 'federation', 'builds-index.json');
  try {
    if (fs.existsSync(file)) {
      _index = JSON.parse(fs.readFileSync(file, 'utf8')) as BuildsIndex;
      return _index;
    }
  } catch {
    /* fall through */
  }
  _index = {};
  return _index;
}

export function entityBuildInfo(entityCode: string): EntityBuildInfo {
  const code = (entityCode || '').trim().toUpperCase();
  const idx = loadBuildsIndex();
  const hit = (idx.entities || {})[code];
  if (hit?.preferred_feed) return hit;
  return {
    preferred_feed: `${FEDERATION_BASE}/api/report_feed?entity=${encodeURIComponent(code)}`,
    chain_hash: '',
    federation_card_url: '',
    vercel_apps: [],
  };
}

/** Doubled-name generator stubs (circlecirclesupplyfeed, basebasetvlfeed, …). */
export function isBrokenStubUrl(url: string): boolean {
  return /https?:\/\/([a-z0-9]+)\1[a-z0-9]*\.vercel\.app/i.test(url || '');
}

export function buildReportLinkCatalog(opts: {
  entityCode: string;
  entityDisplay: string;
  reportId: string;
  reportSlug: string;
  siteBase: string;
}): {
  human: HumanLink[];
  machine: MachineLink[];
  vercelApps: VercelAppLink[];
  fingerprints: { chain_hash: string; granth_head: string; granth_length: number; node_id: string };
} {
  const code = (opts.entityCode || '').trim().toUpperCase();
  const base = opts.siteBase.endsWith('/') ? opts.siteBase : `${opts.siteBase}/`;
  const info = entityBuildInfo(code);
  const idx = loadBuildsIndex();
  const feed =
    info.preferred_feed && !isBrokenStubUrl(info.preferred_feed)
      ? info.preferred_feed
      : `${FEDERATION_BASE}/api/report_feed?entity=${encodeURIComponent(code)}`;

  const canon = `${PAGES_ORIGIN}/reports/${opts.reportSlug}/`;
  const hubSlug = code.toLowerCase().replace(/_/g, '-');
  const entityHub = `${base}reports/${hubSlug}/`;
  const humanDossier = `${base}dossier/${code}/`;
  const methodology = `${base}METHODOLOGY.md`;
  const glossary = `${base}METHODOLOGY.md#numbers-glossary`;
  const verify = `${base}verify-walkthrough/`;
  const reportsIndex = `${base}reports/`;

  const human: HumanLink[] = [
    { href: canon, label: 'Canonical report', note: 'this page' },
    { href: entityHub, label: 'Entity hub', note: 'publish history + measurement evolution' },
    { href: humanDossier, label: 'Entity dossier (HTML)', note: `live SoT card for ${opts.entityDisplay}` },
    { href: methodology, label: 'Methodology', note: 'field equations and publish honesty' },
    { href: glossary, label: 'Numbers glossary', note: 'Φ_S, κ, vault@publish, M1 ledger' },
    { href: verify, label: 'Verify walkthrough', note: 'human federation check' },
    { href: reportsIndex, label: 'Related reports', note: 'other tracked entities' },
    { href: 'https://paragraph.com/@eigenstate', label: 'Paragraph journal', note: 'long-form distribution' },
    { href: NETWORK_VIEW, label: 'Federation network view', note: 'RWA map · Node diary' },
    { href: RWA_REGISTRY, label: 'RWA registry', note: 'public registry UI' },
  ];

  // Federation card: entity Vercel when healthy; else Node hub agent entry (federation /api/federation 404s).
  const fedCard =
    (info.federation_card_url && !isBrokenStubUrl(info.federation_card_url)
      ? info.federation_card_url
      : '') ||
    (info.vercel_apps || []).find((a) => a.federation_card && !isBrokenStubUrl(a.federation_card))
      ?.federation_card ||
    `${FEDERATION_BASE}/.well-known/geniusflow.json`;

  const machine: MachineLink[] = [
    {
      href: `${FEDERATION_BASE}/.well-known/geniusflow.json`,
      label: 'Agent entry',
      note: 'Node hub · cold start',
    },
    { href: `${FEDERATION_BASE}/api/manifest`, label: 'Manifest', note: 'builds directory' },
    { href: feed, label: `Entity feed (${opts.entityDisplay})`, note: 'report_feed' },
    {
      href: `${base}federation/dossier/${code}.json`,
      label: 'Machine dossier (Pages)',
      note: `${code}.json`,
    },
    {
      href: `${FEDERATION_BASE}/api/dossier?entity=${encodeURIComponent(code)}`,
      label: 'Live dossier API',
      note: '/api/dossier',
    },
    {
      href: `${base}federation/current-claims/${code}.json`,
      label: 'Machine claims (Pages)',
      note: `${code}.json`,
    },
    {
      href: fedCard,
      label: 'Federation card',
      note: info.federation_card_url && !isBrokenStubUrl(info.federation_card_url)
        ? 'entity Vercel /api/federation'
        : 'Node hub agent descriptor (entity feed stubs retired)',
    },
    { href: `${FEDERATION_BASE}/api/chain`, label: 'Chain verify', note: '/api/chain' },
    { href: FEDERATION_BASE, label: 'Federation base', note: 'geniusflow-federation.vercel.app' },
    { href: `${FEDERATION_BASE}/api/status`, label: 'Federation status', note: 'best_effort_vercel' },
    { href: `${FEDERATION_BASE}/llms.txt`, label: 'llms.txt', note: 'agent adapter index' },
    { href: `${FEDERATION_BASE}/openapi.json`, label: 'OpenAPI', note: 'machine schema' },
    { href: `${FEDERATION_BASE}/api/verify`, label: 'api/verify', note: 'claim verify wire' },
    { href: `${FEDERATION_BASE}/api/package`, label: 'api/package', note: 'claim package wire' },
    { href: `${FEDERATION_BASE}/api/cite`, label: 'api/cite', note: 'cite surface' },
    { href: `${FEDERATION_BASE}/api/return_wire`, label: 'api/return_wire', note: 'return wire' },
  ];

  const vercelApps: VercelAppLink[] = [
    {
      href: FEDERATION_BASE,
      label: 'geniusflow-federation (Vercel)',
      feed_url: feed,
      federation_card: fedCard,
    },
    {
      href: RWA_REGISTRY,
      label: 'geniusflow-rwa (Vercel)',
      note: 'registry + federation.html',
    },
  ];

  for (const app of info.vercel_apps || []) {
    if (!app.origin || isBrokenStubUrl(app.origin)) continue;
    vercelApps.push({
      href: app.origin,
      label: new URL(app.origin).hostname.replace('.vercel.app', ''),
      feed_url: app.feed_url,
      federation_card: app.federation_card,
    });
  }

  // Surface retired stubs only as corrected pointers (do not link the broken host).
  const brokenFeeds = (info.feeds || []).filter((f) => f.broken_stub);
  if (brokenFeeds.length) {
    vercelApps.push({
      href: feed,
      label: `Entity feed (corrected · was stub)`,
      feed_url: feed,
      broken_stub: true,
      note: 'doubled-name *supplyfeed/*tvlfeed hosts retired → federation report_feed',
    } as VercelAppLink);
  }

  const head = String(idx.granth_head || '');
  return {
    human,
    machine,
    vercelApps,
    fingerprints: {
      chain_hash: String(info.chain_hash || ''),
      granth_head: head,
      granth_length: Number(idx.granth_length || 0),
      node_id: String(idx.node_id || '34539544'),
    },
  };
}
