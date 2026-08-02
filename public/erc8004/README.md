# ERC-8004 Base registration probe

Generated 2026-08-02T05:48:10.056391+00:00 · probe v1.0.0 · digest `f01dd0580950e1f7`

Explorers already list and score the agents registered under ERC-8004. This ledger
publishes the other half: the share of registrations that resolve to nothing, so a
dead entry and a working one do not look identical once you fetch them. Every
refusal is named by the limb that failed.

## What was measured

- Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` on `eip155:8453` (contract `name()` returns `AgentIdentity`)
- Pinned block: `49430006` · hash `0x2f1c73af317d6e81bd3b198a8287ef244f8ea25b0d628ae21304365bb21196ea`
- Agents registered at that block: **60,455**
- Sampled: **500** (0.8% of the population), uniform without
  replacement, seeded by the pinned block hash so anyone can redraw the same ids

## Headline

- **30.6%** of sampled agents hold an on-chain identity with no agentURI at
  all (95% CI 26.7% to 34.8%). Nothing was fetched and nothing can be
  disputed: the registry returns an empty string, so there is no registration file to read.
- **36.4%** did not dereference to any body, counting the empty ones above
  plus dead hosts, 404s and URIs that are not URIs (95% CI 32.3% to 40.7%).
- **71.4%** of sampled registrations fail at least one limb the ERC states as
  MUST (95% CI 67.3% to 75.2%). That is: the agentURI did not resolve, the body
  was not JSON, or the document did not declare the ERC-8004 registration type with a
  service list.
- **88.8%** also counting files that do not point back at the on-chain identity
  they were read from, or whose declared HTTP endpoints did not answer today (95% CI
  85.7% to 91.3%).

## Where they fail

- `agent_uri_resolves`: first failing limb for 182 of 500 sampled agents
- `registration_schema_valid`: first failing limb for 155 of 500 sampled agents
- `registration_self_reference`: first failing limb for 83 of 500 sampled agents
- `registration_parses`: first failing limb for 20 of 500 sampled agents
- `endpoint_answers_today`: first failing limb for 4 of 500 sampled agents

Most common named reasons:

- `agent_uri_resolves:empty_agent_uri`: 153
- `registration_schema_valid:no_registration_type_declared`: 150
- `registration_self_reference:no_registrations_entry`: 74
- `registration_parses:json_parse_error:Expecting value: line 1 column 1 (char 0)`: 19
- `agent_uri_resolves:http_404`: 10
- `registration_self_reference:registrations_do_not_match_onchain_identity`: 9
- `agent_uri_resolves:http_500`: 6
- `registration_schema_valid:no_services_list`: 5

## Limbs

Each limb is reported separately so a refusal names which one failed. `absent` and
`not_applicable` never count against an agent, and `not_reached` means an earlier limb
failed first so this one was never observed.

- `agent_uri_resolves` (MUST): ok 318, fail 182, not applicable 0, absent 0, not reached 0
- `registration_parses` (MUST): ok 298, fail 20, not applicable 0, absent 0, not reached 182
- `registration_schema_valid` (MUST): ok 143, fail 155, not applicable 0, absent 0, not reached 202
- `registration_self_reference` (SHOULD): ok 60, fail 238, not applicable 0, absent 0, not reached 202
- `endpoint_answers_today` (OBSERVED): ok 77, fail 42, not applicable 179, absent 0, not reached 202
- `domain_wellknown_proof` (MAY): ok 0, fail 16, not applicable 205, absent 77, not reached 202

## Structural fields left out, and not counted as refusals

Across the 298 sampled files that parsed as JSON:

- `x402Support` absent in 198
- `registrations` absent in 196
- `type` absent in 150
- `active` absent in 137
- `services` absent in 116
- `image` absent in 107

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
PYTHONPATH=engine python3 engine/tools/erc8004_probe_run.py --sample 500 --block 49430006
```

Pinning the same block redraws the same agentIds from the same block hash, so a
disagreement is about what the network returned, not about which agents were picked.

## What this is not

Not a reputation score, and no ranking of agents. A refusal is what the probe observed
at one moment from one network vantage point, not a verdict on an operator. Every
receipt carries the exact HTTP status or transport error so you can re-run it and
disagree. This node holds no ERC-8004 agentId of its own, and says so in its own
registration file at https://geniusflow-federation.vercel.app/.well-known/agent-registration.json, so it is not in its own sample.
