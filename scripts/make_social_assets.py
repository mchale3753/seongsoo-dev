#!/usr/bin/env python3
"""Generate OG image + favicons for seongsoo.dev (dark + gold brand)."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "social"
OUT.mkdir(parents=True, exist_ok=True)

BG = (10, 10, 10)
INK = (237, 237, 237)
DIM = (176, 176, 176)
MUTE = (119, 119, 119)
GOLD = (184, 152, 86)
GOLD2 = (214, 182, 115)
GOOD = (74, 222, 128)

BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

def F(path, size):
    return ImageFont.truetype(path, size)

# ---------- OG image 1200x630 ----------
W, H = 1200, 630
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# subtle radial-ish glow (gold) using concentric translucent ellipses
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
cx, cy = int(W * 0.78), int(H * 0.30)
for i in range(60, 0, -1):
    r = i * 9
    a = int(2.0 * (i / 60))
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(184, 152, 86, a))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)

PAD = 80
# top: green dot + brand
dot_y = PAD + 8
d.ellipse([PAD, dot_y, PAD + 18, dot_y + 18], fill=GOOD)
d.text((PAD + 34, PAD), "seongsoo.dev", font=F(MONO, 30), fill=DIM)

# headline
name_f = F(BOLD, 84)
d.text((PAD, 210), "Seongsoo Shin", font=name_f, fill=INK)

role_f = F(REG, 44)
d.text((PAD, 312), "Full-stack Software Engineer", font=role_f, fill=GOLD2)

# supporting line
sub_f = F(REG, 30)
d.text((PAD, 392), "A decade shipping product end to end.", font=sub_f, fill=DIM)

# chips
chip_f = F(REG, 26)
chips = ["ex-CTO", "Series A", "KR + JP", "React · Laravel · Node"]
x = PAD
cy2 = 470
for c in chips:
    bbox = d.textbbox((0, 0), c, font=chip_f)
    tw = bbox[2] - bbox[0]
    pad_x = 22
    box_w = tw + pad_x * 2
    d.rounded_rectangle([x, cy2, x + box_w, cy2 + 52], radius=10,
                        outline=(58, 58, 58), width=2, fill=(20, 20, 20))
    d.text((x + pad_x, cy2 + 11), c, font=chip_f, fill=DIM)
    x += box_w + 16

# bottom availability + gold rule
d.rectangle([PAD, 560, PAD + 110, 564], fill=GOLD)
avail_f = F(REG, 26)
d.text((PAD, 580), "Available from March 2027", font=avail_f, fill=MUTE)

og_path = OUT / "og.png"
img.save(og_path, "PNG")
print("wrote", og_path, img.size)

# ---------- Favicon: gold rounded square w/ S + green dot ----------
def make_icon(size):
    ic = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dd = ImageDraw.Draw(ic)
    r = max(2, int(size * 0.18))
    dd.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=(15, 15, 15))
    dd.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, outline=GOLD,
                         width=max(1, int(size * 0.06)))
    # letter S
    try:
        fs = int(size * 0.62)
        f = F(BOLD, fs)
        bbox = dd.textbbox((0, 0), "S", font=f)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        dd.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - int(size*0.02)),
                "S", font=f, fill=GOLD2)
    except Exception:
        pass
    # green status dot bottom-right
    dr = max(2, int(size * 0.16))
    dd.ellipse([size - dr - int(size*0.10), size - dr - int(size*0.10),
                size - int(size*0.10), size - int(size*0.10)], fill=GOOD)
    return ic

for s in (16, 32, 48, 180, 192, 512):
    make_icon(s).save(OUT / f"icon-{s}.png")
print("wrote PNG icons")

# apple-touch (180, solid bg)
at = Image.new("RGB", (180, 180), (15, 15, 15))
at.paste(make_icon(180), (0, 0), make_icon(180))
at.save(OUT / "apple-touch-icon.png")

# favicon.ico (multi-size)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
make_icon(48).save(ROOT / "favicon.ico", sizes=ico_sizes)
print("wrote favicon.ico")

# SVG favicon (crisp)
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="1.5" y="1.5" width="61" height="61" rx="12" fill="#0f0f0f" stroke="#b89856" stroke-width="3.5"/>
  <text x="32" y="44" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="700" fill="#d6b673" text-anchor="middle">S</text>
  <circle cx="50" cy="50" r="7" fill="#4ade80"/>
</svg>
'''
(ROOT / "favicon.svg").write_text(svg, encoding="utf-8")
print("wrote favicon.svg")
print("DONE")
