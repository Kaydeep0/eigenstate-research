#!/bin/sh
# Outsider path: CIRCLE dossier → verify first claim grounding.
# Do not invent expected. Requires curl + python3.
set -eu
BASE="${GENIUSFLOW_FEDERATION_URL:-https://geniusflow-federation.vercel.app}"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "GET $BASE/api/dossier?entity=CIRCLE"
curl -sS "$BASE/api/dossier?entity=CIRCLE" > "$WORKDIR/dossier.json"

python3 - "$WORKDIR" <<'PY'
import json, sys
from pathlib import Path
wd = Path(sys.argv[1])
d = json.loads((wd / "dossier.json").read_text())
if d.get("entity") != "CIRCLE":
    raise SystemExit("expected entity CIRCLE")
claims = d.get("claims") or []
if not claims:
    raise SystemExit("no claims[] on CIRCLE dossier")
g = (claims[0].get("grounding") or {})
url = g.get("source_url")
exp = g.get("expected")
print("claim_id=", claims[0].get("claim_id"))
print("source_url=", url)
print("expected=", exp)
if not url or exp in (None, ""):
    raise SystemExit("missing grounding; refusing to invent expected")
(wd / "verify.json").write_text(json.dumps({"source_url": url, "expected": exp}))
PY

echo "POST $BASE/api/verify"
curl -sS -X POST "$BASE/api/verify" \
  -H "Content-Type: application/json" \
  -d @"$WORKDIR/verify.json" | python3 -c "
import json, sys
v = json.load(sys.stdin)
print('found=', v.get('found'))
print('ok=', v.get('ok'))
print('status=', v.get('status'))
print('admitted=', (v.get('proof_shape') or {}).get('admitted'))
if v.get('found') is not True:
    raise SystemExit('verify did not find expected substring')
"
echo
echo "01_verify_circle: PASS"
