/**
 * Human-readable titles and one-line resolution rationale for scored Host claims.
 * Keys match predictions_scoreboard.resolved[].prediction_id in field-state.json.
 * Do not invent TRUE outcomes here; copy only Host-executed resolution facts.
 */

export type OutcomeKind = 'TRUE' | 'FALSE' | 'VOID' | 'RESOLVED_PARTIAL' | 'OPEN' | 'OTHER';

export type PredictionOutcomeMeta = {
  title: string;
  /** Short claim in plain English */
  claim: string;
  /** One-line why for the outcome badge */
  why: string;
  /** Human detail page on this site when available */
  detailHref?: string;
  /** Primary external evidence page (human-readable label) */
  evidence?: { label: string; href: string }[];
};

export const PREDICTION_OUTCOMES: Record<string, PredictionOutcomeMeta> = {
  INDIA_BANKNIFTY_001: {
    title: 'NSE BankNifty settlement-gap event',
    claim:
      'A settlement-gap event on NSE involving a ~98:1 cleared-positions-to-capacity ratio (or SEBI acknowledgment of that structural gap) would surface by 2026-06-13.',
    why:
      'FALSE: by the 2026-06-13 deadline, no new NSE/SEBI publication in the emission-to-deadline window named a matching ~98:1 settlement-gap event. Jane Street/SEBI material from 2025 predates emission, so it does not count as the predicted surfacing. An NSDL Feb 2026 settlement delay lacked the ratio leg.',
    detailHref: 'predictions/#INDIA_BANKNIFTY_001',
    evidence: [
      { label: 'NSE India', href: 'https://www.nseindia.com/' },
      { label: 'SEBI', href: 'https://www.sebi.gov.in/' },
    ],
  },
  FED_EXTRACTION_001: {
    title: 'Fed emergency rate cut or balance sheet above $6T',
    claim:
      'The Fed would either implement an emergency rate cut (50+ bps off-cycle) or expand its balance sheet above $6T before 2026-07-13.',
    why:
      'VOID (not FALSE): the rate leg was FALSE (no off-cycle cut of 50+ bps in window). The balance-sheet leg was VOID because the H.4.1 baseline at emission was already $6.714T, so "expand above $6T" presupposed a sub-$6T baseline that did not exist. Unresolvable as written; calibration weight none.',
    detailHref: 'predictions/#FED_EXTRACTION_001',
    evidence: [
      {
        label: 'Fed H.4.1 releases',
        href: 'https://www.federalreserve.gov/releases/h41/',
      },
      {
        label: 'FOMC calendars',
        href: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
      },
    ],
  },
  PHYSICS_T_A_DOLLAR_001: {
    title: 'Meta ad revenue per DAP as stable transport coefficient',
    claim:
      'Meta Family advertising revenue per December Family DAP would stay a stable transport coefficient (|YoY change| under 15% for 2023→2024 and 2024→2025), with cross-platform and FY2026 legs.',
    why:
      'RESOLVED_PARTIAL: the stable-transport leg failed (2023→2024 Δr = +15.93%, at/above the 15% threshold). Cross-platform was untestable. The FY2026 prospective leg stays open until 2027-02-28. Not in assessable TRUE/FALSE n because there is no single TRUE or FALSE outcome.',
    evidence: [
      {
        label: 'Meta FY2025 results',
        href: 'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx',
      },
    ],
  },
};

export function outcomeKind(row: {
  outcome?: string | null;
  status?: string | null;
}): OutcomeKind {
  const outcome = (row.outcome || '').toUpperCase();
  const status = (row.status || '').toUpperCase();
  if (outcome === 'TRUE' || outcome === 'FALSE' || outcome === 'VOID') return outcome;
  if (status === 'RESOLVED_PARTIAL') return 'RESOLVED_PARTIAL';
  if (status?.startsWith('OPEN')) return 'OPEN';
  return 'OTHER';
}

export function outcomeLabel(kind: OutcomeKind): string {
  switch (kind) {
    case 'TRUE':
      return 'TRUE';
    case 'FALSE':
      return 'FALSE';
    case 'VOID':
      return 'VOID';
    case 'RESOLVED_PARTIAL':
      return 'PARTIAL';
    case 'OPEN':
      return 'OPEN';
    default:
      return 'RESOLVED';
  }
}
