# HelixHash

The cryptographic primitive underlying Eigenstate Research. Open source. Available to anyone.

```bash
pip install 'helixhash>=1.0'
```

PyPI: https://pypi.org/project/helixhash/1.0.0/  
Source: https://github.com/Kaydeep0/helixhash

## What it does

HelixHash is a tamper-evident append-only log. It proves a sequence of
bytestrings existed in this order at these times and has not been altered.
It makes **no** claim about whether the payloads are true, meaningful, or
correct — that is policy (witness / scoring layers), not protocol.

Each `append` produces a SHA-256 hash that covers index, payload, timestamp,
optional signer pubkey, and the previous hash. Altering any field breaks
`verify()`.

## Quick start

```python
from helixhash import HelixHash

h = HelixHash()
h.append(b"first event")
h.append(b"second event")
print(h.verify())  # True
print(h.head)      # tip SHA-256 hex
print(h.length)    # 2
```

## API (v1.0)

```python
class HelixHash:
    def append(self, payload: bytes, signer=None) -> Entry
    def verify(self) -> bool
    def export(self) -> list[dict]
    @classmethod
    def from_export(cls, entries: list[dict]) -> "HelixHash"
    @property
    def head(self) -> str
    @property
    def length(self) -> int
```

## Breaking change from 0.1.1

v0.1.1 baked Crossing / PT / Fibonacci / PHI into the library. v1.0 removed
that policy surface entirely. There is no `Crossing`, `cross()`, `PT`, `G`,
or `analysis` module on PyPI 1.0+. Encode observation metadata yourself and
`append` the bytes (e.g. JSON).

Historical Zenodo prior-art package (cosmology-era API): DOI
[10.5281/zenodo.18413995](https://doi.org/10.5281/zenodo.18413995) (v0.1.1).

## How to commit your head hash on-chain

1. Append your observation payloads
2. Read `h.head` (64-char hex)
3. Submit it as calldata in any EVM transaction
4. The block timestamp is your immutable proof
5. Anyone can verify: recompute the chain and compare

The Eigenstate engine commits to Base mainnet when its gates allow. You can
commit to any EVM chain you choose.

## On-chain verification

Every Base mainnet commit the Eigenstate engine has made is listed in the
proof index, each one verifiable at basescan.org.

Full on-chain index:
https://kaydeep0.github.io/eigenstate-research/onchain/

Machine readable:
https://kaydeep0.github.io/eigenstate-research/api/onchain.json

## Honest limitations

- Timestamps use `time.time()`; sub-microsecond ordering is not guaranteed.
- Signing requires optional `cryptography` (`pip install helixhash[signing]`).
- This is not an RFC 6962 Merkle tree: no inclusion/consistency proofs.
