# Zenodo / DOI prep: ledger snapshot deposit

Status: **prep only**. No API token is in the engine `.env` (`ZENODO_API_TOKEN` unset),
so this cannot create the draft deposit from here. Host publishes when ready.

Goal: one citeable dataset DOI covering the three measured ledgers already live on Pages
(ERC-8004, SLSA / PEP 740, RWA disclosure). Optional later: add `/grounded-claims/` once
federation receipts are also redeployed.

Related existing DOI (do not replace): Kirandeep's Law `10.5281/zenodo.18413995`.

---

## Suggested deposit metadata (paste into Zenodo draft)

| Field | Value |
|-------|--------|
| Upload type | Dataset |
| Title | Eigenstate Research measured ledgers: ERC-8004 refusal, PEP 740 / SLSA census, RWA disclosure interface (2026-08-02) |
| Version | 2026-08-02 |
| Access | Open |
| License | CC-BY-4.0 |
| Language | English |
| Creators | Host name as on Magicians / GitHub; affiliation optional |
| Keywords | ERC-8004, agent registration, refusal ledger, PEP 740, SLSA, RWA disclosure, machine-readable disclosure, Base |
| Related identifier | `isSupplementTo` → `10.5281/zenodo.18413995` |
| Related identifier | `isDocumentedBy` → `https://kaydeep0.github.io/eigenstate-research/` |

**Description (plain text, paste):**

```
Snapshot of three measured ledgers published by Eigenstate Research on 2026-08-02.

1) ERC-8004 Base Identity Registry refusal ledger. Uniform sample of 500 agentIds from
   60,444 registrations at pinned Base block 49425346. Digest
   ab79fc3924f1e61171105fe196959f74bdf23590a1cd88f6dfd165eb4b23e7f4. Headline: 73.0% fail
   at least one MUST limb (95% CI 68.9 to 76.7); 91.0% including self-reference and
   endpoint liveness (CI 88.2 to 93.2). Human page:
   https://kaydeep0.github.io/eigenstate-research/erc8004/

2) Supply-chain provenance census of one install set: all 94 distributions pip resolves
   for this engine's requirements.txt. Digest
   1fa8727b43a70663787f48da845df0caa947f94f39a9c41964d87aadf9bce44c. 44 serve a verified
   PEP 740 attestation; 50 serve none; 0 carry SLSA build provenance. Human page:
   https://kaydeep0.github.io/eigenstate-research/slsa/

3) RWA disclosure interface survey over 17 tracked issuers and tokenized instruments.
   Digest ce9c3eb42c04d9d8bfe9c40ffbdebca614eed14b818c39b9a189ee31ea203751. 0 of 17 serve
   a machine-readable disclosure surface on an origin they operate; attributable subset
   is 2 admit / 4 refuse of 6 with a recorded surface. Human page:
   https://kaydeep0.github.io/eigenstate-research/rwa/

These files are the machine summaries and full ledgers as published. They are not a
reputation ranking and not a sector-wide rate.
```

---

## Files to upload (from Pages repo `public/`)

| Local path | Zenodo filename | Size (bytes) | Role |
|------------|-----------------|-------------:|------|
| `public/erc8004/summary.json` | `erc8004-summary.json` | 7909 | Headline + methodology |
| `public/erc8004/ledger.json` | `erc8004-ledger.json` | 967377 | Full sample + receipts |
| `public/slsa/summary.json` | `slsa-summary.json` | 10892 | Headline |
| `public/slsa/ledger.json` | `slsa-ledger.json` | 238605 | Per-distribution receipts |
| `public/rwa/summary.json` | `rwa-summary.json` | 24082 | Headline |
| `public/rwa/ledger.json` | `rwa-ledger.json` | 83088 | Per-issuer receipts |

Optional fourth bundle (Pages live; federation receipts still pending redeploy):

| Local path | Zenodo filename | Role |
|------------|-----------------|------|
| `public/grounded-claims/summary.json` | `grounded-claims-summary.json` | Regulator grounded-claim corpus headline |
| `public/grounded-claims/ledger.json` | `grounded-claims-ledger.json` | Six-claim recheck + receipts |

Do not upload `.env`, private vault rows, or engine-only paths.

---

## Exact Host steps (web UI)

1. Open https://zenodo.org/deposit/new while logged into the Host Zenodo account.
2. Drag the six files from the table above (or eight if including grounded-claims).
3. Fill metadata from the table and description block.
4. Under **Related identifiers**, add Kirandeep's Law DOI as `isSupplementTo`.
5. Save as **Save draft**. Do not click Publish yet if you want a second pair of eyes on the description.
6. Preview the record page. Confirm digests in the description match:
   - ERC-8004: `ab79fc3924f1e611…`
   - SLSA: `1fa8727b43a70663…`
   - RWA: `ce9c3eb42c04d9d8…`
7. Click **Publish**. Zenodo mints the DOI. Copy the DOI URL.
8. Paste the DOI into `docs/launch/CATEGORY_INFRA_90D.md` scoreboard event log and tell the agent so `host_actions` / README can cite it.

### Optional API path (if you later set a token)

```bash
# In geniusflow-engine .env
ZENODO_API_TOKEN=...   # scopes: deposit:write, deposit:actions

# Then either use engine/connectors/zenodo_connector.py create_deposit()
# or the Zenodo REST deposit API. Still click Publish in the UI (or call
# POST /api/deposit/depositions/{id}/actions/publish) only after file upload.
```

---

## What not to do

- Do not publish a deposit whose numbers disagree with live
  `https://kaydeep0.github.io/eigenstate-research/{erc8004,slsa,rwa}/summary.json`.
- Do not attach homepage pitch, writer coin, or HelixHash prose as the description.
- Do not treat the DOI as Magicians / HN evidence until those posts actually land.
