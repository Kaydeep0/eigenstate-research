#!/usr/bin/env bash
# Post-parkash public refresh — single Host/CI entrypoint.
#
# 1) Export engine SoT → public/field-state.json
# 2) Rebake + deploy federation (when GENIUSFLOW_BUILDER_DEPLOY=1)
# 3) Sync dossier mirrors into this Pages repo
#
# Usage:
#   export GENIUSFLOW_ROOT=~/Desktop/GENIUSFLOW_OS/workspace/geniusflow
#   export GENIUSFLOW_BUILDER_DEPLOY=1
#   ./scripts/refresh-public.sh
#   git add public/field-state.json public/federation federation
#   git commit && git push   # GitHub Pages deploy workflow
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export EIGENSTATE_SITE_ROOT="${EIGENSTATE_SITE_ROOT:-$ROOT}"

GF="${GENIUSFLOW_ROOT:-}"
if [[ -z "${GF}" ]]; then
  for candidate in \
    "${HOME}/Desktop/GENIUSFLOW_OS/workspace/geniusflow" \
    "${HOME}/GENIUSFLOW_OS/workspace/geniusflow" \
    "${ROOT}/../geniusflow"
  do
    if [[ -f "${candidate}/engine/tools/refresh_public_surfaces.py" ]]; then
      GF="${candidate}"
      break
    fi
  done
fi

if [[ -z "${GF}" || ! -f "${GF}/engine/tools/refresh_public_surfaces.py" ]]; then
  echo "error: geniusflow engine not found. Set GENIUSFLOW_ROOT." >&2
  exit 1
fi

echo "Refreshing public surfaces from ${GF}"
echo "  Pages site: ${EIGENSTATE_SITE_ROOT}"
echo "  GENIUSFLOW_BUILDER_DEPLOY=${GENIUSFLOW_BUILDER_DEPLOY:-0}"

PYTHONPATH="${GF}:${GF}/engine" python3 "${GF}/engine/tools/refresh_public_surfaces.py" \
  --site "${EIGENSTATE_SITE_ROOT}"

# Keep repo-root federation/ in sync with public/ (legacy static mirror path).
if [[ -d "${ROOT}/public/federation" ]]; then
  mkdir -p "${ROOT}/federation"
  rsync -a --delete "${ROOT}/public/federation/" "${ROOT}/federation/" 2>/dev/null \
    || cp -R "${ROOT}/public/federation/." "${ROOT}/federation/"
fi

# Mirror agent entry for Pages (repo AGENTS.md is not published unless copied).
if [[ -f "${ROOT}/AGENTS.md" ]]; then
  cp "${ROOT}/AGENTS.md" "${ROOT}/public/AGENTS.md"
fi
if [[ -f "${ROOT}/METHODOLOGY.md" ]]; then
  cp "${ROOT}/METHODOLOGY.md" "${ROOT}/public/METHODOLOGY.md"
fi

# The 5-minute demo reads the commit index published beside it. Without this
# copy it drifts behind /onchain/ and points outsiders at a stale Base tx.
if [[ -f "${ROOT}/src/data/helix_commits.json" ]]; then
  cp "${ROOT}/src/data/helix_commits.json" "${ROOT}/public/demo/helix_commits.json"
fi

echo "Done. Commit public/field-state.json + federation mirrors, then push Pages."
echo "Legacy alias: ./scripts/refresh-sot.sh → this script."
