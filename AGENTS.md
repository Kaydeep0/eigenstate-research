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

13. **RWA disclosure interface survey** (17 tracked real world asset issuers and instruments; 0 of 17 serve a machine readable disclosure surface they operate; the 2 machine readable surfaces both belong to a third party aggregator; 0 of 45 conventional path requests answered; 0 of 15 surfaces carry a chain qualified registry reference; expectations published before the run): https://kaydeep0.github.io/eigenstate-research/rwa/ · machine: [`/rwa/summary.json`](https://kaydeep0.github.io/eigenstate-research/rwa/summary.json). Asks only whether the number is machine readable, not whether the disclosure is good. Never quote as a sector rate; 11 of the 17 refusals are this node's own coverage gap, so cite `attributable_to_issuer` for the issuer-attributable figure.
14. **Grounded claim corpus** (the 6 SEC and Fed claims this node publishes, rechecked against what those URLs serve today; 6 of 6 still grounded at the cited URL; 5 of 6 clear every MUST; 0 of 6 clear MUST and SHOULD; 0 of 6 cite a primary filing; expectations published before the run): https://kaydeep0.github.io/eigenstate-research/grounded-claims/ · machine: [`/grounded-claims/summary.json`](https://kaydeep0.github.io/eigenstate-research/grounded-claims/summary.json). Asks whether the grounding still holds, not whether the claim is true. Never quote as a regulator-wide rate; the population is this node's whole regulator-grounded surface.
15. **Transparency log batch monitor** (23 public logs; 22 of 23 MUST-admit; 11 of 11 consistency proofs recomputed; 0 disagreements this batch; expectations published before the batch): https://kaydeep0.github.io/eigenstate-research/tlog/ · machine: [`/tlog/summary.json`](https://kaydeep0.github.io/eigenstate-research/tlog/summary.json). This node is a monitor, not a witness: it holds no key and cosigns nothing. Never quote as ecosystem coverage.

In-repo pointer: [`README.md`](README.md) § Appendix A: agent surfaces (core · network membership · measured ledgers · provenance). Measured-ledger citation rules sit in that README under § Measured ledgers. MCP source mirror: [`mcp/`](mcp/).

**Host ops:** after parkash, run `./scripts/refresh-public.sh` (needs `GENIUSFLOW_ROOT` + `GENIUSFLOW_BUILDER_DEPLOY=1`), then push Pages - do not hand-edit proof tiles.  
**Host-done membership clicks:** MCP registry published `io.github.Kaydeep0/geniusflow-federation` **1.0.0** · OTS helix-head Bitcoin-attested at block **960660**. **A2A day-5 comments: posted.** Cite the ERC-8004 probe ledger for miss-rate; do not invent one.
