"""A third-domain provenance backend: US securities filings via EDGAR.

Same argument as ``federal_register.py``, one domain further out. The Federal
Register backend showed that the abstention gate does not care whether a source
is a paper or a rule. This one points the same interface at what companies filed
rather than at what the government published, which is a different kind of
authority and worth keeping distinct:

    from sourcecheck import Verifier
    from sourcecheck.backends.edgar import EdgarBackend

    v = Verifier(provenance=EdgarBackend(user_agent="you you@example.com"))
    v.verify_claim(
        "The company describes the token as an investment contract.",
        {"raw": "320193:0000320193-24-000123"},   # CIK and accession number
    )

Precision-first, in three places that matter for this registry specifically:

* **A bare accession number does not resolve.** EDGAR's archive path is keyed by
  the registrant CIK, and the accession prefix is the *filer agent's* identifier,
  which equals the registrant only for self-filed documents. Guessing would
  resolve some citations to the wrong company's directory, so a citation must
  carry the pair, as ``CIK:accession`` or as an archive URL, or it falls through
  to validated free-text search.
* **Free-text search must clear the same title-overlap bar** as the other
  backends, measured against the registrant name and form rather than a paper
  title, and abstains rather than return a top hit.
* **A filing document is truncated before it is served as content.** Filings run
  to megabytes and the grounding checkers are not built for that. Truncation can
  only cost recall: a claim whose support falls outside the window abstains, and
  no path is opened to a false SUPPORTED.

What this backend is not: EDGAR indexes what registrants filed, not what the
Commission held. A filing that repeats a phrase is a company describing a
regulator, which corroborates the string and is not authority for the claim.
The full text index also begins in 2001, so a claim whose only support predates
that is not verifiable here, and that limit belongs to the index rather than to
the claim.

The SEC requires a descriptive User-Agent that identifies the requester, and it
rate limits at 10 requests per second. There is no key and no account.
"""

from __future__ import annotations

import logging
import re

import httpx

from ..interfaces import ProvenanceBackend, SourceStore
from ..types import CanonicalSource, Citation
from .openalex_crossref import _MIN_QUERY_TOKENS, _title_matches, _title_tokens

log = logging.getLogger("sourcecheck.edgar")

_FULL_TEXT = "https://efts.sec.gov/LATEST/search-index"
_ARCHIVES = "https://www.sec.gov/Archives/edgar/data"

# 0000320193-24-000123
_ACCESSION_RE = re.compile(r"^\d{10}-\d{2}-\d{6}$")
# "320193:0000320193-24-000123" or "CIK0000320193:0000320193-24-000123"
_PAIR_RE = re.compile(r"^(?:CIK)?0*(\d{1,10})\s*[:/]\s*(\d{10}-\d{2}-\d{6})$", re.I)
# https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/aapl-20240928.htm
_ARCHIVE_URL_RE = re.compile(
    r"^https?://(?:www\.)?sec\.gov/Archives/edgar/data/0*(\d{1,10})/(\d{18})(?:/([\w.\-]+))?/?$",
    re.I,
)

_MAX_CONTENT_CHARS = 400_000

_SCRIPT_RE = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)
_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


def strip_markup(html: str) -> str:
    """Visible text only. A phrase hidden in an attribute is not something a
    reader of the filing would see, so it must not count as content."""
    text = _SCRIPT_RE.sub(" ", html)
    text = _TAG_RE.sub(" ", text)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    return _WS_RE.sub(" ", text).strip()


class EdgarBackend(ProvenanceBackend, SourceStore):
    """Resolve a citation to one document in one EDGAR filing, and serve that
    document's visible text as checkable content."""

    name = "edgar"

    def __init__(
        self,
        user_agent: str,
        timeout: float = 20.0,
        retries: int = 2,
        transport: httpx.BaseTransport | None = None,
    ):
        if not user_agent or "@" not in user_agent:
            # The SEC asks for a contact address and blocks generic agents. Failing
            # here is better than being throttled into silent NOT_VERIFIABLE.
            raise ValueError(
                "EDGAR requires a descriptive User-Agent carrying a contact address, "
                "for example 'example-research contact@example.com'"
            )
        self._client = httpx.Client(
            headers={"User-Agent": user_agent, "Accept-Encoding": "gzip, deflate"},
            timeout=timeout,
            follow_redirects=True,
            transport=transport,
        )
        self._retries = retries

    # --- ProvenanceBackend ---------------------------------------------------

    def resolve(self, citation: Citation) -> CanonicalSource | None:
        located = self._located(citation)
        if located:
            cik, accession, filename = located
            # An identified filing is authoritative: resolve it directly and never
            # fall back to a search that could land on a different registrant.
            return self._by_location(cik, accession, filename)
        query = citation.title or citation.raw
        if query:
            return self._by_search(query)
        return None

    @staticmethod
    def _located(citation: Citation) -> tuple[str, str, str | None] | None:
        for candidate in (citation.raw, citation.title, citation.doi):
            if not candidate:
                continue
            value = candidate.strip()
            url = _ARCHIVE_URL_RE.match(value)
            if url:
                cik, folder, filename = url.group(1), url.group(2), url.group(3)
                accession = f"{folder[:10]}-{folder[10:12]}-{folder[12:]}"
                return cik, accession, filename
            pair = _PAIR_RE.match(value)
            if pair:
                return pair.group(1), pair.group(2), None
            if _ACCESSION_RE.match(value):
                log.info(
                    "edgar accession %s carries no CIK: refusing to guess the registrant "
                    "directory from the filer prefix",
                    value,
                )
        return None

    # --- SourceStore ---------------------------------------------------------

    def fetch(self, source: CanonicalSource) -> str | None:
        if not source.url:
            return None
        r = self._get(source.url)
        if r is None or r.status_code != 200:
            return None
        text = strip_markup(r.text)
        if len(text) > _MAX_CONTENT_CHARS:
            log.info(
                "edgar document %s truncated from %d to %d characters; support outside "
                "the window will abstain",
                source.id,
                len(text),
                _MAX_CONTENT_CHARS,
            )
            text = text[:_MAX_CONTENT_CHARS]
        return text or None

    # --- API -----------------------------------------------------------------

    def _by_location(
        self, cik: str, accession: str, filename: str | None
    ) -> CanonicalSource | None:
        folder = accession.replace("-", "")
        index_url = f"{_ARCHIVES}/{cik}/{folder}/index.json"
        r = self._get(index_url)
        if r is None or r.status_code != 200:
            return None
        try:
            listing = ((r.json() or {}).get("directory") or {}).get("item") or []
        except ValueError:
            return None
        chosen = self._primary_document(listing, filename)
        if not chosen:
            return None
        return CanonicalSource(
            id=f"{accession}:{chosen}",
            title=f"EDGAR filing {accession} ({chosen})",
            backend=self.name,
            url=f"{_ARCHIVES}/{cik}/{folder}/{chosen}",
        )

    @staticmethod
    def _primary_document(listing: list[dict], filename: str | None) -> str | None:
        names = [item.get("name") for item in listing if item.get("name")]
        if filename:
            return filename if filename in names else None
        # No document named: take the first filing document rather than an index
        # page or an exhibit list, and abstain if there is no obvious one.
        for name in names:
            lowered = name.lower()
            if lowered.endswith((".htm", ".html")) and "index" not in lowered:
                return name
        return None

    def _by_search(self, query: str) -> CanonicalSource | None:
        if len(_title_tokens(query)) < _MIN_QUERY_TOKENS:
            return None
        r = self._get(_FULL_TEXT, params={"q": f'"{query[:350]}"'})
        if r is None or r.status_code != 200:
            return None
        try:
            hits = ((r.json() or {}).get("hits") or {}).get("hits") or []
        except ValueError:
            return None
        if not hits:
            return None
        src = self._to_source(hits[0])
        if src and not _title_matches(query, src.title):
            log.info("edgar hit %r rejected: weak match for %r", src.title, query)
            return None
        return src

    def _to_source(self, hit: dict | None) -> CanonicalSource | None:
        if not hit:
            return None
        ident = hit.get("_id") or ""
        body = hit.get("_source") or {}
        accession = body.get("adsh")
        if not accession or ":" not in ident:
            return None
        filename = ident.split(":", 1)[1]
        ciks = [c.lstrip("0") for c in (body.get("ciks") or []) if c]
        if not ciks:
            return None
        names = body.get("display_names") or []
        form = body.get("file_type") or body.get("root_form") or ""
        filed = body.get("file_date") or ""
        year = int(filed[:4]) if filed[:4].isdigit() else None
        folder = accession.replace("-", "")
        title = " ".join(part for part in (names[0] if names else "", form, filed) if part)
        return CanonicalSource(
            id=f"{accession}:{filename}",
            title=title.strip() or f"EDGAR filing {accession}",
            backend=self.name,
            authors=list(names),
            year=year,
            url=f"{_ARCHIVES}/{ciks[0]}/{folder}/{filename}",
        )

    def _get(self, url: str, params: dict | None = None) -> httpx.Response | None:
        import time

        for attempt in range(self._retries + 1):
            try:
                r = self._client.get(url, params=params)
            except httpx.HTTPError as e:
                log.warning("edgar request to %s failed (%s): %s", url, type(e).__name__, e)
                return None
            if r.status_code in (429, 503) and attempt < self._retries:
                time.sleep(1.0 + attempt)
                continue
            if r.status_code >= 500 or r.status_code in (429, 503):
                log.warning("edgar upstream error %s on %s", r.status_code, url)
            return r
        return None

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> EdgarBackend:
        return self

    def __exit__(self, *exc) -> None:
        self.close()
