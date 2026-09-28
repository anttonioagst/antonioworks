---
name: Site Antonio
description: >-
  Build or polish Antonio personal-brand sites. Applies Personal/Antonio/DESIGN.md
  plus Interfaces.dev craft (cheat sheet / issues) under the Antonio lock.
  Dark default + real light tokens. Not for AntX, WIP, or clients.
---

# Site Antonio

Marca pessoal só. Não AntX. Não WIP. Não cliente.

## Before any pixel

1. Read `/Users/antonio/Documents/Personal/Antonio/DESIGN.md` — **wins on conflict**.
2. Optional craft evidence: `Personal/Antonio/portfolio/.site-dna/interfaces-dev/` (`DESIGN.md`, `CHEAT-SHEET.md`, `DNA.json`).
3. Two real themes. No invert. Persist override. Honor `prefers-color-scheme` until toggle.
4. Theme flip: disable **all** transitions.

## Lock

Shared:

- Geist + Geist Mono only. Weight **400**. Hierarchy = size + tracking + mute.
- Standalone control = pill `9999px`. Card/input = `8px`.
- `#FF7A17` illustration only — never CTA/danger.
- No drop-shadow, glow, text-shadow, gradient text, `-webkit-text-stroke`.
- Depth = 1px hairline + optional oklab wash (`pointer-events: none`).

Dark (default): canvas `#0A0A0A` / `oklch(0.145 0 0)`. Cards e soft em degraus L ~0.035 (C=0). Hairline **alpha** `rgb(255 255 255 / 0.08)` — contraste constante em qualquer superfície. CTA white fill. Image outline white 8% @ -1px. `theme-color #0A0A0A`.

Light: canvas `oklch(0.97 0 0)`, card white, soft/mid em degraus L. Hairline `rgb(0 0 0 / 0.08)`. CTA black fill. Never orange / Interfaces blue. Image outline black 8% @ -1px. `theme-color #F5F5F5`.

### Logos (contrast)

- **Dark canvas** → `logo-light.svg` (disco claro)
- **Light canvas** → `logo-dark.svg` (disco escuro)
- Toggle: scale 0.25→1, opacity, blur 4px→0, press 0.97. One control.
- **Blur budget:** só em chips ≤ ~360×200 (ex.: toggle). Reveals de seção = opacity + translate.

## Surfaces

- Concentric: `outer = inner + padding` (pad ≤ 24).
- Optical align: ~−2px padding on icon side.
- Dividers = borders. No layered/hue shadows. No backdrop-filter as depth.
- Intra 8 / inter 16+. 4px grid. Logical properties when useful.

## Type

- `.woff2` + `font-display: swap`. `font-synthesis: none`. Antialias once on body.
- 16 / 14 / 12. Measure 60–75ch.
- `balance` titles · `pretty` short descriptions · neither on long-form.
- `tabular-nums` on changing numbers. `overflow-wrap: break-word` on escape risks.
- Curly quotes, ellipsis `…`, sentence case. No Inter. No serif.

## Motion

- Never `transition: all`. Compositor: transform / opacity / filter (blur ≤ 4px).
- Press 0.97, 150–200ms ease-out.
- Enter stagger ~100ms + y + blur 4px. Exit quieter (opacity + blur).
- Gate with `prefers-reduced-motion: no-preference`.
- Hover color on dense lists: do not animate.
- `layoutId` outside `AnimatePresence`. Dialog: Base UI or `<dialog>`, Esc back.

## A11y + layout

- `:focus-visible` 2px currentColor offset 2.
- Hit 44/40/24. Skip link first. `scroll-margin-top` on anchors.
- Hover styles under `@media (hover: hover)`.
- Native controls. Icon-only `aria-label`. Never block paste. Touch `manipulation`.

## Writing

- Verb-first. Sentence case. “você” in PT. Empty = why + one action.

## Narrative (portfolio / landings)

Prefer Interfaces-grade story, Antonio tokens:

1. Nav → 2. Hero (brand first) → 3. Manifesto → 4. optional muted stack → 5. Work catalog rows → 6. System + **≥2 demos** → 7. About → 8. Contact → 9. sparse Footer.

Skip product Pricing/FAQ unless selling.

## Done when

- Dark default + real light; toggle persists; logos contrast-correct.
- Weight 400; ink CTAs; no shadows; pills only on standalone.
- Craft demos live; reduced-motion respected.
- `DESIGN.md` matches what shipped.
