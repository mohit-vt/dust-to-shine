# Dust To Shine — cinematic homepage (static port)

This is a plain HTML5 / CSS3 / vanilla JavaScript build of the design you
approved (the cyan-accent "Sites" redesign screenshot) — ported from
`sites-redesign/app/page.tsx` so it can run on **GitHub Pages**, which only
serves static files.

## Why not deploy `sites-redesign/` directly?

That folder is a Next.js app built for **Cloudflare Workers** (`wrangler`,
`vinext`) with a database layer (`drizzle-kit`) and an `app/chatgpt-auth.ts`
file — its own README says it "mirrors the premium React/Vinext redesign
currently published with **OpenAI Sites**." GitHub Pages has no server
runtime, so that app can never load there regardless of configuration —
that was the actual cause of the "doesn't load" issue, not a bug to patch.

This static build reproduces the same visuals, copy, motion and real
photography (`hero-transform.webp`, `facility-team.webp`,
`marble-polish.webp`, already in the repo) without needing a server, a
database, or a build step — so it works with the `.github/workflows/pages.yml`
you already have (`path: .`).

## Structure

- `index.html` — full homepage: cinematic logo intro, hero, trust strip,
  8 services, facility-management feature, 4-step process, polish story,
  industries grid, AMC plans, quote form → WhatsApp, footer.
- `privacy.html`, `terms.html` — same copy as the React version's legal pages.
- `assets/css/style.css` — full visual system (cyan/navy/gold palette),
  scroll-reveal system, responsive breakpoints, reduced-motion support.
- `assets/js/main.js` — intro timing, scroll progress, section reveals,
  mobile nav, per-field form validation, WhatsApp deep link.
- `assets/img/` — the real hero/team/marble photography + logo, copied
  from `sites-redesign/public/`.

## To deploy

Drop these files into the repo root (replacing the previous `index.html`,
`assets/`, `privacy.html`, `terms.html`), commit, and push to `main` — your
existing Pages workflow will deploy it automatically to
https://mohit-vt.github.io/dust-to-shine/

The `sites-redesign/` folder can stay in the repo (it's inert — the Pages
workflow doesn't build it) or be removed if you don't plan to deploy it to
Cloudflare Workers separately.

## Local preview

```
python3 -m http.server 8000
```
