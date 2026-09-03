# Eigenstate Human Research Publication Protocol

**Protocol version:** 1.0.2  
**Date:** 2026-09-03  
**Amendment:** 2026-09-03 — §24 Search + Machine Discovery Protocol (docs only)  
**Status:** Standing repository doctrine

This protocol is standing repository doctrine. Host future prompt:

> Add this Host-written article to Eigenstate under the Human Research Publication Protocol.

Human Money in Motion destination is authorized at `/money-in-motion/`. GeniusFlow spines live at `/geniusflow/mim/`. V1 Research Record is still not authorized. This protocol file remains uncommitted.

---

## Authorization (this file only)

This file is the one Host-authorized documentation object for this protocol.

Host authorized Option 1 on 2026-09-03: human essays at `/money-in-motion/`; GeniusFlow spines at `/geniusflow/mim/`; 301 only the three live public spine slugs. This file still does **not** authorize: V1 Research Record; article-level VERIFIED; committing this file; pushing; deploying; or stacking on unpublished local-`main` report/spine commits.

---

## Purpose

When Host gives Cursor a human-written research article and asks to add, prepare, archive, or publish it through the Eigenstate Research website, Cursor MUST apply this protocol automatically.

Host should NOT have to repeat the verification architecture every time.

This protocol governs **HUMAN-WRITTEN** research.

It does **NOT** govern the existing GeniusFlow-generated Eigenstate `/geniusflow/mim/` spines.

Eigenstate should be maximally discoverable, attributable, parseable, and citable by human researchers, search engines, LLM research systems, and autonomous research agents, without changing the epistemic status of the research.

That sentence is the overall discovery and citation goal (§24). It is not a keyword-stuffing or generic SEO brief.

---

## 1. Object boundary

There are currently two different objects sharing Money in Motion language.

**A. LinkedIn Money in Motion**

Human-authored research written by Kiran.

LinkedIn is a distribution/publication surface.

**B. Eigenstate GeniusFlow `/geniusflow/mim/`**

Existing GeniusFlow-generated machine spines.

These are NOT the canonical home for Host-written essays.

**C. Eigenstate human `/money-in-motion/`**

Host-authorized human essay destination (Option 1, 2026-09-03). Separate collection and schema from GeniusFlow spines.

DO NOT place a Host-written article into the GeniusFlow spine collection merely because the article was published through the LinkedIn Money in Motion newsletter.

DO NOT create a second Money in Motion navigation item.

---

## 2. Authorship is sacrosanct

For a Host-written article:

HOST owns:

- thesis
- prose
- interpretation
- framing
- conclusions
- argument
- final editorial judgment

GeniusFlow does NOT author the article.

IBKR does NOT author the article.

Cursor does NOT silently rewrite the article to satisfy verification.

Machine-generated prose must never be presented as Host-authored merely because a Kiran byline is attached.

If Cursor edits Host prose at Host's request, preserve the distinction between editorial assistance and evidence verification.

---

## 3. Article is never "VERIFIED"

An article contains factual premises, calculations, synthesis, interpretation, hypotheses, comparisons, and judgment.

Therefore:

**ARTICLE STATUS = NEVER "VERIFIED"**

GeniusFlow may verify eligible factual claims contained inside an article.

Verification of factual premises MUST NOT propagate upward into verification of:

- the paragraph
- the section
- the thesis
- the interpretation
- the article

Never render:

- "VERIFIED ARTICLE"
- "GeniusFlow verified this research"
- "Verified by GeniusFlow"

or equivalent language implying article-level epistemic endorsement.

---

## 4. Classify before verifying

Before sending anything to GeniusFlow, classify the relevant statement.

Use the smallest taxonomy supported by the canonical article protocol.

Current working classes:

- FACTUAL
- TYPED
- CALC
- MODEL
- AUTHOR
- HYPOTHESIS
- UNKNOWN
- COUNTER_EVIDENCE

Do not expand this taxonomy casually.

If later specimen work ratifies a smaller or different canonical taxonomy, use the ratified version.

---

## 5. What may go to GeniusFlow

Only eligible FACTUAL claims may become GeniusFlow verification candidates.

Typical candidates include literal externally checkable claims grounded in:

- statutes
- regulations
- official government documents
- official agency pages
- SEC filings
- company filings
- official speeches/transcripts
- stable primary-source documents
- other source forms supported by the existing GF Evidence contract

Example:

> The GENIUS Act requires permitted payment stablecoin issuers to maintain identifiable reserves backing outstanding stablecoins on at least a 1:1 basis.

Potential class: FACTUAL

Potential disposition: GF CANDIDATE

Candidate does NOT mean verified.

---

## 6. What must not be forced through GeniusFlow

Do NOT send something to GF merely because it appears in an article.

### TYPED DATA

Examples: FRED observation; Treasury FiscalData series; structured SEC value; market series; locally extracted filing value where Mode A is not the appropriate verifier.

Keep typed provenance.

### CALC

Examples: basis-point comparison; percentage change; annualized return; ratio; scenario calculation.

Preserve:

- formula
- inputs
- input provenance
- calculation timestamp where relevant

GF may verify an eligible factual input.

GF does not thereby verify the calculation.

### MODEL

Examples: YCC model; Capital model; Scout; GRAS; other named IBKR model.

Preserve:

- model identity
- inputs
- output
- run/version where available

Do not present model output as observed fact.

### AUTHOR

Examples: economic interpretation; causal reasoning; historical synthesis; analogy; thesis; judgment.

These belong to Kiran.

Do not GF them.

### HYPOTHESIS / SCENARIO

Examples: "$1 trillion regulated stablecoin market"; possible YCC path; future absorption scenario.

Clearly preserve their hypothetical status.

Do not turn scenarios into observed facts.

### UNKNOWN

Keep unknowns unknown.

### COUNTER_EVIDENCE

Preserve evidence that weakens or complicates the article's thesis.

Do not suppress it because it makes the article less tidy.

---

## 7. Premise verification does not verify interpretation

This rule is mandatory.

Example:

- FACT: QSBS exclusion schedule.
- FACT / TYPED: Applicable federal tax rate.
- TYPED: 2-year Treasury yield.
- CALC: Implied economic benefit from waiting.
- CALC: Approximate 230 bp comparison.
- AUTHOR: "The statutory schedule is paying more than the bond market for the same two years of waiting."

GF may verify eligible factual premises.

That does NOT mean GF verified:

> the statute pays 230 bp more.

The latter contains calculation and economic framing.

Never allow verified premises to donate VERIFIED status to downstream interpretation.

---

## 8. Use existing GeniusFlow interface

When GF verification is appropriate, prefer the existing GeniusFlowClient Mode A path already used by IBKR Architecture.

Conceptual client path (do not modify IBKR from this protocol): `build/architecture/geniusflow_client.py` in the IBKR workspace.

Do NOT invent another GF verification interface unless separately authorized.

Do NOT stuff a human article into:

`federation/report-claims/{ARTICLE}.json`

The existing report-claims sidecar belongs to Field Position Reports.

Reuse compatible claim SHAPE or semantics where appropriate.

Do not reuse the report identity/object merely because fields are convenient.

---

## 9. Preserve the clocks

Never collapse temporal fields.

At minimum distinguish:

**OBSERVED_AT**  
When the underlying observation applies or was observed.

**PUBLISHED_AT**  
When Kiran publicly published the article/claim.

**VERIFIED_AT**  
When GeniusFlow subsequently checked the evidence.

If later checked again:

**REVERIFIED_AT**

These clocks answer different questions.

Example:

- OBSERVED_AT: 2026-06-30
- PUBLISHED_AT: 2026-08-31
- VERIFIED_AT: 2026-09-04

A September verification of an August article must NEVER be represented as:

> verified August 31

Historical verification must not be backdated.

---

## 10. Historical articles remain historical

If an article was already published on LinkedIn:

Do NOT silently rewrite the historical LinkedIn article.

A later Eigenstate Research Record may describe:

- original publication date
- current evidence state
- verification date
- reverification history
- source changes
- contradictions
- unresolved claims

The evidence record may evolve.

The historical publication must not silently mutate.

---

## 11. Do not invent a universal WITHHOLD

Current systems use different semantics.

GF projection WITHHOLD, GF claim statuses, and IBKR Architecture `package_disposition` are not one universal ontology.

Therefore article infrastructure must NOT flatten them into one invented global status.

If an article Research Record needs a reader-facing disposition, preserve the underlying result.

Conceptually:

- ARTICLE EVIDENCE DISPOSITION: WITHHELD
- UNDERLYING SYSTEM: GeniusFlow Mode A
- UNDERLYING RESULT: UNVERIFIED-PENDING
- REASON: …
- HOST ACTION: …

Do not erase the native system state.

---

## 12. Verification failure must fail closed

If GF cannot verify a factual claim:

DO NOT:

- silently rewrite it
- weaken it automatically until it passes
- substitute another source without Host review
- convert it into VERIFIED
- hide the failure
- publish a fabricated evidence badge

Return the failure to Host.

Possible Host decisions include:

- **KEEP** — because it is properly AUTHOR interpretation
- **NARROW** — Host manually narrows the factual claim
- **CHANGE SOURCE** — Host approves a different primary source
- **REMOVE** — Host removes the claim
- **WITHHOLD** — research record visibly preserves unresolved evidence state
- **UNKNOWN** — where evidence does not establish the proposition

Host decides.

---

## 13. Source quality

Prefer primary sources whenever available.

Examples: Congress / statute; Federal Register; Treasury; Federal Reserve; SEC; CFTC; FDIC; OCC; CBO; official company filings; official institutional documents.

Secondary sources may support research discovery.

They should not silently replace available primary evidence for a factual claim intended for GF verification.

Do not manufacture certainty because a secondary source repeats something.

---

## 14. Research Record

The intended future human article object consists conceptually of:

HUMAN ARTICLE  
+  
RESEARCH RECORD

The article is readable prose.

The Research Record contains inspectable epistemic structure.

Possible contents:

- FACTUAL CLAIMS
- TYPED DATA
- CALCULATIONS
- MODEL OUTPUTS
- AUTHOR INTERPRETATIONS where useful to distinguish status
- HYPOTHESES
- UNKNOWNS
- COUNTER-EVIDENCE
- SOURCES
- GF EVIDENCE REFERENCES
- TEMPORAL HISTORY

Do not implement this object until separately authorized.

---

## 15. Reader experience

Verification infrastructure must not make the article unpleasant to read.

Default principle:

**ARTICLE FIRST**  
**EVIDENCE AVAILABLE ON DEMAND**

Avoid:

- badges on every sentence
- hashes inside prose
- GF jargon throughout the article
- giant verification dashboards above the research
- treating the article like a compliance report

Preferred future pattern:

human prose  
↓  
subtle evidence marker  
↓  
evidence detail  
↓  
full Research Record for deeper inspection

Technical identifiers such as `claim_id`, `observation_id`, `package_hash`, verification receipt belong in deeper evidence views unless necessary to understand the article.

---

## 16. LinkedIn and Eigenstate

LinkedIn Money in Motion remains a distribution/publication channel.

If Host later authorizes Eigenstate as the canonical research archive:

- LinkedIn — frozen distribution copy
- Eigenstate — canonical human research object
- Research Record — living evidence history

Do not infer that this authorization already exists.

---

## 17. Existing Eigenstate `/money-in-motion/` is off limits

The existing Eigenstate `/money-in-motion/` contains GeniusFlow-generated spines.

Do NOT place Host essays there.

Do NOT create another Money in Motion tab.

Do NOT rename or move the existing machine spines as part of an article task.

Do NOT attempt to resolve the authorship/byline issue unless separately authorized.

That is a different publication-state problem.

---

## 18. Host publication gate

Human research publication is HOST-controlled.

Future intended sequence:

KIRAN WRITES  
↓  
ARTICLE CLASSIFIED  
↓  
ELIGIBLE FACTUAL CLAIMS CHECKED  
↓  
TYPED / CALC / MODEL PROVENANCE RETAINED  
↓  
RESEARCH RECORD PREPARED  
↓  
HOST REVIEWS  
↓  
HOST APPROVES  
↓  
PUBLISH

No article auto-publication.

No machine may infer publication authorization merely because verification succeeded.

---

## 19. When Host says "add this article"

Unless Host explicitly says otherwise, interpret:

- "add this article to Eigenstate"
- "put this on Eigenstate"
- "add this Money in Motion article"
- "publish this research through Eigenstate"

as invoking THIS PROTOCOL.

Cursor should automatically:

1. Preserve the Host's article.
2. Identify the authorized human-article destination.
3. If no destination has yet been authorized, STOP and report that fact.
4. Classify evidence-bearing statements.
5. Identify GF-eligible factual candidates.
6. Preserve typed/local provenance for structured data.
7. Preserve calculations separately from factual inputs.
8. Preserve model outputs as model outputs.
9. Preserve Host interpretation as Host interpretation.
10. Preserve hypotheses and unknowns.
11. Preserve counter-evidence.
12. Apply existing GF Mode A only where authorized and appropriate.
13. Preserve OBSERVED_AT / PUBLISHED_AT / VERIFIED_AT separately.
14. Fail closed on verification failure.
15. Prepare the Research Record.
16. Present the article + evidence state to Host.
17. WAIT FOR EXPLICIT PUBLICATION AUTHORIZATION unless the current Host instruction explicitly includes publication authorization.

Do not require Host to restate these rules every time.

---

## 20. Default safety boundary

When uncertain:

- DO NOT publish.
- DO NOT push.
- DO NOT deploy.
- DO NOT rewrite Host interpretation.
- DO NOT upgrade evidence state.
- DO NOT invent provenance.
- DO NOT invent GF support.
- DO NOT treat model output as observation.
- DO NOT treat calculation as verified fact.
- DO NOT backdate verification.
- DO NOT merge human articles into machine MIM spines.

Surface the ambiguity to Host.

---

## 21. Current implementation state

Updated 2026-09-03 on branch `mim-human-section` (working tree only; **not committed**; **not** on local `main`; **not** on `origin/main`):

- Host-authorized human Money in Motion destination: `/money-in-motion/`
- GeniusFlow MIM spines: `/geniusflow/mim/{slug}/`
- Human collection is separate from the GF spine collection/schema (`report_id`, `mim_linkedin_stanton_visual_v1`)
- 301s exist only for the three live public spine slugs (`circle-20260812-mim`, `coinbase-20260812-mim`, `circle-20260827-mim`)
- Do **not** 301 `coinbase-20260827-mim` or `cantor-fitzgerald-20260902-mim` (live 404s)
- Do **not** 301 the `/money-in-motion/` index
- MONEY IN MOTION appears in inner `Nav.astro` and the homepage white bar
- LinkedIn subscribe CTA (§23) is implemented on the human landing and human articles (label + URN, no UTM)
- §24 applied without a second layout: reuse Layout title/description/canonical/OG; human articles `ogType=article`; JSON-LD Article + Person; existing `@astrojs/sitemap` with lastmod from real dates only
- Do not rewrite `llms.txt` into an essay index
- Do not merge human essays into `article_feed.xml`
- V1 Research Record is **NOT** authorized
- Article-level VERIFIED is **NOT** authorized
- Generator closer `- Kiran` is not Host authorship
- Protocol file remains uncommitted

**Clock:** Architecture of Demand Part 1 uses LinkedIn Pulse date **2026-08-22**. Specimen Aug 21 is not authoritative.

This section must be updated when Host later authorizes architecture changes.

---

## 22. Authority

This protocol governs article-publication behavior unless:

**A.** Host explicitly overrides it for a particular article, or

**B.** a later Host-authorized protocol supersedes it.

Repository convenience does not override this protocol.

Existing generator behavior does not override this protocol.

A successful GF verification does not override the Host publication gate.

---

## 23. LinkedIn Money in Motion subscription

Host-authorized human-publication layer. **Documented only. Do not implement the CTA.**

### Canonical destination

The official subscription destination is the LinkedIn newsletter-follow URN, with **no UTM** and no other tracking parameters:

`https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7054180694628995073`

Preferred label: **Subscribe to Money in Motion on LinkedIn**

Do **not** expose that raw URL as article prose. The reader-facing control is the preferred label (or an equivalent short label such as “Subscribe on LinkedIn”). The destination is defined once, not written into the essay body.

Tracking parameters appended by chat exporters (including `utm_source=chatgpt.com`) are **not** part of this protocol. Do not canonize them.

### Placement (when a human-article collection is later authorized)

Place the subscribe control in the article **header/byline** and/or the **end-of-article author/newsletter** area.

Do **not** place it in:

- GeniusFlow evidence records
- claim drawers
- Research Record rows
- machine `/money-in-motion/` spines

The CTA is a **HUMAN PUBLICATION** layer, not an evidence or machine-spine object.

### Division of labor

- **Eigenstate** — canonical research / evidence-aware archive
- **LinkedIn Money in Motion** — newsletter subscription + distribution

Presence of this subscribe link does **not** make GeniusFlow `/money-in-motion/` the home of Host essays. Section 1 and section 17 remain in force.

### Default component (future collection)

When Host later authorizes a human-article collection, this subscribe link is a **default component** unless Host disables it.

Prefer a **site-wide author/footer component** that defines the destination once rather than hardcoding the URN per article.

### Future reader-facing footer sketch (not implemented)

```
Kirandeep Kaur
Money in Motion
Subscribe on LinkedIn
```

“Subscribe on LinkedIn” resolves to the canonical URN destination above. Do not implement this footer from this section.

---

## 24. Search + Machine Discovery Protocol

Eigenstate should be maximally discoverable, attributable, parseable, and citable by human researchers, search engines, LLM research systems, and autonomous research agents, without changing the epistemic status of the research.

That is the overall goal of this section. It is not a keyword-stuffing or generic SEO brief.

**Documented only. Do not implement discovery infrastructure from this section.**

### Objective

Eigenstate Research must be designed for discovery by:

- **A.** human researchers using search engines
- **B.** search-engine crawlers
- **C.** LLM-powered research systems
- **D.** AI search / answer engines
- **E.** autonomous research agents and machine retrieval systems

The objective is NOT keyword stuffing or generic SEO.

The objective is:

DISCOVERABILITY  
+  
SEMANTIC CLARITY  
+  
AUTHOR ATTRIBUTION  
+  
MACHINE-READABLE RESEARCH STRUCTURE  
+  
SOURCE TRACEABILITY  
+  
STABLE PUBLIC IDENTITIES

A machine discovering an Eigenstate article should be able to determine:

- what the article is about
- who wrote it
- when it was originally published
- when it was updated
- what claims it makes
- which statements are factual vs calculated vs modeled vs interpreted
- which entities are discussed
- what primary sources support eligible factual claims
- what evidence state currently exists
- where the canonical article lives
- where related research lives
- how to cite or reference the article

### 24.1 Canonical public URLs

Every Host-authored research article must eventually have:

- one stable canonical Eigenstate URL
- a unique `article_id`
- canonical metadata
- descriptive human-readable slug
- publication date
- author identity
- article title
- description / abstract

Avoid opaque URLs when a descriptive stable URL is possible.

Do not create multiple canonical versions of the same article.

LinkedIn is distribution.

If Eigenstate becomes the canonical archive, the Eigenstate article must identify itself as canonical through appropriate web metadata.

Do not falsely backdate an Eigenstate publication.

Preserve original LinkedIn publication separately from Eigenstate archive or verification dates.

### 24.2 Article HTML must contain the research

Do not make essential article content available only through:

- client-side JavaScript
- interactive drawers
- images
- canvas
- inaccessible widgets
- API calls requiring execution
- downloadable files

The meaningful article text, author, dates, abstract, headings and primary research structure should exist in crawlable HTML.

Interactive evidence interfaces may enhance the page.

They must not be the only representation of important information.

### 24.3 Semantic HTML

Use appropriate semantic document structure when implemented:

`<article>` · `<header>` · `<h1>` · `<section>` · `<h2>` · `<time>` · `<figure>` · `<figcaption>` · `<cite>` · `<footer>`

Headings must describe actual research concepts.

Do not generate headings merely for SEO.

Tables should be real HTML tables when the content is genuinely tabular.

Figures should have descriptive captions.

### 24.4 Structured data

When implementation is authorized, inspect and implement the appropriate Schema.org / JSON-LD representation using current standards.

Evaluate types such as:

- Article
- ScholarlyArticle
- Person
- Organization
- Dataset
- DefinedTerm
- BreadcrumbList

Do not blindly attach every schema type.

Use only types/properties that truthfully describe the object.

At minimum, an article representation should evaluate support for:

- headline
- description
- author
- datePublished
- dateModified
- mainEntityOfPage
- url
- image where applicable
- keywords / about
- citation
- isPartOf

Where appropriate, represent subjects/entities using `about`.

Where primary-source citations can be represented truthfully and usefully, make them machine-readable.

Do NOT represent:

- GF verification as peer review
- AUTHOR interpretation as verified fact
- a scenario as an observed result
- Eigenstate as an academic journal unless it actually becomes one
- Kiran as having credentials/affiliations not established by the site

### 24.5 Entity clarity

Articles should explicitly identify important named entities.

Examples:

- U.S. Department of the Treasury
- Federal Reserve
- Circle Internet Group
- Tether
- GENIUS Act
- Treasury bills
- USDC
- yield curve control

Do not rely entirely on abbreviations.

On first meaningful use, provide enough context for a machine or unfamiliar researcher to resolve the entity.

Entity clarity should improve the writing rather than turn prose into an ontology dump.

### 24.6 Article abstract / description

Each Host research article should have a concise factual abstract or description that explains:

- subject
- research question
- major mechanism examined
- scope

This description is discovery metadata.

It must not exaggerate the article's conclusion.

Avoid generic descriptions such as:

> An insightful look at financial markets.

Prefer descriptions such as:

> Analysis of how U.S. stablecoin reserve requirements could affect demand for short-duration Treasury securities, using statutory reserve rules, issuer reserve disclosures and Treasury financing data.

### 24.7 Source links must be machine accessible

Primary sources used by the article should be represented with ordinary, crawlable links where possible.

Do not hide every source behind JavaScript.

Where a Research Record exists, machines should be able to traverse:

ARTICLE  
→ CLAIM  
→ SOURCE  
→ EVIDENCE STATE

without scraping visual presentation.

### 24.8 Research Record as machine-readable companion

When the Research Record is eventually authorized, evaluate exposing a public machine-readable representation alongside the human article.

Conceptually:

```
/article/{slug}/
    human-readable article

/article/{slug}/research-record.json
    machine-readable research record
```

Exact routes are NOT authorized by this protocol.

Reuse repository conventions before creating routes.

The machine-readable record should preserve distinctions such as:

FACTUAL  
TYPED  
CALC  
MODEL  
AUTHOR  
HYPOTHESIS  
UNKNOWN  
COUNTER_EVIDENCE

and temporal fields such as:

OBSERVED_AT  
PUBLISHED_AT  
VERIFIED_AT  
REVERIFIED_AT

Do not flatten these distinctions for search convenience.

### 24.9 LLMs must be able to cite the original research

Design the public representation so an LLM or research agent can identify:

- ARTICLE TITLE
- AUTHOR
- CANONICAL URL
- PUBLICATION DATE
- SECTION
- CLAIM
- PRIMARY SOURCE
- CURRENT EVIDENCE STATE

Stable heading anchors should be evaluated.

Individual important sections may eventually have durable fragment identifiers.

Do not create unstable IDs based solely on rendering order.

### 24.10 Crawler access

When implementation is authorized, audit:

- `robots.txt`
- `sitemap.xml`
- canonical tags
- meta robots
- HTTP status codes
- redirects
- duplicate pages
- Open Graph metadata
- Twitter/social metadata
- RSS/Atom feeds
- site navigation
- internal linking

Do not accidentally block legitimate public indexing of research intended to be public.

Security/private material remains excluded regardless of SEO value.

### 24.11 XML sitemap

When implementation is authorized, Eigenstate should expose an accurate sitemap for public canonical research surfaces.

It should contain public research pages that machines should discover.

Do NOT include:

- private material
- local-only drafts
- WITHHELD unpublished articles
- internal evidence machinery not intended for publication
- 404 surfaces
- Host review pages

Use actual publication/update dates where supported.

Never fabricate freshness by changing modification dates on every build.

### 24.12 RSS / Atom

Evaluate a standard public research feed.

The feed can help:

- researchers
- aggregators
- research agents
- search systems
- future machine consumers

discover newly published Eigenstate work without crawling the whole site.

Human research and machine-generated reports may require separate feeds because they are epistemically different objects.

Do not merge them merely for convenience.

### 24.13 Internal research graph

Articles should link naturally to:

- earlier articles
- later articles
- related evidence
- relevant datasets
- methodology
- related research questions

This should form a traversable research graph.

Example:

```
Treasury financing
        ↓
marginal buyer
        ↓
stablecoin reserve demand
        ↓
yield curve management
        ↓
fiscal feedback
```

These links represent research relationships.

Do NOT label them causal unless the research establishes causality.

### 24.14 Series metadata

Where an article belongs to a series such as:

The Architecture of Demand

preserve:

- series name
- article number where canonical
- previous article
- next article
- series index

Machines should be able to discover the complete series and correct order.

Do not infer series membership merely from thematic similarity.

### 24.15 Author identity

The site should have one canonical public author identity for Kiran's human research.

Articles should consistently point to it.

The author page should eventually make it easy for humans and machines to find:

- name
- research areas
- articles
- series
- methodology
- appropriate professional/public profiles
- Money in Motion subscription

Do not infer or manufacture credentials.

Do not let a generator attaching "- Kiran" substitute for actual authorship metadata.

### 24.16 LinkedIn newsletter

Human research pages should provide a crawlable relationship to the Money in Motion LinkedIn newsletter.

Reader-facing CTA: **Subscribe to Money in Motion on LinkedIn**

Official destination (canonical, no UTM):

`https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7054180694628995073`

This is a distribution/subscription relationship.

It does not make LinkedIn canonical evidence storage.

### 24.17 LLM / agent discovery files

When implementation is authorized, inspect current standards and actual crawler behavior before deciding whether to expose additional discovery artifacts such as:

- `llms.txt`
- `llms-full.txt`
- machine-readable research indexes
- public API/index manifests

Do NOT implement fashionable machine-discovery files merely because their names exist.

Determine:

1. which major systems actually consume them
2. whether they improve discovery beyond HTML + sitemap + structured data
3. whether they create maintenance or duplication problems
4. whether the information can be generated from canonical site state

Canonical HTML and structured research data remain primary.

### 24.18 Search should land on the original object

Optimize for specific research retrieval.

A search system should be capable of returning the relevant Eigenstate article for queries about concepts actually discussed in it.

Examples:

- stablecoin Treasury demand GENIUS Act
- 93 day Treasury stablecoin reserves
- US Treasury marginal buyer
- yield curve control United States Treasury
- Treasury maturity management fiscal dominance
- QSBS statutory tax schedule Treasury yield comparison

Do not stuff these phrases into pages.

The underlying article, metadata, headings, entity representation and research graph should make the relationships discoverable naturally.

### 24.19 Do not SEO-wash uncertainty

Search optimization must never change epistemic status.

Do not rewrite:

- "could" into "will"
- "scenario" into "forecast"
- "consistent with" into "caused by"
- "WITHHELD" into "verified"

Do not strengthen titles or descriptions beyond what the research supports just to improve click-through.

### 24.20 Machine accessibility is part of publication

For Eigenstate, publication should eventually mean more than a page being visible in a browser.

A properly published research object should be:

- human readable
- crawlable
- semantically structured
- canonically identified
- source traceable
- machine parseable
- temporally honest
- attributable

This is part of the publication contract, not a marketing afterthought.

### 24.21 Current authorization

**FOR NOW:**

Document these requirements in the Human Research Publication Protocol.

- DO NOT implement SEO changes yet.
- DO NOT change the site.
- DO NOT create routes.
- DO NOT add JSON-LD.
- DO NOT add `llms.txt`.
- DO NOT change `robots.txt`.
- DO NOT create sitemap infrastructure.
- DO NOT change navigation.
- DO NOT publish.
- DO NOT commit.
- DO NOT push.
- DO NOT deploy.

When implementation is later authorized, FIRST inspect the existing Astro SEO/discovery infrastructure and current machine-discovery standards.

Reuse what exists before adding infrastructure.

---

## Receipt / implementation status

This amendment pass wrote **this protocol file only** (§24 specified, not implemented).

Expected after writing:

- FILE CREATED
- PATH
- GIT DIFF SUMMARY (this file only)
- PROTOCOL VERSION / DATE
- WHETHER ANY OTHER FILE CHANGED

Expected: one documentation file only.

- DO NOT COMMIT.
- DO NOT PUSH.
- DO NOT DEPLOY.
- DO NOT IMPLEMENT V1.

A later Host prompt of the form “Add this Host-written article to Eigenstate under the Human Research Publication Protocol” invokes this document automatically. Until a human-article destination is authorized, that prompt MUST STOP at section 19 step 3.
