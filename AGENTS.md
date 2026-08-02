# Agents — start here (public GitHub)

This repo is the **public GitHub face** for Eigenstate / GeniusFlow Node `34539544`.
The runtime engine (`Kaydeep0/geniusflow-engine`) is **private** — do not cold-start from a clone.
Topics: **mcp**, **rwa**, **attestation**.

**Pages = human site** (`https://kaydeep0.github.io/eigenstate-research/`).  
**Federation = machine cold-start.**

**Canonical start:** https://geniusflow-federation.vercel.app/llms.txt

1. Federation `llms.txt` (above) — Pages mirror points here: [`llms.txt`](https://kaydeep0.github.io/eigenstate-research/llms.txt)
2. OpenAPI: https://geniusflow-federation.vercel.app/openapi.json
3. Status / SLA: https://geniusflow-federation.vercel.app/api/status
4. Attestation proof shape: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md
5. MCP / tool adapter: https://geniusflow-federation.vercel.app/docs/AGENT_TOOL_ADAPTER.md
6. **Verify walkthrough** (curl admit/refuse for `AAVE_V3`): https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/
7. Human research (Pages): https://kaydeep0.github.io/eigenstate-research/

In-repo pointer: [`README.md`](README.md) § Appendix: For agents.

**Host ops:** after parkash, run `./scripts/refresh-public.sh` (needs `GENIUSFLOW_ROOT` + `GENIUSFLOW_BUILDER_DEPLOY=1`), then push Pages — do not hand-edit proof tiles.
