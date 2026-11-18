# Outremer: game brief

*One page, agreed with Cletus at the end of Stage 3 (2026-11-02). **This brief is as of Stage 3.** Later locked decisions override it; they are noted below and live in [DESIGN.md](DESIGN.md), [STORY.md](STORY.md) and [CLASSES.md](CLASSES.md). The original Stage 3 write-up is in [archive/stage3-decisions.md](archive/stage3-decisions.md). Next: [SLICE-PLAN.md](SLICE-PLAN.md).*

**What it is.** An isometric tactics RPG in the Final Fantasy Tactics Advance 2 tradition. It has a Baldur's Gate shape: you create one hero, and named companions with their own stories join you. Relics, legends and the uncanny are part of the world from the start. The story starts in the Crusader states (Outremer) and crosses into another world ([STORY.md](STORY.md), [WORLD.md](WORLD.md)).

**How it plays.**
- **Battles:** about **6 units deploy** per battle from a larger roster ([DESIGN.md](DESIGN.md) Party size, 2026-11-09; this supersedes Stage 3's squad of 3). A few story missions may still be solo or duo. Hand-made iso maps. Where you stand matters most: facing, flanking, height, and maps with deadly edges or goals other than "defeat everyone". Each class moves differently. Abilities have no cooldowns or MP; each one's only cost is a drawback built into what it does.
- **Your hero:** roll stats, pick a class and one of 8–12 portraits. **Class can be switched freely between battles** ([DESIGN.md](DESIGN.md) Q1, 2026-11-11; this supersedes Stage 3's "class is yours for life"). Class still sets MOV, JUMP and terrain. You grow by:
  - leveling from fights (stats only, up to level 50);
  - learning abilities from gear and keeping them;
  - borrowing one skill set from another class.
  - Stage 3 also had "picking 1 of 2 branches at milestones"; that has not been re-asked since class switching was locked.
- **Companions:** 10 in all, about 2 per chapter, and you can get every one of them in a single run. Each has a trait with a real downside and missions of their own that can teach them new abilities. (How this maps to the later story cast is still open; see [TASKS.md](TASKS.md).)
- **Between battles:** you travel a world map of nodes. You can change your party and gear anywhere, but you take missions and shop in towns. Shops are the main source of teaching gear and stock plenty; ordinary loot gives variants; rare or unique items that teach rare skills have to be found ([DESIGN.md](DESIGN.md) kit template, 2026-11-18). A fallen companion is wounded for the next battle; if your hero falls, the battle is lost.

**Scope.** About 5 chapters. Each one is a tree of missions, mostly side missions, with chains, branches, companion-only missions and multi-part journeys, and each ends in a story finale.

**Story.** Mythology drives the plot. Scenes play out in the engine, FFTA2-style: sprites act on the maps and characters speak in portrait text boxes. Locked story decisions live in [STORY.md](STORY.md). A remaining story-premise pass before Chapter 1 content is in [TASKS.md](TASKS.md). (This supersedes Stage 3's "the premise is still to be written.")

**Look and sound.** 2D sprites on iso tiles, Final Fantasy-inspired, with FFTA2-style portraits. **Guilhem · Illuminator** makes the art ([DESIGN.md](DESIGN.md); Stage 3 had named Tancred). Music and sound start as a trial by Tancred; if it isn't good enough, Cletus does them himself.

**Platforms.** Phone first, plus Steam with full controller support. Touch, controller and keyboard all work everywhere. Switch is a stretch at most.

**Tech.** This codebase grows up: TypeScript and a real renderer (e.g. PixiJS), wrapped with Capacitor for phones and Tauri or Electron for Steam. We keep the balance simulator.

**Team.** Cletus, with Guilhem · Illuminator on art, and Tancred trialing audio. Publishers get decided after the vertical slice.

**What "commercial quality" means here.** Final art and audio, no placeholder text, stable saves, 60 fps on a mid-range phone, and controller parity.

**Next milestone.** A polished Chapter 1 of about 2 hours, good enough to show people as "this is the game". See [SLICE-PLAN.md](SLICE-PLAN.md).
