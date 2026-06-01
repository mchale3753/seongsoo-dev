# seongsoo.dev — React / Next.js port

Next.js (App Router, **static export**) port of the original static
`portfolio-site`. Same dark editorial design, same KR/EN content, clean routes.

## Why static export
The site has no server runtime — `next.config.mjs` uses `output: 'export'`, so
`npm run build` emits a fully static `out/` directory that drops onto Vercel,
Cloudflare Pages, GitHub Pages, or any static host. (None of Next.js's
server-side CVEs apply — there is no Image Optimization API, middleware, or SSR
at runtime.)

## Architecture
- **Zero copy drift.** `scripts/extract-content.mjs` reads the original
  `portfolio-site` HTML, pulls each page's `<head>` meta + `<main>` inner HTML,
  rewrites internal links (`foo.html` → `/foo/`) and asset paths
  (`../assets/` → `/assets/`), and writes `src/data/content.json`. Every word
  on the site comes straight from the source HTML — re-run the script if the
  original copy changes.
- **Shared chrome as components.** `Header`, `Footer`, `Lightbox`, and
  `PageShell` wrap the extracted `<main>` HTML.
- **Client runtime.** `src/components/SiteRuntime.js` is a faithful port of the
  original `assets/js/site.js` (mobile nav drawer, EN/KO language toggle,
  gallery lightbox, scroll reveal, first-load screen).
- **i18n is CSS-driven** (unchanged from the original): `html[data-lang]` shows
  / hides `[data-i18n-en]` / `[data-i18n-ko]` elements.
- **Projects** are a dynamic SSG route — `src/app/projects/[slug]/page.js` +
  `generateStaticParams()` pre-renders all 17 project pages.
- **Per-page SEO/OG** via `generateMetadata` / `buildMetadata` (canonical and
  og:url rewritten to the clean routes).

## Commands
```bash
npm install
npm run extract   # regenerate src/data/content.json from ../portfolio-site
npm run build     # static export to out/
npx serve out     # preview the static build
```

## Routes
`/`  ·  `/career/`  ·  `/projects/`  ·  `/contact/`  ·  `/projects/<slug>/` (×16)
