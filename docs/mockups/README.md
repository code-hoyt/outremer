# Character-creation mockups (static, not in the game)
Phone portrait (390×844). Placeholder portraits/art. Draft stat set: see [DESIGN.md → Main character & party](../DESIGN.md#main-character--party-baldurs-gate-style-structure).
- `creation-A.html` — classic BG roll sheet on one screen: portrait/name/class on top, six stats with −/+, points pool, Reroll / Store / Recall / Done.
- `creation-B.html` — step-by-step wizard (Portrait → Class → Stats → Name); shown on the Class step, with a move-range preview.
- `creation-C.html` — Templar dossier on parchment: class tabs with a mini iso move/jump preview, inked stat pips, wax-seal Reroll.

All three use a new d-pad state, a 4-way cross (▲▼ row, ◀▶ −/+ or change choice), plus A/B and taps.
Render PNGs: `cp render.mjs /workspace/outremer-test/ && cd /workspace/outremer-test && node render.mjs A B C` (writes `/workspace/mockups/creation-*.png`).
