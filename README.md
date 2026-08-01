# Eigenstate Research

**Public GitHub face** for Node `34539544` — research site + report Pages.

| Role | URL |
|------|-----|
| **Human site** (GitHub Pages / About Website) | https://kaydeep0.github.io/eigenstate-research/ |
| **Machine cold-start** (canonical agent index) | https://geniusflow-federation.vercel.app/llms.txt |

Measuring capital field dynamics in tokenized settlement (**RWA**). Observations are hash-chained; **attestation** commits land on Base mainnet when published. Machine tools: federation OpenAPI + **MCP** adapter docs (below).

> **Cold start:** the GeniusFlow engine GitHub repo is **private**. Agents discovering via GitHub should read this README § For agents, then follow federation URLs — not `git clone` of the engine. Agent discovery lives **here in the README** (GitHub About Website stays Pages).

---

## For agents

**Pages = human research site.** **Federation = machine cold-start.**

**Canonical start:** https://geniusflow-federation.vercel.app/llms.txt

No signup. No engine clone. Keywords for search/routing: **mcp**, **rwa**, **attestation**.

| Surface | URL |
|---------|-----|
| Agent index (`llms.txt`) — start here | https://geniusflow-federation.vercel.app/llms.txt |
| OpenAPI 3 | https://geniusflow-federation.vercel.app/openapi.json |
| Status / SLA | https://geniusflow-federation.vercel.app/api/status |
| Attestation proof shape | https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md |
| Tool adapter / MCP | https://geniusflow-federation.vercel.app/docs/AGENT_TOOL_ADAPTER.md |
| Agent descriptor | https://geniusflow-federation.vercel.app/ |

Pages also mirrors a pointer `llms.txt` that redirects agents to the federation canonical above:

| Surface | URL |
|---------|-----|
| Pages home (humans) | https://kaydeep0.github.io/eigenstate-research/ |
| Pages `llms.txt` (→ federation) | https://kaydeep0.github.io/eigenstate-research/llms.txt |
| Signal reports | https://kaydeep0.github.io/eigenstate-research/reports/ |
| Article RSS | https://kaydeep0.github.io/eigenstate-research/article_feed.xml |
| Agent pointer | [`AGENTS.md`](AGENTS.md) |

Traverse: hub → manifest → entity feed / dossier → chain verify → canonical report on Pages.

---

## Try it in 5 minutes

```bash
pip install helixhash requests
python3 demo/eigenstate_demo.py
```

HelixHash source: https://github.com/Kaydeep0/helixhash

This runs three live observations (SOFR rate, BlackRock BUIDL TVL, Ethereum GitHub stars),
chains them cryptographically via SHA-256, and prints the fingerprint.
Then click the Basescan link to verify the same fingerprint is on a public blockchain.

That is the measurement stack, demonstrated simply (demo ≠ full private engine).

---

## What this is

Independent research on SOFR, RWA settlement, and the infrastructure underneath tokenized fixed income. The private engine watches a large entity topology and measures structural gaps; **this repo publishes** the human-readable reports and static federation dossiers.

The measurement is not prediction. It is observation with a timestamp. The on-chain commit happens before external confirmation.

**Institution role:** public research site + report Pages for Node 34539544.

| Surface | Visibility | Role |
|---------|------------|------|
| [`eigenstate-research`](https://github.com/Kaydeep0/eigenstate-research) | **PUBLIC** | This site / GitHub discovery face |
| [Federation Vercel](https://geniusflow-federation.vercel.app) | **PUBLIC** | Live verify-wire / OpenAPI / MCP docs |
| [`helixhash`](https://github.com/Kaydeep0/helixhash) · [`witnessfield`](https://github.com/Kaydeep0/witnessfield) | **PUBLIC** | Integrity + evidence-scoring libs |
| `geniusflow-engine` | **PRIVATE** | Runtime (not cloneable without access) |

---

## How to verify any claim

Every published claim has an on-chain timestamp. The transaction hash in the article footer links directly to the specific transaction on Basescan. Example: https://basescan.org/tx/26a24d5aebcd2e15911618f6b5593956baf3d95e0fd05db6fb622779c0b5cbb4

All fact-check audit trails are public. The audit JSON for each article is committed alongside the article.

Machine path: GET federation `/api/manifest` → match `builds[].chain_hash` → GET `/api/chain` → open canonical report on Pages. Proof limb vocabulary: [ATTESTATION_PROOF_SHAPE.md](https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md).

## Published research

- [Signal Reports](reports/) — entity-level field measurements
- [On-Chain Proof Index](onchain/) — every Base mainnet commit, verifiable

## Methodology

[METHODOLOGY.md](METHODOLOGY.md)

## Contact

- Paragraph: https://paragraph.com/@eigenstate
- GitHub: https://github.com/Kaydeep0/eigenstate-research
- Federation: https://geniusflow-federation.vercel.app/
