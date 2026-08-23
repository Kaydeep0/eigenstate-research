# Measured ledgers, and every time each one was published

Generated 2026-08-23T16:35:21.932442+00:00 · tool ledger_refresh v1.0.0 · digest `94c684a029085d10`

A ledger published once is a snapshot dressed as a standing claim. This page is the
correction: one row per publication, kept append only, so a reader can see whether a
number held when the same probe was pointed at the same population a second time.

5 ledgers indexed · 17 runs on record ·
0 still have a single run and are labelled as snapshots ·
4 headline counters moved on the latest refresh,
of which 2 rate comparisons still have overlapping intervals.

A counter can move while the published 95 percent intervals of the two runs still overlap. That is a move this measurement cannot distinguish from sampling noise, and it is counted separately here so a re-run is not mistaken for a finding.

## What this index cannot do

Not a measurement of its own. This index does not fetch any subject, does not score any ledger and cannot make a refusal disappear. If a ledger is wrong, it is wrong here too, twice, with both digests shown.

## Ledgers

### ERC-8004 Base refusal ledger

`/erc8004/` · unit of measurement: one sampled registration · 2 run(s) on record

| run | generated at | probe | digest | headline counters |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-02T03:11:04.127287+00:00 | 1.0.0 | `ab79fc3924f1` | full_admit 45, full_refuse 455, must_admit 135, must_refuse 365 |
| 2 | 2026-08-02T05:48:10.056391+00:00 | 1.0.0 | `f01dd0580950` | full_admit 56, full_refuse 444, must_admit 143, must_refuse 357 |

Comparing two runs of this ledger: Two runs of this ledger are two samples, not two looks at the same set. Each run pins a fresh Base block and draws 500 agent ids seeded by that block hash, from a registry that keeps growing, so the rows compared here overlap only by chance. A count that moves by single digits is sampling noise before it is news. The published rate and its 95 percent interval are the comparison that means something, and they are shown below the counts.

Moved on the latest refresh:

* `must_admit` up from 135 to 143 (+8)
* `must_refuse` down from 365 to 357 (-8)
* `full_admit` up from 45 to 56 (+11)
* `full_refuse` down from 455 to 444 (-11)

What the rates and their intervals say about that move:

* `must_miss_rate` 0.73 [0.689441, 0.767052] then 0.714 [0.672876, 0.751861], and the two 95 percent intervals overlap, so this run does not establish that the underlying rate moved at all
* `full_miss_rate` 0.91 [0.88169, 0.932058] then 0.888 [0.857346, 0.912738], and the two 95 percent intervals overlap, so this run does not establish that the underlying rate moved at all

Human page: https://kaydeep0.github.io/eigenstate-research/erc8004/

Machine summary: https://geniusflow-federation.vercel.app/erc8004/summary.json

Re-run it yourself:

```
PYTHONPATH=engine python3 engine/tools/erc8004_probe_run.py --sample 500
```

### SLSA and PEP 740 census of this node's own dependencies

`/slsa/` · unit of measurement: one resolved distribution · 2 run(s) on record

| run | generated at | probe | digest | headline counters |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-02T03:44:42.624241+00:00 | 1.0.0 | `1fa8727b43a7` | full_admit 0, full_refuse 94, must_admit 44, must_refuse 50 |
| 2 | 2026-08-02T05:44:04.783517+00:00 | 1.0.0 | `0c23b0305508` | full_admit 0, full_refuse 94, must_admit 44, must_refuse 50 |

Comparing two runs of this ledger: A census, not a sample: both runs cover every distribution pip resolves for this node's requirements file. A count that moves is a real change in what PyPI served or in what the requirements resolve to, and neither is noise.

The headline counters did not move between the last two runs. The digests still differ because timestamps and per row detail differ.

What the rates and their intervals say about that move:

* `must_refuse_rate` 0.5319 then 0.5319, published without an interval
* `full_refuse_rate` 1.0 then 1.0, published without an interval

Human page: https://kaydeep0.github.io/eigenstate-research/slsa/

Machine summary: https://geniusflow-federation.vercel.app/slsa/summary.json

Re-run it yourself:

```
/tmp/slsa_venv/bin/python engine/tools/slsa_provenance_run.py run
```

### Real world asset disclosure interface survey

`/rwa/` · unit of measurement: one issuer · 3 run(s) on record

| run | generated at | probe | digest | headline counters |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-02T04:34:38.790773+00:00 | 1.0.2 | `ce9c3eb42c04` | full_admit 0, full_refuse 17, must_admit 2, must_refuse 15 |
| 2 | 2026-08-02T05:43:24.872498+00:00 | 1.0.2 | `e4d5d4e38e70` | full_admit 0, full_refuse 17, must_admit 2, must_refuse 15 |
| 3 | 2026-08-04T06:40:35.489850+00:00 | 1.0.2 | `284402e11fbf` | full_admit 0, full_refuse 17, must_admit 2, must_refuse 15 |

Comparing two runs of this ledger: The population is frozen in the expectations file and identical across runs, so a count that moves is an issuer that changed what it serves. Still not a sector rate: the population is what this node already tracks.

The headline counters did not move between the last two runs. The digests still differ because timestamps and per row detail differ.

What the rates and their intervals say about that move:

* `must_refuse_rate` 0.8824 then 0.8824, published without an interval

Human page: https://kaydeep0.github.io/eigenstate-research/rwa/

Machine summary: https://geniusflow-federation.vercel.app/rwa/summary.json

Re-run it yourself:

```
PYTHONPATH=engine python3 engine/tools/rwa_disclosure_run.py run
```

### EDGAR and Federal Reserve grounded claim corpus

`/grounded-claims/` · unit of measurement: one claim · 5 run(s) on record

| run | generated at | probe | digest | headline counters |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-02T05:20:17.615362+00:00 | 1.0.1 | `20b2faf73e04` | full_admit 0, full_refuse 6, must_admit 5, must_refuse 1 |
| 2 | 2026-08-02T05:42:58.920879+00:00 | 1.0.1 | `5df1c68a86bd` | full_admit 0, full_refuse 6, must_admit 5, must_refuse 1 |
| 3 | 2026-08-14T03:05:13.741183+00:00 | 1.0.1 | `0c23eaf6a9e0` | full_admit 0, full_refuse 6, must_admit 5, must_refuse 1 |
| 4 | 2026-08-14T20:35:22.772189+00:00 | 1.0.1 | `5e2838ca3605` | full_admit 0, full_refuse 6, must_admit 5, must_refuse 1 |
| 5 | 2026-08-16T11:00:12.946222+00:00 | 1.0.1 | `d94b8706ffad` | full_admit 0, full_refuse 6, must_admit 5, must_refuse 1 |

Comparing two runs of this ledger: The corpus is frozen in the expectations file and identical across runs, so a count that moves is a regulator page that changed under a citation this node already made.

The headline counters did not move between the last two runs. The digests still differ because timestamps and per row detail differ.

Human page: https://kaydeep0.github.io/eigenstate-research/grounded-claims/

Machine summary: https://geniusflow-federation.vercel.app/grounded-claims/summary.json

Re-run it yourself:

```
PYTHONPATH=engine python3 engine/tools/grounded_claim_run.py run
```

### Transparency log batch monitor

`/tlog/` · unit of measurement: one log · 5 run(s) on record

| run | generated at | probe | digest | headline counters |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-02T05:34:50.807043+00:00 | 1.0.0 | `ed5ebec4afeb` | full_admit 22, must_admit 22, must_refuse 1 |
| 2 | 2026-08-02T05:43:57.760810+00:00 | 1.0.0 | `2fac8d589132` | full_admit 22, must_admit 22, must_refuse 1 |
| 3 | 2026-08-02T05:43:57.760810+00:00 | 1.0.0 | `1e9ae859e742` | full_admit 22, must_admit 22, must_refuse 1 |
| 4 | 2026-08-23T11:01:32.381829+00:00 | 1.0.0 | `f312afab7d28` | full_admit 22, must_admit 22, must_refuse 1 |
| 5 | 2026-08-23T16:35:21.734897+00:00 | 1.0.0 | `1776c0a62e41` | full_admit 22, must_admit 22, must_refuse 1 |

Comparing two runs of this ledger: The same 23 logs every batch, so counts are directly comparable. What is not comparable is the cold start: the first batch held no prior checkpoint for any log and every batch after it does, which changes what some limbs can even reach.

The headline counters did not move between the last two runs. The digests still differ because timestamps and per row detail differ.

Human page: https://kaydeep0.github.io/eigenstate-research/tlog/

Machine summary: https://geniusflow-federation.vercel.app/tlog/summary.json

Re-run it yourself:

```
PYTHONPATH=engine python3 engine/tools/tlog_monitor_run.py run
```

## The rule this page follows

A row is appended when a ledger publishes a digest this file has not recorded before. Prior rows are never edited or removed, including when a later run makes an earlier one look bad.

A change in a headline counter between two runs is a change in what the world served, in what the probe asked, or in the probe itself. The probe version sits on every row so the third case can be ruled out before the first two are argued.

## Machine readable

* Index: https://geniusflow-federation.vercel.app/ledgers/index.json
* Raw rows: https://geniusflow-federation.vercel.app/ledgers/runs.jsonl

