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
7b. **RWA disclosure interface survey** (can a program read an RWA issuer's disclosed figure at all; 0 of 17 tracked issuers serve a machine readable surface they operate, and the 2 machine readable surfaces in the population both belong to a third party aggregator): https://kaydeep0.github.io/eigenstate-research/rwa/ · machine: `/rwa/summary.json`, `/rwa/ledger.json` · per-issuer receipts: https://geniusflow-federation.vercel.app/rwa/receipts/`<ENTITY>`.json
8. Attestation proof shape: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md
9. MCP / tool adapter: https://geniusflow-federation.vercel.app/docs/AGENT_TOOL_ADAPTER.md
10. **Verify walkthrough** (curl admit/refuse for `AAVE_V3`): https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/
11. Human research (Pages): https://kaydeep0.github.io/eigenstate-research/ · entity-grouped [reports/](https://kaydeep0.github.io/eigenstate-research/reports/) · [track-record/](https://kaydeep0.github.io/eigenstate-research/track-record/)
12. Provenance: [provenance/](https://kaydeep0.github.io/eigenstate-research/provenance/) · OTS file under `opentimestamps/` · SWHIDs in federation `/api/agent` → `provenance`

In-repo pointer: [`README.md`](README.md) § Appendix: For agents. MCP source mirror: [`mcp/`](mcp/).

**Host ops:** after parkash, run `./scripts/refresh-public.sh` (needs `GENIUSFLOW_ROOT` + `GENIUSFLOW_BUILDER_DEPLOY=1`), then push Pages - do not hand-edit proof tiles.  
**Host-done membership clicks:** MCP registry published `io.github.Kaydeep0/geniusflow-federation` **1.0.0** · OTS helix-head Bitcoin-attested at block **960660**. **A2A day-5 comments: posted.** The registration miss rate is no longer a belief: cite the probe ledger in item 7, with its pinned block and digest, and nothing beyond it.
