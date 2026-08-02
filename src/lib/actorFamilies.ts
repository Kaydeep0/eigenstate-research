/**
 * Parent/child collapse for the reports measured-actors table.
 * See docs/ACTOR_FAMILIES.md and src/data/actor_families.json.
 */
import familyTable from '../data/actor_families.json';

type FamilyLink = { child: string; parent: string; relation?: string };

const explicit = new Map<string, string>();
for (const row of (familyTable as { links?: FamilyLink[] }).links || []) {
  const child = String(row.child || '')
    .trim()
    .toUpperCase();
  const parent = String(row.parent || '')
    .trim()
    .toUpperCase();
  if (child && parent && child !== parent) explicit.set(child, parent);
}

const usePrefix = (familyTable as { prefix_heuristic?: boolean }).prefix_heuristic !== false;

/** Resolve presentation parent for an entity code, or null if it is a root row. */
export function parentOf(code: string, knownCodes: Set<string>): string | null {
  const key = String(code || '')
    .trim()
    .toUpperCase();
  if (!key) return null;

  const mapped = explicit.get(key);
  if (mapped && knownCodes.has(mapped)) return mapped;

  if (!usePrefix) return null;

  // Longest proper underscore-prefix that is itself a known actor (COINBASE_SPOT → COINBASE).
  let best: string | null = null;
  let idx = key.indexOf('_');
  while (idx > 0) {
    const cand = key.slice(0, idx);
    if (knownCodes.has(cand) && cand !== key) best = cand;
    idx = key.indexOf('_', idx + 1);
  }
  return best;
}

export type ActorNode<T> = {
  parent: T;
  children: T[];
};

/**
 * Collapse a flat actor list into parent rows with children.
 * Orphans (parent missing from the list) stay as roots.
 */
export function groupActorsByFamily<T extends { entityCode: string }>(
  items: T[]
): ActorNode<T>[] {
  const byCode = new Map(items.map((g) => [g.entityCode, g]));
  const known = new Set(byCode.keys());
  const childrenOf = new Map<string, T[]>();
  const childCodes = new Set<string>();

  for (const item of items) {
    const p = parentOf(item.entityCode, known);
    if (!p || !byCode.has(p)) continue;
    const list = childrenOf.get(p) ?? [];
    list.push(item);
    childrenOf.set(p, list);
    childCodes.add(item.entityCode);
  }

  const roots: ActorNode<T>[] = [];
  for (const item of items) {
    if (childCodes.has(item.entityCode)) continue;
    const kids = (childrenOf.get(item.entityCode) ?? []).sort((a, b) =>
      a.entityCode.localeCompare(b.entityCode)
    );
    roots.push({ parent: item, children: kids });
  }
  return roots;
}
