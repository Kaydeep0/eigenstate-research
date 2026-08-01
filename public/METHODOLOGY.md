# Methodology

How Eigenstate measures the tokenized settlement field — plain language first, then the precise terms the engine uses.

**Three verbs, one loop**

| Verb | What happens | What it is not |
|------|----------------|----------------|
| **Measure** | Sensors and parkash cycles observe entities; qualifying rows land in the vault | Not a trade signal |
| **Publish** | Reports / claims go out with verification status (`status_at_publish`) when the membrane admits them | Not every observation is published |
| **Act** | Build, deploy, connect, or settlement paths when Host / gates allow | Mostly observe-heavy today; act lanes are gated |

---

## 1. The core equation

**Plain language.** We score how much *new* information an entity produces relative to the cost of watching it. High score → the entity is moving the field. Low score → it is moving with the field.

**Precise term.**

**E = ΔI / A**

- **E** — information efficiency (Kirandeep’s Law; Zenodo [10.5281/zenodo.18413995](https://doi.org/10.5281/zenodo.18413995))
- **ΔI** — information gained when the observed state differs from the expected state (bits / surprise)
- **A** — observation cost (API work, processing, wall time)

This is a **structural** metric, not a price forecast. The “field” is the topology of obligations, permissions, and settlement dependencies among **199** tracked entities (M1 denominator). Live observation coverage is reported as **M1 strict** (currently on the order of **~192 / 199** — see the engine coverage board, not a frozen marketing number).

---

## 2. The vault

**Plain language.** When an observation is worth more than it costs to take, we append it to an append-only measurement log. Changing an old row breaks every later hash.

**Precise term.** Qualifying observations write to the cycle vault. A typical record carries:

- Entity codename and display name
- Observation timestamp
- **Φ_S** (settlement / signal pressure) — how far the entity sits from field equilibrium
- **κ** (`"kappa"`) — **system coherence** (sys κ). Do **not** confuse with **Γ** (`"gamma"`), the extraction / force term — Brief B keeps them on separate keys
- **E** at observation time
- SHA-256 of the record, chained to the previous record

The vault is primarily a **measure** surface. Publish coverage and return-wire acks exist so published claims can be checked and consumption acknowledged; they do not mean every vault row becomes a public article.

---

## 3. The helix commit

**Plain language.** Sometimes we take a fingerprint of vault state and post it to Base mainnet so outsiders can timestamp-check a claim. That is an **attestation when it lands** — not a promise that every parkash cycle writes a new transaction.

**Precise term.**

- Local HelixHash chaining of vault / crossing state is continuous.
- **On-chain helix commits** call `GeniusFlowSettlement` on Base (`0x3A2d6599d5409c1A87609c38dB9b1619e47F6b02`) with a fingerprint as `evidenceHash` when the commit path succeeds (wallet, balance, and gates).
- The **settlement vault → mirror** path is **partial** today (`SETTLEMENT_MIRROR_ENABLED` + sevadar interlocks). EAS outbound attestation remains **gated**. Do not assume every parkash produces a new Basescan tx.
- Historical commits are listed on the [On-Chain Proof Index](onchain/). Example early commit (with `0x` prefix): [0x5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66](https://basescan.org/tx/0x5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66). Prefer the index over any single hard-coded hash in prose.

**How to verify.** Open the tx from the article footer or the On-Chain Proof Index on Basescan; confirm the settlement contract and input data. For machine-facing admit/refuse semantics, use federation `/api/verify` and [proof_shape v1](https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md).

---

## 4. Verification (fact-check + VERIFY)

**Plain language.** Before something is treated as a published claim, the stack checks it. Wrong high-confidence claims get blocked; uncertain ones get flagged; public consumers should read the published status, not assume “attested.”

**Precise rails (live):**

1. **Dispatch fact-checker** (pre-queue) — still uses confidence bands on disputed claims:
   - **≥ 0.90** → block (`BLOCKED_FACT_CHECK`)
   - **0.60–0.89** → flag for human review
   - **&lt; 0.60** → log only  
   Plus codename-leak and on-chain timestamp gates. Audits under `data/fact_checks/` in the private engine.

2. **VERIFY gate** — source-grounded resolve for report claims; embeds **`status_at_publish`** (fail-closed; never upgrades a miss to ATTESTED).

3. **Federation proof_shape v1** — admit/refuse limbs (`registry_ref` → `refuse_or_admit` → `provenance_spine`) on `/api/package` and `/api/verify`. Cheap copies that invent attestation labels fail. Spec: [ATTESTATION_PROOF_SHAPE.md](https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md).

Older “three-tier fact-checker only” language is incomplete; the public trust path is **fact-check (dispatch) + VERIFY / `status_at_publish` + proof_shape**.

---

## 5. The topology

**Plain language.** We watch a fixed map of institutions and rails that matter for tokenized fixed income — regulators, custodians, issuers, chains, benchmarks — and update each entity’s field state every cycle.

**Precise term.** M1 topology denominator = **199** entities (forbidden/stale denoms such as 196/197/218 are not used). Categories include:

- Regulatory bodies (SEC, OCC, ESMA, BIS, FSB, FRB)
- Settlement infrastructure (DTCC, Euroclear, DTC, tri-party repo operators)
- Tokenized product issuers (BlackRock BUIDL, Ondo OUSG, Franklin BENJI, WisdomTree WTGXX, …)
- Custody and prime brokerage (BNY Mellon, State Street, JPMorgan, …)
- Market infrastructure (Coinbase, Base, Ethereum)
- Benchmark infrastructure (NY Fed SOFR publication chain)
- Jurisdiction frameworks (US, EU, UK, …)
- Capital allocators (treasury desks, MMFs)
- Emerging settlement layers (Canton, DTCC tokenization initiatives, …)

Each entity carries field state: **Φ_S**, **κ** (sys), coverage level, and directional observations. Federation may expose more dossier cards than the M1-199 set; dossier count ≠ M1 denominator.

---

## 6. The gap detector

**Plain language.** We look for things the topology *needs* that markets or product design still treat as optional or equivalent when they are not.

**Precise term.** Gap distance = what correct function requires − what current pricing / product design assumes. Large, persistent distance → structural gap.

Example: the **SOFR three-body** coupling — overnight benchmark, Treasury issuance velocity, and tokenized settlement mechanics — remains a primary structural gap. SOFR-linked tokenized products that treat overnight exposure as term exposure are structurally false under this lens.

Gap **publication** coverage is tracked separately from vault measure (a gap can be measured long before it is published).

---

## For agents

- Human site: https://kaydeep0.github.io/eigenstate-research/
- This file: https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md
- Machine cold-start: https://geniusflow-federation.vercel.app/llms.txt
- Status / SLA: https://geniusflow-federation.vercel.app/api/status
- Proof shape: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md

The GeniusFlow engine repo is private. Prefer federation + Pages over inventing live counts or on-chain status.
