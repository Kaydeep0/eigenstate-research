# Ethereum Magicians reply, ERC-8004

Post as a reply on the canonical ERC-8004 discussion thread, the one named as the
Discussion Link in the EIP itself:

https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098

One reply, once. Nothing below this line changes; paste the body verbatim.

Not posted by the agent: the browser session was signed out at the time of writing, so
this was left paste ready rather than posted from an unauthenticated session. The thread
was live and had a reply within the last day when this was checked, so it is worth
skimming the tail before posting in case one of the two questions below has already been
answered.

Rules for this post, so a later edit does not drift:

- Prior art is cited before any number of mine.
- The only link is the ledger page. No homepage, no Eigenstate product, no pilot form,
  no coin, no HelixHash.
- It ends on a spec question, because that is the only reason to be in that thread.
- If someone asks what Eigenstate is, answer in one sentence and link the methodology
  page, in a reply, not in this post.

---

**Body:**

Adding a data point on registration quality, and a spec question that comes out of it.

Prior art first. Xiong et al., "Can Trustless Agents Be Trusted? An Empirical Study of
the ERC-8004 Decentralized AI Agent Ecosystem" (arXiv 2606.26028), crawled the full
Identity Registry population on Ethereum, BSC and Base through 13 May 2026. On Base they
report 37% of agents with no agentURI, 26.9% carrying a valid ERC-8004 registration file,
and 15% exposing a valid file with at least one declared service. Mafrur and
Khusumanegara (arXiv 2606.12128) find the same shape on Ethereum from a different
dataset.

I ran an independent check by a different method and a later sample, mostly to see
whether those numbers reproduce. They do. 500 agentIds drawn uniformly without
replacement from the 60,444 registered on Base at block 49,425,346, seeded by that
block's hash so the id set is redrawable from public data:

- 34.8% hold an on-chain identity with no agentURI at all (95% CI 30.8 to 39.1). Their
  Base figure is 37%.
- 27.0% clear every limb the ERC states as MUST, meaning the URI resolved, the body
  parsed as JSON, and the document declared the registration type with a service list.
  Their valid-registration-file figure for Base is 26.9%.
- 43.2% did not dereference to any body at all (95% CI 38.9 to 47.6), counting empty
  URIs plus dead hosts, 404s and strings that are not URIs.
- Of the 275 files that parsed, 135 did not declare the ERC-8004 registration type and
  174 carried no `registrations` array.

Two independent methods, three months apart, landing within a point of each other on the
two comparable figures. I read that as the finding being solid rather than as anything
new from me.

Full ledger, every limb reported separately, one receipt per sampled agentId with the
exact HTTP status or transport error:
https://kaydeep0.github.io/eigenstate-research/erc8004/

Now the spec question, which is the reason I am posting here rather than anywhere else.

The ERC prints `registrations` inside a registration-file structure introduced as a MUST,
and then demotes several of those top-level fields to SHOULD for ERC-721 tooling
compatibility. That leaves the self-reference case genuinely ambiguous: a file fetched
from agentId N that contains no `registrations` entry pointing back at N, or that points
at a different identity entirely. In my sample, 229 of the 275 files that parsed fail
that check. For 89 of them it is the only limb they fail: 81 carry no `registrations`
entry at all, and 8 carry entries that do not match the on-chain identity the file was
read from.

I scored that limb as SHOULD and kept it out of the MUST headline, because I could not
convince myself the text makes it normative. But the consequence of it being non-normative
is that nothing in the standard binds a registration file to the identity that points at
it, so a file can be reused across identities, or point at an identity its owner does not
control, and still be conformant.

Two questions:

1. Is `registrations` intended to be normative for self-reference, so that a conformant
   file fetched from agentId N must contain an entry naming N on the chain it was read
   from? If yes, the demotion to SHOULD may need narrowing so it covers presentational
   fields only. If no, it would help to say explicitly that the binding is not checked,
   so implementers do not assume it.

2. Is there appetite for a single canonical liveness predicate in the spec? Xiong et al.
   raise the same point from their side: the signals already exist, URI resolves and file
   is compliant, but the standard defines no one test, so every consumer implements a
   different heuristic or skips the check. Most of the miss rate above is empty agentURIs,
   which is people reserving an identity before deploying anything. That is legitimate,
   and today the registry cannot distinguish it from an agent that is actually live. One
   named predicate would let discovery tooling hide reserved identities without each
   client inventing its own rule.

Happy to re-run against a different block, a larger sample, or a different limb
definition if either would be more useful to the discussion. The receipts are per agentId,
so disagreements can be settled one agent at a time rather than in the aggregate.

---

**If asked "what is this / who are you":**

One sentence, then stop: it is a read-only conformance probe published as a refusal
ledger by a measurement node that holds no ERC-8004 agentId of its own and says so in its
own registration file. Method:
https://kaydeep0.github.io/eigenstate-research/erc8004/

**If asked about the 89 self-reference failures specifically:**

Point at the ledger and offer the receipt lookup:
`https://geniusflow-federation.vercel.app/erc8004/receipts/<agentId>.json`

**Do not:**

- Post more than once in the thread unprompted.
- Cross-link the homepage, the pilot form, the writer coin, or HelixHash.
- Describe the numbers as new. They are a reproduction.
