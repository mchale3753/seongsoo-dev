#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/profile/derived/_preopt'
DST = ROOT / 'assets/profile/derived'

# keep hero/contact from v1; regenerate profile-card from preopt with a gentler, darker, less-green pass
name='profile-card.jpg'
img = ImageOps.exif_transpose(Image.open(SRC/name)).convert('RGB')
img = ImageEnhance.Brightness(img).enhance(0.90)
img = ImageEnhance.Contrast(img).enhance(1.04)
img = ImageEnhance.Color(img).enhance(0.76)
img = img.filter(ImageFilter.UnsharpMask(radius=0.8, percent=55, threshold=4))
img.save(DST/name, 'JPEG', quality=92, optimize=True, progressive=True)

# make a focused profile comparison: before / v1 backup? / v2 current
thumb_w=300
imgs=[]
labels=[]
for label,path in [('BEFORE',SRC/name),('AFTER v2',DST/name)]:
    im=Image.open(path).convert('RGB')
    w,h=im.size
    im=im.resize((thumb_w,int(h*thumb_w/w)),Image.Resampling.LANCZOS)
    imgs.append(im); labels.append(label)
h=max(im.height for im in imgs)+40
sheet=Image.new('RGB',(thumb_w*2+18,h),(16,16,16))
d=ImageDraw.Draw(sheet)
x=0
for im,label in zip(imgs,labels):
    sheet.paste(im,(x,40)); d.text((x+8,10),label,fill=(235,235,235)); x+=thumb_w+18
sheet.save(DST/'_profile_retouch_v2.jpg','JPEG',quality=92,optimize=True)
print('wrote profile v2 and comparison')
