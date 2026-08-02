# Agents - start here (public GitHub)

This repo is the **public GitHub face** for Eigenstate / GeniusFlow Node `34539544`.
The runtime engine (`Kaydeep0/geniusflow-engine`) is **private** - do not cold-start from a clone.
Topics: **mcp**, **rwa**, **attestation**.

**Pages = human site** (`https://kaydeep0.github.io/eigenstate-research/`).  
**Federation = machine cold-start.**

**Canonical start:** https://geniusflow-federation.vercel.app/llms.txt

1. Federation `llms.txt` (above) - Pages mirror points here: [`llms.txt`](https://kaydeep0.github.io/eigenstate-research/llms.txt)
2. OpenAPI: https://geniusflow-federation.vercel.app/openapi.json
3. Status / SLA: https://geniusflow-federation.vercel.app/api/status
4. MCP remote: https://geniusflow-federation.vercel.app/api/mcp · declaration: `/server.json`
5. A2A card: https://geniusflow-federation.vercel.app/.well-known/agent-card.json · JSON-RPC: `/api/a2a`
6. ERC-8004 domain proof: https://geniusflow-federation.vercel.app/.well-known/agent-registration.json (empty `registrations`; named refusal - no agentId claimed)
7. Attestation proof shape: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md
8. MCP / tool adapter: https://geniusflow-federation.vercel.app/docs/AGENT_TOOL_ADAPTER.md
9. **Verify walkthrough** (curl admit/refuse for `AAVE_V3`): https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/
10. Human research (Pages): https://kaydeep0.github.io/eigenstate-research/ · entity-grouped [reports/](https://kaydeep0.github.io/eigenstate-research/reports/) · [track-record/](https://kaydeep0.github.io/eigenstate-research/track-record/)
11. Provenance: [provenance/](https://kaydeep0.github.io/eigenstate-research/provenance/) · OTS file under `opentimestamps/` · SWHIDs in federation `/api/agent` → `provenance`
12. **Provenance census** (PEP 740 and SLSA over this engine's own 94 dependencies; 44 attested and verified, 0 with SLSA build provenance; expectations published before the run): https://kaydeep0.github.io/eigenstate-research/slsa/ · machine: [`/slsa/summary.json`](https://kaydeep0.github.io/eigenstate-research/slsa/summary.json). A census of one install set, never quote it as a PyPI-wide rate.

In-repo pointer: [`README.md`](README.md) § Appendix: For agents. MCP source mirror: [`mcp/`](mcp/).

**Host ops:** after parkash, run `./scripts/refresh-public.sh` (needs `GENIUSFLOW_ROOT` + `GENIUSFLOW_BUILDER_DEPLOY=1`), then push Pages - do not hand-edit proof tiles.  
**Host-pending membership clicks** (agents must not): MCP registry publish · A2A `gh` comments · `ots upgrade`. No invented registration miss-rate until the day-6 probe ledger is published.
