import fieldState from '../../public/field-state.json';
import fs from 'node:fs';
import path from 'node:path';

export type PagesSot = typeof fieldState;

export type LiveEntityMetrics = {
  phi_s: number | null;
  kappa: number | null;
  compiled_at?: string | null;
  source: 'dossier_mirror' | 'frontmatter' | 'none';
};

/** Engine SoT stamp baked into public/field-state.json at deploy time. */
export function loadSot(): PagesSot {
  return fieldState;
}

/** Extract entity codename from report id like SEC_20260801 → SEC. */
export function entityCodeFromReportId(id: string): string {
  const m = id.match(/^(.+)_(\d{8})$/);
  return m ? m[1] : id;
}

/**
 * Live Φ_S / κ from the Pages federation dossier mirror (synced by refresh-public).
 * Falls back to nulls when the entity card is missing — caller keeps publish snapshot.
 */
export function loadLiveEntityMetrics(entityCode: string): LiveEntityMetrics {
  const code = (entityCode || '').trim().toUpperCase();
  if (!code) return { phi_s: null, kappa: null, source: 'none' };
  const file = path.join(process.cwd(), 'public', 'federation', 'dossier', `${code}.json`);
  try {
    if (!fs.existsSync(file)) {
      return { phi_s: null, kappa: null, source: 'none' };
    }
    const card = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      own_numbers?: { phi_s?: number | null; kappa?: number | null };
      compiled_at?: string;
    };
    const own = card.own_numbers || {};
    const phi = own.phi_s;
    const kap = own.kappa;
    return {
      phi_s: phi == null || Number.isNaN(Number(phi)) ? null : Number(phi),
      kappa: kap == null || Number.isNaN(Number(kap)) ? null : Number(kap),
      compiled_at: card.compiled_at ?? null,
      source: 'dossier_mirror',
    };
  } catch {
    return { phi_s: null, kappa: null, source: 'none' };
  }
}

/** Prefer live dossier Φ_S/κ; keep publish frontmatter when live missing. */
export function resolveReportMetrics(
  entityCode: string,
  publish: { phi_s: number; kappa: number }
): {
  phi_s: number;
  kappa: number;
  publish_phi_s: number;
  publish_kappa: number;
  live: LiveEntityMetrics;
  using_live: boolean;
} {
  const live = loadLiveEntityMetrics(entityCode);
  const using_live = live.phi_s != null;
  return {
    phi_s: live.phi_s ?? publish.phi_s,
    kappa: live.kappa ?? publish.kappa,
    publish_phi_s: publish.phi_s,
    publish_kappa: publish.kappa,
    live,
    using_live,
  };
}

export function formatPct(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return 'n/a';
  return `${n.toFixed(digits)}%`;
}

export function formatNum(n: number | null | undefined, digits = 4): string {
  if (n == null || Number.isNaN(Number(n))) return 'n/a';
  return Number(n).toFixed(digits);
}

/** Build an SVG polyline for PT series (y inverted: higher PT nearer top). */
export function ptSparklinePoints(
  series: Array<{ PT?: number | null }>,
  width = 300,
  height = 48,
  pad = 4
): { points: string; min: number; max: number } {
  const vals = series.map((r) => Number(r.PT)).filter((v) => Number.isFinite(v));
  if (vals.length < 2) {
    return { points: '', min: 0, max: 0 };
  }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const usableH = height - pad * 2;
  const step = width / (vals.length - 1);
  const points = vals
    .map((v, i) => {
      const x = i * step;
      const y = pad + (1 - (v - min) / span) * usableH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return { points, min, max };
}
