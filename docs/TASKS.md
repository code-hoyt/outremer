# Design tasks

Living list of open **design decisions**. Build work lives on the [GitHub issues](https://github.com/code-hoyt/outremer/issues?q=is%3Aissue+label%3Abuild), tracked on the [Outremer Project board](https://github.com/users/code-hoyt/projects/1).

## How this works
- **Now** holds at most one to three items: the current design thread.
- New ideas go to the **Parking lot**, not into Now, so they don't pull us sideways.
- This file is updated with every design commit.
- Build work (slice milestones, engine, deploys) lives on the GitHub board, not here. Each build issue is a [SLICE-PLAN.md](SLICE-PLAN.md) milestone. The Stage 4 plan is in [ROADMAP.md](ROADMAP.md).

## Now
- The Oath Mage law pool is locked (six laws, 2026-11-23). Still open: which oaths stack and the numbers, set during balancing. See [CLASSES.md](CLASSES.md#oath-mage).
- All five first race-class kits are complete as of 2026-11-23 (numbers still open). Kits live in [CLASSES.md](CLASSES.md).

## Next
- Hold the story-premise session before [SLICE-PLAN.md](SLICE-PLAN.md) M11 (Chapter 1 content). M10 can use placeholder text; Ch.1 cannot be final until this happens. See [STORY.md](STORY.md) and [ROADMAP.md](ROADMAP.md) Stage 4. Locked story decisions already live in [STORY.md](STORY.md).
- Settle remaining Stage 3 campaign-tree details for the slice: side missions per chapter, whether a finale closes unfinished branches, and which branches carry into later chapters. Copied from [archive/stage3-decisions.md](archive/stage3-decisions.md) #1 before that file was archived. See [SLICE-PLAN.md](SLICE-PLAN.md).

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
- Stage 3 planned 10 companions, all gettable in one run, with 4 still to be written beyond the old pitch list. The story cast later started in [STORY.md](STORY.md) / [CHARACTERS.md](CHARACTERS.md), and the Stage 2 pitch names were set aside. How that maps to the 10-companion lock is still open. Copied from [archive/stage3-decisions.md](archive/stage3-decisions.md) #4.
- Recruiting by *how* you win (spare, protect, reach in time) stays parked; winning the mission is enough for now. Moved from the [ROADMAP.md](ROADMAP.md) parking lot.
- Re-recruiting a declined companion later? (A decline shouldn't lock one out for good if all companions are gettable in one run.) Moved from the [ROADMAP.md](ROADMAP.md) parking lot. In the v0.11 prototype, Decline is final for that run.
- Magic and MP, parked for later: MP is for spells; physical abilities keep built-in drawbacks. See [DESIGN.md](DESIGN.md) Stage 3 #6 and [SLICE-PLAN.md](SLICE-PLAN.md).
- Is the six-stat set (MGT, END, FOR, AGI, AIM, RES) right, and does Aim make facing's fixed hit chance too swingy? How creation rolls and class minimums map to the planned 1–100 / level-50 scale is open ([SLICE-PLAN.md](SLICE-PLAN.md) M5).
- Does the hero's class limit which companions want to join?
- Should the recruit-mission stranger (FFTA2-style guest) take orders, or stay AI-only?
- Should Shield Wall also cancel flank bonuses (it doesn't now)? Should shoves or pulls into a brace zone trigger Brace (they don't now)?
- Should waiting (CT −60) be more visible as a tactic?
- Keep the FFTA2 menu structure as ability sets arrive (Action → class set / borrowed secondary set)?
- Should facing protect more (for example shields blocking some front damage) to make flanking even more decisive? Also listed as a later build idea in [ROADMAP.md](ROADMAP.md).
- Zones of control beyond the prototype's Brace (set on your own turn, resolved automatically): still open.
- Ifriti lore: some see Humans as oath-breakers because of a past betrayal, still to be decided. See [WORLD.md](WORLD.md).
- Tidy [STORY.md](STORY.md): the top-level act structure is still marked draft while the act beats are locked, and [CHARACTERS.md](CHARACTERS.md) lists other gaps and tensions to clean up.
- Holy and profane ground is still marked "leaning" in [STORY.md](STORY.md), but the locked Act 4 ending depends on it.
- Node verses: the presentation is picked in [DESIGN.md](DESIGN.md); the verses themselves (and node-consecration banners) are still to be written. See [STORY.md](STORY.md).
- Revisit the Hooded Figure encounter order. It is a working draft, a good start, not locked, and Cletus is not in love with it yet. See [STORY.md](STORY.md).
- Name the Act 1 Demon (the first true Demon, at the holy stronghold). See [STORY.md](STORY.md) and [CHARACTERS.md](CHARACTERS.md).
- Decide the past holy event that gave the Order of the Eighth Day its name. See [WORLD.md](WORLD.md).
- Older build-adjacent ideas stay in the [ROADMAP.md parking lot](ROADMAP.md). Slice engineering unknowns (stat rescale, world map, mission-tree format, TypeScript and renderer, art pipeline, audio trial) live with their milestones on the board; see [SLICE-PLAN.md](SLICE-PLAN.md).
