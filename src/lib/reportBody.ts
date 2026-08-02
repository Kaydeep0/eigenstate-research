/**
 * Normalize signal-report markdown for the public Pages reader:
 * demote agent traverse noise, rename sections, strip em dashes,
 * rewrite broken / machine-only URLs toward human pages where possible.
 */

import fs from 'node:fs';
import path from 'node:path';

const AGENT_BLOCK_RE =
  /\n##\s+(?:Node\s+\d+\s*[—\-].*?agent billboard|For agents|Federation traverse \(agents\)|Federation cross-reference)\s*\n[\s\S]*?(?=\n---+\s*\n|\n##\s+(?!For agents)|$)/gi;

/** Hero already shows live + publish snapshot metrics; drop body duplicate tables. */
const KEY_METRICS_RE =
  /\n##\s+(?:Key Metrics|Publication snapshot)\s*\n[\s\S]*?(?=\n##\s+)/i;

const SECTION_RENAMES: Array<[RegExp, string]> = [
  [/^##\s+Global Field Context\s*$/gim, '## Publication field context'],
  [/^##\s+What Is (.+)\s*$/gim, '## What it is'],
  [/^##\s+Current Field Events\s*$/gim, '## Verified claims'],
  [/^##\s+Field Position Analysis\s*$/gim, '## Field read'],
  [/^##\s+Concentration Analysis\s*$/gim, '## Field read · concentration'],
  [/^##\s+Engine Recommendations\s*$/gim, '## Field read · recommendations'],
  [/^##\s+Methodology\s*$/gim, '## Sources'],
];

/** Broken doubled-name Vercel stubs → federation report_feed. */
const BROKEN_FEED_RE =
  /https?:\/\/([a-z0-9]+)(?:\1)supplyfeed\.vercel\.app\/api\/[a-z0-9_]+_supply_feed/gi;

const LEGACY_REPORT_HTML_RE =
  /https?:\/\/kaydeep0\.github\.io\/eigenstate-research\/reports\/report\.html\?id=([A-Z0-9_]+)/gi;

export function stripEmDashes(text: string): string {
  return (text || '')
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .replace(/\u2011/g, '-')
    .replace(/ -- /g, ', ')
    .replace(/ , /g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/:\s*,/g, ':');
}

export function rewriteReportUrls(text: string, entityCode?: string): string {
  const code = (entityCode || '').toUpperCase();
  let out = text || '';
  out = out.replace(BROKEN_FEED_RE, (_m, stem: string) => {
    const entity = code || String(stem || '').toUpperCase();
    return `https://geniusflow-federation.vercel.app/api/report_feed?entity=${entity}`;
  });
  out = out.replace(LEGACY_REPORT_HTML_RE, (_m, id: string) => {
    const slug = String(id || '')
      .toLowerCase()
      .replace(/_/g, '-');
    return `https://kaydeep0.github.io/eigenstate-research/reports/${slug}/`;
  });
  out = out.replace(
    /\[Entity dossier\]\((https?:\/\/kaydeep0\.github\.io\/eigenstate-research\/federation\/dossier\/([A-Z0-9_]+)\.json)\)/gi,
    (_m, _url, ent: string) =>
      `[Entity dossier (HTML)](https://kaydeep0.github.io/eigenstate-research/dossier/${ent}/)`
  );
  return out;
}

/** Pull machine traverse / billboard blocks out of the article body. */
export function extractAgentBlocks(body: string): { article: string; agent: string } {
  const chunks: string[] = [];
  const article = (body || '').replace(AGENT_BLOCK_RE, (match) => {
    chunks.push(match.trim());
    return '\n';
  });
  return { article: article.replace(/\n{3,}/g, '\n\n').trim(), agent: chunks.join('\n\n').trim() };
}

export function renameReportSections(body: string): string {
  let out = body || '';
  for (const [re, replacement] of SECTION_RENAMES) {
    out = out.replace(re, replacement);
  }
  return out;
}

export function stripDuplicateSnapshotTable(body: string): string {
  return (body || '').replace(KEY_METRICS_RE, '\n');
}

/** Drop trailing generator footers that clutter the reader article. */
export function stripTrailingBoilerplate(body: string): string {
  return (body || '')
    .replace(/\n---+\s*\n+\*Eigenstate Research[\s\S]*$/i, '\n')
    .replace(/\n\*Generated:[\s\S]*$/i, '\n')
    .trim();
}

export type HumanSourceLink = {
  href: string;
  label: string;
  group: 'issuer' | 'regulator' | 'eigenstate' | 'other';
};

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function groupForUrl(url: string): HumanSourceLink['group'] {
  const h = hostOf(url);
  if (!h) return 'other';
  if (h.includes('circle.com') || h.includes('tether.to') || h.includes('coinbase.com')) return 'issuer';
  if (
    h.includes('sec.gov') ||
    h.includes('edgar') ||
    h.includes('federalreserve.gov') ||
    h.includes('occ.gov') ||
    h.includes('treasury.gov')
  ) {
    return 'regulator';
  }
  if (h.includes('github.io') || h.includes('paragraph.') || h.includes('eigenstate')) return 'eigenstate';
  return 'other';
}

function labelForUrl(url: string, claimText?: string): string {
  const h = hostOf(url);
  if (claimText && claimText.length < 80) return claimText;
  if (h === 'circle.com') {
    if (url.includes('/usdc')) return 'Circle · USDC';
    if (url.includes('transparency')) return 'Circle · Transparency / attestations';
    if (url.includes('cross-chain') || url.includes('cctp')) return 'Circle · CCTP';
    return 'Circle.com';
  }
  if (h.includes('sec.gov')) return 'SEC / EDGAR filing';
  return h || url;
}

/** Load human-readable claim grounding URLs for an entity (from current-claims mirror). */
export function loadClaimSourceLinks(entityCode: string): HumanSourceLink[] {
  const code = (entityCode || '').trim().toUpperCase();
  if (!code) return [];
  const file = path.join(process.cwd(), 'public', 'federation', 'current-claims', `${code}.json`);
  try {
    if (!fs.existsSync(file)) return [];
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      claims?: Array<{ claim_text?: string; grounding?: { source_url?: string } }>;
    };
    const seen = new Set<string>();
    const out: HumanSourceLink[] = [];
    for (const c of data.claims || []) {
      const href = String(c.grounding?.source_url || '').trim();
      if (!href || !href.startsWith('http') || seen.has(href)) continue;
      if (/\/api\//.test(href) || href.endsWith('.json')) continue;
      seen.add(href);
      out.push({
        href,
        label: stripEmDashes(labelForUrl(href, c.claim_text)),
        group: groupForUrl(href),
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** Full normalize for public report HTML. */
export function prepareReportBody(
  rawBody: string,
  entityCode?: string
): { article: string; agent: string } {
  let text = stripEmDashes(rawBody || '');
  text = rewriteReportUrls(text, entityCode);
  text = stripDuplicateSnapshotTable(text);
  const { article, agent } = extractAgentBlocks(text);
  return {
    article: stripTrailingBoilerplate(renameReportSections(article)),
    agent: stripEmDashes(rewriteReportUrls(agent, entityCode)),
  };
}
