# Outremer — Design Notes (v0.8, slice + FFTA2 controls + context-aware cross pad + class abilities + 3 maps + hero creation + missions & recruitment)

> **Roadmap / current stage:** see [ROADMAP.md](ROADMAP.md) (now: Stage 1 combat prototype, Stage 2 under way: hero creation, the mission board and three recruitable companions are in).

Working title. Isometric tactics, FFTA/FFTA2 lineage, Knights Templar during the Crusades.
**Story is deliberately undecided.** Unit names are generic (Templar Knight, Sergeant, Turcopole Archer; Raider Swordsman / Skirmisher / Bowman) so nothing is locked in.

## Design pillars (from Cletus)
1. **No stop-and-press chores.** Avoid mechanics where the player must stop, press a button, then get back to work. Prefer systems that *emerge from choices the player is already making* (where you move, who you hit, from where).
2. **Customization, and every playthrough feels different.** Squad building, class mixes, and (later) variable maps/encounters.
3. **Trade-off upgrades over pure power.** An upgrade should change *how* a unit plays (e.g. heavier armor = tougher but shorter move / lower jump), not just make numbers bigger.
4. **Story later, with room for mythology.** Leave hooks (relics, legends, the uncanny) without committing now.
5. **Party building where classes move differently** (FFTA-style movement): class determines move, jump and terrain affinity. The party is your created hero plus set companions (BG-style), not a menu-built squad.
6. **Flanking and positioning are central** to combat.

## Core loop (slice)
Battle only: 3 Templars vs 3 Raiders on an 8×8 height-mapped iso map. On your unit's turn: **Move** (optional) and **Act** (optional) in either order, then the turn ends. Win by defeating all raiders; lose if all Templars fall. Victory/Defeat screen → Play again.

Future loop (not built, Stage 2): **create your hero → fight → a set companion joins → next fight**, with trade-off upgrades between battles. See [Main character & party](#main-character--party-baldurs-gate-style-structure).

## Main character & party (Baldur's Gate-style structure)
*Decided with Cletus (after the v0.5 playtest).* The structure borrows from Baldur's Gate 1/2; the rules don't. **Combat stays our tactics system, not D&D.**

**Decisions**
- **One main character you create.** Everyone else in the party is a **set companion** with their own name, class, personality and story, who joins over the course of the game (BG-style). This replaces generic FFTA-style squad building from a menu.
- **Creation choices: stats, class, portrait. That's all.** The background is always the same (one fixed origin, so the story can be written around it). Name entry is a formality on the confirm step.
- **Stats are rolled, BG1/BG2-style.** Reroll as often as you like. You can take points out of one stat into a shared pool and spend them on another, within a floor and a cap. Store / Recall keeps one roll you liked.
- Classes keep their movement identity: **MOV and JUMP come from class only and are never rolled** (no race movement modifiers either; winged race parked).
- Story stays unlocked.

**Proposed stat set (draft, to confirm with Cletus).** Six rolled stats, each 3–18 (3d6), 10 is neutral. Each one feeds an existing combat number, so nothing new has to be learned in battle:

| Stat | Feeds | Draft per point from 10 |
|---|---|---|
| **Might** (MGT) | ATK: every attack and damaging ability | ±0.5 ATK |
| **Endurance** (END) | max HP | ±1.5 HP |
| **Fortitude** (FOR) | DEF | ±0.5 DEF |
| **Agility** (AGI) | SPD (how often you get a turn in the CT order) | ±0.5 SPD |
| **Aim** (AIM) | hit chance (today fixed by facing) and crit chance | ±2% hit, ±0.5% crit |
| **Resolve** (RES) | resisting statuses (Pin, Feint's turn, Exposed) and being shoved/pulled | ±5% resist |

Class base stats from `CONFIG.roles` stay the backbone; rolled stats nudge them (a great roll is roughly +15–20%, not a different class). Numbers would live in `CONFIG.creation` (roll dice, floor, cap, per-point mods).

**Mockups** (static, not in the game): [`docs/mockups/`](mockups/). A = classic BG roll sheet on one screen, B = step-by-step wizard, C = Templar dossier with a mini iso movement preview. They use a new d-pad state, a **4-way cross** (▲▼ pick a row, ◀▶ −/+ or change choice), alongside taps.

**Open questions**
- Is this the right stat set, and how does each map to combat (above is a draft)? Does Aim make facing's fixed hit% too swingy?
- Stat ranges: 3–18 with floor 3 / cap 18, or a narrower band (e.g. 6–16)? Class minimums like BG (Knight needs MGT 9)?
- ~~Do companions use the same six stats?~~ Yes, hand-set (v0.8). Does the hero's class limit which companions want to join?
- ~~How are companions recruited?~~ v0.8: win their mission, then Accept/Decline; squad 3 (hero + 2), extras rest in camp (see Missions & recruitment). Still open: a bigger party cap later?
- Can the main character die? BG: hero death = game over. Alternatives: knocked out but the fight continues, or a wound system (ties into permadeath vs wounds).
- Portrait art style: painted BG-style busts, pixel art matching the battle sprites, or line-art icons? Pre-made set to pick from vs a builder (face/helm/colours)?

### Hero creation as built (v0.6)
Mockup **B** (wizard) was picked. After the title screen: **Create your hero** (first visit; preselected) or **New hero** (later). The map list stays on the title screen as before.
1. **Portrait:** 8 placeholder SVG busts (helm, kettle hat, coif, hood…).
2. **Class:** one card per class (Knight, Sergeant, Archer, Scout) with MOV / JUMP / range / SPD, its two abilities and a **mini iso move preview** (Dijkstra on a fixed 7×7 patch with the class's real MOV, JUMP and terrain costs).
3. **Stats:** six stats, each 3d6 (3–18), raised to the class minimum (Knight MGT 9 / END 9, Sergeant MGT 8, Archer AIM 9, Scout AGI 9). **BG rules:** − lowers a stat down to max(3, class minimum) and puts the point in the pool; + spends from the pool up to 18. Reroll as often as you like; Store keeps one roll, Recall brings it back (shows the stored total). Unspent points are allowed (Next shows "(N unspent)"). Changing class rerolls.
4. **Name & confirm:** a random default ("Brother Aimery", …), editable (max 20; `<>&"` and backticks stripped), summary with portrait, stats and battle numbers, then **Begin ✠**. Back is available on every step, and the step tabs jump back to finished steps.

**Formula** (all in `CONFIG.creation`): battle stat = class base (`CONFIG.roles`) + team bonus (+6 HP, +1 DEF for Templars) + (stat − 10) × per-point, **rounded toward zero**. MOV/JUMP come from class only. SPD floor 3, HP floor 10.
| Stat | Per point from 10 | Status |
|---|---|---|
| Might | 0.5 ATK | active |
| Endurance | 1.5 HP | active |
| Fortitude | 0.5 DEF | active |
| Agility | 0.5 SPD | active |
| Aim | +2% hit, +0.5% crit (and −2% / −0.5% below 10) | **active**: added to the prediction box hit/crit and to real rolls |
| Resolve | +5% resist per point above 10; below 10 = 0% (`resistFloor: 0`, no penalty yet) | **active**: chance to shrug off Bash/Hook displacement (and its fall/slam damage), Pin and Feint's turn. Shows as "RESISTED" and in the ability preview ("may resist N%"). **Not Exposed**: Plunging Shot exposes the shooter itself, so resisting it would be a free buff |

**In battle:** the hero **replaces the Templar of the same class and keeps that unit's start tile** (a Scout hero takes slot 0, the knight's, since there's no Templar Scout). The hero's portrait shows in the unit info panel along with Hit/Res, and the hero's turn chip is outlined. Only the hero has rolled stats; other units are unchanged, and resist is only rolled when it's > 0, so the AI and sim stay deterministic.

**Saved** in `localStorage['outremer.hero']`: Play again / reload keep the hero; "New hero" on the title replaces it (Back on step 1 cancels and keeps the old one).

**Sim** (`HERO=avg|great|poor|roll node tools/sim.mjs 2000 all`, Templar win rate, knight hero):
| Hero | The Ridge | The Breach |
|---|---|---|
| none (v0.5 baseline) | 36.5% | 57.0% |
| average roll (11/10/11/10/11/10) | 38.5% | 57.0% |
| random 3d6 each battle | 44.9% | 39.9% |
| great (18/17/14/13/12/9) | 68.1% | 59.4% |
| poor (9/9/8/8/9/9) | 14.5% | 20.7% |
An average hero leaves balance where it was. A great roll is a big swing on The Ridge, which is more than the "+15–20%" target; watch this in playtests (knobs: `perPoint`). The sim is noisy because the AI is deterministic and small stat changes flip whole fights.

## Missions & recruitment (v0.8)
*Decided with Cletus:* companions join by **winning a specific mission**, not by *how* you win it ("how you win decides recruitment" is in the ROADMAP parking lot). The flow copies FFTA2's pub quest board.

**Flow**
1. **Title** (once a hero exists): **Mission board** (preselected) · **New hero**. With no hero the title is unchanged (Create your hero + the skirmish maps).
2. **Mission board:** three recruit missions with vague titles, then two skirmishes, then ◀ Back. Your squad shows at the top (hero + companion portraits).
   | Mission | Who it really is | Map |
   |---|---|---|
   | **A Templar in Need** | Brother Renaud (Knight) | The Breach: he holds the rubble of the breach (4,4) |
   | **Smoke at the Well** | Yusuf ibn Qasim (Scout) | The Ridge: he's in the middle, four raiders (incl. a Spearman) around him |
   | **Thief in the Baggage Train** | Wren (Scout) | **new map, The Baggage Train**: a raided column on the coast road with overturned carts (terrain *Cart*, height 1, cost 2) |
   | Skirmish: The Ridge / The Breach | — | the v0.5 battles, replayable; the board counts wins |
3. **Brief** (recruit missions only): a few lines of setup next to a **silhouette** portrait with "?", then Begin / Back. The name is never shown before the win.
4. **Battle:** your squad (hero + fielded companions + generic Templars, 3 units) **plus the stranger as an allied NPC**: on your side, **AI-controlled**, shown as an alias ("Lone Brother", "Lone Rider", "Small Figure") with a dashed **green ring** on the map, a green-bordered "?" chip in the turn strip and a "?" silhouette in the info panel. **They must survive**: if they fall it's a Defeat ("The lone brother has fallen. The mission is lost."). You lose as before when all your own units are down.
5. **Victory → join offer:** their real name, portrait, a short outro line and their trait (＋ pro / − con), then **Accept** or **Decline**.
   - **Accept:** they join the company (saved). If there's room in the squad they're fielded right away.
   - **Decline:** they leave. **The mission stays done** either way (✓ on the board, can't be replayed).
6. **Defeat** on a recruit mission: Try again / Mission board; the mission stays open.

**Party rules**
- **Squad size stays 3** (all maps deploy 3): hero + up to **2 companions** (`CONFIG.party.maxCompanions`), generic Templars fill the rest. The NPC in a recruit mission is a 4th unit on top.
- Slot order: the hero takes the Templar slot of their class (as in v0.6). Each companion then takes a remaining **generic** slot of their own class, else the first generic slot (which changes that slot's class). Example: Knight hero + Renaud (Knight) + Yusuf (Scout) replaces the Sergeant and the Archer.
- With 3 companions, one rests in camp: **tap a portrait on the board** to field / rest it. Fielding a third rests the one fielded earliest.
- **Saved** in `localStorage['outremer.party']`: companions (joined/declined, fielded) and mission progress. **New hero = new company**: creating a new hero clears the party and mission progress. Cancelling the wizard keeps everything.
- Companions use the **same six stats as the hero**, hand-set (`CONFIG.party.companions`), through the same formula (`deriveHero`). Their portraits are the pitch images, resized into `assets/companions/`. In battle they show their portrait and trait line in the unit info panel and their portrait in the turn strip (the hero's chip now shows the hero's bust too). Yusuf and Wren aren't Templars, so their sprites wear a plain sash instead of the red cross.

**Companion stats & traits** (simple trade-off versions of the [pitch doc](companions-pitch.md); every number in `CONFIG.party`):
| | Stats (MGT/END/FOR/AGI/AIM/RES) | Battle numbers | Trait: pro | Trait: con |
|---|---|---|---|---|
| **Brother Renaud**, Knight | 12/13/14/7/10/14 | HP 54, ATK 15, DEF 13, SPD 5, MOV 3, Res 20% | **Under the Rule:** +2 DEF while orthogonally next to another Templar (the hero, generic Templars, Renaud's fellow brothers), applied in every damage preview and roll | **Holds ground:** if he starts a move next to a foe, he may only end it on a tile that is still next to a foe (in `reachable`, so it applies to the AI too) |
| **Yusuf ibn Qasim**, Scout | 12/10/9/14/13/10 | HP 34, ATK 13, DEF 6, SPD 13, MOV 5, Hit +6% | **Turncoat's Eye:** during your turns, every raider within 4 tiles of him shows a dashed orange arrow to the unit it would strike if it acted now (the raider's real AI plan) | **Mercy:** he can't Attack or use an ability on a foe below 25% HP (filtered out of targets) |
| **Wren**, Scout | 9/6/6/16/12/8 | HP 28, ATK 12, DEF 4, SPD 14, MOV 6, Hit +4% | **Light Feet:** +1 MOV | **Frail** (low END/FOR: the lowest HP/DEF of any player unit) and **Skittish:** if she starts her turn next to 2+ foes she can't act that turn (Action greyed, "skittish"); she can still move |

**Simplified from the pitch (deviations):** Renaud's Shield Wall covering a 2nd ally, "never Waits with a foe in reach" and refusing camp with Yusuf are not in. Yusuf's intent display is a line to the target, not the exact move/ability. Wren's swap-with-an-ally, post-battle loot and the 2-tile auto-bolt are not in: Scouts already ignore rough terrain, so her terrain pro became +1 MOV, and her bolt became "can't act". The amulet is only flavour text.

**Allied NPC AI:** the NPC uses the normal scoring AI with its danger penalty ×30 (`CONFIG.ai.npcDangerMul`). With the normal weight the stranger charged in and died on their first turn (Yusuf: 99% of sims); this makes them keep their distance while you do the fighting.

**Sim** (AI vs AI, average knight hero, N = 2000, `HERO=avg node tools/sim.mjs 2000 missions`):
| Mission | Templar win | Stranger fell | Note |
|---|---|---|---|
| A Templar in Need | 58.8% | 5.2% | 19.9% stall at the 300-turn cap (Renaud holds ground, the AIs circle) |
| Smoke at the Well | 41.9% | 32.2% | |
| Thief in the Baggage Train | 69.7% | 9.8% | long fights (70 turns avg): Wren keeps away |
Fielded companions in skirmishes (`COMP=… HERO=avg`): The Breach 87–91% with Wren in the squad but 19.6% with Renaud + Yusuf; The Ridge 14–19% with a Knight hero, 28% with an Archer hero. The Ridge drop is mostly **squad shape**: companions replace the Sergeant and the Archer, and The Ridge rewards ranged units. The deterministic AI makes these numbers swing a lot. Playtests decide.

**Open questions**
- **Can a declined companion be recruited later** (e.g. found again at camp, or a second mission), or is Decline final? It's final for now.
- Should **how** you win matter (parking lot): e.g. Renaud only joins if no Templar falls, Yusuf if you spare a fleeing raider.
- Squad size: is 3 + NPC right, or should recruit missions let you field 4?
- Should the stranger take orders (FFTA2 guests are AI-only, as here)?

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

Base terrain: Grass 1, Road 1, Sand 2, Rock 2; on The Breach also Flagstone 1, Wall 1, Rubble 2 (Knight 3, Archer/Skirmisher 1). `CONFIG.terrain`, `CONFIG.roles[*].terrainCost`, `CONFIG.climbCostPerLevel` (0 for now).

**Difficulty knob:** `CONFIG.teams.player.statBonus` (currently HP +6, DEF +1 on Templars). With it, a greedy-AI-vs-greedy-AI headless sim wins ~43% for the Templars over 1000 runs (~25 turns); without it ~20% — the raiders start with the high ground. A human using flanks should do better. Retune once real playtests exist.

**Phone camera:** on narrow screens the map is zoomed 1.3× past fit-width; drag to pan, and the camera eases to follow the cursor (`CONFIG.view.zoom`, `zoomBelowWidthPx`, `camFollow`).

## Maps (v0.5)
Map data (size, heights, terrain, deployment) lives in [`src/maps.js`](../src/maps.js); terrain costs and colours stay in `src/config.js` (`CONFIG.terrain`, `palette.terrain`, `defaultMap`). Objective on both: defeat every enemy. No race modifiers on movement for now (a possible winged race with near-unlimited jump is in the ROADMAP parking lot).

| # | Map | Shape | What it tests |
|---|---|---|---|
| 1 | **The Ridge** (`ridge`) | Open hills, raiders on a height-2 ridge to the north, Templars below on grass/road. Sand and rock patches. | Fighting uphill; archers' height range; knights bogged in sand/rock. |
| 2 | **The Breach** (`breach`) | A ruined keep. Templars deploy west on open ground (small rubble mound, rocky rise in the south-west). A height-3 curtain wall runs north–south at x=4, broken by a 2-tile rubble **breach** (height 1). Behind it: a sunken flagstone courtyard (height 0), a ramp tile at (5,2) and a stair tower in the south-east climbing to height 4. | **JUMP decides the route.** Knights (JUMP 1) can only go through the breach chokepoint. Sergeants (2) can take the ramp and stairs. Archers and skirmishers (3) scale the wall from the ground and use it as a ledge. Flanks come from wall-top drops, height from the tower. |

**Choosing a map (phone-first, FFTA2 flow):** with no `?map=`, the game opens on a title card listing the maps. It works like the command menu: ▲▼ on the d-pad (or keys) moves the highlight, A starts, and a tap picks directly. The last map played is preselected (localStorage). The Victory/Defeat card offers **Play again / Next map: … / Choose map**, and B on Choose map goes back. `?map=breach` or `?map=2` skips the title. The header shows the current map name.

**Sim balance (`node tools/sim.mjs 3000 all`, AI vs AI, Templar win rate):** Ridge 0.37 (loss 0.61), Breach 0.57 (loss 0.43, stalls 0.1%). The first draft of The Breach was 0.01: the raider archer started on the height-4 tower and a raised courtyard gave the defenders +1 height in the breach. Only map data was nudged to fix it. The courtyard was lowered to 0 and the raider archer and skirmisher now start in the courtyard; no unit stats changed. The sim is very sensitive to single-tile spawn changes because the AI is deterministic, so treat these numbers as rough.

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

## Abilities (v0.4) — two per class, all about position
Every class gets two abilities that **make or punish a position**, not bigger numbers. Raiders use the same kit as their Templar counterpart (Swordsman = knight, Bowman = archer, Skirmisher has its own). All numbers live in `CONFIG.abilities`.

**Cost model: cooldowns, counted in the user's own turns.** An ability takes your Action (like Attack). After you use it, it's unavailable for the next *N* of your turns ("CD n" shows greyed in the Action menu and in unit info). We went with this over MP because it's one number per ability, easy to read on a phone, and keeps Attack the reliable default, so you're always choosing *when* to spend a cooldown. MP pools can come later with items or jobs (open question below).

| Class | Ability | What it does | CD | Why it's here |
|---|---|---|---|---|
| Knight / Swordsman | **Shield Bash** | Adjacent hit at ×0.6 that shoves the target 1 tile away from you. Off a ledge: +5 per level dropped. Into a wall or the map edge: +6. Into another unit: +6 to the target, +4 to the other unit. | 1 | Displacement. It turns cliffs, edges and crowds into damage and lets you pry a foe out of a flank. Its weak base damage means it only pays off when the terrain behind the target does. |
| Knight / Swordsman | **Shield Wall** | Stance until your next turn. Front damage ×0.5, and allies orthogonally next to you are *covered*: side and back hits on them count as front (flank bonuses still apply). **Trade-off:** MOV −1 on your next turn (Slowed). | 2 | Protects flanks and shapes a formation. It's the slow, heavy knight's answer to fast skirmishers, at the cost of tempo. |
| Sergeant | **Brace** | Stance until your next turn. The first foe that **voluntarily walks** into the 2 tiles in front of you (along the facing you pick at turn end, within height reach) is stopped there and takes an automatic full thrust. No prompt. | 1 | Zone control with no interrupts (pillar 1): you make the choice on your own turn and it resolves itself. The zone is always drawn on the map, so the enemy can read it and route around it. |
| Sergeant | **Hook** | Target exactly 2 tiles away in a straight line, ×0.5 damage. Pulls the target 1 tile toward you (up at most 1 level; drops deal fall damage). If the tile is blocked, there's no pull and no extra damage. | 2 | The inverse of Bash. Drags an archer off its perch or pulls a foe into your flankers. Fits the polearm's reach. |
| Archer / Bowman | **Pinning Shot** | ×0.6 damage. The target is Pinned for its next turn: MOV −2, JUMP ≤1. | 2 | Slows a fast unit (skirmisher, knight charge) so the formation can close or escape. It trades damage for tempo. |
| Archer / Bowman | **Plunging Shot** | Needs height advantage (≥1 level). +15% damage per level of advantage, and it **never counts as a front hit** (at least a side hit). **Trade-off:** the archer is Exposed (DEF −3) until its next turn. | 2 | Rewards taking and holding high ground and gets around a shield's facing, but leaves the archer vulnerable on its perch. |
| Skirmisher | **Feint** | Adjacent, ×0.4 damage. The target turns to face you. | 1 | Facing manipulation. Pin a foe's front toward you so an ally can hit its back next turn. |
| Skirmisher | **Vault Strike** | Leap over an adjacent foe to the empty tile behind it (within JUMP), then strike at ×0.8 from the landing tile, usually its back. Doesn't use your Move, so you can still walk away after. | 2 | Uses the skirmisher's high JUMP and gets behind a front line. Landing deep is the risk. |

Statuses show as letter pips above the HP bar (W/B/P/E/S) and as a line in unit info. Brace zones are drawn in orange on the map for both sides.

**Rules worth knowing**
- Only a *voluntary* walk triggers Brace. Shoves, pulls and vaults don't. A brace that triggers is used up. A move stopped by a brace can't be undone.
- Cover from Shield Wall changes the hit *side* only. Flank bonuses and height still apply.
- The vault landing must be in bounds, empty, and within the skirmisher's JUMP of its start height.

**UI flow (FFTA2):** Action → submenu lists **Attack** plus the class's two abilities (▲▼ on the pad; greyed with "CD n" or "no target" when unavailable). Targeting uses the map pad. The red tiles show the ability's reach, and orange tiles show where things will end up: the shove/pull destination, the vault landing, covered allies, the brace zone. The confirm box shows hit %, damage + extra (fall/slam), HP before→after, and plain-language effects. Stances target yourself. Brace sends you to the facing step so you can aim the zone.

**AI:** the planner considers every (tile × ability × target) next to plain attacks. Abilities are scored by what they set up: fall/slam damage, a shove or pull that ends next to one of its own units, pins on fast units, back/side exposure after a feint, landing danger after a vault, Exposed danger after a plunge. A damaging ability has to beat the best plain attack by `abilityMinGain`. Stances (Wall, Brace) compete with *repositioning*, not with attacks, so a knight doesn't stand still walling when it should advance. Paths that run into a visible brace zone are penalised (`wAvoidBrace`). If a brace stops the AI anyway, it re-plans from where it stands.

**Balance (AI-vs-AI sim, `node tools/sim.mjs 3000`, seeds 1..N):**
- Before abilities: Templar win rate **0.460** (loss 0.529, stalled 0.011, avg 28.6 turns).
- First ability pass: **~0.85**. The swing came almost entirely from Plunging Shot's original **+1 range**. It let archers duel from their spawn heights, and removing just that put the rate back near baseline (ablations: no enemy plunge → 0.41; plunge range 0 → 0.40).
- **Nudge:** Plunging Shot lost its +1 range (`rangeBonus: 0`). It still has the height requirement, the bonus per level, and the never-front rule. The Shield Wall/Brace AI was also re-scored as described above.
- After: **0.373** (loss 0.609, stalled 0.018, avg 26.4 turns). That's a bit harder than before, which is within "modest", so we left it. Stat bonuses are unchanged (Templars +6 HP / +1 DEF).
- How often the AI uses each ability per battle: Shield Wall ~1.9 per side, Plunging Shot (Raiders) 1.7, Vault Strike 1.0, Brace 0.6. Brace almost never *triggers*, because the AI routes around visible zones, so it works as area denial. Bash, Hook, Pin and Feint are rarely chosen by the AI. They need a specific setup (a ledge or a foe exactly 2 tiles away), and the AI's one-ply look-ahead undervalues them. They're there for players. Better AI use is a Stage 1 balance-pass item.

## Controls (v0.2 — modelled on FFTA2)
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
  | **Mission board, brief, join offer** (v0.8) | **vertical ▲ ▼ + A/B**, same as the title. They're short lists (≤ 6 rows), so they follow the list rule: ▲▼ move the highlight (the list scrolls with it), A takes the mission / Begins / Accepts, B goes back one screen (board → title, brief → board). On the **join offer B does nothing**: Accept/Decline is a real choice and shouldn't be skipped by a reflex B. Taps work everywhere. The squad portraits on the board are **tap-only** (field/rest); they're a side control, and adding them to the pad list would make it longer than it needs to be. The unit info panel is hidden while any list screen is up, so the list gets the room |
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
1. **Turn starts:** the camera and cursor go to the active unit, and the **command menu** opens (bottom-right of the field) with **Move / Action / Wait**. Move gets the default highlight, but nothing is auto-entered. ▲▼ move through the list; used commands are greyed and skipped.
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
- **Context-aware pad.** A DS has one physical d-pad that never changes. Ours is drawn on screen, so it changes shape to show what you can steer: ▲▼ in menus, the ▲▶▼◀ cross on the map and at turn end (the facing cross is gold, with the current facing lit), dimmed when there's nothing to steer. Cletus asked for this.
- **Cross mapping is fixed to the screen, rotated 45°.** The map is drawn in iso, so each straight arm stands for a diagonal screen direction: **▲ = up-right**, and the rest follow clockwise (▶ down-right, ▼ down-left, ◀ up-left). v0.2–v0.6 used a diagonal-quadrant pad so the arrows pointed exactly where the cursor goes. Cletus found that weird on a phone (v0.6 playtest) and preferred a classic cross with a consistent rotation. To bridge the gap, the facing step labels each map arrow with its button. Change the mapping in `controls.padCross`.
- **Live prediction while hovering.** FFTA2 shows the prediction after you select a target. We also show it while the cursor hovers a valid target, then show it again in the confirm step. The flow is the same; you just see the numbers sooner.
- **Tapping a target skips the hover step** (tap = select → confirm, tap again = execute). On tiles, tapping only moves the cursor, and a second tap confirms. FFTA2's battle stylus is one-touch, but its world map already uses touch-then-touch-again, and one-touch is exactly what failed in Cletus's playtest.
- **One screen, not two.** The DS top-screen info (unit under cursor, turn order) lives in the info panel and the turn-order strip. Tapping a chip replaces L/R cycling. There's no X system menu, Y help, laws, or clan privileges yet.
- **Free look via B, range via B-on-unit (toggle).** FFTA2 uses *hold B*. Holding a button is awkward on a touch screen, so it's a tap toggle.
- **Action submenu has only Attack.** No abilities or items exist yet, but the extra submenu step is kept so abilities slot in later.
- **No unit placement phase** (FFTA2 places units and picks their facing before battle); deployment is fixed in config.

### Tension with pillar 1
The explicit facing step is a "stop and press" moment, which pillar 1 argues against. We're keeping it because Cletus asked for FFTA2 controls first. It's one d-pad press + A, or two taps. **Open question:** revisit later. Options include defaulting the facing arrow to the most dangerous foe while still requiring A, or a setting.

## What's placeholder
- Hero portraits: 8 simple SVG busts marked PLACEHOLDER; art style still open.
- All art: procedural canvas shapes (shaded iso blocks, simple figures with team colors, Templar red cross on tunic/shield). No sound.
- Two hand-made maps, fixed deployment per map, no squad building beyond the created hero, no companions yet, two abilities per class only (no jobs/secondary sets), no items, no XP.
- Raider faction is a generic stand-in. Names are generic.
- AI is a one-ply greedy scorer.

## Open questions
- ~~Squad building~~ → replaced by one created hero + set companions (see Main character & party). Companion origins (Frankish knights, local Turcopoles, Armenian/Syriac allies?) remain a story question.
- Trade-off upgrades: armor weight ⇄ MOV/JUMP, shield ⇄ side-hit protection, banners that grant flank bonuses to nearby allies?
- Should facing protect more (e.g. shields block some front damage) to make flanking even more decisive?
- Reactions/zones of control vs. keeping turns snappy (pillar 1). v0.4 answer: only Brace, set on your own turn and resolved automatically. Should more reactions follow this pattern?
- Abilities: keep cooldowns, or move to MP once items/jobs exist? Should Shield Wall cover also cancel flank bonuses (it doesn't now)? Should shoves/pulls into a brace zone trigger it (they don't now)?
- Per-playthrough variety: procedural maps? random events? relic draft?
- Mythology layer: relics, saints' legends, djinn/desert folklore — when and how much?
- Permadeath or wounds?
- Should waiting (CT −60) be more visible as a tactic?
- Controls: keep the FFTA2 menu structure as abilities arrive (Action → job set / secondary set)? Is the end-of-turn facing step worth its press (see pillar-1 tension above)?
- Add L/R-style "next/previous unit" buttons, or are turn-order chips enough?
- Terrain beyond movement (cover, high ground for defense, water/marsh)?
