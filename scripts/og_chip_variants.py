#!/usr/bin/env python3
"""Render OG chip-row variants for comparison (no overwrite of og.png)."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "social"

BG = (10, 10, 10); INK = (237, 237, 237); DIM = (176, 176, 176)
MUTE = (119, 119, 119); GOLD = (184, 152, 86); GOLD2 = (214, 182, 115); GOOD = (74, 222, 128)
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
def F(p, s): return ImageFont.truetype(p, s)

VARIANTS = {
    "A_categories": ["ex-CTO", "Series A", "Open to relocate", "Web · Mobile · Backend"],
    "B_fourstack":  ["ex-CTO", "Series A", "Open to relocate", "React · Vue · Laravel · Node"],
    "C_current":    ["ex-CTO", "Series A", "Open to relocate", "React · Laravel · Node"],
}

def render(chips):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGBA", (W, H), (0,0,0,0)); gd = ImageDraw.Draw(glow)
    cx, cy = int(W*0.78), int(H*0.30)
    for i in range(60,0,-1):
        r=i*9; a=int(2.0*(i/60)); gd.ellipse([cx-r,cy-r,cx+r,cy+r], fill=(184,152,86,a))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    d = ImageDraw.Draw(img)
    PAD = 80
    PHOTO = ROOT/"assets"/"profile"/"derived"/"contact-portrait.jpg"
    photo_w = 400
    try:
        ph = Image.open(PHOTO).convert("RGB"); pw,phh = ph.size
        tr = photo_w/H; sr = pw/phh
        if sr > tr:
            nw=int(phh*tr); left=(pw-nw)//2; ph=ph.crop((left,0,left+nw,phh))
        else:
            nh=int(pw/tr); top=(phh-nh)//2; ph=ph.crop((0,top,pw,top+nh))
        ph = ph.resize((photo_w,H), Image.LANCZOS); img.paste(ph,(W-photo_w,0))
        fade = Image.new("RGBA",(220,H),(0,0,0,0)); fd=ImageDraw.Draw(fade)
        for i in range(220):
            a=int(255*(1-i/220)); fd.line([(i,0),(i,H)], fill=(10,10,10,a))
        img.paste(fade,(W-photo_w,0),fade)
        d.rectangle([W-photo_w,0,W-photo_w+3,H], fill=GOLD)
    except Exception as e:
        print("photo skip:", e)
    d = ImageDraw.Draw(img)
    dy=PAD+8; d.ellipse([PAD,dy,PAD+18,dy+18], fill=GOOD)
    d.text((PAD+34,PAD),"seongsoo.dev", font=F(MONO,30), fill=DIM)
    d.text((PAD,210),"Seongsoo Shin", font=F(BOLD,84), fill=INK)
    d.text((PAD,312),"Full-stack Software Engineer", font=F(REG,44), fill=GOLD2)
    d.text((PAD,392),"A decade shipping product end to end.", font=F(REG,30), fill=DIM)
    chip_f=F(REG,26); x=PAD; cy2=458; row_h=64; max_x=W-photo_w-40
    for c in chips:
        bb=d.textbbox((0,0),c,font=chip_f); tw=bb[2]-bb[0]; px=22; bw=tw+px*2
        if x+bw>max_x: x=PAD; cy2+=row_h
        d.rounded_rectangle([x,cy2,x+bw,cy2+52], radius=10, outline=(58,58,58), width=2, fill=(20,20,20))
        d.text((x+px,cy2+11), c, font=chip_f, fill=DIM); x+=bw+16
    d.rectangle([PAD,590,PAD+110,594], fill=GOLD)
    d.text((PAD,602),"Available from March 2027  ·  seongsoo.dev", font=F(REG,24), fill=MUTE)
    return img

imgs=[]
for name,chips in VARIANTS.items():
    im=render(chips); p=OUT/f"_og_variant_{name}.png"; im.save(p,"PNG")
    imgs.append(im); print("wrote", p)

# stacked comparison (A on top, B mid, C bottom)
sheet=Image.new("RGB",(1200,630*3+40),(40,40,40))
for i,im in enumerate(imgs):
    sheet.paste(im,(0,i*(630+20)))
sp=OUT/"_og_variants_compare.png"; sheet.save(sp); print("compare", sp)
