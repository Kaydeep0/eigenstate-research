# discuss.python.org post, PEP 740 provenance census

Status: stub. Not for this launch window. Sequenced after the ERC-8004 Magicians thread
and the HN submission have both run, so the two do not compete for the same attention.

Where it goes: the Packaging category on discuss.python.org, as a reply on an existing
PEP 740 or attestations thread if a live one exists. Only open a new topic if none does.

## What the post has to say

A census, not a sample: all 94 distributions pip resolves for one engine's
`requirements.txt`. 44 serve a PEP 740 attestation and all 44 verify against Fulcio and
Rekor with a digest computed from downloaded bytes. 50 serve none. 0 carry SLSA build
provenance, because every attestation in the set is a PyPI publish attestation, which
binds an upload to a publishing workflow and does not describe the build.

Expectations were committed before the run:
https://kaydeep0.github.io/eigenstate-research/slsa/expectations.json

Results: https://kaydeep0.github.io/eigenstate-research/slsa/

## What it must not say

- It is not a PyPI-wide rate. It is one install set of 94 distributions, and the post has
  to say so above the fold, not in a footnote.
- The 0 for SLSA build provenance is a statement about what publish attestations are, not
  an accusation that publishers are skipping something available to them.

## Open questions worth asking, once the numbers are on the page

- Is a publish attestation intended to be read as build provenance by downstream
  verifiers, and if not, what is the intended consumer-side distinction?
- Is there a canonical way for a consumer to ask "does this distribution have build
  provenance" that does not require parsing the attestation bundle and inferring it from
  the predicate type?

## Before posting

- Re-run the census so the numbers are not stale by the time it is posted.
- The probe refuses its own author first: two host-published roots are declared at
  versions the public index cannot satisfy. That stays in the post. It is the reason the
  rest of the numbers are worth reading.
