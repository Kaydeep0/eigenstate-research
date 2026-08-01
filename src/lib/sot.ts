import fieldState from '../../public/field-state.json';

export type PagesSot = typeof fieldState;

/** Engine SoT stamp baked into public/field-state.json at deploy time. */
export function loadSot(): PagesSot {
  return fieldState;
}

/** Extract entity codename from report id like SEC_20260801 → SEC. */
export function entityCodeFromReportId(id: string): string {
  const m = id.match(/^(.+)_(\d{8})$/);
  return m ? m[1] : id;
}

export function formatPct(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `${n.toFixed(digits)}%`;
}

export function formatNum(n: number | null | undefined, digits = 4): string {
  if (n == null || Number.isNaN(Number(n))) return '—';
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
