#!/usr/bin/env python3
"""
GeniusFlow Federation MCP server.

Preferred: remote Streamable HTTP, no clone.

    https://geniusflow-federation.vercel.app/api/mcp

Optional stdio wrapper around that same origin. If you use this file, clone
the public eigenstate-research repo and point at mcp/federation_mcp_server.py
in that clone. Do not use a private engine path.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

DEFAULT_BASE = "https://geniusflow-federation.vercel.app"
SERVER_NAME = "geniusflow-federation"
SERVER_VERSION = "1.0.0"


def base_url() -> str:
    return (os.environ.get("GENIUSFLOW_FEDERATION_URL") or DEFAULT_BASE).rstrip("/")


def _http(
    method: str,
    path: str,
    *,
    query: Optional[Dict[str, Any]] = None,
    body: Optional[Dict[str, Any]] = None,
    timeout: float = 25.0,
) -> Dict[str, Any]:
    url = base_url() + path
    if query:
        q = {k: str(v) for k, v in query.items() if v is not None and v != ""}
        if q:
            url += "?" + urllib.parse.urlencode(q)
    data = None
    headers = {
        "Accept": "application/json",
        "User-Agent": "GeniusFlowFederationMCP/1.0",
    }
    if body is not None:
        data = json.dumps(body, default=str).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method.upper())
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read(2_000_000)
            code = getattr(resp, "status", 200)
    except urllib.error.HTTPError as e:
        raw = e.read(2_000_000) if hasattr(e, "read") else b""
        code = e.code
    except Exception as e:
        return {"ok": False, "error": f"{type(e).__name__}:{e}", "url": url}
    try:
        payload = json.loads(raw.decode("utf-8", errors="replace"))
    except Exception:
        payload = {"raw": raw.decode("utf-8", errors="replace")[:4000]}
    if isinstance(payload, dict):
        payload.setdefault("http_status", code)
        payload.setdefault("_federation_url", url)
        return payload
    return {"ok": True, "http_status": code, "data": payload, "_federation_url": url}


TOOLS: List[Dict[str, Any]] = [
    {
        "name": "gf_status",
        "description": "Federation SLA/status: build_id, bake time, endpoint health, honest tier.",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "gf_dossier",
        "description": "GET entity dossier card (claims[] when ledger-backed).",
        "inputSchema": {
            "type": "object",
            "properties": {"entity": {"type": "string", "description": "Entity codename e.g. AAVE_V3"}},
            "required": ["entity"],
        },
    },
    {
        "name": "gf_report_feed",
        "description": "GET bundled report feed for an entity.",
        "inputSchema": {
            "type": "object",
            "properties": {"entity": {"type": "string"}},
            "required": ["entity"],
        },
    },
    {
        "name": "gf_cite",
        "description": "GET cite catalog, or POST one cite packet {kind,id,claim?}.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "kind": {"type": "string", "description": "Optional; if set, POST packet"},
                "id": {"type": "string"},
                "claim": {"type": "object"},
            },
        },
    },
    {
        "name": "gf_verify",
        "description": (
            "Re-check grounding: source_url + expected must come from published claims[]. "
            "Do not invent expected from report HTML. Returns proof_shape."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "source_url": {"type": "string"},
                "expected": {"type": "string"},
                "location": {"type": "string"},
                "claim": {"type": "object", "description": "Optional claim for RWA registry_ref limb"},
            },
            "required": ["source_url", "expected"],
        },
    },
    {
        "name": "gf_package",
        "description": (
            "Package disposition admit/refuse over a published claim object. "
            "Returns disposition + versioned proof_shape."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "claim": {"type": "object", "description": "Published claim from dossier claims[]"},
            },
            "required": ["claim"],
        },
    },
    {
        "name": "gf_darshan",
        "description": "GET public Darshan (refuse/admit samples + provenance rail).",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "gf_return_wire",
        "description": "GET return-wire consumption ack ring (read).",
        "inputSchema": {
            "type": "object",
            "properties": {"limit": {"type": "integer", "description": "Optional limit hint"}},
        },
    },
    {
        "name": "gf_openapi",
        "description": "GET OpenAPI 3 document for federation endpoints.",
        "inputSchema": {"type": "object", "properties": {}},
    },
]


def call_tool(name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    args = arguments or {}
    if name == "gf_status":
        return _http("GET", "/api/status")
    if name == "gf_dossier":
        return _http("GET", "/api/dossier", query={"entity": args.get("entity")})
    if name == "gf_report_feed":
        return _http("GET", "/api/report_feed", query={"entity": args.get("entity")})
    if name == "gf_cite":
        if args.get("kind"):
            body = {k: args[k] for k in ("kind", "id", "claim") if k in args}
            return _http("POST", "/api/cite", body=body)
        return _http("GET", "/api/cite")
    if name == "gf_verify":
        body = {
            "source_url": args.get("source_url"),
            "expected": args.get("expected"),
            "location": args.get("location") or "",
        }
        if isinstance(args.get("claim"), dict):
            body["claim"] = args["claim"]
        return _http("POST", "/api/verify", body=body)
    if name == "gf_package":
        return _http("POST", "/api/package", body={"claim": args.get("claim")})
    if name == "gf_darshan":
        return _http("GET", "/api/darshan")
    if name == "gf_return_wire":
        return _http("GET", "/api/return_wire")
    if name == "gf_openapi":
        return _http("GET", "/openapi.json")
    return {"ok": False, "error": f"unknown_tool:{name}"}


def _result_content(payload: Dict[str, Any]) -> Dict[str, Any]:
    text = json.dumps(payload, indent=2, default=str)
    return {"content": [{"type": "text", "text": text}], "isError": payload.get("ok") is False and "error" in payload}


def handle(msg: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    mid = msg.get("id")
    method = msg.get("method")
    params = msg.get("params") or {}
    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": mid,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
            },
        }
    if method == "notifications/initialized":
        return None
    if method == "tools/list":
        return {"jsonrpc": "2.0", "id": mid, "result": {"tools": TOOLS}}
    if method == "tools/call":
        name = str(params.get("name") or "")
        arguments = params.get("arguments") if isinstance(params.get("arguments"), dict) else {}
        payload = call_tool(name, arguments)
        return {"jsonrpc": "2.0", "id": mid, "result": _result_content(payload)}
    if method == "ping":
        return {"jsonrpc": "2.0", "id": mid, "result": {}}
    return {
        "jsonrpc": "2.0",
        "id": mid,
        "error": {"code": -32601, "message": f"Method not found: {method}"},
    }


def main() -> int:
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(msg, dict):
            continue
        # Content-Length framed messages are not used; Cursor also speaks NDJSON line mode
        # for simple stdio servers. Ignore notifications without id when handle returns None.
        if "method" not in msg:
            continue
        resp = handle(msg)
        if resp is not None:
            sys.stdout.write(json.dumps(resp, default=str) + "\n")
            sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
