#!/usr/bin/env python3
"""v3: precise sparkle-watermark removal for the index hero.

The sparkle watermark sits at source-coords x~764-774, y~953-994 (820x1024 source).
v1 over-masked (dark smear), v2 drew only a 2px outline (missed entirely).
This version masks a tight filled region exactly over the sparkle, inpaints with
Telea, feathers the blend, then resizes to the 1200x1500 hero spec.
"""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = Path('/home/intercluster/.hermes/images/clip_20260530_225239_1.png')
OUT = ROOT / 'assets/profile/derived/hero-workflow.jpg'
PREVIEW = ROOT / 'assets/profile/derived/_new_hero_inpaint_v3.png'
BACKUP_DIR = ROOT / 'assets/profile/derived/_pre_hero_replace'
BACKUP_DIR.mkdir(parents=True, exist_ok=True)
# Keep the original retouched hero as a restore point (only once).
orig = ROOT / 'assets/profile/derived/hero-workflow.jpg.orig'
backup = BACKUP_DIR / 'hero-workflow-before-new-photo.jpg'
if orig.exists() and not backup.exists():
    backup.write_bytes(orig.read_bytes())

bgr = cv2.imread(str(SRC), cv2.IMREAD_COLOR)
if bgr is None:
    raise SystemExit(f'cannot read {SRC}')
h, w = bgr.shape[:2]

# Tight filled mask centered on the sparkle. Cover the full 4-point star plus a
# small margin for anti-aliased pixels. The area underneath is dark wallet/table,
# so inpaint reconstructs it cleanly.
mask = np.zeros((h, w), dtype=np.uint8)
cv2.rectangle(mask, (756, 946), (784, 1002), 255, -1)
# Also catch any stray bright sparkle pixels just outside that box (data-driven).
sub = bgr[940:1010, 740:815]
hsv = cv2.cvtColor(sub, cv2.COLOR_BGR2HSV)
local = ((hsv[:, :, 2] > 140) & (hsv[:, :, 1] < 70)).astype(np.uint8) * 255
local = cv2.dilate(local, np.ones((5, 5), np.uint8), iterations=2)
mask[940:1010, 740:815] = np.maximum(mask[940:1010, 740:815], local)
mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)

inpainted = cv2.inpaint(bgr, mask, 4, cv2.INPAINT_TELEA)

# Feather the patch into the original so there's no hard seam.
soft = cv2.GaussianBlur(mask, (0, 0), 2.5).astype(np.float32) / 255.0
soft = soft[:, :, None]
blended = (inpainted.astype(np.float32) * soft + bgr.astype(np.float32) * (1 - soft)).astype(np.uint8)

rgb = cv2.cvtColor(blended, cv2.COLOR_BGR2RGB)
im = Image.fromarray(rgb)
im = ImageOps.exif_transpose(im).convert('RGB')
# Subtle web finish; source already has strong warm café mood.
im = ImageEnhance.Contrast(im).enhance(1.035)
im = ImageEnhance.Color(im).enhance(0.98)
im = ImageEnhance.Sharpness(im).enhance(1.06)
im = im.resize((1200, 1500), Image.Resampling.LANCZOS)
im = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=35, threshold=3))
im.save(PREVIEW, 'PNG', optimize=True)
im.save(OUT, 'JPEG', quality=90, optimize=True, progressive=True)
print('mask_pixels', int((mask > 0).sum()))
print(f'wrote {OUT} {OUT.stat().st_size/1024:.1f}KB')
print(f'preview {PREVIEW} {PREVIEW.stat().st_size/1024:.1f}KB')
