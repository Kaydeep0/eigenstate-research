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
7. **ERC-8004 refusal ledger** (what share of registered Base agents resolve to nothing, named by limb): https://kaydeep0.github.io/eigenstate-research/erc8004/ · machine: `/erc8004/summary.json`, `/erc8004/ledger.json` · per-agent receipts: https://geniusflow-federation.vercel.app/erc8004/receipts/`<agentId>`.json
8. Attestation proof shape: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md
9. MCP / tool adapter: https://geniusflow-federation.vercel.app/docs/AGENT_TOOL_ADAPTER.md
10. **Verify walkthrough** (curl admit/refuse for `AAVE_V3`): https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/
11. Human research (Pages): https://kaydeep0.github.io/eigenstate-research/ · entity-grouped [reports/](https://kaydeep0.github.io/eigenstate-research/reports/) · [track-record/](https://kaydeep0.github.io/eigenstate-research/track-record/)
12. Provenance: [provenance/](https://kaydeep0.github.io/eigenstate-research/provenance/) · OTS file under `opentimestamps/` · SWHIDs in federation `/api/agent` → `provenance`

In-repo pointer: [`README.md`](README.md) § Appendix: For agents. MCP source mirror: [`mcp/`](mcp/).

**Host ops:** after parkash, run `./scripts/refresh-public.sh` (needs `GENIUSFLOW_ROOT` + `GENIUSFLOW_BUILDER_DEPLOY=1`), then push Pages - do not hand-edit proof tiles.  
**Host-pending membership clicks** (agents must not): MCP registry publish · A2A `gh` comments · `ots upgrade`. The registration miss rate is no longer a belief: cite the probe ledger in item 7, with its pinned block and digest, and nothing beyond it.
