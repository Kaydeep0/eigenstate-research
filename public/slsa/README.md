# Provenance census of one engine's own dependencies

Generated 2026-08-02T03:44:42.624241+00:00 · probe v1.0.0 · digest `1fa8727b43a70663`

Expectations for every package below were published before this run, at digest `d089f5dc2f47169f`, in a separate commit. The admit rule for each limb was fixed then and is not edited now.

This is a census, not a sample. Every distribution the resolver picks for this engine's own `requirements.txt` is here, so the counts describe one dependency set exactly and estimate nothing about PyPI as a whole.

## What was measured

- Subject: `requirements.txt` at engine commit `c9e1ab67d08c`
- Requirements file SHA-256: `7e1faf942c6cddc1`
- Platform resolved for: Darwin arm64, Python 3.11.15
- Distributions in the census: **94**
- Bytes downloaded and hashed by this probe: **35,769,965**

## Headline

- **53.2%** of the set (50 of 94) serve no PEP 740 attestation at all. There is nothing to verify, so nothing was verified.
- **46.8%** (44 of 94) pass every MUST limb: an attestation exists for the exact artifact, the bytes hash to the digest the index recorded, and the signature verifies against that computed digest.
- **0 of 94** carry a SLSA build provenance predicate. The attested ones carry `https://docs.pypi.org/attestations/publish/v1`, which binds an upload to a workflow and says nothing about how the artifact was built.
- **100.0%** (94 of 94) refuse at the full level, which adds the signer to source match and the two observed limbs.

## Where they fail

- `provenance_published`: first failing limb for 48 of 94
- `predicate_is_slsa_build_provenance`: first failing limb for 42 of 94
- `index_resolves`: first failing limb for 2 of 94
- `signer_matches_declared_source`: first failing limb for 2 of 94

Most common named reasons:

- `provenance_published:no_provenance_published`: 48
- `predicate_is_slsa_build_provenance:publish_attestation_not_build_provenance`: 42
- `index_resolves:declared_range_unsatisfiable_on_pypi`: 1
- `signer_matches_declared_source:signer_repo_mismatch:numpy/numpy!=numpy/numpy-release`: 1
- `index_resolves:project_not_on_pypi`: 1
- `signer_matches_declared_source:signer_repo_mismatch:tox-dev/py-filelock!=tox-dev/filelock`: 1

## Limbs

Each limb is reported separately so a refusal names which one failed. `not_reached` means an earlier limb failed first, so this one was never observed: it is neither a pass nor an exemption.

- `index_resolves` (MUST): ok 92, fail 2, not applicable 0, absent 0, not reached 0
- `provenance_published` (MUST): ok 44, fail 48, not applicable 0, absent 0, not reached 2
- `bundle_wellformed` (MUST): ok 44, fail 0, not applicable 0, absent 0, not reached 50
- `artifact_bytes_match_index` (MUST): ok 44, fail 0, not applicable 0, absent 0, not reached 50
- `signature_verifies` (MUST): ok 44, fail 0, not applicable 0, absent 0, not reached 50
- `signer_matches_declared_source` (SHOULD): ok 42, fail 2, not applicable 0, absent 0, not reached 50
- `predicate_is_slsa_build_provenance` (OBSERVED): ok 0, fail 44, not applicable 0, absent 0, not reached 50
- `attestation_in_transparency_log` (OBSERVED): ok 44, fail 0, not applicable 0, absent 0, not reached 50

## Predictions, scored

These were written into the expectations file and published before the run. They are scored here without editing.

- met: Fewer than half of these distributions will serve any PEP 740 attestation. Observed: 44 of 94 served an attestation.
- met: No distribution in this set will carry a SLSA build provenance predicate. Observed: 0 of 94 carried one.
- met: Both host published roots will refuse at the first limb. Observed: 2 roots failed index_resolves.
- met: Every attestation that verifies will also be in the transparency log. Observed: 44 of 44 verified attestations carried a log entry.

## The part that did work

Every attestation that exists in this set verified. 44 of 44 passed Sigstore verification against the Fulcio chain and the Rekor log, the digest this probe computed over the downloaded bytes matched the digest the index recorded in all 44 cases, and all 44 were discoverable in the transparency log. The gap here is adoption, not broken cryptography, and it is worth saying plainly because a refusal ledger that only ever prints bad news is not measuring anything.

## Anomalies, and why they are not accusations

The signer to source cross check compares two facts a maintainer sets in two different places. When they disagree the probe records it, because that is what the limb is for. It disagreed twice, and in both cases the honest reading is that the check found a naming gap rather than a problem:

- `numpy` declares `numpy/numpy` on PyPI and signs from `numpy/numpy-release`.
- `filelock` declares `tox-dev/py-filelock` on PyPI and signs from `tox-dev/filelock`.

A project may build and upload from a repository other than the one it lists as its source, and a repository that has been renamed keeps answering on its old name. Both are ordinary. What the receipt records is that an automated consumer pinning the declared source repository would not match the signer, which is a real cost of the naming gap even when nobody did anything wrong.

## What this engine found about itself

The first limb failed on this engine's own declared roots before it failed on anyone else's package:

- `helixhash>=1.0`: declared_range_unsatisfiable_on_pypi, latest published is 0.1.1
- `witnessfield>=1.0`: project_not_on_pypi

Both are packages this host publishes. The engine declares a version range the public index cannot satisfy, which means a third party following this `requirements.txt` cannot reproduce the environment. That is a refusal against the author of this probe, found by the probe, and it is published here rather than fixed quietly first.

## Read it yourself

- Expectations, published first: https://geniusflow-federation.vercel.app/slsa/expectations.json
- Full ledger with every receipt: https://geniusflow-federation.vercel.app/slsa/ledger.json
- Headline only: https://geniusflow-federation.vercel.app/slsa/summary.json
- One package: https://geniusflow-federation.vercel.app/slsa/receipts/<normalized-name>.json
- Which packages are covered: https://geniusflow-federation.vercel.app/slsa/index.json
- Same numbers laid out for reading: https://kaydeep0.github.io/eigenstate-research/slsa/

## Re-run it

```bash
python3 -m venv .slsa && .slsa/bin/pip install pypi-attestations
.slsa/bin/python engine/tools/slsa_provenance_run.py expect
.slsa/bin/python engine/tools/slsa_provenance_run.py run
```

Versions move, so a later run resolves a later set and the counts change. The expectations file records exactly which artifact filenames and digests this run covered, so a disagreement is about what the index served, not about which packages were picked.

## What this is not

Not a score, not a badge, and not a ranking of maintainers. An unattested package is not an unsafe package: PEP 740 is young and most publishers have not adopted it. Verifying a signature proves a named workflow in a named repository produced the upload; it does not say the code is good or the build was clean. The one number worth carrying out of here is that the attestations that do exist are publish attestations, so a project that treats a verified PyPI attestation as SLSA build provenance is claiming more than it holds.
