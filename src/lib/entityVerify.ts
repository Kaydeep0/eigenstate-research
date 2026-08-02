/**
 * Last verify / admit-refuse limb for an entity hub hero.
 * Joins Pages-local mirrors only (RWA ledger, grounded-claims, current-claims).
 * HOLD when none of those surfaces cover the entity.
 */
import fs from 'node:fs';
import path from 'node:path';
import rwa from '../data/rwa_disclosure.json';
import grounded from '../data/grounded_claims.json';

export type EntityVerifyOutcome = {
  source: 'rwa' | 'grounded_claims' | 'current_claims' | 'none';
  verdict: 'admit' | 'refuse' | 'mixed' | 'hold';
  label: string;
  refuse_limb: string | null;
  detail: string;
  receipt_url: string | null;
  hold: boolean;
};

type RwaRow = {
  entity: string;
  must_admit: boolean;
  refuse_limb: string | null;
  refuse_reason: string | null;
  receipt?: string;
};

type GcRow = {
  entity: string;
  must_admit: boolean;
  refuse_limb?: string | null;
  refuse_reason: string | null;
  receipt?: string;
  claim_key?: string;
};

const rwaByEntity = new Map<string, RwaRow>();
for (const row of ((rwa as { per_issuer?: RwaRow[] }).per_issuer || []) as RwaRow[]) {
  rwaByEntity.set(String(row.entity).toUpperCase(), row);
}

const gcByEntity = new Map<string, GcRow[]>();
for (const row of ((grounded as { per_claim?: GcRow[] }).per_claim || []) as GcRow[]) {
  const key = String(row.entity).toUpperCase();
  const list = gcByEntity.get(key) ?? [];
  list.push(row);
  gcByEntity.set(key, list);
}

function loadCurrentClaims(code: string): {
  admitted: number;
  withheld: number;
  refuse_reasons: string[];
  statuses: string[];
} | null {
  const file = path.join(process.cwd(), 'public', 'federation', 'current-claims', `${code}.json`);
  try {
    if (!fs.existsSync(file)) return null;
    const card = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      claims?: Array<{
        status_at_publish?: string;
        package?: {
          disposition?: string;
          exhibited_refusal?: boolean;
          reason?: string;
          verification_status?: string;
        };
      }>;
    };
    const claims = card.claims || [];
    if (claims.length === 0) return null;
    let admitted = 0;
    let withheld = 0;
    const refuse_reasons: string[] = [];
    const statuses: string[] = [];
    for (const c of claims) {
      const pkg = c.package || {};
      const disp = String(pkg.disposition || '').toLowerCase();
      const status = String(pkg.verification_status || c.status_at_publish || '');
      if (status) statuses.push(status);
      if (disp === 'withheld' || pkg.exhibited_refusal) {
        withheld += 1;
        if (pkg.reason) refuse_reasons.push(String(pkg.reason));
      } else if (disp === 'admitted') {
        admitted += 1;
      }
    }
    return { admitted, withheld, refuse_reasons, statuses };
  } catch {
    return null;
  }
}

/** Prefer conformance ledger limbs; fall back to current-claims disposition. */
export function resolveEntityVerify(entityCode: string): EntityVerifyOutcome {
  const code = String(entityCode || '')
    .trim()
    .toUpperCase();
  if (!code) {
    return {
      source: 'none',
      verdict: 'hold',
      label: 'HOLD',
      refuse_limb: null,
      detail: 'No entity code.',
      receipt_url: null,
      hold: true,
    };
  }

  const rwaRow = rwaByEntity.get(code);
  if (rwaRow) {
    const admit = Boolean(rwaRow.must_admit);
    return {
      source: 'rwa',
      verdict: admit ? 'admit' : 'refuse',
      label: admit ? 'MUST admit' : 'MUST refuse',
      refuse_limb: admit ? null : rwaRow.refuse_limb || rwaRow.refuse_reason || 'refuse',
      detail: admit
        ? 'RWA disclosure survey: every MUST limb cleared.'
        : `RWA disclosure survey: first refuse limb ${rwaRow.refuse_limb || rwaRow.refuse_reason || 'unnamed'}.`,
      receipt_url: rwaRow.receipt || null,
      hold: false,
    };
  }

  const gcRows = gcByEntity.get(code);
  if (gcRows && gcRows.length > 0) {
    const refused = gcRows.filter((r) => !r.must_admit);
    if (refused.length === 0) {
      return {
        source: 'grounded_claims',
        verdict: 'admit',
        label: 'MUST admit',
        refuse_limb: null,
        detail: `Grounded-claims corpus: ${gcRows.length} claim${gcRows.length === 1 ? '' : 's'}, all MUST clear.`,
        receipt_url: gcRows[0].receipt || null,
        hold: false,
      };
    }
    const limb = refused[0].refuse_limb || refused[0].refuse_reason || 'refuse';
    return {
      source: 'grounded_claims',
      verdict: refused.length === gcRows.length ? 'refuse' : 'mixed',
      label: refused.length === gcRows.length ? 'MUST refuse' : 'Mixed',
      refuse_limb: limb,
      detail: `Grounded-claims corpus: ${refused.length} of ${gcRows.length} miss a MUST limb (${limb}).`,
      receipt_url: refused[0].receipt || null,
      hold: false,
    };
  }

  const claims = loadCurrentClaims(code);
  if (claims) {
    if (claims.withheld === 0 && claims.admitted > 0) {
      return {
        source: 'current_claims',
        verdict: 'admit',
        label: 'Claims admitted',
        refuse_limb: null,
        detail: `Current-claims mirror: ${claims.admitted} admitted, no refuse.`,
        receipt_url: null,
        hold: false,
      };
    }
    if (claims.withheld > 0) {
      const limb = claims.refuse_reasons[0] || claims.statuses.find((s) => !s.startsWith('ATTESTED')) || 'withheld';
      return {
        source: 'current_claims',
        verdict: claims.admitted > 0 ? 'mixed' : 'refuse',
        label: claims.admitted > 0 ? 'Mixed claims' : 'Claims refused',
        refuse_limb: limb,
        detail: `Current-claims mirror: ${claims.withheld} withheld, ${claims.admitted} admitted.`,
        receipt_url: null,
        hold: false,
      };
    }
  }

  return {
    source: 'none',
    verdict: 'hold',
    label: 'HOLD',
    refuse_limb: null,
    detail:
      'No admit/refuse limb on a Pages-local conformance ledger or current-claims mirror for this entity.',
    receipt_url: null,
    hold: true,
  };
}
