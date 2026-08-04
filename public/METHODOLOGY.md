# Methodology

How Eigenstate measures the tokenized settlement field — plain language first, then the precise terms the engine uses.

**Three verbs, one loop**

| Verb | What happens | What it is not |
|------|----------------|----------------|
| **Measure** | Sensors and parkash cycles observe entities; qualifying rows land in the vault | Not a trade signal |
| **Publish** | Reports / claims go out with verification status (`status_at_publish`) when the membrane admits them | Not every observation is published |
| **Act** | Build, deploy, connect, or settlement paths when Host / gates allow | Mostly observe-heavy today; act lanes are gated |

A parkash cycle **measures** CIRCLE (vault + dossier numbers update); a Pages report may **publish** later with `status_at_publish`; **act** (on-chain helix commit or other gated paths) only runs when Host/gates allow — so most cycles stay measure-only.

**Without this engine:** desks and research shops still split those jobs across people and tools — Bloomberg/Refinitiv for market state, EDGAR and issuer sites for filings, Slack/email for “should we publish,” counsel or ops for anything that touches settlement rails. The loop exists; it is manual, slow, and rarely hashed as one measurement chain.

---

## Numbers glossary

Website tiles and report cards use these terms. Plain language first; precise engine meaning in the same row. Deeper sections below expand the measurement loop.

| Term | Plain language | Precise / honest note |
|------|----------------|------------------------|
| **E, ΔI, A** | How much *new* information an observation yields per unit cost | **E = ΔI / A**. **ΔI** = surprise vs expected state; **A** = observation cost (API/work/time). Structural metric, not a price forecast. |
| **Φ_S** | Settlement / signal pressure on an entity | Primary entity field signal (unrealized settlement energy). Mirrored on public dossiers (`own_numbers`). Not volume, not INFRA_FLOW. |
| **κ** vs **Γ** | **κ** = system coherence of the measured field; **Γ** (gamma) = extraction / force | Separate keys (Brief B): κ stays on sys/measured coherence; Γ lives under entity physics (`gamma`). Never treat Γ as Φ_S or rename κ to mean gamma. |
| **PT / Protocol Truth** | A Host act-readiness score from the engine SoT | Shown on Track Record / proof tiles from `HOST/state.json`. Canonical act threshold ≈ **0.618** (`canonical_act_threshold`). **Below waist ≈ observe** (measure / membrane publish); high-stakes act lanes stay gated — not a promise that every cycle “acts.” |
| **M1 / 199 / coverage** | How much of the fixed topology map has been observed | Denominator **199** (forbidden stale denoms 196/197/218/…). Coverage = `m1_strict` ∩ topology, baked as e.g. `192 / 199`. Dossier count ≠ M1 denominator. |
| **SoT** | Source of truth for public field tiles | Engine `HOST/state.json` (κ, PT, parkash stamps) + M1 coverage ledger → stamped into Pages [`public/field-state.json`](field-state.json) at deploy. Tiles bake from that stamp, not frozen marketing HTML. |
| **vault@publish** vs **M1 ledger** | Two different “obs” counts on report cards | **vault@publish** (green badges) = trimmed cycle-vault rows present at report publish — not lifetime history. **M1 ledger** = lifetime `m1_strict` observation counts for that entity in the coverage ledger. Do not equate them. |
| **status_at_publish** | Trust label on a published claim | Set by VERIFY (fail-closed). Common values: **ATTESTED** (primary/derived when spine admits), **UNVERIFIED-PENDING** (published but not attested). Federation **proof_shape** can **refuse** packages that invent attestation without a provenance spine. |
| **Assessable n / accuracy** | How we score Host prediction outcomes | TRUE/FALSE only (VOID excluded). A **%** appears only when assessable **n ≥ 5**. Thin samples show raw n — never a fake 100% from a handful of rows. |
| **Direction signals** | Older claim-table labels (e.g. BUILDING, INFRA_FLOW) | **Retired** on the current Track Record rebuild. INFRA_FLOW / cumulative volume is a different unit and must not be shown as Φ_S. Live surface: SoT scoreboard + field tiles. |
| **Helix / Base commit** | On-chain fingerprint of vault / crossing state | Local HelixHash chaining is continuous; **Base** commits to `GeniusFlowSettlement` are **gated** (wallet, balance, mirror flags). Attested when a tx lands — not every parkash. See [On-Chain Proof Index](onchain/). |
| **Return-wire ack** | Optional consumption acknowledgment | Federation `/api/return_wire` can ack that a consumer saw a package. Supports return-signal / Cell-E paths; it does **not** mean every vault row was published or attested. |

---

## 1. The core equation

**Plain language.** We score how much *new* information an entity produces relative to the cost of watching it. High score → the entity is moving the field. Low score → it is moving with the field.

**Precise term.**

**E = ΔI / A**

- **E** — information efficiency (Kirandeep’s Law; Zenodo [10.5281/zenodo.18413995](https://doi.org/10.5281/zenodo.18413995))
- **ΔI** — information gained when the observed state differs from the expected state (bits / surprise)
- **A** — observation cost (API work, processing, wall time)

This is a **structural** metric, not a price forecast. The “field” is the topology of obligations, permissions, and settlement dependencies among **199** tracked entities (M1 denominator). Live observation coverage is reported as **M1 strict** (see the engine coverage board / Pages `public/field-state.json` SoT stamp — not a frozen marketing number such as 196/197).

**SoT for Host/Pages:** engine `HOST/state.json` (κ, Protocol Truth) + M1 coverage ledger. Website tiles bake from that stamp at deploy. Report **vault@publish** badges count trimmed cycle-vault rows at publish time — they are **not** lifetime M1 observation counts.

On an SEC filing / rulemaking day, reading the new document against the prior expected state yields a large **ΔI** for roughly the same API/parse cost **A** → high **E**. On a quiet day with no material change, the same feed pull is mostly confirmation → low **E**. Same pattern for a DefiLlama TVL tick on a tokenized fund (e.g. BUIDL): a step-change in TVL is high-E; a flat reprint is low-E.

**Without this engine:** analysts still open EDGAR by hand, skim press releases, refresh DeFiLlama or issuer dashboards, and decide “this matters” by experience and inbox volume. That judgment is real; it is rarely scored as surprise-per-observation-cost across a fixed entity set, and quiet days look the same as loud ones until someone writes the note.

---

## 2. The vault

**Plain language.** When an observation is worth more than it costs to take, we append it to an append-only measurement log. Changing an old row breaks later hashes / parent checks.

**Precise term.** Qualifying observations write to the cycle vault. A typical vault row carries:

- Entity codename
- Observation timestamp
- **ΔI** / **E** at observation time
- Chain integrity fields (`vault_fingerprint` when written through the fingerprint append path, and/or `sha.hash` with parent-consistency checks)

**Φ_S** (settlement / signal pressure) and **κ** (`"kappa"`, system coherence) live on **entity field state** and are mirrored on public dossiers (`own_numbers`). Do **not** confuse **κ** with **Γ** (`"gamma"`), the extraction / force term — they stay on separate keys. Not every vault row duplicates Φ_S / κ; dossiers are the public place to read those numbers.

The vault is primarily a **measure** surface. Publish coverage and return-wire acks exist so published claims can be checked and consumption acknowledged; they do not mean every vault row becomes a public article.

After a qualifying observation of CIRCLE or BLACKROCK, the private vault appends a chained row (entity, ΔI/E, hash). The public mirror of measured field state — including Φ_S and κ — is the federation dossier — e.g. [CIRCLE.json](https://kaydeep0.github.io/eigenstate-research/federation/dossier/CIRCLE.json) and [BLACKROCK.json](https://kaydeep0.github.io/eigenstate-research/federation/dossier/BLACKROCK.json) — not a guarantee that every vault row ships as a report. We do not paste fake vault hashes here; the live digest is on those dossiers.

**Without this engine:** the analogous record lives in research notes, CRM rows, shared drives, or auditor workpapers — useful, often carefully written, but not an append-only, hash-chained measurement log with public dossier digests. Attestation, if any, is a PDF or email trail, not a vault hash chain.

---

## 3. The helix commit

**Plain language.** Sometimes we take a fingerprint of vault state and post it to Base mainnet so outsiders can timestamp-check a claim. That is an **attestation when it lands** — not a promise that every parkash cycle writes a new transaction.

**Precise term.**

- Local HelixHash chaining of vault / crossing state is continuous.
- **On-chain helix commits** call `GeniusFlowSettlement` on Base (`0x3A2d6599d5409c1A87609c38dB9b1619e47F6b02`) with a fingerprint as `evidenceHash` when the commit path succeeds (wallet, balance, and gates).
- The **settlement vault → mirror** path is **partial** today (`SETTLEMENT_MIRROR_ENABLED` + sevadar interlocks). EAS outbound attestation remains **gated**. Do not assume every parkash produces a new Basescan tx.
- Historical commits are listed on the [On-Chain Proof Index](onchain/). Example early commit (with `0x` prefix): [0x5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66](https://basescan.org/tx/0x5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66). Prefer the index over any single hard-coded hash in prose.

**How to verify.** Open the tx from the article footer or the On-Chain Proof Index on Basescan; confirm the settlement contract and input data. For machine-facing admit/refuse semantics, use federation `/api/verify` and [proof_shape v1](https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md).

When wallet, balance, and mirror gates pass, a fingerprint lands on Base — see the [On-Chain Proof Index](https://kaydeep0.github.io/eigenstate-research/onchain/) and the Basescan tx above. When those gates fail (or `SETTLEMENT_MIRROR_ENABLED` is off), the local HelixHash still advances but **no new Basescan tx** appears that cycle. Partial mirror means “attested when it lands,” not “every parkash = a new tx.”

**Without this engine:** teams timestamp claims with PDF hashes, notaries, counsel letters, or ad-hoc Basescan / Etherscan checks of someone else’s contract. Those practices work for deals and audits; they do not continuously fingerprint an internal measurement vault, and outsiders usually cannot replay “what was measured at T” without asking for a file.

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

A package that carries a real `registry_ref` and provenance spine can **admit** under [proof_shape v1](https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md). A cheap copy that stamps `ATTESTED` without that spine **refuses**. Separately: a disputed claim scored ≥ 0.90 by the dispatch fact-checker is blocked (`BLOCKED_FACT_CHECK`) before it reaches the publish queue — even if someone labeled it “attested” in prose.

**Without this engine:** verification is editorial review, compliance sign-off, legal opinion, or “check the source link.” Industry research and newsrooms do this carefully every day; the status is usually implicit in the byline or disclaimer, not a machine-checkable `status_at_publish` / proof_shape admit-or-refuse that consumers can call over an API.

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

[DTCC](https://kaydeep0.github.io/eigenstate-research/federation/dossier/DTCC.json) sits in M1 as **settlement infrastructure** — clearing/custody rails that tokenized fixed income still depends on. A random newly listed token is not in that map and does not play the same structural role: watching its price does not substitute for observing DTCC’s position in the obligation graph. Role in the topology ≠ market cap or tweet volume.

**Without this engine:** coverage maps live as Excel universes, vendor entity lists, or “who we follow on Twitter / X.” Those lists are often good for news and trading; they rarely encode settlement-role topology (obligation graph position vs. market-cap or social volume) with a fixed M1 denominator and per-cycle field state.

---

## 6. The gap detector

**Plain language.** We look for things the topology *needs* that markets or product design still treat as optional or equivalent when they are not.

**Precise term.** Gap distance = what correct function requires − what current pricing / product design assumes. Large, persistent distance → structural gap.

Example: the **SOFR three-body** coupling — overnight benchmark, Treasury issuance velocity, and tokenized settlement mechanics — remains a primary structural gap. SOFR-linked tokenized products that treat overnight exposure as term exposure are structurally false under this lens.

Gap **publication** coverage is tracked separately from vault measure (a gap can be measured long before it is published).

Gap id **`LIBOR_EQUIVALENT`**: markets treat SOFR + ISDA fallback as a full LIBOR replacement, but the topology still needs a sovereign-backed term structure the transition did not supply. The engine scores that as a persistent structural gap (first logged prediction: [$300 Trillion Structural Gap…](https://kaydeep0.github.io/eigenstate-research/predictions/) / `LIBOR_EQUIVALENT_001`). Publishing a SOFR article does **not** close the gap — measure and publish coverage are separate rails.

**Without this engine:** the same tension shows up in ISDA fallback papers, sell-side basis notes, and conference panels — practitioners already debate overnight vs. term. What is usually missing is a durable, machine-tracked gap id with separate measure vs. publish coverage, rather than a one-off memo that ages out of the inbox.

---

## For agents

- Human site (presentation walkthrough): https://kaydeep0.github.io/eigenstate-research/methodology/
- Human site home: https://kaydeep0.github.io/eigenstate-research/
- This file (plain markdown): https://kaydeep0.github.io/eigenstate-research/METHODOLOGY.md
- **Verify walkthrough** (copy-paste status → dossier → package/verify): https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/
- **Free Mode A investor walkthrough** (cite → package → Darshan `n_scored` honesty; Pilot DRAFT; 5.4 HOLD): https://kaydeep0.github.io/eigenstate-research/mode-a-walkthrough/
- Machine cold-start: https://geniusflow-federation.vercel.app/llms.txt
- Status / SLA: https://geniusflow-federation.vercel.app/api/status
- Proof shape: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md

The GeniusFlow engine repo is private. Prefer federation + Pages over inventing live counts or on-chain status.
