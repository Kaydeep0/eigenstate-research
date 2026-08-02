# ERC-8004 Base registration probe

Generated 2026-08-02T03:11:04.127287+00:00 · probe v1.0.0 · digest `ab79fc3924f1e611`

Explorers already list and score the agents registered under ERC-8004. What nobody
publishes is the share of registrations that resolve to nothing, so a dead entry and a
working one look identical until you fetch them. This is that ledger: every refusal,
named by the limb that failed.

## What was measured

- Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` on `eip155:8453` (contract `name()` returns `AgentIdentity`)
- Pinned block: `49425346` · hash `0x97014cd4dc754208212af9ba955c98ad78a73aa0696085e71fa3ac483827cdef`
- Agents registered at that block: **60,444**
- Sampled: **500** (0.8% of the population), uniform without
  replacement, seeded by the pinned block hash so anyone can redraw the same ids

## Headline

- **34.8%** of sampled agents hold an on-chain identity with no agentURI at
  all (95% CI 30.8% to 39.1%). Nothing was fetched and nothing can be
  disputed: the registry returns an empty string, so there is no registration file to read.
- **43.2%** did not dereference to any body, counting the empty ones above
  plus dead hosts, 404s and URIs that are not URIs (95% CI 38.9% to 47.6%).
- **73.0%** of sampled registrations fail at least one limb the ERC states as
  MUST (95% CI 68.9% to 76.7%). That is: the agentURI did not resolve, the body
  was not JSON, or the document did not declare the ERC-8004 registration type with a
  service list.
- **91.0%** also counting files that do not point back at the on-chain identity
  they were read from, or whose declared HTTP endpoints did not answer today (95% CI
  88.2% to 93.2%).

## Where they fail

- `agent_uri_resolves` — first failing limb for 216 of 500 sampled agents
- `registration_schema_valid` — first failing limb for 140 of 500 sampled agents
- `registration_self_reference` — first failing limb for 89 of 500 sampled agents
- `registration_parses` — first failing limb for 9 of 500 sampled agents
- `endpoint_answers_today` — first failing limb for 1 of 500 sampled agents

Most common named reasons:

- `agent_uri_resolves:empty_agent_uri` — 174
- `registration_schema_valid:no_registration_type_declared` — 135
- `registration_self_reference:no_registrations_entry` — 81
- `agent_uri_resolves:http_404` — 18
- `registration_parses:json_parse_error:Expecting value: line 1 column 1 (char 0)` — 9
- `registration_self_reference:registrations_do_not_match_onchain_identity` — 8
- `agent_uri_resolves:http_500` — 5
- `registration_schema_valid:no_services_list` — 4

## Limbs

Each limb is reported separately so a refusal names which one failed. `absent` and
`not_applicable` never count against an agent, and `not_reached` means an earlier limb
failed first so this one was never observed.

- `agent_uri_resolves` (MUST) — ok 284, fail 216, not applicable 0, absent 0, not reached 0
- `registration_parses` (MUST) — ok 275, fail 9, not applicable 0, absent 0, not reached 216
- `registration_schema_valid` (MUST) — ok 135, fail 140, not applicable 0, absent 0, not reached 225
- `registration_self_reference` (SHOULD) — ok 46, fail 229, not applicable 0, absent 0, not reached 225
- `endpoint_answers_today` (OBSERVED) — ok 82, fail 37, not applicable 156, absent 0, not reached 225
- `domain_wellknown_proof` (MAY) — ok 0, fail 13, not applicable 183, absent 79, not reached 225

## Structural fields left out, and not counted as refusals

Across the 275 sampled files that parsed as JSON:

- `x402Support` absent in 192
- `registrations` absent in 174
- `type` absent in 135
- `active` absent in 117
- `services` absent in 106
- `image` absent in 104

The ERC prints these keys under a MUST structure and then demotes the top four to a SHOULD for ERC-721 tooling compatibility. Charging a refusal for an absent image would inflate the miss rate with cosmetics, so the omissions are counted here and left out of both headline rates.


## Read it yourself

- Full ledger with every receipt: https://geniusflow-federation.vercel.app/erc8004/ledger.json
- Headline only: https://geniusflow-federation.vercel.app/erc8004/summary.json
- One agent: https://geniusflow-federation.vercel.app/erc8004/receipts/<agentId>.json
- Which agentIds were drawn: https://geniusflow-federation.vercel.app/erc8004/index.json
- Same numbers laid out for reading: https://kaydeep0.github.io/eigenstate-research/erc8004/

Receipts exist for the 500 sampled agentIds only, so any other id returns 404.
That is the sample boundary, not a missing file. The seed below says how the boundary
was drawn, and re-running with a larger sample moves it.

## Re-run it

```bash
PYTHONPATH=engine python3 engine/tools/erc8004_probe_run.py --sample 500 --block 49425346
```

Pinning the same block redraws the same agentIds from the same block hash, so a
disagreement is about what the network returned, not about which agents were picked.

## What this is not

Not a reputation score, and no ranking of agents. A refusal is what the probe observed
at one moment from one network vantage point, not a verdict on an operator. Every
receipt carries the exact HTTP status or transport error so you can re-run it and
disagree. This node holds no ERC-8004 agentId of its own, and says so in its own
registration file at https://geniusflow-federation.vercel.app/.well-known/agent-registration.json, so it is not in its own sample.
