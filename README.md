# Outremer (working title)

An isometric tactics prototype in the spirit of *Final Fantasy Tactics A2*, themed on the Knights Templar during the Crusades. Story is intentionally **not** decided yet.

**Play:** https://code-hoyt.github.io/outremer/ (phone portrait or desktop)

- Plain JS + Canvas, ES modules, no build step, no engine. GitHub Pages serves the repo root.
- All tuning lives in [`src/config.js`](src/config.js).
- Design decisions and open questions: [`docs/DESIGN.md`](docs/DESIGN.md).

Run locally: `python3 -m http.server` in the repo root, open http://localhost:8000. Add `?seed=7` for a deterministic run.

## Files
| File | What |
|---|---|
| `index.html`, `style.css` | Shell + portrait mobile layout |
| `src/config.js` | Every tuning number: stats, map, CT costs, combat formula, AI weights, animation timing, palette |
| `src/game.js` | Rules: CT turn order, movement (terrain/jump), facing, flanking, damage |
| `src/ai.js` | Enemy scoring AI |
| `src/main.js` | Rendering, touch/mouse input, turn flow, HUD |
