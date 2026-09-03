import fs from 'node:fs';
import path from 'node:path';
import { MIM_SITEMAP_LASTMOD } from './mimSeo';
import { hubSlugForEntityCode } from './reports';
import { entityCodeFromReportId } from './sot';
import { dateOnly } from './siteSeo';

const BASE = '/eigenstate-research';

/** Numeric-only dossier keys (live junk: /dossier/5/, /dossier/25/). */
export function isJunkDossierEntity(entity: string): boolean {
  return /^\d+$/.test(String(entity || '').trim());
}

export function isSitemapJunkPath(pathname: string): boolean {
  const m = pathname.match(/\/dossier\/([^/]+)\/?$/);
  if (!m) return false;
  return isJunkDossierEntity(decodeURIComponent(m[1]));
}

function put(map: Record<string, string>, pathname: string, iso: string | undefined) {
  const day = dateOnly(iso);
  if (!day) return;
  const prev = map[pathname];
  if (!prev || day > prev) map[pathname] = day;
}

function readJson(rel: string): Record<string, unknown> | null {
  const file = path.join(process.cwd(), rel);
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * lastmod from real source dates only. Never Date.now().
 * Pages without a date are omitted by the sitemap serialize (delete lastmod).
 */
export function buildSitemapLastmod(): Record<string, string> {
  const map: Record<string, string> = { ...MIM_SITEMAP_LASTMOD };

  const manifest = readJson('reports/manifest.json');
  const reports = Array.isArray(manifest?.reports) ? manifest.reports : [];
  for (const raw of reports) {
    const r = raw as { id?: string; date_iso?: string; url?: string };
    const day = dateOnly(r.date_iso);
    if (!day) continue;
    const reportUrl = String(r.url || '').replace(/^\/+|\/+$/g, '');
    if (reportUrl) put(map, `${BASE}/reports/${reportUrl}/`, day);
    const code = entityCodeFromReportId(String(r.id || ''));
    if (code) put(map, `${BASE}/reports/${hubSlugForEntityCode(code)}/`, day);
  }

  const dossierDir = path.join(process.cwd(), 'public', 'federation', 'dossier');
  if (fs.existsSync(dossierDir)) {
    for (const f of fs.readdirSync(dossierDir)) {
      if (!f.endsWith('.json') || f.startsWith('index')) continue;
      const entity = f.replace(/\.json$/, '');
      if (isJunkDossierEntity(entity)) continue;
      const card = readJson(`public/federation/dossier/${f}`);
      put(map, `${BASE}/dossier/${entity}/`, dateOnly(typeof card?.compiled_at === 'string' ? card.compiled_at : null));
    }
  }

  const ledgers: Array<[string, string]> = [
    ['src/data/rwa_disclosure.json', `${BASE}/rwa/`],
    ['src/data/erc8004_probe.json', `${BASE}/erc8004/`],
    ['src/data/slsa_provenance.json', `${BASE}/slsa/`],
    ['src/data/tlog_monitor.json', `${BASE}/tlog/`],
    ['src/data/grounded_claims.json', `${BASE}/grounded-claims/`],
    ['src/data/ledger_refresh.json', `${BASE}/ledgers/`],
  ];
  for (const [file, pathname] of ledgers) {
    const data = readJson(file);
    put(map, pathname, dateOnly(typeof data?.generated_at === 'string' ? data.generated_at : null));
  }

  const field = readJson('public/field-graph.json');
  put(map, `${BASE}/field/`, dateOnly(typeof field?.generated_at === 'string' ? field.generated_at : null));

  const circle = readJson('src/data/circle-state.json');
  const observed = (circle?.observed || {}) as { last_observation?: string };
  const lastObs = dateOnly(observed.last_observation);
  put(map, `${BASE}/state/`, lastObs);
  put(map, `${BASE}/changes/`, lastObs);
  put(map, `${BASE}/experiment/`, lastObs);

  return map;
}
