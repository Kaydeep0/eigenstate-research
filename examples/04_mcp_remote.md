# Remote MCP (outsider)

No private clone. No stdio path.

## Cursor / Claude-compatible remote config

```json
{
  "mcpServers": {
    "geniusflow-federation": {
      "url": "https://geniusflow-federation.vercel.app/api/mcp"
    }
  }
}
```

Some clients want `"type": "http"` or a Streamable HTTP toggle. The URL is the same.

## JSON-RPC smoke (no MCP client)

```bash
curl -sS -X POST https://geniusflow-federation.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"outsider","version":"0"}}}'

curl -sS -X POST https://geniusflow-federation.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

Expected tool names:

```text
gf_status
gf_dossier
gf_report_feed
gf_cite
gf_verify
gf_package
gf_darshan
gf_return_wire
gf_openapi
```

Declaration to compare: https://geniusflow-federation.vercel.app/server.json  
Registry name: `io.github.Kaydeep0/geniusflow-federation`

Do not register again. Metadata repair is a Host `mcp-publisher` action. Candidate: [`../mcp/server.json`](../mcp/server.json)
