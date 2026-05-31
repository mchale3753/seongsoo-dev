#!/usr/bin/env python3
"""Lift the backlit, underexposed face/shirt on the career profile-card photo.

The portrait is backlit: bright banana-plant/sky background, face+shirt in shadow.
We lift shadows and midtones (so the subject brightens) while protecting highlights
(so the bright background doesn't blow out), add a touch of local contrast/warmth,
and keep it natural for a recruiter-facing portrait.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/profile/derived/profile-card.jpg'
SRC = OUT  # work from the current (already retouched/optimized) image
BACKUP = ROOT / 'assets/profile/derived/_pre_hero_replace/profile-card-before-brighten.jpg'
BACKUP.parent.mkdir(parents=True, exist_ok=True)
if OUT.exists() and not BACKUP.exists():
    BACKUP.write_bytes(OUT.read_bytes())

im = Image.open(SRC).convert('RGB')
im = ImageOps.exif_transpose(im)
a = np.asarray(im).astype(np.float32) / 255.0

# Luminance for a highlight-protecting shadow lift.
lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def make(strength_gamma, shadow_lift, label, contrast, color, sharp):
    x = a.copy()
    # Gamma < 1 brightens midtones/shadows.
    x = np.clip(x, 0, 1) ** strength_gamma
    # Add an extra shadow lift weighted toward dark areas, fading out in highlights.
    shadow_w = np.clip(1.0 - lum, 0, 1) ** 1.4  # strongest in shadows
    x = x + (shadow_lift * shadow_w[..., None])
    x = np.clip(x, 0, 1)
    out = Image.fromarray((x * 255).astype('uint8'))
    out = ImageEnhance.Contrast(out).enhance(contrast)
    out = ImageEnhance.Color(out).enhance(color)
    out = ImageEnhance.Sharpness(out).enhance(sharp)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.0, percent=30, threshold=2))
    p = ROOT / f'assets/profile/derived/_profile_bright_{label}.png'
    out.save(p, 'PNG')
    g = np.asarray(out.convert('L')).astype(float)
    print(f'{label}: mean {g.mean():.1f}  -> {p}')
    return out

# Moderate vs stronger lift.
v1 = make(0.85, 0.07, 'v1', contrast=1.04, color=1.04, sharp=1.06)
v2 = make(0.78, 0.11, 'v2', contrast=1.05, color=1.05, sharp=1.08)

# Contact sheet for quick side-by-side.
orig_small = im.resize((480, 480), Image.Resampling.LANCZOS)
v1_small = v1.resize((480, 480), Image.Resampling.LANCZOS)
v2_small = v2.resize((480, 480), Image.Resampling.LANCZOS)
sheet = Image.new('RGB', (480 * 3, 480), 'white')
sheet.paste(orig_small, (0, 0))
sheet.paste(v1_small, (480, 0))
sheet.paste(v2_small, (960, 0))
sheet_p = ROOT / 'assets/profile/derived/_profile_bright_compare.png'
sheet.save(sheet_p)
print(f'compare (orig | v1 | v2): {sheet_p}')
