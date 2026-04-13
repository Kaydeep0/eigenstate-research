# Methodology

## The core equation

**E = ΔI / A**

E is information efficiency. ΔI is the change in mutual information between an entity's observed state and the structural field it participates in. A is the activation threshold — the minimum signal required for the observation to count as real.

In plain terms: the engine measures how much new information each entity generates per unit of structural change. High E means the entity is producing signal that isn't yet priced into the surrounding field. Low E means the entity is moving with the field, not driving it.

This is not a financial metric. It is a structural one. The field is the topology of obligations, permissions, and settlement dependencies between 197 entities in the tokenized fixed income ecosystem.

## The vault

Every observation that passes the activation threshold gets written to the vault. The vault is an append-only chain of field measurements. Each record contains:

- Entity codename and display name
- Timestamp of observation
- φ_S (signal pressure): how much the entity deviates from field equilibrium
- κ (coherence): how internally consistent the entity's signals are
- E (information efficiency) at time of observation
- SHA-256 hash of the record, chained to the previous record

The chaining is what makes the vault a proof layer rather than just a log. If any historical record is modified, every subsequent hash fails validation. The vault's integrity can be checked at any time.

## The helix commit

After each parkash cycle, the engine computes a fingerprint of the entire vault state and commits it to Base mainnet. The fingerprint is a SHA-256 hash of:

- All vault records since the last commit
- The number of Landauer crossings (threshold passages) in the cycle
- The cycle timestamp

Why Base mainnet? Because the block timestamp is immutable and publicly verifiable. Any claim about the state of the field at a given time can be verified against the on-chain fingerprint.

How to verify: find the block number in the article footer, look it up at basescan.org/block/[number], confirm the block exists at the stated time.

The vault is at: [On-Chain Proof Index](onchain/)

## The fact-checker

Every article goes through a three-tier confidence system before publication:

**Tier 1 (confidence >= 0.90): Block**
If the fact-checker determines a claim is wrong with high confidence, the article is blocked. It cannot enter the dispatch queue. The specific wrong claim, the correct value, and the reasoning are written to an audit JSON file.

**Tier 2 (confidence 0.60-0.89): Flag for review**
If the fact-checker flags a claim as possibly wrong but isn't highly confident, the article enters the dispatch preview with a warning. A human must approve the flagged claim before publication by providing a source URL.

**Tier 3 (confidence < 0.60): Log only**
Low-confidence disputes are recorded in the audit trail but do not block or flag the article. The claim is treated as unverifiable.

Audit files are written to `data/fact_checks/` and include every claim extracted, its verification status, confidence score, and reasoning.

## The topology

The engine monitors 197 entities across nine categories:

- Regulatory bodies (SEC, OCC, ESMA, BIS, FSB, FRB)
- Settlement infrastructure (DTCC, Euroclear, DTC, Tri-party repo operators)
- Tokenized product issuers (BlackRock BUIDL, Ondo OUSG, Franklin BENJI, WisdomTree WTGXX)
- Custody and prime brokerage (BNY Mellon, State Street, JPMorgan)
- Market infrastructure (Coinbase, Base, Ethereum validator set)
- Benchmark infrastructure (NY Fed SOFR publication chain)
- Jurisdiction frameworks (US, EU, UK post-Brexit)
- Capital allocators (institutional treasury desks, money market funds)
- Emerging settlement layers (Canton Network, DTCC tokenization)

Each entity has a field state: φ_S (signal pressure), κ (coherence), coverage level, and a set of directional observations updated each parkash cycle.

## The gap detector

The engine looks for entities that are structurally necessary but not yet priced as such. LIBOR_EQUIVALENT (the benchmark gap) was identified this way: the field showed that SOFR-linked tokenized products were treating overnight rate exposure as equivalent to term rate exposure, which is structurally false.

The gap detector measures the distance between what a topology requires to function correctly and what the current pricing and product design assumes. When that distance is large and persistent, it is a structural gap.

The SOFR three-body problem — the coupling between the overnight benchmark, Treasury issuance velocity, and tokenized settlement mechanics — is the current most significant structural gap in the monitored topology.
