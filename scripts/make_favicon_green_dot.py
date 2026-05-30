#!/usr/bin/env python3
"""Favicon: simple green dot on dark background (brand pulse mark)."""
from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "social"
OUT.mkdir(parents=True, exist_ok=True)

BG = (15, 15, 15)
GOOD = (74, 222, 128)

def make_icon(size, rounded=True):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # dark rounded tile
    r = int(size * 0.22)
    if rounded:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=BG)
    else:
        d.rectangle([0, 0, size - 1, size - 1], fill=BG)
    # centered green dot ~ 42% of tile, with soft glow
    dot_r = int(size * 0.21)
    cx = cy = size // 2
    # glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i in range(int(size * 0.34), dot_r, -1):
        a = max(0, int(60 * (1 - (i - dot_r) / max(1, (size * 0.34 - dot_r)))))
        gd.ellipse([cx - i, cy - i, cx + i, cy + i], fill=(74, 222, 128, a // 6))
    im = Image.alpha_composite(im, glow)
    d = ImageDraw.Draw(im)
    d.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=GOOD)
    return im

for s in (16, 32, 48, 192, 512):
    make_icon(s).save(OUT / f"icon-{s}.png")
print("wrote green-dot PNG icons")

# apple-touch: solid dark bg, no transparency
at = Image.new("RGB", (180, 180), BG)
icon = make_icon(180)
at.paste(icon, (0, 0), icon)
at.save(OUT / "apple-touch-icon.png")
print("wrote apple-touch-icon")

# favicon.ico (square, no alpha for compatibility)
ico = make_icon(48, rounded=False).convert("RGB")
ico.save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicon.ico")

# SVG favicon (crisp green dot)
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="0" y="0" width="64" height="64" rx="14" fill="#0f0f0f"/>
  <circle cx="32" cy="32" r="13" fill="#4ade80"/>
</svg>
'''
(ROOT / "favicon.svg").write_text(svg, encoding="utf-8")
print("wrote favicon.svg")
print("DONE")
