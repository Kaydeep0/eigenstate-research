# Post today: Host checklist (next 60 minutes)

Critical path: Ethereum Magicians ERC-8004 reply. Everything else waits.

Full 90-day plan: [`CATEGORY_INFRA_90D.md`](CATEGORY_INFRA_90D.md).
Paste body: [`ETHEREUM_MAGICIANS_ERC8004.md`](ETHEREUM_MAGICIANS_ERC8004.md).

> **Status 2026-08-02: the Magicians paste is blocked.** The Host attempted it and the account was
> held for moderation review, so nothing can land in the thread until that review clears. Do not
> retry from a second account and do not have an agent post it.
>
> You will not have to remember this. The engine reminds every cycle: `data/host_actions.json` in
> `geniusflow-engine` prints in `python3 run.py orient` and again at the end of every
> `python3 run.py parkash`. When the account is back, paste once, then close the item with
> `python3 run.py host-actions done magicians_erc8004_post --url <permalink>`.

### Ready when unbanned (do not post yet)

| Pack item | Path / URL | Status |
|-----------|------------|--------|
| Magicians body | [`ETHEREUM_MAGICIANS_ERC8004.md`](ETHEREUM_MAGICIANS_ERC8004.md) | Paste-ready; quotes run 1 (73% / 91% / 34.8%) and labels run 2 (~71.4%); worked receipt agent 86 |
| HN body | [`HN_ERC8004.md`](HN_ERC8004.md) | Paste-ready; Day 3–7 after Magicians |
| RWA body | [`RWA_DISCLOSURE_DISCUSSION.md`](RWA_DISCLOSURE_DISCUSSION.md) | Paste-ready; 0/17 + 2/4-of-6 attributable |
| SLSA body | [`DISCUSS_PYTHON_SLSA.md`](DISCUSS_PYTHON_SLSA.md) | Paste-ready; 44 / 50 / 0 of 94 |
| Zenodo deposit | [`ZENODO_LEDGER_DEPOSIT.md`](ZENODO_LEDGER_DEPOSIT.md) | Metadata + file list; Host clicks Publish |
| Ledgers live | `/erc8004/`, `/slsa/`, `/rwa/`, `/grounded-claims/` | Pages 200. Federation `/grounded-claims/` pending redeploy. `/tlog/expectations.json` live; human page + results still sibling WIP. |

---

## Minute 0–5: Confirm you are logged in

1. Open https://ethereum-magicians.org/ in a normal browser (not a signed-out agent session).
2. Confirm your avatar / username is live. If signed out, **stop**. Log in. Do not paste as a guest.
3. Open the canonical thread (Discussion Link from the EIP):
   https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098
4. Skim the last day of replies. If either of the two spec questions in the draft was already answered in substance, note that before posting (you may still post the data point; adjust only if a question is obsolete).

---

## Minute 5–15: Paste once

1. Open [`ETHEREUM_MAGICIANS_ERC8004.md`](ETHEREUM_MAGICIANS_ERC8004.md).
2. Copy **only** the body under `**Body:**` (from "Adding a data point…" through the last paragraph before the `---` reply-discipline section).
3. Reply in the Magicians thread. Paste verbatim.
4. Link check before submit:
   - Allowed: the ledger URL already in the draft
     (`https://kaydeep0.github.io/eigenstate-research/erc8004/`)
   - **Do not** add the homepage, pilot form, writer coin, HelixHash, or `$GENIU`.
5. Submit **once**. Do not double-post.

---

## Minute 15–25: Capture evidence

1. Copy the permalink of your reply.
2. Paste it into the scoreboard event log in [`CATEGORY_INFRA_90D.md`](CATEGORY_INFRA_90D.md) (or tell the agent the URL to log).
3. Optional sanity check that strangers can fetch:
   - https://kaydeep0.github.io/eigenstate-research/erc8004/summary.json
   - https://geniusflow-federation.vercel.app/erc8004/receipts/86.json

---

## Minute 25–60: Stay in the thread, do not expand channels

1. Watch for replies for the rest of the hour.
2. Answer method and spec questions only. One sentence on "what is Eigenstate" only if asked (see draft).
3. **Do not** post HN today. HN is Day 3–7: [`HN_ERC8004.md`](HN_ERC8004.md).
4. **Do not** post RWA or SLSA today. Those are later, separate stories.
5. **Do not** tweet or Farcaster-blast the Magicians post unless someone is already wrong about "8004 = trustless" in a thread you are already in.

---

## Blocked on Host vs already done

| Item | Status |
|------|--------|
| Magicians paste-ready draft (thread URL + body) | **Done** in repo |
| HN / RWA / SLSA paste drafts | **Done** in repo; numbers match live summaries (do not post today) |
| Cite/redraw boxes on `/erc8004/`, `/slsa/`, `/rwa/` | **Done** and live |
| Grounded-claims (EDGAR/Fed corpus) | **Pages live** at `/grounded-claims/`. Federation mirror pending Vercel redeploy. |
| tlog / transparency monitor | **Expectations live** at `/tlog/expectations.json`. Human page + batch results still sibling WIP. |
| Zenodo / DOI | **Prep done**: `ZENODO_LEDGER_DEPOSIT.md` (Host publishes) |
| 90-day scoreboard doc | **Done**: `CATEGORY_INFRA_90D.md` |
| Actually posting Magicians | **Blocked: account held for moderation review** (Host tried 2026-08-02). Re-checked every parkash. |
| HN / discuss.python.org posts | **Blocked on Host** + sequencing |

---

## After today

- Days 1–14: answer Magicians pushback only.
- Then RWA draft: [`RWA_DISCLOSURE_DISCUSSION.md`](RWA_DISCLOSURE_DISCUSSION.md).
- Then HN: [`HN_ERC8004.md`](HN_ERC8004.md).
- SLSA later and separate: [`DISCUSS_PYTHON_SLSA.md`](DISCUSS_PYTHON_SLSA.md).
