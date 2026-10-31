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
- *In:* one map, a small squad on each side, basic attack, the combat formula, enemy AI, the phone UI, tuning in config.
- *Out:* story, meta-progression, real art and sound, saving, menus outside battle.

**Done so far**
- [x] FFTA2-style controls: tile cursor, Move / Action / Wait menu, A confirm / B back, undo move, attack prediction + confirm, explicit facing step, tap shortcuts
- [x] Context-aware d-pad: ▲▼ in menus, iso quadrants on the map, facing arrows at turn end, dimmed when there's nothing to steer
- [x] Facing (front/side/back) and flanking bonuses, shown in the prediction
- [x] Height: damage, hit and archer range
- [x] CT turn order with a turn-order strip; Wait costs less CT
- [x] Distinct movement per class: MOV, JUMP, terrain costs
- [x] 3v3 slice (Knight / Sergeant / Archer vs Swordsman / Skirmisher / Bowman) with a scoring AI, live on GitHub Pages, plus a Playwright phone test
- [x] **2 abilities per class** (v0.4): Shield Bash / Shield Wall, Brace / Hook, Pinning / Plunging Shot, Feint / Vault Strike. They run on cooldowns, enemies use them too, and the AI-vs-AI sim is in `tools/sim.mjs`. See [DESIGN.md → Abilities](DESIGN.md#abilities-v04--two-per-class-all-about-position). *Still to do: a playtest of whether positioning stays interesting, and better AI use of Bash/Hook/Pin/Feint.*

**Left in this stage** *(proposals, to be confirmed by Cletus)*
- **Research:** [Why players just attack (and how to fix it)](research/abilities-vs-attack.md): what makes players pick abilities over Attack in other tactics games, and the top 5 proposals for this slice (frontal riposte, an "attack-plus" retune, Map 2 with edges and an objective, visible enemy intent, and an Action-menu forecast plus action tally)
- **Balance pass** from playtests: win rate (sim now 0.37 vs 0.46 before abilities), fight length, whether every class pulls its weight, and AI use of the setup abilities
- **A second map** with different terrain and height, to check the systems aren't specific to one map
- *(maybe)* a race or origin modifier on movement, if it's cheap to test here rather than in Stage 2

**Done when:** a fight is **fun to replay with the same squad**. Cletus wants to play the same battle again and tries different positioning each time.

---

## Stage 2 — Core loop prototype
**Purpose:** prove that building a squad and carrying it through a run is fun.

**Questions it answers**
- Do classes × races give enough meaningfully different squads?
- Do trade-off upgrades create real decisions, not just "pick the bigger number"?
- How long should a run be, and what carries over between battles (HP, wounds, loot)?

**Scope**
- *In:* squad building from classes and races; trade-off upgrades; a short run of **3–5 linked battles** with rewards/choices between them; simple between-battle screens.
- *Out:* story, final art, a long campaign, platform decisions.

**Done when:** **two different squads play noticeably differently**, and at the end of a run Cletus **wants one more run**.

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
- *In:* real art direction, sound and music, story and writing for one chapter, final UI, saving, and the production tech and pipeline chosen in Stage 3.
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
- Record decisions and open questions in DESIGN.md as they happen.

---

## Parking lot
Ideas that come up outside the current stage. Add freely; review at each stage boundary.
- Mythology layer: relics, saints' legends, djinn/desert folklore *(Stage 3)*
- Permadeath vs wounds *(Stage 2)*
- Procedural maps, random events, relic drafts for run variety *(Stage 2)*
- Reactions or zones of control vs keeping turns snappy *(Stage 1–2)*
- Shields blocking some front damage, to make flanking even more decisive *(Stage 1 balance)*
- Terrain beyond movement: cover, defensive high ground, water/marsh *(Stage 1–2)*
- A unit placement phase before battle (FFTA2-style)
- L/R next/previous unit buttons
- Whether the end-of-turn facing step is worth its button press (pillar 1 tension)
