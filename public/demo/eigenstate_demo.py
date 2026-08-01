"""
Eigenstate Demo — live observations, cryptographic chain, on-chain verification pointer.

Usage (from repo root):
    pip install helixhash requests
    python3 public/demo/eigenstate_demo.py

No API keys required. No accounts required.
All data comes from public endpoints.

What this demonstrates:
  1. Three observations from real public data sources
  2. Each observation measured as information gained (delta_I = log2 surprise)
  3. All three chained via HelixHash (SHA-256 append-only log)
  4. Pointer to historical Base commits (when the private engine's gates allow)

Demo ≠ production cadence, full M1 topology, or a promise that every engine
cycle writes a new Basescan transaction.
"""

from __future__ import annotations

import csv
import io
import json
import math
import sys
import time
import urllib.request
from pathlib import Path

try:
    from helixhash import HelixHash
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
    """
    url = "https://api.llama.fi/protocol/blackrock-buidl"
    raw = fetch(url, "DeFiLlama/BUIDL")
    if not raw:
        return None, None

    d = json.loads(raw)

    chain_tvls = d.get("currentChainTvls", {})
    current = sum(v for v in chain_tvls.values() if isinstance(v, (int, float)))

    tvl_series = d.get("tvl", [])
    if current == 0 and tvl_series:
        current = tvl_series[-1].get("totalLiquidityUSD", 0)

    seven_days_ago = time.time() - 7 * 86400
    previous = current
    if tvl_series:
        closest = min(
            tvl_series,
            key=lambda e: abs(e.get("date", 0) - seven_days_ago),
        )
        previous = closest.get("totalLiquidityUSD", current)

    return current, previous


# ── Observation 3: Ethereum GitHub stars (public API) ─────────────────────────

def observe_eth_github():
    """
    GitHub public API for ethereum/go-ethereum stargazers_count.
    Returns (current_stars, baseline_stars).
    """
    url = "https://api.github.com/repos/ethereum/go-ethereum"
    raw = fetch(url, "GitHub/go-ethereum")
    if not raw:
        return None, None

    d = json.loads(raw)
    current = d.get("stargazers_count", 0)

    # Fixed baseline so the demo still computes a non-zero delta_I offline-ish.
    # Update periodically if you want a tighter surprise signal.
    STARS_BASELINE = 50_910

    return current, STARS_BASELINE


def load_latest_commit() -> dict:
    """Prefer helix_commits.json beside this script; fall back to a known sample tx."""
    path = Path(__file__).resolve().parent / "helix_commits.json"
    fallback = {
        "block_number": 44546204,
        "tx_hash": "5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66",
        "committed_at": "2026-04-11T04:29:14+00:00",
        "n_crossings": 57,
        "contract": "0x3A2d6599d5409c1A87609c38dB9b1619e47F6b02",
        "basescan_url": (
            "https://basescan.org/tx/"
            "0x5a132a48097c67063afcee39f3d06ee3f35166570b4eefcc18eefaa54d877a66"
        ),
    }
    if not path.is_file():
        return fallback
    try:
        rows = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(rows, list) and rows:
            row = rows[-1]
            tx = str(row.get("tx_hash") or "").lstrip("0x")
            return {
                "block_number": row.get("block_number") or row.get("block"),
                "tx_hash": tx,
                "committed_at": row.get("committed_at"),
                "n_crossings": row.get("n_crossings"),
                "contract": row.get("contract") or fallback["contract"],
                "basescan_url": row.get("basescan_url")
                or f"https://basescan.org/tx/0x{tx}",
            }
    except Exception:
        pass
    return fallback


# ── Main demo ─────────────────────────────────────────────────────────────────

def main():
    divider = "=" * 56

    print(divider)
    print("  EIGENSTATE DEMO — live observations")
    print(divider)
    print()
    print("  Fetching live public data — this takes ~5 seconds...")
    print()

    sofr_cur, sofr_prev, sofr_date = observe_sofr()
    buidl_cur, buidl_prev = observe_buidl()
    eth_cur, eth_prev = observe_eth_github()

    if sofr_cur is None:
        sofr_cur, sofr_prev, sofr_date = 3.61, 3.57, "fallback"
    if buidl_cur is None:
        buidl_cur, buidl_prev = 2_984_123_890, 2_901_000_000
    if eth_cur is None:
        eth_cur, eth_prev = 50_979, 50_910

    dI_sofr = safe_delta_I(sofr_cur, sofr_prev)
    dI_buidl = safe_delta_I(buidl_cur, buidl_prev)
    dI_eth = safe_delta_I(eth_cur, eth_prev)

    print(f"  Observation 1: SOFR overnight rate  [{sofr_date}]")
    print(f"  {'SOFR today:':<30} {sofr_cur:.4f}%")
    print(f"  {'SOFR previous:':<30} {sofr_prev:.4f}%")
    print(f"  {'Information gained (delta_I):':<30} {dI_sofr:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_sofr:.6f}")
    print()

    print(f"  Observation 2: BlackRock BUIDL TVL")
    print(f"  {'BUIDL TVL today:':<30} ${buidl_cur:>16,.0f}")
    print(f"  {'BUIDL TVL 7 days ago:':<30} ${buidl_prev:>16,.0f}")
    print(f"  {'Information gained (delta_I):':<30} {dI_buidl:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_buidl:.6f}")
    print()

    print(f"  Observation 3: Ethereum go-ethereum GitHub stars")
    print(f"  {'Stars today:':<30} {eth_cur:>8,}")
    print(f"  {'Stars baseline:':<30} {eth_prev:>8,}")
    print(f"  {'Information gained (delta_I):':<30} {dI_eth:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_eth:.6f}")
    print()

    # HelixHash public API: append bytes payloads into a SHA-256 chain.
    h = HelixHash()
    observations = [
        {"label": "SOFR rate", "delta_I": dI_sofr, "A": 1.0, "E": dI_sofr},
        {"label": "BUIDL TVL", "delta_I": dI_buidl, "A": 1.0, "E": dI_buidl},
        {"label": "ETH GitHub", "delta_I": dI_eth, "A": 1.0, "E": dI_eth},
    ]
    for obs in observations:
        h.append(json.dumps(obs, sort_keys=True).encode("utf-8"))

    print(divider)
    print("  LOCAL CHAIN (HelixHash append-only log)")
    print(divider)
    print()
    print(f"  Head SHA-256: {h.head}")
    print(f"  Chain valid:  {h.verify()}")
    print(f"  Entries:      {h.length}")
    print()
    print("  Alter any observation payload and the chain verify() fails.")
    print("  This is a toy chain — not the private engine vault.")
    print()

    latest = load_latest_commit()
    tx = str(latest.get("tx_hash") or "").lstrip("0x")

    print(divider)
    print("  HISTORICAL ON-CHAIN POINTER (Base)")
    print(divider)
    print()
    print("  The private engine commits vault fingerprints to GeniusFlowSettlement")
    print("  on Base when wallet, balance, and mirror gates pass — not on a fixed")
    print("  public cadence, and not every parkash cycle.")
    print()
    print("  Sample / latest listed commit in this demo bundle:")
    print(f"  Contract: {latest.get('contract')}")
    print(f"  Block:    {latest.get('block_number')}")
    print(f"  TX:       0x{tx[:16]}...{tx[-8:]}")
    print(f"  Time:     {latest.get('committed_at')}")
    if latest.get("n_crossings") is not None:
        print(f"  Crossings recorded with that commit: {latest.get('n_crossings')}")
    print()
    print(f"  Verify at: {latest.get('basescan_url')}")
    print("  Prefer the live Proof Index over any hard-coded hash in this script.")
    print()
    print(divider)
    print("  Full research: https://kaydeep0.github.io/eigenstate-research/")
    print("  On-chain proof index: https://kaydeep0.github.io/eigenstate-research/onchain/")
    print("  HelixHash: https://github.com/Kaydeep0/helixhash")
    print(divider)


if __name__ == "__main__":
    main()
