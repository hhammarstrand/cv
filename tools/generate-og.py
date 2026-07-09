#!/usr/bin/env python3
"""Genererar delningsbilderna og-image.png (sv) och og-image-en.png (en).

Layout och färger speglar sidans ljusa tema i style.css — uppdatera
konstanterna nedan om paletten ändras. Kräver Pillow samt nätåtkomst
första gången (TTF-fonter hämtas till en cachekatalog; de incheckade
woff2-filerna kan inte läsas av Pillow).

Kör från repo-roten:  python3 tools/generate-og.py
"""

import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parent.parent
CACHE = Path("/tmp/og-fonts")

FONTS = {
    "inter-regular.ttf": "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
    "inter-extrabold.ttf": "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf",
    "jetbrainsmono-regular.ttf": "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf",
    "jetbrainsmono-medium.ttf": "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf",
}

# Ljusa temats palett (style.css :root)
W, H = 1200, 630
BG = (250, 250, 248)      # --bg
TEXT = (22, 24, 29)       # --text
MUTED = (88, 95, 107)     # --muted
FAINT = (107, 113, 126)   # --faint
ACCENT = (13, 92, 77)     # --accent
RULE = (217, 219, 214)    # --rule
DOT = (210, 213, 207)     # --dot

VARIANTS = {
    "og-image.png": {
        "title": "Chef Digitalt Produktionsstöd · Peab Anläggning AB",
        "tags": "BIM · Drönare · Digital transformation · Ledarskap",
    },
    "og-image-en.png": {
        "title": "Head of Digital Construction · Peab Anläggning AB",
        "tags": "BIM · Drones · Digital transformation · Leadership",
    },
}


def fetch_fonts():
    CACHE.mkdir(parents=True, exist_ok=True)
    for name, url in FONTS.items():
        dest = CACHE / name
        if not dest.exists():
            urllib.request.urlretrieve(url, dest)


def render(variant):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Punktraster som tonar ut nedåt, som body::before på sidan
    step, fade_end = 24, int(H * 0.55)
    for y in range(0, fade_end + 1, step):
        fade = max(0.0, 1 - y / fade_end)
        color = tuple(int(BG[i] + (DOT[i] - BG[i]) * fade) for i in range(3))
        for x in range(0, W, step):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=color)

    font = lambda f, size: ImageFont.truetype(str(CACHE / f), size)
    left, right = 90, W - 90

    over = font("jetbrainsmono-medium.ttf", 20)
    draw.text((left, 152), "// ", font=over, fill=FAINT)
    draw.text((left + draw.textlength("// ", font=over), 152),
              "CURRICULUM VITAE", font=over, fill=ACCENT)

    draw.text((left, 215), "Hugo Hammarstrand",
              font=font("inter-extrabold.ttf", 68), fill=TEXT)
    draw.text((left, 338), variant["title"],
              font=font("inter-regular.ttf", 28), fill=MUTED)
    draw.line([(left, 414), (right, 414)], fill=RULE, width=1)
    draw.text((left, 452), variant["tags"],
              font=font("jetbrainsmono-regular.ttf", 18), fill=MUTED)

    url_font = font("jetbrainsmono-regular.ttf", 18)
    url = "hhammarstrand.github.io/cv"
    draw.text((right - draw.textlength(url, font=url_font), 575),
              url, font=url_font, fill=FAINT)
    return img


if __name__ == "__main__":
    fetch_fonts()
    for filename, variant in VARIANTS.items():
        render(variant).save(REPO / filename)
        print(f"skrev {filename}")
