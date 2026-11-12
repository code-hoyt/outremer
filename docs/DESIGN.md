# Outremer — Design Notes (v0.13, slice + FFTA2 controls + context-aware cross pad + class abilities + 4 maps + hero creation + missions & recruitment + easier difficulty + ally personalities, softer height, reachable maps + Option B mini-campaign: open board, Chapel Ford finale, Chronicle + tap-vs-scroll and "Begin mission?" confirm + no ability cooldowns: built-in drawbacks only)

> **Roadmap / current stage:** see [ROADMAP.md](ROADMAP.md) (Stages 1–3 done; **now: Stage 4, the vertical slice**, see [SLICE-PLAN.md](SLICE-PLAN.md)). The agreed game is in [GAME-BRIEF.md](GAME-BRIEF.md) and [stage3-decisions.md](stage3-decisions.md). This file describes the **prototype as built (v0.13)**; the [Stage 3 decisions](#stage-3-decisions-what-changes-for-the-real-game) section below lists what changes.

Working title. Isometric tactics, FFTA/FFTA2 lineage, Knights Templar during the Crusades.
**Story is deliberately undecided.** Unit names are generic (Templar Knight, Sergeant, Turcopole Archer; Raider Swordsman / Skirmisher / Bowman) so nothing is locked in.

## Design pillars (from Cletus)
1. **No stop-and-press chores.** Avoid mechanics where the player must stop, press a button, then get back to work. Prefer systems that *emerge from choices the player is already making* (where you move, who you hit, from where).
2. **Customization, and every playthrough feels different.** Squad building, class mixes, and (later) variable maps/encounters.
3. **Trade-off upgrades over pure power.** An upgrade should change *how* a unit plays (e.g. heavier armor = tougher but shorter move / lower jump), not just make numbers bigger.
4. ~~Story later, with room for mythology.~~ **Mythology central from the start** (Stage 3 #10): relics and the uncanny drive the plot. The premise is written in a dedicated story session; told in-engine, FFTA2-style.
5. **Party building where classes move differently** (FFTA-style movement): class determines move, jump and terrain affinity. The party is your created hero plus set companions (BG-style), not a menu-built squad.
6. **Flanking and positioning are central** to combat.

## Stage 3 decisions: what changes for the real game
*Cletus, 2026-11-02. Full list: [stage3-decisions.md](stage3-decisions.md); brief: [GAME-BRIEF.md](GAME-BRIEF.md); build plan: [SLICE-PLAN.md](SLICE-PLAN.md).* The rest of this file still describes the v0.13 prototype; these override it where they differ.
- **Campaign:** ~5 chapters; each is a **mission tree** (chain, branch, companion-only and ability-unlock missions, multi-part missions across locations), mostly side missions, few recruit missions, a story finale. Replaces the v0.11 flat board where "beginning the finale closes the third mission".
- **Party:** squad of 3 all game, plus a few solo/duo story missions.
- **Companions:** **10**, about 2 per chapter, **all gettable in one run** (v0.11's "missed companion" is no longer the replay driver). Recruiting by how you win stays parked.
- **Hero growth:** fixed class (movement identity) + pick 1 of 2 branches at milestones + gear that teaches abilities you keep + one borrowed secondary skill set (movement stays yours). FFTA2-style XP leveling: level-ups only raise stats, gains vary by class, **stats 1–100, level cap 50**. New classes later: Physician, and a magic class with magic.
- **Between battles:** an FFTA2-style **world map** of nodes; party/equipment at any node; shops and missions only in towns; take a mission in town and travel to it; side jobs on the way; multi-part jobs can't return to town between parts. Replaces "full HP, no loot, no wounds" carry-over.
- **Wounds:** a fallen companion is Wounded for the next battle; the hero falling loses the battle.
- **Abilities:** no cooldowns (v0.13); build research fix 1 (forecast + tally) and fix 4 (deadly edges, non-kill goals). Rejected: attack-plus retune, frontal riposte, intent for everyone. Magic + MP later.
- **Story:** mythology central; premise still to be written (dedicated story session); scenes in-engine with sprites and portrait text boxes, no pre-rendered cutscenes.
- **Art / platform / tech:** 2D sprites on iso tiles, FFTA2-style portraits (by Tancred); battle sprites follow FFTA2: idle = walk-in-place (2 frames: left step, right step; made with Retro Diffusion from our stand frame), a separate stand frame for the unit's turn, and **weapons as their own sprite layer** drawn at a per-frame hand anchor during attacks, so body frames are always empty-handed (art test round 7, `CONFIG.artTest`, `docs/art-test/ffta2-sprite-anim-notes.md`); phone first + Steam with controller (Switch a stretch); TypeScript + a renderer (e.g. PixiJS), Capacitor, Tauri/Electron, keep the sim.

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

**Stat set (built in v0.6).** ⚠️ *Stage 3 #3: stats move to **1–100** with a **level cap of 50** (FFTA2-style XP leveling, stat-only level-ups, class-specific gains), so the 3–18 scale and rolls below get rebalanced in the slice ([SLICE-PLAN](SLICE-PLAN.md) M5).* Six rolled stats, each 3–18 (3d6), 10 is neutral. Each one feeds an existing combat number, so nothing new has to be learned in battle:

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
- ~~Stat ranges: 3–18?~~ → **1–100, level cap 50** (Stage 3 #3); how creation rolls and class minimums map to it is open (SLICE-PLAN M5).
- ~~Do companions use the same six stats?~~ Yes, hand-set (v0.8). Does the hero's class limit which companions want to join?
- ~~How are companions recruited?~~ v0.8: win their mission, then Accept/Decline; squad 3 (hero + 2), extras rest in camp (see Missions & recruitment). Still open: a bigger party cap later?
- ~~Can the main character die?~~ → **Wounds, not permadeath** (Stage 3 #5): a fallen companion is Wounded for the next battle; the hero falling = the battle is lost.
- ~~Portrait art style~~ → **FFTA2-style portraits, Final Fantasy-based art** (Cletus, v0.9), done at the art stage. → **a pre-made set of 8–12 hero portraits**, no builder (Stage 3 #7); Tancred makes the art.

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

## Missions & recruitment (v0.8, revised v0.9)
*Decided with Cletus:* companions join by **winning a specific mission**, not by *how* you win it ("how you win decides recruitment" is in the ROADMAP parking lot). The flow copies FFTA2's pub quest board.
*v0.9 (Cletus, after playtesting v0.8):* **no hidden identities.** Story will be a big part of some of these battles, so you should see who you're fighting for. The brief and the battle show the companion's real name and portrait. Mission titles stay vague. The post-win screen is just their join offer.

**Decision: squad of 3** (Cletus, v0.9): hero + 2. "Makes it feel like Mass Effect (in a good way)": a small, personal squad of named people rather than an army. Recruit missions add the person you're saving as a 4th, AI-controlled unit.

**Flow**
1. **Title** (once a hero exists): **Mission board** (preselected) · **New hero**. With no hero the title is unchanged (Create your hero + the skirmish maps).
2. **Mission board:** three recruit missions with vague titles, then two skirmishes, then ◀ Back. Your squad shows at the top (hero + companion portraits).
   | Mission | Who | Map |
   |---|---|---|
   | **A Templar in Need** | Brother Renaud (Knight) | The Breach: he holds the rubble of the breach (4,4) |
   | **Smoke at the Well** | Yusuf ibn Qasim (Scout) | The Ridge: he's in the middle, four raiders (incl. a Spearman) around him |
   | **Thief in the Baggage Train** | Wren (Scout) | **new map, The Baggage Train**: a raided column on the coast road with overturned carts (terrain *Cart*, height 1, cost 2) |
   | Skirmish: The Ridge / The Breach | — | the v0.5 battles, replayable; the board counts wins |
3. **Brief** (recruit missions only): their **portrait, name and class** next to a few lines of setup that name them, then Begin / Back. *(v0.8 hid them behind a "?" silhouette; dropped in v0.9.)*
4. **Battle:** your squad (hero + fielded companions + generic Templars, 3 units) **plus the companion-to-be as an allied NPC**: on your side, **AI-controlled**, under their **real name**, with a dashed **green ring** on the map, their portrait in a green-bordered turn-strip chip, and their portrait, name and trait line ("· Ally, must survive") in the info panel. **They must survive**: if they fall it's a Defeat ("Brother Renaud has fallen. The mission is lost."). You lose as before when all your own units are down.
5. **Victory → join offer:** their portrait, a short line in their voice and their trait (＋ pro / − con), then **Accept** or **Decline**.
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

**Allied NPC AI: in-character personalities (v0.10).** *Cletus, playtesting v0.9: "I don't like how the companion runs away during the battle. This should only happen if that's part of the companion's story or how the battle is supposed to play out. It makes no sense that the Templar runs away instead of running headlong into battle."* v0.8–v0.9 kept every ally alive by multiplying its danger penalty ×30 (`npcDangerMul`), so all of them hid. That knob is gone. Each companion now has an **AI personality** (`aiStyle` on the companion; a mission can override it with `npcAi`), defined in `CONFIG.ai.personalities`:

| Personality | danger × | approach × | other | Who | Why |
|---|---|---|---|---|---|
| `steady` | 1 | 1 | — | raiders, default | the normal scoring AI |
| `aggressive` | 0.3 | 2 | `stance` 0.2 (rarely stops to Shield Wall) | **Renaud** | an old Templar: charges in |
| `wary` | 3 | 1 | `rally` 2 (−2 per tile from the nearest squad member) | **Yusuf** | a wounded raider who fights, but from safer tiles and falls back on you |
| `evasive` | 25 | 0.3 | — | **Wren** | a thief: keeps out of reach and strikes only when it's safe. Her hiding *is* her story, so it stays |

Fleeing or hiding happens only where it's the companion's story (Wren) or a mission sets `npcAi`. Ally deaths are kept rare by other means:
- **Toughness:** the ally's max HP × `CONFIG.difficulty.npcHpMul` (1.25) × the mission's own `npcHpMul` (Smoke at the Well: 1.2, **1.4 since v0.11**, because Yusuf starts in the middle of his old band).
- **Enemy targeting weight:** raiders value hitting the ally at ×0.25 (`npcTargetMul`). Since v0.10 that also scales the flat +100 "I can attack" head of the score, so a raider with your squad in reach really does pick your squad.
- **Separate HP and ATK trims:** `byBattle` can set `{ hp, atk }`, so a recruit battle gets tougher raiders who don't hit the ally harder (see Difficulty).
- **Path-aware approach (all AI units):** units used to approach by straight-line distance, so Renaud pressed against the foot of the wall under an archer. Now the "move toward the foe" pull uses the **walking cost** (terrain, height, JUMP) to the nearest tile they could attack from. He walks round to the stairs.

How the ally behaves (sim, `HUMAN=1`, N = 2000; attacks per ally turn, average distance to the nearest raider):
| Ally (mission) | v0.9 | **v0.10** |
|---|---|---|
| Renaud (A Templar in Need) | 0.00–0.13 attacks/turn, 4.8–5.7 tiles away | **0.52–0.53 attacks/turn, 2.4–2.5 tiles** |
| Yusuf (Smoke at the Well) | 0.01–0.09, 5.6–7.4 tiles | **0.50–0.62, 3.1–3.8 tiles** |
| Wren (Baggage Train) | 0.02, 5.9–6.0 tiles | 0.02–0.03, 6.8–7.1 tiles (evasive by design) |

Losing because the ally fell stays rare: at most 7.4% of battles (Smoke at the Well + Renaud). It was ≤ 5.4% in v0.9, when the allies hid.

**Open questions**
- **Can a declined companion be recruited later** (e.g. found again at camp, or a second mission), or is Decline final? It's final for now.
- Should **how** you win matter (parking lot): e.g. Renaud only joins if no Templar falls, Yusuf if you spare a fleeing raider.
- ~~Squad size~~ → **3** (hero + 2), decided v0.9 (Mass Effect feel). The recruit-mission NPC stays a 4th, AI-only unit.
- Should the stranger take orders (FFTA2 guests are AI-only, as here)?

## Campaign (v0.11): open board, finale after 2
*Cletus picked **Option B** of the [campaign pitch](campaign-pitch.md) ("Let's go with b").* Everything else in the pitch's open-decisions list was left to the dev. Those decisions are marked **(default)**: the dev chose the pitch's recommended answer, and Cletus should revisit them after a playtest. All numbers are in `CONFIG.campaign`.

**Decisions**
| # | Question | Decision | Who |
|---|---|---|---|
| 1 | Option A or B | **B:** open board, the 3 recruit missions in any order, then a finale | Cletus |
| 2 | Finale unlock | after **2** recruit wins (`finaleAfterWins`; Accept or Decline both count) | (default) |
| 3 | Does the finale close the leftover mission? | **Yes** (`closeLeftoverOnFinale`). Beginning the finale marks the open recruit mission ✗ Closed, and that companion is *missed*. The brief warns you first | (default) |
| 4 | Finale map | new **The Chapel Ford** (passes `tools/reach.mjs`) | (default) |
| 5 | What persists | **party + story flags** (who joined / declined / was missed, the order you won in, losses). Full HP every battle, no wounds, no loot | (default) |
| 6 | Losing | Defeat offers **Retry / Back to board**, no penalty (the board counts losses for the Chronicle) | (default) |
| 7 | Missed-companion effects | **in, modest** (see below). They also apply to a companion you *declined*, as in the pitch: they aren't at the ford either way | (default) |
| 8 | Ending | **stays a mystery:** the reliquary is empty but warm. If Wren is fielded, her amulet hums and something hums back (the mythology door, left shut) | (default) |
| 9 | Names | the Red Captain, the Chapel Ford and the reliquary stay **placeholders** | (default) |
| 10 | Ingvar | **after Stage 2** (not a 4th recruit mission) | (default) |
| 11 | Difficulty step | small **step by recruit wins** (`stepByWins` [1, 1.03, 1.06, 1.09], raider HP ×) | (default) |
| 12 | Skirmishes | stay on the board, replayable; they don't count toward the finale | (default) |

**Flow**
1. **Board:** the 3 recruit missions, then the finale item, then the 2 skirmishes. The finale shows "🔒 The Chapel Ford · Win N more" until unlocked, then ★, then ✓. A won recruit mission shows its **clue** ("Clue: …"). A closed one shows "✗ … Closed · *Name* was missed".
2. **Recruit briefs vary by clues:** each recruit mission has a `clue`, plus a line per *other* mission already won (`clueLines`) that ties it to the same band. Example: once Wren is rescued, Renaud's brief mentions the reliquary she saw the raiders carry off.
3. **Finale brief:** the intro, the clues you've found, one line per fielded companion (their payoff), one line per companion not in your company (what it costs), and, if a recruit mission is still open, a warning that Begin will close it.
4. **The Chapel Ford:** win by bringing down **the Red Captain** (a raider Knight, ×1.5 HP, +1 ATK, +1 DEF, red ring). When he falls his band breaks: Victory, even with raiders left. You can also win by routing everyone.
5. **Ending → Chronicle:** the ending text (plus the Wren line if she was there, plus a line from each fielded companion). Then the **Chronicle**, a local log of finished runs (`localStorage['outremer.chronicle']`, newest first, max 20). Each entry has the hero, class, squad, missed companions, the order you won in and losses. From there: **Roll a new hero** (a fresh campaign; the Chronicle is kept) or **Back to board**. The title gets a Chronicle item too.

**Companion payoffs in the finale (fielded)**
- **Renaud: Shaken.** While Renaud is next to the Captain (orthogonally), the Captain is Shaken: −20% hit and ×0.9 damage on his strikes. This shows in the prediction ("Shaken −20% hit") and in the status line. *Deviation:* the pitch's "counter" became a hit/damage penalty, because there's no counter system.
- **Yusuf: the Captain's intent from anywhere.** His Turncoat's Eye arrow for the Captain shows map-wide, not just within 4 tiles.
- **Wren: the reliquary and the shortcut.** She marks the reliquary tile (7,1) with a pulsing ✦. She also adds **stepping stones** at (3,1),(4,1) across the north shallows (Stairs terrain, cost 1). *Deviation:* the pitch called this a "stair shortcut". The reliquary's hum stopping when someone stands on it is not in.

**Missed / declined companions in the finale (modest)**
- **Renaud:** the Captain carries Renaud's sword: **+1 ATK**.
- **Yusuf:** no deserter split the band: **one more Raider Bowman** on the hill (6,6).
- **Wren:** a raider urchin knows the side door: **one more Skirmisher arrives on round 3** at (7,4), with a banner. A round is as many turns as there are units at the start.

**Not built / deviations:** the finale keeps the squad of 3 (hero + 2), so with 3 companions one sits out, as usual. Yusuf's map-wide intent and Wren's marker are UI only; the sim doesn't model them.

## Difficulty (v0.9, retuned v0.10)
*Cletus, playtesting v0.8: "Feels like I'm getting totally destroyed."* He mostly uses basic attacks. Target: **~65–75% Templar wins** in every battle with a typical party, erring easy.

**Knobs** (`CONFIG.difficulty`, all global, applied to every enemy when the battle starts):
| Knob | v0.8 | v0.9 | What |
|---|---|---|---|
| `enemyHpMul` | 1 | **0.85** | raider HP × (rounded) |
| `enemyAtkMul` | 1 | **0.85** | raider ATK × (rounded) |
| `enemyDefAdd`, `enemySpdAdd` | 0 | 0 | flat DEF / SPD (unused; there if needed) |
| `npcTargetMul` | 1 | **0.25** | how much raiders want to hit the recruit-mission ally (AI score ×) |
| `byBattle` | — | Ridge **1.02**, Breach **0.90**, Templar in Need **0.91**, Smoke at the Well **1.03**, Baggage Train **1.15** | per-battle trim on top (× raider HP and ATK), keyed by mission id or skirmish map id |
**v0.10 retune:** the height nerf, the Breach stairs, the path-aware AI and the fighting allies made every battle easier (untuned, basic-attack sim: Ridge 76–99%, Breach 91–99%, Templar in Need 98–99%). The trims went back up. `byBattle` now also accepts `{ hp, atk }` to scale raider HP and ATK separately; recruit battles use it so raiders are tougher without killing the ally faster. New knob: `npcHpMul` **1.25** (ally toughness; × the mission's `npcHpMul`).
| `byBattle` | v0.9 | **v0.10** |
|---|---|---|
| The Ridge | 1.02 | **1.13** |
| The Breach | 0.90 | **HP 1.4, ATK 1.12** |
| A Templar in Need | 0.91 | **HP 1.6, ATK 1.15** |
| Smoke at the Well | 1.03 | **HP 1.6, ATK 1.25** (+ Yusuf ×1.2 HP) |
| Baggage Train | 1.15 | **1.2** |

*(v0.9 text:)* So a Raider Swordsman (HP 44, ATK 14) is 38/12 on The Ridge, 34/11 on The Breach, 43/14 in the Baggage Train. No enemy was removed and no unit was hand-edited: the global ×0.85 does most of the work, the per-battle trim evens the maps out (the Baggage Train was easy, The Breach hard). Because stats are rounded, a small knob change can jump (e.g. The Ridge: ×1.01 → 86–96%, ×1.02 → 64–74%, because a Raider Bowman's ATK goes 9 → 10).

**New sim model: `HUMAN=1`.** The old sim plays both sides with the full AI (abilities, perfect choices), which is better than a player who mostly attacks. `HUMAN=1 node tools/sim.mjs` makes the **player squad** use **basic attacks only** and pick with a little noise (±6 score points, `PLAYER_NOISE`). The ally NPC and the raiders are unchanged. This is the main target; full-AI numbers are kept for comparison. Noise also smooths out the deterministic-AI cliffs.

**Results** (average Knight hero, N = 2000; win% / ally-fell%):
| Battle | Party | v0.8 basic-attack | **v0.9 basic-attack** | v0.8 full AI | v0.9 full AI |
|---|---|---|---|---|---|
| The Ridge | hero + Templars | 25.5 | **70.9** | 39.7 | 62.7 |
| | + Renaud, Yusuf | 23.4 | **65.2** | 17.6 | 67.6 |
| | + Renaud, Wren | 11.9 | **73.4** | 13.6 | 63.9 |
| | + Yusuf, Wren | 35.3 | **66.2** | 18.7 | 62.4 |
| The Breach | hero + Templars | 50.2 | **78.4** | 55.5 | 97.9 |
| | + Renaud, Yusuf | 18.3 | **64.4** | 20.2 | 86.8 |
| | + Renaud, Wren | 46.7 | **74.1** | 88.1 | 99.4 |
| | + Yusuf, Wren | 53.0 | **98.3** | 91.1 | 100 |
| A Templar in Need | hero + Templars | 26.7 / 54.0 | **61.6 / 0.3** | 55.9 / 5.3 | 98.1 / 0.1 |
| | + Yusuf | 66.5 / 4.3 | **80.5 / 0** | 19.1 / 3.3 | 90.1 / 0.3 |
| | + Yusuf, Wren | 51.6 / 15.2 | **64.6 / 0.1** | 32.1 / 0.8 | 51.8 / 0.2 |
| Smoke at the Well | hero + Templars | 29.2 / 17.7 | **65.8 / 5.4** | 41.7 / 31.4 | 82.6 / 8.7 |
| | + Renaud | 35.0 / 25.5 | **85.4 / 1.8** | 18.3 / 44.4 | 72.1 / 5.9 |
| | + Renaud, Wren | 3.4 / 7.0 | **56.9 / 0.3** | 3.6 / 1.9 | 51.5 / 0.4 |
| Baggage Train | hero + Templars | 66.7 / 2.8 | **66.6 / 0.6** | 68.5 / 9.9 | 70.6 / 0.3 |
| | + Renaud | 79.0 / 5.6 | **81.4 / 1.3** | 39.6 / 1.2 | 38.9 / 0.6 |
| | + Renaud, Yusuf | 73.3 / 4.4 | **75.0 / 1.1** | 70.6 / 0.5 | 76.0 / 0.2 |
(v0.8 full-AI column: N = 1000.)

**v0.10 results** (same setup, N = 2000; win% / ally-fell%):
| Battle | Party | v0.9 basic-attack | **v0.10 basic-attack** | v0.9 full AI | v0.10 full AI |
|---|---|---|---|---|---|
| The Ridge | hero + Templars | 70.9 | **83.5** | 62.7 | 85.1 |
| | + Renaud, Yusuf | 65.2 | **60.0** | 67.6 | 44.5 |
| | + Renaud, Wren | 73.4 | **65.8** | 63.9 | 42.2 |
| | + Yusuf, Wren | 66.2 | **65.3** | 62.4 | 41.5 |
| The Breach | hero + Templars | 78.4 | **60.8** | 97.9 | 69.7 |
| | + Renaud, Yusuf | 64.4 | **76.0** | 86.8 | 97.4 |
| | + Renaud, Wren | 74.1 | **73.2** | 99.4 | 99.2 |
| | + Yusuf, Wren | 98.3 | **76.6** | 100 | 89.0 |
| A Templar in Need | hero + Templars | 61.6 / 0.3 | **72.4 / 4.2** | 98.1 / 0.1 | 88.5 / 3.4 |
| | + Yusuf | 80.5 / 0 | **68.3 / 4.8** | 90.1 / 0.3 | 36.7 / 2.3 |
| | + Yusuf, Wren | 64.6 / 0.1 | **69.5 / 4.3** | 51.8 / 0.2 | 19.3 / 0.1 |
| Smoke at the Well | hero + Templars | 65.8 / 5.4 | **94.2 / 2.9** | 82.6 / 8.7 | 97.4 / 1.2 |
| | + Renaud | 85.4 / 1.8 | **85.0 / 7.4** | 72.1 / 5.9 | 86.1 / 7.6 |
| | + Renaud, Wren | 56.9 / 0.3 | **74.9 / 6.6** | 51.5 / 0.4 | 68.3 / 25.0 |
| Baggage Train | hero + Templars | 66.6 / 0.6 | **72.6 / 0** | 70.6 / 0.3 | 44.1 / 0.4 |
| | + Renaud | 81.4 / 1.3 | **79.8 / 0** | 38.9 / 0.6 | 65.2 / 0 |
| | + Renaud, Yusuf | 75.0 / 1.1 | **69.5 / 1.8** | 76.0 / 0.2 | 93.3 / 0 |

**Basic-attack model: mean 72.3% → 73.4%, range 57–98% → 60–94%; worst ally-fell 5.4% → 7.4%.** The Breach no longer swings 64–98% by squad. Smoke at the Well stays the easiest battle (75–94%): pushing it harder mainly made Yusuf die more, because there harder means longer and he is in the thick of it. Full AI (both sides use abilities): mean 74.8% → 68.7%. It swings more (A Templar in Need + Yusuf 19–37%, Smoke + Renaud + Wren 25% ally deaths). The full AI is a comparison only; the basic-attack model is the target.

*(v0.9 notes:)* **Basic-attack model: mean 41% → 72%, range 3–79% → 57–98%.** Hero alone with other classes (basic-attack, v0.9): Sergeant or Archer hero 62–79% everywhere. **Scout hero is the outlier:** 22% on Smoke at the Well, 95–99% on The Breach / Templar in Need. A Scout hero takes the Knight's slot (there's no Templar Scout), so that squad has no Knight. Still swingy: Breach + Yusuf/Wren 98%, Smoke + Renaud/Wren 57%. Composition matters (companions replace the Sergeant and Archer), and that's for playtests to judge. Retune with `HUMAN=1 HERO=avg COMP=… node tools/sim.mjs 2000 <map|mission id|all|missions>`; `DIFF='{"enemyAtkMul":0.9}'` overrides knobs for a run.

### v0.11: squad trims and the campaign step
With the open board, any companion can be in your squad for any battle, and the finale can have any 2 of them. In the basic-attack sim (`HUMAN=1 HERO=avg`), a fielded Yusuf or Wren made a battle *harder*, not easier: Scouts are frail, and they fall in nearly every battle. Wren replaces the Sergeant. So v0.10's per-battle trims spread from 6% to 84% across squads. v0.11 adds:
- **`bySquad`:** an enemy-HP trim per battle per exact squad (`''` = hero + Templars). Finale keys add `/` and the companions not in your company (missed or declined), because those change the fight. `byCompanion` (Renaud 1, Yusuf 0.93, Wren 0.82, multiplied) is the fallback for any squad not in the table. Each entry was fitted by bisection and then checked at N = 2000.
- **`CONFIG.campaign.stepByWins`:** [1, 1.03, 1.06, 1.09] raider HP × by recruit wins so far. *Deviation:* this is only a small step. The sim found companions no stronger than the generic Templars they replace, so a bigger step would have punished progress.
- **HP only:** the step and the squad trims scale HP, not ATK. One point of rounded ATK made 15–25-point cliffs.
- Smoke at the Well's ally toughness went from `npcHpMul` 1.2 to 1.4, because Yusuf fell in 14–17% of battles once the raiders were tougher.
- The finale's `byBattle` is 0.98. The Captain is ×1.5 HP, +1 ATK, +1 DEF on top.

**v0.11 results** (`HUMAN=1 HERO=avg`, N = 2000; win% / ally-fell%; the step uses the battle's place in a run, i.e. wins = companions fielded; finale = 2 or 3 wins):
| Battle | Squad | Win % / ally fell % |
|---|---|---|
| The Ridge (skirmish) | hero + Templars | **72.6** |
|  | + Renaud | **71.1** |
|  | + Yusuf | **65.0** |
|  | + Wren | **68.9** |
|  | + Renaud, Yusuf | **72.8** |
|  | + Renaud, Wren | **66.4** |
|  | + Yusuf, Wren | **66.6** |
| The Breach (skirmish) | hero + Templars | **70.3** |
|  | + Renaud | **71.0** |
|  | + Yusuf | **72.3** |
|  | + Wren | **70.8** |
|  | + Renaud, Yusuf | **71.3** |
|  | + Renaud, Wren | **69.3** |
|  | + Yusuf, Wren | **69.1** |
| A Templar in Need | hero + Templars | **69.3** / 4.4 |
|  | + Yusuf | **71.9** / 4.1 |
|  | + Wren | **71.9** / 3.3 |
|  | + Yusuf, Wren | **69.9** / 4.3 |
| Smoke at the Well | hero + Templars | **70.7** / 6.7 |
|  | + Renaud | **69.6** / 7.8 |
|  | + Wren | **72.6** / 10.7 |
|  | + Renaud, Wren | **70.3** / 6.6 |
| Baggage Train | hero + Templars | **68.5** |
|  | + Renaud | **70.6** / 0.1 |
|  | + Yusuf | **70.4** / 0.1 |
|  | + Renaud, Yusuf | **69.8** / 1.8 |
| The Chapel Ford (finale) | + Renaud, Yusuf (all 3 recruited) | **70.8** |
|  | + Renaud, Yusuf (Wren missed) | **70.5** |
|  | + Renaud, Wren (all 3 recruited) | **70.3** |
|  | + Renaud, Wren (Yusuf missed) | **71.4** |
|  | + Yusuf, Wren (all 3 recruited) | **72.7** |
|  | + Yusuf, Wren (Renaud missed) | **67.7** |
| | + Renaud only (other recruit declined, 3rd missed) | **73.9** |
| | + Yusuf only (other recruit declined, 3rd missed) | **69.7** |
| | + Wren only (other recruit declined, 3rd missed) | **72.4** |
| | hero + Templars (both declined, 3rd missed) | **70.6** |

**All 36 cells: 65.0–73.9% wins (mean 70.4%). Ally fell ≤ 10.7%** (Smoke at the Well + Wren; every other cell ≤ 7.8%). Every finale win in the sim ends with the Captain falling. **Watch in playtests:** a fielded Yusuf or Wren is knocked out in 74–100% of sim battles (Renaud 30–39%). A companion going down isn't a loss, but the basic-attack model plays the Scouts badly (no use of their MOV, Vault or Feint). If a human keeps them alive, the Wren and Yusuf trims will feel easy. Retune with `tools/sim.mjs`: `MISSED=`, `WINS=`, `HKMUL=` (HP-only scale), `BYSQUAD='{...}'`, `STEP='[...]'`, `DEATHS=1`; map arg `chapel-ford` for the finale.

**v0.13 retune (no cooldowns).** Removing cooldowns changes how the *raiders* fight (they can use any ability every turn; Pin now plants them; the repeat penalty), so the basic-attack sim moved: untuned, the 36 cells spread to **40.8–85.5%** at N = 1000 (Ridge + Renaud 81%, Ridge + Renaud + Yusuf 86%, Chapel Ford + Renaud + Yusuf 41–43%, Smoke + Renaud 45% with the ally falling 30%). Eleven `bySquad` entries were refitted (HP only; Ridge `renaud`, `renaud+yusuf`, `renaud+wren`; Breach `renaud+wren`; Smoke `renaud`; Chapel Ford `renaud+yusuf`, `renaud+yusuf/wren`, `renaud+wren/yusuf`, `renaud/wren+yusuf`, `wren/renaud+yusuf`, `/renaud+wren+yusuf`). **Result (`HUMAN=1 HERO=avg`, N = 2000): 35 of 36 cells at 65.2–73.7%, mean 70.0%.** The exception is the finale with no companions (both declined, third missed) at **75.6%**: its win rate jumps 75.6 → 64.7 on a 1-HP rounding step, with no setting in between, so it sits on the easy side. **Watch:** Smoke at the Well + Renaud's ally fell rate is **15.9%** (was 7.8%); every other cell ≤ 10.8%. Full-AI comparison: mean 67.9% → 69.1%, still very swingy (21–100%).

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
| 2 | **The Breach** (`breach`) | A ruined keep. Templars deploy west on open ground (small rubble mound, rocky rise in the south-west). A height-3 curtain wall runs north–south at x=4, broken by a 2-tile rubble **breach** (height 1). Behind it: a sunken flagstone courtyard (height 0) and a stair tower in the south-east climbing to height 4. **v0.10: stone stairs** (terrain `t`, cost 1, one level per step) climb the wall from both sides: west (3,2)→(3,1)→ wall (4,1) and (3,5)→(3,6)→ wall (4,6); east (6,2)→(5,2)→ wall (4,2), (7,2)→(7,1)→ north tower (7,0), (5,5)→(5,6)/(6,5)→ south tower. | The breach is still the short way in, but **the wall can be contested by anyone.** A Knight (JUMP 1) walks up the west stair and fights an archer on the wall-walk. Archers and skirmishers (JUMP 3) can still scale the wall from the ground. Flanks come from wall-top drops, height from the tower. |
| 3 | **The Baggage Train** (`baggage`, mission only, v0.8) | A raided column on the coast road with overturned carts (terrain *Cart*, height 1, cost 2). See Missions & recruitment. | Wren's recruit mission. |
| 4 | **The Chapel Ford** (`ford`, finale only, v0.11) | 8×8. A shallow river (terrain *Shallows*, cost 2) runs north–south at x = 3–4, crossed by one stone ford (road) on rows 3–4. Open west bank. On the east bank the ground rises to a ruined chapel (height 2–3), climbed by stairs on the north and south flanks and a road ramp in the middle. The Red Captain waits at (7,3), the reliquary is at (7,1). When Wren is fielded she adds stepping stones (Stairs) at (3,1),(4,1). Passes `tools/reach.mjs`, with and without the stones. | Crossing under fire: the ford is the fast, exposed way over, the shallows the slow one. Then the hill. A 'kill the leader' objective, so a rush at the Captain is a real alternative to clearing the field. |

### Map rule: everywhere is reachable (v0.10)
*Cletus, playtesting v0.9: "the higher areas like on the wall are unreachable for many units, causing the archer to have total dominance across the map. We need to make sure in map balance that every location is reachable within reason… some rule like 'everywhere reachable by someone with at least 2 move and 2 jump'."*

**Rule:** every walkable tile on every map must be reachable from every other tile by a **MOV 2 / JUMP 2** unit. Several turns are fine; terrain costs and height count. We also hold maps to **JUMP 1**, because the v0.9 Breach passed the 2/2 rule (sergeants could hop up) but cut off 17 tiles (the walls and towers) from Knights, and the Knight is exactly the unit that has to go up and fight the archer. Each real class (its own MOV, JUMP and terrain costs) is checked too.
- **Validator:** [`tools/reach.mjs`](../tools/reach.mjs) (`node tools/reach.mjs`). It checks strong connectivity with a forward and a reverse search: a step is legal if the height change ≤ JUMP and the tile's entry cost (+ `climbCostPerLevel` per level up) ≤ MOV. A tile that costs more than MOV to enter (e.g. Knight in rubble at MOV 2) counts as cut off. The rules live in `CONFIG.mapRules`. It exits 1 and lists the cut-off tiles if a map fails, and it runs in the test suite (`outremer-test/reach.mjs`, which also checks that the old Breach is caught). v0.10: **all 3 maps, 64/64 tiles, every rule and class.**
- **Designing maps:** to raise ground by more than 1 level, put a stair or ramp tile (one level per step) somewhere, on both sides of a wall that both teams should be able to contest.

**Choosing a map (phone-first, FFTA2 flow):** with no `?map=`, the game opens on a title card listing the maps. It works like the command menu: ▲▼ on the d-pad (or keys) moves the highlight, A starts, and a tap picks directly. The last map played is preselected (localStorage). The Victory/Defeat card offers **Play again / Next map: … / Choose map**, and B on Choose map goes back. `?map=breach` or `?map=2` skips the title. The header shows the current map name.

**Sim balance (`node tools/sim.mjs 3000 all`, AI vs AI, Templar win rate):** Ridge 0.37 (loss 0.61), Breach 0.57 (loss 0.43, stalls 0.1%). The first draft of The Breach was 0.01: the raider archer started on the height-4 tower and a raised courtyard gave the defenders +1 height in the breach. Only map data was nudged to fix it. The courtyard was lowered to 0 and the raider archer and skirmisher now start in the courtyard; no unit stats changed. The sim is very sensitive to single-tile spawn changes because the AI is deterministic, so treat these numbers as rough.

## Facing, flanking & positioning
- Every unit has a **facing** (N/E/S/W, shown as a ground arrow wedge and in the info panel).
- Hits are classed by where the attacker stands relative to the target's facing: **Front / Side / Back**.
  - Damage: Front ×1.0, **Side ×1.25, Back ×1.5**
  - Hit chance: Front 80%, **Side 90%, Back 100%**
- **Flanking (pincer):** +15% damage per *other* ally adjacent to the target (max 2). Emerges from positioning — no extra button.
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

## Abilities (v0.4) — two per class, all about position
Every class gets two abilities that **make or punish a position**, not bigger numbers. Raiders use the same kit as their Templar counterpart (Swordsman = knight, Bowman = archer, Skirmisher has its own). All numbers live in `CONFIG.abilities`.

**Cost model (v0.13, Cletus 2026-11-02): no cooldowns, no generic cost.** An ability takes your Action (like Attack) and is usable every turn. Its only cost is a **drawback built into what it does** (Cletus's example: "you smash into the ground and now you're stuck in the ground for a turn"). Most abilities already pay for themselves with weak base damage or by giving up the attack (stances), so only two needed a new drawback. All values live in `CONFIG.abilities` (`noMoveBefore`, `noMoveAfter`, `slowNextTurn`, `exposedDefPenalty`). **Magic and MP come later** (parked); when they do, MP is for spells and these physical abilities stay free.

*(v0.4–v0.12 used per-ability cooldowns of 1–2 turns, shown as "CD n". Cletus didn't like them; they were removed in v0.13.)*

| Class | Ability | What it does | Built-in drawback (v0.13; old CD) | Why it's here |
|---|---|---|---|---|
| Knight / Swordsman | **Shield Bash** | Adjacent hit at ×0.6 that shoves the target 1 tile away from you. Off a ledge: +5 per level dropped. Into a wall or the map edge: +6. Into another unit: +6 to the target, +4 to the other unit. | None: ×0.6 damage only pays off when the terrain behind the target does (was CD 1) | Displacement. It turns cliffs, edges and crowds into damage and lets you pry a foe out of a flank. Its weak base damage means it only pays off when the terrain behind the target does. |
| Knight / Swordsman | **Shield Wall** | Stance until your next turn. Front damage ×0.5, and allies orthogonally next to you are *covered*: side and back hits on them count as front (flank bonuses still apply). **Trade-off:** MOV −1 on your next turn (Slowed). | **Slowed:** MOV −1 on your next turn (kept; was CD 2). A stance, so no attack either | Protects flanks and shapes a formation. It's the slow, heavy knight's answer to fast skirmishers, at the cost of tempo. |
| Sergeant | **Brace** | Stance until your next turn. The first foe that **voluntarily walks** into the 2 tiles in front of you (along the facing you pick at turn end, within height reach) is stopped there and takes an automatic full thrust. No prompt. | None: a stance, so you give up the attack, and the zone is visible (was CD 1) | Zone control with no interrupts (pillar 1): you make the choice on your own turn and it resolves itself. The zone is always drawn on the map, so the enemy can read it and route around it. |
| Sergeant | **Hook** | Target exactly 2 tiles away in a straight line, ×0.5 damage. Pulls the target 1 tile toward you (up at most 1 level; drops deal fall damage). If the tile is blocked, there's no pull and no extra damage. | None: ×0.5 damage, needs a foe exactly 2 tiles away, and a pulled foe ends next to you (was CD 2) | The inverse of Bash. Drags an archer off its perch or pulls a foe into your flankers. Fits the polearm's reach. |
| Archer / Bowman | **Pinning Shot** | ×0.6 damage. The target is Pinned for its next turn: MOV −2, JUMP ≤1. | **New: Planted.** A steady aimed shot: only if you haven't moved this turn, and you can't move after (`noMoveBefore`). Stops an archer walking back and pinning the same foe every turn (was CD 2) | Slows a fast unit (skirmisher, knight charge) so the formation can close or escape. It trades damage for tempo. |
| Archer / Bowman | **Plunging Shot** | Needs height advantage (≥1 level). +15% damage per level of advantage, and it **never counts as a front hit** (at least a side hit). **Trade-off:** the archer is Exposed (DEF −3) until its next turn. | **Exposed:** DEF −3 until your next turn (kept; was CD 2) | Rewards taking and holding high ground and gets around a shield's facing, but leaves the archer vulnerable on its perch. |
| Skirmisher | **Feint** | Adjacent, ×0.4 damage. The target turns to face you. | None: ×0.4 damage, pure setup (was CD 1) | Facing manipulation. Pin a foe's front toward you so an ally can hit its back next turn. |
| Skirmisher | **Vault Strike** | Leap over an adjacent foe to the empty tile behind it (within JUMP), then strike at ×0.8 from the landing tile, usually its back. You can move before it. | **New: Hard landing.** You can't move after vaulting (`noMoveAfter`), so you stay behind their line instead of hit-and-running every turn (was CD 2: before v0.13 you could walk away after) | Uses the skirmisher's high JUMP and gets behind a front line. Landing deep is the risk. |

Statuses show as letter pips above the HP bar (W/B/P/E/S) and as a line in unit info. Brace zones are drawn in orange on the map for both sides.

**Rules worth knowing**
- Only a *voluntary* walk triggers Brace. Shoves, pulls and vaults don't. A brace that triggers is used up. A move stopped by a brace can't be undone.
- Cover from Shield Wall changes the hit *side* only. Flank bonuses and height still apply.
- The vault landing must be in bounds, empty, and within the skirmisher's JUMP of its start height.

**UI flow (FFTA2):** Action → submenu lists **Attack** plus the class's two abilities (▲▼ on the pad; greyed with "no target", or "moved" for Pinning Shot after a move). The confirm box lists the drawback as "Trade-off: …". After an ability that roots you (Pin, Vault), the turn goes straight to the facing step. Targeting uses the map pad. The red tiles show the ability's reach, and orange tiles show where things will end up: the shove/pull destination, the vault landing, covered allies, the brace zone. The confirm box shows hit %, damage + extra (fall/slam), HP before→after, and plain-language effects. Stances target yourself. Brace sends you to the facing step so you can aim the zone.

**AI:** the planner considers every (tile × ability × target) next to plain attacks (Pinning Shot only from the tile it starts on). **v0.13, no cooldowns:** `ai.wRepeatAbility` (6) docks the score of the ability the unit used on its own previous turn, so the AI doesn't turtle in Shield Wall or Bash the same foe every turn (AI taste, not a rule; players can repeat freely). Full-AI sim, mean uses per battle over 6 battles: Shield Wall 1.83 → 2.27 (Templars), 1.28 → 1.42 (raiders); Pinning Shot 0.82 → 0.44 (planted); back-to-back repeats ≤ 0.41 per battle for any ability. Abilities are scored by what they set up: fall/slam damage, a shove or pull that ends next to one of its own units, pins on fast units, back/side exposure after a feint, landing danger after a vault, Exposed danger after a plunge. A damaging ability has to beat the best plain attack by `abilityMinGain`. Stances (Wall, Brace) compete with *repositioning*, not with attacks, so a knight doesn't stand still walling when it should advance. Paths that run into a visible brace zone are penalised (`wAvoidBrace`). If a brace stops the AI anyway, it re-plans from where it stands.

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
1. **Turn starts:** the camera and cursor go to the active unit, and the **command menu** opens (bottom-right of the field) with **Move / Action / Wait**. Move gets the default highlight, but nothing is auto-entered. ▲▼ move through the list; used commands are greyed and skipped.
   Menus use the ▲▼ pad.
2. **Move:** blue tiles show the range. Move the cursor (the cursor can roam anywhere, but only blue tiles accept A), then press **A** to walk there. **B** goes back to the menu. After moving, the menu returns with Move greyed and **Action** highlighted. **B on the menu after moving, before acting, undoes the move** (unit and facing go back), as in FFTA2.
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
- Hero portraits: 8 simple SVG busts marked PLACEHOLDER. Companion portraits (`assets/companions/`) are placeholders too.
- **Art direction (decided by Cletus, v0.9; to do at the art stage):** heavily based on **Final Fantasy** art; **portraits in the style of FFTA2's portraits**. No art changes until then (ROADMAP Stage 4).
- All art: procedural canvas shapes (shaded iso blocks, simple figures with team colors, Templar red cross on tunic/shield). No sound.
- Hand-made maps, fixed deployment per map, two abilities per class only (no branches/secondary sets yet), no items, no XP (all coming in the slice, Stage 3 #3 and #5).
- Raider faction is a generic stand-in. Names are generic. Story premise: still to be written (Stage 3 #10).
- AI is a one-ply greedy scorer.

## Open questions
- ~~Squad building~~ → replaced by one created hero + set companions (see Main character & party). Companion origins (Frankish knights, local Turcopoles, Armenian/Syriac allies?) remain a story question.
- Trade-off upgrades → Stage 3 #5: gear is **mostly stats**; **rare gear** teaches abilities or gives a perk with a trade-off (armor weight ⇄ MOV/JUMP, banners, etc. are candidates).
- Should facing protect more (e.g. shields block some front damage) to make flanking even more decisive?
- Reactions/zones of control vs. keeping turns snappy (pillar 1). v0.4 answer: only Brace, set on your own turn and resolved automatically. Should more reactions follow this pattern?
- ~~Abilities: keep cooldowns, or move to MP?~~ Decided v0.13: no cooldowns, built-in drawbacks only; magic + MP later (parked). Should Shield Wall cover also cancel flank bonuses (it doesn't now)? Should shoves/pulls into a brace zone trigger it (they don't now)?
- Per-playthrough variety: procedural maps? random events? relic draft?
- ~~Mythology layer — when and how much?~~ → central from the start (Stage 3 #10).
- ~~Permadeath or wounds?~~ → wounds (Stage 3 #5).
- Should waiting (CT −60) be more visible as a tactic?
- Controls: keep the FFTA2 menu structure as abilities arrive (Action → class set / borrowed secondary set, Stage 3 #3)? Is the end-of-turn facing step worth its press (see pillar-1 tension above)?
- Add L/R-style "next/previous unit" buttons, or are turn-order chips enough?
- Terrain beyond movement (cover, high ground for defense, water/marsh)?

## Party size (2026-11-09)
- The game is moving from a 3-unit squad to FFTA2-style clans: about 6 units deploy per battle, chosen from a larger roster. The deploy cap should be a value in `src/config.js` once this is coded.

## Classes (2026-11-09)
- FFTA2-style: basic classes that unlock more advanced and unique options. This needs its own design discussion; it has not been designed yet.

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
- **Centering (locked, Cletus 2026-11-11):** units are planted so the torso centre sits on the tile centre, not the feet. Body-centred won the side-by-side against feet-centred (v0.14.0), and the switch was removed in v0.14.2. `bodyCenterX` holds one whole-art-px x per facing, taken from the standing cell's shoulders-to-hips mass; walk frames of that facing share it so he does not jitter sideways.
- **Iso tiles** 60×30, height step 15. Same 2:1 diamond as the previous 64/16 base, so map layout, pathing and depth sort are unchanged.
- **Integer scale.** Tiles and sprites share one whole-number `s` (device pixels per art pixel), with image smoothing off for sprites. Tile width in device pixels is exactly `60 × s`.
- **Phones** (stage narrower than 520 CSS px) use `s = 3`. At DPR 3 an 8×8 board is 480 CSS px wide and pans a little on a 390-wide iPhone. Wider screens use the largest `s` that fits. This replaces the old 1.3× zoom-past-fit.
- **Tristan** is the player hero's battle sprite (standing 8-dir plus a 4-diagonal walk). Other units keep the placeholder drawing until their sheets arrive. Left-facing diagonals are already flipped in the files; the engine never mirrors them. Idle is a 2-frame walk-in-place at 410 ms; a move uses the same frames at 170 ms (340 ms per tile). Attacks use the standing cell plus the existing lunge.
- Headroom above the highest tile is derived from the cell (`CONFIG.art.headroom`), not a hardcoded `62`.
