/**
 * Short Δ / context lines for ledger heroes, from the append-only refresh index.
 */
import history from '../data/ledger_refresh.json';

type RateMove = {
  rate: string;
  before: number;
  after: number;
  reading?: string;
};

type LedgerEntry = {
  ledger: string;
  trend?: string;
  runs_on_record: number;
  latest_delta?: {
    rate_comparison?: RateMove[];
    changes?: { counter: string; before: number; after: number; change: number }[];
  };
};

const byLedger = new Map(
  (((history as { ledgers?: LedgerEntry[] }).ledgers || []) as LedgerEntry[]).map((e) => [
    e.ledger,
    e,
  ])
);

function pct(n: number): string {
  if (n <= 1 && n >= 0) return `${(100 * n).toFixed(1)}%`;
  return String(n);
}

/** One-line context under the primary rate (Δ between last two runs, or snapshot note). */
export function ledgerDeltaLine(ledgerId: string, preferredRate?: string): string {
  const entry = byLedger.get(ledgerId);
  if (!entry) return '';
  if (entry.runs_on_record < 2) {
    return 'Single publication on record (snapshot, not a standing claim).';
  }
  const rates = entry.latest_delta?.rate_comparison || [];
  const hit =
    (preferredRate && rates.find((r) => r.rate === preferredRate)) || rates[0] || null;
  if (hit) {
    const reading = hit.reading ? ` ${hit.reading}.` : '';
    return `Prior run ${pct(hit.before)} → this run ${pct(hit.after)}.${reading}`;
  }
  if (entry.trend) return entry.trend;
  const changes = entry.latest_delta?.changes || [];
  if (changes.length === 0) {
    return 'Headline counters held between the last two runs (digests still differ).';
  }
  return changes
    .slice(0, 2)
    .map((c) => `${c.counter.replace(/_/g, ' ')} ${c.before} → ${c.after}`)
    .join(' · ');
}
