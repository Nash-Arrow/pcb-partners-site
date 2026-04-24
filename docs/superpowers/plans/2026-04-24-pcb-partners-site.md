# PCB Partners Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 13-page Astro + Tailwind static site for PCB Partners, mirroring the existing brand and deployed free at `pcb.partners` on Cloudflare Pages.

**Architecture:** Astro for static generation and content collections, Tailwind for utility-first styling with a custom PCB design token set, vanilla-JS islands only where interactivity is needed (Deals filter, mobile nav). Content (sectors, services, deals, team, insights) lives in typed content collections so pages are rendered from structured data.

**Tech Stack:** Astro 4.x · Tailwind CSS · TypeScript · Zod (via Astro content collections) · Vitest (for the Deals filter) · Cloudflare Pages.

**Repo root:** `/Users/laptop/Downloads/PCB Partners Website/`
**Spec:** `docs/superpowers/specs/2026-04-24-pcb-partners-site-design.md`
**Brainstorm artefacts:** `.superpowers/brainstorm/<session>/content/*.html` (gitignored)
**Design audit:** `.design-audit/` (gitignored) — contains `design-system.md`, `logo.svg`, `home.html`, `app.css`

---

## Prerequisites (one-time, before starting Task 1)

- Node.js 20.x or higher installed (`node --version`).
- npm 10.x or higher.
- Git configured.
- GitHub account (for pushing the repo, needed at Task 24).
- Cloudflare account (free tier fine; needed at Task 24).

---

## Phase 1 — Foundation

### Task 1: Scaffold Astro + Tailwind project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `src/env.d.ts`, `src/pages/index.astro`, `src/styles/global.css`
- Modify: `.gitignore` (add `node_modules/`, `dist/`, `.astro/` — already present in our `.gitignore`)

- [ ] **Step 1: Initialize Astro project in place**

Run from `/Users/laptop/Downloads/PCB Partners Website/`:

```bash
npm create astro@latest -- --template minimal --no-install --no-git --typescript strict --yes .
```

If the CLI refuses to run in a non-empty directory (it may, due to `docs/` and `.gitignore`), use:

```bash
mkdir _astro-scaffold && cd _astro-scaffold && npm create astro@latest -- --template minimal --no-install --no-git --typescript strict --yes . && shopt -s dotglob && mv * ../ && cd .. && rmdir _astro-scaffold
```

This leaves us with `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, and `public/` at the repo root.

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Add Tailwind integration**

```bash
npx astro add tailwind --yes
```

This creates `tailwind.config.mjs` and updates `astro.config.mjs`.

- [ ] **Step 4: Replace `src/styles/global.css` with PCB base styles**

Write the file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    @apply bg-pcb-paper text-pcb-ink;
  }
}
```

- [ ] **Step 5: Import global.css in `src/pages/index.astro`**

Replace the file contents with:

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>PCB Partners — scaffold</title>
  </head>
  <body>
    <h1 class="text-3xl font-bold p-8">PCB Partners scaffold</h1>
  </body>
</html>
```

- [ ] **Step 6: Verify dev server boots**

```bash
npm run dev
```

Expected: Astro reports "Local: http://localhost:4321/" and the page shows "PCB Partners scaffold" in bold. Kill with Ctrl-C.

- [ ] **Step 7: Verify production build succeeds**

```bash
npm run build
```

Expected: output in `dist/index.html`, no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json tailwind.config.mjs src/ public/ .gitignore
git commit -m "Scaffold Astro + Tailwind project"
```

---

### Task 2: Configure design tokens (Tailwind extensions)

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Replace `tailwind.config.mjs` with PCB token config**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        pcb: {
          ink:         '#00000A',
          blue:        '#0090FF',
          'blue-alt':  '#3B91F7',
          'blue-light':'#66BCFF',
          'blue-tint': '#E6F2FF',
          paper:       '#FFFFFF',
          surface:     '#F5F5F5',
          border:      '#E4E4E4',
          muted:       '#7A7A7A',
        }
      },
      fontFamily: {
        display:       ['PulpDisplayLight',     'Helvetica Neue', 'serif'],
        'display-xl':  ['PulpDisplayExtraLight','Helvetica Neue', 'serif'],
        'display-bold':['PulpDisplayExtraBold', 'Helvetica Neue', 'sans-serif'],
        sans:          ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:          ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        'brand-eyebrow': '0.2em',  // for small uppercase labels
      },
      maxWidth: {
        prose: '68ch',
      },
    }
  },
  plugins: [],
};
```

- [ ] **Step 2: Quick-verify tokens work**

In `src/pages/index.astro`, temporarily change the `<h1>` to:

```astro
<h1 class="text-3xl font-display text-pcb-blue p-8">PCB Partners scaffold</h1>
```

Run `npm run dev` and confirm the heading is now blue (`#0090FF`). Revert the font class if you like, but keep the colour to prove the token works. Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs src/pages/index.astro
git commit -m "Configure PCB design tokens in Tailwind"
```

---

### Task 3: Gather brand assets (fonts, logo, favicons)

**Files:**
- Create: `public/fonts/pulp-display-light.woff2`, `pulp-display-light.woff`
- Create: `public/fonts/pulp-display-extra-light.woff2`, `pulp-display-extra-light.woff`
- Create: `public/fonts/pulp-display-extra-bold.woff2`, `pulp-display-extra-bold.woff`
- Create: `public/logo.svg`
- Create: `public/favicon-32.png`, `public/favicon-192.png`, `public/apple-touch-icon.png`
- Modify: `src/styles/global.css` (add `@font-face` declarations)

- [ ] **Step 1: Download Pulp Display font files**

```bash
mkdir -p public/fonts
BASE=https://www.pcbpartners.co.uk/wp-content/themes/pcb-surface/assets/fonts/pulp-font
curl -sL "$BASE/pulp-display-light-webfont.woff2"       -o public/fonts/pulp-display-light.woff2
curl -sL "$BASE/pulp-display-light-webfont.woff"        -o public/fonts/pulp-display-light.woff
curl -sL "$BASE/pulp-display-extra-light-webfont.woff2" -o public/fonts/pulp-display-extra-light.woff2
curl -sL "$BASE/pulp-display-extra-light-webfont.woff"  -o public/fonts/pulp-display-extra-light.woff
curl -sL "$BASE/pulp-display-extra-bold-webfont.woff2"  -o public/fonts/pulp-display-extra-bold.woff2
curl -sL "$BASE/pulp-display-extra-bold-webfont.woff"   -o public/fonts/pulp-display-extra-bold.woff
ls -la public/fonts/
```

Expected: six files, each > 10KB.

- [ ] **Step 2: Copy logo SVG from design-audit**

```bash
cp .design-audit/logo.svg public/logo.svg
```

- [ ] **Step 3: Download favicon set**

```bash
curl -sL "https://www.pcbpartners.co.uk/wp-content/uploads/2023/12/cropped-faviconpcb-32x32.png"   -o public/favicon-32.png
curl -sL "https://www.pcbpartners.co.uk/wp-content/uploads/2023/12/cropped-faviconpcb-192x192.png" -o public/favicon-192.png
curl -sL "https://www.pcbpartners.co.uk/wp-content/uploads/2023/12/cropped-faviconpcb-180x180.png" -o public/apple-touch-icon.png
```

- [ ] **Step 4: Append @font-face declarations to `src/styles/global.css`**

Add at the top of the file (above `@tailwind base`):

```css
@font-face {
  font-family: 'PulpDisplayLight';
  src: url('/fonts/pulp-display-light.woff2') format('woff2'),
       url('/fonts/pulp-display-light.woff') format('woff');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'PulpDisplayExtraLight';
  src: url('/fonts/pulp-display-extra-light.woff2') format('woff2'),
       url('/fonts/pulp-display-extra-light.woff') format('woff');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'PulpDisplayExtraBold';
  src: url('/fonts/pulp-display-extra-bold.woff2') format('woff2'),
       url('/fonts/pulp-display-extra-bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 5: Smoke-test font loading**

Update `src/pages/index.astro` body:

```astro
<body>
  <h1 class="text-6xl font-display text-pcb-ink p-8">
    PCB Partners <em class="italic">scaffold</em>
  </h1>
  <h2 class="text-3xl font-display-bold text-pcb-blue px-8">Extra Bold weight</h2>
</body>
```

Run `npm run dev`, open in browser, confirm:
- The first headline is in Pulp Display Light (thin, elegant)
- "scaffold" is italic
- The second headline is Pulp Display Extra Bold (chunky) and blue

Kill server, revert `index.astro` to a minimal state (we rebuild the Home page in Phase 4).

- [ ] **Step 6: Commit**

```bash
git add public/fonts public/logo.svg public/favicon-32.png public/favicon-192.png public/apple-touch-icon.png src/styles/global.css src/pages/index.astro
git commit -m "Add Pulp Display fonts, logo SVG, favicon set"
```

---

### Task 4: Gather client logos

**Files:**
- Create: `public/logos/reply.png`, `wavestone.png`, `atos.png`, `hpe.png`, `apax.png`, `ldc.png`, `collabera.png`, `insight.png`, `proxima.png`, `gresham-house.png`, `palatine.png`
- Create: `public/logos/README.md` (documents source and substitution policy)

- [ ] **Step 1: Download raster logos from existing site**

```bash
mkdir -p public/logos
BASE=https://www.pcbpartners.co.uk/wp-content/uploads
curl -sL "$BASE/2020/12/Reply_-_LOGO_300dpi_thumbnail-150x78.jpg" -o public/logos/reply.jpg
curl -sL "$BASE/2022/09/Wavestone-150x34.jpg"                    -o public/logos/wavestone.jpg
curl -sL "$BASE/2022/12/Atos-logo-150x50.png"                    -o public/logos/atos.png
curl -sL "$BASE/2020/10/HPElogo-150x113.png"                     -o public/logos/hpe.png
curl -sL "$BASE/2022/11/apax-01-150x100.png"                     -o public/logos/apax.png
curl -sL "$BASE/2020/10/LDC-logo-150x77.png"                     -o public/logos/ldc.png
curl -sL "$BASE/2023/10/COLLABERA_DIGITAL_FINAL_LOGO_-02-150x73.jpeg" -o public/logos/collabera.jpg
curl -sL "$BASE/2023/10/Insight_Logo38-150x49.jpeg"              -o public/logos/insight.jpg
curl -sL "$BASE/2022/11/Proxima-new-150x55.png"                  -o public/logos/proxima.png
curl -sL "$BASE/2020/10/Gresham-house-logo-150x79.png"           -o public/logos/gresham-house.png
curl -sL "$BASE/2020/10/Palatine-logo-150x92.png"                -o public/logos/palatine.png
ls -la public/logos/
```

- [ ] **Step 2: Upgrade to transparent-PNG or SVG where the source is JPG (on a white background)**

The JPGs (Reply, Wavestone, Collabera, Insight) render fine on our paper background but look dirty on dark sections. For each, find a transparent-PNG or SVG version via a public brand resource (official press kit, Wikipedia, Brandfetch, seeklogo) and replace the JPG. Keep the filename stable.

Acceptable fallback: if a clean transparent version isn't findable in 5 minutes for a given logo, leave the JPG and add it to the "replace-me" list in the README (Step 4).

- [ ] **Step 3: Normalise sizes**

All logos render in a ~120×48px footprint on the site. Leave them at their downloaded size; the CSS will constrain via `object-fit: contain`.

- [ ] **Step 4: Write `public/logos/README.md`**

```markdown
# Client logos

All logos are used under fair-use for client-identification purposes on PCB Partners marketing material (mirroring the practice on pcbpartners.co.uk).

## Sources

Files downloaded from the existing pcbpartners.co.uk media library unless otherwise noted. Where the original was a JPG on white, a transparent-PNG or SVG equivalent was sourced from the client's official brand assets.

## Replace-me (low-quality sources)

_List any logos you couldn't upgrade here, so we can revisit:_

- (none if all upgraded)
```

- [ ] **Step 5: Commit**

```bash
git add public/logos/
git commit -m "Add client logos used on existing PCB site"
```

---

## Phase 2 — Content model

### Task 5: Content collection schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const sector = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    oneLiner: z.string(),
    lede: z.string(),
    dealSlugs: z.array(z.string()).default([]),
    testimonial: z.object({
      quote: z.string(),
      attribution: z.string(),
    }).optional(),
  }),
});

const service = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    oneLiner: z.string(),
    lede: z.string(),
    dealSlugs: z.array(z.string()).default([]),
    testimonial: z.object({
      quote: z.string(),
      attribution: z.string(),
    }).optional(),
  }),
});

const deal = defineCollection({
  type: 'data',
  schema: z.object({
    companyA: z.string(),
    companyB: z.string().optional(),      // absent for non-transaction mandates
    year: z.number().int(),
    type: z.enum(['sell-side', 'buy-side', 'pe']),
    sector: z.enum(['technology-services', 'management-consulting', 'digital-media-marketing', 'human-capital-management']),
    geoFrom: z.string().optional(),        // e.g. "UK"
    geoTo: z.string().optional(),          // e.g. "US"
    description: z.string().optional(),
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    isPartner: z.boolean().default(false),
    order: z.number(),
    bio: z.string(),                       // one to three sentences, plain text
    manifesto: z.string().optional(),      // only set on the founder; pull-quote block
    portrait: z.string().optional(),       // path under /public/team/
    linkedIn: z.string().url().optional(),
  }),
});

const insight = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),                      // ISO date "YYYY-MM-DD"
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { sector, service, deal, team, insight };
```

- [ ] **Step 2: Build to confirm schemas parse**

```bash
npm run build
```

Expected: build succeeds with no content yet (collections empty is allowed).

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "Define content collection schemas"
```

---

### Task 6: Populate sector + service content

**Files:**
- Create: `src/content/sector/technology-services.md`, `management-consulting.md`, `digital-media-marketing.md`, `human-capital-management.md`
- Create: `src/content/service/sell-side.md`, `buy-side.md`, `private-equity.md`

- [ ] **Step 1: Write the four sector files**

`src/content/sector/technology-services.md`:

```markdown
---
title: Technology Services
order: 1
oneLiner: IT services, systems integrators, and digital transformation firms scaling across borders.
lede: We advise IT services firms, systems integrators, and digital transformation specialists on sell-side processes, buy-and-build platforms, and PE-backed growth — across UK, EMEA, and the US.
dealSlugs:
  - amdaris-insight
  - pracedo-collabera
  - edenhouse-accenture
  - inciper
---

## Why us for Technology Services

Three reasons founders choose PCB for this sector.

### Deep sector fluency

We understand utilisation rates, bench dynamics, and the difference between a body shop and a platform.

### Cross-border buyers

We run processes internationally by default. US acquirers, European strategics, global PE.

### Operator DNA

Our partners have built, scaled, and exited services firms themselves. We've sat in your chair.
```

`src/content/sector/management-consulting.md`:

```markdown
---
title: Management Consulting
order: 2
oneLiner: Specialist consultancies ready for their next chapter — partner-led exits and platform build-ups.
lede: We advise specialist management consultancies on founder-led exits, merger-of-equals, and private equity partnerships. Our partners have built and sold consulting firms themselves.
dealSlugs:
  - proxima
  - pracedo-collabera
---

## Why us for Management Consulting

Three reasons founders choose PCB for this sector.

### Deep sector fluency

We understand leverage models, practice-area economics, and the mechanics of a partner-led firm.

### Cross-border buyers

Global consulting strategics, European houses, and sector-focused PE — all in our buyer universe.

### Operator DNA

We've built and sold consulting firms. We know what buyers will diligence and what founders will feel.
```

`src/content/sector/digital-media-marketing.md`:

```markdown
---
title: Digital, Media & Marketing
order: 3
oneLiner: Agencies, MarTech, and digital-first services at the intersection of creativity and code.
lede: We advise digital agencies, MarTech platforms, and marketing services businesses on sell-side exits and acquisitive growth strategies across UK, Europe, and the US.
dealSlugs:
  - trilogy-international
---

## Why us for Digital, Media & Marketing

Three reasons founders choose PCB for this sector.

### Deep sector fluency

From retainer models to usage-based MarTech, we understand the commercial DNA.

### Cross-border buyers

Holdco networks, European strategics, and platform PE — all actively hunting in this sector.

### Operator DNA

We've advised through cycles. We know which buyers to call in 2025 and why.
```

`src/content/sector/human-capital-management.md`:

```markdown
---
title: Human Capital Management
order: 4
oneLiner: HR tech, talent, and workforce services for a market in structural transition.
lede: We advise HR technology platforms, talent and workforce services businesses, and learning & development firms on strategic exits and roll-up growth.
dealSlugs: []
---

## Why us for Human Capital Management

Three reasons founders choose PCB for this sector.

### Deep sector fluency

Workforce economics, tech stacks, and the realities of scaling a services-adjacent platform.

### Cross-border buyers

Strategics and PE operating at the intersection of HR, tech, and services.

### Operator DNA

We've built and sold in adjacent sectors. The lessons transfer directly.
```

- [ ] **Step 2: Write the three service files**

`src/content/service/sell-side.md`:

```markdown
---
title: Sell-side
order: 1
oneLiner: Founder-led processes, trade and PE buyers, maximising strategic value.
lede: Selling a business is a once-in-a-career event. We run founder-led sell-side processes end-to-end — positioning, buyer outreach, diligence, negotiation — with the discipline of a large bank and the intensity of a boutique.
dealSlugs:
  - amdaris-insight
  - pracedo-collabera
  - edenhouse-accenture
  - proxima
---

## How we work on sell-side

### Deep sector fluency

We build the positioning narrative from sector-specific KPIs, not generic banker slides.

### Cross-border buyers

Our buyer lists are international by default. We reach strategics in the US, Europe, and Asia.

### Operator DNA

We prepare founders for the hardest conversations in diligence because we've been asked them ourselves.
```

`src/content/service/buy-side.md`:

```markdown
---
title: Buy-side
order: 2
oneLiner: Targeted origination and execution for acquisitive platforms.
lede: We run proprietary origination, manage bilateral approaches, and execute acquisitions for strategic acquirers and PE-backed platforms building in our four sectors.
dealSlugs: []
---

## How we work on buy-side

### Deep sector fluency

Origination built on real understanding of which targets compound, not which names are available.

### Cross-border buyers

Access to UK, European, and US targets via on-the-ground relationships.

### Operator DNA

We know which deals actually integrate and which ones blow up post-close.
```

`src/content/service/private-equity.md`:

```markdown
---
title: Private Equity
order: 3
oneLiner: Platform strategy, bolt-ons, and exits for sector-focused funds.
lede: We partner with PE funds investing in technology services, consulting, digital/media, and HCM — supporting platform builds, bolt-on origination, and ultimate exits.
dealSlugs: []
---

## How we work with PE

### Deep sector fluency

Thesis-driven support for fund strategies, not just transactional advice.

### Cross-border buyers

Exit options across geographies — strategics, funds, and public markets.

### Operator DNA

We speak management-team language, because we've been those management teams.
```

- [ ] **Step 3: Build to verify schemas accept content**

```bash
npm run build
```

Expected: PASS. If any frontmatter field fails Zod validation, fix that file.

- [ ] **Step 4: Commit**

```bash
git add src/content/sector/ src/content/service/
git commit -m "Populate sector and service content"
```

---

### Task 7: Populate deal content

**Files:**
- Create: `src/content/deal/amdaris-insight.yml`, `pracedo-collabera.yml`, `edenhouse-accenture.yml`, `inciper.yml`, `proxima.yml`, `trilogy-international.yml`, `reply-advisory.yml`, `wavestone-advisory.yml`, `hpe-emea.yml`, `apax-advisory.yml`

Each `.yml` file in `src/content/deal/` is a single deal record.

- [ ] **Step 1: Write the core deal files**

`src/content/deal/amdaris-insight.yml`:

```yaml
companyA: Amdaris
companyB: Insight Enterprises
year: 2023
type: sell-side
sector: technology-services
geoFrom: UK
geoTo: US
description: Advised Amdaris on its sale to US-listed Insight Enterprises.
```

`src/content/deal/pracedo-collabera.yml`:

```yaml
companyA: Pracedo
companyB: Collabera Digital
year: 2023
type: sell-side
sector: technology-services
geoFrom: UK
geoTo: India
description: Advised Pracedo on its sale to Collabera Digital.
```

`src/content/deal/edenhouse-accenture.yml`:

```yaml
companyA: Edenhouse
companyB: Accenture
year: 2022
type: sell-side
sector: technology-services
geoFrom: UK
geoTo: Global
description: Advised Edenhouse on its sale to Accenture.
```

`src/content/deal/inciper.yml`:

```yaml
companyA: Inciper
year: 2022
type: sell-side
sector: technology-services
geoFrom: UK
description: Advisory mandate with Inciper.
```

`src/content/deal/proxima.yml`:

```yaml
companyA: Proxima
year: 2022
type: sell-side
sector: management-consulting
geoFrom: UK
description: Recapitalisation advisory for Proxima.
```

`src/content/deal/trilogy-international.yml`:

```yaml
companyA: Trilogy International
year: 2020
type: sell-side
sector: digital-media-marketing
geoFrom: UK
geoTo: Global
description: Advisory mandate with Trilogy International.
```

`src/content/deal/reply-advisory.yml`:

```yaml
companyA: Reply (Italy)
year: 2022
type: buy-side
sector: digital-media-marketing
geoFrom: UK
geoTo: Italy
description: Buy-side advisory with Reply.
```

`src/content/deal/wavestone-advisory.yml`:

```yaml
companyA: Wavestone (France)
year: 2021
type: buy-side
sector: management-consulting
geoFrom: UK
geoTo: France
description: Buy-side advisory with Wavestone.
```

`src/content/deal/hpe-emea.yml`:

```yaml
companyA: HPE (Middle East & Africa)
year: 2021
type: pe
sector: technology-services
geoFrom: EMEA
description: Strategic advisory for HPE's Middle East & Africa division.
```

`src/content/deal/apax-advisory.yml`:

```yaml
companyA: Apax Partners
year: 2022
type: pe
sector: technology-services
geoFrom: UK
description: PE-side advisory engagement with Apax.
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: PASS. All deal files validate against the `deal` Zod schema.

- [ ] **Step 3: Commit**

```bash
git add src/content/deal/
git commit -m "Populate deal content"
```

---

### Task 8: Populate team + insights content

**Files:**
- Create: `src/content/team/ben-doltis.md`, `geoff.md`, `khilan-shah.md`, `brett-newland.md`, `james-stafford.md`, `tim-farazmand.md`, `dani-patel.md`, `greta.md`, `andrew.md`
- Create: `src/content/insight/placeholder.md` (a single placeholder article; real articles mirrored in Step 3 if time permits)

- [ ] **Step 1: Write team files**

For each partner and team member, create a file with frontmatter + a short bio sourced from the existing site. Example:

All team bios live in frontmatter (plain-text `bio` field defined in Task 5). The markdown body is unused. Keep bios short — one to three sentences, sourced from the existing pcbpartners.co.uk team page where possible.

`src/content/team/ben-doltis.md`:

```markdown
---
name: Ben Doltis
role: Founding Partner
isPartner: true
order: 1
bio: "Ben is the founding partner of PCB Partners. Before PCB, he built and sold consulting businesses, giving him first-hand experience on both sides of the advisory table. He leads cross-border mandates in technology services."
linkedIn: https://www.linkedin.com/in/bendoltis/
---
```

Repeat for the remaining five partners with frontmatter only (no markdown body):

- `geoff.md` — `order: 2`, `isPartner: true`, `role` and `bio` from existing site.
- `khilan-shah.md` — `order: 3`, `isPartner: true`.
- `brett-newland.md` — `order: 4`, `isPartner: true`.
- `james-stafford.md` — `order: 5`, `isPartner: true`.
- `tim-farazmand.md` — `order: 6`, `isPartner: true`.

For each, use a `bio` string of 1–3 sentences lifted or lightly paraphrased from their existing `pcbpartners.co.uk` team bio. If a partner's current bio is longer than three sentences, keep the first two — the card design doesn't accommodate more.

For non-partners (Dani Patel, Greta, Andrew), use `isPartner: false` and `order` 7, 8, 9:

`src/content/team/dani-patel.md`:

```markdown
---
name: Dani Patel
role: Senior Advisor
isPartner: false
order: 7
bio: "Senior advisor at PCB Partners."
---
```

(Same shape for `greta.md` and `andrew.md`.)

**Manual decision required** per spec §19.2: if the existing site has a Ben Doltis quote that fits the "operator advising operators" manifesto, add it to `ben-doltis.md` frontmatter as `manifesto: "..."`. If no suitable quote exists, leave it out — the Team page renders the manifesto block only when the founder has one.

- [ ] **Step 2: Write a placeholder insight article**

`src/content/insight/placeholder.md`:

```markdown
---
title: Mirrored from pcbpartners.co.uk
date: 2024-01-01
tags: []
---

This is a placeholder. Real insight content will be mirrored from the existing pcbpartners.co.uk /news section during the content-migration pass (see plan Task 20).
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/content/team/ src/content/insight/
git commit -m "Populate team and placeholder insight content"
```

---

## Phase 3 — Shell (layout + nav + footer)

### Task 9: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (use BaseLayout as a smoke test)

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title,
  description = 'Global boutique M&A advisory for the digital economy. Sector-focused, cross-border, operator-led.',
  ogImage = '/og-default.png',
  canonical,
} = Astro.props;

const siteUrl = 'https://pcb.partners';
const fullCanonical = canonical ?? new URL(Astro.url.pathname, siteUrl).toString();
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={fullCanonical} />

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- Font preload: Pulp Display Light is the most visible face on every page -->
    <link rel="preload" href="/fonts/pulp-display-light.woff2" as="font" type="font/woff2" crossorigin />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={fullCanonical} />
    <meta property="og:image" content={new URL(ogImage, siteUrl).toString()} />
    <meta property="og:site_name" content="PCB Partners" />

    <!-- Twitter card -->
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body class="min-h-screen flex flex-col">
    <slot name="nav" />
    <main class="flex-1">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2: Rewrite `src/pages/index.astro` to use BaseLayout as a smoke test**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="PCB Partners — scaffold">
  <div class="p-16">
    <h1 class="font-display text-6xl text-pcb-ink">
      PCB Partners — <em class="italic">scaffold on BaseLayout</em>
    </h1>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Run dev server + verify**

```bash
npm run dev
```

In the browser:
- View the page source and confirm `<meta>` tags, canonical, preload for `pulp-display-light.woff2`.
- Confirm headline renders in Pulp Display Light.

Kill the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "Add BaseLayout with meta, OG tags, and font preload"
```

---

### Task 10: Nav component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
// Top navigation. Desktop: logo left, 5 centred links, Contact CTA right.
// Mobile: logo + hamburger, links collapse into a full-width drawer.

const navLinks = [
  { href: '/sectors/',  label: 'Sectors'  },
  { href: '/services/', label: 'Services' },
  { href: '/deals/',    label: 'Deals'    },
  { href: '/team/',     label: 'Team'     },
  { href: '/insights/', label: 'Insights' },
];
const currentPath = Astro.url.pathname;
const isCurrent = (href: string) => currentPath === href || currentPath.startsWith(href);
---

<nav class="sticky top-0 z-40 bg-pcb-paper/95 backdrop-blur border-b border-pcb-border">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3" aria-label="PCB Partners home">
      <img src="/logo.svg" alt="" class="h-8 w-auto" />
      <span class="sr-only">PCB Partners</span>
    </a>

    <ul class="hidden md:flex items-center gap-8 text-sm">
      {navLinks.map(link => (
        <li>
          <a
            href={link.href}
            class={`transition-colors ${isCurrent(link.href) ? 'text-pcb-blue' : 'text-pcb-ink hover:text-pcb-blue'}`}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <div class="flex items-center gap-3">
      <a
        href="/contact/"
        class="hidden md:inline-block border border-pcb-ink px-4 py-2 text-sm font-medium hover:bg-pcb-ink hover:text-pcb-paper transition-colors rounded-sm"
      >
        Contact
      </a>
      <button
        id="nav-toggle"
        class="md:hidden p-2 -mr-2"
        aria-expanded="false"
        aria-controls="mobile-drawer"
        aria-label="Toggle navigation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 100 100" fill="currentColor">
          <path d="M68.75,37.81H31.25a2.56,2.56,0,1,1,0-5.12h37.5a2.56,2.56,0,0,1,0,5.12Z"/>
          <path d="M68.75,52.56H40.39a2.56,2.56,0,0,1,0-5.12H68.75a2.56,2.56,0,0,1,0,5.12Z"/>
          <path d="M68.75,67.31h-21a2.56,2.56,0,0,1,0-5.12h21a2.56,2.56,0,0,1,0,5.12Z"/>
        </svg>
      </button>
    </div>
  </div>

  <div id="mobile-drawer" hidden class="md:hidden border-t border-pcb-border bg-pcb-paper">
    <ul class="px-6 py-4 space-y-3 text-lg">
      {navLinks.map(link => (
        <li><a href={link.href} class="block py-2 text-pcb-ink">{link.label}</a></li>
      ))}
      <li><a href="/contact/" class="block py-2 text-pcb-blue font-medium">Contact</a></li>
    </ul>
  </div>
</nav>

<script>
  const btn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (btn && drawer) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (open) drawer.setAttribute('hidden', '');
      else      drawer.removeAttribute('hidden');
    });
  }
</script>
```

- [ ] **Step 2: Wire Nav into Home page as smoke test**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
---
<BaseLayout title="PCB Partners — scaffold">
  <Nav slot="nav" />
  <div class="p-16">
    <h1 class="font-display text-6xl text-pcb-ink">Home scaffold</h1>
  </div>
</BaseLayout>
```

Run `npm run dev`. Verify:
- Nav shows logo + 5 links + Contact CTA.
- At narrow viewport (≤ 767px), the links collapse and the hamburger appears.
- Hamburger toggles the mobile drawer.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "Add top navigation with desktop + mobile treatments"
```

---

### Task 11: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="bg-pcb-ink text-pcb-paper/80">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-14">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
      <div class="col-span-2">
        <img src="/logo.svg" alt="PCB Partners" class="h-9 w-auto invert brightness-0" style="filter: brightness(0) invert(1);" />
        <p class="mt-4 text-sm leading-relaxed max-w-md">
          Global boutique M&amp;A advisory for the digital economy. Sector-focused, cross-border, operator-led.
        </p>
      </div>

      <div>
        <h6 class="text-xs uppercase tracking-brand-eyebrow text-pcb-paper mb-3">Sectors</h6>
        <ul class="space-y-2 text-sm">
          <li><a href="/sectors/technology-services/"      class="hover:text-pcb-blue-light">Technology Services</a></li>
          <li><a href="/sectors/management-consulting/"    class="hover:text-pcb-blue-light">Management Consulting</a></li>
          <li><a href="/sectors/digital-media-marketing/"  class="hover:text-pcb-blue-light">Digital, Media &amp; Marketing</a></li>
          <li><a href="/sectors/human-capital-management/" class="hover:text-pcb-blue-light">Human Capital Management</a></li>
        </ul>
      </div>

      <div>
        <h6 class="text-xs uppercase tracking-brand-eyebrow text-pcb-paper mb-3">Services</h6>
        <ul class="space-y-2 text-sm">
          <li><a href="/services/sell-side/"      class="hover:text-pcb-blue-light">Sell-side</a></li>
          <li><a href="/services/buy-side/"       class="hover:text-pcb-blue-light">Buy-side</a></li>
          <li><a href="/services/private-equity/" class="hover:text-pcb-blue-light">Private Equity</a></li>
        </ul>
      </div>

      <div class="col-span-2 md:col-span-4">
        <h6 class="text-xs uppercase tracking-brand-eyebrow text-pcb-paper mb-3">Contact</h6>
        <p class="text-sm">
          <a href="mailto:team@pcbpartners.co.uk" class="hover:text-pcb-blue-light">team@pcbpartners.co.uk</a>
          &nbsp;·&nbsp;
          <a href="tel:+442037959084" class="hover:text-pcb-blue-light">+44 (0) 203 795 9084</a>
        </p>
      </div>
    </div>

    <div class="mt-10 pt-6 border-t border-pcb-paper/10 text-xs leading-relaxed text-pcb-paper/50">
      <p>
        PCB Partners is authorised and regulated by the Financial Conduct Authority (Firm 948557).
        US-registered transactions are arranged via Finalis Securities LLC, member FINRA/SIPC.
      </p>
      <p class="mt-2">© {year} PCB Partners. All rights reserved.</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Wire Footer into Home page as smoke test**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="PCB Partners — scaffold">
  <Nav slot="nav" />
  <div class="p-16">
    <h1 class="font-display text-6xl text-pcb-ink">Home scaffold</h1>
  </div>
  <Footer slot="footer" />
</BaseLayout>
```

Run `npm run dev`. Verify footer shows black background, white logo, 4-column grid on desktop / 2-column on mobile, regulatory line at bottom.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "Add site footer with regulatory disclosure"
```

---

## Phase 4 — Home page

### Task 12: Home — Hero + metrics

**Files:**
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/MetricsStrip.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/home/Hero.astro`**

```astro
---
---
<section class="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-16">
  <p class="text-xs font-semibold uppercase tracking-brand-eyebrow text-pcb-blue">
    Global Boutique M&amp;A · Sector-focused
  </p>
  <h1 class="mt-5 font-display font-extralight text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-pcb-ink max-w-4xl">
    We advise the firms building <em class="italic">the digital economy.</em>
  </h1>
  <p class="mt-8 max-w-2xl text-lg leading-relaxed text-pcb-ink/70">
    Specialist M&amp;A advisory for technology services, management consulting, digital/media/marketing, and human capital management — buy-side, sell-side, and private equity.
  </p>
  <div class="mt-10 flex flex-wrap gap-4 items-center">
    <a href="/deals/" class="inline-flex items-center gap-2 border border-pcb-ink px-5 py-3 text-sm font-medium rounded-sm hover:bg-pcb-ink hover:text-pcb-paper transition-colors">
      See our track record
      <span aria-hidden="true">→</span>
    </a>
    <a href="/contact/" class="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-pcb-blue hover:underline">
      Speak to a partner →
    </a>
  </div>
</section>
```

- [ ] **Step 2: Write `src/components/home/MetricsStrip.astro`**

```astro
---
// Per spec §19.1: metric values must be substantiated before Ben sees the site.
// These defaults are intentionally conservative — replace or remove before launch.
interface Metric { big: string; unit?: string; label: string; }
const metrics: Metric[] = [
  { big: '100', unit: '+',   label: 'Deals advised'     },
  { big: '14',              label: 'Countries'         },
  { big: '4',               label: 'Sectors, deep'     },
  { big: '20', unit: 'yr+',  label: 'Operator experience' },
];
---
<div class="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-pcb-border">
    {metrics.map(m => (
      <div>
        <div class="font-display-bold text-4xl md:text-5xl text-pcb-blue leading-none">
          {m.big}{m.unit && <span class="text-xl align-top ml-1">{m.unit}</span>}
        </div>
        <div class="mt-2 text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">
          {m.label}
        </div>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Wire into `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Hero from '../components/home/Hero.astro';
import MetricsStrip from '../components/home/MetricsStrip.astro';
---
<BaseLayout title="PCB Partners — Global boutique M&A for the digital economy">
  <Nav slot="nav" />
  <Hero />
  <MetricsStrip />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 4: Verify + commit**

```bash
npm run dev
# Visual check: hero shows Pulp Display Light headline with italic "the digital economy",
# supporting lede, two CTAs, and the 4-metric strip.
npm run build
# Expected: PASS.
git add src/components/home/ src/pages/index.astro
git commit -m "Build Home hero and metrics strip"
```

---

### Task 13: Home — Sectors grid

**Files:**
- Create: `src/components/home/SectorsSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/home/SectorsSection.astro`**

```astro
---
import { getCollection, getEntries } from 'astro:content';

const sectors = (await getCollection('sector')).sort((a, b) => a.data.order - b.data.order);

// For each sector, resolve its listed deal slugs to display "Recent: X · Y · Z".
const resolved = await Promise.all(sectors.map(async s => {
  const slugs = s.data.dealSlugs.slice(0, 3);
  const deals = slugs.length ? await getEntries(slugs.map(id => ({ collection: 'deal', id }))) : [];
  const recent = deals.map(d => d.data.companyA).join(' · ');
  return { sector: s, recent };
}));
---
<section class="bg-pcb-paper">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-24">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">01 — Who we serve</p>
    <h2 class="mt-3 font-display-bold text-3xl md:text-4xl">Four sectors. Deep specialism.</h2>

    <div class="mt-12 grid md:grid-cols-2 gap-4">
      {resolved.map(({ sector, recent }) => (
        <a
          href={`/sectors/${sector.slug}/`}
          class="group block border border-pcb-border rounded-md p-8 hover:border-pcb-blue transition-colors"
        >
          <h3 class="font-display text-2xl md:text-3xl text-pcb-ink group-hover:text-pcb-blue transition-colors">
            {sector.data.title}
          </h3>
          <p class="mt-3 text-pcb-ink/70 leading-relaxed">{sector.data.oneLiner}</p>
          {recent && (
            <p class="mt-6 text-[11px] uppercase tracking-brand-eyebrow text-pcb-blue">
              Recent: {recent}
            </p>
          )}
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire into Home page**

In `src/pages/index.astro`, add after `<MetricsStrip />`:

```astro
import SectorsSection from '../components/home/SectorsSection.astro';
// ...
<SectorsSection />
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
# Check: 2x2 grid of sector cards; each card shows title, one-liner, "Recent: ..." line.
# Hover → border turns blue, title turns blue.
npm run build
git add src/components/home/SectorsSection.astro src/pages/index.astro
git commit -m "Build Home sectors grid from content"
```

---

### Task 14: Home — Cross-border + Services + Operators sections

**Files:**
- Create: `src/components/home/CrossBorderSection.astro`
- Create: `src/components/home/ServicesSection.astro`
- Create: `src/components/home/OperatorsSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/home/CrossBorderSection.astro`**

```astro
---
import { getCollection } from 'astro:content';

const deals = await getCollection('deal');
// Pick representative cross-border deals (has geoFrom AND geoTo).
const crossBorder = deals
  .filter(d => d.data.geoFrom && d.data.geoTo)
  .slice(0, 6);
---
<section class="bg-pcb-ink text-pcb-paper">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-24">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue-light">02 — Global reach</p>
    <h2 class="mt-3 font-display font-extralight text-3xl md:text-5xl leading-tight">
      Selected <em class="italic">cross-border</em> mandates.
    </h2>
    <p class="mt-6 max-w-2xl text-pcb-paper/70 leading-relaxed">
      Most of our deals cross at least one border. We partner with Finalis Securities LLC for US-registered transactions and operate across UK, Europe, and the Middle East.
    </p>

    <div class="mt-12 grid md:grid-cols-3 gap-4">
      {crossBorder.map(d => (
        <div class="border border-pcb-paper/20 p-5 rounded-sm">
          <div class="text-[11px] uppercase tracking-brand-eyebrow text-pcb-blue-light">
            {d.data.geoFrom} → {d.data.geoTo}
          </div>
          <div class="mt-2 font-display text-xl">
            {d.data.companyA}{d.data.companyB && <> <span class="text-pcb-blue-light">→</span> {d.data.companyB}</>}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Write `src/components/home/ServicesSection.astro`**

```astro
---
import { getCollection } from 'astro:content';

const services = (await getCollection('service')).sort((a, b) => a.data.order - b.data.order);
---
<section>
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-24">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">03 — What we do</p>
    <h2 class="mt-3 font-display-bold text-3xl md:text-4xl">Buy. Sell. Partner with PE.</h2>

    <div class="mt-12 grid md:grid-cols-3 gap-4">
      {services.map(s => (
        <a href={`/services/${s.slug}/`} class="group block border border-pcb-border rounded-md p-8 hover:border-pcb-blue transition-colors">
          <h3 class="font-display text-2xl text-pcb-ink group-hover:text-pcb-blue">{s.data.title}</h3>
          <p class="mt-3 text-pcb-ink/70 leading-relaxed">{s.data.oneLiner}</p>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write `src/components/home/OperatorsSection.astro`**

```astro
---
import { getCollection } from 'astro:content';

const team = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
const partners = team.filter(t => t.data.isPartner);
---
<section class="bg-pcb-surface">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-24">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">04 — Who we are</p>
    <h2 class="mt-3 font-display font-extralight text-3xl md:text-5xl leading-tight">
      Advisors who've <em class="italic">sat in your chair.</em>
    </h2>
    <p class="mt-6 max-w-2xl text-pcb-ink/70 leading-relaxed">
      Our partners have built and sold their own consulting and digital businesses. We're not bankers who've read about the sector — we're operators who've lived it.
    </p>

    <div class="mt-12 flex items-center gap-8 flex-wrap">
      <div class="flex">
        {partners.slice(0, 6).map((p, i) => (
          <div
            class="w-14 h-14 rounded-full bg-pcb-border border-[3px] border-pcb-paper flex items-center justify-center font-display text-lg text-pcb-muted"
            style={`margin-left: ${i === 0 ? '0' : '-0.75rem'};`}
          >
            {p.data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        ))}
      </div>
      <div class="text-sm text-pcb-ink/80">
        {partners.map(p => p.data.name).join(' · ')}
        <br />
        <a href="/team/" class="text-pcb-blue hover:underline">Meet the team →</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Wire into Home page**

In `src/pages/index.astro`, import and place in order:

```astro
import CrossBorderSection from '../components/home/CrossBorderSection.astro';
import ServicesSection from '../components/home/ServicesSection.astro';
import OperatorsSection from '../components/home/OperatorsSection.astro';
// ...
<SectorsSection />
<CrossBorderSection />
<ServicesSection />
<OperatorsSection />
```

- [ ] **Step 5: Verify + commit**

```bash
npm run dev
# Scroll through the Home: Hero → Metrics → Sectors → CrossBorder (dark) → Services → Operators (gray).
# Confirm visual rhythm matches wireframe (dark block, gray block breaks).
npm run build
git add src/components/home/ src/pages/index.astro
git commit -m "Build Home cross-border, services, operators sections"
```

---

### Task 15: Home — Logo wall + Insights teaser + Closing CTA

**Files:**
- Create: `src/components/LogoWall.astro`
- Create: `src/components/home/InsightsTeaser.astro`
- Create: `src/components/home/ClosingCTA.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/LogoWall.astro`**

```astro
---
interface Logo { src: string; alt: string; }
const logos: Logo[] = [
  { src: '/logos/reply.jpg',         alt: 'Reply'         },
  { src: '/logos/wavestone.jpg',     alt: 'Wavestone'     },
  { src: '/logos/atos.png',          alt: 'Atos'          },
  { src: '/logos/hpe.png',           alt: 'Hewlett Packard Enterprise' },
  { src: '/logos/apax.png',          alt: 'Apax Partners' },
  { src: '/logos/ldc.png',           alt: 'LDC'           },
  { src: '/logos/collabera.jpg',     alt: 'Collabera'     },
  { src: '/logos/insight.jpg',       alt: 'Insight'       },
  { src: '/logos/proxima.png',       alt: 'Proxima'       },
  { src: '/logos/gresham-house.png', alt: 'Gresham House' },
  { src: '/logos/palatine.png',      alt: 'Palatine'      },
];
---
<section>
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted text-center">Trusted by</p>
    <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 items-center">
      {logos.map(l => (
        <div class="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
          <img src={l.src} alt={l.alt} class="max-h-10 w-auto object-contain grayscale" loading="lazy" />
        </div>
      ))}
    </div>
  </div>
</section>
```

Note: `grayscale` class keeps the wall visually calm; hover removes grayscale via the opacity transition. If you want colour logos, drop `grayscale`.

- [ ] **Step 2: Write `src/components/home/InsightsTeaser.astro`**

```astro
---
import { getCollection } from 'astro:content';

const all = await getCollection('insight');
const latest = all
  .sort((a, b) => b.data.date.localeCompare(a.data.date))
  .slice(0, 3);
---
<section class="bg-pcb-surface">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-24">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">05 — Perspectives</p>
    <div class="mt-3 flex items-baseline justify-between flex-wrap gap-4">
      <h2 class="font-display-bold text-3xl md:text-4xl">Latest from PCB.</h2>
      <a href="/insights/" class="text-sm text-pcb-blue hover:underline">All insights →</a>
    </div>

    <div class="mt-12 grid md:grid-cols-3 gap-4">
      {latest.map(i => (
        <a href={`/insights/${i.slug}/`} class="block bg-pcb-paper border border-pcb-border rounded-md p-6 hover:border-pcb-blue transition-colors">
          <div class="text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">{i.data.date}</div>
          <h3 class="mt-2 font-display text-lg leading-snug">{i.data.title}</h3>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write `src/components/home/ClosingCTA.astro`**

```astro
---
---
<section class="bg-pcb-blue text-pcb-paper">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20 text-center">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-paper/80">Thinking about a transaction?</p>
    <h2 class="mt-3 font-display font-extralight text-4xl md:text-6xl">Let's talk.</h2>
    <a href="mailto:team@pcbpartners.co.uk" class="mt-6 inline-block border border-pcb-paper px-6 py-3 text-sm font-medium hover:bg-pcb-paper hover:text-pcb-blue transition-colors rounded-sm">
      team@pcbpartners.co.uk
    </a>
  </div>
</section>
```

- [ ] **Step 4: Wire into Home page (final order)**

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Hero from '../components/home/Hero.astro';
import MetricsStrip from '../components/home/MetricsStrip.astro';
import SectorsSection from '../components/home/SectorsSection.astro';
import CrossBorderSection from '../components/home/CrossBorderSection.astro';
import ServicesSection from '../components/home/ServicesSection.astro';
import OperatorsSection from '../components/home/OperatorsSection.astro';
import LogoWall from '../components/LogoWall.astro';
import InsightsTeaser from '../components/home/InsightsTeaser.astro';
import ClosingCTA from '../components/home/ClosingCTA.astro';
---
<BaseLayout title="PCB Partners — Global boutique M&A for the digital economy">
  <Nav slot="nav" />
  <Hero />
  <MetricsStrip />
  <SectorsSection />
  <CrossBorderSection />
  <ServicesSection />
  <OperatorsSection />
  <LogoWall />
  <InsightsTeaser />
  <ClosingCTA />
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 5: Verify + commit**

```bash
npm run dev
# Scroll the Home page. Confirm 10-block rhythm matches the wireframe: Nav → Hero → Metrics → Sectors → CrossBorder → Services → Operators → LogoWall → Insights → ClosingCTA → Footer.
npm run build
git add src/components/ src/pages/index.astro
git commit -m "Complete Home page: logo wall, insights teaser, closing CTA"
```

---

## Phase 5 — Inner pages

### Task 16: InnerPageLayout + sector [slug] pages

**Files:**
- Create: `src/layouts/InnerPageLayout.astro`
- Create: `src/pages/sectors/[slug].astro`

- [ ] **Step 1: Write `src/layouts/InnerPageLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  breadcrumb: { parent: string; current: string };
  headline: string;
  headlineEmph?: string;  // the italic accent fragment
  lede: string;
}

const { title, description, breadcrumb, headline, headlineEmph, lede } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <Nav slot="nav" />

  <!-- HERO -->
  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">
      <a href="#" class="hover:text-pcb-blue">{breadcrumb.parent}</a>
      &nbsp;·&nbsp;
      <span class="text-pcb-blue">{breadcrumb.current}</span>
    </p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      {headline}{headlineEmph && <> <em class="italic">{headlineEmph}</em></>}
    </h1>
    <p class="mt-8 max-w-2xl text-lg leading-relaxed text-pcb-ink/70">{lede}</p>
  </section>

  <!-- THREE POINTS + DEALS + QUOTE come from child content -->
  <slot />

  <!-- CONTACT STRIP -->
  <section class="bg-pcb-ink text-pcb-paper">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-14 flex flex-wrap items-center justify-between gap-6">
      <div>
        <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue-light">Thinking about a deal in this area?</p>
        <h2 class="mt-3 font-display font-extralight text-2xl md:text-3xl">Speak to a sector partner.</h2>
      </div>
      <a href="mailto:team@pcbpartners.co.uk" class="border border-pcb-paper px-5 py-3 text-sm hover:bg-pcb-paper hover:text-pcb-ink transition-colors rounded-sm">
        team@pcbpartners.co.uk
      </a>
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/sectors/[slug].astro`**

```astro
---
import { getCollection, getEntries } from 'astro:content';
import InnerPageLayout from '../../layouts/InnerPageLayout.astro';

export async function getStaticPaths() {
  const sectors = await getCollection('sector');
  return sectors.map(s => ({ params: { slug: s.slug }, props: { sector: s } }));
}

const { sector } = Astro.props;
const { Content } = await sector.render();

const dealSlugs = sector.data.dealSlugs;
const deals = dealSlugs.length
  ? await getEntries(dealSlugs.map(id => ({ collection: 'deal', id })))
  : [];
---
<InnerPageLayout
  title={`${sector.data.title} — PCB Partners`}
  description={sector.data.oneLiner}
  breadcrumb={{ parent: 'Sectors', current: sector.data.title }}
  headline={`Expertise in ${sector.data.title.toLowerCase()}.`}
  lede={sector.data.lede}
>
  <!-- THREE POINTS (rendered from markdown content) -->
  <section class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
    <div class="prose prose-slate max-w-none">
      <Content />
    </div>
  </section>

  <!-- DEALS -->
  {deals.length > 0 && (
    <section class="bg-pcb-surface">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">Selected transactions</p>
        <h2 class="mt-3 font-display-bold text-2xl md:text-3xl">{sector.data.title} deals.</h2>
        <div class="mt-10 grid md:grid-cols-2 gap-4">
          {deals.map(d => (
            <div class="bg-pcb-paper border border-pcb-border rounded-md p-5 flex items-center gap-5">
              <div class="flex-1">
                <div class="text-[10px] uppercase tracking-brand-eyebrow text-pcb-muted">{d.data.type.replace('-', ' ')}</div>
                <div class="mt-1 font-display text-lg">
                  {d.data.companyA}{d.data.companyB && <> <span class="text-pcb-blue">→</span> {d.data.companyB}</>}
                </div>
                {d.data.geoFrom && (
                  <div class="mt-1 text-xs text-pcb-muted">
                    {d.data.geoFrom}{d.data.geoTo && <> → {d.data.geoTo}</>}
                  </div>
                )}
              </div>
              <div class="font-display-bold text-pcb-blue">{d.data.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )}
</InnerPageLayout>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
# Visit /sectors/technology-services/
# Confirm: breadcrumb, headline, lede, three-points from markdown, deal cards.
npm run build
# Build should generate 4 sector pages: /sectors/technology-services, /sectors/management-consulting, /sectors/digital-media-marketing, /sectors/human-capital-management
git add src/layouts/InnerPageLayout.astro src/pages/sectors/[slug].astro
git commit -m "Add InnerPageLayout + dynamic sector pages"
```

---

### Task 17: Service [slug] pages + overview pages

**Files:**
- Create: `src/pages/services/[slug].astro` (mirrors `sectors/[slug].astro`)
- Create: `src/pages/sectors/index.astro`
- Create: `src/pages/services/index.astro`

- [ ] **Step 1: Write `src/pages/services/[slug].astro`**

Copy the file from `src/pages/sectors/[slug].astro` and modify:
- Change `getCollection('sector')` → `getCollection('service')`
- Change the breadcrumb parent label from `'Sectors'` to `'Services'`
- Change the prop name from `sector` → `service` throughout

```astro
---
import { getCollection, getEntries } from 'astro:content';
import InnerPageLayout from '../../layouts/InnerPageLayout.astro';

export async function getStaticPaths() {
  const services = await getCollection('service');
  return services.map(s => ({ params: { slug: s.slug }, props: { service: s } }));
}

const { service } = Astro.props;
const { Content } = await service.render();

const dealSlugs = service.data.dealSlugs;
const deals = dealSlugs.length
  ? await getEntries(dealSlugs.map(id => ({ collection: 'deal', id })))
  : [];
---
<InnerPageLayout
  title={`${service.data.title} — PCB Partners`}
  description={service.data.oneLiner}
  breadcrumb={{ parent: 'Services', current: service.data.title }}
  headline={`${service.data.title} advisory.`}
  lede={service.data.lede}
>
  <section class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
    <div class="prose prose-slate max-w-none">
      <Content />
    </div>
  </section>

  {deals.length > 0 && (
    <section class="bg-pcb-surface">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">Selected transactions</p>
        <h2 class="mt-3 font-display-bold text-2xl md:text-3xl">{service.data.title} deals.</h2>
        <div class="mt-10 grid md:grid-cols-2 gap-4">
          {deals.map(d => (
            <div class="bg-pcb-paper border border-pcb-border rounded-md p-5 flex items-center gap-5">
              <div class="flex-1">
                <div class="text-[10px] uppercase tracking-brand-eyebrow text-pcb-muted">{d.data.type.replace('-', ' ')}</div>
                <div class="mt-1 font-display text-lg">
                  {d.data.companyA}{d.data.companyB && <> <span class="text-pcb-blue">→</span> {d.data.companyB}</>}
                </div>
                {d.data.geoFrom && (
                  <div class="mt-1 text-xs text-pcb-muted">
                    {d.data.geoFrom}{d.data.geoTo && <> → {d.data.geoTo}</>}
                  </div>
                )}
              </div>
              <div class="font-display-bold text-pcb-blue">{d.data.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )}
</InnerPageLayout>
```

- [ ] **Step 2: Write `src/pages/sectors/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';

const sectors = (await getCollection('sector')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Sectors — PCB Partners">
  <Nav slot="nav" />

  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Sectors</p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      Four sectors. <em class="italic">Deep specialism.</em>
    </h1>
    <p class="mt-8 max-w-2xl text-lg leading-relaxed text-pcb-ink/70">
      We advise companies and investors across four verticals at the heart of the digital economy.
    </p>
  </section>

  <section class="pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-4">
      {sectors.map(s => (
        <a href={`/sectors/${s.slug}/`} class="group block border border-pcb-border rounded-md p-8 hover:border-pcb-blue transition-colors">
          <h2 class="font-display text-2xl md:text-3xl text-pcb-ink group-hover:text-pcb-blue">{s.data.title}</h2>
          <p class="mt-3 text-pcb-ink/70 leading-relaxed">{s.data.oneLiner}</p>
        </a>
      ))}
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/services/index.astro`**

Same structure as `sectors/index.astro`, but with `getCollection('service')`, `/services/` hrefs, and the headline "Three services. *One mandate.*" Suggested lede: "Buy-side, sell-side, and PE advisory — all grounded in deep sector specialism."

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';

const services = (await getCollection('service')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Services — PCB Partners">
  <Nav slot="nav" />

  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Services</p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      Three services. <em class="italic">One mandate.</em>
    </h1>
    <p class="mt-8 max-w-2xl text-lg leading-relaxed text-pcb-ink/70">
      Buy-side, sell-side, and PE advisory — all grounded in deep sector specialism.
    </p>
  </section>

  <section class="pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-4">
      {services.map(s => (
        <a href={`/services/${s.slug}/`} class="group block border border-pcb-border rounded-md p-8 hover:border-pcb-blue transition-colors">
          <h2 class="font-display text-2xl text-pcb-ink group-hover:text-pcb-blue">{s.data.title}</h2>
          <p class="mt-3 text-pcb-ink/70 leading-relaxed">{s.data.oneLiner}</p>
        </a>
      ))}
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 4: Verify + commit**

```bash
npm run dev
# Visit /sectors/ and /services/ — confirm they render.
# Visit /services/sell-side/ — confirm deal cards render.
npm run build
# Expect 4 sector pages + 3 service pages + 2 overview pages built.
git add src/pages/services/ src/pages/sectors/index.astro
git commit -m "Add service pages and sector/service overviews"
```

---

## Phase 6 — Showpiece pages

### Task 18: Deals page — hero, stats, card grid (no filter yet)

**Files:**
- Create: `src/components/DealCard.astro`
- Create: `src/pages/deals/index.astro`

- [ ] **Step 1: Write `src/components/DealCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { deal: CollectionEntry<'deal'> }
const { deal } = Astro.props;
const d = deal.data;
const typeLabel = d.type === 'pe' ? 'Private Equity' : d.type.replace('-', ' ');
const isCrossBorder = d.geoFrom && d.geoTo && d.geoFrom !== d.geoTo;
---
<article
  class="relative border border-pcb-border rounded-md p-5 hover:border-pcb-blue transition-colors"
  data-deal-type={d.type}
  data-deal-sector={d.sector}
  data-deal-cross-border={isCrossBorder ? 'true' : 'false'}
>
  <div class="absolute top-4 right-4 font-display-bold text-xs text-pcb-blue tracking-wider">{d.year}</div>
  <div class="text-[10px] uppercase tracking-brand-eyebrow text-pcb-muted">{typeLabel}</div>
  <h3 class="mt-2 font-display text-lg leading-snug">
    {d.companyA}{d.companyB && <> <span class="text-pcb-blue">→</span> {d.companyB}</>}
  </h3>
  <div class="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-brand-eyebrow">
    <span class="bg-pcb-surface text-pcb-ink/70 px-2 py-1 rounded-sm">{d.sector.replace(/-/g, ' ')}</span>
    {d.geoFrom && (
      <span class="bg-pcb-blue-tint text-pcb-blue px-2 py-1 rounded-sm">
        {d.geoFrom}{d.geoTo && <> → {d.geoTo}</>}
      </span>
    )}
  </div>
</article>
```

- [ ] **Step 2: Write `src/pages/deals/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import DealCard from '../../components/DealCard.astro';

const deals = (await getCollection('deal')).sort((a, b) => b.data.year - a.data.year);
const totalCount = deals.length;
const countries = new Set(deals.flatMap(d => [d.data.geoFrom, d.data.geoTo].filter(Boolean) as string[]));
const crossBorderCount = deals.filter(d => d.data.geoFrom && d.data.geoTo && d.data.geoFrom !== d.data.geoTo).length;
const crossBorderPct = totalCount ? Math.round(100 * crossBorderCount / totalCount) : 0;
---
<BaseLayout title="Track record — PCB Partners">
  <Nav slot="nav" />

  <!-- HERO + STATS -->
  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Track record</p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      Every deal tells a <em class="italic">cross-border story.</em>
    </h1>
    <p class="mt-6 max-w-2xl text-pcb-ink/70 leading-relaxed">
      Selected transactions across technology services, consulting, digital/media, and HCM.
    </p>

    <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-pcb-border">
      <div>
        <div class="font-display font-extralight text-4xl md:text-5xl text-pcb-ink leading-none">{totalCount}</div>
        <div class="mt-2 text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">Deals on this page</div>
      </div>
      <div>
        <div class="font-display font-extralight text-4xl md:text-5xl text-pcb-ink leading-none">{countries.size}</div>
        <div class="mt-2 text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">Countries represented</div>
      </div>
      <div>
        <div class="font-display font-extralight text-4xl md:text-5xl text-pcb-ink leading-none">{crossBorderPct}<span class="text-xl text-pcb-blue font-display-bold align-top ml-1">%</span></div>
        <div class="mt-2 text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">Cross-border</div>
      </div>
      <div>
        <div class="font-display font-extralight text-4xl md:text-5xl text-pcb-ink leading-none">4</div>
        <div class="mt-2 text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">Sectors covered</div>
      </div>
    </div>
  </section>

  <!-- GRID (filter added in next task) -->
  <section class="pb-24">
    <div id="deal-grid" class="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {deals.map(deal => <DealCard deal={deal} />)}
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
# Visit /deals/. Confirm: stats compute from real data (not hardcoded),
# deal cards render sorted by year desc, geo chips are blue.
npm run build
git add src/components/DealCard.astro src/pages/deals/index.astro
git commit -m "Build Deals page with computed stats and card grid"
```

---

### Task 19: Deals filter (TDD)

This is the only task with real interactive JS logic, so we TDD it.

**Files:**
- Create: `src/scripts/deal-filter.ts` (the logic module)
- Create: `tests/deal-filter.test.ts`
- Create: `vitest.config.ts`
- Create: `src/components/DealFilter.astro` (UI, imports the logic)
- Modify: `src/pages/deals/index.astro` (add the filter UI above the grid)
- Modify: `package.json` (add vitest + test script)

- [ ] **Step 1: Add vitest**

```bash
npm install -D vitest
```

Add to `package.json` scripts:

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "vitest run"
}
```

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
  },
});
```

Install jsdom:

```bash
npm install -D jsdom @types/jsdom
```

- [ ] **Step 3: Write the failing test `tests/deal-filter.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { applyFilters, parseHashFilters, serializeFilters, type FilterState } from '../src/scripts/deal-filter';

describe('applyFilters', () => {
  let cards: HTMLElement[];

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="deal-grid">
        <article id="a" data-deal-type="sell-side"  data-deal-sector="technology-services" data-deal-cross-border="true"></article>
        <article id="b" data-deal-type="buy-side"   data-deal-sector="management-consulting" data-deal-cross-border="true"></article>
        <article id="c" data-deal-type="sell-side"  data-deal-sector="management-consulting" data-deal-cross-border="false"></article>
        <article id="d" data-deal-type="pe"         data-deal-sector="technology-services"   data-deal-cross-border="false"></article>
      </div>
    `;
    cards = Array.from(document.querySelectorAll('#deal-grid article')) as HTMLElement[];
  });

  it('shows all cards when filter state is empty', () => {
    applyFilters(cards, { types: [], sectors: [], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('filters by a single type', () => {
    applyFilters(cards, { types: ['sell-side'], sectors: [], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'c']);
  });

  it('filters by a single sector', () => {
    applyFilters(cards, { types: [], sectors: ['technology-services'], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'd']);
  });

  it('intersects type and sector filters', () => {
    applyFilters(cards, { types: ['sell-side'], sectors: ['technology-services'], crossBorderOnly: false });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a']);
  });

  it('applies cross-border filter', () => {
    applyFilters(cards, { types: [], sectors: [], crossBorderOnly: true });
    expect(cards.filter(c => !c.hidden).map(c => c.id)).toEqual(['a', 'b']);
  });
});

describe('parseHashFilters', () => {
  it('returns empty state for empty hash', () => {
    expect(parseHashFilters('')).toEqual({ types: [], sectors: [], crossBorderOnly: false });
  });

  it('parses type list', () => {
    expect(parseHashFilters('#type=sell-side,pe')).toMatchObject({ types: ['sell-side', 'pe'] });
  });

  it('parses sector list', () => {
    expect(parseHashFilters('#sector=technology-services')).toMatchObject({ sectors: ['technology-services'] });
  });

  it('parses cross-border flag', () => {
    expect(parseHashFilters('#crossBorder=1')).toMatchObject({ crossBorderOnly: true });
  });

  it('parses combined params', () => {
    const s = parseHashFilters('#type=sell-side&sector=technology-services&crossBorder=1');
    expect(s).toEqual({ types: ['sell-side'], sectors: ['technology-services'], crossBorderOnly: true });
  });
});

describe('serializeFilters', () => {
  it('returns empty string for empty state', () => {
    expect(serializeFilters({ types: [], sectors: [], crossBorderOnly: false })).toBe('');
  });

  it('serialises non-empty state', () => {
    const s: FilterState = { types: ['sell-side', 'pe'], sectors: ['technology-services'], crossBorderOnly: true };
    expect(serializeFilters(s)).toBe('type=sell-side,pe&sector=technology-services&crossBorder=1');
  });

  it('round-trips through parse', () => {
    const s: FilterState = { types: ['buy-side'], sectors: ['digital-media-marketing'], crossBorderOnly: false };
    const str = serializeFilters(s);
    expect(parseHashFilters('#' + str)).toEqual(s);
  });
});
```

- [ ] **Step 4: Run test — confirm it fails**

```bash
npm test
```

Expected: fails — module `src/scripts/deal-filter` does not exist.

- [ ] **Step 5: Write `src/scripts/deal-filter.ts`**

```ts
export interface FilterState {
  types: string[];       // e.g. ['sell-side', 'pe']
  sectors: string[];     // e.g. ['technology-services']
  crossBorderOnly: boolean;
}

export const EMPTY_STATE: FilterState = { types: [], sectors: [], crossBorderOnly: false };

/**
 * Show/hide cards based on filter state. Cards expose filter values as data-attrs:
 *   data-deal-type="sell-side" | "buy-side" | "pe"
 *   data-deal-sector="technology-services" | ...
 *   data-deal-cross-border="true" | "false"
 */
export function applyFilters(cards: HTMLElement[], state: FilterState): void {
  for (const card of cards) {
    const type = card.getAttribute('data-deal-type') ?? '';
    const sector = card.getAttribute('data-deal-sector') ?? '';
    const crossBorder = card.getAttribute('data-deal-cross-border') === 'true';

    const typeOk   = state.types.length   === 0 || state.types.includes(type);
    const sectorOk = state.sectors.length === 0 || state.sectors.includes(sector);
    const xbOk     = !state.crossBorderOnly || crossBorder;

    card.hidden = !(typeOk && sectorOk && xbOk);
  }
}

export function parseHashFilters(hash: string): FilterState {
  const s: FilterState = { types: [], sectors: [], crossBorderOnly: false };
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!clean) return s;
  const parts = clean.split('&');
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (!value) continue;
    if (key === 'type')        s.types   = value.split(',').filter(Boolean);
    else if (key === 'sector') s.sectors = value.split(',').filter(Boolean);
    else if (key === 'crossBorder' && value === '1') s.crossBorderOnly = true;
  }
  return s;
}

export function serializeFilters(state: FilterState): string {
  const parts: string[] = [];
  if (state.types.length)   parts.push('type='   + state.types.join(','));
  if (state.sectors.length) parts.push('sector=' + state.sectors.join(','));
  if (state.crossBorderOnly) parts.push('crossBorder=1');
  return parts.join('&');
}
```

- [ ] **Step 6: Run test — confirm it passes**

```bash
npm test
```

Expected: all 11 assertions PASS.

- [ ] **Step 7: Write `src/components/DealFilter.astro`**

```astro
---
// Filter UI. Emits clicks; the embedded <script> reads clicks and calls applyFilters.
---
<div class="max-w-7xl mx-auto px-6 lg:px-10 mb-8" id="deal-filter">
  <div class="flex flex-wrap gap-2 text-sm">
    <button type="button" class="filter-pill" data-filter-group="clear">All</button>
    <span class="w-px bg-pcb-border mx-2 self-stretch"></span>
    <button type="button" class="filter-pill" data-filter-group="type" data-filter-value="sell-side">Sell-side</button>
    <button type="button" class="filter-pill" data-filter-group="type" data-filter-value="buy-side">Buy-side</button>
    <button type="button" class="filter-pill" data-filter-group="type" data-filter-value="pe">PE</button>
    <span class="w-px bg-pcb-border mx-2 self-stretch"></span>
    <button type="button" class="filter-pill" data-filter-group="sector" data-filter-value="technology-services">Tech Services</button>
    <button type="button" class="filter-pill" data-filter-group="sector" data-filter-value="management-consulting">Consulting</button>
    <button type="button" class="filter-pill" data-filter-group="sector" data-filter-value="digital-media-marketing">Digital/Media</button>
    <button type="button" class="filter-pill" data-filter-group="sector" data-filter-value="human-capital-management">HCM</button>
    <span class="w-px bg-pcb-border mx-2 self-stretch"></span>
    <button type="button" class="filter-pill" data-filter-group="crossBorder">Cross-border</button>
  </div>
</div>

<style>
  .filter-pill {
    padding: 0.375rem 0.875rem;
    border: 1px solid theme('colors.pcb.border');
    border-radius: 9999px;
    color: theme('colors.pcb.ink');
    background: transparent;
    transition: all 150ms ease;
  }
  .filter-pill:hover { border-color: theme('colors.pcb.blue'); color: theme('colors.pcb.blue'); }
  .filter-pill[aria-pressed="true"] {
    background: theme('colors.pcb.ink');
    color: theme('colors.pcb.paper');
    border-color: theme('colors.pcb.ink');
  }
</style>

<script>
  import { applyFilters, parseHashFilters, serializeFilters, EMPTY_STATE, type FilterState } from '../scripts/deal-filter';

  const filterEl = document.getElementById('deal-filter');
  const grid = document.getElementById('deal-grid');
  if (filterEl && grid) {
    const cards = Array.from(grid.querySelectorAll('article')) as HTMLElement[];
    let state: FilterState = parseHashFilters(location.hash);

    function render() {
      applyFilters(cards, state);
      // Sync pill aria-pressed.
      filterEl!.querySelectorAll<HTMLButtonElement>('button.filter-pill').forEach(btn => {
        const group = btn.dataset.filterGroup;
        const value = btn.dataset.filterValue;
        let active = false;
        if (group === 'clear') {
          active = state.types.length === 0 && state.sectors.length === 0 && !state.crossBorderOnly;
        } else if (group === 'type' && value) active = state.types.includes(value);
        else if (group === 'sector' && value) active = state.sectors.includes(value);
        else if (group === 'crossBorder') active = state.crossBorderOnly;
        btn.setAttribute('aria-pressed', String(active));
      });
      const newHash = serializeFilters(state);
      const desired = newHash ? '#' + newHash : '';
      if (location.hash !== desired) history.replaceState(null, '', location.pathname + desired);
    }

    filterEl.addEventListener('click', (ev) => {
      const btn = (ev.target as HTMLElement).closest('button.filter-pill') as HTMLButtonElement | null;
      if (!btn) return;
      const group = btn.dataset.filterGroup;
      const value = btn.dataset.filterValue;
      if (group === 'clear') {
        state = { ...EMPTY_STATE };
      } else if (group === 'type' && value) {
        state.types = state.types.includes(value) ? state.types.filter(t => t !== value) : [...state.types, value];
      } else if (group === 'sector' && value) {
        state.sectors = state.sectors.includes(value) ? state.sectors.filter(s => s !== value) : [...state.sectors, value];
      } else if (group === 'crossBorder') {
        state.crossBorderOnly = !state.crossBorderOnly;
      }
      render();
    });

    window.addEventListener('hashchange', () => {
      state = parseHashFilters(location.hash);
      render();
    });

    render();
  }
</script>
```

- [ ] **Step 8: Wire filter into `src/pages/deals/index.astro`**

Import the component and place it above the grid:

```astro
import DealFilter from '../../components/DealFilter.astro';
// ...
<!-- BELOW the hero/stats section, ABOVE the grid section -->
<DealFilter />
<section class="pb-24">
  <div id="deal-grid" class="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
    ...
  </div>
</section>
```

- [ ] **Step 9: Manual smoke test**

```bash
npm run dev
# /deals/ — click filter pills. Confirm cards filter in real time. Check URL hash updates (e.g., #type=sell-side).
# Reload the page with that hash — confirm the filter state is restored.
# Open in mobile width — confirm pills wrap.
```

- [ ] **Step 10: Run tests + build + commit**

```bash
npm test
npm run build
git add src/scripts/ src/components/DealFilter.astro src/pages/deals/index.astro tests/ vitest.config.ts package.json package-lock.json
git commit -m "Add Deals filter with TDD coverage and URL-hash persistence"
```

---

### Task 20: Team page

**Files:**
- Create: `src/pages/team/index.astro`

- [ ] **Step 1: Write `src/pages/team/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';

const members = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
const partners = members.filter(m => m.data.isPartner);
const team = members.filter(m => !m.data.isPartner);
const founder = partners.find(p => /founding/i.test(p.data.role));
const manifesto = founder?.data.manifesto;
const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);
---
<BaseLayout title="Team — PCB Partners">
  <Nav slot="nav" />

  <!-- HERO -->
  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Partners &amp; Team</p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      Advisors who've <em class="italic">run the companies</em> they now advise.
    </h1>
    <p class="mt-8 max-w-2xl text-lg leading-relaxed text-pcb-ink/70">
      PCB Partners is founded and led by operators — partners who built, scaled, and sold their own consulting, digital, and technology services businesses before coming back to the sell-side of the table.
    </p>
  </section>

  <!-- MANIFESTO (only if founder has one) -->
  {manifesto && (
    <section class="bg-pcb-ink text-pcb-paper">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue-light">The PCB difference</p>
        <blockquote class="mt-6 font-display font-extralight italic text-2xl md:text-4xl leading-tight max-w-4xl">
          "{manifesto}"
        </blockquote>
        <p class="mt-6 text-xs uppercase tracking-brand-eyebrow text-pcb-blue-light">— {founder!.data.name}, {founder!.data.role}</p>
      </div>
    </section>
  )}

  <!-- PARTNERS -->
  <section>
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div class="flex items-baseline justify-between flex-wrap gap-4">
        <h2 class="font-display-bold text-2xl md:text-3xl">Partners</h2>
        <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Operator-founders, each with deep sector specialism</p>
      </div>
      <div class="mt-10 grid md:grid-cols-3 gap-4">
        {partners.map(p => (
          <article class="border border-pcb-border rounded-md p-6">
            <div class="w-18 h-18 rounded-full bg-pcb-surface border border-pcb-border flex items-center justify-center font-display text-2xl text-pcb-muted" style="width: 4.5rem; height: 4.5rem;">
              {initials(p.data.name)}
            </div>
            <h3 class="mt-4 font-display text-xl">{p.data.name}</h3>
            <p class="mt-1 text-[11px] uppercase tracking-brand-eyebrow text-pcb-blue">{p.data.role}</p>
            <p class="mt-4 text-sm text-pcb-ink/70 leading-relaxed">{p.data.bio}</p>
            {p.data.linkedIn && <p class="mt-4"><a href={p.data.linkedIn} class="text-sm text-pcb-blue hover:underline">LinkedIn →</a></p>}
          </article>
        ))}
      </div>
    </div>
  </section>

  <!-- TEAM -->
  {team.length > 0 && (
    <section class="bg-pcb-surface">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <h2 class="font-display-bold text-2xl md:text-3xl">Team</h2>
        <div class="mt-10 grid md:grid-cols-3 gap-4">
          {team.map(t => (
            <article class="bg-pcb-paper border border-pcb-border rounded-md p-6">
              <h3 class="font-display text-xl">{t.data.name}</h3>
              <p class="mt-1 text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">{t.data.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )}

  <Footer slot="footer" />
</BaseLayout>
```

Note the `set:html={p.body}` — Astro exposes the raw markdown body as `.body` on a content entry; we render it as HTML inside the partner card. If markdown rendering is preferred (with `Content` component), restructure to call `.render()` per partner. For short bios, `set:html` with raw markdown will still display mostly readable text — if this is a concern, switch to rendered HTML.

- [ ] **Step 2: Verify + commit**

```bash
npm run dev
# /team/: hero, manifesto (only if Ben quote in frontmatter), 6 partner cards, 3 team cards.
npm run build
git add src/pages/team/
git commit -m "Build Team page with optional manifesto block"
```

---

### Task 21: Insights listing + detail pages

**Files:**
- Create: `src/pages/insights/index.astro`
- Create: `src/pages/insights/[slug].astro`

- [ ] **Step 1: Write `src/pages/insights/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';

const insights = (await getCollection('insight')).sort((a, b) => b.data.date.localeCompare(a.data.date));
---
<BaseLayout title="Insights — PCB Partners">
  <Nav slot="nav" />

  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Insights</p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      Perspectives on the <em class="italic">digital economy.</em>
    </h1>
  </section>

  <section class="pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-4">
      {insights.map(i => (
        <a href={`/insights/${i.slug}/`} class="block border border-pcb-border rounded-md p-6 hover:border-pcb-blue transition-colors">
          <div class="text-[11px] uppercase tracking-brand-eyebrow text-pcb-muted">{i.data.date}</div>
          <h2 class="mt-2 font-display text-xl leading-snug">{i.data.title}</h2>
          {i.data.author && <p class="mt-3 text-sm text-pcb-ink/70">By {i.data.author}</p>}
        </a>
      ))}
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/insights/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const insights = await getCollection('insight');
  return insights.map(i => ({ params: { slug: i.slug }, props: { insight: i } }));
}

const { insight } = Astro.props;
const { Content } = await insight.render();
---
<BaseLayout title={`${insight.data.title} — PCB Insights`}>
  <Nav slot="nav" />

  <article class="max-w-3xl mx-auto px-6 lg:px-10 pt-20 pb-20">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">
      <a href="/insights/" class="hover:text-pcb-blue">Insights</a>
      &nbsp;·&nbsp;
      <span>{insight.data.date}</span>
    </p>
    <h1 class="mt-5 font-display font-extralight text-4xl md:text-5xl leading-tight">
      {insight.data.title}
    </h1>
    {insight.data.author && <p class="mt-4 text-sm text-pcb-ink/70">By {insight.data.author}</p>}
    <div class="mt-10 prose prose-slate max-w-none">
      <Content />
    </div>
  </article>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
# /insights/ shows at least the placeholder article.
# /insights/placeholder/ renders the article.
npm run build
git add src/pages/insights/
git commit -m "Add Insights listing and detail pages"
```

---

### Task 22: Contact page

**Files:**
- Create: `src/pages/contact/index.astro`

- [ ] **Step 1: Write `src/pages/contact/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
---
<BaseLayout title="Contact — PCB Partners">
  <Nav slot="nav" />

  <section class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-20">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Contact</p>
    <h1 class="mt-5 font-display font-extralight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight max-w-4xl">
      Thinking about a transaction? <em class="italic">Let's talk.</em>
    </h1>

    <div class="mt-16 grid md:grid-cols-2 gap-12">
      <div>
        <h2 class="font-display-bold text-xl">Send us a message</h2>
        <p class="mt-2 text-sm text-pcb-ink/70">Fill in the form below and your email client will open with the details pre-populated.</p>

        <form
          id="contact-form"
          method="get"
          action="mailto:team@pcbpartners.co.uk"
          enctype="text/plain"
          class="mt-6 space-y-4"
        >
          <label class="block">
            <span class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Name</span>
            <input type="text" name="name" required class="mt-1 w-full border border-pcb-border px-3 py-2 rounded-sm focus:outline-none focus:border-pcb-blue" />
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Email</span>
            <input type="email" name="from" required class="mt-1 w-full border border-pcb-border px-3 py-2 rounded-sm focus:outline-none focus:border-pcb-blue" />
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Subject</span>
            <input type="text" name="subject" required class="mt-1 w-full border border-pcb-border px-3 py-2 rounded-sm focus:outline-none focus:border-pcb-blue" />
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-brand-eyebrow text-pcb-muted">Message</span>
            <textarea name="body" rows="5" required class="mt-1 w-full border border-pcb-border px-3 py-2 rounded-sm focus:outline-none focus:border-pcb-blue"></textarea>
          </label>
          <button type="submit" class="border border-pcb-ink px-5 py-3 text-sm font-medium hover:bg-pcb-ink hover:text-pcb-paper transition-colors rounded-sm">
            Send via email →
          </button>
        </form>
      </div>

      <div class="space-y-8">
        <div>
          <h2 class="font-display-bold text-xl">Direct</h2>
          <p class="mt-4 text-sm">
            <a href="mailto:team@pcbpartners.co.uk" class="text-pcb-blue hover:underline">team@pcbpartners.co.uk</a><br />
            <a href="tel:+442037959084" class="text-pcb-ink/80 hover:text-pcb-blue">+44 (0) 203 795 9084</a>
          </p>
        </div>

        <div>
          <h2 class="font-display-bold text-xl">Regulatory</h2>
          <p class="mt-4 text-sm text-pcb-ink/70 leading-relaxed">
            PCB Partners is authorised and regulated by the Financial Conduct Authority (Firm 948557). US-registered transactions are arranged via Finalis Securities LLC, member FINRA/SIPC.
          </p>
        </div>
      </div>
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Verify + commit**

```bash
npm run dev
# /contact/: form renders, fields focus with blue outline, submit opens mail client.
npm run build
git add src/pages/contact/
git commit -m "Add Contact page with mailto-backed form"
```

---

## Phase 7 — Launch prep

### Task 23: SEO, sitemap, robots, 404

**Files:**
- Create: `src/pages/404.astro`
- Create: `public/robots.txt`
- Modify: `astro.config.mjs` (add sitemap integration + site URL)
- Modify: `package.json` (dep: `@astrojs/sitemap`)

- [ ] **Step 1: Install sitemap integration**

```bash
npm install @astrojs/sitemap
```

- [ ] **Step 2: Update `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pcb.partners',
  integrations: [tailwind(), sitemap()],
});
```

- [ ] **Step 3: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://pcb.partners/sitemap-index.xml
```

- [ ] **Step 4: Write `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Page not found — PCB Partners">
  <Nav slot="nav" />
  <section class="max-w-7xl mx-auto px-6 lg:px-10 py-32 text-center">
    <p class="text-xs uppercase tracking-brand-eyebrow text-pcb-blue">404</p>
    <h1 class="mt-5 font-display font-extralight text-5xl md:text-7xl">
      This page <em class="italic">went off-piste.</em>
    </h1>
    <p class="mt-8 text-pcb-ink/70">Let's get you back to somewhere useful.</p>
    <a href="/" class="mt-8 inline-block border border-pcb-ink px-5 py-3 text-sm font-medium hover:bg-pcb-ink hover:text-pcb-paper rounded-sm">
      Home →
    </a>
  </section>
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 5: Build and verify sitemap + robots**

```bash
npm run build
ls dist/
# Expected to see: sitemap-index.xml, sitemap-0.xml, robots.txt, 404.html
cat dist/robots.txt
```

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json public/robots.txt src/pages/404.astro
git commit -m "Add SEO integration: sitemap, robots.txt, 404 page"
```

---

### Task 24: Cloudflare Pages deployment

**Files:**
- Modify: `README.md` (document deployment)
- Modify: `package.json` (ensure `build` script outputs to `dist/`)

- [ ] **Step 1: Create GitHub repo and push**

```bash
# Create empty GitHub repo named 'pcb-partners-site' via the UI, then:
git remote add origin git@github.com:<YOUR_USER>/pcb-partners-site.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Connect Cloudflare Pages to the repo**

In the Cloudflare dashboard:
1. Workers & Pages → Create → Pages → Connect to Git.
2. Select the `pcb-partners-site` repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (default)
   - Node version env var: `NODE_VERSION=20`
4. Deploy.

Cloudflare produces a preview URL: `pcb-partners-site.pages.dev` (or similar).

- [ ] **Step 3: Smoke-test the preview URL**

Visit the preview URL. Walk through every top-level route:
- `/` Home
- `/sectors/`, `/sectors/technology-services/` (and the other 3)
- `/services/`, `/services/sell-side/` (and the other 2)
- `/deals/` (test filter)
- `/team/`
- `/insights/`, `/insights/placeholder/`
- `/contact/`
- `/this-does-not-exist` → 404 page

Run Lighthouse on Home:

```bash
# Optional — from any machine with Chrome:
npx lighthouse https://pcb-partners-site.pages.dev --only-categories=performance,seo,accessibility,best-practices
```

Targets per spec §18: Performance ≥ 95, SEO ≥ 95, Accessibility ≥ 90.

If Performance is under target: check `dist/` for unexpectedly large files, ensure fonts preload, confirm grayscale logos loading lazily.

- [ ] **Step 4: Add custom domain `pcb.partners`**

In Cloudflare Pages → the project → Custom domains → Set up a custom domain → `pcb.partners`.

- If `pcb.partners` is registered with Cloudflare: DNS auto-configures. SSL auto-provisions (a few minutes).
- If registered elsewhere: follow the on-screen instructions to point NS records to Cloudflare nameservers, or add CNAME manually.

- [ ] **Step 5: Update README**

Append to `README.md`:

```markdown
# PCB Partners Website

Static site for PCB Partners, an M&A advisory boutique, hosted at https://pcb.partners.

## Local development

```bash
npm install
npm run dev         # http://localhost:4321
npm run build       # output to dist/
npm test            # unit tests (vitest)
```

## Deployment

Connected to Cloudflare Pages. Push to `main` → auto-deploy. Any branch push → preview URL.

## Content

Content lives in `src/content/` as typed collections:
- `sector/` — 4 sector pages
- `service/` — 3 service pages
- `deal/` — selected transactions (YAML)
- `team/` — partner + team bios
- `insight/` — news/articles

Schemas in `src/content/config.ts`.

## Design system

See `docs/superpowers/specs/2026-04-24-pcb-partners-site-design.md`.
```

- [ ] **Step 6: Final commit + push**

```bash
git add README.md
git commit -m "Document deployment and content model in README"
git push
```

---

## Post-launch checklist (before sending Ben the link)

These are manual decisions, not code tasks. Handle each before sharing with Ben.

- [ ] **Substantiate or remove Home hero metrics** (spec §19.1) — current 100+/14/4/20yr+ are illustrative. Replace with sourced numbers from `pcbpartners.co.uk` or delete the `<MetricsStrip />` import from `src/pages/index.astro`.
- [ ] **Resolve manifesto quote** (spec §19.2) — if no real Ben Doltis quote is identifiable from existing public material, remove the `manifesto:` field from `src/content/team/ben-doltis.md`. The Team page handles the absent case gracefully.
- [ ] **Verify Pulp Display licensing** (spec §19.4) — confirm with Ben that self-hosting the same font files on `pcb.partners` is within the firm's licence. If not, swap to a freely-licensed similar face (e.g., Instrument Sans, Neue Haas Grotesk substitute). Single global change: `src/styles/global.css` @font-face blocks + `tailwind.config.mjs` fontFamily.
- [ ] **Upgrade low-quality client logos** — anything listed in `public/logos/README.md` "Replace-me" section.
- [ ] **Mirror real /news articles** — replace `src/content/insight/placeholder.md` with actual articles mirrored from `pcbpartners.co.uk/news/`.
- [ ] **Final Lighthouse audit** on the custom domain (not just preview URL).

---

## Plan self-review notes

**Spec coverage:** All 20 spec sections covered.
- §1–5 (context, goals, non-goals, narrative, content) → reflected across all content tasks
- §6 IA → Tasks 16, 17 (routes), 10 (nav order)
- §7 design system → Tasks 2, 3
- §8 Home → Tasks 12–15
- §9 Inner templates → Tasks 16, 17
- §10 Deals → Tasks 18, 19
- §11 Team → Task 20
- §12 Insights → Task 21
- §13 Contact → Task 22
- §14 Tech architecture → Tasks 1, 5
- §15 Assets → Tasks 3, 4
- §16 Cloudflare Pages → Task 24
- §17 SEO → Task 23
- §18 Performance → Task 24 Lighthouse step
- §19 Open questions → Post-launch checklist

**Type consistency:** `FilterState` type, `applyFilters`/`parseHashFilters`/`serializeFilters` names used consistently across Task 19 files. Content collection schemas used consistently: `sector`, `service`, `deal`, `team`, `insight`. `dealSlugs: string[]` used across sector + service schemas and consumed via `getEntries` in home + inner-template tasks.

**Bite-sized check:** 24 tasks across 7 phases. Each task is one coherent increment with commit. Most tasks complete in 30–60 minutes for a skilled developer; Task 19 (Deals filter, TDD) is the longest at ~90 minutes.
