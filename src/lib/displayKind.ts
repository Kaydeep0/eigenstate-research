/**
 * Browse-facing display_kind overlay (DefiLlama-inspired IA).
 * SoT mirrored from geniusflow data/entity_display_kinds.json.
 * Physics topology stays entity-uniform; this is presentation only.
 */
import kindTable from '../data/entity_display_kinds.json';

export type DisplayKind =
  | 'regulator'
  | 'institution'
  | 'issuer_protocol'
  | 'chain'
  | 'rule_framework'
  | 'person'
  | 'audience'
  | 'data_provider'
  | 'dimension'
  | 'r_plane_channel'
  | 'operator'
  | 'other';

type KindRow = {
  display_kind: string;
  facet_label: string;
  display_role?: string;
  role_label?: string;
  public_default?: boolean;
  demoted?: boolean;
};

const entities = (kindTable as { entities?: Record<string, KindRow> }).entities || {};
const demotedKinds = new Set(
  ((kindTable as { demoted_kinds?: string[] }).demoted_kinds || [
    'dimension',
    'r_plane_channel',
    'operator',
  ]).map(String)
);

/** Facet chips for the reports index (public first; dimensions last). */
export const REPORT_FACETS: { id: string; label: string }[] = [
  { id: 'public', label: 'Public actors' },
  { id: 'regulator', label: 'Regulators' },
  { id: 'issuer_protocol', label: 'Issuers / Protocols' },
  { id: 'institution', label: 'Institutions' },
  { id: 'chain', label: 'Chains' },
  { id: 'rule_framework', label: 'Rule frameworks' },
  { id: 'person', label: 'People' },
  { id: 'audience', label: 'Audiences' },
  { id: 'data_provider', label: 'Data / Oracles' },
  { id: 'dimension', label: 'Dimensions' },
  { id: 'other', label: 'Other' },
];

export function annotateEntityCode(code: string): KindRow & { entity_codename: string } {
  const key = String(code || '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '_');
  const row = entities[key];
  if (row) {
    return { entity_codename: key, ...row };
  }
  // Heuristic fallback when a report entity is not in the mirrored table yet.
  let kind: DisplayKind = 'other';
  if (key === 'REPUTATION' || key.endsWith('_PRESENCE') || key.includes('_SIGNAL')) {
    kind = 'dimension';
  } else if (key.endsWith('_AUDIENCE')) {
    kind = 'audience';
  } else if (['ETHEREUM', 'BASE', 'SOLANA', 'ARBITRUM', 'POLYGON', 'OPTIMISM', 'AVALANCHE'].includes(key)) {
    kind = 'chain';
  } else if (key.startsWith('REG_') || key.startsWith('MICA')) {
    kind = 'rule_framework';
  }
  const demoted = demotedKinds.has(kind);
  return {
    entity_codename: key,
    display_kind: kind,
    facet_label:
      kind === 'dimension'
        ? 'Dimensions'
        : kind === 'issuer_protocol'
          ? 'Issuers / Protocols'
          : kind.charAt(0).toUpperCase() + kind.slice(1).replace(/_/g, ' '),
    public_default: !demoted,
    demoted,
  };
}
