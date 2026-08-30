#!/bin/sh
# Confirm OpenAPI paths exist on the live origin and match advertised tools.
set -eu
BASE="${GENIUSFLOW_FEDERATION_URL:-https://geniusflow-federation.vercel.app}"
curl -sS "$BASE/openapi.json" | python3 -c "
import json, sys
oa = json.load(sys.stdin)
paths = oa.get('paths') or {}
need = [
    '/api/status', '/api/dossier', '/api/verify', '/api/package', '/api/cite',
    '/api/mcp', '/openapi.json', '/server.json',
]
missing = [p for p in need if p not in paths]
print('title=', (oa.get('info') or {}).get('title'))
print('version=', (oa.get('info') or {}).get('version'))
print('n_paths=', len(paths))
if missing:
    raise SystemExit('openapi missing ' + ','.join(missing))
print('05_openapi_check: PASS')
"
