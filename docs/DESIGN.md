# Outremer — Design Notes (v0.1, first playable slice)

Working title. Isometric tactics, FFTA/FFTA2 lineage, Knights Templar during the Crusades.
**Story is deliberately undecided.** Unit names are generic (Templar Knight, Sergeant, Turcopole Archer; Raider Swordsman / Skirmisher / Bowman) so nothing is locked in.

## Design pillars (from Cletus)
1. **No stop-and-press chores.** Avoid mechanics where the player must stop, press a button, then get back to work. Prefer systems that *emerge from choices the player is already making* (where you move, who you hit, from where).
2. **Customization, and every playthrough feels different.** Squad building, class mixes, and (later) variable maps/encounters.
3. **Trade-off upgrades over pure power.** An upgrade should change *how* a unit plays (e.g. heavier armor = tougher but shorter move / lower jump), not just make numbers bigger.
4. **Story later, with room for mythology.** Leave hooks (relics, legends, the uncanny) without committing now.
5. **Squad building where classes move differently** (FFTA-style): class/race determines move, jump and terrain affinity.
6. **Flanking and positioning are central** to combat.

## Core loop (slice)
Battle only: 3 Templars vs 3 Raiders on an 8×8 height-mapped iso map. On your unit's turn: **Move** (optional) and **Act** (optional) in either order, then the turn ends. Win by defeating all raiders; lose if all Templars fall. Victory/Defeat screen → Play again.

Future loop (not built): battle → rewards → squad management/upgrades (trade-offs) → choose next battle.

## Turn order — CT system (FFTA-like)
- Every unit has a **CT** counter. Time ticks; each tick every living unit gains CT = its **SPD**.
- When a unit reaches **CT ≥ 100** it acts (ties: higher CT, then higher SPD, then id).
- At turn end CT is reduced by what you did: **moved + acted = −100, only one = −80, neither = −60**. Waiting is a real (emergent) choice: you act again sooner.
- Turn-order strip at the top previews the next 8 turns (assumes full cost).
- All numbers: `CONFIG.turn`.

## Movement — classes move differently
Movement is Dijkstra over **move points**: each step costs the destination tile's **terrain cost** (class may override), you can't step up/down more than **JUMP** levels, enemies block, allies can be passed through (not ended on).

| Class | MOV | JUMP | Terrain affinity | Role |
|---|---|---|---|---|
| Knight (Templar Knight / Raider Swordsman) | 3 | 1 | Heavy: Sand 2, Rock 3 | Tough melee anchor, slow, bogged by rough ground |
| Sergeant (spear) | 4 | 2 | Standard (Sand 2, Rock 2) | Reach 1–2 in a straight line |
| Archer (Turcopole / Raider Bowman) | 4 | 3 | Light-footed: Rock 1 | Range 2–4, +1 range per 2 levels of height advantage; fragile |
| Skirmisher (Raider; enemy only in slice) | 5 | 3 | Nimble: Sand 1, Rock 1 | Fast flanker, weak hits — wants your backs |

Base terrain: Grass 1, Road 1, Sand 2, Rock 2. `CONFIG.terrain`, `CONFIG.roles[*].terrainCost`, `CONFIG.climbCostPerLevel` (0 for now).

**Difficulty knob:** `CONFIG.teams.player.statBonus` (currently HP +6, DEF +1 on Templars). With it, a greedy-AI-vs-greedy-AI headless sim wins ~43% for the Templars over 1000 runs (~25 turns); without it ~20% — the raiders start with the high ground. A human using flanks should do better. Retune once real playtests exist.

**Phone camera:** on narrow screens the map is zoomed 1.3× past fit-width; drag to pan, and the camera eases to each active unit (`CONFIG.view.zoom`, `zoomBelowWidthPx`, `camFollow`).

## Facing, flanking & positioning
- Every unit has a **facing** (N/E/S/W, shown as a ground arrow wedge and in the info panel).
- Hits are classed by where the attacker stands relative to the target's facing: **Front / Side / Back**.
  - Damage: Front ×1.0, **Side ×1.25, Back ×1.5**
  - Hit chance: Front 80%, **Side 90%, Back 100%**
- **Flanking (pincer):** +15% damage per *other* ally adjacent to the target (max 2). Emerges from positioning — no extra button.
- **Height:** ±10% damage per level of height difference (clamped 0.7–1.4), ±3% hit per level; archers gain range from height; melee can't reach targets too far above/below (`maxHeightReach`).
- **Preview before confirming:** tapping a target shows e.g. `~22 dmg · 100% hit · Back +50% · Flank ×1 +15% · Height +10%`. Tap the target again (or Confirm) to strike.
- **Facing at end of turn — automatic by default** (pillar 1): if you attacked you keep facing your target; otherwise you auto-face the **nearest foe**. Moving also faces you along your last step. An **optional one-tap override** row (↖ ↗ ↙ ↘ / auto) sits under the action buttons; you never *have* to touch it.
- The enemy AI values side/back attacks too, so guarding your backs matters.

## Combat formula
```
base     = ATK × 1.6 − DEF × 1.0
damage   = max(1, round(base × heightMod × facingMod × flankMod))
final    = damage × (1 ± 10% variance) × (1.5 on 5% crit)
hit%     = clamp(5..100, facingHit + 3 × heightAdvantage)
```
All constants: `CONFIG.combat`.

## Enemy AI (simple scoring)
For every reachable tile × every target attackable from it: `100 + expectedDamage + killBonus(25×hit) + sideBonus(4)/backBonus(10) + 2×tileHeight − 0.35×danger`. If no attack is possible: move toward the nearest foe (`−1.5 × distance`). Archers avoid ending closer than 3 tiles. Weights: `CONFIG.ai`.

## Controls (touch first, mouse works the same)
- Your active unit is auto-selected (CT decides who acts). It opens in the most useful mode: **Attack** if a foe is already in range, else **Move**.
- **Tap a blue tile** to move. **Tap a foe in red range** to preview, tap again (or **Confirm**) to attack. Tap elsewhere / **Cancel** to back out.
- **Tap any unit** to inspect its stats, facing and terrain affinities.
- After both moving and acting, the turn ends by itself (no extra press). Otherwise **End Turn**.
- **Drag** the battlefield to pan (map is zoomed a bit past fit-width on phones); the camera follows the active unit.
- Large buttons (≥52px), no hover UI, no page scroll/zoom (viewport locked, `touch-action: none` on the canvas).

## What's placeholder
- All art: procedural canvas shapes (shaded iso blocks, simple figures with team colors, Templar red cross on tunic/shield). No sound.
- One hand-made map, fixed deployment, no squad building, no abilities, no items, no XP.
- Raider faction is a generic stand-in. Names are generic.
- AI is a one-ply greedy scorer.

## Open questions
- Squad building: classes vs. "races"/origins (Frankish knights, local Turcopoles, Armenian/Syriac allies?) and how they gate movement profiles.
- Trade-off upgrades: armor weight ⇄ MOV/JUMP, shield ⇄ side-hit protection, banners that grant flank bonuses to nearby allies?
- Should facing protect more (e.g. shields block some front damage) to make flanking even more decisive?
- Reactions/zones of control vs. keeping turns snappy (pillar 1).
- Per-playthrough variety: procedural maps? random events? relic draft?
- Mythology layer: relics, saints' legends, djinn/desert folklore — when and how much?
- Permadeath or wounds?
- Should waiting (CT −60) be more visible as a tactic?
- Terrain beyond movement (cover, high ground for defense, water/marsh)?
