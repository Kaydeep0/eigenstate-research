# GeniusFlow

**Evidence is the product.**
**Federation and MCP are the interfaces.**
**RWA / CIRCLE is the proving ground.**
**Research is the laboratory.**

Pinned claims about real-world entities. Live source re-check. Fail-closed packages. Public MCP.

```text
USE NOW      Evidence API + MCP     this README
RESEARCH     labeled experiments    not a product feature
ROADMAP      registry / reliance / settlement    future
```

[Try Federation](https://geniusflow-federation.vercel.app/api/dossier?entity=CIRCLE) · [Connect MCP](#connect-mcp) · [CIRCLE example](#circle-example) · [What this does not claim](#what-this-does-not-claim)

---

## Use GeniusFlow

Evidence-backed claims that can be independently re-checked.

No account. Live origin:

```text
https://geniusflow-federation.vercel.app
```

| Do this | Call |
|---------|------|
| Open an entity card | `GET /api/dossier?entity=CIRCLE` |
| Re-check a pinned string | `POST /api/verify` |
| Admit or withhold | `POST /api/package` |
| Cite | `POST /api/cite` with `{kind, id, claim}` |
| MCP | `POST /api/mcp` — registry `io.github.Kaydeep0/geniusflow-federation` |

SLA: best-effort Vercel hobby. No promised uptime.

A missing circulating figure stays **UNKNOWN**. That is product behavior, not an empty cell to fill in.

---

## How it works

```text
Entity → Claim → Grounding → Verify → Package → Cite
```

1. **Entity** — a specimen card (CIRCLE is the public proving ground).
2. **Claim** — a published sentence on that card.
3. **Grounding** — `source_url` + `expected` substring, taken from the claim. Do not invent `expected`.
4. **Verify** — another machine re-fetches the source and reports whether the substring is still there.
5. **Package** — admit or withhold. Invented attestations are withheld.
6. **Cite** — a cite packet over a published claim object.

Literal string re-check. Not semantic fact-checking. Not “the world is true.”

Pages (`kaydeep0.github.io/eigenstate-research`) and Federation are **different surfaces**. Snapshot identities can differ. Do not treat them as one synchronized view.

---

## CIRCLE example

```bash
# 1. Entity card
curl -sS "https://geniusflow-federation.vercel.app/api/dossier?entity=CIRCLE"

# 2. Take grounding from claims[0] — do not invent expected
# 3. Verify, package, cite: see examples/
```

Copy/paste scripts (curl + python3, no clone of the private engine):

- [`examples/01_verify_circle.sh`](examples/01_verify_circle.sh) — dossier → verify
- [`examples/02_status_and_unknown.sh`](examples/02_status_and_unknown.sh) — status + UNKNOWN circulating
- [`examples/03_package_and_cite.sh`](examples/03_package_and_cite.sh) — package admit + cite packet

Machine index: [llms.txt](https://geniusflow-federation.vercel.app/llms.txt) · OpenAPI: [openapi.json](https://geniusflow-federation.vercel.app/openapi.json)

---

## Connect MCP

Remote. No private filesystem path.

```json
{
  "mcpServers": {
    "geniusflow-federation": {
      "url": "https://geniusflow-federation.vercel.app/api/mcp"
    }
  }
}
```

Official registry: [`io.github.Kaydeep0/geniusflow-federation`](https://registry.modelcontextprotocol.io/)

Tools (live `tools/list`): `gf_status` `gf_dossier` `gf_report_feed` `gf_cite` `gf_verify` `gf_package` `gf_darshan` `gf_return_wire` `gf_openapi`

`gf_darshan` and `gf_return_wire` are experimental adapters. Core evidence tools are `gf_dossier` / `gf_verify` / `gf_package` / `gf_cite` / `gf_status`.

---

## Research

Experiments testing whether maintained state helps independent AI observers recover position and, separately, allocate future attention.

These are **labeled experiments**. They are not the product on the first screen.

| Experiment | Public status |
|------------|----------------|
| H_CHATGPT_POSITION R1 | Task-specific: maintained multi-artifact package C recovered position better than thinner packages A/B (n=15). Not a memory product. Not a general information-advantage proof. |
| H_CHATGPT_POSITION A1 | Frozen. 0/25 observers. Waiting on ChatGPT upload apparatus. Not run. |
| Phase 8 | Apparatus reachable; prospective experiment not yet started. T0 none. Not a live world-tracking feature. Not an experimental result. |

---

## Roadmap

Explicitly future. Not current product claims.

- RWA registry as something others rely on
- Shared reliance
- Settlement

CIRCLE is inspectable today. That does not make a complete RWA registry.

---

## What this does not claim

- Persistent AI memory product
- Better than RAG / Graphiti / Mem0 / Letta
- Complete RWA registry
- Settlement or reliance
- Real-time world model
- Proven information advantage
- Synchronized websites (Pages and Federation snapshot ids can differ)
- Production SLA
- `$500T+` tokenized-market figure

---

## Public surfaces

| Surface | URL |
|---------|-----|
| Live API | https://geniusflow-federation.vercel.app |
| Human site (secondary) | https://kaydeep0.github.io/eigenstate-research/ |
| This repository | https://github.com/Kaydeep0/eigenstate-research |
| MCP | https://geniusflow-federation.vercel.app/api/mcp |
| MCP declaration | https://geniusflow-federation.vercel.app/server.json |

The runtime engine repository is private.

## Also on this site

Human research Pages (secondary; not the Evidence API):

- [Methodology](https://kaydeep0.github.io/eigenstate-research/methodology/)
- [Verify walkthrough](https://kaydeep0.github.io/eigenstate-research/verify-walkthrough/)
- [Mode A walkthrough](https://kaydeep0.github.io/eigenstate-research/mode-a-walkthrough/)

