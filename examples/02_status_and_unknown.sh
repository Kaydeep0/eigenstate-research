#!/bin/sh
# Status + UNKNOWN circulating on CIRCLE. Product behavior, not a missing cell.
set -eu
BASE="${GENIUSFLOW_FEDERATION_URL:-https://geniusflow-federation.vercel.app}"

echo "GET $BASE/api/status"
curl -sS "$BASE/api/status" | python3 -c "
import json, sys
s = json.load(sys.stdin)
print('service=', s.get('service'))
print('ok=', s.get('ok'))
print('spec_version=', s.get('spec_version'))
print('tier=', s.get('tier') or (s.get('availability') or {}).get('target'))
if s.get('ok') is not True:
    raise SystemExit('status not ok')
"

echo "GET $BASE/api/dossier?entity=CIRCLE  (circulating slot)"
curl -sS "$BASE/api/dossier?entity=CIRCLE" | python3 -c "
import json, sys
d = json.load(sys.stdin)
fs = d.get('field_state') or {}
meas = (fs.get('measurements') or {}) if isinstance(fs, dict) else {}
circ = meas.get('usdc_circulating') or {}
status = circ.get('status')
print('entity', d.get('entity'))
print('n_claims', len(d.get('claims') or []))
print('usdc_circulating.status', status)
print('usdc_circulating.value', circ.get('value'))
print('usdc_circulating.refuse_code', circ.get('refuse_code'))
if status != 'UNKNOWN':
    raise SystemExit('expected UNKNOWN circulating; got %r' % (status,))
if circ.get('value') not in (None, 'UNKNOWN'):
    raise SystemExit('circulating value must not be invented')
"
echo "02_status_and_unknown: PASS"
