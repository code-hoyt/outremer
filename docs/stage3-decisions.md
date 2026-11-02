# Stage 3: decide the real game (DRAFT for Cletus)

> **Status: draft, being walked through with Cletus one topic at a time (2026-11-02).** #1 is decided; the rest are proposals to react to. Each decision lists 2–3 options and a **recommendation**. ✅ marks what Cletus has already decided. Sources: [ROADMAP](ROADMAP.md#stage-3--decide-the-real-game), [DESIGN](DESIGN.md), the [companions pitch](companions-pitch.md), the [abilities research](research/abilities-vs-attack.md), and Cletus's playtest notes.
> **Stage 3 is done when:** a short game brief (scope, platform, tech, story premise) is agreed and the vertical slice is planned against it.

**Already decided (✅), carried forward**
- ✅ A **Baldur's Gate structure on FFTA-style tactics**: one created hero (rolled stats, class, portrait; fixed background) plus set companions with their own stories. No D&D rules.
- ✅ **Squad of 3** (hero + 2), "Mass Effect feel". Recruit missions add the person you're saving as an AI ally.
- ✅ **Class decides movement** (MOV, JUMP, terrain). No race modifiers for now; a winged race is parked.
- ✅ **Art:** heavily Final Fantasy-based, **portraits in the FFTA2 style**, done at the art stage.
- ✅ **Controls:** FFTA2 scheme (cursor, command menu, A/B), a context-aware cross pad, and **no phone-only controls**. It must map to a controller.
- ✅ **Map rule:** every tile reachable at MOV 2 / JUMP 2. Allies act in character.
- ✅ **Pillars:** no stop-and-press; every playthrough differs; trade-off upgrades over raw power; story later, with room for mythology; flanking and positioning are central.

---

## Stage 2 check: what's evidenced so far
Stage 2 is done when two heroes play noticeably differently, companions are remembered by name, and Cletus wants to roll a new hero.

| Criterion | Evidence | Status |
|---|---|---|
| The loop exists end to end | v0.11: creation → open board → 3 recruit missions → Chapel Ford finale → ending → Chronicle → roll a new hero. Cletus: "Pretty solid." | ✅ built and played |
| Two heroes play differently | Cletus (2026-11-02), after a second full run on a different class: "Feels pretty good and different on a different class." Sim agrees (hero class changes results). | ✅ playtested |
| Companions remembered by name | Named portraits, briefs, AI personalities (Renaud charges, Yusuf wary, Wren evasive), finale payoffs and missed effects. Cletus asked to see identities in battle "since story will be part of those fights". | 🟡 promising, unconfirmed |
| Wants to roll a new hero | The Chronicle + "Roll a new hero" exist. **Not observed yet.** | ❓ the key test |
| Battles fair | Sim: all 36 squad/battle cells at 65–74% wins (basic-attack model). Cletus's early "getting destroyed" was fixed in v0.9. | ✅ (sim) |
| Board UX | v0.12: scroll can't start a mission; "Begin mission?" confirm. | ✅ fixed after feedback |

**Still open from Stage 1:** the done-when ("a fight is fun to replay with the same squad") hasn't been confirmed. Abilities are rarely used (Cletus mostly attacks, by his own account), and the research fixes are shelved.
**Before locking Stage 3:** one playtest with 2 different heroes through the whole run, then ask: "Do you want to roll a third?"

---

## The decisions

### 1. Campaign scope & structure
| Option | What | For / against |
|---|---|---|
| A. Linear chapters | Story battles in a fixed order | Easiest to write; weakest on "every playthrough differs" |
| **B. Chaptered boards** | Each chapter is an FFTA2-style board: recruit and side jobs in any order, then a story finale that closes what's left (today's Option B, repeated) | Reuses what works; choices and misses carry between chapters |
| C. Run-based (roguelite) | Short runs, procedural maps and events, meta-unlocks | Most replayable; fights the BG-style named-companion story |

✅ **Decided (Cletus, 2026-11-02): B, chaptered boards, made FFTA2-like: a mission *tree*, mostly side missions.**
- About **5 chapters**, each an open board that ends in a story finale.
- **Fewer recruit missions, many more side missions.** As in FFTA2, side missions are where most of the play time goes (the draft's "2–3 recruit jobs + 1–2 side jobs" is replaced).
- Missions form a **tree**, not a flat list. Unlock types:
  - **Chain:** a mission only appears after you beat a specific earlier mission.
  - **Branch:** a side mission can open one or more follow-up missions (a short storyline of its own).
  - **Companion-only:** some missions only appear if a given companion was recruited (their personal story).
  - **Ability-unlock:** beating a companion's mission can unlock a new ability for that companion.
- Missed companions and choices still change later chapters. Skirmishes become optional side jobs, not the main way to grind.
- Open details for the slice plan: how many side missions per chapter, whether the finale closes unfinished branches (as v0.11 closes recruit missions), and which branches carry over between chapters.

### 2. Party size
| Option | What |
|---|---|
| **A. 3 all game** ✅ (hero + 2) | Confirmed feel; maps sized 3v4–3v6 |
| B. 3 → 4 later | A slot unlocks mid-game for scale |
| C. Per-mission size | Some jobs force 1–2 (stealth, escort) |

**Rec: A, plus C for a few story jobs** (e.g. a hero-alone mission). Keep the guest AI ally as the variety lever. Revisit B only if late fights feel thin.

### 3. Classes, jobs & hero class progression
Today there are 4 classes (Knight, Sergeant, Archer, Scout), 2 abilities each, and no progression.
| Option | What | Pillar fit |
|---|---|---|
| A. Fixed class + trade-off gear | Class never changes; gear changes how you play | Strong pillar 3; little customization |
| B. FFTA-style jobs | Change job, learn abilities, secondary set | Deep customization; MOV/JUMP identity blurs; lots of content |
| **C. Class + branches** | Hero keeps their class (movement identity), picks **1 of 2 branches** at 2–3 milestones (e.g. Knight → *Bulwark* (tougher, −1 MOV) or *Lancer* (charge, lower DEF)). Companions have their own fixed branch choice | Trade-off by design; customization that differs per run; bounded content |

**Rec: C + trade-off gear (#5).** The class list stays at 4, with **+1–2 new classes** decided here. Candidates: **Physician** (Ishaq, already pitched and flagged) and a ranged/mounted option. A full job system (B) is out of scope for a small team.

### 4. Companion count & roster
| Option | What |
|---|---|
| A. 3 (today) | Renaud, Yusuf, Wren |
| **B. 6** | + the pitched Mariam (Archer), Ingvar (Sergeant, relic orders), Ishaq (Physician, new class) |
| C. 8–10 | BG2 scale |

**Rec (draft): B, 6 companions**, with **~4 recruitable in any one run** (boards close jobs, as in v0.11), so who you missed matters and replays differ. Keep the friction hooks: Renaud ⇄ Yusuf, Wren ⇄ Ingvar, Ingvar ⇄ Ishaq.

🟡 **Cletus's lean (2026-11-02), not final, still to discuss:** fewer companions, since the squad only has 3 slots: **about one recruitable companion per chapter** (so ~5 over ~5 chapters). This fits #1 (fewer recruit missions, more side missions, companion-only missions).

### 5. Progression between battles (currently none)
| Option | What |
|---|---|
| A. XP & levels | Familiar; mostly bigger numbers (against pillar 3) |
| **B. Camp with trade-off upgrades** | Between battles: gear and vows that swap one strength for another (heavy mail: +DEF, −1 JUMP; Templar vow: +RES, can't retreat) |
| C. Wounds / permadeath | Stakes; punishing on phones |

**Rec: B, plus a few milestone levels** that only unlock the class branches (#3). **Wounds, not permadeath:** a fallen companion is Wounded for the next battle. If the hero falls, the battle is lost (BG). Loot is a short list of trade-off items, not an inventory grind.

### 6. Abilities
| Option | What |
|---|---|
| A. Keep as is | 2 per class; the AI rarely uses Bash/Hook/Pin/Feint; Cletus mostly attacks |
| **B. Build the research top 5** | 1) Action-menu forecast + end-of-battle tally, 2) "attack-plus" retune, 3) frontal riposte, 4) a map with lethal edges and a non-kill objective, 5) visible Raider intent (Yusuf's version exists) |
| C. More abilities via jobs | Only with option 3B |

**Rec: B, in the research's order (forecast + retune first: cheap and measurable)**, tested as a short Stage 1 close-out before the slice. The Chapel Ford's "kill the Captain" goal is already one non-kill objective.

✅ **Decided (Cletus, 2026-11-02): no cooldowns, no generic cost.** Abilities are usable every turn. An ability's only cost is a drawback built into what it does (his example: "you smash into the ground and now you're stuck in the ground for a turn"). **Done in v0.13.0:** cooldowns removed; Pinning Shot now *plants* you (no moving that turn), Vault Strike has a *hard landing* (no moving after); Shield Wall (Slowed) and Plunging Shot (Exposed) keep their existing drawbacks; Bash, Hook, Brace and Feint have none. See [DESIGN.md → Abilities](DESIGN.md#abilities-v04--two-per-class-all-about-position).

**Later (not now): Magic & MP.** Cletus expects to add magic and an MP pool later. Until then, nothing costs MP; when it comes, MP is for spells, and the physical abilities keep their built-in drawbacks. (Parked in the [ROADMAP](ROADMAP.md#parking-lot).)

### 7. Art direction
✅ FF-based, FFTA2-style portraits. Still to choose:
| Option | What |
|---|---|
| **A. 2D sprites on iso tiles** | FFTA/FFTA2 lineage; matches the portraits |
| B. HD-2D (sprites in a lit 3D world) | Striking; costly, needs an engine |
| C. Low-poly 3D | Flexible camera; drifts from FFTA2 |

**Rec: A**, with a **pre-made portrait set** (8–12 for the hero, one per companion) rather than a builder. Commission one test piece (a portrait plus a unit sprite) during Stage 3 to set the bar and the cost.

### 8. Platform & controls
| Option | What |
|---|---|
| A. Phone only | Web/PWA, then App Store / Google Play |
| **B. Phone + PC (Steam)** | Touch and controller/keyboard from one input layer |
| C. + Switch | Biggest tactics audience; console certification and an engine requirement |

**Rec: B. Phone-first, with Steam + controller support from the slice on.** Input is already abstract (pad, A/B, keys; v0.12 confirms aren't touch-only). Keep Switch as a stretch target, and let that weigh on #9.

### 9. Tech for production
| Option | What | For / against |
|---|---|---|
| **A. Grow this codebase** | Plain JS → TypeScript + a renderer (PixiJS/WebGL) for real art; Capacitor (iOS/Android) and Tauri/Electron (Steam) wrappers | Keeps the node-safe rules + balance sim (`tools/sim.mjs`) and fast phone playtests via Pages; consoles hard |
| B. Godot 4 | Rebuild the rules and UI in GDScript/C# | Free; good 2D; console ports via partners; loses the JS sim (port it) |
| C. Unity | Industry standard; console ready | Licensing history, heavier; full rebuild |

**Rec: A, unless Switch becomes a must** (then B). The rules modules (game, ai, hero, party, missions) are already engine-agnostic and sim-tested. The rebuild cost sits in rendering and UI, which the slice redoes anyway.

### 10. Story & mythology timing
| Option | What |
|---|---|
| **A. Premise now, mythology "door ajar"** | Write the premise and the hero's fixed origin in Stage 3. Mythology stays hints (the reliquary, Wren's humming amulet, Ingvar's relic orders) through chapter 1; decide how real it gets by chapter 2 |
| B. Historical first | No uncanny until late; a safer tone, but we lose the hook |
| C. Mythology central | Relics/djinn drive the plot from the start; a bigger writing and art load |

**Rec: A.** The v0.11 thread (the Red Captain, the empty reliquary) is a cheap test of whether hints land.

### 11. What the vertical slice (Stage 4) contains
**Rec: Chapter 1, polished, about 2 hours:**
- hero creation (final UI, pre-made FFTA2-style portraits)
- a chapter board: 3 recruit jobs + 1–2 side jobs + the finale (e.g. a reworked Chapel Ford)
- 3 companions with final portraits, sprites, join scenes and finale payoffs
- a camp screen with trade-off gear and one class-branch milestone (#3, #5)
- the ability fixes (#6)
- 5–6 maps that pass the map rule
- sound and music
- save/continue
- touch + controller + keyboard
- a light first-battle onboarding with no tutorial popups (pillar 1)

Built on the chosen tech (#9) for phone + Steam (#8).

### 12. Budget, team & "commercial quality"
| Option | What |
|---|---|
| **A. Solo dev + contract art/music** | Keeps control; art is the main cost |
| B. Small team | Faster; needs funding |
| C. Publisher after the slice | The slice is the pitch |

**Rec: A through the slice, then decide on C with the slice in hand.** Define "commercial quality" as: final art and audio, no placeholder text, stable saves, 60 fps on a mid-range phone, and controller parity.

---

**Next step:** Cletus marks each decision (keep / change / park). Then the answers become a one-page **game brief** and a slice plan (the Stage 3 done-when).
