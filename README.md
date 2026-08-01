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

```mermaid
flowchart LR
  T[Topology] --> S[Sensors / Parkash]
  S --> V[Vault<br/>hash chain]
  V --> VER[VERIFY / proof_shape]
  VER --> P[Pages report]
  VER -.->|when gates allow| B[Base commit]
```

*Observe → measure → verify → publish; Base attest is gated. Structural metric, not a price forecast. Helix / on-chain commit is not every cycle.*

### E = ΔI / A

Information efficiency: new information gained (**ΔI**) over observation cost (**A**). Structural metric, not a forecast.

*Example.* On an SEC filing day, a new rulemaking document against the prior expected state → high **E**. Same feed on a quiet day → low **E**.

### Vault

Qualifying observations append to a hash-chained measurement log (ΔI / E + integrity fields). Entity field numbers **Φ_S** / **κ** (not **Γ**) are mirrored on public dossiers. Changing an old vault row breaks later hashes / parent checks.

*Example.* After a qualifying read of CIRCLE or BLACKROCK, the private vault appends a chained row; dossiers expose live Φ_S / κ. Public mirrors: [CIRCLE](https://kaydeep0.github.io/eigenstate-research/federation/dossier/CIRCLE.json), [BLACKROCK](https://kaydeep0.github.io/eigenstate-research/federation/dossier/BLACKROCK.json). Not every vault row becomes a report.

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

## Use cases

Honest, outsider-facing. Grounded in what the public stack actually ships today.

### RWA / governance diligence

| | |
|--|--|
| **Who** | Allocator, compliance, or RWA-desk analysts reviewing tokenized FI issuers and rails |
| **Today without this** | Manual scrapes of issuer sites, filings, and press; no shared admit/refuse check on “attested” packages |
| **Eigenstate offers** | Public dossiers + signal reports; federation `/api/verify` and `/api/package` against registry / proof_shape; `status_at_publish` on published claims |
| **Not** | Bank settlement, custody, KYC, or a paid diligence SLA |

### Research desk — structural gap tracking

| | |
|--|--|
| **Who** | Rates / structure research desks watching benchmark and settlement fragility |
| **Today without this** | Ad hoc SOFR/LIBOR notes; product marketing treated as full replacement |
| **Eigenstate offers** | Persistent gap framing (`LIBOR_EQUIVALENT`) on the [predictions](https://kaydeep0.github.io/eigenstate-research/predictions/) page, tied to the fixed M1 topology |
| **Not** | Price forecasts, trade signals, or a claim that publishing a SOFR article “closes” the gap |

### Agent tooling for attested claims *(secondary)*

| | |
|--|--|
| **Who** | Builders and agents that need machine-readable claim surfaces |
| **Today without this** | Scrape HTML; invent “attested” labels with no refuse limb |
| **Eigenstate offers** | Federation [llms.txt](https://geniusflow-federation.vercel.app/llms.txt), OpenAPI, `/api/manifest` · `/api/verify` · `/api/package`, proof_shape admit/refuse, MCP adapter docs |
| **Not** | Guaranteed uptime or a commercial agent SLA (`/api/status` is best-effort Vercel) |

### Internal measurement / audit trail

| | |
|--|--|
| **Who** | Host / internal research ops running the private engine |
| **Today without this** | Scattered logs with no public mirror path |
| **Eigenstate offers** | Cycle vault hash-chain for measure; Helix commits to `GeniusFlowSettlement` on Base when wallet / balance / mirror gates allow; Proof Index for historical txs |
| **Not** | Every parkash cycle on-chain; a retail “settlement product” for banks |

---

## Evidence / try it

| Path | Link |
|------|------|
| Methodology (full depth) | [METHODOLOGY.md](METHODOLOGY.md) |
| Signal reports | [reports/](https://kaydeep0.github.io/eigenstate-research/reports/) |
| On-chain proof index | [onchain/](https://kaydeep0.github.io/eigenstate-research/onchain/) |
| Federation verify (technical) | [geniusflow-federation.vercel.app](https://geniusflow-federation.vercel.app/) → `/api/manifest`, `/api/chain`, `/api/verify`, `/api/package` |

**5-minute demo** (from this repo root; toy stack — not the private engine):

```bash
pip install helixhash requests
python3 public/demo/eigenstate_demo.py
```

HelixHash: [Kaydeep0/helixhash](https://github.com/Kaydeep0/helixhash). The script pulls a few public series, appends them into a local HelixHash chain, and points at a historical Basescan tx / Proof Index. Demo ≠ production cadence, full topology coverage, or continuous on-chain commits.

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

Coverage and on-chain mirror paths are partial by design — see Methodology for what is live vs gated.

**SoT (source of truth)** for Host/Pages field tiles is the GeniusFlow engine measurement state: `workspace/HOST/state.json` (κ, Protocol Truth, parkash stamps) plus the M1 coverage ledger (`m1_strict` ∩ topology / **199**). The site bakes a stamp into [`public/field-state.json`](public/field-state.json); homepage proof tiles and `/track-record` read that stamp at build time — not frozen marketing HTML.

### Refresh SoT onto Pages (parkash / deploy)

```bash
# From a machine with the private engine clone:
export GENIUSFLOW_ROOT=/path/to/geniusflow
./scripts/refresh-sot.sh          # writes public/field-state.json
npm run build                     # Astro bake
# commit + push; GitHub Pages deploys
```

Engine side: `PYTHONPATH=engine python3 engine/tools/export_pages_sot.py --out …/eigenstate-research/public/field-state.json`.

Signal report green badges are **vault@publish** (trimmed cycle-vault rows at publish), not M1 lifetime observations — see report tooltips and Methodology.

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
