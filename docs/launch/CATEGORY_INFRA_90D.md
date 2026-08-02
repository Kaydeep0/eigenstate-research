# Category infrastructure, 90 days

Goal: be cited when the field argues about agent trust and tokenized-settlement diligence.
Scoreboard is cites and repeat machine use, not stars.

Operating rule: link only the ledger or receipt. Never the homepage pitch, HelixHash, φ,
`$GENIU`, or a settlement product claim.

Ship-today Host checklist: [`POST_TODAY.md`](POST_TODAY.md).

Reminders for the Host rows below are parkash-wired: `data/host_actions.json` in `geniusflow-engine`
prints in `python3 run.py orient` and at the end of every `python3 run.py parkash`. Close a row with
`python3 run.py host-actions done <id>`. Week 1 Magicians post is currently blocked on account
moderation review.

**Ready when Magicians unbans:** paste bodies in this folder are number-checked against live
`summary.json` files (2026-08-02). Zenodo draft metadata is in [`ZENODO_LEDGER_DEPOSIT.md`](ZENODO_LEDGER_DEPOSIT.md).
Do not retry Magicians from a second account.

---

## Scoreboard (track these)

| Metric | Definition | How to notice | Count now |
|--------|------------|---------------|-----------|
| Inbound cites | Magicians / EIP / ERC threads, arXiv follow-ons, explorer docs, standards repos that link a ledger | Manual scan + log row below | 0 |
| Receipt / verify fetches | Strangers re-fetch `/erc8004/receipts/{id}.json`, `/slsa/receipts/…`, `/rwa/receipts/…`, or `/api/verify` | Federation / host logs when available; otherwise anecdotal | unknown |
| Spec dents | A MUST / self-reference / liveness / disclosure clarification that references these numbers | Magicians, EIP PR, packaging thread | 0 |
| Named humans | 2–5 people at MetaMask / EF / Coinbase agent work, RWA disclosure draft authors, or diligence shops who know the URL cold | Host notes names when earned | 0 |

If those move, this is becoming infrastructure. If only GitHub stars move, it is not.

### Event log

| Date (UTC) | Metric | Evidence URL or quote | Notes |
|------------|--------|-----------------------|-------|
|            |        |                       |       |

---

## Week-by-week checklist

### Week 1 (now)

- [ ] **Host:** Post Ethereum Magicians ERC-8004 reply from [`ETHEREUM_MAGICIANS_ERC8004.md`](ETHEREUM_MAGICIANS_ERC8004.md) (**blocked:** account under moderation review)
- [ ] **Host:** Stay in that thread; answer technical pushback only
- [x] **Agent-ok:** Keep `/erc8004/`, `/slsa/`, `/rwa/` machine URLs live; cite/redraw boxes on human pages
- [x] **Agent-ok:** `/grounded-claims/` live on Pages (regulator EDGAR/Fed corpus). Federation receipts still need Vercel redeploy. `/tlog/` not landed.
- [ ] **Agent-ok:** Log Magicians post URL into the scoreboard when Host pastes it back
- [ ] **Host (optional):** Zenodo draft from [`ZENODO_LEDGER_DEPOSIT.md`](ZENODO_LEDGER_DEPOSIT.md); Host clicks Publish

### Weeks 2–3

- [ ] **Host:** Answer Magicians replies for ~14 days; no product, no second unsolicited post
- [ ] **Host:** Prepare RWA disclosure Magicians / ERC draft reply from [`RWA_DISCLOSURE_DISCUSSION.md`](RWA_DISCLOSURE_DISCUSSION.md) (data + asks)
- [ ] **Agent-ok:** Weekly re-stamp or re-run one ledger; same URL, new digest; short "what changed" on the human page
- [ ] **Agent-ok / Host:** If EDGAR corpus is live, cite it once in a diligence-shaped thread or tools-repo README (measurement, not pitch)

### Weeks 3–4

- [ ] **Host:** Flat HN link post from [`HN_ERC8004.md`](HN_ERC8004.md) only after Magicians has run a few days without factual correction
- [ ] **Host:** First comment immediately after HN submit; prior art first
- [ ] **Skip same day:** Do not post Magicians and HN on the same day

### Weeks 5–8

- [ ] **Host:** SLSA / packaging as a *separate* story from [`DISCUSS_PYTHON_SLSA.md`](DISCUSS_PYTHON_SLSA.md) (publish attestation ≠ SLSA build provenance)
- [ ] **Host:** Reply into existing X / Farcaster threads only when someone is already wrong about "8004 = trustless"; one ledger link
- [ ] **Agent-ok:** Issue/PR comments on A2A, ERC-8004 reference, RWA disclosure draft repos with a receipt they can fetch
- [ ] **Agent-ok:** Keep MCP / A2A / `llms.txt` / OpenAPI accurate so cold agents do not bounce

### Monthly (ongoing through day 90)

- [ ] **Agent-ok:** Re-publish all ledgers; bump `generated_at`; human-page "what changed"
- [ ] **Host:** Optional Zenodo/DOI on a ledger snapshot when re-publishing (citeable artifact for papers)
- [ ] **Host + agent:** Update scoreboard log; protect credibility (prior art first, no overclaim)

### Skip for this goal

Product Hunt, Indie Hackers, crypto TG shill rooms, star-for-star, MCP Discord promo.

---

## Host-only vs agent-ok

| Task | Who |
|------|-----|
| Post Magicians / HN / discuss.python.org / X / Farcaster | **Host only** (authenticated session) |
| Answer Magicians / HN technical pushback in your voice | **Host only** |
| Seal predictions, publish under Host identity, Zenodo account | **Host only** |
| Draft and refresh paste-ready bodies in `docs/launch/` | Agent-ok |
| Re-run probes, export Pages/federation JSON, cite/redraw UI | Agent-ok |
| Keep discovery surfaces accurate (`llms.txt`, MCP, A2A) | Agent-ok |
| Scoreboard log rows from public threads | Agent-ok (Host confirms named humans) |
| Post from a signed-out browser session | **Never** (leave paste-ready) |

---

## Paste-ready drafts (links)

| Draft | Path | Status |
|-------|------|--------|
| Host 60-minute checklist | [`POST_TODAY.md`](POST_TODAY.md) | Ready |
| Ethereum Magicians ERC-8004 | [`ETHEREUM_MAGICIANS_ERC8004.md`](ETHEREUM_MAGICIANS_ERC8004.md) | Paste-ready; **blocked on Magicians account review** |
| HN ERC-8004 | [`HN_ERC8004.md`](HN_ERC8004.md) | Paste-ready; numbers match live summary; Day 3–7 after Magicians |
| RWA disclosure discussion | [`RWA_DISCLOSURE_DISCUSSION.md`](RWA_DISCLOSURE_DISCUSSION.md) | Paste-ready; numbers match live summary; after Magicians settles |
| SLSA / PEP 740 (discuss.python.org) | [`DISCUSS_PYTHON_SLSA.md`](DISCUSS_PYTHON_SLSA.md) | Paste-ready; numbers match live summary; re-run census before posting; separate story |
| Zenodo / DOI prep | [`ZENODO_LEDGER_DEPOSIT.md`](ZENODO_LEDGER_DEPOSIT.md) | Draft metadata + file list; Host publishes |

Playbook alias: `docs/rwa_disclosure_discussion_draft.md` redirects to the RWA draft under `docs/launch/`.

---

## Stable machine URLs (cite these)

| Ledger | Human | Summary | Receipt pattern |
|--------|-------|---------|-----------------|
| ERC-8004 | https://kaydeep0.github.io/eigenstate-research/erc8004/ | …/erc8004/summary.json | `https://geniusflow-federation.vercel.app/erc8004/receipts/<agentId>.json` |
| SLSA / PEP 740 | https://kaydeep0.github.io/eigenstate-research/slsa/ | …/slsa/summary.json | `https://geniusflow-federation.vercel.app/slsa/receipts/<normalized-name>.json` |
| RWA disclosure | https://kaydeep0.github.io/eigenstate-research/rwa/ | …/rwa/summary.json | `https://geniusflow-federation.vercel.app/rwa/receipts/<ENTITY>.json` |
| Grounded claims (EDGAR/Fed) | https://kaydeep0.github.io/eigenstate-research/grounded-claims/ | …/grounded-claims/summary.json | Pages serves ledger + receipts under `/grounded-claims/receipts/`; federation mirror pending Vercel redeploy |
| Transparency-log monitor | `/tlog/` | not live | Sibling probe WIP (`tlog_monitor_probe.py`); do not invent URLs |

ERC-8004 redraw seed: pinned Base block hash only
(`random.Random(int(pinned_block_hash[-16:], 16)).sample(range(1, N + 1), 500)`).

---

## Credibility constraints

- Prior art before any of our numbers.
- Expectations commit before results where the probe has that pattern.
- Named refuse limbs; rates with population (and CI when sampled).
- One overclaim resets you with exactly the people who matter.
