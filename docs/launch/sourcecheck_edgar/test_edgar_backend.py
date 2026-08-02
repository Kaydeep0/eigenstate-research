"""Hermetic tests for EdgarBackend using httpx.MockTransport, so resolution and
parsing are verified with zero network. The precision cases matter more than the
happy path here: the registry is keyed in a way that makes a plausible guess land
on the wrong company, and these tests pin the refusal to guess."""

import httpx
import pytest

from sourcecheck import Citation
from sourcecheck.backends.edgar import EdgarBackend, strip_markup

_UA = "sourcecheck-tests tests@example.com"

_INDEX = {
    "directory": {
        "item": [
            {"name": "0000320193-24-000123-index.htm"},
            {"name": "aapl-20240928.htm"},
            {"name": "exhibit-21.htm"},
        ]
    }
}

_HIT = {
    "hits": {
        "hits": [
            {
                "_id": "0000320193-24-000123:aapl-20240928.htm",
                "_source": {
                    "adsh": "0000320193-24-000123",
                    "ciks": ["0000320193"],
                    "display_names": ["Apple Inc. (AAPL) (CIK 0000320193)"],
                    "file_type": "10-K",
                    "file_date": "2024-11-01",
                },
            }
        ]
    }
}


def _backend(handler):
    return EdgarBackend(user_agent=_UA, transport=httpx.MockTransport(handler))


# --- pure helpers ------------------------------------------------------------


def test_strip_markup_drops_script_and_attributes():
    html = '<p title="hidden phrase">Visible <script>var x="also hidden";</script>text</p>'
    out = strip_markup(html)
    assert out == "Visible text"
    assert "hidden" not in out


def test_user_agent_without_contact_is_refused():
    # The SEC blocks generic agents, and a throttled backend would look like an
    # honest NOT_VERIFIABLE. Fail loudly at construction instead.
    with pytest.raises(ValueError):
        EdgarBackend(user_agent="sourcecheck")


# --- resolution via mocked transport -----------------------------------------


def test_cik_and_accession_pair_resolves_to_the_primary_document():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path.endswith("/320193/000032019324000123/index.json")
        return httpx.Response(200, json=_INDEX)

    src = _backend(handler).resolve(Citation(raw="320193:0000320193-24-000123"))
    assert src is not None
    assert src.id == "0000320193-24-000123:aapl-20240928.htm"
    assert src.url.endswith("/320193/000032019324000123/aapl-20240928.htm")


def test_archive_url_resolves_to_the_named_document():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=_INDEX)

    url = (
        "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/"
        "aapl-20240928.htm"
    )
    src = _backend(handler).resolve(Citation(raw=url))
    assert src is not None
    assert src.url.endswith("aapl-20240928.htm")


def test_named_document_not_in_the_filing_abstains():
    # A document name that is not in the index is not "close enough" to the one
    # that is. Resolving to a neighbouring exhibit would ground a claim in text
    # the citation never pointed at.
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=_INDEX)

    url = (
        "https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/"
        "not-in-this-filing.htm"
    )
    assert _backend(handler).resolve(Citation(raw=url)) is None


def test_bare_accession_number_does_not_resolve():
    # The accession prefix identifies the filer agent, which is the registrant
    # only for self-filed documents, so there is no safe CIK to guess.
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        return httpx.Response(200, json=_INDEX)

    assert _backend(handler).resolve(Citation(raw="0000320193-24-000123")) is None
    assert calls == []


def test_free_text_search_resolves_when_the_match_is_strong():
    def handler(request: httpx.Request) -> httpx.Response:
        assert "efts.sec.gov" in str(request.url)
        return httpx.Response(200, json=_HIT)

    src = _backend(handler).resolve(Citation(raw="Apple Inc. AAPL 10-K 2024-11-01"))
    assert src is not None
    assert src.year == 2024
    assert src.url.endswith("/320193/000032019324000123/aapl-20240928.htm")


def test_free_text_search_rejects_a_weak_top_hit():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=_HIT)

    assert _backend(handler).resolve(Citation(raw="quarterly revenue of some company")) is None


def test_short_query_abstains_without_a_call():
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        return httpx.Response(200, json=_HIT)

    assert _backend(handler).resolve(Citation(raw="Apple")) is None
    assert calls == []


def test_upstream_error_abstains_rather_than_raising():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(503)

    assert _backend(handler).resolve(Citation(raw="320193:0000320193-24-000123")) is None


# --- content -----------------------------------------------------------------


def test_fetch_returns_visible_text_only():
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path.endswith("index.json"):
            return httpx.Response(200, json=_INDEX)
        return httpx.Response(200, text="<html><body><p>An investment contract.</p></body></html>")

    backend = _backend(handler)
    src = backend.resolve(Citation(raw="320193:0000320193-24-000123"))
    assert backend.fetch(src) == "An investment contract."


def test_fetch_truncates_a_large_filing():
    body = "<p>" + ("word " * 200_000) + "</p>"

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path.endswith("index.json"):
            return httpx.Response(200, json=_INDEX)
        return httpx.Response(200, text=body)

    backend = _backend(handler)
    src = backend.resolve(Citation(raw="320193:0000320193-24-000123"))
    content = backend.fetch(src)
    assert content is not None
    assert len(content) == 400_000
