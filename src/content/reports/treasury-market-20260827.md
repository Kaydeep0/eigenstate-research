---
id: "TREASURY_MARKET_20260827"
entity_display: "US Treasury Market"
date: "August 27, 2026"
date_iso: "2026-08-27"
phi_s: 3.296
kappa: 0.1563
vault_records: 2
---
# US Treasury Market: Field Position Report

*Eigenstate Research · August 27, 2026*

*Publication snapshot (dated). Live SoT Φ_S / κ / M1 ledger overlay on the [Pages report](https://kaydeep0.github.io/eigenstate-research/reports/). [Methodology](https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md) · [Numbers glossary](https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md#numbers-glossary). E = ΔI/A, G = ∮E·dl, Protocol Truth → 1/φ*

---

## Publication snapshot

Values below are **at publish** (2026-08-27). They are not the live hero SoT. vault@publish counts trimmed cycle-vault rows at publish time; it is not the lifetime M1 coverage ledger.

| Metric | Value | Context |
|--------|-------|---------|
| Settlement Pressure (Φ_S) @ publish | 3.2960 | high settlement pressure; this entity is pulling field energy without reciprocal observation |
| Field Coherence (κ) @ publish | 0.1563 | low coherence; entity has limited connection to measured field activity |
| vault@publish | 2 | ΔI accumulated in cycle vault: 0.00 (not M1 lifetime obs)
| Power Concentration Rank | #2 | Score: 0.89 |

## Field read (maintained state projection)

*projection_version:* `geniusflow.public_entity_projection.v1` · *source_snapshot_id:* `sha256:b468b0d7c312dedd121018c7f31845e063f600a65209674b41cc3f9747f75c88` · *identity_contract:* `geniusflow.observer_identity.v1`

### CURRENT STATE

- Claims on card: 3 (3 evidence-backed)
- USDC circulating: UNKNOWN (pipe_fixed_not_yet_persisted)
- USYC circulating: NOT_WIRED (not_wired)

### POSITION

- UNKNOWN

### DIRECTION

- UNKNOWN (direction_not_on_public_card)

### AGE

- DERIVED
- Last observed: None

### NEIGHBORHOOD

- UNKNOWN (no advertised hops on this card)

### KNOWLEDGE GAPS

- n=11 · broken_pipe=1 · unknown=3 · withheld=2

### CHANGE

- status=UNAVAILABLE · kind=INCOMPARABLE · reason=no_prior_comparable_snapshot
- comparable transitions: 0
- WORLD_OBSERVED: UNAVAILABLE
- T0 labeled: no

### Why did this report change from the previous publication?

- measurement changed: UNKNOWN
- evidence unchanged: UNKNOWN
- relationship support: UNKNOWN
- algorithm version: UNKNOWN
- projection_version: `geniusflow.public_entity_projection.v1`
- source_snapshot_id: `sha256:b468b0d7c312dedd121018c7f31845e063f600a65209674b41cc3f9747f75c88`
- reason: no_prior_publication

## Publication field context

*Global field state unavailable; run parkash to refresh.*

## What it is

US Treasury Market is the aggregated capital-pool node representing the underlying market for US government debt,  T-bills, notes, and bonds traded through primary dealers, the Fed's open market operations, and repo markets. For the tokenized settlement layer, the Treasury market is the reference asset class behind tokenized treasury products (BUIDL, OUSG, USDY) and stablecoin reserve composition (Circle USDC T-bill backing). Every tokenized wrapper ultimately prices against this pool.

## Verified claims

**Field Confidence: ~ MEDIUM.** Sources mapped: FED_H8, RWA_XYZ; weights not yet calibrated

**Verification: 3/3 source-checked (ATTESTED), 3 grounded.** Each claim below carries a machine-checked status against its cited source; ungrounded items are editorial assessments, not verified facts.

Active signals the engine is tracking for US Treasury Market:

**US Department of the Treasury,  debt management** [✓ ATTESTED-PRIMARY]
Treasury.gov identifies the Department as responsible for federal financing and debt management,  the sovereign issuer node underlying every tokenized Treasury product in the settlement topology.
*Source-checked: ATTESTED-PRIMARY · status_at_publish=ATTESTED-PRIMARY · custody sha256 85932581316b…. found near location anchor in primary source*

**NY Fed domestic market operations** [✓ ATTESTED-PRIMARY]
The Federal Reserve Bank of New York's domestic market operations page documents open market operations and primary dealer interaction,  the institutional lane connecting Fed policy to Treasury market liquidity.
*Source-checked: ATTESTED-PRIMARY · status_at_publish=ATTESTED-PRIMARY · custody sha256 d7249a270ffa…. found near location anchor in primary source*

**Treasury financing the government** [✓ ATTESTED-PRIMARY]
Treasury's financing-the-government policy page describes how federal debt is issued and managed,  the primary-source basis for how tokenized treasury wrappers reference on-chain yield to short-duration government obligations.
*Source-checked: ATTESTED-PRIMARY · status_at_publish=ATTESTED-PRIMARY · custody sha256 b3435d9b30e0…. found near location anchor in primary source*

## Field read

### Settlement Pressure (Φ_S = 3.2960)

High settlement pressure; this entity is pulling field energy without reciprocal observation.

Treasury Market settlement pressure is elevated because tokenized wrappers are scaling on-chain while the underlying market structure,  primary dealer access, Fed SOMA holdings, and repo plumbing,  remains the settlement backstop. The engine reads the gap between hologram-reconstructed Treasury exposure and sparse vault coverage of dealer, Fed, and on-chain mint flows as unrealized Φ_S,  amplified when rate policy or debt-ceiling events repricing ripples through tokenized collateral chains.

### Coherence (κ = 0.1563)

Low coherence; entity has limited connection to measured field activity.

The equilibrium attractor is κ = 1/φ ≈ 0.618. At publish κ = 0.1563, US Treasury Market is **0.4617 below** equilibrium. Attested observations of US Treasury Market's rule outputs (rulemaking notices, enforcement actions, guidance documents) would raise κ toward the living zone [0.618, 0.678].

### Vault coverage @ publish

2 vault@publish records for US Treasury Market. Total accumulated ΔI: 0.00.

Most recent observation: **observe** at 2026-08-27 18:58:09 UTC. ΔI = 0.00, E = 0.00

### Recommendations

The following actions are ranked by capital-adjusted score from the current photon queue:

**1. Build topology-informed monitoring tool for US Treasury Market cluster (21 connections)**

- E = 10.00 (ΔI = 25.17 / A = 6.80)
- Capital-adjusted score: 184,587
- Estimated effort: 8h
- Action type: `build`

### Concentration

US Treasury Market ranks **#2** in the field's power concentration with a score of 0.89 (field total: 3.16).

The top 5 entities control 91.8% of field power (Gini = 0.88). High concentration with incomplete coverage (97.0% ΔI>0 on M1) is a primary source of PT = n/a vs target 0.618.

---

## Sources

This report is generated by the Eigenstate engine, an information-field measurement system for the tokenized settlement layer. The engine tracks 199 entities (M1 topology denominator) across the regulatory, infrastructure, issuer, and audience layers.

**Human pages:**
- [Methodology](https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md)
- [Numbers glossary](https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md#numbers-glossary)
- [Entity dossier (HTML)](https://kaydeep0.github.io/eigenstate-research/dossier/TREASURY_MARKET/)
- [Verify walkthrough](https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/)
- [Related reports](https://kaydeep0.github.io/eigenstate-research/reports/)

**Core equations:**
- E = ΔI/A: efficiency, information gained per unit action (Kirandeep's Law)
- G = ∮E·dl: accumulated field circulation along topology paths
- PT → 1/φ: Protocol Truth converges to golden-ratio equilibrium (1/φ ≈ 0.618)
- Φ_S: settlement pain, unrealized settlement pressure per entity
- κ: field coherence, integration of settlement activity across the topology

**Published implementation:** [helixhash v0.1.1](https://doi.org/10.5281/zenodo.18413995) (Zenodo DOI 10.5281/zenodo.18413995)

**vault@publish:** 2 records for US Treasury Market in the cycle vault at publish; publish path appends WFP witness when credibility gates pass. EAS on-chain attestations on Base mainnet when Tier-0 keys are live.

**Note:** Internal topology codenames are not used in public reports. All entity names in this report are public names.

---

## For agents

Cold-agent entry for Node `34539544` / `TREASURY_MARKET`. Prefer human Pages first; do not treat raw API JSON as the primary reader UX.

**Human pages:**
- [Canonical report](https://kaydeep0.github.io/eigenstate-research/reports/treasury-market-20260827/)
- [Entity dossier (HTML)](https://kaydeep0.github.io/eigenstate-research/dossier/TREASURY_MARKET/)
- [Methodology](https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md)
- [Numbers glossary](https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md#numbers-glossary)
- [Verify walkthrough](https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/)
- [Related reports](https://kaydeep0.github.io/eigenstate-research/reports/)
- [Paragraph journal](https://paragraph.com/@eigenstate)
- [Federation network view](https://geniusflow-rwa.vercel.app/federation.html)
- [RWA registry](https://geniusflow-rwa.vercel.app)

**Machine JSON / federation APIs:**
- Agent entry: https://geniusflow-federation.vercel.app/.well-known/geniusflow.json
- Manifest: https://geniusflow-federation.vercel.app/api/manifest
- Machine dossier (Pages): https://kaydeep0.github.io/eigenstate-research/federation/dossier/TREASURY_MARKET.json
- Live dossier API: https://geniusflow-federation.vercel.app/api/dossier?entity=TREASURY_MARKET
- Machine claims (Pages): https://kaydeep0.github.io/eigenstate-research/federation/current-claims/TREASURY_MARKET.json
- Federation card: https://geniusflow-federation.vercel.app/.well-known/geniusflow.json
- Chain verify: https://geniusflow-federation.vercel.app/api/chain
- Federation base: https://geniusflow-federation.vercel.app
- Federation status: https://geniusflow-federation.vercel.app/api/status
- llms.txt: https://geniusflow-federation.vercel.app/llms.txt
- OpenAPI: https://geniusflow-federation.vercel.app/openapi.json
- api/verify: https://geniusflow-federation.vercel.app/api/verify
- api/package: https://geniusflow-federation.vercel.app/api/package
- api/cite: https://geniusflow-federation.vercel.app/api/cite

**Vercel apps:**
- geniusflow-federation: https://geniusflow-federation.vercel.app
- geniusflow-rwa: https://geniusflow-rwa.vercel.app

**entity:** `TREASURY_MARKET`
**report_id:** `TREASURY_MARKET_20260827`
**Granth head:** `c08fd7423b7012bf…` · length 4690

**Verify:** GET api/manifest → find `builds[].target==entity` → match `chain_hash` → GET api/chain.
---

*Eigenstate Research · [paragraph.xyz/@eigenstate](https://paragraph.xyz/@eigenstate) · [kaydeep0.github.io/eigenstate-research](https://kaydeep0.github.io/eigenstate-research/)*

*Generated: 2026-08-27T19:02:32 UTC by Eigenstate engine · US Treasury Market · 2026-08-27*