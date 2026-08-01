#!/usr/bin/env bash
# Refresh public/field-state.json from the live engine SoT (Host).
#
# Prefers GENIUSFLOW_ROOT if set; otherwise common local clones.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/public/field-state.json"

GF="${GENIUSFLOW_ROOT:-}"
if [[ -z "${GF}" ]]; then
  for candidate in \
    "${HOME}/Desktop/GENIUSFLOW_OS/workspace/geniusflow" \
    "${HOME}/GENIUSFLOW_OS/workspace/geniusflow" \
    "${ROOT}/../geniusflow"
  do
    if [[ -d "${candidate}/engine/tools" ]]; then
      GF="${candidate}"
      break
    fi
  done
fi

if [[ -z "${GF}" || ! -f "${GF}/engine/tools/export_pages_sot.py" ]]; then
  echo "error: geniusflow engine not found. Set GENIUSFLOW_ROOT." >&2
  exit 1
fi

echo "Exporting Pages SoT from ${GF} → ${OUT}"
PYTHONPATH="${GF}/engine" python3 "${GF}/engine/tools/export_pages_sot.py" --out "${OUT}"
echo "Done. Commit ${OUT} and deploy Pages (astro build / gh-pages)."
