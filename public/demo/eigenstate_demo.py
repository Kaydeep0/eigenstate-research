"""
Eigenstate Demo: live observations, cryptographic chain, on-chain verification pointer.

Usage (from this repo root):
    pip install 'helixhash>=1.0'
    python3 public/demo/eigenstate_demo.py

Usage (no clone, any empty directory):
    pip install 'helixhash>=1.0'
    curl -sO https://kaydeep0.github.io/eigenstate-research/demo/eigenstate_demo.py
    python3 eigenstate_demo.py

No API keys. No accounts. Only the standard library plus helixhash.
Every data source is a public endpoint. If a source is unreachable the run
still completes on pinned fallback values and says so in the output.

What this demonstrates:
  1. Three observations from real public data sources
  2. Each observation measured as information gained (delta_I = log2 surprise)
  3. All three chained via HelixHash.append (SHA-256 tip hash)
  4. A tamper check: altering one observation breaks verify()
  5. Pointer to historical Base commits (when the private engine's gates allow)

Demo is not production cadence, not full M1 topology, and not a promise that
every engine cycle writes a new Basescan transaction.
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
    from helixhash import HelixHash, __version__ as HELIXHASH_VERSION
except ImportError:
    print("helixhash not installed. Run: pip install 'helixhash>=1.0'")
    sys.exit(1)

def _helix_ok(version: str) -> bool:
    parts = []
    for tok in version.split("."):
        num = ""
        for ch in tok:
            if ch.isdigit():
                num += ch
            else:
                break
        if num == "":
            break
        parts.append(int(num))
    while len(parts) < 3:
        parts.append(0)
    return tuple(parts[:3]) >= (1, 0, 0) and hasattr(HelixHash, "append")

if not _helix_ok(HELIXHASH_VERSION):
    print(
        "This demo needs helixhash >= 1.0 (append(bytes) API).\n"
        f"Installed: {HELIXHASH_VERSION!r}. Run: pip install -U 'helixhash>=1.0'"
    )
    sys.exit(1)


REMOTE_COMMITS = (
    "https://kaydeep0.github.io/eigenstate-research/demo/helix_commits.json"
)

# Credibility annotation for observation payloads (policy, not HelixHash protocol).
# A live read of a public endpoint gets 1.0; a pinned fallback gets less.
C_LIVE = 1.0
C_FALLBACK = 0.5


# -- Helpers ------------------------------------------------------------------

def fetch(url: str, label: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "eigenstate-demo/1.1"},
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
    Minimum 0.0010 bits so the demo never records a zero-surprise observation;
    static series still cost something to observe.
    """
    if previous <= 0 or current <= 0:
        return 0.001
    ratio = current / previous
    if ratio <= 0:
        return 0.001
    return max(abs(math.log2(ratio)), 0.001)


# -- Observation 1: SOFR rate (FRED public CSV, no key needed) -----------------

def observe_sofr():
    """
    FRED public CSV endpoint, no API key required.
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


# -- Observation 2: BUIDL TVL (DeFiLlama public API, no key needed) ------------

def observe_buidl():
    """
    DeFiLlama protocol endpoint, no API key required.
    Returns (current_tvl, previous_tvl_7d).
    """
    url = "https://api.llama.fi/protocol/blackrock-buidl"
    raw = fetch(url, "DeFiLlama/BUIDL")
    if not raw:
        return None, None

    try:
        d = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"  [parse error] DeFiLlama/BUIDL: {e}")
        return None, None

    chain_tvls = d.get("currentChainTvls", {})
    current = sum(v for v in chain_tvls.values() if isinstance(v, (int, float)))

    tvl_series = d.get("tvl", [])
    if current == 0 and tvl_series:
        current = tvl_series[-1].get("totalLiquidityUSD", 0)
    if not current:
        return None, None

    seven_days_ago = time.time() - 7 * 86400
    previous = current
    if tvl_series:
        closest = min(
            tvl_series,
            key=lambda e: abs(e.get("date", 0) - seven_days_ago),
        )
        previous = closest.get("totalLiquidityUSD", current)

    return current, previous


# -- Observation 3: Ethereum GitHub stars (public API) -------------------------

def observe_eth_github():
    """
    GitHub public API for ethereum/go-ethereum stargazers_count.
    Returns (current_stars, baseline_stars).

    The baseline is a pinned constant, not a second live read, so the
    surprise here is measured against a fixed prior rather than yesterday.
    Unauthenticated GitHub requests are rate limited by IP; a 403 here is
    normal and drops the run to the fallback path for this observation.
    """
    url = "https://api.github.com/repos/ethereum/go-ethereum"
    raw = fetch(url, "GitHub/go-ethereum")
    if not raw:
        return None, None

    try:
        d = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"  [parse error] GitHub/go-ethereum: {e}")
        return None, None

    current = d.get("stargazers_count", 0)
    if not current:
        return None, None

    STARS_BASELINE = 50_910

    return current, STARS_BASELINE


def _normalise_commit(row: dict, fallback: dict) -> dict:
    tx = str(row.get("tx_hash") or "")
    if tx.startswith("0x"):
        tx = tx[2:]
    if not tx:
        return fallback
    return {
        "block_number": row.get("block_number") or row.get("block"),
        "tx_hash": tx,
        "committed_at": row.get("committed_at"),
        "n_crossings": row.get("n_crossings"),
        "contract": row.get("contract") or fallback["contract"],
        "basescan_url": f"https://basescan.org/tx/0x{tx}",
        "source": row.get("_source", "bundle"),
    }


def load_latest_commit() -> dict:
    """
    Prefer helix_commits.json beside this script. If the script was fetched on
    its own, pull the same file from the published site. Fall back to a pinned
    sample commit only if both are unavailable.
    """
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
        "source": "pinned fallback in this script",
    }

    path = Path(__file__).resolve().parent / "helix_commits.json"
    if path.is_file():
        try:
            rows = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(rows, list) and rows:
                row = dict(rows[-1])
                row["_source"] = "helix_commits.json beside this script"
                return _normalise_commit(row, fallback)
        except Exception as e:
            print(f"  [read error] helix_commits.json: {e}")

    raw = fetch(REMOTE_COMMITS, "published helix_commits.json")
    if raw:
        try:
            rows = json.loads(raw)
            if isinstance(rows, list) and rows:
                row = dict(rows[-1])
                row["_source"] = REMOTE_COMMITS
                return _normalise_commit(row, fallback)
        except Exception as e:
            print(f"  [parse error] published helix_commits.json: {e}")

    return fallback


# -- Main demo ----------------------------------------------------------------

def main():
    divider = "=" * 56

    print(divider)
    print("  EIGENSTATE DEMO: live observations")
    print(divider)
    print()
    print("  Fetching live public data, this takes about 5 seconds...")
    print()

    sofr_cur, sofr_prev, sofr_date = observe_sofr()
    buidl_cur, buidl_prev = observe_buidl()
    eth_cur, eth_prev = observe_eth_github()

    sofr_live = sofr_cur is not None
    buidl_live = buidl_cur is not None
    eth_live = eth_cur is not None

    if not sofr_live:
        sofr_cur, sofr_prev, sofr_date = 3.61, 3.57, "pinned fallback"
    if not buidl_live:
        buidl_cur, buidl_prev = 2_984_123_890, 2_901_000_000
    if not eth_live:
        eth_cur, eth_prev = 50_979, 50_910

    dI_sofr = safe_delta_I(sofr_cur, sofr_prev)
    dI_buidl = safe_delta_I(buidl_cur, buidl_prev)
    dI_eth = safe_delta_I(eth_cur, eth_prev)

    def source_line(live: bool) -> str:
        return "live public endpoint" if live else "pinned fallback (fetch failed)"

    print(f"  Observation 1: SOFR overnight rate  [{sofr_date}]")
    print(f"  {'Source:':<30} {source_line(sofr_live)}")
    print(f"  {'SOFR today:':<30} {sofr_cur:.4f}%")
    print(f"  {'SOFR previous:':<30} {sofr_prev:.4f}%")
    print(f"  {'Information gained (delta_I):':<30} {dI_sofr:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_sofr:.6f}")
    print()

    print("  Observation 2: BlackRock BUIDL TVL")
    print(f"  {'Source:':<30} {source_line(buidl_live)}")
    print(f"  {'BUIDL TVL today:':<30} ${buidl_cur:>16,.0f}")
    print(f"  {'BUIDL TVL 7 days ago:':<30} ${buidl_prev:>16,.0f}")
    print(f"  {'Information gained (delta_I):':<30} {dI_buidl:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_buidl:.6f}")
    print()

    print("  Observation 3: Ethereum go-ethereum GitHub stars")
    print(f"  {'Source:':<30} {source_line(eth_live)}")
    print(f"  {'Stars today:':<30} {eth_cur:>8,}")
    print(f"  {'Stars baseline (pinned):':<30} {eth_prev:>8,}")
    print(f"  {'Information gained (delta_I):':<30} {dI_eth:.6f} bits")
    print(f"  {'Observation cost (A):':<30} 1.0")
    print(f"  {'Efficiency (E = delta_I / A):':<30} {dI_eth:.6f}")
    print()

    # HelixHash v1.0: append opaque bytes; library proves order + non-tampering only.
    # Observation metrics stay in the payload JSON (policy), not in the protocol API.
    # See https://github.com/Kaydeep0/helixhash / https://pypi.org/project/helixhash/1.0.0/
    h = HelixHash()
    plan = [
        ("SOFR rate", dI_sofr, sofr_live),
        ("BUIDL TVL", dI_buidl, buidl_live),
        ("ETH GitHub stars", dI_eth, eth_live),
    ]
    for label, delta_I, live in plan:
        payload = json.dumps(
            {
                "label": label,
                "delta_I": delta_I,
                "A": 1.0,
                "E": delta_I,
                "credibility": C_LIVE if live else C_FALLBACK,
                "live": bool(live),
            },
            separators=(",", ":"),
            sort_keys=True,
        ).encode("utf-8")
        h.append(payload)

    print(divider)
    print("  LOCAL CHAIN (HelixHash append-only log)")
    print(divider)
    print()
    print(f"  helixhash version: {HELIXHASH_VERSION}")
    for e in h.export():
        meta = json.loads(__import__("base64").b64decode(e["payload"]))
        print(f"  {e['index']}. {meta['label']:<18} {e['hash'][:16]}...")
    print()
    print(f"  Head hash:   {h.head}")
    print(f"  Entries:     {h.length}")
    print(f"  Chain valid: {h.verify()}")
    print("  (PT/G/Crossing removed in helixhash 1.0 — scoring is not protocol)")
    print()

    # Tamper check: mutate exported payload bytes while keeping old hashes.
    from base64 import b64decode, b64encode
    exported = h.export()
    raw = b64decode(exported[0]["payload"])
    exported[0]["payload"] = b64encode(raw + b"|tampered").decode("ascii")
    tampered = HelixHash.from_export(exported)
    tampered_ok = tampered.verify()
    restored_ok = h.verify()

    print("  Tamper check (run in this process, not a claim):")
    print(f"    mutated entry 0 payload -> verify() = {tampered_ok}")
    print(f"    original chain           -> verify() = {restored_ok}")
    print()
    print("  This is a toy chain, not the private engine vault.")
    print()

    latest = load_latest_commit()
    tx = latest.get("tx_hash") or ""

    print(divider)
    print("  HISTORICAL ON-CHAIN POINTER (Base)")
    print(divider)
    print()
    print("  The private engine commits vault fingerprints to GeniusFlowSettlement")
    print("  on Base when wallet, balance, and mirror gates pass. Not on a fixed")
    print("  public cadence, and not every parkash cycle.")
    print()
    print("  Latest commit listed in this demo bundle:")
    print(f"  Contract: {latest.get('contract')}")
    print(f"  Block:    {latest.get('block_number')}")
    print(f"  TX:       0x{tx[:16]}...{tx[-8:]}")
    print(f"  Time:     {latest.get('committed_at')}")
    if latest.get("n_crossings") is not None:
        print(f"  Crossings recorded with that commit: {latest.get('n_crossings')}")
    print(f"  Read from: {latest.get('source')}")
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
