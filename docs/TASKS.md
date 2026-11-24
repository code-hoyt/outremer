# Design tasks

Living list of open **design decisions**. Every locked decision is in [DECISIONS.md](DECISIONS.md); when a question here is locked, it moves there as a new entry in the same commit. Build work lives on the [GitHub issues](https://github.com/code-hoyt/outremer/issues?q=is%3Aissue+label%3Abuild), tracked on the [Outremer Project board](https://github.com/users/code-hoyt/projects/1).

## How this works
- **Now** holds at most one to three items: the current design thread.
- New ideas go to the **Parking lot**, not into Now, so they don't pull us sideways.
- This file is updated with every design commit.
- Build work (slice milestones, engine, deploys) lives on the GitHub board, not here. Each build issue is a [SLICE-PLAN.md](SLICE-PLAN.md) milestone. The Stage 4 plan is in [ROADMAP.md](ROADMAP.md).

## Now
- The Oath Mage law pool is locked (six laws, 2026-11-23). Still open: which oaths stack and the numbers, set during balancing. See [CLASSES.md](CLASSES.md#oath-mage).
- All five first race-class kits are complete as of 2026-11-23 (numbers still open). Kits live in [CLASSES.md](CLASSES.md).

## Next
- Hold the story-premise session before [SLICE-PLAN.md](SLICE-PLAN.md) M11 (Chapter 1 content). M10 can use placeholder text; Ch.1 cannot be final until this happens. See [STORY.md](STORY.md) and [ROADMAP.md](ROADMAP.md) Stage 4. Locked story decisions already live in [STORY.md](STORY.md). **Locked 2026-11-23 (D-00211, D-00212, D-00213); clue kind locked 2026-11-24 (D-00216); reward locked 2026-11-24 (D-00217):** Chapter 1's multi-part mission is a 2-node quest tracing a missing Order of the Eighth Day patrol (leg 1: the patrol's camp; leg 2: the forgotten chapel, where a survivor holed up), unlocking a hidden forgotten chapel holding ~~rare trade-off gear~~ **Superseded 2026-11-24 (D-00217):** a good sword (a solid upgrade with no lore tie and no special mythology mechanic) and a mythology clue (a fragment of the Ifriti's older covenant with God). Still open for that session: the quest's name, the chapel's name, ~~the exact gear,~~ **Superseded 2026-11-24 (D-00217):** the kind of reward is locked; the sword's exact stats, name, and whether it has any minor trade-off stay open, ~~the exact mythology clue,~~ **Superseded 2026-11-24 (D-00216):** the kind of clue is locked; its wording, physical form, and how much it reveals stay open. Also still open: ~~Chapter 1's 6 side missions (including branch follow-ups and time-sensitive flags),~~ **Locked 2026-11-24 (D-00218):** the 6 side missions (D-00197) are posted on the writ-board and unlocked a few at a time (the board opens with a single job and fills up as the story advances). Still open: what those missions are, which have follow-ups, which are time-sensitive, and the exact unlock points. Also still open: the Chapter 1 mythology hook. The Act 1 Demon's name stays in the Parking lot.

## Waiting on Cletus
Decisions only he can make.
- Pick Guilhem's concept plates: Ifriti (`ifriti-concept-v6`; Guilhem recommends plate 3, high-mantle), Cynocephali (`cynocephali-concept-v5`; he recommends plate 2, ridge-guard), and Hoopoe-kin (`hoopoe-kin-concept-v1`; a round, a skinny, and a mid scribe). Deliveries are in `/workspace/art-handoff/deliveries/`. Later Ifriti folders (through v26 as of 2026-11-18) are also there. Looks notes are in [WORLD.md](WORLD.md).
- The Kojima hooded look versus locked light-blue Peri hair: the costume can be used, but blonde hair would need sign-off, or the light blue can flow out of the hood. Not assigned to a class yet. See [WORLD.md](WORLD.md).
- Confirm the Cynocephali footprint (provisionally uncommon). See [WORLD.md](WORLD.md).
- The Templar Knight's limitation is still open; leave it open until Cletus decides. See [CLASSES.md](CLASSES.md#templar-knight).

## Parking lot
- How many field objects (for example roosts) one unit can have out at once. See [DESIGN.md](DESIGN.md) "Field objects".
- Lingering area moves for other classes, maybe a whole class built around them (noted 2026-11-22). Also a full ranged-immunity move for the main archer class. See [DESIGN.md](DESIGN.md) and the Rooster notes in [CLASSES.md](CLASSES.md).
- Kit extras parked 2026-11-18: meters/gauges, combo attacks, summons. Also: more places to hide rare teaching items, and other ways to earn AP besides battle. See [DESIGN.md](DESIGN.md) "Unit kit template".
- **Open (2026-11-23): side-character join level.** DESIGN.md Q15 says recruits join at or below clan level, but FFTA's secret characters join a few levels above the clan average. Do Outremer's named side characters follow Q15 or the FFTA rule? See [research/2026-11-23-ffta-recruiting.md](research/2026-11-23-ffta-recruiting.md).
- FFTA2-style recruiting details (2026-11-23): clan cap and swap-when-full rule, how generics appear (map by region/season vs. after missions), and whether a "Clan Mates"-style pick-your-class quest comes back. See [DESIGN.md](DESIGN.md) Recruiting.
- Stage 3 planned 10 companions, all gettable in one run, with 4 still to be written beyond the old pitch list. The story cast later started in [STORY.md](STORY.md) / [CHARACTERS.md](CHARACTERS.md), and the Stage 2 pitch names were set aside. How that maps to the 10-companion lock is still open. Copied from [archive/stage3-decisions.md](archive/stage3-decisions.md) #4.
- Recruiting by *how* you win (spare, protect, reach in time) stays parked; winning the mission is enough for now. Moved from the [ROADMAP.md](ROADMAP.md) parking lot.
- Re-recruiting a declined companion later? (A decline shouldn't lock one out for good if all companions are gettable in one run.) Moved from the [ROADMAP.md](ROADMAP.md) parking lot. In the v0.11 prototype, Decline is final for that run.
- Magic and MP, parked for later: MP is for spells; physical abilities keep built-in drawbacks. See [DESIGN.md](DESIGN.md) Stage 3 #6 and [SLICE-PLAN.md](SLICE-PLAN.md).
- Is the six-stat set (MGT, END, FOR, AGI, AIM, RES) right, and does Aim make facing's fixed hit chance too swingy? ~~How creation rolls and class minimums map to~~ (no creation rolls since 2026-11-23, D-00203; how class base stats map to the planned 1–100 / level-50 scale is open ([SLICE-PLAN.md](SLICE-PLAN.md) M5)).
- Does the hero's class limit which companions want to join?
- **Open (2026-11-23): M5's success criterion.** With no hero creation (D-00202), what replaces "creation still makes heroes noticeably different" in [SLICE-PLAN.md](SLICE-PLAN.md) M5? For example, do random generic recruits and their traits need to feel noticeably different instead?
- **On hold (2026-11-23): Dismas's hidden-Peri companion.** Not in the slice. Cletus likes the story beat; after the slice is built, where and how does she come in (identity, reveal timing)? See [WORLD.md](WORLD.md) Peri (D-00207).
- Side missions where a side character (unrelated to the main story) joins the clan: Chapter 2 or later, not the slice. (Replaces story-companion recruit missions, dropped 2026-11-23; FFTA-style generic recruit missions are still allowed.)
- Should a story guest (FFTA2-style) take orders, or stay AI-only?
- Revisit the starting clan size during development: Cletus would like one of every base race at the start, like FFTA2 (the slice uses Dismas plus two companions).
- Should Shield Wall also cancel flank bonuses (it doesn't now)? Should shoves or pulls into a brace zone trigger Brace (they don't now)?
- Should waiting (CT −60) be more visible as a tactic?
- Keep the FFTA2 menu structure as ability sets arrive (Action → class set / borrowed secondary set)?
- Should facing protect more (for example shields blocking some front damage) to make flanking even more decisive? Also listed as a later build idea in [ROADMAP.md](ROADMAP.md).
- Zones of control beyond the prototype's Brace (set on your own turn, resolved automatically): still open.
- ~~Flesh out world lore on where quests come from and why clans or companies form to complete them, including researching historical examples.~~ **Locked 2026-11-24 (D-00215):** Option A, the Eighth Day writ-board, is the core model, with light touches of B (written terms on larger or multi-part commissions), C (road-brotherhood flavor for the starting town's roads), and D (a company can be a friend or term-servant of the Eighth Day without being the Order). See [WORLD.md](WORLD.md#companies-and-quests-locked-2026-11-24) and [research/2026-11-23-medieval-quest-companies.md](research/2026-11-23-medieval-quest-companies.md).
- Ifriti lore: some see Humans as oath-breakers because of a past betrayal, still to be decided. See [WORLD.md](WORLD.md).
- Tidy [STORY.md](STORY.md): the top-level act structure is still marked draft while the act beats are locked, and [CHARACTERS.md](CHARACTERS.md) lists other gaps and tensions to clean up.
- Holy and profane ground is still marked "leaning" in [STORY.md](STORY.md), but the locked Act 4 ending depends on it.
- Node verses: the presentation is picked in [DESIGN.md](DESIGN.md); the verses themselves (and node-consecration banners) are still to be written. See [STORY.md](STORY.md).
- Revisit the Hooded Figure encounter order. It is a working draft, a good start, not locked, and Cletus is not in love with it yet. See [STORY.md](STORY.md).
- Name the Act 1 Demon (the first true Demon, at the holy stronghold). See [STORY.md](STORY.md) and [CHARACTERS.md](CHARACTERS.md).
- Decide the past holy event that gave the Order of the Eighth Day its name. See [WORLD.md](WORLD.md).
- Older build-adjacent ideas stay in the [ROADMAP.md parking lot](ROADMAP.md). Slice engineering unknowns (stat rescale, world-map implementation (M7; structure locked as D-00210), mission-tree format, TypeScript and renderer, art pipeline, audio trial) live with their milestones on the board; see [SLICE-PLAN.md](SLICE-PLAN.md).
