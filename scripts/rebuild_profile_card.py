#!/usr/bin/env python3
"""Rebuild the career profile-card from the TRUE original crop.

The retouch/optimize pipeline darkened the portrait (face luminance 175 -> 134).
The .orig crop is already well-exposed, so we start from it and apply only a light
web finish: gentle warmth, mild local contrast, subtle sharpening. No darkening.
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/profile/derived/profile-card.jpg.orig'
OUT = ROOT / 'assets/profile/derived/profile-card.jpg'
PREVIEW = ROOT / 'assets/profile/derived/_profile_fromorig_preview.png'

im = Image.open(SRC).convert('RGB')
im = ImageOps.exif_transpose(im)

# Very light, flattering finish. Slight brightness bump so it reads crisp on the
# career page, gentle warmth, subtle contrast + sharpening. Keep it natural.
im = ImageEnhance.Brightness(im).enhance(1.04)
im = ImageEnhance.Contrast(im).enhance(1.05)
im = ImageEnhance.Color(im).enhance(1.05)
im = ImageEnhance.Sharpness(im).enhance(1.08)
im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=2))

im.save(PREVIEW, 'PNG')
im.save(OUT, 'JPEG', quality=90, optimize=True, progressive=True)

import numpy as np
a = np.asarray(im.convert('L')).astype(float)
h, w = a.shape
face = a[int(0.40*h):int(0.62*h), int(0.28*w):int(0.55*w)]
print(f'face mean {face.mean():.1f}  overall {a.mean():.1f}')
print(f'wrote {OUT} {OUT.stat().st_size/1024:.1f}KB')
print(f'preview {PREVIEW}')
