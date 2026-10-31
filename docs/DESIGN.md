# Outremer — Design Notes (v0.3, first playable slice + FFTA2 controls + context-aware pad)

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

**Phone camera:** on narrow screens the map is zoomed 1.3× past fit-width; drag to pan, and the camera eases to follow the cursor (`CONFIG.view.zoom`, `zoomBelowWidthPx`, `camFollow`).

## Facing, flanking & positioning
- Every unit has a **facing** (N/E/S/W, shown as a ground arrow wedge and in the info panel).
- Hits are classed by where the attacker stands relative to the target's facing: **Front / Side / Back**.
  - Damage: Front ×1.0, **Side ×1.25, Back ×1.5**
  - Hit chance: Front 80%, **Side 90%, Back 100%**
- **Flanking (pincer):** +15% damage per *other* ally adjacent to the target (max 2). Emerges from positioning — no extra button.
- **Height:** ±10% damage per level of height difference (clamped 0.7–1.4), ±3% hit per level; archers gain range from height; melee can't reach targets too far above/below (`maxHeightReach`).
- **Prediction before executing:** hovering a valid target shows, and the confirm step repeats, e.g. `Hit 90% · Dmg ~22 · HP 28→6 · Back +50% · Flank ×1 +15% · Height +10%`.
- **Facing at end of turn is an explicit choice (FFTA2-style).** Auto-facing was removed after Cletus's playtest (v0.2): every player turn ends on a facing step with four arrows drawn on the ground around the unit. Attacking still turns the attacker toward the target (as in FFTA2), but the final facing is always yours.
- The enemy AI values side/back attacks, and the AI picks its own facing (toward its nearest foe).

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

## Controls (v0.2 — modelled on FFTA2)
Cletus's playtest (v0.1): tapping exact tiles on a phone was fiddly, and auto-facing / starting the turn already in Move mode felt wrong. He wants the controls to match FFTA2 to start with; we may change them later. So the battle UI is now a **cursor + command menu + A/B** scheme, with taps as a shortcut.

**On-screen pad (bottom of the screen, under the battlefield so it never covers the action):**
- **D-pad (left thumb):** a disc split into four diagonal quadrants, ◤ ◥ ◣ ◢. **Mapping: each quadrant moves the cursor one tile along the iso axis it points to on screen.** ◥ = north (−y, up-right), ◢ = east (+x, down-right), ◣ = south (+y, down-left), ◤ = west (−x, up-left). The cursor goes exactly where the arrow points. A plain ↑→↓← pad on an iso map makes you translate directions in your head; that's a known annoyance of DS iso tactics. Holding a quadrant auto-repeats (`controls.repeatDelayMs`, `repeatRateMs`).
- **Context-aware d-pad (v0.3, from Cletus's playtest):** the pad only shows directions that do something right now. It keeps one fixed footprint, so A/B and the layout never shift. Changes are a quick cross-fade/morph (`controls.padMorphMs`, 140 ms).
  | State | Pad |
  |---|---|
  | Map cursor: free look, Move, Attack targeting | four diagonal quadrants ◤◥◣◢ (cursor moves along the iso axes) |
  | Command menu, Action submenu | **vertical ▲ ▼**: two big half-disc buttons; hold to repeat |
  | Facing step | four facing arrows ⬉⬈⬋⬊ on the iso facings, with the current facing lit; tap or press A to confirm |
  | Confirm prediction, enemy turn, animations, victory/defeat | dimmed and inert (`controls.padDimOpacity`). A/B are dimmed too whenever it isn't your input; in Confirm, A/B stay live |
- **A (right thumb, upper):** confirm. **B (lower-left of A):** cancel / back. Same layout as the DS.
- Sizes: `controls.dpadSizePx` (156), `abSizePx` (70), `menuItemHeightPx` (44).
- **Keyboard (desktop):** arrows/WASD = d-pad (↑ = ◥ north, → = ◢ east, ↓ = ◣ south, ← = ◤ west). In menus only ↑/↓ (W/S) move the highlight and ←/→ do nothing, matching the ▲▼ pad. Z/Enter/Space = A; X/Esc/Backspace = B.

**Turn flow (player unit):**
1. **Turn starts:** the camera and cursor go to the active unit, and the **command menu** opens (bottom-right of the field) with **Move / Action / Wait**. Move gets the default highlight, but nothing is auto-entered. ◥◤ step up the list and ◢◣ step down it; used commands are greyed and skipped.
   Menus use the ▲▼ pad.
2. **Move:** blue tiles show the range. Move the cursor (the cursor can roam anywhere, but only blue tiles accept A), then press **A** to walk there. **B** goes back to the menu. After moving, the menu returns with Move greyed and **Action** highlighted. **B on the menu after moving, before acting, undoes the move** (unit and facing go back), as in FFTA2.
3. **Action → Attack:** the Action submenu currently holds only **Attack**; ability sets come later. Red tiles show the attack range and the cursor starts on the acting unit. Hovering a valid foe shows the **prediction box** (hit %, damage, HP after, Front/Side/Back, flank, height). **A** selects the target and opens the confirm step (prediction plus "A Execute · B Back"); **A** executes and **B** returns to targeting.
4. **Facing:** reached after moving and acting, or by choosing **Wait**. Four arrows appear around the unit, and the d-pad turns the unit immediately. **A** confirms and ends the turn; **B** returns to the command menu.
5. You can move and act in either order. Act first, and the menu comes back with Move still available.

**Looking around:** **B** on the command menu (when there's no move to undo) enters **free cursor**. The info panel shows whatever unit is under the cursor. **B** on another unit highlights its movement range (purple). **A** or a second **B** returns the cursor to the active unit and reopens the menu. **Tapping a turn-order chip** jumps the cursor to that unit; this stands in for FFTA2's L/R unit cycling.

**Touch shortcuts (the stylus equivalents):** tap a menu item to choose it. Tap a tile once to put the cursor there; tap it again (or press A) to confirm. **Tapping a valid target goes straight to the confirm step**, and tapping it again executes. In the facing step, tap an arrow to turn and tap the same arrow again to confirm. Drag the field to pan (phones zoom 1.3× past fit-width); otherwise the camera follows the cursor.

## Controls: FFTA2 reference
What *Final Fantasy Tactics A2: Grimoire of the Rift* (DS, 2007/2008) does, from the manual and guides:

| Topic | FFTA2 behaviour | Source |
|---|---|---|
| Input | "You can control the game using both the stylus and the buttons." On the world map, you touch the cursor, drag it, then **touch again to confirm**. | [US manual](https://gamegear.net/media/canonical/console/nds/manual/final-fantasy-tactics-a2-grimoire-of-the-rift-usa-enfres__63001.pdf) pp.2–3, 17; [StrategyWiki Controls](https://strategywiki.org/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift/Controls) |
| Buttons in battle | D-pad: move cursor / make selections. A: confirm, move cursor to the active unit, show commands. B: cancel, move cursor to current location, show allies/foes, **hold over a unit to show its move range**. X: system menu. Y: help / unit info. L/R: cycle units (in battle order). | [GameFAQs (Major_Adama)](https://gamefaqs.gamespot.com/ds/937330-final-fantasy-tactics-a2-grimoire-of-the-rift/faqs/53319); [GameFAQs (GrayFox2510)](https://gamefaqs.gamespot.com/ds/937330-final-fantasy-tactics-a2-grimoire-of-the-rift/faqs/53267); [GameFAQs (Dev)](https://gamefaqs.gamespot.com/ds/937330-final-fantasy-tactics-a2-grimoire-of-the-rift/faqs/53627); Manual p.43 ("Select a unit and press the B Button to highlight the tiles to which the unit can move") |
| Turn start | "When one of your units reaches its turn, a list of available commands will appear on the right side of the screen." Basic commands: **Move, Action, Wait** (plus situational special commands). Move and Action can be done in either order. | [US manual](https://gamegear.net/media/canonical/console/nds/manual/final-fantasy-tactics-a2-grimoire-of-the-rift-usa-enfres__63001.pdf) pp.44–45 |
| Move | Blue tiles show range (Move + Jump). Use the cursor to pick a tile, then A or touch the tile. | Manual p.46; [Neoseeker FAQ](https://www.neoseeker.com/final-fantasy-tactics-a2/faqs/173044-e.html) |
| Undo move | "Moved to the wrong location? Just press B, you can do this as many times as you want" (before acting). | [Neoseeker FAQ v3.00](https://www.neoseeker.com/final-fantasy-tactics-a2/faqs/172564-c.html) |
| Action | Submenu: **Attack**, the job's ability set, and an optional secondary set (Item is a secondary set you equip). Pick the target with the cursor + A, or touch it. | Manual pp.46–48; [Neoseeker FAQ v3.00](https://www.neoseeker.com/final-fantasy-tactics-a2/faqs/172564-c.html) |
| Prediction | After choosing the attack/ability target, the hit chance and estimated damage (and the target's reaction ability) appear in the middle of the screen before you commit. | Manual p.47 |
| Wait / facing | Wait ends the turn (the unit's next turn comes sooner). "After ordering a unit to move and take an action, or ordering it to wait, **you must choose a facing** for the unit before its turn will end." Facing uses the d-pad; A confirms (same as placement). | Manual pp.45, 48 |
| Info & turn order | The battle screen shows turn order, tile height, the Smash gauge, and unit HP/MP. Y opens Unit Info; L/R cycles units. | Manual pp.42–44 |
| Camera | Fixed isometric view, no rotation; the view follows the cursor. | Series behaviour (not spelled out in the manual) |

### Where we deliberately differ (for now)
- **Context-aware pad.** A DS has one physical d-pad that never changes. Ours is drawn on screen, so it changes shape to show what you can steer: ▲▼ in menus, quadrants on the map, facing arrows at turn end, dimmed when there's nothing to steer. Cletus asked for this; the mappings themselves are unchanged.
- **Diagonal d-pad.** Our on-screen pad's quadrants point along the iso axes, so the direction you press is the direction the cursor goes. A physical DS pad can't do that. Keyboard arrows map ↑ = north (up-right) and so on.
- **Live prediction while hovering.** FFTA2 shows the prediction after you select a target. We also show it while the cursor hovers a valid target, then show it again in the confirm step. The flow is the same; you just see the numbers sooner.
- **Tapping a target skips the hover step** (tap = select → confirm, tap again = execute). On tiles, tapping only moves the cursor, and a second tap confirms. FFTA2's battle stylus is one-touch, but its world map already uses touch-then-touch-again, and one-touch is exactly what failed in Cletus's playtest.
- **One screen, not two.** The DS top-screen info (unit under cursor, turn order) lives in the info panel and the turn-order strip. Tapping a chip replaces L/R cycling. There's no X system menu, Y help, laws, or clan privileges yet.
- **Free look via B, range via B-on-unit (toggle).** FFTA2 uses *hold B*. Holding a button is awkward on a touch screen, so it's a tap toggle.
- **Action submenu has only Attack.** No abilities or items exist yet, but the extra submenu step is kept so abilities slot in later.
- **No unit placement phase** (FFTA2 places units and picks their facing before battle); deployment is fixed in config.

### Tension with pillar 1
The explicit facing step is a "stop and press" moment, which pillar 1 argues against. We're keeping it because Cletus asked for FFTA2 controls first. It's one d-pad press + A, or two taps. **Open question:** revisit later. Options include defaulting the facing arrow to the most dangerous foe while still requiring A, or a setting.

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
- Controls: keep the FFTA2 menu structure as abilities arrive (Action → job set / secondary set)? Is the end-of-turn facing step worth its press (see pillar-1 tension above)?
- Add L/R-style "next/previous unit" buttons, or are turn-order chips enough?
- Terrain beyond movement (cover, high ground for defense, water/marsh)?
