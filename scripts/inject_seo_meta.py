#!/usr/bin/env python3
"""Inject SEO/OG/Twitter/canonical/favicon (+ JSON-LD on index) into every page head.
Idempotent: skips a file if og:image already present. Anchored after the theme-color meta."""
import re
from pathlib import Path
import html as ihtml

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://seongsoo.dev"
OG_IMG = f"{SITE}/assets/social/og.png"
ANCHOR = '<meta name="theme-color" content="#0a0a0a" />'

pages = list(ROOT.glob("*.html")) + list((ROOT / "projects").glob("*.html"))

FAVICON_BLOCK = (
    '<link rel="icon" href="/favicon.ico" sizes="any" />\n'
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n'
    '<link rel="icon" type="image/png" sizes="32x32" href="/assets/social/icon-32.png" />\n'
    '<link rel="apple-touch-icon" href="/assets/social/apple-touch-icon.png" />\n'
    '<link rel="manifest" href="/site.webmanifest" />'
)

def get(rx, s, default=""):
    m = re.search(rx, s)
    return m.group(1).strip() if m else default

PERSON_LD = '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Seongsoo Shin",
  "alternateName": "\\uc2e0\\uc131\\uc218",
  "jobTitle": "Full-stack Software Engineer",
  "url": "https://seongsoo.dev",
  "email": "mailto:inbox@seongsoo.dev",
  "address": { "@type": "PostalAddress", "addressCountry": "KR" },
  "sameAs": [
    "https://github.com/mchale3753",
    "https://www.linkedin.com/in/seongsoo-shin-5b44b899/"
  ]
}
</script>'''

changed = []
for p in pages:
    s = p.read_text(encoding="utf-8")
    if "og:image" in s:
        continue
    if ANCHOR not in s:
        print("SKIP (no anchor):", p.relative_to(ROOT))
        continue
    title = get(r"<title>(.*?)</title>", s, "Seongsoo Shin")
    desc = get(r'<meta name="description" content="(.*?)"\s*/?>', s, "")
    # canonical url
    rel = p.relative_to(ROOT).as_posix()
    canon = f"{SITE}/" if rel == "index.html" else f"{SITE}/{rel}"

    block_lines = [
        ANCHOR,
        f'<link rel="canonical" href="{canon}" />',
        FAVICON_BLOCK,
        '<meta property="og:type" content="website" />',
        f'<meta property="og:site_name" content="Seongsoo Shin" />',
        f'<meta property="og:title" content="{title}" />',
        f'<meta property="og:description" content="{desc}" />',
        f'<meta property="og:url" content="{canon}" />',
        f'<meta property="og:image" content="{OG_IMG}" />',
        '<meta property="og:image:width" content="1200" />',
        '<meta property="og:image:height" content="630" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{title}" />',
        f'<meta name="twitter:description" content="{desc}" />',
        f'<meta name="twitter:image" content="{OG_IMG}" />',
    ]
    if rel == "index.html":
        block_lines.append(PERSON_LD)
    block = "\n".join(block_lines)
    s2 = s.replace(ANCHOR, block, 1)
    if s2 != s:
        p.write_text(s2, encoding="utf-8")
        changed.append(rel)

print("changed", len(changed))
for c in sorted(changed):
    print(" ", c)
