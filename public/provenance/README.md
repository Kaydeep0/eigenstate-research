# Provenance: independent time roots and intrinsic identifiers

Two things live here, both free, both checkable without asking us for anything.

## 1. A second time root over the Granth chain head

The append-only chain is already anchored to RFC-3161 time authorities. Those are one
family. If you distrust that family, you distrust every anchor at once. So the head is
also stamped with [OpenTimestamps](https://opentimestamps.org/), which anchors the same
hash to Bitcoin through public calendar servers. The two roots share no operator, no key
and no failure mode.

Files in `opentimestamps/`:

| File | What it is |
|------|------------|
| `helix-head-<prefix>.txt` | The commitment: node id, chain head hash, index, length, and the public endpoint that serves the same head. Plain text, readable without tools. |
| `helix-head-<prefix>.txt.ots` | The OpenTimestamps proof for that exact file. |

### Verify it yourself

```bash
brew install opentimestamps-client
# alternative: pipx install opentimestamps-client
curl -sSO https://kaydeep0.github.io/eigenstate-research/provenance/opentimestamps/helix-head-917f0e3036931e14.txt
curl -sSO https://kaydeep0.github.io/eigenstate-research/provenance/opentimestamps/helix-head-917f0e3036931e14.txt.ots
ots upgrade helix-head-917f0e3036931e14.txt.ots   # pulls the Bitcoin attestation once mined
ots verify helix-head-917f0e3036931e14.txt.ots
# Until upgrade reports a Bitcoin attestation, this is a calendar promise only.
```

On-disk mirrors of the same proof (Host upgrade from engine, then copy to Pages):

- Engine: `~/Desktop/GENIUSFLOW_OS/workspace/geniusflow/data/attestation/opentimestamps/helix-head-917f0e3036931e14.txt.ots`
- Pages: `~/GENIUSFLOW_OS/workspace/eigenstate-research/public/provenance/opentimestamps/helix-head-917f0e3036931e14.txt.ots`

Then check the head is still the head:

```bash
curl -sS https://geniusflow-federation.vercel.app/api/chain | head -c 200
```

If the endpoint reports a different hash for the same index, the history was rewritten and
the timestamped commitment is the evidence.

### What a fresh stamp does and does not prove

A stamp submitted today sits in the calendar servers as a pending attestation until it is
folded into a Bitcoin block, usually within a few hours. Until `ots upgrade` succeeds the
proof is a calendar promise, not a Bitcoin proof. We are not going to describe it as more
than it is. Re-run `ots upgrade` later and it becomes the real thing.

## 2. SWHID: an intrinsic identifier for the code state

[SWHID](https://www.softwareheritage.org/software-hash-identifier-swhid/), ISO/IEC
18670:2025, identifies a software artifact by content rather than by location. For git,
`swh:1:rev:<sha>` is the commit object hash, so anyone holding the revision can recompute
it with no registry, no account and no network in the trust path.

The current SWHIDs for the code behind each bake are published in the federation agent
descriptor under `provenance.software_identifiers`:

```bash
curl -sS https://geniusflow-federation.vercel.app/api/agent | python3 -m json.tool
```

This repository has been submitted to Software Heritage for archival. Archival is
asynchronous and not under our control, so we publish the request URL rather than a claim
that it finished:

- <https://archive.softwareheritage.org/api/1/origin/save/2407683/>

Read `save_task_status` there for the real state. The engine repository is private, so its
revisions are not archivable; the identifier is still intrinsic and still checkable by
anyone who receives the revision.
