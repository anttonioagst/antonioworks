# Interface Cheat Sheet (source: interfaces.dev/cheat-sheet)

Captured while logged in, 2026-08-17. Adapted into Antonio DESIGN.md — this file is the raw source.

## User Interface
- Use concentric border radius on nested elements.
- Align for optical alignment, not geometric alignment.
- Give images a 1px outline, offset by -1px: black at 8% opacity in light mode, white at 8% in dark mode.

## Animation
- Never use `transition: all`, name the exact properties that change instead.
- Slightly scale down buttons to a value between 0.95 and 0.98 when pressed with `transition: scale 200ms ease-out`.
- Cross-fade icons when they swap. Entering: scale 0.25→1, opacity 0→1, blur 4px→0. Exiting reverses.
- Use CSS transitions for interactions (interruptible). Keyframes for one-shot sequences.
- Disable all transitions when changing theme.
- `will-change` only for properties actually changing: transform, opacity, filter.
- Safari iOS 1–2px shift: `will-change: transform` on the element.
- Entrance stagger ~100ms by group or element.
- Don't animate high-frequency interactions (e.g. list item color on hover).

## Typography
- Always `.woff2`, never `.ttf`/`.otf`.
- `font-variant-numeric: tabular-nums` on changing values and tables.
- Cap long-form at 60–75 characters per line.
- `text-wrap: balance` on headings, `pretty` on descriptions, neither in long-form.
- `overflow-wrap: break-word` where long words/links can escape; `white-space: nowrap` on labels/badges.
- Antialias once on root, never per component.
- Store copy in natural case; control with `text-transform`.
- Smart punctuation: curly quotes, en dash ranges, em dash asides, ellipsis character.
- `text-underline-position: from-font` + `text-decoration-skip-ink: auto`.
- Truncated text keeps full value reachable (tooltip/expand).

## Colors
- Every palette step has a purpose; no unused steps.
- Semantic tokens, never primitives in components.
- Never name a token for appearance or first use.
- Reserve accent for brand color so primary ≠ body text.
- Don't reuse a token from another role just because color matches.
- Measure contrast against the actual background.
- Dark mode is not light reversed.
- One theme switching mechanism for every token.
- Gradient interpolation: oklab / oklch / sRGB — Antonio: no gradient text.

## Accessibility
- Native elements (`button`, `a`).
- Style `:focus-visible`; never bare `outline: none`.
- Only `tabindex` 0 or -1.
- Icon-only buttons need `aria-label`; never `aria-hidden` on focusable.
- Alt by purpose; decorative `alt=""`.
- Real `<label>`, type, inputmode.
- Never block paste.
- Disabled tooltips: visible text or `aria-disabled`.
- Submit enabled until request starts; validate on submit.
- Hit 24 / 40 desktop / 44 touch; no overlapping hit areas.
- `pointer-events: none` on decorative glows/gradients.
- Hover behind `@media (hover: hover)`.
- Motion behind `@media (prefers-reduced-motion: no-preference)`.
- `role="status"` routine; `role="alert"` urgent.
- Status never color alone.
- Skip link first; `scroll-margin-top` on anchored headings.

## Layout
- Gap between groups ≥ 2× gap inside (8 within, 16+ between).
- Logical properties (`margin-inline-start`, etc.).
- No fixed widths/heights on text containers.

## Writing
- Verb-first buttons.
- Repeat consequence in confirmations.
- One word per flow.
- Describe destination in links.
- Consistent capitalization; sentence case default.
- Toggle labels = state they turn on.
- Empty states: orient + one action.
- Address reader as “you” (Antonio PT: “você”).
