# Outremer — Roadmap

## Goal
Outremer should one day be a **full, commercial-quality game that Cletus releases**.

Today's builds are **prototypes**. Each one exists to answer design questions, not to become the shipped game, so prototype code can be rough. The questions matter more than the code, and the code may be rewritten later (see Stage 3).

Design pillars and the current rules live in [DESIGN.md](DESIGN.md).

---

## Stage 1 — Combat prototype ← **CURRENT**
**Purpose:** prove that one battle feels good on a phone.

**Questions it answers**
- Do FFTA2-style controls (cursor, command menu, A/B, context-aware d-pad) work well with thumbs?
- Does it matter how each class (and later race) moves: move range, jump, terrain?
- Do facing, flanking and height make *where you stand* the interesting decision?
- Do the turn order and the cost of Wait create real choices without any extra button presses?

**Scope**
- *In:* a couple of hand-made maps, a small squad on each side, basic attack, the combat formula, enemy AI, the phone UI, tuning in config.
- *Out:* story, meta-progression, real art and sound, saving, menus outside battle.

**Done so far**
- [x] FFTA2-style controls: tile cursor, Move / Action / Wait menu, A confirm / B back, undo move, attack prediction + confirm, explicit facing step, tap shortcuts
- [x] Context-aware d-pad: ▲▼ in menus, a ▲▶▼◀ cross on the map and at turn end (v0.7, replacing the diagonal quadrants; ▲ = up-right), dimmed when there's nothing to steer
- [x] Facing (front/side/back) and flanking bonuses, shown in the prediction
- [x] Height: damage, hit and archer range
- [x] CT turn order with a turn-order strip; Wait costs less CT
- [x] Distinct movement per class: MOV, JUMP, terrain costs
- [x] 3v3 slice (Knight / Sergeant / Archer vs Swordsman / Skirmisher / Bowman) with a scoring AI, live on GitHub Pages, plus a Playwright phone test
- [x] **2 abilities per class** (v0.4): Shield Bash / Shield Wall, Brace / Hook, Pinning / Plunging Shot, Feint / Vault Strike. They run on cooldowns, enemies use them too, and the AI-vs-AI sim is in `tools/sim.mjs`. See [DESIGN.md → Abilities](DESIGN.md#abilities-v04--two-per-class-all-about-position). *Still to do: a playtest of whether positioning stays interesting, and better AI use of Bash/Hook/Pin/Feint.*
- [x] **Second map: The Breach** (v0.5). A ruined keep: height-3 curtain wall with a rubble breach, a sunken flagstone courtyard and a stair tower up to height 4. JUMP decides who can use the walls. Pick it on the title or Victory/Defeat screen, or with `?map=breach` / `?map=2`. Sim: Ridge 0.37, Breach 0.57 Templar wins. See [DESIGN.md → Maps](DESIGN.md#maps-v05).

**Left in this stage** *(proposals, to be confirmed by Cletus)*
- **Research (shelved for later):** [Why players just attack (and how to fix it)](research/abilities-vs-attack.md). It covers what makes players pick abilities over Attack in other tactics games and gives 5 proposals: frontal riposte, an "attack-plus" retune, map edges and an objective, visible enemy intent, and an Action-menu forecast plus action tally. None of them are built yet. We'll come back to them after playtesting the two maps.
- **Balance pass** from playtests: win rate (sim now 0.37 vs 0.46 before abilities), fight length, whether every class pulls its weight, and AI use of the setup abilities
- **Playtest both maps:** do class movement, facing/flanking, height and abilities hold up on The Breach as well as The Ridge?

**Done when:** a fight is **fun to replay with the same squad**. Cletus wants to play the same battle again and tries different positioning each time.

---

## Stage 2 — Core loop prototype
**Purpose:** prove that making a hero and growing a party around them is fun. Baldur's Gate 1/2 structure (create one main character, set companions join), FFTA-style tactics combat, no D&D rules. See [DESIGN.md → Main character & party](DESIGN.md#main-character--party-baldurs-gate-style-structure).

**Loop:** create hero → fight → a set companion joins → next fight.

**Questions it answers**
- Is BG-style creation (rolled stats you can redistribute, class, portrait; fixed background) fun on a phone, and does it make each hero feel different?
- Do rolled stats matter in a fight without overshadowing class movement and positioning?
- Do set companions, with their own class and a few lines of story, make the party feel like *people* rather than units?
- Do trade-off upgrades between battles create real decisions? What carries over (HP, wounds, loot)?

**Scope**
- *In:* a creation screen (one of the [mockups](mockups/) picked by Cletus); 2–3 set companions with names, a fixed class and a short join scene; **3–4 linked battles**, each followed by a companion joining or a simple between-battle screen; tuning in `CONFIG.creation`.
- *Out:* real story, final portraits/art, dialogue trees, a long campaign, platform decisions.

**Progress**
- [x] **Hero creation (v0.6):** mockup B wizard: Portrait → Class → Stats (BG roll, pool, Store/Recall) → Name; all six stats wired (Aim → hit/crit, Resolve → resist); the hero replaces the same-class Templar and is saved on the device.
- [x] **Missions & recruitment (v0.8):** FFTA2-style **mission board** after the title. Three recruit missions with vague titles: *A Templar in Need* (Brother Renaud), *Smoke at the Well* (Yusuf ibn Qasim), *Thief in the Baggage Train* (Wren, on a new map, The Baggage Train). Plus The Ridge / The Breach as skirmishes. The companion-to-be fights beside you as an AI ally who must survive (v0.9: shown by name and portrait from the brief on); win and they offer to join: **Accept / Decline** (the mission stays done either way). The party (hero + up to 2 companions, extras rest in camp) is saved on the device; companions show their portrait in the info panel and turn strip, and each has a simple pro/con trait. See [DESIGN.md → Missions & recruitment](DESIGN.md#missions--recruitment-v08).
- [x] Set companions (3) with a join scene
- [x] **Easier battles (v0.9):** global difficulty knobs in `CONFIG.difficulty` (raiders ×0.85 HP/ATK + a per-battle trim; raiders mostly ignore the ally you're saving). Basic-attack sim: 41% → 72% wins on average, ally-fell losses ≤ 6%. **Squad of 3 decided** (Mass Effect feel). See [DESIGN.md → Difficulty](DESIGN.md#difficulty-v09-retuned-v010).
- [x] **Allies in character, softer height, reachable maps (v0.10, from Cletus's v0.9 playtest):** recruit-mission allies get **AI personalities** instead of all hiding. Renaud is aggressive and charges in, Yusuf is wary (fights, falls back on the squad), Wren is evasive (a thief). Renaud now attacks ~0.5×/turn instead of ~0.05. **Height is softer and capped:** +5%/level melee, +3% ranged shooting down, −5% below, ×0.85–1.1, ±2% hit; archers +1 range per 3 levels. **Map rule:** every tile reachable at MOV 2 / JUMP 2 (and JUMP 1), checked by `tools/reach.mjs` in the tests. **The Breach got stairs**, so Knights can contest the wall. The AI approaches by walking distance. Difficulty retuned: basic-attack sim mean 73%, worst ally-fell 7%. See [DESIGN.md → Missions & recruitment](DESIGN.md#missions--recruitment-v08), [Maps](DESIGN.md#map-rule-everywhere-is-reachable-v010), [Difficulty](DESIGN.md#difficulty-v09-retuned-v010).
- [ ] Linked battles: a between-battle screen / camp, story order for the missions (they're all open at once now)
- [ ] Decide what carries over (HP, wounds, loot)

**Done when:** **two different heroes play noticeably differently**, the companions are remembered by name, and at the end Cletus **wants to roll a new hero**.

---

## Stage 3 — Decide the real game
**Purpose:** use what Stages 1–2 taught us to commit to what the actual game is. **Nothing here gets locked earlier.**

**Decisions made here**
- **Scope:** campaign length; run-based vs story-based (or a hybrid)
- **Platform(s):** phone, PC, Switch, …
- **Engine/tech:** grow this codebase, or rebuild in an engine
- **Story and setting:** the Crusades and the Templars as the base, with room for mythology (relics, legends, the uncanny)
- Rough budget/timeline, and what "commercial quality" means for this game

**Done when:** a short written game brief (scope, platform, tech, story premise) is agreed and the vertical slice is planned against it.

---

## Stage 4 — Vertical slice
**Purpose:** one polished chapter, built the way the full game will be built.

**Scope**
- *In:* real art direction (**decided by Cletus:** heavily based on **Final Fantasy** art; **portraits in the style of FFTA2's portraits**; every current portrait is a placeholder), sound and music, story and writing for one chapter, final UI, saving, and the production tech and pipeline chosen in Stage 3.
- *Out:* the remaining content.

**Done when:** the chapter is good enough to show people (playtesters, potential partners or publishers) as "this is the game," and building more of it is mostly content work.

---

## Stage 5 — Production
**Purpose:** build the rest of the game, then polish, test, and release.

**Done when:** it ships.

---

## Working rules
- **Every feature serves the current stage's "Done when."** Anything else goes to the Parking lot.
- **Design pillars** (full text in [DESIGN.md](DESIGN.md#design-pillars-from-cletus)):
  - Systems come from choices the player is already making (where to move, whom to hit, from where), not from stop-and-press mechanics.
  - Customization, and every playthrough feels different.
  - Trade-off upgrades over pure power.
- **Phone-first playtesting** through GitHub Pages: every change goes live at https://code-hoyt.github.io/outremer/ so Cletus can play it on his phone.
- **Tuning lives in [`src/config.js`](../src/config.js)**, so balance changes don't require code changes.
- **Map rule (Cletus, v0.10):** every tile on every map is reachable by a MOV 2 / JUMP 2 unit (we also hold JUMP 1). `node tools/reach.mjs` must pass before a map ships ([DESIGN.md → Maps](DESIGN.md#map-rule-everywhere-is-reachable-v010)).
- **Allies stay in character:** a companion flees or hides only if that's their story or the battle's design ([DESIGN.md → Missions & recruitment](DESIGN.md#missions--recruitment-v08)).
- Record decisions and open questions in DESIGN.md as they happen.

---

## Parking lot
Ideas that come up outside the current stage. Add freely; review at each stage boundary.
- Mythology layer: relics, saints' legends, djinn/desert folklore *(Stage 3)*
- Permadeath vs wounds; does the hero's death end the game (BG) *(Stage 2)*
- Procedural maps, random events, relic drafts for run variety *(Stage 2)*
- Reactions or zones of control vs keeping turns snappy *(Stage 1–2)*
- Shields blocking some front damage, to make flanking even more decisive *(Stage 1 balance)*
- Terrain beyond movement: cover, defensive high ground, water/marsh *(Stage 1–2)*
- A unit placement phase before battle (FFTA2-style)
- L/R next/previous unit buttons
- Whether the end-of-turn facing step is worth its button press (pillar 1 tension)
- **How you win decides recruitment** (Cletus, v0.8): e.g. Renaud joins only if no Templar falls, Yusuf if you spare a fleeing raider, Wren if you reach her before the raiders loot the carts. For now, winning the mission is enough. *(Stage 2)*
- Re-recruiting a declined companion later (camp, a second mission)? *(Stage 2, open question in DESIGN)*
- Possible winged race (wind/flight) with effectively unlimited jump — discuss later. *(No race modifiers on movement for now.)*
