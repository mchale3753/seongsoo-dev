# seongsoo.dev — Portfolio site

[![Live](https://img.shields.io/badge/Live-seongsoo.dev-4ade80?style=for-the-badge&logo=vercel&logoColor=white)](https://seongsoo.dev)

Next.js (App Router, **static export**) portfolio site for Seongsoo Shin — full-stack engineer, ex-CTO, 17 projects across a decade.
Bilingual KR/EN, dark editorial design, all projects open as modals on the index page.

## Projects

| # | Project | Year | Domain |
|---|---------|------|--------|
| 01 | [Nmodelin](https://seongsoo.dev/?modal=nmodelin) | 2022–2025 | Fashion influencer marketing · CTO |
| 02 | [Le Soleil / Planterior](https://seongsoo.dev/?modal=lesoleil-planterior) | 2024 | Mobile landing |
| 03 | [TOSPACE](https://seongsoo.dev/?modal=tospace) | 2022 | 3D space mock-up · React |
| 04 | [Bullida](https://seongsoo.dev/?modal=bullida) | 2021 | Fractional-investing fintech |
| 05 | [Coffeebanhada](https://seongsoo.dev/?modal=coffee) | 2020–2021 | Cafe smart-order app |
| 06 | [Dabatruck](https://seongsoo.dev/?modal=dabatruck) | 2020 | Truck ad matching · GPS |
| 07 | [S-TEAM](https://seongsoo.dev/?modal=s-team) | 2019–2020 | Japan-bound soccer SaaS |
| 08 | [Neurodio](https://seongsoo.dev/?modal=neurodio) | 2019–2020 | Audio therapy · 3 locales |
| 09 | [D-HUB](https://seongsoo.dev/?modal=d-hub) | 2019 | Blockchain developer portal |
| 10 | [Unibook](https://seongsoo.dev/?modal=unibook) | 2019 | Campus locker · ads · IoT |
| 11 | [Dinx](https://seongsoo.dev/?modal=dinx) | 2019 | Anti-doping drug index · JP |
| 12 | [Ranking GG](https://seongsoo.dev/?modal=ranking-gg) | 2018–2019 | Real-time e-sports tournament |
| 13 | [GEM Platform](https://seongsoo.dev/?modal=gem-platform) | 2018 | 3D model marketplace |
| 14 | [GEM E-Learning](https://seongsoo.dev/?modal=gem-elearning) | 2018 | 3D-printing course site |
| 15 | [BEXCO MICE CRM](https://seongsoo.dev/?modal=bexco) | 2017–2018 | CRM · 100k+ contacts |
| 16 | [Cashbin](https://seongsoo.dev/?modal=cashbin) | 2017 | IoT recycling rewards |
| 17 | [Ulsan Bus](https://seongsoo.dev/?modal=ulsan-bus) | 2014 | Real-time bus locator |

## Why static export
The site has no server runtime — `next.config.mjs` uses `output: 'export'`, so
`npm run build` emits a fully static `out/` directory that drops onto Vercel,
Cloudflare Pages, GitHub Pages, or any static host.

## Architecture
- **Modal-first projects.** All project details open as in-page modals on `/`. Direct links like `seongsoo.dev/?modal=nmodelin` redirect-free — the index page reads `?modal=<slug>` on load and opens the modal automatically.
- **Shared chrome as components.** `Header`, `Footer`, `Lightbox`, and `PageShell` wrap extracted `<main>` HTML.
- **Client runtime.** `src/components/SiteRuntime.js` handles mobile nav drawer, EN/KO language toggle, gallery lightbox, scroll reveal, and first-load screen.
- **i18n is CSS-driven**: `html[data-lang]` shows/hides `[data-i18n-en]` / `[data-i18n-ko]` elements.
- **Per-page SEO/OG** via `generateMetadata` / `buildMetadata`.

## Commands
```bash
npm install
npm run build     # static export to out/
npx serve out     # preview the static build
```

## Routes
`/`  ·  `/career/`  ·  `/projects/`  ·  `/contact/`  ·  `/projects/<slug>/` → redirects to `/?modal=<slug>`
