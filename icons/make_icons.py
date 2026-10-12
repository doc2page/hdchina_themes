# -*- coding: utf-8 -*-
"""
瓷之器图标：头浓青花底托白瓷盘，盘内双弦环 + 八瓣宝相花，
花心一点矾红（点睛）。512 底图缩至 16/48/128。
"""
import math
from PIL import Image, ImageDraw, ImageFilter
import os

S = 512
C = S // 2

# 色板（与青花瓷主题一致）
DEEP_BLUE = (22, 53, 92, 255)      # 头浓 #16355c 底
BLUE_2 = (28, 66, 117, 255)        # #1c4275
PORCELAIN = (251, 253, 253, 255)   # 瓷白
PORCELAIN_2 = (235, 241, 244, 255) # 釉影
FLECK_BLUE = (28, 66, 117, 255)    # 青花纹 #1c4275
RIM = (123, 163, 196, 255)         # 影淡 #7ba3c4
FANRED = (181, 68, 60, 255)        # 矾红 #b5443c

def polar(cx, cy, deg, r):
    a = math.radians(deg)
    return (cx + r * math.sin(a), cy - r * math.cos(a))

img = Image.new('RGBA', (S, S), (0, 0, 0, 0))

# ── 底：头浓青花圆角方 + 顶部釉光 ──
bg = Image.new('RGBA', (S, S), (0, 0, 0, 0))
ImageDraw.Draw(bg).rounded_rectangle([16, 16, S - 16, S - 16], radius=116, fill=DEEP_BLUE)
hl = Image.new('RGBA', (S, S), (0, 0, 0, 0))
ImageDraw.Draw(hl).ellipse([60, -80, S - 60, 260], fill=(120, 170, 220, 60))
hl = hl.filter(ImageFilter.GaussianBlur(60))
bg = Image.alpha_composite(bg, hl)
img = Image.alpha_composite(img, bg)
d = ImageDraw.Draw(img)

# ── 瓷盘：白瓷圆 + 釉影渐层（两层圆叠出立体） ──
R = 168
d.ellipse([C - R - 4, C - R - 4, C + R + 4, C + R + 4], fill=RIM)          # 影淡盘缘
d.ellipse([C - R, C - R, C + R, C + R], fill=PORCELAIN_2)                  # 釉影层
d.ellipse([C - R + 14, C - R + 14, C + R - 14, C + R - 14], fill=PORCELAIN)  # 瓷面

# ── 盘内弦纹：双圈 ──
for rr, w in ((R - 30, 5), (R - 44, 3)):
    d.ellipse([C - rr, C - rr, C + rr, C + rr], outline=FLECK_BLUE, width=w)

# ── 盘心宝相花：八瓣叶形 + 矾红花蕊 ──
for a in range(0, 360, 45):
    pts = [
        polar(C, C, a, 30),
        polar(C, C, a - 13, 66),
        polar(C, C, a, 104),
        polar(C, C, a + 13, 66),
    ]
    d.polygon(pts, fill=FLECK_BLUE)

# 花瓣勾隙：瓣与瓣之间的白隙即留白，中心矾红蕊点睛
d.ellipse([C - 27, C - 27, C + 27, C + 27], fill=PORCELAIN)
d.ellipse([C - 17, C - 17, C + 17, C + 17], fill=FANRED)

out = os.path.dirname(os.path.abspath(__file__))
for size in (16, 48, 128):
    img.resize((size, size), Image.LANCZOS).save(os.path.join(out, f'icon{size}.png'))
print('porcelain icons written:', out)
