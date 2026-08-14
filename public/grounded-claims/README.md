# Grounded claim corpus: the SEC and Fed claims this node publishes, rechecked

Generated 2026-08-14T03:05:13.741183+00:00 · probe v1.0.1 · digest `0c23eaf6a9e02d57`

The population, every source URL and expected string, the limbs with their admit conditions and seven predictions were published before this run at digest `dc8f54dfef2d82e8`, in an earlier commit. Nothing in that file was edited afterwards.

A citation is not a check. This node publishes claims with a source URL and an expected string and tells readers they can verify them. Each URL was fetched once, at verification time, and the verdict has been served out of a file ever since. Nothing re-reads the page. This corpus re-reads them.

## Headline

- **6 of 6** expected strings are still present in the bytes the cited URL serves today.
- **0 of 6** claims cite a primary filing document. The rest cite a regulator website page.
- **1 of 6** claims are held at more than one verdict inside this node's own ledger. The published card serves one side.
- **3 of 6** claims are corroborated by the body of a primary filing a free public index returned, and **0 of 6** by a document the regulator itself authored.
- **5 of 6** clear every MUST limb; **0 of 6** clear MUST and SHOULD together.

The corpus is 6 claims carried by 19 ledger rows. That is the whole of this node's regulator grounded surface, not a sample of it. The size is a finding rather than a limitation being excused.

## Three chains, kept apart

Chains are evaluated independently. A failure inside one chain stops that chain and marks the limbs after it not_reached, and it does not touch the other chains. This is deliberate: the RWA disclosure survey this node published earlier had to correct a limb that was sequenced behind an unrelated failure, made zero requests, and still scored its prediction as met.

- **citation**: `source_url_recorded`, `expected_string_recorded`, `source_resolves`, `expected_string_present_in_served_bytes`, `expected_string_survives_tag_stripping`, `source_on_regulator_origin`, `source_is_machine_readable`
- **record**: `ledger_rows_agree`
- **corroboration**: `citation_is_a_primary_filing`, `full_text_index_exists`, `full_text_index_answers`, `independent_filing_corroborates`, `corroborating_document_authored_by_the_regulator`

## Limbs

MUST means a reader cannot check the claim by the route this node offers without it. SHOULD means the check works but cannot be relied on. OBSERVED records a fact and charges nothing. `not_reached` means an earlier limb in the same chain failed.

- `source_url_recorded` (MUST, citation chain): ok 6, fail 0, not applicable 0, not reached 0
- `expected_string_recorded` (MUST, citation chain): ok 6, fail 0, not applicable 0, not reached 0
- `source_resolves` (MUST, citation chain): ok 6, fail 0, not applicable 0, not reached 0
- `expected_string_present_in_served_bytes` (MUST, citation chain): ok 6, fail 0, not applicable 0, not reached 0
- `expected_string_survives_tag_stripping` (SHOULD, citation chain): ok 6, fail 0, not applicable 0, not reached 0
- `source_on_regulator_origin` (SHOULD, citation chain): ok 6, fail 0, not applicable 0, not reached 0
- `source_is_machine_readable` (SHOULD, citation chain): ok 0, fail 6, not applicable 0, not reached 0
- `ledger_rows_agree` (MUST, record chain): ok 5, fail 1, not applicable 0, not reached 0
- `citation_is_a_primary_filing` (OBSERVED, corroboration chain): ok 0, fail 6, not applicable 0, not reached 0
- `full_text_index_exists` (OBSERVED, corroboration chain): ok 3, fail 3, not applicable 0, not reached 0
- `full_text_index_answers` (OBSERVED, corroboration chain): ok 3, fail 0, not applicable 0, not reached 3
- `independent_filing_corroborates` (OBSERVED, corroboration chain): ok 3, fail 0, not applicable 0, not reached 3
- `corroborating_document_authored_by_the_regulator` (OBSERVED, corroboration chain): ok 0, fail 3, not applicable 0, not reached 3

## Where they refuse

- `source_is_machine_readable`: first failing limb for 5 of 6
- `ledger_rows_agree`: first failing limb for 1 of 6

Named reasons:

- `source_is_machine_readable:html_document`: 5
- `ledger_rows_agree:ledger_rows_disagree:ATTESTED-PRIMARY|CONTRADICTED`: 1

Who each refusal belongs to:

- `publisher`: 5
- `this_node`: 1

## What EDGAR could and could not do

The SEC operates a free full text index over registrant filings that any program can query without credentials. The Federal Reserve operates no equivalent over its own statements. Of the 6 claims, 3 had an index to ask and 3 did not, and that refusal belongs to the absence of an index rather than to the claim or to this node.

Where an index existed it answered for 3 of 3 claims. This probe then fetched 3 filing documents and found the recorded string in the body of a filing for 3 claims.

A corroborating filing is a registrant's document. It shows the phrase is used in a primary filing and it does not make the filer authoritative for the claim. Neither regulator in this corpus files on EDGAR as a registrant, so the limb asking whether the corroborating document was authored by the regulator cannot pass for any claim here, and the empty CIK sets that make that true were published in the expectations file rather than filled with a plausible looking number.

The SEC full text search index covers filings from 2001 onward. A claim whose only corroborating filing predates 2001 would be recorded here as uncorroborated, and that limit belongs to the index.

## Predictions, scored

These were written into the expectations file and published before the run. Each says whether it was blind. Two were not, and both are explained in the expectations file under pre_freeze_observations rather than presented as clean hits.

- met (not blind): No claim in this corpus cites a primary filing document. Every citation is a regulator website page describing one. Observed: 0 of 6 citations were primary filings.
- met (blind): Every claim's expected string is still present in the bytes served at its cited URL today. Observed: 6 of 6 expected strings were present in the bytes served today.
- met (blind): No source in this corpus serves machine readable bytes. Observed: 0 of 6 sources served machine readable bytes.
- met (not blind): The free EDGAR full text index answers with at least one hit for every claim in this corpus that has an index to ask, and the Federal Reserve claims have none, because no free full text index exists over the Federal Reserve's own statements. Observed: 3 of 3 claims with an index answered with a hit; 3 Federal Reserve claims had no index to ask.
- met (blind): No claim in this corpus is corroborated by a primary document the regulator itself authored. Where a filing carries the string, the filer is a registrant describing the regulator. Observed: 0 of 6 claims were corroborated by a document the regulator authored.
- met (not blind): This node's own ledger holds at least one claim whose rows disagree about its verdict, and the published card serves one side of that disagreement without saying the other exists. Observed: 1 of 6 claims had ledger rows that disagree.
- met (blind): At least half the claims in this corpus are corroborated by the body of an independent primary filing the index returned. Observed: 3 of 6 claims were corroborated by an independent filing body.

## Per claim

- `FED_FOMC` (FED, expected `FOMC`): admit · receipt https://geniusflow-federation.vercel.app/grounded-claims/receipts/FED_FOMC.json
- `FED_FEDNOW` (FED, expected `FedNow`): admit · receipt https://geniusflow-federation.vercel.app/grounded-claims/receipts/FED_FEDNOW.json
- `FED_FEDERAL_RESERVE` (FED, expected `Federal Reserve`): admit · receipt https://geniusflow-federation.vercel.app/grounded-claims/receipts/FED_FEDERAL_RESERVE.json
- `SEC_SAB_121` (SEC, expected `SAB 121`): refuse `ledger_rows_agree:ledger_rows_disagree:ATTESTED-PRIMARY|CONTRADICTED` · receipt https://geniusflow-federation.vercel.app/grounded-claims/receipts/SEC_SAB_121.json
- `SEC_INVESTMENT_CONTRACT` (SEC, expected `investment contract`): admit · receipt https://geniusflow-federation.vercel.app/grounded-claims/receipts/SEC_INVESTMENT_CONTRACT.json
- `SEC_PROTECT_INVESTORS` (SEC, expected `protect investors`): admit · receipt https://geniusflow-federation.vercel.app/grounded-claims/receipts/SEC_PROTECT_INVESTORS.json

## Reproduce any single receipt without this repository

Every receipt carries a `reproduce.api_verify` URL. The expected string test here is the same rule that endpoint applies, against the same URL, so a reader can check one claim from a browser:

```
https://geniusflow-federation.vercel.app/api/verify?source_url=https%3A%2F%2Fwww.federalreserve.gov%2Fmonetarypolicy%2Ffomc.htm&expected=FOMC
```

A different answer means either the page changed between the two requests or there is a defect here, and both are worth reporting.

## Read it yourself

- Expectations, published first: https://geniusflow-federation.vercel.app/grounded-claims/expectations.json
- Full ledger with every receipt: https://geniusflow-federation.vercel.app/grounded-claims/ledger.json
- Headline only: https://geniusflow-federation.vercel.app/grounded-claims/summary.json
- One claim: https://geniusflow-federation.vercel.app/grounded-claims/receipts/<CLAIM_KEY>.json
- Which claims are covered: https://geniusflow-federation.vercel.app/grounded-claims/index.json
- Same numbers laid out for reading: https://kaydeep0.github.io/eigenstate-research/grounded-claims/

## Re-run it

```bash
PYTHONPATH=engine python3 engine/tools/grounded_claim_run.py expect
PYTHONPATH=engine python3 engine/tools/grounded_claim_run.py run
PYTHONPATH=engine python3 engine/tools/grounded_claim_export.py
```

`run` aborts if the expectations digest stops matching its contents, so the corpus cannot be trimmed to whatever the run happened to find.

## A defect this corpus found in itself

The first run exposed a fault in the probe rather than in the corpus. It is recorded here instead of being quietly fixed, because a probe that hides its own misses has no standing to publish anyone else's. The population, the limb order, the admit rules and the predictions were not touched, so the expectations digest is unchanged and still verifies against the file published first.

- **the headline refusal was the earliest failing limb, not the strongest**. Every source in this corpus is an HTML page, so source_is_machine_readable failed for all six claims at position seven of the citation chain. The one claim that also misses a MUST, because this node's own ledger holds it at two different verdicts, reported the SHOULD failure as its refuse_limb and the MUST failure appeared only inside must_limbs_failed. The summary counted the MUST correctly and the headline understated it. The receipt now names the first failing MUST limb, and falls back to a SHOULD only when no MUST failed. Because the three chains run independently there is no single sequence for limbs to fail in, so severity is the only ordering that means anything.

## Prior art

- [SEC EDGAR full text search](https://efts.sec.gov/LATEST/search-index?q=): The free index this corpus queries. It is the SEC's own service and it needs no credentials, only an identifying user agent.
- [SEC webmaster guidance on automated access](https://www.sec.gov/os/webmaster-faq#developers): Sets the request ceiling and the user agent expectation this probe stays well inside.
- [This node's own /api/verify endpoint](https://geniusflow-federation.vercel.app/api/verify): The grounded string rule the corpus applies is that endpoint's rule, reproduced so any receipt can be reproduced against the live service.
- [This node's RWA disclosure interface survey](https://geniusflow-federation.vercel.app/rwa/README.md): Published a defect against itself where a limb sequenced behind an earlier failure made zero requests and still scored its prediction as met. This corpus separates its limbs into independent chains from the start because of it.

## What this is not

- This is not a judgement about whether any claim is true. A string being present in a page is evidence that the page says it, and nothing more. A string being absent is evidence that this node's grounding no longer holds, not that the fact changed.
- A corroborating EDGAR filing is a registrant's document. It shows the phrase is used in a primary filing. It does not make the filer authoritative for the claim, and neither regulator in this corpus files on EDGAR as a registrant.
- This is not a survey of regulator disclosure practice. The population is six claims this node already publishes, which is the whole of its regulator grounded corpus and not a sample of anything. No rate here should be read as a rate about the SEC or the Fed.
- The corpus is small on purpose and the size is the finding, not a limitation being excused. Six claims is the entire regulator grounded surface this node serves.
- No regulator was contacted beyond plain GETs of URLs that are already public, plus one query per claim against a public search index, with an identifying user agent carrying a contact address and request spacing an order of magnitude under the SEC's published ceiling.
- The SEC full text search index covers filings from 2001 onward. A claim whose only corroborating filing predates 2001 would be recorded here as uncorroborated, and that limit belongs to the index.
