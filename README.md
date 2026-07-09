# CV — hhammarstrand.github.io/cv

Mitt CV som statisk webbsida, publicerad via GitHub Pages. Svenska på
[`/`](https://hhammarstrand.github.io/cv/) och engelska på
[`/en/`](https://hhammarstrand.github.io/cv/en/).

## Struktur

| Fil | Innehåll |
| --- | --- |
| `index.html` | Svenska CV:t |
| `en/index.html` | Engelska CV:t |
| `style.css` | All styling, inklusive utskriftsstil |
| `script.js` | Läsförlopp, skrivmaskinseffekt, scroll-animationer, terminal-easter-egg (tryck `T`) |
| `fonts/` | Självhostade Inter och JetBrains Mono (variabla woff2, latin-subset, OFL) |
| `tools/generate-og.py` | Genererar delningsbilderna `og-image.png` och `og-image-en.png` |
| `.github/workflows/deploy-pages.yml` | Deploy till GitHub Pages vid push |
| `.github/workflows/checks.yml` | HTML-validering och länkkontroll |

## Att tänka på vid innehållsändringar

- **Tre kopior av innehållet:** `index.html`, `en/index.html` och terminalens
  `COMMANDS` i `script.js` måste uppdateras tillsammans.
- **Delningsbilderna** speglar titel och taggar — kör
  `python3 tools/generate-og.py` (kräver Pillow) och checka in de nya
  PNG-filerna om något av det ändras.
- Sidan fungerar utan JavaScript; animationer respekterar
  `prefers-reduced-motion`. `Ctrl/Cmd + P` (eller PDF-knappen) ger en ren
  pappersversion via utskriftsstilen.
- Färger styrs av CSS-variablerna högst upp i `style.css`. Håll kontrasten:
  `--faint` används för brödtextnära detaljer och ska klara WCAG AA (4,5:1)
  mot `--bg`.
