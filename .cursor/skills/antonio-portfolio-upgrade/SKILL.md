---
name: antonio-portfolio-upgrade
description: >-
  Upgrades Personal/Antonio/portfolio using Interfaces.dev craft (logged-in magazine,
  cheat sheet, issues) while keeping the Antonio design lock. Use for portfolio polish,
  craft demos, editorial narrative, or when user mentions interfaces.dev / upgrade Antonio site.
---

# Antonio portfolio upgrade

Só `Personal/Antonio/portfolio`. Não AntX / WIP / cliente.

## Authority

1. `/Users/antonio/Documents/Personal/Antonio/DESIGN.md` + `site-antonio` — tokens
2. This skill — narrative + demos + checklist
3. `portfolio/.site-dna/interfaces-dev/` — evidence (`CHEAT-SHEET.md`, `DESIGN.md`, `DNA.json`)

Never ship Interfaces blue, Inter, serif italics, or soft card shadows.

## Logged-in IA map (Interfaces product)

| Route | Role | Port to Antonio? |
|---|---|---|
| `/magazine` | Issue catalog grid/list | Work rows / catalog |
| `/magazine/bookmarks` | Saved items | Skip (product) |
| `/magazine/tools` | Tool library | Optional muted stack |
| `/magazine/skills` | Agent skills | Skip or “stack” mention |
| `/cheat-sheet` | Portable craft rules | **Yes — core** |
| `/changelog` | Product log | Skip |
| Issue chapters | Interactive lessons | Demos + copy patterns |

## Must implement (from cheat sheet)

UI: concentric radius, optical align, image outline −1px 8%.  
Motion: no `transition: all`, press 0.95–0.98, icon cross-fade, theme kill-transitions, stagger ~100ms, `prefers-reduced-motion`.  
Type: tabular-nums, balance/pretty correctly, measure 60–75ch, antialias once.  
Color: semantic tokens; dark ≠ invert; one switch mechanism.  
A11y: focus-visible, skip link, scroll-margin, hover media query, hit targets.  
Writing: verb-first, sentence case, “você”.

## Target page order

Nav → Hero → Manifesto → optional stack → Work catalog → System (≥2 demos) → About → Contact → Footer.

## Logos

Dark theme → `logo-light.svg`. Light theme → `logo-dark.svg`.

## Checklist

- [ ] DESIGN.md + site-antonio reflect cheat sheet (Antonio-filtered)
- [ ] Logos contrast-correct
- [ ] ≥2 interactive craft demos
- [ ] `prefers-reduced-motion` + `@media (hover: hover)`
- [ ] Work = rows not card collage
- [ ] Dark + light screenshots
- [ ] No blue CTA / Inter / shadows

## Re-crawl

Public homepage DNA:

```bash
node ~/.claude/skills/antx-site-analyzer/scripts/analyze.mjs \
  "https://interfaces.dev/homepage" \
  --out "Personal/Antonio/portfolio/.site-dna/interfaces-dev" --depth full
```

Logged-in pages: use Cursor browser session (Playwright crawl lacks auth cookies).

## Done when

Antonio identity intact; Interfaces-grade craft rhythm and demos shipped.
