# Show HN post

**Title:** Show HN: HelixHash — hash-chained observation logs with on-chain verification

**Body:**

I built a Python library for creating tamper-evident observation logs.

```
pip install helixhash
```

Each observation is chained to the previous one via SHA-256. Altering any record breaks every subsequent fingerprint. You can commit the chain fingerprint to any EVM blockchain for an immutable timestamp.

The library came out of building a financial measurement engine that watches public data sources, measures information efficiency using E = delta_I / A (log-ratio surprise divided by computational cost), and commits vault fingerprints to Base mainnet when its wallet, balance, and mirror gates pass. Chaining is continuous; the on-chain commit is not every cycle.

Simple demo:

```python
from helixhash import HelixHash, Crossing

h = HelixHash()
h.cross(Crossing(delta_I=2.0, A=1.0,
                 kappa=0.62, C=0.9,
                 label="SOFR rate change"))
h.cross(Crossing(delta_I=0.5, A=1.0,
                 kappa=0.63, C=0.9,
                 label="TVL movement"))

print(h.verify())      # True
print(h.fingerprint)   # 64-char SHA-256
print(h.PT)            # 0-1 score (threshold at 1/golden ratio = 0.618)
```

The full demo fetches live public data (SOFR from FRED, BlackRock BUIDL TVL from DeFiLlama, Ethereum GitHub stars) and chains them into a fingerprint you can verify against on-chain commits:

```
python3 -m venv .venv && . .venv/bin/activate
pip install helixhash
python3 public/demo/eigenstate_demo.py
```

Every Base mainnet commit the engine has made is listed in the proof index, each one verifiable at basescan.org. Read the count off the index rather than off this post, which goes stale the moment the next commit lands.

On-chain proof index: https://kaydeep0.github.io/eigenstate-research/onchain/

Full research: https://kaydeep0.github.io/eigenstate-research/

Questions welcome.

---

**What to expect from comments:**

- "This is just a Merkle log" — yes, functionally similar. The difference is the information-theoretic weighting: G accumulates via Fibonacci recurrence, PT tracks crossing the 1/phi threshold. A plain Merkle log doesn't compute those quantities.

- "Why not Certificate Transparency?" — CT is for TLS certificates. This is for arbitrary observation sequences with an efficiency metric baked in. Different scope.

- "Why Base mainnet instead of Ethereum L1?" — gas cost. Base commit costs ~$0.01. Ethereum L1 would be $3-15 for the same operation. The security guarantee is Ethereum's (Base posts state roots to L1).

- "PT reaching 0.618 — what does that mean practically?" — it means the cumulative information-to-action ratio crossed the golden ratio threshold. In the financial engine context, it signals when accumulated signal is sufficient to act on. Below 0.618: accumulate more observations. Above: the path has enough history to commit to.
