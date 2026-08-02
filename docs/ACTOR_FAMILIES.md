# Actor families (reports index collapse)

Presentation-only parent/child grouping so the measured-actors table does not list every instrument as a peer of its issuer.

## Source of truth

- Explicit pairs: `src/data/actor_families.json` (mirrored from engine `data/measurement_links.json` join edges, plus a few report-only siblings such as `COINBASE_SPOT` → `COINBASE`).
- Optional prefix heuristic in `src/lib/actorFamilies.ts`: if `FOO_BAR` and `FOO` both appear as report entities, `FOO_BAR` collapses under `FOO` when no explicit link exists.

## Not in scope

- Engine topology / Magicians physics
- Invented TVL or market-cap ranks
- Collapsing demoted dimension nodes into actors
