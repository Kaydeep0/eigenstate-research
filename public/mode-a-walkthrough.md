# Free Mode A — Investor Walkthrough

**Status:** **LIVE demo path (docs)** · Pilot SKU remains **DRAFT / not for sale**  
**Audience:** Investor / design partner — checkable free metalayer path, honest limits  
**decision_id:** `2026-08-04_free_mode_a_investor_walkthrough`  
**Revision:** `revision_log/2026-08-04_free_mode_a_investor_walkthrough.md`  
**Companion offer (DRAFT):** [`PILOT_SKU_VERIFIED_ANALYSIS.md`](PILOT_SKU_VERIFIED_ANALYSIS.md)  
**Human walkthrough (HTML):** https://kaydeep0.github.io/eigenstate-research/mode-a-walkthrough/  
**Human curl twin:** https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/

---

## What this is

**Mode A** = metalayer machine answers (cite → verify → package) **outside** the Eigenstate IAR distribution gate — labels you can re-hit, not a paid confidence product.

One sentence: walk the **free** path on live federation, then read **Darshan** so calibration *n* is not sold thin.

**Broom vs vacuum:** Hand-sweep diligence (one URL, one meeting) breaks when agents flood the net. Mode A is the **vacuum on the wire today** — **cite → package → Darshan** (fingerprints and dispose). We instrument **entity-claim verification**, not every byte in the digital information field.

| Label | Meaning here |
|-------|----------------|
| **Mode A** | Metalayer verify-wire; `$0`; `best_effort_vercel` |
| **Pilot SKU** | [`PILOT_SKU_VERIFIED_ANALYSIS.md`](PILOT_SKU_VERIFIED_ANALYSIS.md) — **DRAFT / not for sale** until Host opens Task **5.4** |
| **5.4** | Paid verified-analysis — **HOLD** (do not open from this page) |
| **Layer 6 LIVE** | **Not claimed** — metalayer ≠ legal Layer 6 |
| **Wave-6 / Magicians homepage / revenue** | **Out of scope** — do not invent |

---

## Honesty board (read before demos)

Live-checked **2026-08-19** against `https://geniusflow-federation.vercel.app` (re-hit before demos):

| Claim | Live fact | Do not say |
|-------|-----------|------------|
| Calibration *n* | `/api/darshan` → `calibration_honesty.n_scored = **1**` · **1 ≪ 10** · coefficient **withheld** · `paid_surface: HOLD` · first scored: `DEFILLAMA_TOTAL_TVL_005` TRUE (2026-08-18) | "scored confidence," "n ≥ 10," paid calibration |
| Paid gate | `n_scored_paid_gate = 10` (Task 3.5.8 / C10) | Selling confidence before honest *n* |
| Ops tier | `/api/status` → `tier: best_effort_vercel` | 99.99% SLA / paid uptime |
| Money | `$0` · product `G_external` = 0 until **5.4** | Revenue, Stripe live, invoice |
| Pilot | **DRAFT / not for sale** | Price list, closed sale |
| Dossiers on federation bake | `/api/status` may show `n_dossiers: 0` after a thin bake | "Always pipe `/api/dossier`" without checking status |
| Alternate claim source | **`/api/report_feed?entity=AAVE_V3`** `published_claims[]` · Pages mirror `…/federation/dossier/AAVE_V3.json` · frozen admit body on verify-walkthrough | Inventing `expected` from HTML |

**Darshan note (verbatim spirit):** confidence coefficient withheld until `n_scored >= 10`. Do not sell paid calibration confidence. Pre-revenue HOLD in force.

---

## Path (cite → verify → package → Darshan)

Base: `https://geniusflow-federation.vercel.app`  
Entity for the demo: **`AAVE_V3`** (published claim; Pages report live).

### 0 — Status (ops honesty)

```bash
curl -sS https://geniusflow-federation.vercel.app/api/status \
  | jq '{ok, tier, spec_version, n_dossiers: .surfaces.n_dossiers, baked: .surfaces.baked_endpoints}'
```

Expect `ok: true`, `tier: "best_effort_vercel"`, baked `package` / `verify` / `cite` / `darshan` true.  
If `n_dossiers` is `0`, **skip** `/api/dossier` and use Step 1b.

### 1 — Pull a published claim (do not invent `expected`)

**1a — Prefer federation dossier when populated**

```bash
curl -sS 'https://geniusflow-federation.vercel.app/api/dossier?entity=AAVE_V3' \
  | jq '{entity, n_claims:(.claims|length), claim0:.claims[0]}'
```

**1b — Report feed (works when dossier bake is empty)**

```bash
curl -sS 'https://geniusflow-federation.vercel.app/api/report_feed?entity=AAVE_V3' \
  | jq '{entity, report_id, report_url, n_claims:(.published_claims|length), claim0:.published_claims[0]}'
```

**1c — Pages dossier mirror (human-checkable)**

- Machine: https://kaydeep0.github.io/eigenstate-research/federation/dossier/AAVE_V3.json  
- Human report: https://kaydeep0.github.io/eigenstate-research/reports/aave-v3-20260801/

Live sample claim (same id used by the public verify walkthrough):

| Field | Value |
|-------|--------|
| `claim_id` | `d1eb5014-5ea5-44e2-bf2e-957df5a4e111` |
| `status_at_publish` | `ATTESTED-PRIMARY` |
| `grounding.source_url` | `https://docs.aave.com/developers/aave-v3/overview` |
| `grounding.expected` | `v3` |

### 2 — Cite (machine package + hash)

POST the **claim object** (id alone is not enough on the baked cite surface):

```bash
CLAIM='{
  "claim_id": "d1eb5014-5ea5-44e2-bf2e-957df5a4e111",
  "claim_text": "Aave v3 developer documentation",
  "status_at_publish": "ATTESTED-PRIMARY",
  "grounding": {
    "source_url": "https://docs.aave.com/developers/aave-v3/overview",
    "expected": "v3",
    "location": ""
  },
  "verified_at": "2026-08-01T15:28:19.940673+00:00",
  "expires_at": "2026-10-30T15:28:19+00:00"
}'

curl -sS -X POST https://geniusflow-federation.vercel.app/api/cite \
  -H 'Content-Type: application/json' \
  -d "{\"kind\":\"claim\",\"id\":\"d1eb5014-5ea5-44e2-bf2e-957df5a4e111\",\"claim\":$CLAIM}" \
  | jq '{ok, cite_class, reason, package_hash}'
```

Expect `ok: true`, `cite_class: "citeable"`, non-empty `package_hash`.  
Catalog (IAR pick A / Mode A perimeter): `GET /api/cite`.

### 3 — Package — admit vs refuse

**Admit** (published claim with grounding + expiry):

```bash
curl -sS -X POST https://geniusflow-federation.vercel.app/api/package \
  -H 'Content-Type: application/json' \
  -d "$CLAIM" \
  | jq '{disposition, reason, proof_shape}'
```

Expect `disposition: "admitted"`, `reason: "attested_published_claim"`, `proof_shape.admitted: true`.

**Refuse** (invented ATTESTED without grounding / expiry):

```bash
curl -sS -X POST https://geniusflow-federation.vercel.app/api/package \
  -H 'Content-Type: application/json' \
  -d '{"claim_id":"walkthrough-invented","claim_text":"Invented attestation without grounding","status_at_publish":"ATTESTED"}' \
  | jq '{disposition, reason, exhibited_refusal, proof_shape}'
```

Expect `disposition: "withheld"`, `exhibited_refusal: true`. That refuse is the product.

Full copy-paste twin (status → dossier-or-body → package/verify):  
https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/

Proof limbs: https://geniusflow-federation.vercel.app/docs/ATTESTATION_PROOF_SHAPE.md

### 4 — Darshan honesty (`n_scored`)

```bash
curl -sS https://geniusflow-federation.vercel.app/api/darshan \
  | jq '{
      mode,
      n_scored: .calibration_honesty.n_scored,
      paid_gate: .calibration_honesty.n_scored_paid_gate,
      coefficient_withheld: .calibration_honesty.coefficient_withheld,
      confidence_coefficient: .calibration_honesty.confidence_coefficient,
      paid_surface: .calibration_honesty.paid_surface,
      note: .calibration_honesty.note
    }'
```

Expect **`mode: "A"`**, **`n_scored: 1`** (or higher after later resolves), **`confidence_coefficient: null`**, **`coefficient_withheld: true`**, **`paid_surface: "HOLD"`**.

Optional lattice peek (custody / divergence face — not a Layer-6 desk):

```bash
curl -sS https://geniusflow-federation.vercel.app/api/darshan \
  | jq '{divergence: .sevadar_lattice.divergence, observation_surfaces}'
```

---

## Free Mode A vs Pilot SKU (DRAFT)

| | **Free Mode A (this walkthrough)** | **Pilot SKU** |
|--|-------------------------------------|---------------|
| Money | `$0` now | **DRAFT / not for sale** until Host opens **5.4** |
| What you prove | Cite → package admit/refuse → Darshan thin-*n* | Same rails + Host-scoped pack when a real buyer appears |
| Calibration | `n_scored=1` · thin · do **not** sell | Still blocked until honest `n_scored ≥ 10` |
| Stripe / 5.4 | **HOLD** | **HOLD** |

Offer one-pager (Host hold): [`PILOT_SKU_VERIFIED_ANALYSIS.md`](PILOT_SKU_VERIFIED_ANALYSIS.md)  
Design-partner door (no Stripe): https://kaydeep0.github.io/eigenstate-research/request-access/

---

## Explicitly not included

- Opening Task **5.4** / Stripe / inventing revenue  
- Paid calibration confidence while `n_scored < 10` (live: **1** ≪ 10)  
- Layer **6 LIVE**, Wave-6 marketing, Magicians homepage paste  
- Settlement v2 / bank API / SLA beyond `best_effort_vercel`  
- Inventing dossier rows, claim IDs, or `n_scored ≥ 10`

---

## EXIT

| Item | State |
|------|--------|
| Walkthrough doc | **SHIPPED** (this file) |
| Live path verified | cite admit · package admit/refuse · Darshan thin-n honesty (**2026-08-19**: `n_scored=1`, gate 10) |
| Federation `/api/dossier` | May be **empty** (`n_dossiers: 0`) after thin bake — use report_feed / Pages mirror / frozen claim |
| Pilot SKU | **DRAFT / not for sale** |
| Task **5.4** | **HOLD** |
| Public human walkthrough | https://kaydeep0.github.io/eigenstate-research/mode-a-walkthrough/ |
| Public curl twin | https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/ |
| Public markdown mirror (agents) | https://kaydeep0.github.io/eigenstate-research/mode-a-walkthrough.md |

**Verdict:** **DONE** for docs-only Free Mode A investor walkthrough · **PARTIAL** only if someone requires federation `/api/dossier` populated this hour (parallel bake residual — not opened here).
