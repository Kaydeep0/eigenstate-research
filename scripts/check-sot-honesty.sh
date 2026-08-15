#!/usr/bin/env bash
# Fail CI when marketing/hardcoded coverage or fake accuracy sneaks into Astro sources.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0

# Forbidden: presenting stale denoms as live coverage (e.g. "196 / 199").
# Allowed: explanatory prose that forbids those denoms ("Forbidden … 196/197").
if rg -n --glob 'src/pages/**/*.{astro,ts,tsx,js}' --glob 'src/components/**/*.{astro,ts,tsx,js}' \
  -e '\b196\s*/\s*199\b' -e '\b197\s*/\s*199\b' -e 'coverage[^.\n]{0,40}\b196\b' \
  . 2>/dev/null | rg -v 'forbidden' | rg -v 'Forbidden' | rg -v 'never used' | rg -v 'denoms \(196'; then
  echo "FAIL: forbidden stale M1 denom pattern in Astro sources" >&2
  fail=1
fi

# Fake 100% accuracy marketing in live tiles (allow explanatory "not a fake 100%" prose).
if rg -n --glob 'src/pages/**/*.{astro,ts}' --glob 'src/components/**/*.{astro,ts}' \
  -e 'accuracy[^\n]{0,40}100%' -e '100%\s*accuracy' -e 'assessable accuracy[^\n]{0,20}100' \
  . 2>/dev/null | rg -v 'fake 100%' | rg -v 'not a fake'; then
  echo "FAIL: hardcoded 100% accuracy marketing in Astro sources" >&2
  fail=1
fi

# Fake Wave-6 capture / confidence marketing (allow "not a Wave-6 capture forecast" prose).
if rg -n --glob 'src/pages/**/*.{astro,ts,js}' --glob 'src/components/**/*.{astro,ts}' --glob 'src/scripts/**/*.js' \
  -e 'Wave 6[^\n]{0,40}90%' -e '90%[^\n]{0,40}(confidence|Concentration|Wave 6)' \
  -e 'Wave 6 Progress' -e 'Concentration Probability' \
  . 2>/dev/null | rg -v 'not a Wave-6' | rg -v 'no projected' | rg -v 'Wave-6 capture forecast'; then
  echo "FAIL: Wave 6 / 90% marketing overclaim in Astro sources" >&2
  fail=1
fi

# field-state must exist and use denom 199
if [[ ! -f public/field-state.json ]]; then
  echo "FAIL: missing public/field-state.json" >&2
  fail=1
else
  python3 - <<'PY' || fail=1
import json, sys
d=json.load(open("public/field-state.json"))
den=int((d.get("coverage") or {}).get("m1_denominator") or 0)
if den != 199:
    print(f"FAIL: field-state m1_denominator={den}, expected 199", file=sys.stderr)
    sys.exit(1)
acc=(d.get("predictions_scoreboard") or {}).get("accuracy_pct")
n=int((d.get("predictions_scoreboard") or {}).get("n_assessable") or 0)
if acc is not None and n < 5:
    print(f"FAIL: accuracy_pct set with thin n_assessable={n}", file=sys.stderr)
    sys.exit(1)
print(f"OK field-state M1 denom={den} assessable_n={n} accuracy_pct={acc}")
PY
fi

if [[ ! -f public/field-graph.json ]]; then
  echo "FAIL: missing public/field-graph.json" >&2
  fail=1
else
  python3 - <<'PY' || fail=1
import json, sys
d=json.load(open("public/field-graph.json"))
if d.get("schema") != "eigenstate.field_graph.v1":
    print(f"FAIL: field-graph schema={d.get('schema')}", file=sys.stderr)
    sys.exit(1)
nodes=d.get("nodes") or []
edges=d.get("edges") or []
if len(nodes) < 50 or len(edges) < 50:
    print(f"FAIL: field-graph too small nodes={len(nodes)} edges={len(edges)}", file=sys.stderr)
    sys.exit(1)
if any("real_name" in n for n in nodes if isinstance(n, dict)):
    print("FAIL: field-graph leaked real_name", file=sys.stderr)
    sys.exit(1)
print(f"OK field-graph nodes={len(nodes)} edges={len(edges)}")
PY
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi
echo "OK sot honesty checks"
