"""
Eigenstate Demo — live observations, cryptographic chain, on-chain verification.

Usage:
    pip install helixhash requests
    python3 eigenstate_demo.py

No API keys required. No accounts required.
All data comes from public endpoints.

What this demonstrates:
  1. Three observations from real public data sources
  2. Each observation measured as information gained (delta_I = log2 surprise)
  3. All three chained via SHA-256 into a single fingerprint
  4. That fingerprint is what the engine commits to Base mainnet every 2 hours

The engine has been running since April 2026 with 9 on-chain commits.
Every commit is verifiable at basescan.org.
"""

import csv
import io
import json
import math
import sys
import time
import urllib.request

try:
    from helixhash import HelixHash, Crossing
except ImportError:
    print("helixhash not installed. Run: pip install helixhash requests")
    sys.exit(1)


# ── Helpers ───────────────────────────────────────────────────────────────────

def fetch(url: str, label: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "eigenstate-demo/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.read()
    except Exception as e:
        print(f"  [fetch error] {label}: {e}")
        return b""


def safe_delta_I(current: float, previous: float) -> float:
    """
    Information gained from observing current vs expected (previous).
    delta_I = |log2(current / previous)|

    Uses log-ratio as a proxy for Bayesian surprise:
    when current/previous is far from 1, more information was gained.
    Minimum 0.0010 bits (guards against zero for static series).
    """
    if previous <= 0 or current <= 0:
        return 0.001
    ratio = current / previous
    if ratio <= 0:
        return 0.001
    return max(abs(math.log2(ratio)), 0.001)


# ── Observation 1: SOFR rate (FRED public API, no key needed) ─────────────────

def observe_sofr():
    """
    FRED public CSV endpoint — no API key required.
    Returns (current_rate, previous_rate, date_str).
    """
    url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=SOFR"
    raw = fetch(url, "FRED/SOFR")
    if not raw:
        return None, None, "unavailable"

    rows = list(csv.reader(io.StringIO(raw.decode())))
    data = [
        (row[0], float(row[1]))
        for row in rows[1:]
        if len(row) == 2 and row[1] and row[1] != "."
    ]
    if len(data) < 2:
        return None, None, "insufficient data"

    date_str, current = data[-1]
    _, previous = data[-2]
    return current, previous, date_str


# ── Observation 2: BUIDL TVL (DeFiLlama public API, no key needed) ────────────

def observe_buidl():
    """
    DeFiLlama protocol endpoint — no API key required.
    Returns (current_tvl, previous_tvl_7d).
    previous_tvl_7d is the TVL value closest to 7 days ago.
    """
    url = "https://api.llama.fi/protocol/blackrock-buidl"
    raw = fetch(url, "DeFiLlama/BUIDL")
    if not raw:
        return None, None

    d = json.loads(raw)

    # Current TVL from currentChainTvls
    chain_tvls = d.get("currentChainTvls", {})
    current = sum(v for v in chain_tvls.values() if isinstance(v, (int, float)))

    # Fallback: last entry in tvl array
    tvl_series = d.get("tvl", [])
    if current == 0 and tvl_series:
        current = tvl_series[-1].get("totalLiquidityUSD", 0)

    # 7-day-ago value: find tvl entry closest to now - 7 days
    seven_days_ago = time.time() - 7 * 86400
    previous = current  # fallback
    if tvl_series:
        best = None
        best_diff = float("inf")
        for entry in tvl_series:
            t = entry.get("date", 0)
            diff = abs(t - seven_days_ago)
            if diff < best_diff:
                best_diff = diff
                best = entry.get("totalLiquidityUSD", 0)
        if best:
            previous = best

    return current, previous


# ── Observation 3: Ethereum GitHub stars (GitHub public API, no key needed) ───

def observe_eth_github():
    """
    GitHub public API — no key needed (60 req/hour unauthenticated).
    Returns (current_stars, previous_stars).
    previous_stars is a hardcoded baseline from one week ago
    (GitHub API does not provide historical star counts without GraphQL).
    Baseline updated weekly in this file.
    """
    url = "https://api.github.com/repos/ethereum/go-ethereum"
    raw = fetch(url, "GitHub/go-ethereum")
    if not raw:
        return None, None

    d = json.loads(raw)
    current = d.get("stargazers_count", 0)

    # Baseline: go-ethereum stars as of 2026-04-06 (one week ago).
    # Update this value weekly to keep delta_I meaningful.
    STARS_BASELINE_2026_04_06 = 50_910

    return current, STARS_BASELINE_2026_04_06


# ── Latest on-chain commit (from helix_commits.json in this repo) ─────────────

LATEST_COMMIT = {
    "block": 44655585,
    "tx_hash": "8bbb3cd5d6e3dfb54a8f7fe957d0ae4e0f3a5ae52ba4e927aefa6808c781c017",
    "claim_id": 10,
    "committed_at": "2026-04-13T17:15:16 UTC",
    "n_crossings": 63,
    "basescan_url": (
        "https://basescan.org/tx/"
        "8bbb3cd5d6e3dfb54a8f7fe957d0ae4e0f3a5ae52ba4e927aefa6808c781c017"
    ),
}


# ── Main demo ─────────────────────────────────────────────────────────────────

def main():
    divider = "=" * 56

    print(divider)
    print("  EIGENSTATE DEMO — live observations")
    print(divider)
    print()
    print("  Fetching live public data — this takes ~5 seconds...")
    print()

    # Fetch observations
    sofr_cur, sofr_prev, sofr_date = observe_sofr()
    buidl_cur, buidl_prev = observe_buidl()
    eth_cur, eth_prev = observe_eth_github()

    # Fall back to hardcoded illustrative values if any fetch fails
    if sofr_cur is None:
        sofr_cur, sofr_prev, sofr_date = 3.61, 3.57, "2026-04-10 (fallback)"
    if buidl_cur is None:
        buidl_cur, buidl_prev = 2_984_123_890, 2_901_000_000
    if eth_cur is None:
        eth_cur, eth_prev = 50_979, 50_910

    # Compute delta_I for each observation
    dI_sofr  = safe_delta_I(sofr_cur, sofr_prev)
    dI_buidl = safe_delta_I(buidl_cur, buidl_prev)
    dI_eth   = safe_delta_I(eth_cur, eth_prev)

    # Print observation 1: SOFR
    print(f"  Observation 1: SOFR overnight rate  [{sofr_date}]")
    print(f"  {'SOFR today:':<30} {sofr_cur:.4f}%")
    print(f"  {'SOFR previous:':<30} {sofr_prev:.4f}%")
    print(f"  {'Information gained (delta_I):':<30} {dI_sofr:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_sofr:.6f}")
    print()

    # Print observation 2: BUIDL TVL
    print(f"  Observation 2: BlackRock BUIDL TVL")
    print(f"  {'BUIDL TVL today:':<30} ${buidl_cur:>16,.0f}")
    print(f"  {'BUIDL TVL 7 days ago:':<30} ${buidl_prev:>16,.0f}")
    print(f"  {'Information gained (delta_I):':<30} {dI_buidl:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_buidl:.6f}")
    print()

    # Print observation 3: ETH GitHub
    print(f"  Observation 3: Ethereum go-ethereum GitHub stars")
    print(f"  {'Stars today:':<30} {eth_cur:>8,}")
    print(f"  {'Stars 7 days ago (baseline):':<30} {eth_prev:>8,}")
    print(f"  {'Information gained (delta_I):':<30} {dI_eth:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_eth:.6f}")
    print()

    # Feed into HelixHash
    h = HelixHash()
    h.cross(Crossing(delta_I=dI_sofr,  A=1.0, kappa=0.62, C=0.9, label="SOFR rate"))
    h.cross(Crossing(delta_I=dI_buidl, A=1.0, kappa=0.62, C=0.9, label="BUIDL TVL"))
    h.cross(Crossing(delta_I=dI_eth,   A=1.0, kappa=0.62, C=0.9, label="ETH GitHub"))

    s = h.summary()

    # Print vault fingerprint
    print(divider)
    print("  VAULT FINGERPRINT (your local chain)")
    print(divider)
    print()
    print(f"  SHA-256: {s['fingerprint']}")
    print(f"  Chain valid:  {h.verify()}")
    print(f"  PT score:     {s['PT']:.4f}  (threshold 0.618 — below = accumulating)")
    print(f"  G (memory):   {s['G']:.6f}")
    print(f"  Crossings:    {s['N']}")
    print()
    print("  Each fingerprint encodes the full observation history.")
    print("  Alter any value above and the SHA-256 chain breaks immediately.")
    print()

    # Print on-chain verification
    print(divider)
    print("  VERIFY ON BASESCAN")
    print(divider)
    print()
    print("  The Eigenstate engine runs the same hash on its full vault")
    print("  every 2 hours and commits the fingerprint to Base mainnet.")
    print()
    print(f"  Latest commit:")
    print(f"  Block:   {LATEST_COMMIT['block']}")
    print(f"  TX:      0x{LATEST_COMMIT['tx_hash'][:16]}...{LATEST_COMMIT['tx_hash'][-8:]}")
    print(f"  Time:    {LATEST_COMMIT['committed_at']}")
    print(f"  Crossings in that vault: {LATEST_COMMIT['n_crossings']}")
    print()
    print(f"  Verify at:")
    print(f"  {LATEST_COMMIT['basescan_url']}")
    print()
    print("  The on-chain fingerprint is the evidenceHash field in the")
    print("  createClaim() transaction. Anyone can verify it independently.")
    print()
    print(divider)
    print("  Full research: https://kaydeep0.github.io/eigenstate-research/")
    print("  On-chain proof index: .../onchain/")
    print("  HelixHash source: pip show helixhash")
    print(divider)


if __name__ == "__main__":
    main()
