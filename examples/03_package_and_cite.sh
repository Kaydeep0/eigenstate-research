#!/bin/sh
# Package a published CIRCLE claim, then cite it.
# Cite requires {kind, id, claim} — a raw claim object is not enough.
set -eu
BASE="${GENIUSFLOW_FEDERATION_URL:-https://geniusflow-federation.vercel.app}"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

curl -sS "$BASE/api/dossier?entity=CIRCLE" > "$WORKDIR/dossier.json"
python3 - "$WORKDIR" <<'PY'
import json, sys
from pathlib import Path
wd = Path(sys.argv[1])
d = json.loads((wd / "dossier.json").read_text())
claim = (d.get("claims") or [None])[0]
if not isinstance(claim, dict):
    raise SystemExit("no published claim")
(wd / "claim.json").write_text(json.dumps(claim))
(wd / "cite.json").write_text(json.dumps({
    "kind": "claim",
    "id": claim.get("claim_id"),
    "claim": claim,
}))
print("claim_id=", claim.get("claim_id"))
PY

echo "POST $BASE/api/package"
curl -sS -X POST "$BASE/api/package" \
  -H "Content-Type: application/json" \
  -d @"$WORKDIR/claim.json" | python3 -c "
import json, sys
p = json.load(sys.stdin)
print('disposition=', p.get('disposition'))
print('claim_id=', p.get('claim_id'))
if p.get('disposition') != 'admitted':
    raise SystemExit('expected admitted package over published CIRCLE claim')
"

echo "POST $BASE/api/cite"
curl -sS -X POST "$BASE/api/cite" \
  -H "Content-Type: application/json" \
  -d @"$WORKDIR/cite.json" | python3 -c "
import json, sys
c = json.load(sys.stdin)
print('ok=', c.get('ok'))
print('cite_class=', c.get('cite_class'))
print('kind=', c.get('kind'))
if c.get('ok') is not True or c.get('cite_class') != 'citeable':
    raise SystemExit('cite packet was not citeable')
"
echo "03_package_and_cite: PASS"
