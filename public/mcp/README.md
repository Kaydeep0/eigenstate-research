# MCP server for GeniusFlow Evidence

Public source for the official registry listing
`io.github.Kaydeep0/geniusflow-federation`.

**Use the remote endpoint.** Do not point a client at a private engine tree.

## Remote (recommended)

```json
{
  "mcpServers": {
    "geniusflow-federation": {
      "url": "https://geniusflow-federation.vercel.app/api/mcp"
    }
  }
}
```

Streamable HTTP, JSON-RPC 2.0, POST only, no auth, no signup.

```bash
curl -sS -X POST https://geniusflow-federation.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"outsider","version":"0"}}}'

curl -sS -X POST https://geniusflow-federation.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

Tools: `gf_status` `gf_dossier` `gf_report_feed` `gf_cite` `gf_verify` `gf_package` `gf_darshan` `gf_return_wire` `gf_openapi`.

`gf_darshan` and `gf_return_wire` are experimental. Core evidence tools: `gf_dossier` `gf_verify` `gf_package` `gf_cite` `gf_status`.

## Optional stdio (this public repo only)

If a client cannot use remote HTTP, clone **this** repository and run `mcp/federation_mcp_server.py`. Never use a private `geniusflow-engine` path.

```json
{
  "mcpServers": {
    "geniusflow-federation": {
      "command": "python3",
      "args": ["mcp/federation_mcp_server.py"],
      "env": { "GENIUSFLOW_FEDERATION_URL": "https://geniusflow-federation.vercel.app" }
    }
  }
}
```

## Declared versus actual

`server.json` is the registry declaration. Live behaviour is `initialize` + `tools/list` on
<https://geniusflow-federation.vercel.app/api/mcp>. Compare them.

Origin copy: <https://geniusflow-federation.vercel.app/server.json>

Availability: `best_effort_vercel` — <https://geniusflow-federation.vercel.app/docs/FEDERATION_SLA.md>
