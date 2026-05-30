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

# ---------- profile photo on the right ----------
PHOTO = ROOT / "assets" / "profile" / "derived" / "contact-portrait.jpg"
photo_w = 400
try:
    ph = Image.open(PHOTO).convert("RGB")
    pw, phh = ph.size
    target_ratio = photo_w / H
    src_ratio = pw / phh
    if src_ratio > target_ratio:
        new_w = int(phh * target_ratio)
        left = (pw - new_w) // 2
        ph = ph.crop((left, 0, left + new_w, phh))
    else:
        new_h = int(pw / target_ratio)
        top = (phh - new_h) // 2
        ph = ph.crop((0, top, pw, top + new_h))
    ph = ph.resize((photo_w, H), Image.LANCZOS)
    img.paste(ph, (W - photo_w, 0))
    # left-edge gradient fade from bg into photo so text side stays clean
    fade = Image.new("RGBA", (220, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fade)
    for i in range(220):
        a = int(255 * (1 - i / 220))
        fd.line([(i, 0), (i, H)], fill=(10, 10, 10, a))
    img.paste(fade, (W - photo_w, 0), fade)
    # thin gold seam
    d.rectangle([W - photo_w, 0, W - photo_w + 3, H], fill=GOLD)
except Exception as e:
    print("photo skip:", e)

d = ImageDraw.Draw(img)

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

# chips (wrap to a new row if they'd collide with the photo)
chip_f = F(REG, 26)
chips = ["ex-CTO", "Series A", "KR + JP", "React · Laravel · Node"]
x = PAD
cy2 = 458
row_h = 64
max_x = W - photo_w - 40  # keep clear of the photo seam
for c in chips:
    bbox = d.textbbox((0, 0), c, font=chip_f)
    tw = bbox[2] - bbox[0]
    pad_x = 22
    box_w = tw + pad_x * 2
    if x + box_w > max_x:
        x = PAD
        cy2 += row_h
    d.rounded_rectangle([x, cy2, x + box_w, cy2 + 52], radius=10,
                        outline=(58, 58, 58), width=2, fill=(20, 20, 20))
    d.text((x + pad_x, cy2 + 11), c, font=chip_f, fill=DIM)
    x += box_w + 16

# bottom availability + gold rule
d.rectangle([PAD, 590, PAD + 110, 594], fill=GOLD)
avail_f = F(REG, 24)
d.text((PAD, 602), "Available from March 2027  ·  seongsoo.dev", font=avail_f, fill=MUTE)

og_path = OUT / "og.png"
img.save(og_path, "PNG")
print("wrote", og_path, img.size)

# NOTE: Favicons are generated from the user's profile photo by
# scripts/make_favicon_from_photo.py — do NOT regenerate them here, or you'll
# overwrite the photo icons with a placeholder mark. This script only builds og.png.
print("DONE (og only — run make_favicon_from_photo.py for favicons)")

print("DONE")
