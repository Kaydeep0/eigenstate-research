# Show HN post

Sequencing note: post to Ethereum Magicians first, on the ERC-8004 spec thread, and let
that thread run for a few days before this goes to HN. The Magicians reply is the one
that has a chance of changing the spec; HN is the wider audience and is better with a
live thread to point at. Draft of the Magicians reply: `docs/launch/ETHEREUM_MAGICIANS_ERC8004.md`.
HN first comment, to paste immediately after submitting: `docs/launch/HN_ERC8004.md`.

---

**Title:** Show HN: A refusal ledger for ERC-8004 agent registrations on Base

**Body:**

ERC-8004 gives an AI agent an on-chain identity that points at an off-chain registration
file. I sampled 500 of the 60,444 agents registered on Base at a pinned block and fetched
what each one actually points at. 73.0% fail at least one limb the ERC states as MUST
(95% CI 68.9 to 76.7). 34.8% hold an identity with no agentURI at all.

Prior art first, because this is not a new finding. Xiong et al., "Can Trustless Agents
Be Trusted?" (arXiv 2606.26028), crawled the full Identity Registry population on
Ethereum, BSC and Base through 13 May 2026 and report 37% of Base agents with no
agentURI and 26.9% carrying a valid registration file. Mafrur and Khusumanegara (arXiv
2606.12128) reach the same shape on Ethereum from a different dataset. My sample reads
34.8% and 27.0% on the two comparable numbers, three months later, by a different method.
The agreement is the point. I set out to check whether a published rate reproduces, and
it does.

What I could not find published anywhere was the artifact underneath the rate, which is
what I actually built:

- The sample is redrawable by a stranger. agentIds are drawn with
  `random.Random(int(pinned_block_hash[-16:], 16)).sample(range(1, N + 1), 500)`, so the
  seed is a public block hash and you regenerate the identical id set with nothing from
  me. Every check after that is a plain GET, so the whole run is reproducible without my
  code.
- The limbs are frozen and ordered, so a refusal names the limb that failed first rather
  than returning a general verdict. Six limbs: URI resolves, body parses, schema declares
  the ERC-8004 registration type with a service list, file points back at its own agentId,
  declared endpoint answers, well-known domain proof.
- Every rate carries a 95% Wilson interval.
- Every sampled agentId has a receipt with the exact HTTP status or transport error, so
  you can re-run one agent and disagree with me about that agent specifically.

Ledger, with the tables and the method in prose:
https://kaydeep0.github.io/eigenstate-research/erc8004/

Machine readable, every receipt:
https://geniusflow-federation.vercel.app/erc8004/ledger.json

One agent:

```
curl -sS https://geniusflow-federation.vercel.app/erc8004/receipts/1.json | jq '{agent_id, refuse_limb, limbs}'
```

Limits I would raise myself. It is one fetch at one moment from one network vantage
point, so a transient outage reads as a refusal; that is why the receipt records the
status and the run is repeatable. `absent` and `not_applicable` never count against an
agent, because the ERC marks the domain proof optional and an agent that declares no HTTP
endpoint cannot fail a liveness check. IPFS is read through public gateways, so a gateway
failure is reported separately from a publisher failure. This is not a reputation score
and it does not rank agents. It is Base only, one registry, one sample.

This node holds no ERC-8004 agentId of its own and says so in its own registration file,
so it is not in its own sample.

---

**What to expect in comments:**

- "This has already been measured." Yes, and the post says so in the second paragraph
  with both citations. Reply: the contribution is a reproduction by a different method
  plus the re-runnable probe and per-agent receipts, not the headline rate.

- "73% is a scary number for a spec that just shipped." Reply honestly: most of it is
  empty agentURIs, which is people reserving an identity before they deploy anything.
  That is legitimate behaviour the registry cannot currently distinguish from a live
  agent, which is the actual spec problem and is what the Magicians reply asks about.

- "Your self-reference limb is stricter than the spec." Fair, and it is reported at
  SHOULD, not MUST, and excluded from the MUST headline for exactly that reason. The
  ERC prints `registrations` under a MUST structure and then demotes it for ERC-721
  tooling compatibility, which is the ambiguity the Magicians question is about.

- "Sample of 500 out of 60k?" 0.8%, uniform without replacement, seeded publicly. The
  Wilson intervals are on every number and are wide enough to be honest. A larger draw
  from the same pinned block is a one-line change to the seed range, and anyone can make
  it: the seed and the limb definitions are published, the fetch is a plain GET.

- "What is Eigenstate?" A measurement engine that publishes its refusals. Answer briefly,
  link the methodology page, do not pitch. The probe stands or falls on its own.
