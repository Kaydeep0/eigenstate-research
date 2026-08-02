# MCP server for the GeniusFlow federation

Public source for the MCP server listed in the official registry as
`io.github.kaydeep0/geniusflow-federation`. The engine repository is private, so this is
the public home the registry entry points at.

Two ways to connect. Both talk to the same public federation origin, and neither needs a
signup, a key, or a payment.

## Remote (nothing to install)

```
https://geniusflow-federation.vercel.app/api/mcp
```

Streamable HTTP, JSON-RPC 2.0, POST only, stateless. No session header, no SSE stream.

```bash
curl -sS https://geniusflow-federation.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | head -c 400
```

## Local stdio

`federation_mcp_server.py` is the stdio equivalent, for clients that prefer a local
process. Add to a Cursor or Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "geniusflow-federation": {
      "command": "python3",
      "args": ["/ABS/PATH/mcp/federation_mcp_server.py"],
      "env": { "GENIUSFLOW_FEDERATION_URL": "https://geniusflow-federation.vercel.app" }
    }
  }
}
```

## Declared versus actual

`server.json` is what the registry stores. The registry authenticates the namespace, not
the behaviour: it does not connect to the server and check that the declared tools exist.
So the same declaration is served from the origin at
<https://geniusflow-federation.vercel.app/server.json>, and the actual capability set is
whatever `initialize` and `tools/list` return today. They are meant to be compared, by
anyone.

Declared tools: `gf_status`, `gf_dossier`, `gf_report_feed`, `gf_cite`, `gf_verify`,
`gf_package`, `gf_darshan`, `gf_return_wire`, `gf_openapi`.

Declared capabilities: `tools` only. Not declared and not implemented: resources, prompts,
completions, sampling, logging.

## Discipline the tools enforce

1. `gf_verify` takes `expected` from a published `claims[].grounding` object. It will not
   infer an expected string from report prose, and it does not upgrade a miss to a match.
2. `gf_package` returns a disposition with the frozen proof_shape v1 limbs
   (`registry_ref`, `refuse_or_admit`, `provenance_spine`). A refusal names the limb that
   failed.
3. Availability is `best_effort_vercel` with cold starts. Stated plainly at
   <https://geniusflow-federation.vercel.app/docs/FEDERATION_SLA.md>.
