# discuss.python.org post, PEP 740 provenance census

Status: paste-ready skeleton. **Not for this launch window.** Sequence after the
ERC-8004 Magicians thread and the HN submission have both run, so the two do not
compete for the same attention. Re-run the census immediately before posting so
the numbers are not stale.

Where it goes: the Packaging category on discuss.python.org, as a reply on an
existing PEP 740 or attestations thread if a live one exists. Only open a new
topic if none does. Host posts manually.

Rules:

- Above the fold: this is a census of one install set (94 distributions), never a PyPI-wide rate.
- The only result link is the ledger page. No homepage pitch.
- The 0 for SLSA build provenance is about what publish attestations are, not an accusation.

---

**Title (if opening a new topic):**

PEP 740 census on one install set: 44 verified publish attestations, 0 SLSA build provenance

**Body (refresh numbers from a fresh run before paste):**

Adding a small census, not a sample: every distribution pip resolves for one engine's
`requirements.txt` (94 distributions on the machine that ran the probe).

Expectations were committed before the run:
https://kaydeep0.github.io/eigenstate-research/slsa/expectations.json

Results:

- 44 serve a PEP 740 attestation, and all 44 verify against Fulcio and Rekor with a
  digest computed from downloaded bytes.
- 50 serve none.
- 0 carry SLSA build provenance. Every attestation in the set is a PyPI publish
  attestation: it binds an upload to a publishing workflow and does not describe the build.

The probe refuses its own author first: two host-published roots are declared at versions
the public index cannot satisfy. That stays in the post. It is why the rest of the numbers
are worth reading.

Ledger, one receipt per package:
https://kaydeep0.github.io/eigenstate-research/slsa/

Two questions for packaging:

1. Is a publish attestation intended to be read as build provenance by downstream
   verifiers, and if not, what is the intended consumer-side distinction?
2. Is there a canonical way for a consumer to ask "does this distribution have build
   provenance" that does not require parsing the attestation bundle and inferring it from
   the predicate type?

Happy to re-run on another requirements set or platform if that would be more useful.
Version ranges float, so a later run resolves a later set; the expectations file pins which
artifact filenames and digests a given run covered.

---

**Do not:**

- Quote these counts as a PyPI-wide rate.
- Post in the same week as the ERC-8004 Magicians or HN push unless Host explicitly prioritizes packaging.
- Link the homepage, coin, or HelixHash.
