# Hacker News submission, ERC-8004 refusal ledger

Day 3 to 7, after the Ethereum Magicians thread has had time to run. Host submits
manually. Submit the link, then post the first comment immediately from the same account.

Do not post this the same day as the Magicians reply. If the Magicians thread produced a
reply worth reading, link it in the first comment; if it did not, drop that line rather
than pretending it did.

---

**Submission type:** link post, not text post.

**URL:** https://kaydeep0.github.io/eigenstate-research/erc8004/

**Title:** 73% of sampled ERC-8004 agent registrations on Base fail a MUST limb

Alternates, if the above reads as too clickbait for the guidelines:

- Show HN: A refusal ledger for ERC-8004 agent registrations on Base
- Fetching what 500 on-chain AI agent identities actually point at

---

**First comment, post immediately after submitting:**

Author here. Prior art before my numbers, because this is a reproduction, not a
discovery.

Xiong et al., "Can Trustless Agents Be Trusted?" (arXiv 2606.26028), crawled the full
ERC-8004 Identity Registry population on Ethereum, BSC and Base through 13 May 2026. On
Base they report 37% of agents with no agentURI and 26.9% carrying a valid registration
file. Mafrur and Khusumanegara (arXiv 2606.12128) find the same shape on Ethereum from a
different dataset.

I drew 500 of the 60,444 agents registered on Base at a pinned block, uniform without
replacement, seeded by that block's hash, and fetched what each one points at. I get
34.8% with no agentURI (95% CI 30.8 to 39.1) against their 37%, and 27.0% clearing every
MUST limb against their 26.9% valid registration files. Different method, three months
later, same answer. That agreement is the actual result here.

What I could not find published was the artifact under the rate, so that is what this
page is:

- The sample is redrawable by a stranger:
  `random.Random(int(pinned_block_hash[-16:], 16)).sample(range(1, N + 1), 500)`. The seed
  is a public block hash, so you get the identical id set with nothing from me, and every
  check after that is a plain GET.
- Six limbs in a frozen order, so a refusal names the limb that failed first rather than
  returning a verdict: URI resolves, body parses, schema declares the registration type
  with a service list, file points back at its own agentId, declared endpoint answers,
  well-known domain proof.
- 95% Wilson interval on every rate.
- One receipt per sampled agentId with the exact HTTP status or transport error, so you
  can overturn any single agent without arguing about the aggregate:
  `curl -sS https://geniusflow-federation.vercel.app/erc8004/receipts/1.json | jq '{agent_id, refuse_limb, limbs}'`

Limitations, since they will come up anyway:

- One fetch, one moment, one network vantage point. A transient outage reads as a
  refusal. That is why the receipt records the status and the run is repeatable.
- `absent` and `not_applicable` never count against an agent. The ERC marks the domain
  proof optional, and an agent that declares no HTTP endpoint cannot fail a liveness
  check.
- The self-reference limb is scored SHOULD, not MUST, and is excluded from the 73%
  headline, because the ERC's own text is ambiguous about whether it is normative. That
  ambiguity is the spec question I raised on Ethereum Magicians.
- IPFS is read through public gateways, so a gateway failure is reported separately from
  a publisher failure.
- Base only, one registry, 0.8% of the population. Not a reputation score, no ranking.
- Most of the miss rate is empty agentURIs: people reserving an identity before they
  deploy anything. That is legitimate behaviour, and the registry currently cannot
  distinguish it from a live agent, which is the more interesting problem.

The node that ran this holds no ERC-8004 agentId of its own and says so in its own
registration file, so it is not in its own sample.

---

**Reply discipline:**

- Answer the method questions. Do not pitch anything.
- If someone finds a wrong receipt, thank them, re-fetch that agentId in public, and say
  what the second fetch returned even if it makes the number worse.
- No links beyond the ledger, the two arXiv papers, the receipts endpoint, and the
  Magicians thread if it has a real reply in it.
- If asked what else the site does, one sentence and one link, in a reply, not unprompted.
