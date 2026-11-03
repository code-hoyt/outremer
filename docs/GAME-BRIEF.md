# Outremer: game brief

*One page. Agreed with Cletus at the end of Stage 3 (2026-11-02). Details: [stage3-decisions.md](stage3-decisions.md). Next: [SLICE-PLAN.md](SLICE-PLAN.md).*

**What it is.** An isometric tactics RPG in the Final Fantasy Tactics Advance 2 tradition, set in the Crusader states (Outremer). It has a Baldur's Gate shape: you create one hero, and named companions with their own stories join you. Relics, legends and the uncanny are part of the world from the start.

**How it plays.**
- **Battles:** a squad of 3 (your hero + 2 companions) on hand-made iso maps. Where you stand matters most: facing, flanking, height, and maps with deadly edges or goals other than "defeat everyone". Each class moves differently. Abilities have no cooldowns or MP; each one's only cost is a drawback built into what it does. A few story missions are solo or duo.
- **Your hero:** roll stats, pick a class and one of 8–12 portraits. The class is yours for life. You grow by:
  - leveling from fights (stats only, up to level 50);
  - picking 1 of 2 branches at milestones;
  - learning abilities from gear and keeping them;
  - borrowing one skill set from another class.
- **Companions:** 10 in all, about 2 per chapter, and you can get every one of them in a single run. Each has a trait with a real downside and missions of their own that can teach them new abilities.
- **Between battles:** you travel a world map of nodes. You can change your party and gear anywhere, but you take missions and shop in towns. Most gear gives stats; rare pieces teach abilities or give a perk with a catch. A fallen companion is wounded for the next battle; if your hero falls, the battle is lost.

**Scope.** About 5 chapters. Each one is a tree of missions, mostly side missions, with chains, branches, companion-only missions and multi-part journeys, and each ends in a story finale.

**Story.** Mythology drives the plot. Scenes play out in the engine, FFTA2-style: sprites act on the maps and characters speak in portrait text boxes. **The premise is still to be written** in a dedicated story session.

**Look and sound.** 2D sprites on iso tiles, Final Fantasy-inspired, with FFTA2-style portraits. Tancred makes the art. Music and sound start as a trial by Tancred; if it isn't good enough, Cletus does them himself.

**Platforms.** Phone first, plus Steam with full controller support. Touch, controller and keyboard all work everywhere. Switch is a stretch at most.

**Tech.** This codebase grows up: TypeScript and a real renderer (e.g. PixiJS), wrapped with Capacitor for phones and Tauri or Electron for Steam. We keep the balance simulator.

**Team.** Cletus, solo, with Tancred on art (and trialing audio). Publishers get decided after the vertical slice.

**What "commercial quality" means here.** Final art and audio, no placeholder text, stable saves, 60 fps on a mid-range phone, and controller parity.

**Next milestone.** A polished Chapter 1 of about 2 hours, good enough to show people as "this is the game". See [SLICE-PLAN.md](SLICE-PLAN.md).
