# Stage 3: decide the real game: DECIDED

> **Status: all 12 decisions made by Cletus (2026-11-02). Stage 3 is done.** Each topic below shows ✅ **his choice**, then a short note on the options he rejected and why. The agreed one-page brief is [GAME-BRIEF.md](GAME-BRIEF.md), and the Stage 4 plan built on it is [SLICE-PLAN.md](SLICE-PLAN.md). Sources: [ROADMAP](ROADMAP.md#stage-3--decide-the-real-game), [DESIGN](DESIGN.md), the [companions pitch](companions-pitch.md), the [abilities research](research/abilities-vs-attack.md), and Cletus's playtest notes.
> **Stage 3 done-when:** a short game brief (scope, platform, tech, story premise) is agreed and the vertical slice is planned against it. ✅ The brief and slice plan are written. The story premise is deliberately left to a dedicated story session (#10).

**Decided before Stage 3, carried forward**
- ✅ A **Baldur's Gate structure on FFTA-style tactics**: one created hero (rolled stats, class, portrait; fixed background) plus set companions with their own stories. No D&D rules.
- ✅ **Squad of 3** (hero + 2), "Mass Effect feel".
- ✅ **Class decides movement** (MOV, JUMP, terrain). No race modifiers for now; a winged race is parked.
- ✅ **Controls:** FFTA2 scheme (cursor, command menu, A/B), a context-aware cross pad, and **no phone-only controls**. It must map to a controller.
- ✅ **Map rule:** every tile reachable at MOV 2 / JUMP 2. Allies act in character.
- ✅ **Pillars:** no stop-and-press; every playthrough differs; trade-off upgrades over raw power; flanking and positioning are central. (Pillar 4, "story later", is replaced by #10: mythology is central from the start.)

---

## Stage 2 check: ✅ done
Stage 2 was done when two heroes play noticeably differently, companions are remembered by name, and Cletus wants to roll a new hero.

| Criterion | Evidence | Status |
|---|---|---|
| The loop exists end to end | v0.11: creation → open board → 3 recruit missions → Chapel Ford finale → ending → Chronicle → roll a new hero. Cletus: "Pretty solid." | ✅ |
| Two heroes play differently | Cletus (2026-11-02) played **two full runs on different classes**: "Feels pretty good and different on a different class." | ✅ playtested |
| Companions remembered by name | Named portraits, briefs, AI personalities, finale payoffs. Cletus asked to see identities in battle "since story will be part of those fights". | ✅ |
| Wants to roll a new hero | He rolled a second hero and played the whole run again. | ✅ |
| Battles fair | Sim: HUMAN=1 mean 70.0%, 35 of 36 cells at 65–74% (v0.13). | ✅ (sim) |

---

## The decisions

### 1. Campaign scope & structure ✅
**Chaptered boards (~5 chapters), FFTA2-style, built around a mission tree.**
- Each chapter is an open board of missions that ends in a story finale.
- **Fewer recruit missions, many side missions.** As in FFTA2, side missions are where most of the play time goes.
- Missions form a **tree**. Unlock types:
  - **Chain:** a mission only appears after you beat a specific earlier one.
  - **Branch:** a side mission opens one or more follow-ups (its own short storyline).
  - **Companion-only:** a mission only appears if that companion was recruited; beating it can **unlock a new ability for that companion**.
- **Multi-part missions** span several locations, travelled in sequence (see #5: no return to town between parts).
- Still to settle in the slice: side missions per chapter, whether a finale closes unfinished branches, and which branches carry into later chapters.
- *Rejected:* linear chapters (weakest on "every playthrough differs"); run-based roguelite (fights the named-companion story).

### 2. Party size ✅
**Squad of 3 all game, plus a few solo or duo story missions** (e.g. the hero alone).
- *Rejected:* 3 → 4 slots later; per-mission squad size as the general rule.

### 3. Classes & hero growth ✅
**Fixed class + branches + ability-teaching gear + one borrowed skill set.**
- **Fixed class** for life: it keeps the class's movement identity (MOV, JUMP, terrain).
- **Branches:** at milestones, pick **1 of 2** branches (e.g. Knight → *Bulwark* or *Lancer*).
- **Learning from gear (FFTA-style):** some gear teaches an ability; once learned, you keep it.
- **One borrowed secondary skill set** from another class. Your movement stays your own.
- **New classes:** +1–2 later: **Physician** (Ishaq), and a magic class when magic arrives (#6).
- **Leveling (FFTA2-style):** XP from fights. **Level-ups only raise stats** (no picks; choices come from branches, gear and the secondary set). Gains vary by class. **Stat max 100, level cap 50.**
  - ⚠️ The current 3d6 stats (3–18) and the creation rolls must be **rebalanced to the 1–100 range** (see [SLICE-PLAN](SLICE-PLAN.md#big-unknowns)).
- *Rejected / changed from the recommendation:* fixed class with only trade-off gear (too little customization); a full FFTA job system (blurs movement identity; too much content). The draft's "milestone levels only unlock branches" became full FFTA2-style XP leveling.

### 4. Companions ✅
**10 companions, about 2 per chapter (adjustable for the story), and all 10 can be recruited in one run.**
- From the pitch: Renaud, Yusuf, Wren, Mariam, Ingvar, Ishaq. **4 more to be written.**
- Recruiting by *how* you win (spare, protect, reach in time) stays **parked**; winning the mission is enough for now.
- *Rejected / changed:* 6 companions with only ~4 per run (missed companions as replay driver); Cletus's earlier lean of one per chapter; 3 companions. Variety now comes from the mission tree, branches and squad choice, not from locking people out.

### 5. Between battles ✅
**An FFTA2-style world map of nodes.**
- **At any node:** change party and equipment.
- **Only at town nodes:** shops and taking missions. You take a mission in town, then travel to its location.
- **Gear:** mostly stats. **Rare gear** does other things: teaches abilities (#3) or gives perks with a trade-off.
- **Wounds, not permadeath:** a fallen companion is **Wounded for the next battle**. If the **hero falls, the battle is lost**.
- **Travel makes choices without extra presses:** side jobs on the way; multi-part jobs can't return to town between parts.
- *Rejected / changed:* a camp screen of trade-off upgrades only (gear is now mostly stats, with trade-offs on rare pieces); permadeath; no progression.

### 6. Abilities ✅
- **No cooldowns, no generic cost** (done in **v0.13.0**): an ability's only cost is a built-in drawback (Pin plants you, Vault can't move after, Wall slows, Plunge exposes; Bash, Hook, Brace, Feint have none).
- **Build from the research** ([abilities-vs-attack](research/abilities-vs-attack.md)):
  - **Fix 4:** deadly edges (falls, water, fire) and goals other than kill-all.
  - **Fix 1:** an Action-menu forecast + an end-of-battle tally.
- **Magic & MP later** (parked): MP is for spells; physical abilities keep their drawbacks.
- *Rejected:* the "attack-plus" retune (fix 2), the frontal riposte (fix 3), and enemy intent shown for everyone (fix 5; Yusuf's version stays as his trait). Also rejected: keeping abilities as they were.

### 7. Art direction ✅
**2D sprites on iso tiles**, Final Fantasy-based, **FFTA2-style portraits**, a **pre-made set of 8–12 hero portraits** (no builder). **Tancred (the AI partner) makes the art.**
- *Rejected:* HD-2D (cost, engine); low-poly 3D (drifts from FFTA2); a portrait builder; commissioned art.

### 8. Platform & controls ✅
**Phone first + Steam with controller.** Switch is a stretch at most.
- *Rejected:* phone only; Switch as a target (would force an engine change, #9).

### 9. Tech ✅
**Grow this codebase:** TypeScript + a renderer (e.g. PixiJS), **Capacitor** for iOS/Android, **Tauri or Electron** for Steam. **Keep the balance sim** (`tools/sim.mjs`) and the engine-agnostic rules modules.
- *Rejected:* Godot 4 (lose the JS sim); Unity (licensing, full rebuild).

### 10. Story & mythology ✅
**Mythology is central from the start:** relics and the uncanny drive the plot.
- **The premise is not written yet.** It gets its own dedicated story session with Cletus. **Don't invent it in the meantime** (open item).
- **Told in the engine, FFTA2-style:** sprites act out scenes on the iso maps with portrait text boxes. No pre-rendered cutscenes.
- *Rejected / changed:* the recommendation "premise now, mythology door ajar"; historical-first.

### 11. Vertical slice (Stage 4) ✅
**A polished Chapter 1, about 2 hours.** Full plan: [SLICE-PLAN.md](SLICE-PLAN.md).
- Hero creation (final UI, portraits); a small world map with a town and travel.
- A Ch.1 mission tree: **2 recruits**, branching side missions, **one multi-part mission**, a finale.
- Leveling; stat gear plus **one rare ability-teaching piece**; one class-branch pick; a borrowed skill set if it fits; wounds.
- The forecast + tally; one deadly-edge or non-kill-objective map.
- A real mythology hook; in-engine story scenes.
- Final art, sound and music; saves; touch + controller + keyboard; onboarding with no tutorial popups.
- **All maps pass the MOV2/JUMP2 rule.**
- *Changed from the recommendation:* 2 recruits instead of 3; a world map instead of a board + camp screen; leveling, wounds and story scenes added.

### 12. Team & budget ✅
**Cletus solo; Tancred makes the art.** Music and sound are a **trial by Tancred**; if the result isn't good enough, Cletus does them himself. **Publishers: decide after the slice.**
- "Commercial quality" (kept from the draft): final art and audio, no placeholder text, stable saves, 60 fps on a mid-range phone, controller parity.
- *Rejected:* contract art/music; a small funded team.

---

**Next:** Stage 4, the vertical slice. See [SLICE-PLAN.md](SLICE-PLAN.md).
