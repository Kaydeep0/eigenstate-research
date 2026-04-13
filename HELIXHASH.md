# HelixHash

The cryptographic primitive underlying Eigenstate Research. Open source. Available to anyone.

    pip install helixhash

## What it does

HelixHash creates a hash-chained observation log with built-in memory accumulation and a protocol truth score. Each observation is chained to the previous one via SHA-256. Altering any record breaks every subsequent fingerprint.

## Quick start

    from helixhash import HelixHash, Crossing

    h = HelixHash()

    h.cross(Crossing(
        delta_I=2.0,
        A=1.0,
        kappa=0.62,
        C=0.9,
        label="SOFR rate change"
    ))

    h.cross(Crossing(
        delta_I=0.5,
        A=1.0,
        kappa=0.63,
        C=0.9,
        label="BUIDL TVL movement"
    ))

    print(h.verify())     # True: chain intact
    print(h.fingerprint)  # 64-char SHA-256
    print(h.PT)           # protocol truth score
    print(h.G)            # accumulated mass

## How the chaining works

Each crossing produces:

    SHA256(n | delta_I | A | kappa | C |
           timestamp | prev_fingerprint)

The previous fingerprint is embedded in every new one. Altering any field breaks every subsequent fingerprint at that exact point. `h.verify()` checks the full chain in O(n).

## How the memory works

    G(1) = E(1)
    G(2) = G(1) + E(2)
    G(n) = G(n-1) + G(n-2) + epsilon * E(n)

Older high-efficiency observations retain persistent weight through Fibonacci recurrence. This is a design choice: the unique solution to the unit-coefficient two-state recurrence. Not proven optimal — labeled as a design choice throughout.

## PT and the golden ratio threshold

    PT = kappa * E_current * (sum_dI / sum_A) * C

Below 0.618: accumulating (quantum regime)
At 0.618: golden ratio threshold
Above 0.618: classical regime (committed)

The golden ratio appears because 1/phi is the fixed point of the Fibonacci recurrence in continuous form.

## Parameters

    delta_I  log-ratio surprise in bits
             log2(state_new / state_expected)
    A        computational cost of observation
    kappa    system coherence (0 to 1)
    C        credibility score (0 to 1)
    label    human-readable description

## How to commit your fingerprint on-chain

1. Run your observation sequence
2. Read `h.fingerprint` (64-char hex string)
3. Submit it as calldata in any EVM transaction
4. The block timestamp is your immutable proof
5. Anyone can verify: recompute and compare

The Eigenstate engine commits to Base mainnet. You can commit to any EVM chain you choose.

## On-chain verification

The Eigenstate engine has made 11 Base mainnet commits. All verifiable at basescan.org.

Latest commit:
https://basescan.org/tx/26a24d5aebcd2e15911618f6b5593956baf3d95e0fd05db6fb622779c0b5cbb4

Full on-chain index:
https://kaydeep0.github.io/eigenstate-research/onchain/

## Honest limitations

- `delta_I` is a log-ratio proxy, not exact KL divergence. Approximates entropy reduction but is not identical to it.
- Fibonacci accumulation is a design choice, not a proven optimum.
- PT threshold at golden ratio is derived from the Fibonacci fixed point, not from empirical calibration.
