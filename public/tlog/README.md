# Transparency log batch monitor

Generated 2026-08-23T11:01:32.381829+00:00 · probe v1.0.0 · digest `f312afab7d28f297`

The population, every verification key and where it came from, the limbs with their admit conditions and seven predictions were published before this batch at digest `78cb2f5444df2da2`, in an earlier commit.

## This node is a monitor. It is not a witness.

A witness holds a key, stays online, and cosigns a checkpoint to attest that it saw that tree head and no other at that size. A monitor holds no key, runs on a batch cadence, and re-derives: read a checkpoint, check the signature against a key obtained somewhere other than the log, read it again later, ask for a consistency proof between the two sizes, and recompute the second root from the first.

This node does the second thing. It cosigns nothing, it is on no witness list, and it does not claim to catch a split view served to somebody else and withdrawn before the next batch. Those are the things a batch monitor cannot do, and they are here rather than left for a reader to work out.

## What this batch found

- **23 of 23** logs served a checkpoint with no credentials.
- **22 of 23** checkpoint signatures verified against a key this monitor obtained from somewhere other than the log.
- **12 of 23** trees advanced between the two reads, adding 87187 entries in a 45 second window.
- **12 of 12** served consistency proofs recomputed to the root the log published.
- **0 of 23** trees shrank or served two roots at one size.
- **0 of 23** checkpoints carried a signature beyond the log's own.
- Disagreements recorded this batch: **0**.

## Cold start, stated plainly

This monitor holds a prior batch for 23 of 23 logs, because this is the first batch. Everything above is a within-batch result: two reads 45 seconds apart and the proof between them. Cross-run comparison starts from the next batch, and this run appended 46 checkpoints to the append only record it will compare against.

## The arithmetic is hand rolled, and it is self-tested first

This engine carries no cryptography library, so ECDSA over P-256, Ed25519 and the RFC 6962 consistency recomputation are implemented in pure Python in engine/bridge/tlog_monitor_probe.py.

Each verifier is self-tested with a positive and a negative case before the run is allowed to charge anybody, and the self-test result is published in the ledger. The Merkle self-test builds consistency proofs from the recursive definition in RFC 6962 section 2.1.2 and verifies them with the separate iterative algorithm, for every pair of sizes in an eight leaf tree, and also checks that a tampered proof is rejected.

- `merkle`: passed=True {"pairs_checked": 36, "positive_cases_passed": 36, "tampered_cases_rejected": 28, "root_at_size_8": "5dc9da79a70659a9ad559cb701ded9a2ab9d823aad2f4960cfe370eff4604328"}
- `ed25519`: passed=True {"vector": "RFC 8032 section 7.1 test 1", "positive_case_passed": true, "tampered_case_rejected": true}
- `ecdsa_p256`: passed=True {"tested_against": "ct.cloudflare.com/logs/nimbus2026", "positive_case_passed": true, "tampered_case_rejected": true}

A signature this monitor fails to verify is recorded as this monitor failing to verify it. It is not published as a claim that the log is wrong.

## Limbs

Chains are evaluated independently. A failure inside one chain stops that chain and does not touch the others, so a log whose signature scheme this monitor cannot read is still read, still compared across the two reads, and still counted.

- `log_listed_in_a_public_list` (MUST, read chain): ok 23, fail 0, not applicable 0, not reached 0
- `public_key_obtained_independently_of_the_log` (MUST, read chain): ok 22, fail 1, not applicable 0, not reached 0
- `checkpoint_endpoint_answers_without_credentials` (MUST, read chain): ok 23, fail 0, not applicable 0, not reached 0
- `checkpoint_parses_in_its_declared_format` (MUST, read chain): ok 23, fail 0, not applicable 0, not reached 0
- `checkpoint_carries_tree_size_and_root_hash` (MUST, read chain): ok 23, fail 0, not applicable 0, not reached 0
- `checkpoint_carries_a_signature` (MUST, read chain): ok 23, fail 0, not applicable 0, not reached 0
- `signature_scheme_supported_by_this_monitor` (SHOULD, verify chain): ok 22, fail 1, not applicable 0, not reached 0
- `signature_verifies_against_the_published_key` (MUST, verify chain): ok 22, fail 1, not applicable 0, not reached 0
- `second_read_answered` (MUST, rederive chain): ok 23, fail 0, not applicable 0, not reached 0
- `tree_did_not_shrink_between_reads` (MUST, rederive chain): ok 23, fail 0, not applicable 0, not reached 0
- `consistency_proof_served` (MUST, rederive chain): ok 12, fail 0, not applicable 11, not reached 0
- `consistency_proof_recomputes_to_the_second_root` (MUST, rederive chain): ok 12, fail 0, not applicable 11, not reached 0
- `checkpoint_carries_witness_cosignatures` (OBSERVED, observe chain): ok 0, fail 23, not applicable 0, not reached 0
- `prior_batch_checkpoint_on_record` (OBSERVED, observe chain): ok 23, fail 0, not applicable 0, not reached 0

## Where they refuse, and who the refusal belongs to

- `public_key_obtained_independently_of_the_log`: strongest failing limb for 1 of 23

- `public_key_obtained_independently_of_the_log:only_key_source_read_is_the_log_itself`: 1

- attributed to `ecosystem`: 1

## Predictions, scored

- met (blind): Every log in the population serves a checkpoint over plain HTTPS with no credentials of any kind. Observed: 23 of 23 logs served a checkpoint with no credentials.
- met (blind): Every Certificate Transparency checkpoint signature verifies against the key published in the log list, using the verifier implemented in this repository. Observed: 21 of 21 Certificate Transparency signatures verified.
- met (blind): No tree in the population shrinks between the two reads in this batch. Observed: 0 of 23 trees shrank or served two roots at one size.
- met (blind): Every consistency proof this monitor requests recomputes to the second root the log published. Observed: 12 of 12 served proofs recomputed to the second root.
- met (blind): Fewer than half the checkpoints in the population carry a witness cosignature beyond the log's own signature. Observed: 0 of 23 checkpoints carried a witness cosignature.
- missed (not blind): This monitor holds no prior batch for any log, because this is the first batch, so the cross run comparison refuses for every log in the population. Observed: 23 of 23 logs had a prior batch on record.
  - Written after the batch of 2026-08-02T05:43:57.760810+00:00, which observed 23 of 23 logs had a prior batch on record: This prediction was written for the first batch and it was right for the first batch. On every batch after that it is wrong by construction, because the cold start it described is over: this monitor now holds a prior checkpoint for all 23 logs and the cross run comparison no longer refuses for a lack of history. The line is left in the frozen prediction set and left scored as missed rather than retired, because retiring a prediction the moment it stops flattering the run is the habit this ledger exists to avoid. Read it as a dated statement that has since been overtaken.
- missed (not blind): At least one log in the population refuses a re-derivation limb for a reason that belongs to this monitor rather than to the log. Observed: 0 of 23 logs refused for a reason attributed to this monitor.
  - Written after the batch of 2026-08-02T05:34:50.807043+00:00, which observed 0 of 23 logs refused for a reason attributed to this monitor: This missed, and it missed for two separate reasons that are worth keeping apart. The prediction was operationalised as the headline refusal attribution, which is the single strongest failing limb, rather than as any limb on any log. A probe attributed refusal does exist in this batch: Rekor's checkpoint uses a note signature scheme this monitor has not implemented, and that limb refuses with the refusal charged to this monitor. It is not the headline for Rekor because a MUST limb fails first, and it is not a re-derivation limb, which is what the prediction named. The second reason is the one the prediction was really about: the Go checksum database was expected to refuse a re-derivation limb because this monitor cannot reconstruct tile based proofs, and its tree did not advance during the forty five second window, so that limb was never reached. A quiet log did not exercise the gap the prediction pointed at. Neither the scorer nor the window was changed after seeing this.
  - Written after the batch of 2026-08-02T05:43:57.760810+00:00, which observed 0 of 23 logs refused for a reason attributed to this monitor: Missed again on the second batch, for the same structural reason and with one new fact worth recording against this monitor. The Go checksum database did move between the two batches, from tree size 58590582 to 58590854, so the advance the first note said never happened has now happened. This monitor still did not ask for a proof of it, because the consistency limbs are scoped to the two reads inside a single batch and the cross batch pair is only recorded, never proven. That is a real gap in the monitor and not a property of the log: the strongest check a batch monitor can run is exactly the one across batches, and this version does not run it. It is named here rather than added quietly, because the limb order is frozen in the expectations file and widening it belongs to a new probe version with its own expectations committed first.

## Per log

- `ct.cloudflare.com/logs/nimbus2026`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct.cloudflare.com_logs_nimbus2026.json
- `ct.cloudflare.com/logs/nimbus2027`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct.cloudflare.com_logs_nimbus2027.json
- `sphinx.ct.digicert.com/2026h2`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/sphinx.ct.digicert.com_2026h2.json
- `sphinx.ct.digicert.com/2027h1`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/sphinx.ct.digicert.com_2027h1.json
- `sphinx.ct.digicert.com/2027h2`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/sphinx.ct.digicert.com_2027h2.json
- `wyvern.ct.digicert.com/2026h2`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/wyvern.ct.digicert.com_2026h2.json
- `wyvern.ct.digicert.com/2027h1`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/wyvern.ct.digicert.com_2027h1.json
- `wyvern.ct.digicert.com/2027h2`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/wyvern.ct.digicert.com_2027h2.json
- `ct.googleapis.com/logs/eu1/xenon2026h2`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct.googleapis.com_logs_eu1_xenon2026h2.json
- `ct.googleapis.com/logs/eu1/xenon2027h1`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct.googleapis.com_logs_eu1_xenon2027h1.json
- `ct.googleapis.com/logs/us1/argon2026h2`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct.googleapis.com_logs_us1_argon2026h2.json
- `ct.googleapis.com/logs/us1/argon2027h1`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct.googleapis.com_logs_us1_argon2027h1.json
- `sum.golang.org`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/sum.golang.org.json
- `elephant2026h2.ct.sectigo.com`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/elephant2026h2.ct.sectigo.com.json
- `elephant2027h1.ct.sectigo.com`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/elephant2027h1.ct.sectigo.com.json
- `elephant2027h2.ct.sectigo.com`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/elephant2027h2.ct.sectigo.com.json
- `tiger2026h2.ct.sectigo.com`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/tiger2026h2.ct.sectigo.com.json
- `tiger2027h1.ct.sectigo.com`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/tiger2027h1.ct.sectigo.com.json
- `tiger2027h2.ct.sectigo.com`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/tiger2027h2.ct.sectigo.com.json
- `rekor.sigstore.dev`: refuse `public_key_obtained_independently_of_the_log:only_key_source_read_is_the_log_itself` · receipt https://geniusflow-federation.vercel.app/tlog/receipts/rekor.sigstore.dev.json
- `ct2026-a.trustasia.com/log2026a`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct2026-a.trustasia.com_log2026a.json
- `ct2026-b.trustasia.com/log2026b`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/ct2026-b.trustasia.com_log2026b.json
- `hetu2027.trustasia.com/hetu2027`: admit · receipt https://geniusflow-federation.vercel.app/tlog/receipts/hetu2027.trustasia.com_hetu2027.json

## Read it yourself

- Expectations, published first: https://geniusflow-federation.vercel.app/tlog/expectations.json
- Full ledger with every receipt: https://geniusflow-federation.vercel.app/tlog/ledger.json
- Headline only: https://geniusflow-federation.vercel.app/tlog/summary.json
- One log: https://geniusflow-federation.vercel.app/tlog/receipts/<LOG_KEY>.json
- Same numbers laid out for reading: https://kaydeep0.github.io/eigenstate-research/tlog/

## Re-run it

```bash
PYTHONPATH=engine python3 engine/tools/tlog_monitor_run.py expect
PYTHONPATH=engine python3 engine/tools/tlog_monitor_run.py run
PYTHONPATH=engine python3 engine/tools/tlog_monitor_export.py
```

## Prior art

- [RFC 6962, Certificate Transparency](https://www.rfc-editor.org/rfc/rfc6962): Defines the signed tree head, the get-sth and get-sth-consistency endpoints this monitor calls, the TreeHeadSignature input it reconstructs, and the consistency proof verification algorithm it implements.
- [RFC 9162, Certificate Transparency version 2.0](https://www.rfc-editor.org/rfc/rfc9162): Restates the same Merkle constructions and is explicit about the separation between logs, monitors and auditors that this ledger relies on.
- [C2SP signed note and tlog checkpoint](https://github.com/C2SP/C2SP/blob/main/signed-note.md): The text checkpoint format the Go checksum database and Sigstore serve, which this monitor parses: origin line, tree size, base64 root hash, blank line, signature lines.
- [C2SP tlog-witness](https://github.com/C2SP/C2SP/blob/main/tlog-witness.md): The witness protocol this node deliberately does not implement. A witness cosigns with a key and this node holds none.
- [transparency.dev](https://transparency.dev/): The ecosystem this work sits inside, and the source of the witness and monitor distinction the ledger is built around.
- [Sigsum](https://www.sigsum.org/): A log design where witness cosigning is mandatory rather than optional, which is the contrast that makes counting cosignatures on other logs worth doing.
- [Go checksum database design](https://go.dev/design/25530-sumdb): The tile based transparent log this monitor reads a checkpoint from and cannot yet prove consistency over.

## What this is not

- This node is a monitor, not a witness. It holds no key, cosigns nothing, and appears on no witness list. Nothing in this ledger is an attestation anybody else can rely on.
- A batch monitor cannot see a split view that is served to one reader and withdrawn before the next batch. It sees the log at the instants it reads it and says nothing about the gaps between them.
- A signature this monitor fails to verify is recorded as this monitor failing to verify it. The verifiers here are hand rolled in pure Python because this engine carries no cryptography library, and a hand rolled verifier that disagrees with a log operated by Google is overwhelmingly more likely to be the broken party.
- This is not coverage of the transparency log ecosystem. The population is a frozen list drawn from public log lists, and no rate here should be read as a rate over all logs.
- No log was contacted beyond plain GETs of endpoints that are already public, with an identifying user agent.

## What this is not, added after the expectations were frozen

These were not in the expectations file. They are kept separate rather than folded into the list above, because editing a frozen list after the fact would defeat the reason for freezing it.

- Added 2026-08-02, raised while researching this ecosystem's terms of art, after the expectations for this ledger were already committed: Two components this node publishes elsewhere carry names that are terms of art here, and neither is what the name suggests to a reader arriving from this community. `witnessfield` is not an implementation of the C2SP tlog-witness protocol and issues no cosignature. `helixhash` is a hash chain, which is tamper evident only to a verifier willing to replay the whole chain, and it is not an RFC 6962 Merkle tree: it offers no inclusion proof, no consistency proof and no efficient evidence against equivocation. Both names predate this ledger. They are disambiguated here rather than defended, because a page that spends its length separating a monitor from a witness should not leave its own naming to be guessed.
