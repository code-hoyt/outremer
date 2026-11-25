# Outremer: decision log

Every locked decision, one numbered entry each, grouped by topic. Open questions are not decisions; they live in [TASKS.md](TASKS.md). The fuller write-ups stay in the linked docs.

## How to use this log

- **IDs are five digits**, zero-padded: D-00001, D-00201, and so on. Always write all five digits. (On 2026-11-23 every ID was padded from three digits to five; the numbers themselves did not change.)
- **Numbers are permanent.** A number is never reused or renumbered. Numbers were assigned in date order when the log was backfilled (2026-11-23), so D-00001 is the oldest; new entries take the next free number, whatever their topic.
- **Never delete an entry.** When a decision changes, add a new entry with `Replaces: D-xxxxx`, and set the old entry's Status to `Replaced by D-yyyyy (YYYY-MM-DD)`. A dropped decision with no replacement gets `Retired (YYYY-MM-DD)`.
- **Open questions are not decisions.** They stay in [TASKS.md](TASKS.md) until Cletus locks them.
- **Every lock gets an entry in the same commit** as the doc change that records it.
- **Keep the format exact** so it can be searched: a `### D-NNNNN · Title` heading (grep -E `^### D-[0-9]{5} `), then the six fields below, in this order. Find active decisions with `grep -A1 'Status: Active'`, or one topic by its section.
- Dates come from the docs; where a doc gave none, the date is when the text was first committed (git log).

Entry format:

```
### D-xxxxx · Short title
- Date: YYYY-MM-DD
- Status: Active | Replaced by D-xxxxx (YYYY-MM-DD) | Retired (YYYY-MM-DD)
- Replaces: D-xxxxx (or none)
- Decision: one or two sentences.
- Why: one sentence, or Not recorded.
- Source: relative doc link(s) with section anchor.
```

## Topics

- [Pillars & scope](#pillars--scope)
- [Systems](#systems)
- [Classes](#classes)
- [Races & world](#races--world)
- [Story](#story)
- [Characters](#characters)
- [Campaign & missions](#campaign--missions)
- [Recruiting](#recruiting)
- [Slice plan](#slice-plan)
- [UI & controls](#ui--controls)
- [Art & audio](#art--audio)
- [Process](#process)

## Pillars & scope

### D-00001 · Pillar: no stop-and-press chores
- Date: 2026-10-31
- Status: Retired (2026-11-15)
- Replaces: none
- Decision: No stop-and-press chores.
- Why: Not recorded
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus)

### D-00002 · Pillar: customization and replay variety
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Customization, and every playthrough feels different: squad building, class mixes and (later) variable maps and encounters.
- Why: Not recorded
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus)

### D-00003 · Pillar: trade-off upgrades over pure power
- Date: 2026-10-31
- Status: Replaced by D-00205 (2026-11-23)
- Replaces: none
- Decision: An upgrade should change how a unit plays, not just make numbers bigger.
- Why: Not recorded
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus)

### D-00004 · Pillar: story later, with room for mythology
- Date: 2026-10-31
- Status: Replaced by D-00027 (2026-11-02)
- Replaces: none
- Decision: Story comes later, leaving room for mythology.
- Why: Not recorded
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus)

### D-00005 · Pillar: classes move differently
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Party building where classes move differently (FFTA-style): class determines move, jump and terrain affinity.
- Why: Not recorded
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus)

### D-00006 · Pillar: flanking and positioning are central
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Flanking and positioning are central to combat.
- Why: Not recorded
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus)

### D-00007 · Goal: a commercial game Cletus releases
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Outremer should become a full, commercial-quality game that Cletus releases; today's builds are prototypes that answer design questions.
- Why: Not recorded
- Source: [ROADMAP.md → Goal](ROADMAP.md#goal)

### D-00022 · Combat stays our tactics system, not D&D
- Date: 2026-11-01
- Status: Active
- Replaces: none
- Decision: The structure borrows from Baldur's Gate; the rules don't. Combat stays our own tactics system.
- Why: Not recorded
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure)

### D-00027 · Mythology central from the start
- Date: 2026-11-02
- Status: Active
- Replaces: D-00004
- Decision: Relics and the uncanny drive the plot from the start; the premise is written in a dedicated story session and told in-engine, FFTA2-style.
- Why: Stage 3 #10: Cletus rejected 'premise now, mythology door ajar' and historical-first.
- Source: [DESIGN.md → Design pillars (from Cletus)](DESIGN.md#design-pillars-from-cletus), [archive/stage3-decisions.md → 10. Story & mythology ✅](archive/stage3-decisions.md#10-story--mythology-)

### D-00028 · Campaign of about 5 chapters
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: About 5 chapters, each an FFTA2-style open board built around a mission tree that ends in a story finale.
- Why: Linear chapters were weakest on replay variety; a roguelite fought the named-character story.
- Source: [archive/stage3-decisions.md → 1. Campaign scope & structure ✅](archive/stage3-decisions.md#1-campaign-scope--structure-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00029 · Phone first plus Steam with controller
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Phone first plus Steam with full controller support; Switch is a stretch at most.
- Why: Switch as a target would force an engine change.
- Source: [archive/stage3-decisions.md → 8. Platform & controls ✅](archive/stage3-decisions.md#8-platform--controls-), [GAME-BRIEF.md](GAME-BRIEF.md)

### D-00030 · Grow this codebase in TypeScript
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Grow this codebase: TypeScript plus a renderer (e.g. PixiJS), Capacitor for phones, Tauri or Electron for Steam; keep the balance sim and engine-agnostic rules modules.
- Why: Godot would lose the JS sim; Unity meant licensing and a full rebuild.
- Source: [archive/stage3-decisions.md → 9. Tech ✅](archive/stage3-decisions.md#9-tech-)

### D-00031 · Cletus solo; publishers after the slice
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Cletus works solo with AI partners; publishers are decided after the vertical slice.
- Why: Contract art/music and a funded team were rejected.
- Source: [archive/stage3-decisions.md → 12. Team & budget ✅](archive/stage3-decisions.md#12-team--budget-)

### D-00032 · What commercial quality means
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Final art and audio, no placeholder text, stable saves, 60 fps on a mid-range phone, and controller parity.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 12. Team & budget ✅](archive/stage3-decisions.md#12-team--budget-), [GAME-BRIEF.md](GAME-BRIEF.md)

### D-00205 · Pillar: trade-off upgrades (no armor-weight example)
- Date: 2026-11-23
- Status: Active
- Replaces: D-00003
- Decision: An upgrade should change how a unit plays, not just make numbers bigger; the old 'heavier armor = shorter move / lower jump' example is struck.
- Why: The no-general-armor-penalty lock (D-00189) overrides the example.
- Source: [DESIGN.md → Pillars](DESIGN.md#design-pillars-from-cletus), [DESIGN.md → Armor penalties (locked 2026-11-23)](DESIGN.md#armor-penalties-locked-2026-11-23)

## Systems

### D-00008 · CT turn order
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: FFTA-like CT: each tick a unit gains CT equal to SPD and acts at 100; moving and acting costs 100, one of them 80, neither 60, so waiting is a real choice.
- Why: Not recorded
- Source: [DESIGN.md → Turn order — CT system (FFTA-like)](DESIGN.md#turn-order--ct-system-ffta-like)

### D-00009 · Class decides movement
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: MOV, JUMP and terrain costs come from class only and are never rolled.
- Why: Not recorded
- Source: [DESIGN.md → Movement — classes move differently](DESIGN.md#movement--classes-move-differently), [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure)

### D-00011 · Facing, flanking and height modify combat
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Front/side/back hits change damage and hit chance; each extra adjacent ally adds a flank bonus; height adds damage, hit and archer range.
- Why: Not recorded
- Source: [DESIGN.md → Facing, flanking & positioning](DESIGN.md#facing-flanking--positioning), [DESIGN.md → Combat formula](DESIGN.md#combat-formula)

### D-00012 · Height: plus or minus 10% per level
- Date: 2026-10-31
- Status: Replaced by D-00035 (2026-11-02)
- Replaces: none
- Decision: Height gave ±10% damage per level (clamped 0.7–1.4), ±3% hit and +1 archer range per 2 levels.
- Why: Not recorded
- Source: [DESIGN.md → Facing, flanking & positioning](DESIGN.md#facing-flanking--positioning)

### D-00013 · Abilities with cooldowns (v0.4)
- Date: 2026-10-31
- Status: Replaced by D-00037 (2026-11-02)
- Replaces: none
- Decision: Two abilities per class, each with a cooldown.
- Why: Not recorded
- Source: [ROADMAP.md → Stage 1 — Combat prototype ✅ (closed into Stage 4)](ROADMAP.md#stage-1--combat-prototype--closed-into-stage-4)

### D-00024 · Hero creation: stats, class, portrait
- Date: 2026-11-01
- Status: Replaced by D-00202 (2026-11-23)
- Replaces: none
- Decision: Creation choices are stats, class and portrait only, with one fixed background; name entry is a formality.
- Why: A fixed origin lets the story be written around it.
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure), [GAME-BRIEF.md](GAME-BRIEF.md)

### D-00025 · BG-style rolled stats
- Date: 2026-11-01
- Status: Replaced by D-00203 (2026-11-23)
- Replaces: none
- Decision: Stats are rolled BG-style with unlimited rerolls, point moving within a floor and cap, and Store/Recall for one roll.
- Why: Not recorded
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure)

### D-00026 · Six stats
- Date: 2026-11-01
- Status: Active
- Replaces: none
- Decision: Six stats: Might, Endurance, Fortitude, Agility, Aim and Resolve, each feeding a combat number.
- Why: Not recorded
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure)

### D-00035 · Softer, capped height (v0.10)
- Date: 2026-11-02
- Status: Active
- Replaces: D-00012
- Decision: Height gives +5% melee/abilities and +3% ranged per level above, −5% per level below, clamped ×0.85–1.1, ±2% hit, archers +1 range per 3 levels.
- Why: On The Breach the raider archer dominated from the wall and couldn't be countered.
- Source: [DESIGN.md → Facing, flanking & positioning](DESIGN.md#facing-flanking--positioning)

### D-00036 · Every tile reachable at MOV 2 / JUMP 2
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Every walkable tile on every map must be reachable by a MOV 2 / JUMP 2 unit (also held to JUMP 1), checked by `tools/reach.mjs`.
- Why: High ground was unreachable for many units and gave the archer total dominance.
- Source: [DESIGN.md → Map rule: everywhere is reachable (v0.10)](DESIGN.md#map-rule-everywhere-is-reachable-v010)

### D-00037 · No cooldowns; drawbacks are the cost
- Date: 2026-11-02
- Status: Active
- Replaces: D-00013
- Decision: An ability takes your Action and is usable every turn; its only cost is a drawback built into what it does.
- Why: Not recorded
- Source: [DESIGN.md → Abilities (cost model)](DESIGN.md#abilities-cost-model), [archive/stage3-decisions.md → 6. Abilities ✅](archive/stage3-decisions.md#6-abilities-)

### D-00038 · Build research fixes 1 and 4
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Add an Action-menu forecast plus end-of-battle tally, and maps with deadly edges or goals other than kill-all; fixes 2, 3 and 5 are rejected.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 6. Abilities ✅](archive/stage3-decisions.md#6-abilities-), [research/README.md](research/README.md)

### D-00039 · Magic and MP parked
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Magic and MP come later; MP is for spells and physical abilities keep built-in drawbacks.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 6. Abilities ✅](archive/stage3-decisions.md#6-abilities-), [TASKS.md → Parking lot](TASKS.md#parking-lot)

### D-00040 · Fixed class for life
- Date: 2026-11-02
- Status: Replaced by D-00101 (2026-11-11)
- Replaces: none
- Decision: Each unit keeps one class for life, which keeps its movement identity.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 3. Classes & hero growth ✅](archive/stage3-decisions.md#3-classes--hero-growth-)

### D-00041 · Pick 1 of 2 class branches at milestones
- Date: 2026-11-02
- Status: Replaced by D-00152 (2026-11-18)
- Replaces: none
- Decision: At milestones a unit picks 1 of 2 branches (e.g. Knight to Bulwark or Lancer).
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 3. Classes & hero growth ✅](archive/stage3-decisions.md#3-classes--hero-growth-)

### D-00042 · Gear teaches abilities you keep
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Some gear teaches an ability, and once learned you keep it.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 3. Classes & hero growth ✅](archive/stage3-decisions.md#3-classes--hero-growth-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00043 · One borrowed secondary skill set
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: A unit can use one secondary skill set from another class; movement stays its own.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 3. Classes & hero growth ✅](archive/stage3-decisions.md#3-classes--hero-growth-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00044 · FFTA2-style XP leveling, stats 1–100, cap 50
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: XP from fights; level-ups only raise stats, with class-specific gains; stats max 100 and level cap 50.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 3. Classes & hero growth ✅](archive/stage3-decisions.md#3-classes--hero-growth-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00045 · FFTA2-style world map between battles
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: A world map of nodes: change party and gear anywhere, shops and missions only in towns, side jobs on the way, no return to town during multi-part jobs.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 5. Between battles ✅](archive/stage3-decisions.md#5-between-battles-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00046 · Prototype carry-over: party and flags only
- Date: 2026-11-02
- Status: Replaced by D-00047 (2026-11-02)
- Replaces: none
- Decision: Between prototype battles only the party and story flags carry over: full HP, no wounds, no loot.
- Why: Not recorded
- Source: [ROADMAP.md → Stage 2 — Core loop prototype ✅ DONE](ROADMAP.md#stage-2--core-loop-prototype--done)

### D-00047 · Wounds, not permadeath
- Date: 2026-11-02
- Status: Active
- Replaces: D-00046
- Decision: A fallen companion is Wounded for the next battle; if the hero falls the battle is lost.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 5. Between battles ✅](archive/stage3-decisions.md#5-between-battles-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00048 · Gear is mostly stats; rare gear does more
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Gear is mostly stats; rare gear teaches abilities or gives perks with a trade-off.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 5. Between battles ✅](archive/stage3-decisions.md#5-between-battles-)

### D-00049 · Squad of 3
- Date: 2026-11-02
- Status: Replaced by D-00067 (2026-11-09)
- Replaces: none
- Decision: The party is the hero plus 2 (squad of 3 all game), plus a few solo or duo story missions.
- Why: Mass Effect feel.
- Source: [archive/stage3-decisions.md → 2. Party size ✅](archive/stage3-decisions.md#2-party-size-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00067 · About 6 units deploy from a larger roster
- Date: 2026-11-09
- Status: Active
- Replaces: D-00049
- Decision: FFTA2-style clans: about 6 units deploy per battle from a larger roster; a few story missions may be solo or duo.
- Why: Not recorded
- Source: [DESIGN.md → Party size (2026-11-09)](DESIGN.md#party-size-2026-11-09), [DESIGN.md → Later locks that override Stage 3](DESIGN.md#later-locks-that-override-stage-3)

### D-00068 · FFTA2-style class progression
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Basic classes unlock more advanced and unique options, FFTA2-style.
- Why: Not recorded
- Source: [DESIGN.md → Classes (2026-11-09)](DESIGN.md#classes-2026-11-09)

### D-00101 · Free class switching between battles
- Date: 2026-11-11
- Status: Active
- Replaces: D-00040
- Decision: Units can switch class freely between battles (FFT-style), never mid-fight; class sets MOV/JUMP/terrain and learned abilities are kept.
- Why: The trade-off is time: battles spent on one class are not spent on another.
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11), [DESIGN.md → Later locks that override Stage 3](DESIGN.md#later-locks-that-override-stage-3)

### D-00102 · Classes unlock by gear mastery; special classes by quests
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Most classes unlock by mastering abilities from gear in prerequisite classes; special classes unlock through quests.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00103 · Teaching gear from shops, never loot-gated
- Date: 2026-11-11
- Status: Replaced by D-00159 (2026-11-18)
- Replaces: none
- Decision: Teaching gear must be obtainable in shops, not loot-gated.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11), [CLASSES.md → Older draft (v0.1, 2026-11-12)](CLASSES.md#older-draft-v01-2026-11-12)

### D-00104 · Class-gated weapons with an Equip X escape hatch
- Date: 2026-11-11
- Status: Replaced by D-00165 (2026-11-18)
- Replaces: none
- Decision: Weapon types are gated by class, with an 'Equip X' ability that costs one carried ability slot.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00105 · Sideways class tree; every ability has a cost
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Later classes differ rather than beat earlier ones, every class keeps a niche, every ability carries a cost, and maps reward different builds.
- Why: Avoid trap classes and a single dominant combo.
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00139 · No fog of war
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: The whole battlefield is always visible; don't design abilities around vision or hidden units.
- Why: Not recorded
- Source: [DESIGN.md → No fog of war (locked 2026-11-17)](DESIGN.md#no-fog-of-war-locked-2026-11-17)

### D-00152 · Class branches at milestones cut
- Date: 2026-11-18
- Status: Active
- Replaces: D-00041
- Decision: Stage 3's 'pick 1 of 2 branches at milestones' is cut; free class switching replaces it.
- Why: Not recorded
- Source: [DESIGN.md → Later locks that override Stage 3](DESIGN.md#later-locks-that-override-stage-3), [GAME-BRIEF.md](GAME-BRIEF.md)

### D-00153 · Kit: 1 reaction plus 1 passive
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: FFTA2 style: each unit equips 1 reaction and 1 passive.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00154 · Kit: signatures are learned from gear
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Signature moves are learned from gear like any other ability, early or late, not built in.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00155 · Kit: one borrowed set from any learned class
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: One secondary set from any class the unit has learned at least one ability in; signatures can be borrowed.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00156 · Kit: five flexible equipment slots
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Five open slots in any order; hands limit weapons and shields; one head, body and feet piece each; trinkets uncapped.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00157 · Kit: armor gated by class
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Each class has an armor list (heavy, light, robes), FFTA2-style, with no weight-based move or jump penalty.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00158 · Kit: any gear can teach abilities
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Weapons, armor and trinkets can all teach abilities; which item teaches what is set per item.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00159 · Kit: shops stock teaching gear; rares are found
- Date: 2026-11-18
- Status: Active
- Replaces: D-00103
- Decision: Shops are the main source of teaching gear and stock plenty; ordinary loot gives variants; rare items that teach rare skills have to be found.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00160 · Kit: AP only for units that fought
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Only units that fought earn AP; target roughly 3–5 battles to master an ability.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00161 · Kit: two-handers in; dual wield is a passive
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Two-handed weapons use both hands; dual wield is an unlockable passive, not a default.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00162 · Kit: FFTA2-sized class sets
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Each class has its signature plus 6–10 actions and roughly 2–4 reactions and passives.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18), [CLASSES.md → 5. Supporting notes](CLASSES.md#5-supporting-notes)

### D-00163 · Kit: race-themed abilities via race-locked classes
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Any learned ability can be equipped; race-themed abilities come from race-locked classes, so in practice only that race learns them.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00164 · Kit: meters, combos and summons parked
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Meters/gauges, combo attacks and summons are parked until the core kit is proven.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18), [TASKS.md → Parking lot](TASKS.md#parking-lot)

### D-00165 · Kit: Equip X uses the passive slot
- Date: 2026-11-18
- Status: Active
- Replaces: D-00104
- Decision: 'Equip X' abilities use the single passive slot, so breaking a class's gear limits costs the unit its passive.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18), [CLASSES.md → 5. Supporting notes](CLASSES.md#5-supporting-notes)

### D-00166 · Kit: Item uses the borrowed slot
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Item is a set like any other and uses the borrowed slot.
- Why: Not recorded
- Source: [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18)

### D-00176 · Field objects
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: Abilities can place one-cell field objects that grant a command to adjacent units (enemies too unless stated); each type has HP, is indestructible, or isn't targetable.
- Why: Not recorded
- Source: [DESIGN.md → Field objects (locked 2026-11-19)](DESIGN.md#field-objects-locked-2026-11-19)

### D-00189 · No general armor penalty
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: No move, jump, flight or evasion loss just for wearing heavy armor; any penalty belongs to a specific armor piece and its lore.
- Why: Not recorded
- Source: [DESIGN.md → Armor penalties (locked 2026-11-23)](DESIGN.md#armor-penalties-locked-2026-11-23)

### D-00202 · No created character: you play as Tristan
- Date: 2026-11-23
- Status: Active
- Replaces: D-00024
- Decision: There is no hero creation (no stats, class or portrait pick, no creation wizard); the player plays as Tristan, the fixed protagonist.
- Why: Not recorded
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure), [GAME-BRIEF.md](GAME-BRIEF.md), [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order), [ROADMAP.md → Stage 4 — Vertical slice](ROADMAP.md#stage-4--vertical-slice--next)

### D-00203 · No rolled stats
- Date: 2026-11-23
- Status: Active
- Replaces: D-00025
- Decision: Stats are not rolled; Tristan's stats come from his class and growth like any other unit's.
- Why: Follows from no created character (D-00202).
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00210 · World map: Option A for the slice, Option B from Chapter 2
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Chapter 1 uses Option A, a fixed hand-made node map split into regions, with a town in each, one-day travel per node, and consecration unlocking a node's fixed offering after Act 1. From Chapter 2, Option B layers on: when you consecrate a node you choose what it becomes from 2 or 3 options, and neighboring holy nodes could combine for a bonus. Slice node and map data should be built so Option B can sit on top. A walkable overworld (Option C) is not used.
- Why: Option A already matches the Stage 3 node-map plan (D-00045) and fits a phone; Option B's chosen blessings wait until consecration is in play from Chapter 2.
- Source: [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [research/2026-11-23-tactics-world-maps.md](research/2026-11-23-tactics-world-maps.md)

## Classes

### D-00050 · Physician and a magic class later
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: One or two new classes come later: the Physician, and a magic class when magic arrives.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 3. Classes & hero growth ✅](archive/stage3-decisions.md#3-classes--hero-growth-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00106 · Story heroes get unique classes and generic ones
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Each story hero has a unique, sideways class unlocked through that hero's side quests, and can also take generic classes.
- Why: To pull players into the side-quest trees.
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11), [CLASSES.md → 4. Hero unique classes (sketch only; story not locked)](CLASSES.md#4-hero-unique-classes-sketch-only-story-not-locked)

### D-00107 · FFTA2-style race locks on classes
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: A shared core of classes that not every race can take, plus a few race-only classes per race.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00120 · Tristan's unique class named Templar (draft)
- Date: 2026-11-12
- Status: Replaced by D-00140 (2026-11-17)
- Replaces: none
- Decision: Tristan's sketched unique class was named Templar, with Beauséant and Non Nobis.
- Why: Not recorded
- Source: [CLASSES.md → 4. Hero unique classes (sketch only; story not locked)](CLASSES.md#4-hero-unique-classes-sketch-only-story-not-locked)

### D-00134 · Human race classes lean to leadership and faith
- Date: 2026-11-15
- Status: Active
- Replaces: none
- Decision: Human race classes lean toward leadership and faith.
- Why: Not recorded
- Source: [CLASSES.md → Racial callings — class direction and other class ideas](CLASSES.md#racial-callings--class-direction-and-other-class-ideas)

### D-00135 · Ifriti magic is sworn
- Date: 2026-11-15
- Status: Replaced by D-00143 (2026-11-17)
- Replaces: none
- Decision: Ifriti race-class magic is sworn: each vow grants power with a limit attached.
- Why: Not recorded
- Source: [CLASSES.md → Racial callings — class direction and other class ideas](CLASSES.md#racial-callings--class-direction-and-other-class-ideas)

### D-00136 · Cynocephali race classes start as protectors
- Date: 2026-11-15
- Status: Active
- Replaces: none
- Decision: Cynocephali race classes start as protectors and bodyguards.
- Why: Not recorded
- Source: [CLASSES.md → Racial callings — class direction and other class ideas](CLASSES.md#racial-callings--class-direction-and-other-class-ideas)

### D-00137 · Peri race class built for demon-slaying
- Date: 2026-11-15
- Status: Active
- Replaces: none
- Decision: The Peri class is built for demon-slaying out of an old grudge.
- Why: Not recorded
- Source: [CLASSES.md → Racial callings — class direction and other class ideas](CLASSES.md#racial-callings--class-direction-and-other-class-ideas)

### D-00140 · Templar Knight is the Human race class
- Date: 2026-11-17
- Status: Active
- Replaces: D-00120
- Decision: The Human race class is the Templar Knight, a fighter-leaning holy warrior whose weapon strikes carry holy damage; healing belongs to a future Hospitaller.
- Why: Not recorded
- Source: [CLASSES.md → Templar Knight](CLASSES.md#templar-knight), [WORLD.md → First race classes](WORLD.md#first-race-classes)

### D-00141 · Templar Knight weapons
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: One-handed swords and shields only.
- Why: Not recorded
- Source: [CLASSES.md → Templar Knight](CLASSES.md#templar-knight)

### D-00142 · Templar Knight signature: Smite
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: Smite: a holy strike doing 1.5x against demons and the profane, with no downside.
- Why: Not recorded
- Source: [CLASSES.md → Templar Knight](CLASSES.md#templar-knight)

### D-00143 · Oath Mage is the Ifriti race class
- Date: 2026-11-17
- Status: Active
- Replaces: D-00135
- Decision: Oaths buff one stat for the whole team and impose a random FFTA-style law; breaking it breaks the oath with a penalty that mirrors it.
- Why: Not recorded
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00144 · Oath duration matched to strength
- Date: 2026-11-17
- Status: Replaced by D-00168 (2026-11-18)
- Replaces: none
- Decision: Every oath ends if the Oath Mage falls; stronger oaths last set rounds, milder ones until battle end or the law breaks.
- Why: Not recorded
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00145 · Oaths stack, and so do laws
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: Oaths stack and each copy adds its own law; each oath is once per battle or stackable, set per oath.
- Why: Not recorded
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00146 · Single-target oaths
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: Some powerful oaths affect one unit, and each mage can place one.
- Why: Not recorded
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00147 · Shieldbrother is the Cynocephali race class
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: A shield-wall guardian that takes hits for adjacent allies; signature Guard redirects attacks on one ally to it until its next turn.
- Why: Not recorded
- Source: [CLASSES.md → Shieldbrother](CLASSES.md#shieldbrother)

### D-00148 · Shieldbrother weapons
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: Shield and mace; one standard shield type for now.
- Why: Not recorded
- Source: [CLASSES.md → Shieldbrother](CLASSES.md#shieldbrother)

### D-00149 · Roost-Keeper is the Hoopoe-kin race class
- Date: 2026-11-17
- Status: Replaced by D-00178 (2026-11-19)
- Replaces: none
- Decision: Sets up roosts that allies teleport between; reworked the same day into a bird whisperer whose flock carries units. Roosts are usable by enemies.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster), [WORLD.md → First race classes](WORLD.md#first-race-classes)

### D-00150 · Div-Hunter is the Peri race class
- Date: 2026-11-17
- Status: Active
- Replaces: none
- Decision: A slayer deadly against demons with a flower-and-scent theme, reaching targets with wing hop, glide and dive; no iron weakness.
- Why: Not recorded
- Source: [CLASSES.md → Div-Hunter](CLASSES.md#div-hunter), [WORLD.md → First race classes](WORLD.md#first-race-classes)

### D-00151 · Div-Hunter uses a light blade
- Date: 2026-11-17
- Status: Replaced by D-00185 (2026-11-22)
- Replaces: none
- Decision: The Div-Hunter is a fast striker with a light blade.
- Why: Not recorded
- Source: [CLASSES.md → Div-Hunter](CLASSES.md#div-hunter)

### D-00167 · Templar Knight kit
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Actions Smite, Judgment, Shield Bash of Faith, Non Nobis, Beauséant, Relic Blade; reactions Martyr's Resolve, Rebuke; passives Last Stand, Holy Ground.
- Why: Not recorded
- Source: [CLASSES.md → Templar Knight](CLASSES.md#templar-knight)

### D-00168 · Oaths last 3 turns
- Date: 2026-11-18
- Status: Active
- Replaces: D-00144
- Decision: Every oath lasts 3 turns (starting value) and then is fulfilled; it still ends if the Oath Mage falls.
- Why: Not recorded
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00169 · Oath Mage gear
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Book of covenants only; robes only.
- Why: Not recorded
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00170 · Oath Mage kit
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Signature Seal the Page (learned late); six oaths and Covenant; no damage skill and no escape move; reactions Sworn Witness, Last Word; passives Word Kept, Burden of the Law.
- Why: Reactions and passives should be worth equipping on other classes.
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00171 · Shieldbrother armor
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Heavy armor only.
- Why: Not recorded
- Source: [CLASSES.md → Shieldbrother](CLASSES.md#shieldbrother)

### D-00172 · Div-Hunter signature: Scent of Paradise
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: A strike that leaves a holy fragrance, burning demons each turn and stopping them healing.
- Why: Not recorded
- Source: [CLASSES.md → Div-Hunter](CLASSES.md#div-hunter)

### D-00177 · Shieldbrother kit
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: Actions Guard, Ridge-Warden, Shield Shove, Bonebreaker, Hold the Gate; reaction Pack Instinct; passives Thick Skin, Christopher (may be cut).
- Why: Not recorded
- Source: [CLASSES.md → Shieldbrother](CLASSES.md#shieldbrother)

### D-00178 · Roost-Keeper renamed Rooster
- Date: 2026-11-19
- Status: Active
- Replaces: D-00149
- Decision: The class is renamed from Roost-Keeper to Rooster.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster)

### D-00179 · Rooster gear
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: Perch staff only; light armor only.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster)

### D-00180 · Rooster signature: Set Roost
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: Set Roost places a roost field object; adjacent units (enemies too) get Use Roost to fly to another roost.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster)

### D-00181 · Roosts are destructible
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: Roosts have HP and either side can destroy them; there is no remove-roost ability.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster)

### D-00183 · Rooster kit
- Date: 2026-11-22
- Status: Active
- Replaces: none
- Decision: Actions Pecking Swarm, Murmuration, Messenger Bird, Homing Call, Mobbing (no roost bonus), Airlift, Blackout, Flock Block; reaction Tailwind (speed boost when hit); passive Featherfall.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster)

### D-00184 · Ranged immunity belongs to the main archer class
- Date: 2026-11-22
- Status: Active
- Replaces: none
- Decision: A general full immunity to ranged attacks (like FFTA2's) goes in the main archer class's move list.
- Why: Not recorded
- Source: [CLASSES.md → Rooster](CLASSES.md#rooster)

### D-00185 · Div-Hunter: two-handed sword and heavy armor
- Date: 2026-11-22
- Status: Active
- Replaces: D-00151
- Decision: Two-handed sword only and heavy armor only; heavy armor doesn't limit wing hop, glide or dive.
- Why: Not recorded
- Source: [CLASSES.md → Div-Hunter](CLASSES.md#div-hunter)

### D-00190 · Oath Mage law pool
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Six laws for the slice. Mild: no items, no ranged attacks, no moving more than 3 tiles. Harsh: no abilities, no healing, no attacking the same enemy twice in a row.
- Why: Kept small for the slice as proof of concept.
- Source: [CLASSES.md → Oath Mage](CLASSES.md#oath-mage)

### D-00191 · Div-Hunter kit
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Actions Thorn Sweep, Rosewater Edge, Unmask, Lingering Bloom, Banish; reactions Iron Will, Ward of Petals; passive Eternal Spring (regen, but all healing received is reduced).
- Why: Not recorded
- Source: [CLASSES.md → Div-Hunter](CLASSES.md#div-hunter)

## Races & world

### D-00010 · No race movement modifiers; winged race parked
- Date: 2026-10-31
- Status: Replaced by D-00112 (2026-11-11)
- Replaces: none
- Decision: Races don't modify movement, and a winged race is parked.
- Why: Not recorded
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure), [ROADMAP.md → Parking lot](ROADMAP.md#parking-lot)

### D-00069 · Bestiary terms
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Imps, Wretches, Blights, Hollows, Gheists and the Fallen are lesser kinds; Fiends are mid-tier; Demons are stronger and named; Sulthrane is above them.
- Why: Not recorded
- Source: [DESIGN.md → Bestiary terms (LOCKED 2026-11-09)](DESIGN.md#bestiary-terms-locked-2026-11-09), [STORY.md → Act 1 beats after the tear (LOCKED 2026-11-09)](STORY.md#act-1-beats-after-the-tear-locked-2026-11-09)

### D-00108 · Four races, a possible fifth later
- Date: 2026-11-11
- Status: Replaced by D-00208 (2026-11-23)
- Replaces: none
- Decision: Four races (Humans plus three), with a possible fifth unlocked through quests later.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00109 · Races: Humans, Peri, Ifriti, Cynocephali
- Date: 2026-11-11
- Status: Replaced by D-00126 (2026-11-12)
- Replaces: none
- Decision: The races are Humans, Peri, Ifriti and Cynocephali (working names).
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11), [research/README.md](research/README.md)

### D-00110 · Real-world heroes are plain Humans
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: The real-world heroes are plain Humans; unique classes set them apart.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00111 · All races recruitable from the start
- Date: 2026-11-11
- Status: Replaced by D-00127 (2026-11-12)
- Replaces: none
- Decision: All races are recruitable from the start; race-specific quests unlock race classes.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00112 · Races have a stat lean and a movement quirk
- Date: 2026-11-11
- Status: Active
- Replaces: D-00010
- Decision: Each race has a small stat lean and one movement quirk on top of class movement; stat growth still comes from class.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11), [DESIGN.md → Later locks that override Stage 3](DESIGN.md#later-locks-that-override-stage-3)

### D-00113 · Monsters plus Fallen versions of each race
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Enemies include pure profane monsters and Fallen versions of each playable race; player units never fall.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00114 · Redeemed race on hold
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: The Redeemed are not used as a race for now.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00121 · Heroes land somewhere green, not desert
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: The landing must switch visibly from Crusader desert to an obviously different place such as green forest; desert can still appear as nodes.
- Why: Not recorded
- Source: [WORLD.md → Landing and first impression (locked 2026-11-12)](WORLD.md#landing-and-first-impression-locked-2026-11-12)

### D-00122 · Native Humans
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Native Humans descend from past crossings, look only slightly more tan, follow a cross faith under another name, are latecomers among older races, and dress in a fresh look of their own.
- Why: Not recorded
- Source: [WORLD.md → Humans of this world (locked 2026-11-12)](WORLD.md#humans-of-this-world-locked-2026-11-12)

### D-00123 · Humans: balanced, no quirk, widest class list
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Humans have balanced stats and no movement quirk; their edge is the widest class list.
- Why: Not recorded
- Source: [WORLD.md → Humans of this world (locked 2026-11-12)](WORLD.md#humans-of-this-world-locked-2026-11-12), [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00124 · Peri lore
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Peri are all-female, once demon worshippers driven out by Humans, now hidden among Humans with vanished wings and a light blue hair tell; most keep the old faith, and those who convert are called Fallen by their own.
- Why: Not recorded
- Source: [WORLD.md → Peri (in progress 2026-11-12)](WORLD.md#peri-in-progress-2026-11-12)

### D-00125 · Peri wings unlock through deeds
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Peri wings are biology, unlocked through play as a battle-forged trait: hop, then glide, then true flight, with no flight costs for now.
- Why: Not recorded
- Source: [WORLD.md → Peri (in progress 2026-11-12)](WORLD.md#peri-in-progress-2026-11-12)

### D-00126 · Peri become the hidden rare fifth race
- Date: 2026-11-12
- Status: Active
- Replaces: D-00109
- Decision: Peri are hidden and unlock as recruits through a Peri side-quest tree; a new small fourth main race is needed.
- Why: Not recorded
- Source: [WORLD.md → Race roster change (2026-11-12)](WORLD.md#race-roster-change-2026-11-12), [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00127 · Peri not recruitable from the start
- Date: 2026-11-12
- Status: Replaced by D-00192 (2026-11-23)
- Replaces: D-00111
- Decision: Peri are the exception to all-races-from-the-start: they unlock through their side-quest tree.
- Why: Not recorded
- Source: [WORLD.md → Peri (in progress 2026-11-12)](WORLD.md#peri-in-progress-2026-11-12), [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00128 · Hoopoe-kin are the fourth main race
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Small bird-folk couriers with wing-hands that flutter-hop but can't fly; no homeland, most common non-Human race, a magpie mix of faiths.
- Why: Not recorded
- Source: [WORLD.md → Hoopoe-kin (fourth main race, picked 2026-11-12)](WORLD.md#hoopoe-kin-fourth-main-race-picked-2026-11-12)

### D-00129 · Ifriti lore
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Tall, lanky, amber-eyed; oasis city-states; an older covenant with the same God; elder teachers to Humans; common in cities; recruited normally.
- Why: Not recorded
- Source: [WORLD.md → Ifriti](WORLD.md#ifriti)

### D-00130 · Ifriti: ashen skin with oath-brands
- Date: 2026-11-12
- Status: Replaced by D-00173 (2026-11-18)
- Replaces: none
- Decision: Ifriti had ashen gray-pale skin and glowing oath-brands as the race signature.
- Why: Not recorded
- Source: [WORLD.md → Ifriti](WORLD.md#ifriti)

### D-00131 · Cynocephali lore
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Pack-loyal and fierce, hunch-ruff bodies with baboon muzzles, highland clan-holds, the Christopher clans of the cross faith, sworn shield-kin of the Order.
- Why: Not recorded
- Source: [WORLD.md → Cynocephali](WORLD.md#cynocephali)

### D-00132 · Race footprint direction
- Date: 2026-11-12
- Status: Active
- Replaces: none
- Decision: Some cities are mixed and genuinely diverse, but not every race is everywhere, so some feel rare.
- Why: Not recorded
- Source: [WORLD.md → Race footprint (Cletus 2026-11-12, direction)](WORLD.md#race-footprint-cletus-2026-11-12-direction)

### D-00138 · Racial callings
- Date: 2026-11-15
- Status: Active
- Replaces: none
- Decision: Humans: holy orders and command. Ifriti: oath-mages. Cynocephali: shield-wall guardians. Hoopoe-kin: scouts and messengers. Peri: div-hunters.
- Why: Not recorded
- Source: [WORLD.md → Racial callings (class groundwork, started 2026-11-15)](WORLD.md#racial-callings-class-groundwork-started-2026-11-15)

### D-00173 · Ifriti: dark leathery ancient skin
- Date: 2026-11-18
- Status: Active
- Replaces: D-00130
- Decision: Ifriti skin is dark and leathery, wrinkled and ancient but dignified; oath-brands dropped as a race trait (the oath look lives in the Oath Mage).
- Why: Follows Guilhem's locked Oath Mage plate.
- Source: [WORLD.md → Ifriti](WORLD.md#ifriti), [WORLD.md → First race classes](WORLD.md#first-race-classes)

### D-00192 · Four main races from the start plus hidden Peri
- Date: 2026-11-23
- Status: Active
- Replaces: D-00127
- Decision: Human, Ifriti, Cynocephali and Hoopoe-kin are recruitable from the start, plus the hidden Peri.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00208 · Four main races plus the hidden Peri
- Date: 2026-11-23
- Status: Active
- Replaces: D-00108
- Decision: Four main races (Human, Ifriti, Cynocephali, Hoopoe-kin) plus the hidden Peri as a fifth, unlocked through their side-quest tree.
- Why: The old 'four races, a fifth later' wording predates Hoopoe-kin and the hidden Peri.
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00215 · Eighth Day writ-board for quests and companies
- Date: 2026-11-24
- Status: Active
- Replaces: none
- Decision: Quests are sealed writs cried and posted at a public town board (church door, market cross, or Order gatehouse); the Order of the Eighth Day is the principal poster, and town councils, castellans, and abbeys can post too. Independent sworn companies form because the Order and the towns cannot cover every road themselves; a company may be a friend or term-servant of the Eighth Day without being the Order. Larger or multi-part commissions can carry written terms, and the starting town's roads can have road-brotherhood flavor. Exact in-world names for the writs and the board stay open.
- Why: Cletus picked Option A from the medieval-companies report as the core model, with light touches of B, C, and D as the report recommended. This gives Dismas's quest-taking company (D-00214) and the Order's job-posting (D-00086) a shared in-world reason, without turning the board into a generic adventurers' guild or making the clan a branch of the Order.
- Source: [WORLD.md → Companies and quests (locked 2026-11-24)](WORLD.md#companies-and-quests-locked-2026-11-24), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [STORY.md → The Order of the Eighth Day (LOCKED 2026-11-09)](STORY.md#the-order-of-the-eighth-day-locked-2026-11-09), [research/2026-11-23-medieval-quest-companies.md](research/2026-11-23-medieval-quest-companies.md)

## Story

### D-00070 · Story core
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: The player should end satisfied and happy; the Christian knights are the good guys, shown through deeds; the tone is clear, triumphant and heroic.
- Why: Not recorded
- Source: [STORY.md → Core (locked 2026-11-09)](STORY.md#core-locked-2026-11-09)

### D-00071 · Antagonists
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: A human antagonist early who serves a darker power; demons are real; saints and angels are on the side of the light.
- Why: Not recorded
- Source: [STORY.md → Antagonists (locked 2026-11-09)](STORY.md#antagonists-locked-2026-11-09)

### D-00072 · The supernatural is open from the start
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: The supernatural is accepted from the start, and the war escalates until its demonic scale is revealed.
- Why: Not recorded
- Source: [STORY.md → How real the myth is (locked 2026-11-09)](STORY.md#how-real-the-myth-is-locked-2026-11-09)

### D-00073 · Lightly fictionalized Crusades
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Our own characters, towns and castles in the real Crusader states, with real kings and campaigns in the background.
- Why: Not recorded
- Source: [STORY.md → Setting (locked 2026-11-09)](STORY.md#setting-locked-2026-11-09)

### D-00074 · The other side is a spiritual layer
- Date: 2026-11-09
- Status: Replaced by D-00133 (2026-11-12)
- Replaces: none
- Decision: The story's other side was framed as a spiritual layer of our world.
- Why: Not recorded
- Source: [STORY.md → Setting (locked 2026-11-09)](STORY.md#setting-locked-2026-11-09)

### D-00075 · A Satanist cult tears the veil
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: A Satanist cult tears the veil early in Act 1 and pulls the heroes into the other world, like the book in FFTA; the protagonist's arc runs from skepticism to conviction.
- Why: Not recorded
- Source: [STORY.md → Crossing over (locked 2026-11-09)](STORY.md#crossing-over-locked-2026-11-09)

### D-00076 · The squad is scattered by the tear
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: The squad is scattered when the veil tears, and finding each other is an early goal; the opening Fiend kills the Satanist who came through with the hero.
- Why: Not recorded
- Source: [STORY.md → Opening and the scattered squad (locked 2026-11-09)](STORY.md#opening-and-the-scattered-squad-locked-2026-11-09)

### D-00077 · Third squad member switches sides (direction TBD)
- Date: 2026-11-09
- Status: Replaced by D-00078 (2026-11-09)
- Replaces: none
- Decision: The third squad member switches sides; direction to be decided.
- Why: Not recorded
- Source: [STORY.md → Opening and the scattered squad (locked 2026-11-09)](STORY.md#opening-and-the-scattered-squad-locked-2026-11-09)

### D-00078 · Cast and reunion order
- Date: 2026-11-09
- Status: Active
- Replaces: D-00077
- Decision: A skeptical young Templar protagonist; reunions with the medic love interest, the hot-headed loyal friend, then the prodigal son who joined the enemy and returns.
- Why: Not recorded
- Source: [STORY.md → Cast so far (locked 2026-11-09)](STORY.md#cast-so-far-locked-2026-11-09)

### D-00079 · Hero names
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Tristan (MC), Aveline (medic, love interest), Godric (loyal friend), Lucien (prodigal son, Aveline's brother).
- Why: Making Lucien Aveline's brother makes his betrayal hit harder and his return pay off.
- Source: [STORY.md → Names (locked 2026-11-09)](STORY.md#names-locked-2026-11-09)

### D-00080 · Hero classes and backstories
- Date: 2026-11-09
- Status: Replaced by D-00206 (2026-11-23)
- Replaces: none
- Decision: Tristan a sword-and-shield Templar; Aveline a Hospital medic who grows into a Saint-Caller; Godric a heavy-hitting common sergeant; Lucien a fast skirmisher and scout.
- Why: Not recorded
- Source: [STORY.md → Classes and backstories (locked 2026-11-09)](STORY.md#classes-and-backstories-locked-2026-11-09)

### D-00081 · Villains and bound souls
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Guérin de Montclair, a charming baron secretly serving the cult, and Simeon the Lamp, a false prophet in the other world, have bound souls; Sulthrane gave Simeon his powers and is the final boss.
- Why: Not recorded
- Source: [STORY.md → Villains (locked 2026-11-09)](STORY.md#villains-locked-2026-11-09), [STORY.md → Villain names (locked 2026-11-09)](STORY.md#villain-names-locked-2026-11-09)

### D-00082 · Act 1 opening at Guérin's castle
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: The four heroes investigate Satanists at Guérin's castle; the cellar descent is the tutorial; the veil tears, Tristan falls through and the others follow.
- Why: Not recorded
- Source: [STORY.md → Act 1 opening (LOCKED 2026-11-09)](STORY.md#act-1-opening-locked-2026-11-09)

### D-00083 · Dismas and his hunting party
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: A native hunting party led by Dismas, a converted former cultist, rescues Tristan; Tristan joins it and it becomes the first team. Dismas's lost sworn brother Vaskar is Simeon's lieutenant.
- Why: Not recorded
- Source: [STORY.md → Act 1 opening (LOCKED 2026-11-09)](STORY.md#act-1-opening-locked-2026-11-09)

### D-00084 · Who comes from the real world
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Only the four heroes, Guérin and his cult come from our world; everyone else is native.
- Why: Not recorded
- Source: [STORY.md → Act 1 opening (LOCKED 2026-11-09)](STORY.md#act-1-opening-locked-2026-11-09)

### D-00085 · Act 1 beats
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Rescue fight against a Fiend, minor quests with the hunters, then the finale 'Saint-Caller Calling for Aid' against the first true Demon at the holy stronghold where Aveline is; the map game begins there.
- Why: Not recorded
- Source: [STORY.md → Act 1 beats after the tear (LOCKED 2026-11-09)](STORY.md#act-1-beats-after-the-tear-locked-2026-11-09)

### D-00086 · The Order of the Eighth Day
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: A native holy order opposing Simeon that posts jobs; Aveline joined it, and Tristan's clan becomes part of it or takes its missions.
- Why: Not recorded
- Source: [STORY.md → The Order of the Eighth Day (LOCKED 2026-11-09)](STORY.md#the-order-of-the-eighth-day-locked-2026-11-09)

### D-00087 · Act 2 beats
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Aveline explains the others followed; jobs from Eighth Day lead to Simeon's forces (always an enemy); climax with Godric against Vaskar, who is rescued by a shadowy figure.
- Why: Not recorded
- Source: [STORY.md → Act 2 beats (LOCKED 2026-11-09)](STORY.md#act-2-beats-locked-2026-11-09)

### D-00088 · Act 3 beats
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Lucien is unmasked at Simeon's rite; the bound-souls plan is revealed through a tear; Lucien doubts; Dismas kills Vaskar and an Eighth Day stronghold falls.
- Why: Not recorded
- Source: [STORY.md → Act 3 beats (LOCKED 2026-11-09)](STORY.md#act-3-beats-locked-2026-11-09)

### D-00089 · How Guérin dies
- Date: 2026-11-09
- Status: Active
- Replaces: none
- Decision: Guérin is not fought; he dies when Simeon dies, seen through the tear.
- Why: Not recorded
- Source: [STORY.md → How Guérin dies (LOCKED 2026-11-09)](STORY.md#how-guérin-dies-locked-2026-11-09)

### D-00090 · Act 4 beats
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: Holy ground spreads; encounters pull Lucien back; Lucien kills Simeon but Sulthrane is summoned anyway and defeated with saints and angels; Tristan's prayer turns the collapsing tear into the road home.
- Why: Not recorded
- Source: [STORY.md → Act 4 beats (LOCKED 2026-11-10)](STORY.md#act-4-beats-locked-2026-11-10)

### D-00091 · Faith arcs
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: Aveline is steadily faithful throughout; the ending shows how much Tristan's faith has grown.
- Why: Not recorded
- Source: [STORY.md → Act 4 beats (LOCKED 2026-11-10)](STORY.md#act-4-beats-locked-2026-11-10)

### D-00092 · Scripture in the game
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: Verses on act title cards, on node consecration and in dialogue (Aveline quotes, Tristan only at the end, Simeon twists them); KJV for now, shown in Latin first.
- Why: Not recorded
- Source: [STORY.md → Scripture in the game (LOCKED 2026-11-10)](STORY.md#scripture-in-the-game-locked-2026-11-10)

### D-00093 · None of the good guys die for good
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: None of the good guys die for good.
- Why: Not recorded
- Source: [STORY.md → Deaths (LOCKED 2026-11-10)](STORY.md#deaths-locked-2026-11-10)

### D-00094 · Lucien rescues Vaskar at the end of Act 2
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: The Hooded Figure (Lucien) pulls the beaten Vaskar out at the end of Act 2; the rest of the encounter run is a working draft.
- Why: Not recorded
- Source: [STORY.md → The Hooded Figure and Lucien's encounters (WORKING DRAFT 2026-11-10, a good start, not loved yet; revisit)](STORY.md#the-hooded-figure-and-luciens-encounters-working-draft-2026-11-10-a-good-start-not-loved-yet-revisit)

### D-00095 · Aveline never gives up on Lucien
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: After the reveal Aveline always pleads with Lucien to come home, right to the end.
- Why: Not recorded
- Source: [STORY.md → The Hooded Figure and Lucien's encounters (WORKING DRAFT 2026-11-10, a good start, not loved yet; revisit)](STORY.md#the-hooded-figure-and-luciens-encounters-working-draft-2026-11-10-a-good-start-not-loved-yet-revisit)

### D-00115 · Act 3 cost is a capture
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: The extra cost of the stronghold's fall is the capture of a trusted hunter or Eighth Day captain, not a death.
- Why: Not recorded
- Source: [STORY.md → Act 3 beats (LOCKED 2026-11-09)](STORY.md#act-3-beats-locked-2026-11-09)

### D-00133 · Two separate worlds
- Date: 2026-11-12
- Status: Active
- Replaces: D-00074
- Decision: The other world is a separate world in its own right, not a spiritual side of ours; the story starts in the real world and crosses over.
- Why: Not recorded
- Source: [STORY.md → Setting (locked 2026-11-09)](STORY.md#setting-locked-2026-11-09), [WORLD.md → The Other World (working notes)](WORLD.md#the-other-world-working-notes)

### D-00193 · Chapter 1 covers all of Act 1
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Chapter 1 runs from the castle prologue (tutorial) to the Demon fight at the holy stronghold.
- Why: Not recorded
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23)

### D-00194 · Dismas plus two non-Human hunters
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: For the slice, Dismas's party is Dismas plus two named hunters of different non-Human races, a squad of four with Tristan; revisit toward one of every base race later.
- Why: Kept small for the art load.
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23)

### D-00195 · Hunters are a Cynocephalus and a Hoopoe-kin
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: The two hunters are a Cynocephalus and a Hoopoe-kin; their classes needn't suit a hunting party.
- Why: The Ifriti lean on magic, which the slice doesn't bring in yet.
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23)

### D-00207 · Dismas's hidden-Peri companion on hold
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Dismas's hidden-Peri companion is on hold and not in the slice; the beat may be worked in after the slice is built.
- Why: Cletus likes the story beat but it isn't needed for the slice.
- Source: [WORLD.md → Peri (in progress 2026-11-12)](WORLD.md#peri-in-progress-2026-11-12), [TASKS.md → Parking lot](TASKS.md#parking-lot)

### D-00214 · Dismas's crew is a quest-taking company, not only a hunting party
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Dismas's crew is a general quest-taking clan or company, not narrowly a hunting party. They take varied jobs, some of which may be hunts.
- Why: Cletus did not want the early game to focus too narrowly on hunting. This clarifies the wording of D-00083, D-00085, D-00194, D-00195, and D-00199; the rescue, first-team, roster-size, and race facts in those entries still stand.
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [CHARACTERS.md → Dismas](CHARACTERS.md#dismas)

## Characters

### D-00116 · Character looks signed off
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Tristan clean-shaven; Aveline's white Hospital cross on a dark mantle; Godric a mace; Lucien a bow; Dismas a two-handed sword; Vaskar cold violet with one look; Guérin a trimmed beard; Simeon a lamp on a staff.
- Why: Not recorded
- Source: [CHARACTERS.md → Looks signed off (Cletus, 2026-11-11)](CHARACTERS.md#looks-signed-off-cletus-2026-11-11)

### D-00117 · Sprite identity rules
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Up to 60 art px tall; eyes and brow only; open faces for named units; no weapon at idle; one saturated identity color; Templar cross on the tabard front only.
- Why: Not recorded
- Source: [CHARACTERS.md → Sprite and period constraints (locked art rules, open looks)](CHARACTERS.md#sprite-and-period-constraints-locked-art-rules-open-looks)

### D-00206 · Hero classes, backstories and weapons
- Date: 2026-11-23
- Status: Active
- Replaces: D-00080
- Decision: Tristan a sword-and-shield Templar; Aveline a Hospital medic who grows into a Saint-Caller; Godric a heavy-hitting common sergeant with a mace; Lucien a fast skirmisher and scout with a bow.
- Why: The weapons were settled with the 2026-11-11 looks sign-off (D-00116).
- Source: [STORY.md → Classes and backstories (locked 2026-11-09)](STORY.md#classes-and-backstories-locked-2026-11-09), [CHARACTERS.md → Looks signed off (Cletus, 2026-11-11)](CHARACTERS.md#looks-signed-off-cletus-2026-11-11)

## Campaign & missions

### D-00051 · Mission trees with unlock types
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Each chapter is a mission tree: chain, branch, companion-only (can teach that companion an ability) and multi-part missions; fewer recruit missions, many side missions.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 1. Campaign scope & structure ✅](archive/stage3-decisions.md#1-campaign-scope--structure-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00052 · Prototype mini-campaign: Option B
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Open board of three recruit missions with clues; the Chapel Ford finale unlocks after 2 wins; ending and Chronicle.
- Why: Not recorded
- Source: [ROADMAP.md → Stage 2 — Core loop prototype ✅ DONE](ROADMAP.md#stage-2--core-loop-prototype--done)

### D-00196 · Finale closes only time-sensitive branches
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Most unfinished side branches carry into the next chapter; a few marked time-sensitive close when the finale begins (the confirm warns which); companions are never closed off. Chapter 1 has no time-sensitive or missable side missions (D-00220); expiring writs are introduced from Chapter 2.
- Why: Not recorded
- Source: [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00197 · Chapter 1 mission count
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Chapter 1 has 6 side missions plus the castle prologue, the rescue fight, 1 multi-part mission and the finale, for about 2 hours. Unlock pacing for those side missions is locked in D-00218. The jobs' everyday flavor and that exactly one has a follow-up, counted within the 6, are locked in D-00219.
- Why: Not recorded
- Source: [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00198 · Side-character join missions from Chapter 2
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Side missions where a side character joins the clan are welcome from Chapter 2 on, not in the slice.
- Why: Not recorded
- Source: [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game), [TASKS.md → Parking lot](TASKS.md#parking-lot)

### D-00211 · Chapter 1 multi-part mission: 2 nodes, unlocks a hidden node
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Chapter 1's one multi-part mission is a 2-node quest that unlocks the hidden node discussed in the world-map research report. You can't return to town between the two legs (D-00045). The quest's plot is locked in D-00213; the name is still open. What the hidden node is or holds is locked in D-00212.
- Why: Cletus picked a two-node route that unlocks the hidden node from the world-map report, rather than the report's three-node pitch.
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [research/2026-11-23-tactics-world-maps.md](research/2026-11-23-tactics-world-maps.md)

### D-00212 · Chapter 1 hidden node: forgotten chapel
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: The hidden node unlocked by Chapter 1's 2-node multi-part mission (D-00211) is a forgotten chapel holding an early mythology clue (kind locked in D-00216) and a reward. The chapel's reward is locked in D-00217, which replaces this entry's earlier "rare trade-off gear" wording; the chapel itself and the mythology clue still stand. The chapel's name, the sword's exact stats, name, and whether it has any minor trade-off, and the fragment's wording, physical form, and how much it reveals are still open.
- Why: Cletus picked a forgotten chapel with rare trade-off gear and a mythology clue, to reward exploration in the slice and tie into the Templar and holy-ground feel.
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00213 · Chapter 1 multi-part quest: missing Eighth Day patrol
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Chapter 1's 2-node multi-part quest (D-00211) is tracing a missing Order of the Eighth Day patrol. Leg 1 finds the patrol's camp under attack, abandoned, or ambushed; leg 2 pushes straight through to the forgotten chapel (D-00212), where a survivor holed up, barricaded inside, unlocking that hidden node. The quest's name is still open.
- Why: Cletus wanted a simple, grounded first multi-part quest for a player who doesn't know the world yet, and picked the missing Eighth Day patrol.
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00216 · Chapel mythology clue: Ifriti covenant fragment
- Date: 2026-11-24
- Status: Active
- Replaces: none
- Decision: The forgotten chapel's early mythology clue (D-00212) is a fragment of the Ifriti's older covenant with God. The fragment's exact wording, what it physically is, and how much it reveals stay open; this does not lock covenant details, the Order's eighth-day founding event, or later story names.
- Why: A sign of an earlier crossing would spend the "others crossed before Tristan" reveal too early. The covenant fragment introduces this world's own deep history and gives the Ifriti weight before the player meets one.
- Source: Cletus in chat, 2026-11-24; [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [WORLD.md → Ifriti](WORLD.md#ifriti)

### D-00217 · Chapel reward: a good sword
- Date: 2026-11-24
- Status: Active
- Replaces: none
- Decision: The forgotten chapel's reward (D-00212) is simply a good sword: a solid upgrade with no lore tie and no special mythology mechanic. This replaces the "rare trade-off gear" wording of D-00212; the chapel itself and the mythology clue (D-00216) still stand. The sword's exact stats, name, and whether it has any minor trade-off stay open.
- Why: Cletus did not want lore-related gear at this point, and thought it would be nice to give the player a good sword.
- Source: Cletus in chat, 2026-11-24; [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00218 · Chapter 1 side missions unlock a few at a time
- Date: 2026-11-24
- Status: Active
- Replaces: none
- Decision: Chapter 1 keeps 6 side missions (D-00197), posted on the writ-board (D-00215) and unlocked a few at a time, the way FFTA2's opening area (Targ Wood) works. The board opens with a single job and fills up as the story advances, instead of showing all six at once. This adds unlock pacing to D-00197; the mission count still stands. The jobs' everyday flavor and that exactly one has a follow-up are locked in D-00219. No Chapter 1 side missions are time-sensitive or missable (D-00220). The specific missions, which one gets the follow-up, and the exact unlock points stay open.
- Why: Cletus wanted the Chapter 1 board to work like FFTA2's Targ Wood, where 3 story battles end with "The Yellow Wings," which clears bandits off the highroad and opens the world map; the first quest is the only one on the board at first, and a few optional quests appear later.
- Source: Cletus in chat, 2026-11-24; [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [TASKS.md → Next](TASKS.md#next)

### D-00219 · Chapter 1 side missions: everyday jobs, one follow-up
- Date: 2026-11-24
- Status: Active
- Replaces: none
- Decision: Chapter 1's 6 side missions (D-00197) are mostly everyday writ-board jobs, like clearing a road, escorting a merchant or recovering stolen goods. Exactly one of them has a follow-up job, to give the player a first taste of branching; that follow-up counts within the 6. This supersedes the earlier "some are branch follow-ups" wording and adds job flavor and follow-up count to D-00197 and D-00218; the count and unlock pacing still stand. No Chapter 1 side missions are time-sensitive or missable (D-00220). The specific missions, which one gets the follow-up, and the exact unlock points stay open.
- Why: Cletus wanted the Chapter 1 side jobs to stay grounded everyday writs, with a single follow-up so the player gets a first taste of branching without a thick mission tree.
- Source: Cletus in chat, 2026-11-24; [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [TASKS.md → Next](TASKS.md#next)

### D-00220 · No Chapter 1 side missions are time-sensitive
- Date: 2026-11-24
- Status: Active
- Replaces: none
- Decision: No Chapter 1 side missions are time-sensitive or missable, including the one follow-up (D-00219). Expiring writs (FFTA2-style jobs that lapse after a while) are introduced from Chapter 2. This locks the time-sensitive question left open in D-00218 and D-00219; the count, unlock pacing, everyday-job flavor, and single follow-up still stand. How writs expire (timer, story beats, or flagging) stays open. The general rule that a finale can close time-sensitive branches (D-00196) still stands from Chapter 2.
- Why: The player is still learning the writ-board.
- Source: Cletus in chat, 2026-11-24; [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [DESIGN.md → World map (locked 2026-11-23)](DESIGN.md#world-map-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [TASKS.md → Next](TASKS.md#next)

## Recruiting

### D-00023 · BG-style structure: created hero plus set companions
- Date: 2026-11-01
- Status: Replaced by D-00186 (2026-11-23)
- Replaces: none
- Decision: One created hero; everyone else is a set companion with their own name, class and story who joins over the game (replacing FFTA-style squad building).
- Why: Not recorded
- Source: [DESIGN.md → Main character & party (Baldur's Gate-style structure)](DESIGN.md#main-character--party-baldurs-gate-style-structure), [archive/stage3-decisions.md](archive/stage3-decisions.md)

### D-00033 · Missed companions as replay driver (v0.11)
- Date: 2026-11-02
- Status: Replaced by D-00034 (2026-11-02)
- Replaces: none
- Decision: Beginning the prototype finale closes the third recruit mission, so that companion is missed.
- Why: Not recorded
- Source: [ROADMAP.md → Stage 2 — Core loop prototype ✅ DONE](ROADMAP.md#stage-2--core-loop-prototype--done)

### D-00034 · 10 companions, all gettable in one run
- Date: 2026-11-02
- Status: Active
- Replaces: D-00033
- Decision: 10 companions, about 2 per chapter, and all can be recruited in one run; recruiting by how you win stays parked.
- Why: Variety comes from the mission tree, branches and squad choice, not from locking people out.
- Source: [archive/stage3-decisions.md → 4. Companions ✅](archive/stage3-decisions.md#4-companions-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00098 · Replay variety: optional recruits, random traits, story choices
- Date: 2026-11-11
- Status: Replaced by D-00187 (2026-11-23)
- Replaces: none
- Decision: Replay variety comes from optional recruits (no run gets everyone), random recruit traits and a few story choices.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00099 · Recruits join at or below clan level
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Recruits join at or below clan level; veterans earn battle-forged trade-off traits; some rare traits only roll on random recruits; stats grow from the class a unit levels in; no comrade bonds or flattened growth.
- Why: In FFTA/FFTA2 late recruits join with better stats and push players off long-built favorites.
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00100 · Bench catch-up via level-gap experience
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Experience scales with the level gap so under-leveled units catch up by fighting stronger enemies; no free experience and no dispatch missions.
- Why: Cletus dislikes dispatch missions and free XP for not fighting.
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11)

### D-00186 · Recruiting copies FFTA2; no set companions
- Date: 2026-11-23
- Status: Active
- Replaces: D-00023
- Decision: No set companions. Story characters join through the story, named side characters through optional quest chains (Chapter 2 on), and random generic recruits fill the roster with accept/decline.
- Why: Cletus wants to recruit exactly the way FFTA2 does.
- Source: [DESIGN.md → Recruiting: FFTA2-style (locked 2026-11-23)](DESIGN.md#recruiting-ffta2-style-locked-2026-11-23), [research/README.md](research/README.md)

### D-00187 · All companions gettable in one run; variety from random recruits
- Date: 2026-11-23
- Status: Active
- Replaces: D-00098
- Decision: All companions are gettable in one run (limits may be explored later); replay variety comes from random generic recruits and their traits plus story choices.
- Why: Not recorded
- Source: [DESIGN.md → Classes and races — open questions (2026-11-11)](DESIGN.md#classes-and-races--open-questions-2026-11-11), [DESIGN.md → Recruiting: FFTA2-style (locked 2026-11-23)](DESIGN.md#recruiting-ffta2-style-locked-2026-11-23)

### D-00188 · Story-companion recruit missions dropped
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Recruit missions for story companions are dropped; the main heroes join through the story. FFTA-style generic recruit missions are allowed, and side-character join missions start in Chapter 2.
- Why: They were a holdover from the old design.
- Source: [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns), [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23)

## Slice plan

### D-00053 · Vertical slice is a polished 2-hour Chapter 1
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Stage 4 is a polished Chapter 1 of about 2 hours on phone and Steam, built the way the full game will be.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 11. Vertical slice (Stage 4) ✅](archive/stage3-decisions.md#11-vertical-slice-stage-4-), [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order)

### D-00054 · Slice includes 2 recruits
- Date: 2026-11-02
- Status: Replaced by D-00199 (2026-11-23)
- Replaces: none
- Decision: The Chapter 1 mission tree includes 2 recruits.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 11. Vertical slice (Stage 4) ✅](archive/stage3-decisions.md#11-vertical-slice-stage-4-)

### D-00055 · 12 milestones, unknowns first
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Twelve milestones (M1–M12): big unknowns first, then systems, then content and polish.
- Why: Not recorded
- Source: [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order)

### D-00056 · Not in the slice
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Chapters 2–5, magic and MP, the Physician and magic classes, recruiting by how you win, Switch and publisher talks wait until after the slice.
- Why: Not recorded
- Source: [SLICE-PLAN.md → Not in the slice](SLICE-PLAN.md#not-in-the-slice)

### D-00182 · Audio plugin at the start of M4
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: At the start of M4, add an audio plugin (ElevenLabs and/or fal) to generate the trial set.
- Why: Not recorded
- Source: [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

### D-00199 · Slice has no recruit missions
- Date: 2026-11-23
- Status: Active
- Replaces: D-00054
- Decision: Dismas's hunters become the clan after the rescue fight; no recruit missions in Chapter 1.
- Why: Not recorded
- Source: [STORY.md → Chapter 1 scope (locked 2026-11-23)](STORY.md#chapter-1-scope-locked-2026-11-23), [SLICE-PLAN.md → Big unknowns](SLICE-PLAN.md#big-unknowns)

## UI & controls

### D-00014 · FFTA2 control scheme
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Cursor plus command menu plus A/B, with taps as a shortcut.
- Why: Tapping exact tiles on a phone was fiddly; Cletus wants controls to match FFTA2 to start.
- Source: [DESIGN.md → Controls (FFTA2-style, as built)](DESIGN.md#controls-ffta2-style-as-built)

### D-00015 · Facing is an explicit end-of-turn choice
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Every player turn ends on a facing step; auto-facing was removed.
- Why: Auto-facing felt wrong in Cletus's playtest.
- Source: [DESIGN.md → Facing, flanking & positioning](DESIGN.md#facing-flanking--positioning)

### D-00016 · Prediction before executing
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Hovering a target shows hit, damage, HP after and modifiers, and the confirm step repeats it.
- Why: Not recorded
- Source: [DESIGN.md → Facing, flanking & positioning](DESIGN.md#facing-flanking--positioning)

### D-00017 · Context-aware d-pad
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: The pad only shows directions that do something right now, in one fixed footprint.
- Why: Not recorded
- Source: [DESIGN.md → Controls (FFTA2-style, as built)](DESIGN.md#controls-ffta2-style-as-built)

### D-00018 · Diagonal quadrant d-pad
- Date: 2026-10-31
- Status: Replaced by D-00057 (2026-11-02)
- Replaces: none
- Decision: The map pad used diagonal quadrants.
- Why: Not recorded
- Source: [DESIGN.md → Controls (FFTA2-style, as built)](DESIGN.md#controls-ffta2-style-as-built)

### D-00057 · Classic cross d-pad (v0.7)
- Date: 2026-11-02
- Status: Active
- Replaces: D-00018
- Decision: The map pad is a ▲▶▼◀ cross with ▲ = up-right, rotating clockwise.
- Why: Cletus found the diagonal quadrants weird.
- Source: [DESIGN.md → Controls (FFTA2-style, as built)](DESIGN.md#controls-ffta2-style-as-built)

### D-00058 · No phone-only controls
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Touch, controller and keyboard all work everywhere.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 8. Platform & controls ✅](archive/stage3-decisions.md#8-platform--controls-), [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order)

### D-00059 · Tap vs drag, and 'Begin mission?' confirm
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: List items act only on a still release, and every battle start asks 'Begin mission?' first.
- Why: Cletus accidentally started a mission while scrolling.
- Source: [DESIGN.md → Controls (FFTA2-style, as built)](DESIGN.md#controls-ffta2-style-as-built)

### D-00060 · Allies stay in character
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: A companion flees or hides only if that's their story or the battle's design.
- Why: Not recorded
- Source: [DESIGN.md → Allies in character](DESIGN.md#allies-in-character)

## Art & audio

### D-00061 · 2D sprites on iso tiles, FFTA2-style portraits
- Date: 2026-11-02
- Status: Replaced by D-00204 (2026-11-23)
- Replaces: none
- Decision: 2D sprites on iso tiles, Final Fantasy-based, FFTA2-style portraits, and a pre-made set of 8–12 hero portraits (no builder).
- Why: HD-2D, low-poly 3D, a portrait builder and commissioned art were rejected.
- Source: [archive/stage3-decisions.md → 7. Art direction ✅](archive/stage3-decisions.md#7-art-direction-)

### D-00062 · Tancred makes the art
- Date: 2026-11-02
- Status: Replaced by D-00096 (2026-11-10)
- Replaces: none
- Decision: Tancred (the AI partner) makes the art.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 7. Art direction ✅](archive/stage3-decisions.md#7-art-direction-)

### D-00063 · Audio is a Tancred trial
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Music and sound start as a trial by Tancred; if not good enough, Cletus does them himself.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 12. Team & budget ✅](archive/stage3-decisions.md#12-team--budget-), [GAME-BRIEF.md](GAME-BRIEF.md)

### D-00064 · Scenes in-engine, no pre-rendered cutscenes
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: Story scenes play in-engine with sprites and portrait text boxes.
- Why: Not recorded
- Source: [archive/stage3-decisions.md → 10. Story & mythology ✅](archive/stage3-decisions.md#10-story--mythology-), [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00066 · FFTA2 sprite animation with separate weapon layer
- Date: 2026-11-03
- Status: Active
- Replaces: none
- Decision: Idle is a 2-frame walk-in-place, a separate stand frame shows the unit's turn, and weapons are their own layer drawn at a per-frame hand anchor.
- Why: Not recorded
- Source: [DESIGN.md → Stage 3 decisions: what changes for the real game](DESIGN.md#stage-3-decisions-what-changes-for-the-real-game)

### D-00096 · Guilhem makes the art
- Date: 2026-11-10
- Status: Active
- Replaces: D-00062
- Decision: Guilhem · Illuminator makes the art.
- Why: Not recorded
- Source: [DESIGN.md → Later locks that override Stage 3](DESIGN.md#later-locks-that-override-stage-3), [GAME-BRIEF.md](GAME-BRIEF.md)

### D-00097 · Verse burn effect
- Date: 2026-11-10
- Status: Active
- Replaces: none
- Decision: Title-card style: Latin burns into KJV English in one sweep at the prototype's 0.5x speed; must not block input.
- Why: Not recorded
- Source: [DESIGN.md → Scripture presentation (2026-11-10)](DESIGN.md#scripture-presentation-2026-11-10)

### D-00118 · 60 px unit cap and integer scale
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Units up to 60 px in 64×68 cells on 60×30 tiles, raw Retro Diffusion output, one integer scale for tiles and sprites (3 on phones).
- Why: So sprites use raw Retro Diffusion output with no shrink.
- Source: [DESIGN.md → Art scale (LOCKED 2026-11-11)](DESIGN.md#art-scale-locked-2026-11-11)

### D-00119 · Units are body-centered on tiles
- Date: 2026-11-11
- Status: Active
- Replaces: none
- Decision: Units are planted so the torso center sits on the tile center, not the feet.
- Why: Body-centered won the side-by-side.
- Source: [DESIGN.md → Art scale (LOCKED 2026-11-11)](DESIGN.md#art-scale-locked-2026-11-11)

### D-00204 · 2D sprites on iso tiles, FFTA2-style portraits (no hero portrait set)
- Date: 2026-11-23
- Status: Active
- Replaces: D-00061
- Decision: 2D sprites on iso tiles, Final Fantasy-based, FFTA2-style portraits; the pre-made set of 8–12 hero portraits is dropped with hero creation.
- Why: No created character (D-00202), so there is no portrait pick.
- Source: [archive/stage3-decisions.md → 7. Art direction ✅](archive/stage3-decisions.md#7-art-direction-), [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order)

## Process

### D-00019 · Tuning lives in config
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Tuning values live in `src/config.js` so balance changes need no code changes.
- Why: Not recorded
- Source: [ROADMAP.md → Working rules](ROADMAP.md#working-rules), [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order)

### D-00020 · Phone-first playtesting on GitHub Pages
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Every change goes live on GitHub Pages so Cletus can play it on his phone.
- Why: Not recorded
- Source: [ROADMAP.md → Working rules](ROADMAP.md#working-rules)

### D-00021 · Every feature serves the current stage
- Date: 2026-10-31
- Status: Active
- Replaces: none
- Decision: Every feature serves the current stage's done-when; anything else goes to the parking lot.
- Why: Not recorded
- Source: [ROADMAP.md → Working rules](ROADMAP.md#working-rules)

### D-00065 · Balance sim stays green
- Date: 2026-11-02
- Status: Active
- Replaces: none
- Decision: The human-like sim model wins 65–75% in every cell.
- Why: Not recorded
- Source: [SLICE-PLAN.md → Milestones, in build order](SLICE-PLAN.md#milestones-in-build-order)

### D-00174 · Living TASKS.md for open design questions
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: Open design questions live in TASKS.md (Now / Next / Waiting / Parking lot); build work lives on the GitHub board.
- Why: Not recorded
- Source: [TASKS.md → How this works](TASKS.md#how-this-works)

### D-00175 · Docs index and archive
- Date: 2026-11-18
- Status: Active
- Replaces: none
- Decision: docs/README.md indexes the living docs; finished material moves to docs/archive/.
- Why: Not recorded
- Source: [README.md](README.md)

### D-00200 · Dated research reports with an index
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Research reports are filed as dated files in docs/research/ and indexed with a status column.
- Why: Not recorded
- Source: [research/README.md](research/README.md)

### D-00201 · Decision log
- Date: 2026-11-23
- Status: Active
- Replaces: none
- Decision: Every locked decision gets a numbered entry in DECISIONS.md; open questions stay in TASKS.md.
- Why: Not recorded
- Source: [DECISIONS.md → How to use this log](DECISIONS.md#how-to-use-this-log)

### D-00209 · American spelling everywhere
- Date: 2026-11-19
- Status: Active
- Replaces: none
- Decision: American spelling everywhere in chat, docs and code.
- Why: Not recorded
- Source: [README.md → Conventions](README.md#conventions), commit 97cb35b
