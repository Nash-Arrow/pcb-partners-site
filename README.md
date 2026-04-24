# PCB Partners Website

Static site for PCB Partners, an M&A advisory boutique, hosted at https://pcb.partners.

Built with Astro 6 + Tailwind v4, deployed free on Cloudflare Pages.

## Local development

```bash
npm install
npm run dev         # http://localhost:4321
npm run build       # output to dist/
npm test            # unit tests (vitest) — 13/13 pass
```

## Deployment

Connected to Cloudflare Pages. Push to `main` → auto-deploy. Any branch push → preview URL.

**First-time setup:**

1. Push repo to GitHub (`git remote add origin ...` + `git push -u origin main`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build settings: `npm run build` / output `dist` / root `/` / env `NODE_VERSION=20`.
4. Deploy. Preview URL is `*.pages.dev`.
5. Custom domain: Pages → project → Custom domains → add `pcb.partners`. SSL auto-provisions.

## Content

Content lives in `src/content/` as typed collections (see `src/content.config.ts`):

- `sector/` — 4 sector pages (tech services, consulting, digital/media, HCM)
- `service/` — 3 service pages (sell-side, buy-side, PE)
- `deal/` — selected transactions (YAML, one file per deal)
- `team/` — partner + team bios (frontmatter-only)
- `insight/` — news/articles (mirrored from current PCB site)

To add a deal: create `src/content/deal/my-deal.yml` matching the schema, then add its slug to any relevant sector/service `dealSlugs` array.

## Structure

```
src/
├── layouts/
│   ├── BaseLayout.astro        # <html>, meta, OG, font preload
│   └── InnerPageLayout.astro   # shared shell for sector/service pages
├── pages/
│   ├── index.astro             # Home (9-block narrative)
│   ├── sectors/                # /sectors/ + dynamic [slug]
│   ├── services/               # /services/ + dynamic [slug]
│   ├── deals/                  # /deals/ (with filter)
│   ├── team/                   # /team/
│   ├── insights/               # /insights/ + dynamic [slug]
│   ├── contact/                # /contact/ (mailto form)
│   └── 404.astro
├── components/
│   ├── Nav.astro, Footer.astro, LogoWall.astro, DealCard.astro, DealFilter.astro
│   └── home/                   # Home page section components
├── content/                    # content collections
├── content.config.ts           # Zod schemas + loaders
├── scripts/
│   └── deal-filter.ts          # filter logic (tested)
└── styles/
    └── global.css              # Tailwind v4 @theme + Pulp Display @font-face

public/
├── fonts/                      # Pulp Display woff2/woff
├── logos/                      # client logos
├── logo.svg, favicon-*.png, apple-touch-icon.png, robots.txt
```

## Design system

Mirrored from the existing pcbpartners.co.uk. Tokens in `src/styles/global.css`:

- Primary dark: `#00000A` (`text-pcb-ink`)
- Brand blue: `#0090FF` (`text-pcb-blue`)
- Paper / surface / border / muted: standard utility tokens
- Display face: Pulp Display (self-hosted)

Full design rationale: `docs/superpowers/specs/2026-04-24-pcb-partners-site-design.md`.

## Pre-launch checklist

Before sharing with Ben:

1. Substantiate or remove the Home hero metrics (see `src/components/home/MetricsStrip.astro`).
2. Confirm the Ben Doltis manifesto quote in `src/content/team/ben-doltis.md` — replace or delete the `manifesto:` field.
3. Verify Pulp Display licensing covers the new `pcb.partners` domain.
4. Mirror real `/news` articles into `src/content/insight/` (replace the placeholder).
5. Upgrade low-quality client logos flagged in `public/logos/README.md`.
