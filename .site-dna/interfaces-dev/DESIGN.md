# Design DNA — interfaces.dev/homepage

> Source of truth for **craft patterns and page narrative** inspired by Interfaces.
> When upgrading the Antonio portfolio, pair this with `Personal/Antonio/DESIGN.md`
> (Antonio lock wins on tokens). Never copy blue CTAs, Inter, or serif italics into Antonio.

**Capture:** 2026-08-17 · theme at crawl: **light** · raw: [`.site-dna/interfaces-dev/raw/`](raw/)

## Style in one paragraph

Editorial design-engineering magazine. Narrow measure, huge vertical rhythm, mostly weight 400–500 Inter with Berkeley Mono labels and Libre Baskerville italics for stress. Light canvas `#FCFCFC` with soft gray surfaces; electric blue `#00A7F4` only on primary pills. Structure is hairline + dashed rules; cards use soft multi-layer shadows (light). Hero can go “meta” — blueprint annotations, selection chrome, oklch swatches — teaching craft while selling the product. Dark mode exists (class strategy) but the brand voice stays the same.

## Color

| Token | Value | Role | Where |
|---|---|---|---|
| primary | `#00A7F4` | accent CTA | Subscribe / Join pills |
| background | `#FCFCFC` | page | `bg-gray-background`, theme-color |
| surface | `#F0F0F0` | soft panels | card fills |
| text | `#202020` | ink | headings, UI |
| textParagraph | `#424242` | body | manifesto copy |
| textMuted | `#646464` | meta | captions, logo-cloud label |
| border | `#E8E8E8` | hairline | solid + dashed dividers |
| canvasDark | `~#0D0D0D` | dark surface | dual theme (inferred) |

## Typography

- **Sans:** Inter Variable — body 16 / lg 18 / small 14; titles ~24 with `tracking: -0.0125em`, weight 500.
- **Display:** ~60–77px, tight leading; hero mixes sans + serif italic (“Magazine”).
- **Mono:** Berkeley Mono — annotations, blueprint labels, captions.
- **Serif italic:** Libre Baskerville on `<em>` inside paragraphs (“a lot”, “feel”, “isn’t”).
- **Also loaded:** Heldane, Mondwest, Open Runde (specimen / brand moments).

## Spacing, radius, elevation

- Base **4px**. Section gap **`mt-24 sm:mt-32`**. Content **`max-w-190` (~760px) + `px-5`**.
- Radius: cards **12px** common; controls often **pill 9999px**; smaller UI **6–8px**.
- Elevation (light): soft stacked shadow with 1px ring — **not** flat-only. Dark Antonio should keep **hairline, no shadow**.

## Components observed

- **Nav:** logo left, Log in text, blue pill Subscribe.
- **Hero:** wordmark stack, author chip (avatar + name), blue CTA, optional craft overlays.
- **Manifesto:** long-form + mid-copy interactive demo.
- **Logo cloud:** dashed grid of company marks.
- **Feature / How it works:** icon + title + one sentence cards.
- **Issue list:** row catalog (number, title, chapter count, New).
- **Pricing:** multi-plan band with filled CTAs.
- **FAQ:** accordion buttons.
- **Theme:** `ThemeProvider` class + `disableTransitionOnChange`.

## Layout narrative (ordered)

1. Navbar  
2. Hero (brand + CTA + craft meta)  
3. Manifesto (+ interactive)  
4. Logo cloud  
5. About / specimens  
6. How it works  
7. Author  
8. Free issues / TOC tease  
9. Full issue catalog  
10. Pricing / subscribe  
11. Testimonials  
12. Newsletter  
13. FAQ  
14. Footer  

## Do / Don't

- ✅ Lead with a thesis essay before product grids.
- ✅ Put interactive craft demos inside the story, not only in a features section.
- ✅ Use `text-pretty` / `balance`, optical tracking on titles, tabular nums where numbers change.
- ✅ One primary CTA per band; keep secondary quiet.
- ✅ Theme flip without animating every property.
- ❌ Don’t treat blue pills or Inter/serif as portable to Antonio.
- ❌ Don’t rebuild the meta-blueprint hero unless the demo teaches something real.
- ❌ Don’t use multi-layer card shadows on Antonio surfaces.
- ❌ Don’t invent a second accent — Interfaces uses one electric blue; Antonio uses ink CTA + rare `#FF7A17` illustration only.

## Antonio portfolio mapping

| Interfaces | Antonio upgrade |
|---|---|
| Blue pill CTA | Ink filled pill (white↔black by theme) |
| Inter + Baskerville | Geist 400 + Geist Mono eyebrow |
| Soft card shadow | `canvas-card` + 1px hairline |
| Issue catalog | Work rows / selected projects |
| Mid-copy demos | Keep/expand concentric radius + optical + text-wrap |
| Logo cloud | Optional muted stack (dashed grid) — no fake clients |
| Pricing/FAQ | Skip unless selling a product |
| Light-first | Antonio dark-default + real light tokens |
| Cheat sheet | Port rules under Antonio lock (`CHEAT-SHEET.md`) |

## Logged-in product map (2026-08-17)

| Route | Purpose |
|---|---|
| `/magazine` | Issues catalog |
| `/magazine/bookmarks` | Saved |
| `/magazine/tools` | Tool library |
| `/magazine/skills` | Agent skills |
| `/magazine/issues/*` | Chapter + interactive demos |
| `/cheat-sheet` | Portable craft checklist |
| `/changelog` | Product changelog |
| `/magazine/profile` | Account |

## Shell craft (from CSS/SSR study — Antonio filter)

Portable without cloning product:

1. **Draw the measure** — nested full-height hairlines at content width (`aria-hidden`, `pointer-events: none`, md+).
2. **Tray = recess + object** — Antonio: hairline card, no soft shadow; dark stays ring-only.
3. **Concentric radius** — outer = inner + pad.
4. **Named transitions only** — never `all`; press 0.97.
5. **Optical `:has()` pad** on icon+label buttons.
6. **Hover behind** `@media (hover: hover)`.
7. **Global reduced-motion kill** + theme flip kills transitions.
8. **Three-zone rows** — identity / title+copy / meta; `min-w-0` for truncate.
9. **Do not** ship `maximum-scale=1`, product auth walls, pricing, vanity counters.

## Evidence

- [`DNA.json`](DNA.json)
- [`CHEAT-SHEET.md`](CHEAT-SHEET.md)
- [`raw/desktop.png`](raw/desktop.png)
- [`raw/mobile.png`](raw/mobile.png)
- [`manifest.json`](manifest.json)
