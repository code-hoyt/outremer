# Outremer — Design Notes

> Locked system decisions for the real game. Current stage: [ROADMAP.md](ROADMAP.md) (Stage 4, the vertical slice; see [SLICE-PLAN.md](SLICE-PLAN.md)). The agreed brief is [GAME-BRIEF.md](GAME-BRIEF.md) (as of Stage 3, with later locks noted there). Open design questions live in [TASKS.md](TASKS.md).

> The Stage 2 prototype as built — campaign board, difficulty sims, two abilities per class, hero creation wizard, missions and recruitment, map catalog, and the FFTA2 control reference — is in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md). That build still runs on GitHub Pages. Its tuning is in [`src/config.js`](../src/config.js) (currently v0.14.2). See [The live prototype](#the-live-prototype) for what still drives it and where each topic went.

Working title. Isometric tactics, FFTA/FFTA2 lineage, Knights Templar. The story starts in the Crusader states and crosses into another world ([STORY.md](STORY.md), [WORLD.md](WORLD.md)).

## Design pillars (from Cletus)
1. ~~No stop-and-press chores.~~ **Retired 2026-11-15:** Cletus said this came from an old game concept and no longer applies.
2. **Customization, and every playthrough feels different.** Squad building, class mixes, and (later) variable maps/encounters.
3. **Trade-off upgrades over pure power.** An upgrade should change *how* a unit plays (e.g. heavier armor = tougher but shorter move / lower jump), not just make numbers bigger.
4. ~~Story later, with room for mythology.~~ **Mythology central from the start** (Stage 3 #10): relics and the uncanny drive the plot. The premise is written in a dedicated story session; told in-engine, FFTA2-style.
5. **Party building where classes move differently** (FFTA-style movement): class determines move, jump and terrain affinity. The party is your created hero plus set companions (BG-style), not a menu-built squad.
6. **Flanking and positioning are central** to combat.

## Stage 3 decisions: what changes for the real game
*Cletus, 2026-11-02. Full list (archived): [archive/stage3-decisions.md](archive/stage3-decisions.md); brief: [GAME-BRIEF.md](GAME-BRIEF.md); build plan: [SLICE-PLAN.md](SLICE-PLAN.md).* These were the Stage 3 answers. Later locks that override them are listed just below. The Stage 2 prototype as built is in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md).
- **Campaign:** ~5 chapters; each is a **mission tree** (chain, branch, companion-only and ability-unlock missions, multi-part missions across locations), mostly side missions, few recruit missions, a story finale. Replaces the v0.11 flat board where "beginning the finale closes the third mission".
- **Party:** squad of 3 all game, plus a few solo/duo story missions.
- **Companions:** **10**, about 2 per chapter, **all gettable in one run** (v0.11's "missed companion" is no longer the replay driver). Recruiting by how you win stays parked.
- **Hero growth:** fixed class (movement identity) + gear that teaches abilities you keep + one borrowed secondary skill set (movement stays yours). FFTA2-style XP leveling: level-ups only raise stats, gains vary by class, **stats 1–100, level cap 50**. New classes later: Physician, and a magic class with magic.
- **Between battles:** an FFTA2-style **world map** of nodes; party/equipment at any node; shops and missions only in towns; take a mission in town and travel to it; side jobs on the way; multi-part jobs can't return to town between parts. Replaces "full HP, no loot, no wounds" carry-over.
- **Wounds:** a fallen companion is Wounded for the next battle; the hero falling loses the battle.
- **Abilities:** no cooldowns (v0.13); build research fix 1 (forecast + tally) and fix 4 (deadly edges, non-kill goals). Rejected: attack-plus retune, frontal riposte, intent for everyone. Magic + MP later.
- **Story:** mythology central; premise still to be written (dedicated story session); scenes in-engine with sprites and portrait text boxes, no pre-rendered cutscenes.
- **Art / platform / tech:** 2D sprites on iso tiles, FFTA2-style portraits (by Guilhem · Illuminator); battle sprites follow FFTA2: idle = walk-in-place (2 frames: left step, right step; made with Retro Diffusion from our stand frame), a separate stand frame for the unit's turn, and **weapons as their own sprite layer** drawn at a per-frame hand anchor during attacks, so body frames are always empty-handed (art test round 7, `CONFIG.artTest`, `docs/art-test/ffta2-sprite-anim-notes.md`); phone first + Steam with controller (Switch a stretch); TypeScript + a renderer (e.g. PixiJS), Capacitor, Tauri/Electron, keep the sim.

### Later locks that override Stage 3
- **Party:** about 6 units deploy per battle, chosen from a larger roster ([Party size](#party-size-2026-11-09), 2026-11-09), not a squad of 3 all game. A few story missions may still be solo or duo.
- **Class:** free switching between battles ([Q1](#classes-and-races--open-questions-2026-11-11), 2026-11-11), not class-for-life. Class still sets MOV / JUMP / terrain; learned abilities are kept. Stage 3's "pick 1 of 2 branches at milestones" is cut (Cletus, 2026-11-18); free class switching replaces it.
- **Race movement:** races have a small stat lean plus one movement quirk ([Q13](#classes-and-races--open-questions-2026-11-11), 2026-11-11). This supersedes "no race movement modifiers; winged race parked." Peri (wing hop), Ifriti (cheap sand and heat), Cynocephali (cheap rough ground) and Hoopoe-kin (flutter-hop) are in [WORLD.md](WORLD.md).
- **Story:** locked decisions live in [STORY.md](STORY.md). A remaining story-premise pass before Chapter 1 content is in [TASKS.md](TASKS.md).
- **Art:** Guilhem · Illuminator makes the art.
- **Kit template:** locked 2026-11-18; see [Unit kit template](#unit-kit-template-locked-2026-11-18). Shops are the main source of teaching gear; rare teaching items have to be found.

## Main character & party (Baldur's Gate-style structure)
*Decided with Cletus (after the v0.5 playtest).* The structure borrows from Baldur's Gate 1/2; the rules don't. **Combat stays our tactics system, not D&D.**

**Decisions**
- **One main character you create.** Everyone else in the party is a **set companion** with their own name, class, personality and story, who joins over the course of the game (BG-style). This replaces generic FFTA-style squad building from a menu.
- **Creation choices: stats, class, portrait. That's all.** The background is always the same (one fixed origin, so the story can be written around it). Name entry is a formality on the confirm step.
- **Stats are rolled, BG1/BG2-style.** Reroll as often as you like. You can take points out of one stat into a shared pool and spend them on another, within a floor and a cap. Store / Recall keeps one roll you liked.
- Classes keep their movement identity: **MOV and JUMP come from class only and are never rolled.** ~~No race movement modifiers either; winged race parked.~~ **Superseded (2026-11-11):** races have a movement quirk on top of class movement ([Q13](#classes-and-races--open-questions-2026-11-11)).
- Story decisions now live in [STORY.md](STORY.md).

**Stat set.** Six stats, used in the live prototype on a 3–18 (3d6) scale, 10 is neutral. ⚠️ Stage 3 #3: stats move to **1–100** with a **level cap of 50** (FFTA2-style XP leveling, stat-only level-ups, class-specific gains), so the 3–18 scale and rolls get rebalanced in the slice ([SLICE-PLAN.md](SLICE-PLAN.md) M5). Each stat feeds an existing combat number:

| Stat | Feeds | Draft per point from 10 (current build) |
|---|---|---|
| **Might** (MGT) | ATK: every attack and damaging ability | ±0.5 ATK |
| **Endurance** (END) | max HP | ±1.5 HP |
| **Fortitude** (FOR) | DEF | ±0.5 DEF |
| **Agility** (AGI) | SPD (how often you get a turn in the CT order) | ±0.5 SPD |
| **Aim** (AIM) | hit chance (today fixed by facing) and crit chance | ±2% hit, ±0.5% crit |
| **Resolve** (RES) | resisting statuses and being shoved/pulled | ±5% resist |

Class base stats from `CONFIG.roles` stay the backbone; rolled stats nudge them. Current creation formula, class minimums, and sim results are in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md#hero-creation-as-built-v06) and `CONFIG.creation`.

**Mockups** (static, not in the game): [`docs/mockups/`](mockups/). A = classic BG roll sheet on one screen, B = step-by-step wizard (the one that was built), C = Templar dossier with a mini iso movement preview.

Still-open questions from this section (stat set, Aim swinginess, the 1–100 mapping, whether the hero's class limits who wants to join) live in [TASKS.md](TASKS.md). ~~A bigger party cap later?~~ **Superseded (2026-11-09):** about 6 units deploy from a larger roster. ~~Squad of 3~~ same lock. Wounds and portrait style were decided in Stage 3 (see above).

The live prototype's creation wizard (Portrait → Class → Stats → Name, mockup B) is documented in the [prototype archive](archive/DESIGN-prototype.md#hero-creation-as-built-v06).

## Combat systems

These rules still drive the live prototype and are intended for the real game. Version history and sim tables are in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md).

## Turn order — CT system (FFTA-like)
- Every unit has a **CT** counter. Time ticks; each tick every living unit gains CT = its **SPD**.
- When a unit reaches **CT ≥ 100** it acts (ties: higher CT, then higher SPD, then id).
- At turn end CT is reduced by what you did: **moved + acted = −100, only one = −80, neither = −60**. Waiting is a real (emergent) choice: you act again sooner.
- Turn-order strip at the top previews the next 8 turns (assumes full cost).
- All numbers: `CONFIG.turn`.

## Movement — classes move differently
Movement is Dijkstra over **move points**: each step costs the destination tile's **terrain cost** (class may override), you can't step up/down more than **JUMP** levels, enemies block, allies can be passed through (not ended on).

Base terrain: Grass 1, Road 1, Sand 2, Rock 2; some maps also use Flagstone 1, Wall 1, Rubble 2, Shallows 2, Stairs (`t`) 1, Cart 2. Current class MOV / JUMP / terrain overrides for the prototype roster live in `CONFIG.roles` and are tabulated in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md#movement--classes-move-differently). `CONFIG.terrain`, `CONFIG.climbCostPerLevel` (0 for now).

Player difficulty nudge in the current build: `CONFIG.teams.player.statBonus` (currently HP +6, DEF +1 on Templars). Sim history for that knob is in the prototype archive.

## Map rule: everywhere is reachable (v0.10)
*Cletus, playtesting v0.9: "the higher areas like on the wall are unreachable for many units, causing the archer to have total dominance across the map. We need to make sure in map balance that every location is reachable within reason… some rule like 'everywhere reachable by someone with at least 2 move and 2 jump'."*

**Rule:** every walkable tile on every map must be reachable from every other tile by a **MOV 2 / JUMP 2** unit. Several turns are fine; terrain costs and height count. We also hold maps to **JUMP 1**, because the v0.9 Breach passed the 2/2 rule (sergeants could hop up) but cut off 17 tiles (the walls and towers) from Knights, and the Knight is exactly the unit that has to go up and fight the archer. Each real class (its own MOV, JUMP and terrain costs) is checked too.
- **Validator:** [`tools/reach.mjs`](../tools/reach.mjs) (`node tools/reach.mjs`). It checks strong connectivity with a forward and a reverse search: a step is legal if the height change ≤ JUMP and the tile's entry cost (+ `climbCostPerLevel` per level up) ≤ MOV. A tile that costs more than MOV to enter (e.g. Knight in rubble at MOV 2) counts as cut off. The rules live in `CONFIG.mapRules`. It exits 1 and lists the cut-off tiles if a map fails, and it runs in the test suite (`outremer-test/reach.mjs`, which also checks that the old Breach is caught). v0.10: **all 3 maps, 64/64 tiles, every rule and class.**
- **Designing maps:** to raise ground by more than 1 level, put a stair or ramp tile (one level per step) somewhere, on both sides of a wall that both teams should be able to contest.

The current build's title-card map picker and the v0.10 map sim numbers are in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md#map-rule-everywhere-is-reachable-v010). Prototype maps (The Ridge, The Breach, The Baggage Train, The Chapel Ford) are listed there and live in [`src/maps.js`](../src/maps.js).

## Facing, flanking & positioning
- Every unit has a **facing** (N/E/S/W, shown as a ground arrow wedge and in the info panel).
- Hits are classed by where the attacker stands relative to the target's facing: **Front / Side / Back**.
  - Damage: Front ×1.0, **Side ×1.25, Back ×1.5**
  - Hit chance: Front 80%, **Side 90%, Back 100%**
- **Flanking (pincer):** +15% damage per *other* ally adjacent to the target (max 2). Emerges from positioning.
- **Height (softened v0.10):** per level of height advantage, **+5% damage for melee and abilities, +3% for ranged shots** (attacker more than 1 tile away). Per level of disadvantage, **−5%**. The total is clamped to **×0.85–×1.1**, and hit chance is **±2% per level**. Archers gain **+1 range per 3 levels** above the target (was per 2). Melee can't reach targets too far above/below (`maxHeightReach`). *Why:* Cletus, v0.9: on The Breach the raider archer "sits up there and murders everyone, doing wicked damage and unable to be countered." v0.9 had ±10%/level clamped 0.7–1.4, ±3% hit, +1 range per 2 levels. So an archer on the height-3 wall shot down at **×1.3 damage and +9% hit**; now it's **×1.09 and +6%**. From the height-4 tower: range +2 → +1. The wall is also reachable now (see Maps).
- **Prediction before executing:** hovering a valid target shows, and the confirm step repeats, e.g. `Hit 90% · Dmg ~22 · HP 28→6 · Back +50% · Flank ×1 +15% · Height +10%`.
- **Facing at end of turn is an explicit choice (FFTA2-style).** Auto-facing was removed after Cletus's playtest (v0.2): every player turn ends on a facing step with four arrows drawn on the ground around the unit. Attacking still turns the attacker toward the target (as in FFTA2), but the final facing is always yours.
- The enemy AI values side/back attacks, and the AI picks its own facing (toward its nearest foe).

## Combat formula
```
base     = ATK × 1.6 − DEF × 1.0
damage   = max(1, round(base × heightMod × facingMod × flankMod))
final    = damage × (1 ± 10% variance) × (1.5 on 5% crit)
hit%     = clamp(5..100, facingHit + 2 × heightAdvantage)
heightMod = clamp(0.85..1.1, 1 + perLevel × heightAdvantage)
            perLevel = +0.05 melee / +0.03 ranged when above, 0.05 when below
```
All constants: `CONFIG.combat`.

## Enemy AI (simple scoring)
For every reachable tile × every target attackable from it: `100 + expectedDamage + killBonus(25×hit) + sideBonus(4)/backBonus(10) + 2×tileHeight − 0.35×danger`. If no attack is possible: move toward the nearest foe (`−1.5 × distance`). Archers avoid ending closer than 3 tiles. Weights: `CONFIG.ai`.
**v0.10:** "distance" for the approach pull is the **walking cost** (terrain, height, JUMP; units ignored) to the nearest tile the unit could attack a foe from, not the straight-line distance. Units go round to stairs instead of getting stuck at the foot of a wall. Each unit's personality (`aiStyle` → `CONFIG.ai.personalities`) multiplies the danger penalty and the approach pull. It can also add a pull toward the squad (`rally`) and scale self-stances (`stance`). Raiders are `steady`. Raiders score the recruit-mission ally at ×`npcTargetMul`, including the +100 attack head.

## Abilities (cost model)
**No cooldowns, no generic cost** (v0.13, Stage 3 #6). An ability takes your Action and is usable every turn. Its only cost is a drawback built into what it does. Magic and MP are parked for later.

The live prototype still has **two abilities per class**. That kit, the AI's use of it, and the balance sims are in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md#abilities-v04--two-per-class-all-about-position) (`CONFIG.abilities`). For the real game, class set size follows the [unit kit template](#unit-kit-template-locked-2026-11-18).

## Controls (FFTA2-style, as built)
Cletus's playtest (v0.1): tapping exact tiles on a phone was fiddly, and auto-facing / starting the turn already in Move mode felt wrong. He wants the controls to match FFTA2 to start with; we may change them later. So the battle UI is now a **cursor + command menu + A/B** scheme, with taps as a shortcut.

**On-screen pad (bottom of the screen, under the battlefield so it never covers the action):**
- **D-pad (left thumb), v0.7:** a classic **▲ ▶ ▼ ◀ cross**, in the same style as the Stats-step pad Cletus liked. It replaced the v0.2–v0.6 diagonal quadrants (◤◥◣◢), which Cletus found weird after playtesting. **Mapping (rotate clockwise from Up = up-right):** ▲ = north (−y, **up-right** on screen), ▶ = east (+x, **down-right**), ▼ = south (+y, **down-left**), ◀ = west (−x, **up-left**). It lives in `controls.padCross`, and the map cursor, the facing step and the keyboard all read it, so they can't disagree. Holding an arm auto-repeats (`controls.repeatDelayMs`, `repeatRateMs`).
- **Context-aware d-pad (v0.3, from Cletus's playtest):** the pad only shows directions that do something right now. It keeps one fixed footprint, so A/B and the layout never shift. Changes are a quick cross-fade/morph (`controls.padMorphMs`, 140 ms).
  | State | Pad |
  |---|---|
  | Map cursor: free look, Move, Attack targeting | **▲▶▼◀ cross** (v0.7): ▲ up-right, ▶ down-right, ▼ down-left, ◀ up-left on the map (`controls.padCross`); hold to repeat |
  | Command menu, Action submenu | **vertical ▲ ▼**: two big half-disc buttons; hold to repeat |
  | Facing step | **the same cross** in gold, the arm for the current facing lit. Same mapping: ▲ faces up-right, ▶ down-right, ▼ down-left, ◀ up-left. Each facing arrow on the map carries a small ▲▶▼◀ badge naming its button (`controls.facingArrowLabels`). A confirms (tapping a map arrow twice also confirms) |
  | Confirm prediction, enemy turn, animations, victory/defeat | dimmed and inert (`controls.padDimOpacity`). A/B are dimmed too whenever it isn't your input; in Confirm, A/B stay live |
  | Title / end-of-battle picker | **vertical ▲ ▼** + A/B (unchanged): it's a short list, and A/B match the battle that follows |
  | **Mission board, brief, join offer** (v0.8) | **vertical ▲ ▼ + A/B**, same as the title. They're short lists (≤ 6 rows), so they follow the list rule: ▲▼ move the highlight (the list scrolls with it), A opens the mission / Begins (then asks "Begin mission?", v0.12) / Accepts, B goes back one screen (board → title, brief → board, confirm → brief or board). On the **join offer B does nothing**: Accept/Decline is a real choice and shouldn't be skipped by a reflex B. Taps work everywhere (a tap = release without dragging, v0.12). The squad portraits on the board are **tap-only** (field/rest); they're a side control, and adding them to the pad list would make it longer than it needs to be. The unit info panel is hidden while any list screen is up, so the list gets the room |
  | **"Begin mission?" confirm** (v0.12) | **vertical ▲ ▼ + A/B**, the same list rule. Two rows, **Yes, begin** (highlighted) / **No**. A takes the highlighted row, B = No (one screen back: brief, or the board for a skirmish). It swallows **every** input (tap, pad, keys) for `controls.confirmDebounceMs` (350 ms) after it opens, so a double tap or a held key can't start a battle. Yes is highlighted, but taking it always needs a second, separate press. See *Starting a battle* below |
  | Hero creation: **Portrait** (v0.6) | **no pad, no A/B.** Full-screen wizard over the pad. Picking a bust is a direct tap on a 4×2 grid; a cursor would be slower. Back/Next buttons in the footer |
  | Hero creation: **Class** | **no pad, no A/B.** Swipe the card, tap ◀ ▶ beside it or tap a dot. A pad would only duplicate the arrows |
  | Hero creation: **Stats** | **4-way cross** (from mockup B, which Cletus liked): ▲▼ pick a stat, ◀ ▶ −/+, hold to repeat. Taps on −/+ work too. **No A/B**: Reroll / Store / Recall and Back/Next are labelled buttons, so an A/B pair would be ambiguous. This is the one screen with many small repeated adjustments, which is where a pad beats tapping 34px buttons |
  | Hero creation: **Name & confirm** | **no pad, no A/B.** The phone keyboard covers the bottom of the screen; "Begin ✠" confirms |
  | Battle | cross on the map and in the facing step, ▲▼ in menus, dimmed otherwise (rows above) |
  Desktop keys in the wizard: arrows/WASD move through portraits, change class, or drive the Stats cross; Enter/Z/Space = Next; Esc/X/Backspace = Back (on step 1, back to the title).
- **A (right thumb, upper):** confirm. **B (lower-left of A):** cancel / back. Same layout as the DS.
- Sizes: `controls.dpadSizePx` (156), `abSizePx` (70), `menuItemHeightPx` (44).
- **Keyboard (desktop):** arrows/WASD = the cross, from the same `padCross` (↑ = north/up-right, → = east/down-right, ↓ = south/down-left, ← = west/up-left). In menus only ↑/↓ (W/S) move the highlight and ←/→ do nothing, matching the ▲▼ pad. Z/Enter/Space = A; X/Esc/Backspace = B.

**Turn flow (player unit):**
1. **Turn starts:** the camera and cursor go to the active unit, and the **command menu** opens (bottom-right of the field) with **Move / Action / Wait**. Move gets the default highlight, but nothing is auto-entered. ▲▼ move through the list; used commands are grayed and skipped.
   Menus use the ▲▼ pad.
2. **Move:** blue tiles show the range. Move the cursor (the cursor can roam anywhere, but only blue tiles accept A), then press **A** to walk there. **B** goes back to the menu. After moving, the menu returns with Move grayed and **Action** highlighted. **B on the menu after moving, before acting, undoes the move** (unit and facing go back), as in FFTA2.
3. **Action → Attack:** the Action submenu currently holds only **Attack**; ability sets come later. Red tiles show the attack range and the cursor starts on the acting unit. Hovering a valid foe shows the **prediction box** (hit %, damage, HP after, Front/Side/Back, flank, height). **A** selects the target and opens the confirm step (prediction plus "A Execute · B Back"); **A** executes and **B** returns to targeting.
4. **Facing:** reached after moving and acting, or by choosing **Wait**. Four arrows appear around the unit, and the d-pad turns the unit immediately. **A** confirms and ends the turn; **B** returns to the command menu.
5. You can move and act in either order. Act first, and the menu comes back with Move still available.

**Looking around:** **B** on the command menu (when there's no move to undo) enters **free cursor**. The info panel shows whatever unit is under the cursor. **B** on another unit highlights its movement range (purple). **A** or a second **B** returns the cursor to the active unit and reopens the menu. **Tapping a turn-order chip** jumps the cursor to that unit; this stands in for FFTA2's L/R unit cycling.

**Touch shortcuts (the stylus equivalents):** tap a menu item to choose it. Tap a tile once to put the cursor there; tap it again (or press A) to confirm. **Tapping a valid target goes straight to the confirm step**, and tapping it again executes. In the facing step, tap an arrow to turn and tap the same arrow again to confirm. Drag the field to pan (on phones the board uses a locked integer art scale and is a little wider than the stage); otherwise the camera follows the cursor.

**Starting a battle: tap vs scroll, and "Begin mission?" (v0.12).** *Cletus, playtesting v0.11: "Accidentally started some random mission when I was trying just to scroll… Perhaps a button for accepting a mission rather than just having it on touch? Only problem with that is it's very phone specific. That button wouldn't make sense if we were using a controller… also an are you sure prompt would be good on mission selects."*
- **A tap is a tap, a drag is a scroll.** List items (title, board, briefs, join offer, end card, the board's squad portraits) used to act on *pointerdown*, so touching a mission to scroll the board picked it. Now an item acts only on release, and only if the finger moved no more than `controls.tapSlopPx` (10 px), the card didn't scroll, and the finger lifted on the same item. When the browser takes the touch as a scroll it fires `pointercancel`, which drops the tap too. Shared helper: `src/tap.js`.
- **Every battle start asks first.** Picking a mission still opens its brief, which is safe because Back is right there. **Begin** (recruit missions, the finale), a **skirmish** on the board, and a map on the no-hero title now open **"Begin mission?"** (Yes, begin / No) instead of starting. The finale's confirm repeats its warning ("⚠ This closes Smoke at the Well: Yusuf will be missed"). Nothing is closed or saved until you take Yes. Retry and Play again on the end card start right away: there you just chose to play again.
- **Not a phone-only button.** The confirm is an ordinary picker row pair, so it works the same with a tap, ▲▼ + A/B on the pad, Enter/Escape (and ↑/↓) on a keyboard, and will work with a controller's D-pad + A/B.
- **Audit of the other screens:** the hero-creation stat list scrolls on small phones. Rows and the − / ＋ buttons now also act on a tap (or a still hold, which auto-repeats), never on a drag. The creator's other buttons already used `click`, which browsers don't fire after a scroll. The battle field already told pans from taps (`view.dragThresholdPx`). The command menu and the turn strip don't scroll.

The longer FFTA2 reference (what the DS game does, and where this build deliberately differs) is in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md#controls-ffta2-reference).

## Allies in character
A companion flees or hides only if that's their story or the battle's design. In the live prototype, recruit-mission allies have AI personalities (`CONFIG.ai.personalities`); the as-built notes for Renaud, Yusuf and Wren are in [archive/DESIGN-prototype.md](archive/DESIGN-prototype.md#missions--recruitment-v08-revised-v09).

## The live prototype

The GitHub Pages build is still the Stage 2 prototype. Locked decisions above override it for the *real* game; the table below is what the running build uses, and where the as-built write-up went.

| Topic | Where the as-built write-up lives | Tuning / code |
|---|---|---|
| Hero creation wizard (v0.6) | [Prototype archive](archive/DESIGN-prototype.md#hero-creation-as-built-v06) | `CONFIG.creation`, `src/create.js`, `src/hero.js` |
| Missions and recruitment (v0.8–v0.10) | [Prototype archive](archive/DESIGN-prototype.md#missions--recruitment-v08-revised-v09) | `CONFIG.party`, `src/missions.js`, `src/party.js` |
| Mini-campaign: open board, Chapel Ford, Chronicle (v0.11) | [Prototype archive](archive/DESIGN-prototype.md#campaign-v011-open-board-finale-after-2) | `CONFIG.campaign` |
| Difficulty knobs and sim results (v0.9–v0.11) | [Prototype archive](archive/DESIGN-prototype.md#difficulty-v09-retuned-v010) | `CONFIG.difficulty`, `tools/sim.mjs` |
| Prototype class MOV / JUMP table | [Prototype archive](archive/DESIGN-prototype.md#movement--classes-move-differently) | `CONFIG.roles` |
| Maps (Ridge, Breach, Baggage Train, Chapel Ford) | [Prototype archive](archive/DESIGN-prototype.md#maps-v05) | `src/maps.js`, `CONFIG.terrain` |
| Two abilities per class (v0.4 / v0.13) | [Prototype archive](archive/DESIGN-prototype.md#abilities-v04--two-per-class-all-about-position) | `CONFIG.abilities` |
| FFTA2 control reference and old 1.3× camera zoom | [Prototype archive](archive/DESIGN-prototype.md#controls-ffta2-reference) | Camera is now the integer art scale in `CONFIG.art`; see [Art scale](#art-scale-locked-2026-11-11) |
| What's placeholder, older open questions | [Prototype archive](archive/DESIGN-prototype.md#whats-placeholder) | Still-open items were copied to [TASKS.md](TASKS.md) or the [ROADMAP.md parking lot](ROADMAP.md#parking-lot) |

CT, movement rules, the map-reachability rule, facing, the combat formula, enemy AI scoring, the ability cost model, and the as-built control scheme stay in this file because they still drive `src/` and are intended to carry into the real game.

## Party size (2026-11-09)
- The game is moving from a 3-unit squad to FFTA2-style clans: about 6 units deploy per battle, chosen from a larger roster. The deploy cap should be a value in `src/config.js` once this is coded.

## Classes (2026-11-09)
- FFTA2-style: basic classes that unlock more advanced and unique options. This needs its own design discussion; it has not been designed yet.
- **Class kits live in [CLASSES.md](CLASSES.md).** The five first race classes (all five kits complete as of 2026-11-23) are at the top. The 2026-11-12 draft (13 core classes, older race-only sketches, hero unique-class sketches) is kept in the same file and marked where later locked decisions supersede it.

## Bestiary terms (LOCKED 2026-11-09)
These words name different kinds of enemy, not competing labels for the same creature:
- **Imps, Wretches, Blights, Hollows (the Hollowed), Gheists, the Fallen:** distinct lesser kinds.
- **Fiends:** mid-tier. The Act 1 opening encounter is a Fiend plus lesser spawn.
- **Demons:** stronger and named enemies. The first true Demon is the Act 1 finale at the holy stronghold ("Saint-Caller Calling for Aid"). Facing one is a bigger moment after the opening Fiend.
- **Sulthrane** is above them.
Exact stats and which kinds appear when are still to be designed.

## Scripture presentation (2026-11-10)
- Verses appear on act title cards, on node consecration, and in dialogue. Each shows in Latin first, then burns away into the KJV English. Timings go in `src/config.js` when built. The effect needs testing on a phone, and it must not block input.
- Feel-test prototype (title card vs consecration toast; Latin burns away into KJV English): https://code-hoyt.github.io/outremer/verse-test/
- **Picked (2026-11-10):** title-card style, with Latin burning away into the English in one sweep and no gap, at the prototype's slowest speed (0.5x). Ephesians 6:12 runs about 12s. The values are in `CONFIG.scripture` in `src/config.js`. Node-consecration banners can reuse the same effect later if wanted.

## Art scale (LOCKED 2026-11-11)
Cletus locked a 60 px unit cap so sprites use raw Retro Diffusion output with no shrink. The numbers below are in art pixels and live in `CONFIG.art` in `src/config.js`.

- **Sprite cell** 64×68, feet anchor `[31, 63]`.
- **Centering (locked, Cletus 2026-11-11):** units are planted so the torso center sits on the tile center, not the feet. Body-centered won the side-by-side against feet-centered (v0.14.0), and the switch was removed in v0.14.2. `bodyCenterX` holds one whole-art-px x per facing, taken from the standing cell's shoulders-to-hips mass; walk frames of that facing share it so he does not jitter sideways.
- **Iso tiles** 60×30, height step 15. Same 2:1 diamond as the previous 64/16 base, so map layout, pathing and depth sort are unchanged.
- **Integer scale.** Tiles and sprites share one whole-number `s` (device pixels per art pixel), with image smoothing off for sprites. Tile width in device pixels is exactly `60 × s`.
- **Phones** (stage narrower than 520 CSS px) use `s = 3`. At DPR 3 an 8×8 board is 480 CSS px wide and pans a little on a 390-wide iPhone. Wider screens use the largest `s` that fits. This replaces the old 1.3× zoom-past-fit.
- **Tristan** is the player hero's battle sprite (standing 8-dir plus a 4-diagonal walk). Other units keep the placeholder drawing until their sheets arrive. Left-facing diagonals are already flipped in the files; the engine never mirrors them. Idle is a 2-frame walk-in-place at 410 ms; a move uses the same frames at 170 ms (340 ms per tile). Attacks use the standing cell plus the existing lunge.
- Headroom above the highest tile is derived from the cell (`CONFIG.art.headroom`), not a hardcoded `62`.

## Classes and races — open questions (2026-11-11)

> **Class kits:** [CLASSES.md](CLASSES.md). The 2026-11-12 draft built on these answers is kept there and marked where later locked decisions supersede it.

Research summary (sources in chat, 2026-11-11): big job systems run ~20–56 jobs (FFT 20–22 + ~10 unique; FFTA ~34; FFTA2 56, but 4–13 per race). Recommended direction (not locked): mid-size tree of ~10–14 basic/advanced classes plus unique hero classes; class sets movement; abilities learned from buyable gear; one borrowed set; ~~about 4 abilities carried into battle~~ **superseded (2026-11-18):** loadout is 1 reaction + 1 passive, plus the class set and one borrowed set (see [Unit kit template](#unit-kit-template-locked-2026-11-18) items 1, 3 and 14); every ability a trade-off. Phone is the smallest supported screen, not a design cap. The older "hero + 10 set companions, squad of 3" plan is superseded by the ~6-deployed clan.

Questions for Cletus, answered one at a time:
1. ~~Can units change class?~~ **Locked 2026-11-11: free switching, FFT-style.** Changing class changes MOV/JUMP/terrain; learned abilities are kept.
2. ~~How do classes unlock?~~ **Locked 2026-11-11: gear mastery (FFTA2-style: master N abilities from equipped gear in prerequisite classes) for most classes; quests for special classes.** Teaching gear must be obtainable (shops), not loot-gated.
3. ~~Unique or generic hero classes?~~ **Locked 2026-11-11: both.** Each story hero has a unique class (a trade-off, not strictly better) unlocked through that hero's side quests, to pull players into the side-quest trees; heroes can also take generic classes.
4. ~~Weapons tied to class?~~ **Locked 2026-11-11: yes, class-gated weapon types, with an "Equip X"-style escape-hatch ability that costs one carried ability slot.**
5. ~~Respec cost?~~ **Locked 2026-11-11: class switching is free between battles, never mid-fight.** The trade-off is time: battles spent learning one class are not spent on another.
6. ~~Replay variety?~~ **Locked 2026-11-11: optional recruits (no run gets everyone), random recruit traits, and a few story choices.**
7. ~~How do we avoid trap classes and a single dominant combo?~~ **Locked 2026-11-11: sideways class tree (later classes differ, not better; every class keeps a niche), every ability carries a cost, and battles/maps reward different builds. Effects that don't stack fully are a tuning safety net if needed.**
8. ~~How many races?~~ **Locked 2026-11-11: four (Humans plus three), with a possible fifth race later, unlocked through quests (Redeemed on hold, see Q14).**
9. ~~Which races?~~ **Locked 2026-11-11: Humans, Peri (small, quick, short wing hop), Ifriti (smokeless-fire folk, magical, at home in heat and sand) and Cynocephali (dog-headed people of medieval travel tales, trackers). Names are working titles; see docs/research/RACES.md. Looks pending Guilhem's full-scale portraits.**
10. ~~Real-world heroes: Humans or Outlanders?~~ **Locked 2026-11-11: plain Humans; unique classes set them apart.**
11. ~~How strict are race locks?~~ **Locked 2026-11-11: FFTA2-style. A shared core of classes, but not every race can take every core class: Humans get almost all of the core, Peri the nimble core classes, Ifriti the magical ones and Cynocephali the fighters. Each race also has a few race-only classes.**
12. ~~How do non-Humans join?~~ **Locked 2026-11-11: all four races are recruitable from the start. Race-specific quests unlock race classes. Exception (2026-11-12): Peri are hidden and unlock as recruits through a Peri side-quest tree; see docs/WORLD.md. A later fifth race can unlock through quests (not the Redeemed for now).**
13. ~~Do races differ beyond class list?~~ **Locked 2026-11-11: small stat lean plus one movement quirk per race, on top of class movement (draft: Peri quick/fragile + short wing hop over gaps; Ifriti magic-strong/low defense + cheap sand and heat; Cynocephali sturdy/fast + cheap rough ground). Stat growth still comes from class at level-up. Humans: balanced, no quirk; their edge is the widest class list (2026-11-12).**
14. ~~Can playable races fall?~~ **Locked 2026-11-11: both. Pure profane monsters (Imps, Fiends, etc.) plus Fallen versions of each playable race among enemies. Player units never fall. Exception for Peri (2026-11-12): hostile Peri following the old faith are just "Peri"; Peri call their converts "Fallen" (see docs/WORLD.md).**
    - **Redeemed: on hold (2026-11-11).** Not used for now. Parked idea: Fallen of any race who turned back, as a state rather than a new anatomy. The later quest-unlocked race slot (Q8/Q12) is open for a different race instead.
    - **Redeemed as a recruit trait (Cletus 2026-11-12, idea):** a rare recruit-only trait for a unit who was once Fallen and saw the light. This is where the Redeemed angle lives instead of a race; needs a trade-off design.
15. ~~Recruit power curve: in FFTA/FFTA2 late recruits join with better stats, which pushes players off long-built favorites. How do we keep favorites viable?~~ **Locked, see below.**
    - **Locked 2026-11-11:** recruits join at or below clan level (may revisit). Veterans earn battle-forged trade-off traits from their history. Some rare traits, abilities or skills can only roll on random recruits, so a recruit is a tempting sideways pick and never a strict upgrade. Stats grow from the class a unit is in when it levels up (FFT-style), so stat builds are a reward for planning. No comrade bonds and no flattened growth. How benched units keep up is still open; Cletus dislikes dispatch missions and free XP for not fighting.
    - **Bench catch-up, locked 2026-11-11:** experience scales with the level gap, so under-levelled units catch up quickly by fighting stronger enemies. No free experience and no dispatch missions. **Parked for later:** a squire/knight bonus (a low-level unit fighting beside a high-level one earns bonus experience; needs more thought) and a small "rested" bonus for benched units (maybe double experience on the first kill only, not a full doubling).


## No fog of war (locked 2026-11-17)
The whole battlefield is always visible. Don't design abilities around vision or revealing hidden units.

## Unit kit template (locked 2026-11-18)
Research: [research/KIT-SYSTEMS.md](research/KIT-SYSTEMS.md). Decided one question at a time:
1. **Passive slots (locked 2026-11-18):** FFTA2 style, 1 reaction + 1 passive (support) per unit. An "Equip X" escape hatch therefore costs the unit its only passive slot, which makes it a real trade-off.
2. **Signature moves (locked 2026-11-18):** learned from gear like any other ability, not built in. A signature is the move players switch to the class to get; it can be learned early or late (Cletus, 2026-11-18). A new Templar Knight doesn't know Smite until it masters it from gear.
3. **Borrowed set (locked 2026-11-18):** one secondary set, from any class the unit has learned at least one ability in. Signature moves can be borrowed too (a learned Smite works from a borrowed Templar set).
4. **Equipment slots (locked 2026-11-18):** FFTA2-style flexible 5. The gear screen is 5 open slots that take items in any order. Hand items (weapons, shields) are limited by hands: a two-hander uses both, and a sword plus a shield fills both. Head, body and feet (shoes) are one piece each (confirmed by Cletus 2026-11-18). Trinkets/charms have no cap, so a unit can spend 3 slots on trinkets if the player wants. Exact limits go in `src/config.js` when built.
5. **Armor gating (locked 2026-11-18):** by class, like FFTA2. Each class has an armor list (e.g. heavy, light, robes); no weight-based move/jump penalty.
6. **Teaching gear (locked 2026-11-18):** any gear can teach abilities, like FFTA2: weapons, armor and trinkets. Which item teaches which ability (and of what type) is set per item.
7. **Where teaching gear comes from (locked 2026-11-18):** shops are the main source and stock plenty, so finding your next skill is a shopping trip, with no FFTA2-style loot-trading bazaar. Ordinary loot gives variants and trade-off versions. Rare or unique items that teach rare skills have to be found, e.g. as the reward for the final battle of a quest line. Other places to hide rares (secret maps, bosses, events) are open to design.
8. **AP from battle (locked 2026-11-18):** only units that fought earn AP; benched units earn none. Target roughly 3-5 battles to master an ability (exact values go in `src/config.js`). Other ways to earn AP (quests, events, training, etc.) stay open and can be added where they make sense.
9. **Handedness (locked 2026-11-18):** two-handed weapons are in (they use both hands, so no shield). Dual wield is an unlockable passive, not a default; since it takes the unit's single passive slot, it is a trade-off. Which class teaches it is decided with the class kits.
10. **Class set size (locked 2026-11-18):** FFTA2-sized. Each class has its signature plus 6-10 actions in total, and a few reactions and passives (roughly 2-4 of each). Exact counts are set per class with the kits.
11. **Race-themed passives (locked 2026-11-18):** the ability system has no race rule of its own; any learned ability can be equipped. But race-themed abilities are taught by classes that are locked to a race (e.g. Div-Hunter for the Peri, Oath Mage for the Ifriti), so in practice only that race can learn them. Which classes are race-locked is decided per class.
12. **Extra systems (parked 2026-11-18):** meters/gauges, combo attacks and summons are parked for later; the core kit is proven first. Listed in TASKS.md Parking lot.
13. **Equip abilities (locked 2026-11-18):** "Equip X" abilities (e.g. Equip Heavy Armor) use the single passive slot, so breaking a class's gear limits costs the unit its passive. No separate slot.
14. **Item command (locked 2026-11-18):** Item is a set like any other and uses the borrowed (secondary) slot, so using items costs a unit its borrowed class set.

## Field objects (locked 2026-11-19)
Abilities can place **field objects** on the map, such as the Rooster's roost. A field object takes up one cell. Units next to it can interact with it through a command it grants (for example Use Roost). Enemies can use them too unless the object says otherwise.
- **HP (locked 2026-11-19):** each object type is one of: has HP and can be destroyed by either side; indestructible; or not targetable at all. Destructible objects feed mission objectives (for example "destroy the obelisk before the timer runs out").
- Limits on how many objects one unit can place are still open.

## Lingering area moves (noted 2026-11-22)

Cletus likes area-of-effect moves that stay on the field for a few turns (for example the Rooster's Blackout). Keep this move type in mind for other classes. It could anchor its own class that fills the field with lingering effects. Open: duration, stacking, and whether these count as field objects.

## Armor penalties (locked 2026-11-23)

There is no general penalty for armor weight, heavy or not: no move, jump, flight or evasion loss just for wearing heavy armor. If a penalty exists, it belongs to a specific armor piece and comes from that armor's lore (Cletus).

