#!/usr/bin/env bash
# Backward-compatible alias → full public refresh pipeline.
exec "$(cd "$(dirname "$0")" && pwd)/refresh-public.sh" "$@"
