#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/profile/derived/_preopt'
DST = ROOT / 'assets/profile/derived'
PRE = ROOT / 'assets/profile/derived/_pre_retouch'
PRE.mkdir(parents=True, exist_ok=True)

FILES = {
    'hero-workflow.jpg': dict(brightness=1.04, contrast=1.07, saturation=0.98, sharpness=1.08, autocontrast=0.2, quality=88),
    'profile-card.jpg': dict(brightness=0.96, contrast=1.10, saturation=0.86, sharpness=1.10, autocontrast=0.15, quality=92),
    'contact-portrait.jpg': dict(brightness=0.98, contrast=1.08, saturation=0.96, sharpness=1.12, autocontrast=0.2, quality=88),
}

def process(img, cfg):
    img = ImageOps.exif_transpose(img).convert('RGB')
    if cfg.get('autocontrast'):
        img = ImageOps.autocontrast(img, cutoff=cfg['autocontrast'])
    img = ImageEnhance.Brightness(img).enhance(cfg['brightness'])
    img = ImageEnhance.Contrast(img).enhance(cfg['contrast'])
    img = ImageEnhance.Color(img).enhance(cfg['saturation'])
    img = img.filter(ImageFilter.UnsharpMask(radius=1.0, percent=int((cfg['sharpness']-1)*140 + 45), threshold=3))
    return img

for name, cfg in FILES.items():
    live = DST / name
    if live.exists():
        backup = PRE / name
        if not backup.exists():
            backup.write_bytes(live.read_bytes())
    img = Image.open(SRC / name)
    out = process(img, cfg)
    out.save(DST / name, 'JPEG', quality=cfg['quality'], optimize=True, progressive=True)

# contact sheet, before from _preopt vs after live
thumb_w = 360
rows = []
for name in FILES:
    before = Image.open(SRC / name).convert('RGB')
    after = Image.open(DST / name).convert('RGB')
    def thumb(im):
        w,h=im.size
        nh=int(h*thumb_w/w)
        return im.resize((thumb_w, nh), Image.Resampling.LANCZOS)
    b=thumb(before); a=thumb(after)
    h=max(b.height,a.height)+42
    row=Image.new('RGB',(thumb_w*2+24,h),(24,24,24))
    row.paste(b,(0,42)); row.paste(a,(thumb_w+24,42))
    d=ImageDraw.Draw(row)
    d.text((8,10),f'BEFORE {name}',fill=(235,235,235))
    d.text((thumb_w+32,10),f'AFTER {name}',fill=(235,235,235))
    rows.append(row)

sheet_h=sum(r.height for r in rows)+16*(len(rows)-1)
sheet=Image.new('RGB',(thumb_w*2+24,sheet_h),(16,16,16))
y=0
for r in rows:
    sheet.paste(r,(0,y)); y+=r.height+16
sheet.save(DST / '_retouch_contact_sheet.jpg','JPEG',quality=92,optimize=True)
print('wrote retouched files and contact sheet:', DST / '_retouch_contact_sheet.jpg')
