# sourcecheck: an EDGAR provenance backend

Draft, not opened. This node has no fork of `aberaio/sourcecheck` and no push
credential for one, so the code is finished here and the Host opens the PR.

Upstream: https://github.com/aberaio/sourcecheck (AGPL-compatible, `CONTRIBUTING.md`
requires hermetic tests, `ruff`, and `mypy` clean).

## Why this backend and not a fourth one

`src/sourcecheck/backends/federal_register.py` already makes the argument that the
abstention gate does not care whether a source is a paper or a rule. EDGAR extends
that to a third kind of authority, and the difference is the point worth making
upstream: the Federal Register indexes what the government published, EDGAR indexes
what companies filed. A phrase found in a 10-K corroborates the string and is not
authority for the claim, and the backend docstring says so rather than letting a
`SUPPORTED` verdict imply otherwise.

This came out of a measurement rather than an idea. Re-checking every claim this
node had already published that cites `sec.gov` or `federalreserve.gov`, six in all,
produced: 6 of 6 still grounded in the visible text at the cited URL, 0 of 6 citing
a primary filing, 0 of 6 citing a machine readable source, 3 of 6 corroborated
through EDGAR full text search. Ledger, per claim receipts and the expectations
committed before the run:
https://kaydeep0.github.io/eigenstate-research/grounded-claims/

## Files

| From | To |
| --- | --- |
| `docs/launch/sourcecheck_edgar/edgar.py` | `src/sourcecheck/backends/edgar.py` |
| `docs/launch/sourcecheck_edgar/test_edgar_backend.py` | `tests/test_edgar_backend.py` |

No changes to the core, no new dependency. It uses `httpx` only, imports the
existing `_title_matches` / `_title_tokens` / `_MIN_QUERY_TOKENS` from the scholarly
backend the way `federal_register.py` does, and follows the same
`ProvenanceBackend` plus `SourceStore` pairing.

## The three precision decisions a reviewer should attack first

1. **A bare accession number does not resolve, on purpose.** EDGAR's archive path is
   keyed by the registrant CIK, and the ten digit prefix of an accession number is
   the *filer agent*, which equals the registrant only for self-filed documents.
   Deriving one from the other would resolve a share of citations into another
   company's directory and ground the claim in the wrong filing. The backend
   requires the pair, as `CIK:accession` or as an archive URL, and otherwise falls
   through to validated search. There is a test asserting no request is made.
2. **A named document that is not in the filing abstains** rather than falling back
   to a neighbouring exhibit.
3. **Filing text is truncated at 400,000 characters** before it is served as content.
   Filings run to megabytes. Truncation can only cost recall: support outside the
   window abstains, and no path to a false `SUPPORTED` is opened.

Known limits, stated in the docstring rather than in the PR only: EDGAR full text
search covers 2001 onward, so a claim whose only support is older is not verifiable
through this backend, and that limit belongs to the index. The SEC requires a
descriptive User-Agent with a contact address and rate limits at ten requests per
second; the constructor refuses a User-Agent without a contact address, because a
throttled backend would otherwise look like an honest abstention.

## Host commands

```bash
gh repo fork aberaio/sourcecheck --clone --remote
cd sourcecheck
git checkout -b edgar-provenance-backend

cp ~/GENIUSFLOW_OS/workspace/eigenstate-research/docs/launch/sourcecheck_edgar/edgar.py \
   src/sourcecheck/backends/edgar.py
cp ~/GENIUSFLOW_OS/workspace/eigenstate-research/docs/launch/sourcecheck_edgar/test_edgar_backend.py \
   tests/test_edgar_backend.py

pip install -e ".[dev]"
pytest -m "not network" tests/test_edgar_backend.py
ruff check src tests
mypy src/sourcecheck

git add src/sourcecheck/backends/edgar.py tests/test_edgar_backend.py
git commit -m "Add an EDGAR provenance backend, and refuse to guess a registrant"
git push -u origin edgar-provenance-backend
gh pr create --repo aberaio/sourcecheck --title "Add an EDGAR provenance backend" \
  --body-file ~/GENIUSFLOW_OS/workspace/eigenstate-research/docs/launch/SOURCECHECK_EDGAR_PR.md
```

Run the tests before pushing. They are hermetic and need no network, so a failure is
a real failure. If `ruff` or `mypy` disagrees with the style of the copied file, fix
it in the fork; nothing in the design depends on the formatting.
