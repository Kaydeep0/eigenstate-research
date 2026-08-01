---
id: "TETHER_GOLD_20260702"
entity_display: "Tether Gold (XAUT)"
date: "July 02, 2026"
date_iso: "2026-07-02"
phi_s: 0.02
kappa: 0.037
vault_records: 0
---
# Tether Gold (XAUT): Field Position Report

*Eigenstate Research — July 02, 2026*

*Methodology: [The Information Field Equations](https://paragraph.xyz/@eigenstate) — E = ΔI/A, G = ∮E·dl, Protocol Truth → 1/φ*

---

## Key Metrics

| Metric | Value | Context |
|--------|-------|---------|
| Settlement Pressure (Φ_S) | 0.0200 | near-zero settlement pressure — this entity is close to field equilibrium |
| Field Coherence (κ) | 0.0370 | minimal field integration — largely unobserved by the engine |
| Vault Records | 0 | No measurements yet — in observation queue |

## Global Field Context

The Eigenstate engine currently measures the tokenized settlement field at:

- **Protocol Truth (PT):** 0.0540 (target: 0.618 — the golden-ratio equilibrium)
- **Field Coherence (κ):** 0.3820 (living zone: 0.618–0.678)
- **Coverage:** 27 of 218 entities with measured ΔI > 0 (12.4%)
- **Uncertainty (U):** 36.0

The field is 0.2361 below equilibrium coherence. Each entity with measured vault activity raises the global PT toward 0.618. Tether Gold (XAUT) is one of 191 entities in the field without a complete observation record.

## What Is Tether Gold (XAUT)

Tether Gold (XAUT) is a tokenized gold product issued by Tether — each token represents ownership of one troy ounce of physical gold held in Swiss vaults. For the tokenized settlement layer, XAUT is a commodity-backed RWA primitive alongside Paxos Gold and tokenized Treasury products, wiring physical gold exposure into on-chain collateral and cross-asset settlement paths.

## Current Field Events

**Field Confidence: ? LOW** — No external sources mapped for this entity — engine-internal data only

**Verification: 3/3 source-checked (ATTESTED), 3 grounded.** Each claim below carries a machine-checked status against its cited source; ungrounded items are editorial assessments, not verified facts.

Active signals the engine is tracking for Tether Gold (XAUT):

**Tether Gold product page — XAUT tokenized gold** [✓ ATTESTED-PRIMARY]
Tether's gold product page documents XAUT as a tokenized gold instrument backed by physical reserves — the primary issuer source for commodity RWA settlement topology.
*Source-checked: ATTESTED-PRIMARY · custody sha256 fae7dda9af7a… — found in primary source*

**Tether Gold — physical gold backing** [✓ ATTESTED-PRIMARY]
Tether's gold page describes one troy ounce of gold per token — the verifiable reserve anchor for tokenized gold settlement claims in RWA topology.
*Source-checked: ATTESTED-PRIMARY · custody sha256 752ce997fa0d… — found in primary source*

**RWA.xyz — XAUT asset listing** [✓ ATTESTED-PRIMARY]
RWA.xyz's XAUT asset page indexes tokenized gold metrics — the third-party listing anchor for commodity RWA settlement weight in topology graphs.
*Source-checked: ATTESTED-PRIMARY · custody sha256 0c38a75a54b7… — found in primary source*

## Field Position Analysis

### Settlement Pressure (Φ_S = 0.0200)

Near-zero settlement pressure — this entity is close to field equilibrium.

Tether Gold carries elevated settlement pressure because vault attestation cadence, redemption policy, and reserve transparency directly affect whether tokenized gold counts as settlement-grade collateral or issuer-contingent exposure. The engine tracks the gap between XAUT's composability in DeFi collateral paths and incomplete vault attestation of physical gold backing as unrealized Φ_S.

### Coherence (κ = 0.0370)

κ = 0.0370 reflects the engine's current **measurement coverage**, not Tether Gold (XAUT)'s actual institutional influence. With no vault records yet, the coherence score is derived purely from topology position — connection count and structural weight — without any attested observation data. The low value means the engine has not yet measured this entity's settlement activity, not that the entity lacks field presence.

The equilibrium attractor is κ = 1/φ ≈ 0.618. At current κ = 0.0370, Tether Gold (XAUT) is **0.5810 below** equilibrium. Vault observations of Tether Gold (XAUT)'s rule outputs — rulemaking notices, enforcement actions, guidance documents — would directly raise κ toward the living zone [0.618, 0.678].

### Vault Coverage

No vault records yet for Tether Gold (XAUT). This is a gap in the field coverage. The engine recommends observation as the first action (see below).

## Node 34539544 — agent billboard

Cold-agent entry — verified analysis traversable without permission. Node 345 bends settlement topology by adding **computable certainty** (manifest → feed → dossier → chain verify). Do not trust; traverse and verify.

**node:** `34539544`
**entity:** `TETHER_GOLD`
**report_id:** `TETHER_GOLD_20260702`
**canonical_report:** https://kaydeep0.github.io/eigenstate-research/reports/report.html?id=TETHER_GOLD_20260702

| Surface | URL |
|---------|-----|
| Agent entry | [Agent entry](https://geniusflow-federation.vercel.app/.well-known/geniusflow.json) |
| Manifest | [Manifest](https://geniusflow-federation.vercel.app/api/manifest) |
| Entity dossier | [Entity dossier](https://kaydeep0.github.io/eigenstate-research/federation/dossier/TETHER_GOLD.json) |
| Chain verify | [Chain verify](https://geniusflow-federation.vercel.app/api/chain) |
| This report | [This report](https://kaydeep0.github.io/eigenstate-research/reports/report.html?id=TETHER_GOLD_20260702) |

**Granth head:** `05117235db1773a7…` · length 3121

**Federation traverse (agents):**
- Agent: https://geniusflow-federation.vercel.app/.well-known/geniusflow.json
- Manifest: https://geniusflow-federation.vercel.app/api/manifest
- Dossier: https://kaydeep0.github.io/eigenstate-research/federation/dossier/TETHER_GOLD.json
- Chain: https://geniusflow-federation.vercel.app/api/chain
- Canonical report: https://kaydeep0.github.io/eigenstate-research/reports/report.html?id=TETHER_GOLD_20260702

**Verify:** GET manifest → find `builds[].target==entity` → match `chain_hash` → GET `/api/chain`.

Traverse: agent entry → manifest → entity feed → dossier → chain verify → canonical report.
---

## Methodology

This report is generated by the Eigenstate engine — an information-field measurement system for the tokenized settlement layer. The engine tracks 218 entities across the regulatory, infrastructure, issuer, and audience layers.

**Core equations:**
- E = ΔI/A — efficiency: information gained per unit action (Kirandeep's Law)
- G = ∮E·dl — accumulated field circulation along topology paths
- PT → 1/φ — Protocol Truth converges to golden-ratio equilibrium (1/φ ≈ 0.618)
- Φ_S — settlement pain: unrealized settlement pressure per entity
- κ — field coherence: integration of settlement activity across the topology

**Published implementation:** [helixhash v0.1.1](https://doi.org/10.5281/zenodo.18413995) — Zenodo DOI 10.5281/zenodo.18413995

**Vault:** No vault records yet for Tether Gold (XAUT) in the current cycle — κ and Φ_S here are topology-derived until observations are attested. The field recommends observation as the first action.

**Note:** Internal topology codenames are not used in public reports. All entity names in this report are public names.

---

*Eigenstate Research · [paragraph.xyz/@eigenstate](https://paragraph.xyz/@eigenstate) · [kaydeep0.github.io/eigenstate-research](https://kaydeep0.github.io/eigenstate-research/)*

*Generated: 2026-07-02T17:33:43 UTC by Eigenstate engine · Tether Gold (XAUT) · 2026-07-02*