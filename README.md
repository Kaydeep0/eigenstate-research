# Eigenstate Research

Independent measurement of tokenized fixed-income and RWA settlement — observe, measure, verify, publish.

**Site:** [kaydeep0.github.io/eigenstate-research](https://kaydeep0.github.io/eigenstate-research/)

---

## The problem

Tokenized funds, stablecoin rails, and on-chain settlement look transparent at the surface. The hard parts — who can settle, under what clock, against which benchmark, with what custody and regulatory path — stay opaque.

Markets price the product. Few parties systematically measure the **structure underneath**: the obligations, permissions, and dependencies that decide whether settlement actually works.

---

## What Eigenstate does

Eigenstate is a research measurement stack for that structure. It does **not** predict prices or trade markets.

| Step | Meaning |
|------|---------|
| **Observe** | Watch a fixed map of institutions and rails that matter for tokenized FI |
| **Measure** | Score how much *new* information each entity produces relative to watch cost |
| **Verify** | Fact-check and admit/refuse claims before they are treated as published |
| **Publish** | Ship human reports on Pages; commit attestations on Base when gates allow |

Public output lives here (reports, dossiers, proof index). The runtime engine stays private.

---

## How it works

Short version. Depth and caveats: [METHODOLOGY.md](METHODOLOGY.md).

### E = ΔI / A

Information efficiency: new information gained (**ΔI**) over observation cost (**A**). Structural metric, not a forecast.

*Example.* On an SEC filing day, a new rulemaking document against the prior expected state → high **E**. Same feed on a quiet day → low **E**.

### Vault

Qualifying observations append to a hash-chained measurement log. Changing an old row breaks later hashes.

*Example.* After a qualifying read of CIRCLE or BLACKROCK, the private vault appends a chained row. Public mirrors: [CIRCLE](https://kaydeep0.github.io/eigenstate-research/federation/dossier/CIRCLE.json), [BLACKROCK](https://kaydeep0.github.io/eigenstate-research/federation/dossier/BLACKROCK.json). Not every vault row becomes a report.

### Helix / attestation (when published)

Local chaining is continuous. On-chain commits to Base land when wallet, balance, and mirror gates pass — **attested when it lands**, not every cycle.

*Example.* Historical commits: [On-Chain Proof Index](https://kaydeep0.github.io/eigenstate-research/onchain/). Sample tx: [0x5a132a48…77a66](https://basescan.org/tx/0x5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66). Prefer the index over any single hard-coded hash.

### Verification rails

Dispatch fact-check → VERIFY / `status_at_publish` → federation proof_shape admit/refuse. Cheap copies that invent “attested” labels fail.

*Example.* A package with a real registry reference and provenance spine can **admit**. One that stamps ATTESTED without that spine **refuses**. Spec: [ATTESTATION_PROOF_SHAPE.md](https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md).

### Structural gaps

We look for what the topology *needs* that product design still treats as optional.

*Example.* SOFR + ISDA fallback is often treated as a full LIBOR replacement; the stack still scores a persistent term-structure gap (`LIBOR_EQUIVALENT`). See [predictions](https://kaydeep0.github.io/eigenstate-research/predictions/).

---

## Evidence / try it

| Path | Link |
|------|------|
| Methodology (full depth) | [METHODOLOGY.md](METHODOLOGY.md) |
| Signal reports | [reports/](https://kaydeep0.github.io/eigenstate-research/reports/) |
| On-chain proof index | [onchain/](https://kaydeep0.github.io/eigenstate-research/onchain/) |
| Federation verify (technical) | [geniusflow-federation.vercel.app](https://geniusflow-federation.vercel.app/) → `/api/manifest`, `/api/chain`, `/api/verify` |

**5-minute demo** (toy stack; not the private engine):

```bash
pip install helixhash requests
python3 public/demo/eigenstate_demo.py
```

HelixHash: [Kaydeep0/helixhash](https://github.com/Kaydeep0/helixhash). The script pulls a few public series, chains them with SHA-256, and points at Basescan for the verification idea. Demo ≠ production cadence or full topology coverage.

---

## Public surfaces

| Surface | Role |
|---------|------|
| [GitHub Pages](https://kaydeep0.github.io/eigenstate-research/) | Human research site (canonical website) |
| [This repo](https://github.com/Kaydeep0/eigenstate-research) | Public GitHub face — reports, static federation mirrors, docs |
| [Federation (Vercel)](https://geniusflow-federation.vercel.app/) | Live verify wire, OpenAPI, agent docs |
| [helixhash](https://github.com/Kaydeep0/helixhash) · [witnessfield](https://github.com/Kaydeep0/witnessfield) | Public integrity / evidence libs |
| `geniusflow-engine` | **Private** runtime — not cloneable without access |

---

## Status

Research / pre-revenue. Public artifacts are real (reports, dossiers, Basescan commits when published). There is no claimed customer book, bank partnership, or production settlement product on this face.

Coverage and on-chain mirror paths are partial by design — see Methodology for what is live vs gated. Do not invent traction from star counts or marketing tiles elsewhere on the site.

---

## Contact

- Paragraph: [paragraph.com/@eigenstate](https://paragraph.com/@eigenstate)
- GitHub: [Kaydeep0/eigenstate-research](https://github.com/Kaydeep0/eigenstate-research)
- Site: [kaydeep0.github.io/eigenstate-research](https://kaydeep0.github.io/eigenstate-research/)

---

## Appendix: For agents

Pages stays the human website. Machine cold-start is federation — not this README’s top matter, and not a clone of the private engine.

**Canonical start:** https://geniusflow-federation.vercel.app/llms.txt

| Surface | URL |
|---------|-----|
| Agent index (`llms.txt`) | https://geniusflow-federation.vercel.app/llms.txt |
| OpenAPI 3 | https://geniusflow-federation.vercel.app/openapi.json |
| Status / SLA | https://geniusflow-federation.vercel.app/api/status |
| Attestation proof shape | https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md |
| Tool adapter / MCP | https://geniusflow-federation.vercel.app/docs/AGENT_TOOL_ADAPTER.md |
| Pages `llms.txt` (pointer) | https://kaydeep0.github.io/eigenstate-research/llms.txt |
| In-repo pointer | [`AGENTS.md`](AGENTS.md) |

Traverse: hub → manifest → entity feed / dossier → chain verify → canonical report on Pages.
