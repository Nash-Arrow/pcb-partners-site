# PCB Partners — New Website Design Spec

**Date:** 2026-04-24
**Domain:** `pcb.partners` (already purchased)
**Existing site (source of all content):** https://www.pcbpartners.co.uk/
**Status:** Design approved; ready for implementation planning.

---

## 1. Context & motivation

PCB Partners is a London-headquartered boutique M&A advisory firm serving the digital-first economy. The firm has real international exposure — deals with Reply (Italy), Wavestone (France), Atos, HPE Middle East/Africa, Collabera (India), Insight (US) — but the current site at `pcbpartners.co.uk` reads as a UK firm that also does some international work. The founder (Ben Doltis) has said the site does not reflect the firm's market positioning or international footprint.

We are building a complete replacement website on the new, more international domain `pcb.partners`, positioned as a **strategic repositioning** rather than a visual refresh. The goal is to present PCB as a sector-authority boutique with cross-border as its default operating mode and an operator-founded team as its differentiator.

The work is being done proactively to be presented to Ben as part of partner-level negotiations. It is a pitch piece that is also production-ready — if Ben signs off, it should be able to go live.

## 2. Goals

1. **Reposition the narrative** from "UK firm doing international work" to "sector-focused cross-border M&A boutique, operator-led."
2. **Mirror the existing visual brand** exactly (typography, logo, palette) so Ben recognises it as PCB at first glance.
3. **Use only content already public** on `pcbpartners.co.uk`. No fabricated deals, testimonials, or stats.
4. **Host free** on Cloudflare Pages, connected to `pcb.partners`.
5. **Full 13-page parity** with the existing site — no information lost.
6. **Sub-1.5 second LCP** and Lighthouse Performance ≥ 95.

## 3. Non-goals

- Redesigning the logo or brand marks.
- Changing regulatory disclosures (FCA 948557, Finalis Securities LLC).
- Producing new deal data, testimonials, or stats not sourced from the existing site.
- Building a full CMS. Content lives in files; editing requires a rebuild.
- A custom contact-form backend for v1 (mailto only — see §12).

## 4. Positioning narrative

Three beats, in order, on every page that carries them:

1. **Sector authority** — we are specialists in four sectors: Technology Services, Management Consulting, Digital/Media/Marketing, and Human Capital Management. Sectors lead.
2. **Cross-border proof** — most mandates span at least one border. Deals are tagged with their geographic arc (UK → US, UK → Italy, UK → India, UK → France, etc.) as a visual signal throughout.
3. **Operator-led** — the partners have built, scaled, and sold their own consulting and technology services businesses. They have sat in the founder's chair.

These are the narrative-spine. Every page reinforces them in the same order. The repetition is deliberate — it lands the repositioning.

## 5. Content strategy

**Copy treatment: reframe, don't rewrite** (approach "B" from brainstorming). Keep all factual claims and distinctive phrases from the existing site ("We've been there, done it"). Reorder sections so sectors lead, international proof follows, operator-founders close. Tighten tone from chatty/UK to confident-modern/international. Approximately 70% of source copy retained, 30% reshaped. No new facts introduced.

**Source of truth:** `https://www.pcbpartners.co.uk/` (snapshot archived in `.design-audit/home.html`). All team names, deal references, testimonials, regulatory details, and contact info are lifted from that source.

**Stat placeholders flagged:** the Home and Deals heroes include metrics (deal count, countries, aggregate value, % cross-border). These are illustrative in mockups. Before Ben sees the site we either (a) populate them with real numbers drawn from the existing site's deal list, or (b) remove them. We never ship unsubstantiated figures.

## 6. Information architecture

```
/                                   Home
/sectors/                           Sectors overview
/sectors/technology-services/
/sectors/management-consulting/
/sectors/digital-media-marketing/
/sectors/human-capital-management/
/services/                          Services overview
/services/sell-side/
/services/buy-side/
/services/private-equity/
/deals/                             Track record (filterable)
/team/                              Partners + team
/insights/                          News / insights (mirrored from current /news)
/insights/[slug]/                   Individual article pages
/contact/                           Contact + regulatory
```

**Top nav order:** `Sectors · Services · Deals · Team · Insights` as centre links, with `Contact` rendered as a right-aligned bordered CTA button. All six items are reachable from every page; the visual split (links vs. CTA) emphasises Contact as a call-to-action rather than a peer link.

Putting "Sectors" in the first slot (currently "What We Do" is first) is the single most important navigational signal of the reposition.

**One new IA element, zero removed:** `/services/` becomes a real landing page. On the current site, "What We Do" is a menu header only. All existing pages are preserved.

## 7. Design system

The brand system is mirrored from `pcbpartners.co.uk` via direct CSS inspection (see `.design-audit/design-system.md`).

### Typography

**Brand display face: Pulp Display** (custom). Self-hosted in `public/fonts/`.

- `PulpDisplayLight` — weight 200 — headlines, lede copy
- `PulpDisplayExtraLight` — weight 300 — large display accents
- `PulpDisplayExtraBold` — weight 700 — small caps, eyebrows, emphasis

Body/UI fallback stack: `Inter, Helvetica Neue, Arial, sans-serif`.

Fonts are downloaded from the existing site and self-hosted. Files required:
- `pulp-display-light-webfont.woff2` + `.woff`
- `pulp-display-extra-light-webfont.woff2` + `.woff`
- `pulp-display-extra-bold-webfont.woff2` + `.woff`

Loaded with `font-display: swap` to match current behaviour.

### Palette (Tailwind extension)

| Token | Hex | Role |
|---|---|---|
| `pcb.ink` | `#00000A` | Primary dark — logo fill, headlines, body text |
| `pcb.blue` | `#0090FF` | Brand accent — links, eyebrows, chips, key CTAs |
| `pcb.blue-alt` | `#3B91F7` | Hover/alt blue |
| `pcb.blue-light` | `#66BCFF` | Tints on dark backgrounds |
| `pcb.paper` | `#FFFFFF` | Dominant background |
| `pcb.surface` | `#F5F5F5` | Soft section background |
| `pcb.border` | `#E4E4E4` | Dividers, card borders |
| `pcb.muted` | `#7A7A7A` | Secondary text |

### Logo

Inline SVG wordmark, `fill="#00000A"`, viewBox `0 0 164.4 123.9`. Saved at `.design-audit/logo.svg`; copied to `public/logo.svg` at build time.

### Motif

The logo is a wordmark *inside a rectangular frame*. This framing motif is echoed subtly through the site: bordered cards, framed pull-quotes, rectangle-outline buttons, chip shapes. The motif reinforces brand recognition without being literal.

## 8. Home page structure

Ten blocks, in this order:

1. **Nav** — PCB logo left, nav links centre (`Sectors · Services · Deals · Team · Insights`), Contact CTA right.
2. **Hero** — eyebrow "GLOBAL BOUTIQUE M&A · SECTOR-FOCUSED"; Pulp Display Light headline with an italic accent ("We advise the firms building *the digital economy.*"); supporting paragraph naming the four sectors and three services; two CTAs (primary: "See our track record"; secondary: "Speak to a partner"); 4-metric proof strip (deals, countries, sectors, operator years) — **flagged as placeholder data**.
3. **Sectors (lead)** — 2×2 grid. Each card: sector name (Pulp Light), one-line positioning, representative deal list. Sectors lead because sector authority is beat #1.
4. **Cross-border (dark block)** — `#00000A` background. Eyebrow "02 — GLOBAL REACH". Section title "Selected cross-border mandates." 3-column grid of geographic arc pairs (UK → Italy, US → UK, UK → India, etc.), each card showing source geography, client/buyer pair. Visual proof without a generic world map.
5. **Services** — 3-column cards for Sell-side, Buy-side, Private Equity. Concise.
6. **Operators (soft gray block)** — `#F5F5F5` background. Headline "Advisors who've *sat in your chair.*" Short paragraph on operator-founder credentials. Horizontal portrait stack (overlapping circles) + partner names inline. Link to `/team/`.
7. **Client logo wall** — grid of 11+ client logos (Reply, Wavestone, Atos, HPE, Apax, LDC, Collabera, Insight, Proxima, Gresham House, Palatine) sourced from the existing site.
8. **Insights teaser** — 3 latest articles, mirrored from `/news/` on the current site.
9. **Closing CTA (blue block)** — `#0090FF` background, white type. "Thinking about a transaction? Let's talk." Contact button.
10. **Footer** — `#00000A` background. Logo; condensed nav; contact (team@pcbpartners.co.uk, +44 203 795 9084); regulatory line (FCA 948557, Finalis Securities LLC member FINRA/SIPC).

## 9. Inner page template (sectors + services)

One template, seven pages rendered from it (4 sectors + 3 services). Five blocks:

1. **Hero** — breadcrumb (`SECTORS · [CURRENT]`), Pulp Display headline with italic accent, lede paragraph (≤ 3 sentences).
2. **Three points** — "Three reasons founders choose PCB for this sector/service." The three points are always: **Deep sector fluency · Cross-border buyers · Operator DNA**. Copy under each adapts per page, but the three beats stay constant — this is the narrative-spine repeating.
3. **Selected transactions** — 4–6 deals relevant to the page. Each row: buyer logo, "company → buyer", sector + geography chips, year. Links to `/deals/` with filter pre-applied.
4. **Quote + related** — two-column: left is a testimonial from the existing site with a blue left-rule; right is a short list of related adjacent pages.
5. **Contact strip (dark)** — "Thinking about a deal in this sector? Speak to a sector partner." Email CTA.

Sector/service overview pages (`/sectors/` and `/services/`) use a shortened variant: hero + grid of sub-pages + shared closing CTA.

## 10. Deals page (`/deals/`)

The cross-border showpiece. Three sections:

1. **Hero + stats** — "Every deal tells a *cross-border story.*" 4-stat row: deals advised, countries, aggregate deal value, percent cross-border. Stats flagged as placeholders until substantiated.
2. **Filters** — pill-style filter bar: All / Sell-side / Buy-side / PE / Tech Services / Consulting / Digital/Media / HCM / Cross-border. Client-side filtering via small vanilla-JS island (~2KB).
3. **Deal grid** — 3-column responsive grid. Each card:
   - Year (top-right, blue, Pulp ExtraBold)
   - Deal type eyebrow (SELL-SIDE / BUY-SIDE / PE)
   - Headline: `Company A → Company B` with blue arrow
   - Chips: sector (gray), **geography (light-blue fill, blue text)** — geography chip is the visual signal that makes cross-border legible at a glance.
   - Optional description on hover/detail.

Filter state persists in URL hash so links from sector/service pages can deep-link (e.g., `/deals/#sector=tech-services`).

## 11. Team page (`/team/`)

Operator-led showpiece. Four sections:

1. **Hero** — breadcrumb "PARTNERS & TEAM", headline "Advisors who've *run the companies* they now advise.", lede paragraph.
2. **Manifesto (dark block)** — `#00000A` background. Short eyebrow "THE PCB DIFFERENCE". A Pulp Light italic pull-quote attributed to Ben Doltis. The quote should express the operator-advisor thesis in Ben's voice; exact wording to be finalised from existing-site source and Ben's stated views. **If no existing Ben quote fits, we remove the manifesto rather than invent one.**
3. **Partners** — 3-column grid. Each card: portrait (real headshot if provided; otherwise monogram on `#E4E4E4` circle), name (Pulp Light), role eyebrow, one-line operator-background note, LinkedIn link. Bios are mirrored from current site where available; "bio from pcbpartners.co.uk" placeholder otherwise.
4. **Team** — smaller grid of non-partner team members (Dani, Greta, Andrew and others as listed on current site).

## 12. News / Insights (`/insights/`)

- `/insights/` is a listing of articles mirrored from `/news/` on the current site.
- `/insights/[slug]/` are individual article pages generated from Astro content collections.
- Each article has: title, date, author (if attributed on the current site — otherwise omitted), body (copied verbatim), tags (sector/service).
- No new articles written. If the current site has few items, the listing is short — that is fine.

## 13. Contact page (`/contact/`)

- Headline + two-column layout: left is short copy (why get in touch, regulatory note); right is a contact block with email, phone, address.
- **Form: mailto-backed for v1.** A styled `<form>` posts to `mailto:team@pcbpartners.co.uk` with subject and body populated from fields. No backend. Zero spam protection. Sufficient for the pitch and a reasonable production v1.
- **Regulatory footer** repeats the FCA / Finalis disclosure.

Post-v1 upgrade path: Cloudflare Workers + Turnstile + email forwarding (free on Cloudflare), or a third-party service (Formspree). Not required for v1.

## 14. Technical architecture

### Stack

- **Framework:** Astro (latest stable). Ships near-zero JavaScript by default, ideal for a static content site.
- **Styling:** Tailwind CSS, extended with the PCB palette and Pulp Display font stack.
- **Interactive islands:** vanilla JS (or Alpine.js if helpful) for the Deals filter and mobile-nav toggle. No React/Vue/Svelte runtime.
- **Content:** Astro content collections with Zod schemas for `sectors`, `services`, `deals`, `team`, `insights`.
- **Deployment:** Cloudflare Pages, connected to a GitHub repo.
- **Domain:** `pcb.partners` via Cloudflare DNS (domain was purchased through Cloudflare).

### Project structure

```
pcb-partners-site/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── InnerPageLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── sectors/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── services/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── deals/index.astro
│   │   ├── team/index.astro
│   │   ├── insights/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── contact/index.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── sectors/*.md
│   │   ├── services/*.md
│   │   ├── deals/*.yml
│   │   ├── team/*.md
│   │   └── insights/*.md
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── SectorCard.astro
│   │   ├── ServiceCard.astro
│   │   ├── DealCard.astro
│   │   ├── DealFilter.astro
│   │   ├── PartnerCard.astro
│   │   ├── LogoWall.astro
│   │   └── ContactStrip.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── fonts/ (Pulp Display .woff2 files)
│   ├── logos/ (client logos, transparent PNG/SVG)
│   ├── logo.svg
│   └── favicon.{ico,png}
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── README.md
└── .gitignore
```

### Content schemas (`src/content/config.ts`)

- `sector`: `{ slug, title, order, oneLiner, lede, dealSlugs: string[] (references into the deal collection), testimonial? }`
- `service`: `{ slug, title, order, oneLiner, lede, dealSlugs: string[] (references into the deal collection), testimonial? }`
- `deal`: `{ slug, companyA, companyB, year, type: 'sell-side'|'buy-side'|'pe', sector, geoFrom, geoTo, description? }`
- `team`: `{ slug, name, role, isPartner: boolean, order, bio, linkedIn?, portrait? }`
- `insight`: `{ slug, title, date, author, tags[], body }`

All collections validated at build time via Zod.

## 15. Assets to gather before build

- **Pulp Display fonts (6 files)** — download from existing site to `public/fonts/`.
- **PCB logo SVG** — extracted to `.design-audit/logo.svg`; copy to `public/logo.svg`.
- **Favicon set** — `/wp-content/uploads/2023/12/cropped-faviconpcb-*.png` (32, 180, 192, 270). Copy to `public/`.
- **Client logos** — 11 from existing site's `/wp-content/uploads/`. Source as-is from the site; where only raster available, find transparent-background versions online per user's earlier instruction. Save to `public/logos/`.
- **Existing page HTML** — archived snapshot at `.design-audit/home.html` for copy reference.

## 16. Deployment — Cloudflare Pages

1. Initialise git repo locally; push to GitHub (`pcb-partners-site` or similar).
2. In Cloudflare dashboard → Pages → Create project → Connect GitHub repo.
3. Build settings: build command `npm run build`, output directory `dist`.
4. First deploy produces a `*.pages.dev` preview URL — this is the first link to send Ben.
5. Once Ben approves: Pages project → Custom domains → add `pcb.partners`. If the domain is registered through Cloudflare, DNS is auto-configured. If registered elsewhere, point the domain's nameservers to Cloudflare (free, standard) and Cloudflare then manages records. SSL is auto-provisioned either way.
6. Every push to `main` auto-deploys. Every branch push gets a preview URL for review.

**Cost:** £0. Cloudflare Pages free tier: 500 builds/month, unlimited bandwidth, unlimited requests.

## 17. SEO + meta

- Per-page `<title>` and `<meta description>` set via Astro page props.
- Open Graph tags: `og:title`, `og:description`, `og:image` (a branded social card to generate), `og:url`.
- Twitter card meta.
- `sitemap.xml` auto-generated via `@astrojs/sitemap`.
- `robots.txt` allowing all crawlers, linking to sitemap.
- Canonical URLs pointing to `pcb.partners`.
- JSON-LD `Organization` structured data on the Home page (name, url, logo, sameAs LinkedIn).

## 18. Performance targets

- Lighthouse Performance: ≥ 95 on mobile.
- LCP: < 1.5s on simulated 4G.
- CLS: < 0.05.
- Total page weight: < 400KB on Home.
- JavaScript: ≤ 10KB per page (Deals page is the exception, at ~15KB with filter island).

Self-hosted fonts with `font-display: swap` and `preload` on the Light weight prevent FOIT and keep LCP tight.

## 19. Open questions / caveats

1. **Hero stats** on Home and Deals pages are illustrative. We must either substantiate them from the existing site or drop them before showing Ben.
2. **Ben's manifesto quote** on the Team page is written in the spec but is paraphrased, not sourced. Before showing Ben, we either find a real quote of his from the existing site or drop the manifesto block entirely.
3. **Partner headshots** are monogrammed by default. The design is dignified without real photos, but real photos are a clear upgrade when/if Ben provides them.
4. **Pulp Display licensing** — the font is hosted on the existing pcbpartners.co.uk site and clearly in use commercially by PCB. We assume the firm owns a commercial licence and that self-hosting the same files on `pcb.partners` is within that licence (both are PCB properties). If the licence is site-specific, we switch to a visually similar freely-licensed face (e.g., Neue Haas Grotesk substitute). Flag for Ben when we present.
5. **Contact form backend** — v1 is `mailto:`. If Ben wants a real form before launch, add a Cloudflare Worker (~30 min work).
6. **News items** — the existing `/news/` will be scraped and mirrored. Article count and publishing cadence is whatever the current site has; we don't produce new content.

## 20. What Ben sees

Ben opens a single link (preview URL on Cloudflare, or `pcb.partners` once DNS propagates). Page loads in under a second. Nav feels snappy. The brand is unmistakably PCB — same logo, same blue, same Pulp Display wordmark. But the order of information has changed: sectors lead, cross-border pairings appear everywhere, and the Team page opens with a pull-quote about operators advising operators. The site says, without saying, "this is a sector boutique that operates globally by default, run by people who've been in your seat."

---

## Appendix A — Design-system audit reference

Full extraction: `.design-audit/design-system.md`
Raw HTML archive: `.design-audit/home.html`
Logo SVG: `.design-audit/logo.svg`
Extracted CSS: `.design-audit/app.css`

## Appendix B — Brainstorming artifacts

Visual companion mockups preserved at:
`.superpowers/brainstorm/<session>/content/`

Key files:
- `visual-direction.html` — three-direction comparison (B selected)
- `design-system.html` — brand system confirmation
- `home-wireframe.html` — Home page narrative wireframe
- `inner-templates.html` — sector/service template
- `deals-team.html` — Deals + Team showpieces
