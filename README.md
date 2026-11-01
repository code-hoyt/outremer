# Outremer (working title)

An isometric tactics prototype in the spirit of *Final Fantasy Tactics A2*, themed on the Knights Templar during the Crusades. Story is intentionally **not** decided yet.

**Play:** https://code-hoyt.github.io/outremer/ (phone portrait or desktop)

**Controls (FFTA2-style):** the on-screen diagonal d-pad moves the cursor along the iso axes; A confirms, B cancels or goes back. The pad changes with context: ▲▼ in menus, quadrants on the map, facing arrows at turn end, dimmed otherwise. Each turn: command menu (Move / Action / Wait), then choose a facing. Taps work too: tap once to place the cursor, tap again to confirm. Desktop: arrows/WASD, Z/Enter = A, X/Esc = B.

- Plain JS + Canvas, ES modules, no build step, no engine. GitHub Pages serves the repo root.
- All tuning lives in [`src/config.js`](src/config.js).
- **Roadmap (stages, current goal, done-when criteria): [`docs/ROADMAP.md`](docs/ROADMAP.md)**. Now: Stage 1, combat prototype.
- Design decisions and open questions: [`docs/DESIGN.md`](docs/DESIGN.md).

Run locally: `python3 -m http.server` in the repo root, open http://localhost:8000. Add `?seed=7` for a deterministic run.

## Files
| File | What |
|---|---|
| `index.html`, `style.css` | Shell + portrait mobile layout |
| `src/maps.js` | Map layouts: heights, terrain, deployment (The Ridge, The Breach). Pick with `?map=` or the title/end-screen picker |
| `src/config.js` | Every tuning number: stats, terrain, CT costs, combat formula, AI weights, animation timing, palette |
| `src/game.js` | Rules: CT turn order, movement (terrain/jump), facing, flanking, damage |
| `src/ai.js` | Enemy scoring AI |
| `src/main.js` | Rendering, touch/mouse input, turn flow, HUD |
