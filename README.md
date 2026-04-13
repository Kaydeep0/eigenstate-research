## Try it in 5 minutes

```bash
pip install helixhash requests
python3 demo/eigenstate_demo.py
```

HelixHash source and documentation: https://github.com/Kaydeep0/helixhash

This runs three live observations (SOFR rate, BlackRock BUIDL TVL, Ethereum GitHub stars),
chains them cryptographically via SHA-256, and prints the fingerprint.
Then click the Basescan link to verify the same fingerprint is on a public blockchain.

That is the engine, demonstrated simply.

---

# Eigenstate Research

Measuring capital field dynamics in tokenized settlement. Every observation is hash-chained and committed to Base mainnet.

## What this is

Independent research on SOFR, RWA settlement, and the infrastructure underneath tokenized fixed income. The engine watches 197 entities across the tokenized settlement topology and measures structural gaps before they surface in market prices.

The measurement is not prediction. It is observation with a timestamp. The on-chain commit happens before external confirmation.

## How to verify any claim

Every published claim has an on-chain timestamp. The transaction hash in the article footer links directly to the specific transaction on Basescan. Example: https://basescan.org/tx/26a24d5aebcd2e15911618f6b5593956baf3d95e0fd05db6fb622779c0b5cbb4

All fact-check audit trails are public. The audit JSON for each article is committed alongside the article.

## Published research

- [Signal Reports](reports/) — entity-level field measurements
- [On-Chain Proof Index](onchain/) — every Base mainnet commit, verifiable

## Methodology

[METHODOLOGY.md](METHODOLOGY.md)

## Contact

- Paragraph: https://paragraph.com/@eigenstate
- GitHub: https://github.com/Kaydeep0/eigenstate-research
