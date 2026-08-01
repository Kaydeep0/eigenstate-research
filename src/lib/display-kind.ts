/**
 * Browse facets for Eigenstate reports — mirrors geniusflow
 * engine/brain/entity_display_kind.py (DefiLlama-inspired IA).
 * Metric nodes (REPUTATION, presence) are dimensions, not market-actor peers.
 */

export type DisplayKind =
  | 'regulator'
  | 'institution'
  | 'issuer_protocol'
  | 'chain'
  | 'person'
  | 'audience'
  | 'data_provider'
  | 'dimension'
  | 'r_plane_channel'
  | 'operator'
  | 'other';

const DEMOTED = new Set<DisplayKind>(['dimension', 'r_plane_channel', 'operator']);

const R_PLANE = new Set([
  'RING', 'CABLE', 'HIGHWAY', 'MINT_CHANNEL', 'STRONGHOLD', 'RIVER',
  'TOPOLOGY_FIELD', 'SCHEDULED_REPORT',
]);

const DIMENSIONS = new Set([
  'REPUTATION', 'TWITTER_PRESENCE', 'GITHUB_PRESENCE', 'ECOSYSTEM_PRESENCE',
  'QUALITY_SCORE', 'ENGAGEMENT_VELOCITY', 'CHANNEL_RELEVANCE',
  'STABLECOIN_DOMINANCE', 'ATTESTATION_EXPIRY', 'AUDIT_EXPIRY',
  'COLLECT_SIGNAL', 'STAR_SIGNAL', 'EVIDENCE_LAYER', 'CUSTODY_IS_SOLVED',
  'DEFI_IS_DEAD', 'BASE_IS_THE_CHAIN',
]);

const REGULATORS = new Set([
  'SEC', 'FED', 'OCC', 'CFTC', 'FINRA', 'CFPB', 'FDIC', 'ECB', 'ESMA', 'FCA',
  'FEDNOW', 'FINCEN', 'IRS', 'BAFIN', 'FEDERAL_RESERVE',
  'US_JURISDICTION', 'EU_JURISDICTION', 'UK_JURISDICTION',
  'SINGAPORE_JURISDICTION', 'SWITZERLAND_JURISDICTION', 'CAYMAN_BVI',
  'EU_WESTERN', 'SINGAPORE_REGION',
]);

const INSTITUTIONS = new Set([
  'JPMORGAN', 'BLACKROCK', 'BNY_MELLON', 'CITIGROUP', 'GOLDMAN_SACHS', 'GOLDMAN',
  'MORGAN_STANLEY', 'STATE_STREET', 'FIDELITY', 'CANTOR_FITZGERALD', 'DTCC',
  'CANTON_NETWORK', 'SWIFT', 'EUROCLEAR', 'BROADRIDGE', 'PIRUM', 'FEDWIRE',
  'THE_CLEARING_HOUSE', 'TREASURY_MARKET', 'ANCHORAGE', 'BITGO', 'FIREBLOCKS',
  'STANDARD_OIL', 'SWIFT_NETWORK', 'CLEARWAY_DTCC', 'MERIDIAN_CANTON',
]);

const ISSUERS = new Set([
  'COINBASE', 'SECURITIZE', 'CIRCLE', 'TETHER', 'ONDO', 'TOKENIZED_TREASURY',
  'UNISWAP', 'CURVE', 'AAVE_GOVERNANCE', 'COMPOUND_GOVERNANCE', 'AERODROME',
  'BINANCE', 'BACKED', 'SPIKO', 'CIRCLE_RESERVE_FUND', 'COINBASE_SPOT',
  'STABLECOIN_POOL', 'DEFI_TVL_POOL', 'DEX_SETTLEMENT', 'CROSS_CHAIN_BRIDGE',
  'RIPPLE_CORPORATE', 'PARAGRAPH',
]);

const CHAINS = new Set([
  'ETHEREUM', 'BASE', 'BASE_CHAIN', 'SOLANA', 'ARBITRUM', 'AVALANCHE',
]);

const PEOPLE = new Set([
  'LARRY_FINK', 'JAMIE_DIMON', 'CARLOS_DOMINGO', 'JESSE_POLLAK',
  'STANI_KULECHOV', 'ROBERT_LESHNER', 'DAN_GALLAGHER', 'BENJAMIN_STRONG',
]);

const DATA = new Set([
  'DEFILLAMA_DATA', 'DUNE_DATA', 'COINGECKO_DATA', 'SEC_EDGAR',
  'BLOOMBERG_TERMINAL', 'REUTERS_WIRE', 'CHAINLINK_ORACLES', 'CUSTOM_FEED',
  'EAS', 'CERTIK', 'CODE4RENA', 'SHERLOCK', 'DORA',
]);

export const FACET_LABELS: Record<DisplayKind, string> = {
  regulator: 'Regulators',
  institution: 'Institutions',
  issuer_protocol: 'Issuers / Protocols',
  chain: 'Chains',
  person: 'People',
  audience: 'Audiences',
  data_provider: 'Data / Oracles',
  dimension: 'Dimensions',
  r_plane_channel: 'R-plane (internal)',
  operator: 'Operator',
  other: 'Other',
};

export function codenameFromReportId(reportId: string): string {
  let raw = (reportId || '').trim();
  if (!raw) return '';
  if (raw.includes('-') && !raw.includes('_')) {
    raw = raw.replace(/-/g, '_').toUpperCase();
  } else {
    raw = raw.toUpperCase();
  }
  const m = raw.match(/^(.+)_(\d{8})$/);
  if (m) return m[1];
  if (raw.includes('_')) return raw.split('_').slice(0, -1).join('_');
  return raw;
}

export function resolveDisplayKind(codename: string): DisplayKind {
  const code = (codename || '').trim().toUpperCase();
  if (!code) return 'other';
  if (code === '34539544') return 'operator';
  if (R_PLANE.has(code)) return 'r_plane_channel';
  if (DIMENSIONS.has(code) || /_PRESENCE$/.test(code) || code.includes('QUALITY_') || /_EXPIRY$/.test(code) || /_SIGNAL$/.test(code)) {
    return 'dimension';
  }
  if (REGULATORS.has(code)) return 'regulator';
  if (CHAINS.has(code)) return 'chain';
  if (PEOPLE.has(code)) return 'person';
  if (code.endsWith('_AUDIENCE')) return 'audience';
  if (DATA.has(code) || code.endsWith('_DATA')) return 'data_provider';
  if (ISSUERS.has(code)) return 'issuer_protocol';
  if (INSTITUTIONS.has(code)) return 'institution';
  return 'other';
}

export function annotateReportId(reportId: string) {
  const entity_codename = codenameFromReportId(reportId);
  const display_kind = resolveDisplayKind(entity_codename);
  const demoted = DEMOTED.has(display_kind);
  return {
    entity_codename,
    display_kind,
    facet_label: FACET_LABELS[display_kind],
    public_default: !demoted,
    demoted,
  };
}
