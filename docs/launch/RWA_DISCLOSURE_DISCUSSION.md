# RWA disclosure interface discussion draft

Sequence: after the ERC-8004 Magicians thread has had a few days to run. Do not post
the same day as Magicians or HN.

Where it goes: an Ethereum Magicians / ERC discussion about RWA or tokenized-asset
disclosure if a live thread exists. Only open a new topic if none does. Host posts
manually.

Rules:

- Prior art / honesty first: this is a survey of one node's tracked issuers, not a sector rate.
- The only link is the ledger page. No homepage, no pilot, no coin.
- End on concrete asks a standards audience can answer.
- Cite `attributable_to_issuer` when quoting issuer-attributable figures (6 in scope, 2 admit, 4 refuse on MUST). Never quote 0/17 as if every refusal were the issuer's fault: 11 of 17 are this node's own coverage gap.

---

**Title (if opening a new topic):**

Machine-readable RWA disclosure: 0 of 17 tracked issuers serve one on an origin they operate

**Body:**

Adding a narrow measurement on disclosure *interfaces* for tokenized real world assets, and three questions that come out of it.

The question is not whether disclosure is accurate, audited, or adequate. Those are larger
questions. The question here is only: can a program read the disclosed figure for an issuer
without a human, a document parser, or a third party who already did both?

Population: 17 RWA issuers and tokenized instruments this node already publishes a dossier
card for. Expectations (population, candidate surfaces, limb order, five predictions) were
committed before the run.

Headline:

- 0 of 17 serve a machine readable disclosure surface on an origin they operate.
- 2 of 17 have any machine readable surface recorded at all; both belong to a third party
  aggregator (readable number, wrong publisher).
- 11 of 17 have no disclosure surface recorded by this node. That refusal is against this
  node's coverage, not against the issuer. Excluding them: 4 of 6 issuers with a recorded
  surface still fail at least one MUST limb.
- 0 of 45 requests to conventional machine readable paths on issuer-operated origins
  answered with structured bytes (paths frozen before the run, including
  `/.well-known/rwa-disclosure.json` and siblings).

So every consumer of the structured reserve figures in this population, including this node,
holds a dependency on a third party aggregator the issuer never agreed to and cannot be held
to.

Full ledger, one receipt per issuer, limbs reported separately:
https://kaydeep0.github.io/eigenstate-research/rwa/

Three asks:

1. Is there appetite for a single conventional path (or small frozen set) where an issuer that
   chooses to publish machine readable figures would put them, so consumers stop inventing
   URLs?
2. Should "issuer-operated" be a normative distinction for conformance tooling, so an
   aggregator JSON never counts as the issuer's disclosure interface?
3. For on-chain or securities identifiers inside a disclosure document: should chain
   qualification (for example CAIP-10) be required before a consumer treats an address as
   identifying a deployment? In this survey, 0 of 15 surfaces carried a chain-qualified
   registry reference.

Happy to re-run against a wider population once those issuers have dossier cards on this
node, or against a different limb definition if that would be more useful. Receipts are per
entity, so disagreements can be settled one issuer at a time.

---

**If asked "what is this / who are you":**

One sentence: a measurement node publishing a refusal ledger for disclosure interfaces, not a
rating of disclosure quality. Method:
https://kaydeep0.github.io/eigenstate-research/rwa/

**Do not:**

- Quote 0/17 without the coverage caveat.
- Cross-link the homepage, pilot form, or coin.
- Post the same day as the ERC-8004 Magicians reply or the HN submission.
