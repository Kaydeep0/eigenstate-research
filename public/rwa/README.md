# RWA disclosure interface conformance survey

Generated 2026-08-02T04:34:38.790773+00:00 · probe v1.0.2 · digest `ce9c3eb42c04d9d8`

The population, every candidate surface, the admit rule for each limb and the five predictions were published before this run at digest `28961d5d66629b9a`, in an earlier commit. Nothing in that file was edited afterwards.

The question is narrow. Everyone publishes how much tokenized real world asset value exists. Nobody publishes whether the issuer of that value serves a number a machine can read. An attestation PDF signed by an accounting firm is a strong disclosure and a useless interface: to put its number into a program you need a person, a document parser, or a third party who already did both. This survey asks only the interface question.

## What was measured

- Population: **17** real world asset issuers and tokenized instruments that this node already exports a dossier card for
- Candidate disclosure surfaces recorded by this node: **15**
- Conventional path requests against issuer operated origins: **45**
- Every surface came from this engine's own recorded data. No URL was guessed and no issuer origin was inferred from a company name.

## Headline

- **0 of 17** issuers serve a machine readable disclosure surface on an origin they operate themselves.
- **2 of 17** have a machine readable surface recorded at all, and where one exists it belongs to a third party aggregator. The number is readable; the issuer is not the one publishing it.
- **11 of 17** have no disclosure surface recorded by this node at all. That refusal is against this node's coverage, not against the issuer, and the rate below is given with them excluded as well.
- Excluding those, **4 of 6** issuers with a recorded surface still fail at least one MUST limb.
- **0 of 45** requests to conventional machine readable disclosure paths answered with structured bytes.

## The dependency nobody chose

The surfaces in this population that do serve structured bytes are aggregator endpoints. This engine's own reserve figures for BUIDL and OUSG are read from DefiLlama, not from BlackRock, Securitize or Ondo, because no issuer in the population serves an equivalent. Every consumer of those figures, including this node, holds a dependency on a third party that the issuer never agreed to and cannot be held to. When the aggregator changes a field name, the issuer's disclosure has not changed and the consumer still breaks.

This engine's sensor grounding file records the same gap in its own notes for a fourth issuer: BENJI is omitted because there is no live primary endpoint to read. The omission was written down before this survey existed and is quoted here rather than discovered by it.

## Where they fail

- `disclosure_surface_declared`: first failing limb for 11 of 17
- `machine_readable_media_type`: first failing limb for 4 of 17
- `issuer_operated_surface`: first failing limb for 1 of 17
- `as_of_date_present`: first failing limb for 1 of 17

Most common named reasons:

- `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node`: 11
- `machine_readable_media_type:html_document`: 4
- `issuer_operated_surface:surface_is_third_party:llama.fi`: 1
- `as_of_date_present:no_as_of_date_on_the_surface`: 1

## Limbs

Each limb is reported separately so a refusal names which one failed. `not_reached` means an earlier limb failed first, so this one was never observed: it is neither a pass nor an exemption. There is no specification to cite for any of this, and pretending otherwise would be the same error the survey exists to catch. MUST means a consumer cannot read the number without it, SHOULD means the consumer can read it but cannot rely on it, OBSERVED means the limb records a fact and charges nothing.

- `disclosure_surface_declared` (MUST): ok 6, fail 11, not applicable 0, absent 0, not reached 0
- `surface_resolves` (MUST): ok 6, fail 0, not applicable 0, absent 0, not reached 11
- `machine_readable_media_type` (MUST): ok 2, fail 4, not applicable 0, absent 0, not reached 11
- `body_parses_as_served_type` (MUST): ok 2, fail 0, not applicable 0, absent 0, not reached 15
- `figure_addressable_by_key_path` (SHOULD): ok 2, fail 0, not applicable 0, absent 0, not reached 15
- `as_of_date_present` (SHOULD): ok 1, fail 1, not applicable 0, absent 0, not reached 15
- `issuer_operated_surface` (SHOULD): ok 0, fail 2, not applicable 0, absent 0, not reached 15
- `registry_ref_present` (OBSERVED): ok 1, fail 1, not applicable 0, absent 0, not reached 15
- `registry_ref_chain_qualified` (OBSERVED): ok 0, fail 1, not applicable 0, absent 0, not reached 16
- `conventional_path_answers` (OBSERVED): ok 0, fail 4, not applicable 2, absent 0, not reached 11

## registry_ref discipline

- Surfaces naming any on-chain or securities identifier: **1 of 15**
- Surfaces whose reference is chain qualified: **0 of 15**

A disclosure that names a contract without naming its chain does not identify a deployment. The same twenty bytes can be a different contract on every EVM network, so a consumer has to guess or ask. CAIP-10 exists to close exactly this gap.

Every identifier reported in this survey was found inside bytes the surface itself served. The probe supplies none of its own, so there is no address in this ledger that a reader has to take on trust from us.

## Is there a convention to follow

No. The survey asked 45 times across 5 issuer operated origins, using a path list frozen and published before the run:

- `/.well-known/rwa-disclosure.json`
- `/.well-known/reserves.json`
- `/.well-known/attestation.json`
- `/.well-known/asset-disclosure.json`
- `/.well-known/proof-of-reserves.json`
- `/reserves.json`
- `/disclosure.json`
- `/attestations.json`
- `/api/reserves`

None of these is a registered well-known URI and none is specified by any standard, which is the point. There is no location an RWA issuer could serve a reserve figure from even if it wanted to, and no field name it could use that a consumer would already know how to read. The status counts were {'404': 36, '200': 9}.

The 9 responses that returned 200 are worth naming rather than counting. None of them served structured bytes. They are catch-all routes on sites that answer every path with the application shell, so the request succeeded and no disclosure was found. Reading those as a pass would have turned a routing default into a conformance result.

## Predictions, scored

These were written into the expectations file and published before the run. They are scored here without editing.

- met: No issuer in this population serves a machine readable disclosure surface on an origin it operates itself. Observed: 0 of 17 issuers had one.
- met: Every machine readable surface in the population belongs to a third party aggregator rather than to the issuer. Observed: 2 machine readable surfaces, of which 0 were issuer operated.
- met: No path in the frozen conventional list answers with structured bytes on any issuer operated origin. Observed: 0 of 45 conventional path requests answered with structured bytes.
- met: No surface in the population carries a chain qualified registry reference. Observed: 0 of 15 recorded surfaces carried one.
- met: More than half of the population has no disclosure surface recorded by this node at all. Observed: 11 of 17 had none.

## Per issuer

- `BACKED` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/BACKED.json
- `BLACKROCK` (issuer): refuse `machine_readable_media_type:html_document` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/BLACKROCK.json
- `CIRCLE` (issuer): refuse `machine_readable_media_type:html_document` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/CIRCLE.json
- `CIRCLE_RESERVE_FUND` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/CIRCLE_RESERVE_FUND.json
- `MAPLE` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/MAPLE.json
- `ONDO` (issuer): refuse `machine_readable_media_type:html_document` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/ONDO.json
- `ONDO_YIELD_ASSETS` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/ONDO_YIELD_ASSETS.json
- `PAXOS` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/PAXOS.json
- `SECURITIZE` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/SECURITIZE.json
- `SPIKO` (issuer): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/SPIKO.json
- `TETHER` (issuer): refuse `machine_readable_media_type:html_document` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/TETHER.json
- `BLACKROCK_BUIDL` (instrument): admit · receipt https://geniusflow-federation.vercel.app/rwa/receipts/BLACKROCK_BUIDL.json
- `CIRCLE_USYC` (instrument): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/CIRCLE_USYC.json
- `OUSG` (instrument): admit · receipt https://geniusflow-federation.vercel.app/rwa/receipts/OUSG.json
- `PAXOS_GOLD` (instrument): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/PAXOS_GOLD.json
- `TETHER_GOLD` (instrument): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/TETHER_GOLD.json
- `USDY` (instrument): refuse `disclosure_surface_declared:no_disclosure_surface_recorded_by_this_node` · receipt https://geniusflow-federation.vercel.app/rwa/receipts/USDY.json

## Who is not here

The population is the set of issuers this node already tracks, which is not the set of largest issuers. Issuers named in the request for this survey that this node holds no dossier card for were left out rather than added to satisfy the request:

- **Franklin Templeton (BENJI, FOBXX)**: this node holds no dossier card for it, so it is out of population and this survey makes no claim about it. This engine's own sensor grounding file records the same gap in its notes: BENJI omitted, no live primary AUM endpoint yet.
- **Superstate (USTB, USCC)**: no dossier card on this node; out of population
- **Hashnote (USYC)**: no dossier card under that name. The instrument is tracked as CIRCLE_USYC following its acquisition, and CIRCLE_USYC is in population.
- **Centrifuge, Goldfinch**: no dossier card on this node; out of population

## A source this survey refused to use

- `data/entity_tvl_cache.json` field `entities.<SLUG>.url`: the cache is populated by fuzzy name matching against DefiLlama and several of its RWA matches are wrong. ONDO and BACKED both resolve to a Kujira project called FIN, TOKENIZED_TREASURY and CIRCLE_RESERVE_FUND both resolve to a protocol called Re, and BLACKROCK resolves to securitize.io. Using these as issuer origins would attribute one company's website to another.

## Two defects this survey found in itself

The first run exposed two faults in the probe rather than in the population. They are recorded here instead of being quietly fixed, because a probe that hides its own misses has no standing to publish anyone else's. The population, the limb order, the admit rules and the predictions were not touched, so the expectations digest is unchanged and still verifies against the file published first.

- **conventional_path_answers was sequenced behind the media type limb**. Every issuer operated surface in this population is an HTML document, so the receipt returned before the convention limb was ever observed. The first run made zero conventional path requests and still scored the prediction about them as met, which is a claim on no evidence. The limb asks about the issuer's origin rather than about the surface the other limbs read, so it is now evaluated for every issuer that has an origin at all, independent of what the earlier limbs found. The prediction now scores as missed when no request was made.
- **a body clipped at this probe's own size cap was charged as a parse error**. One aggregator surface is larger than the original 2 MB cap. The probe truncated it, failed to parse its own truncation, and recorded the failure against the surface. That is a refusal this probe manufactured. The cap is raised to 32 MB, truncation is detected explicitly, and a clipped body is now named body_truncated_at_probe_cap and attributed to this probe rather than to the publisher.
- **the registry reference limbs accepted false positives**. The ISIN pattern matched any twelve character uppercase code, so two DefiLlama pool names were reported as securities identifiers. Chain qualification accepted a chain key anywhere in the document, so a two megabyte pool listing qualified an address that appeared nowhere near it, and an all-zero address counted as a reference. ISIN and LEI candidates now have to pass their real check digits, the all-zero address is discarded, and chain qualification requires the chain to sit in the same object as the address. This is the limb the survey is loudest about, so it is the one that had to be strictest.

## Read it yourself

- Expectations, published first: https://geniusflow-federation.vercel.app/rwa/expectations.json
- Full ledger with every receipt: https://geniusflow-federation.vercel.app/rwa/ledger.json
- Headline only: https://geniusflow-federation.vercel.app/rwa/summary.json
- One issuer: https://geniusflow-federation.vercel.app/rwa/receipts/<ENTITY>.json
- Which issuers are covered: https://geniusflow-federation.vercel.app/rwa/index.json
- Same numbers laid out for reading: https://kaydeep0.github.io/eigenstate-research/rwa/

## Re-run it

```bash
PYTHONPATH=engine python3 engine/tools/rwa_disclosure_run.py expect
PYTHONPATH=engine python3 engine/tools/rwa_disclosure_run.py run
PYTHONPATH=engine python3 engine/tools/rwa_pages_export.py
```

The expectations file pins the population and every candidate surface, so a disagreement is about what the surfaces served, not about which issuers were picked. `run` aborts if the expectations digest stops matching its contents.

## What this is not

- This is not a measure of disclosure quality. An issuer serving a signed monthly attestation PDF prepared by an accounting firm is disclosing more than one serving an unsigned JSON file. The survey asks only whether a program can read the number, which is a different question and a smaller one.
- This is not a market survey and not a ranking. The population is the set of issuers this node already tracks, which is not the set of largest issuers and not a sample of anything. No rate here should be quoted as a sector rate.
- A refusal at the first limb is a fact about this node's coverage, not about the issuer. Those refusals are separated out in the summary and the headline is given both ways.
- No issuer was contacted beyond a plain GET of URLs that are already public, plus the frozen conventional path list on origins the issuer already serves.
- No registry address, contract address or identifier in this survey was supplied by the probe. Every reference reported was found inside bytes the surface itself served.
