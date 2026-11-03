# Stage 4: vertical slice plan

*Built against the [game brief](GAME-BRIEF.md) and the [Stage 3 decisions](stage3-decisions.md) (#11 is the slice scope). Drafted 2026-11-02, so every milestone can still be re-cut.*

**The slice:** a polished **Chapter 1, about 2 hours**, on phone + Steam, built the way the full game will be built.
**Stage 4 is done when** the chapter is good enough to show people (playtesters, potential partners or publishers) as "this is the game", and building more of it is mostly content work.

**Rules that hold for every milestone**
- **Phone-first playtests:** every milestone ships to GitHub Pages so Cletus can play it on his phone.
- **Tuning lives in config:** balance changes don't need code changes.
- **Map rule:** `reach` passes on every map (MOV 2 / JUMP 2, and JUMP 1).
- **The balance sim stays green:** the human-like model wins 65–75% in every cell.
- **No phone-only controls:** touch, controller and keyboard all work.

---

## Milestones, in build order
The big unknowns come first (M1–M4), so we learn early if one of them changes the plan. Systems come next (M5–M9), then content and polish (M10–M12). The art and audio trials (M3, M4) can run alongside M1–M2.

| # | Milestone | What gets built | Done when |
|---|---|---|---|
| **M1** | **TypeScript foundation** | Port the rules modules (game, ai, hero, party, missions, config) and `tools/sim.mjs` to TypeScript with a build step. Keep them engine-agnostic. | Typecheck is clean; sim results match v0.13 within noise (±1.5 points per cell); all Playwright tests pass on the TS build; Pages still deploys. |
| **M2** | **Renderer + input layer** | A PixiJS (or chosen) iso renderer to replace the hand-drawn canvas: camera, tiles, units, cursor, menus. One input layer for touch, controller (Gamepad API) and keyboard. | All current maps play at v0.13 feature parity; 60 fps on a mid-range phone; a whole battle can be played with only a controller, only touch, and only a keyboard. |
| **M3** | **Art pipeline test** | Tancred makes one test set: an FFTA2-style portrait, one unit sprite sheet (idle, walk, attack, hit, fall; 4 facings), and a tile set. Then a repeatable path from source to atlas to the game. | Cletus approves the bar ("this is the look") and the pipeline produces in-engine assets with one command. If not, iterate or rescope before M11. |
| **M4** | **Audio trial** | Tancred makes one battle track, one town or map track, and a basic set of sound effects (cursor, confirm, hit, miss, fall). Plus a mixer and settings. | Cletus calls it **go** (Tancred keeps doing audio) or **no-go** (Cletus does it himself). Either way the audio hooks are in the engine. |
| **M5** | **Stats 1–100 + leveling** | Rescale stats to 1–100 with a level cap of 50: class growth tables, XP from fights, level-ups that only raise stats, and new creation rolls and class minimums. Rework the combat formula and enemy scaling to match. | Sim cells are back at 65–75%; a level-1 hero and a level-5 hero (the end of Ch.1) both feel right in a playtest; creation still makes heroes noticeably different. |
| **M6** | **Data formats + saves** | Data formats for the mission tree (missions, unlocks: chain / branch / companion-only / ability-unlock, multi-part legs), the world map (nodes, edges, towns) and story scenes. Save/continue with versioning. | Chapter 1 is described as data only; a validator checks unlocks and that every map passes `reach`; saves survive a reload and a version bump. |
| **M7** | **World map + town** | World-map nodes and travel. Change party and gear at any node. At towns: a shop and a mission board, where you take a mission and travel to it. Side jobs on the way. Multi-part missions lock travel back to town until they're done. | A full loop works with test missions: town → take a job → travel (with an on-the-way side job) → battle → next leg → back to town. No extra button presses beyond choosing where to go. |
| **M8** | **Growth systems** | Stat gear; one rare piece that teaches an ability you keep; one class-branch pick (1 of 2); a borrowed secondary skill set (if it fits the slice); wounds (a fallen companion is Wounded for the next battle; the hero falling = loss). | Each system shows up in a playtest of the loop; the sim handles gear and levels and stays at 65–75%; a learned ability stays after the gear is removed. |
| **M9** | **Combat fixes (research 1 + 4)** | Action-menu forecast + end-of-battle tally. One map with deadly edges (falls or water) or a goal other than kill-all. | In a playtest, Cletus uses abilities more than in v0.13 (the tally shows it), and the edge/objective map plays differently from the others. |
| **M10** | **Story scene system** | In-engine scenes: sprites move and act on the iso map, portrait text boxes, simple scripting (move, face, emote, wait, camera). Hooks at mission start, join and finale. | One scene plays from start to finish with placeholder text, can be skipped and advanced with tap, A or Enter, and is fully driven from data. |
| **M11** | **Chapter 1 content** | The **story session** happens (premise + the Ch.1 mythology hook). Then the Ch.1 mission tree: **2 recruit missions**, branching side missions, **one multi-part mission**, and a finale. Companion portraits, sprites, join scenes and payoffs. Final maps. | Ch.1 plays start to finish in about 2 hours; every map passes `reach`; there's no placeholder text; the mythology hook lands in Cletus's playtest. |
| **M12** | **Polish + platform builds** | Final art and audio on everything; final hero creation UI with 8–12 portraits; onboarding with no tutorial popups (the first battle teaches by design); Capacitor (iOS/Android) and Tauri/Electron (Steam) builds. | Meets the "commercial quality" bar (final art and audio, no placeholders, stable saves, 60 fps on a mid-range phone, controller parity). The phone and desktop builds install and run. Cletus would show it as "this is the game". |

---

## Big unknowns
These are flagged because each one could change the plan, the schedule or the scope. Each has the milestone that answers it.

1. **Stat rescale to 1–100 and level 50 (M5).** The whole balance (combat formula, 3d6 creation rolls, class minimums, the difficulty cells per squad, enemy scaling) is tuned for stats of 3–18 and no levels. Open questions:
   - How big is one point?
   - Do the rolls become something like 3d6×5, or class bases plus a rolled spread?
   - How fast do stats grow per class?
   - How do enemies keep up (level-matched or fixed per mission)?
   - Does a big level gap overpower positioning (pillar 6)?

   Ch.1 only reaches about level 5, but the curve has to make sense up to 50.
2. **The world map (M7).** It's a new screen and a new flow with no prototype yet. Open questions:
   - Is it a scrolling map or a node list on phones?
   - How do encounters on the way trigger without being a stop-and-press chore (pillar 1)?
   - How does the multi-part lock read to the player?
3. **The mission tree data format (M6).** It has to express chain, branch, companion-only and ability-unlock missions, plus multi-part legs, and it should scale to about 5 chapters and 10 companions. Open questions:
   - Does a finale close open branches?
   - Which branches carry into later chapters?
   - How many side missions does a chapter have?

   Getting this wrong is expensive later, so it gets a validator from day one.
4. **The TypeScript and renderer migration (M1–M2).** It's a big refactor done by one developer, and the main risk is losing the sim parity and test coverage that make tuning safe. Open questions:
   - PixiJS or another renderer?
   - Does the iso depth sorting and camera hold 60 fps on a mid-range phone?
   - Electron or Tauri for Steam?
   - How do Capacitor and the Steam wrappers handle saves, controllers and Steam features later?
5. **The art pipeline (M3).** Tancred makes all the art. Open questions:
   - Can AI-made sprites stay consistent across facings, animation frames and characters?
   - How many sprite sheets and portraits does Ch.1 need (about 3 hero classes × facings, 2 companions, raiders, the boss, NPCs)?
   - How is the style kept consistent across chapters?

   If the bar isn't reached, M11 and M12 slip, or the scope narrows (fewer animations, shared bodies).
6. **The audio trial (M4).** Nobody knows yet how good AI-made music and sound will be. The fallback is that Cletus makes them himself, which costs his time. Decide early so the slice schedule knows who owns audio.
7. **The story premise (before M11).** It's deliberately unwritten. M10 can be built with placeholder text, but Ch.1 content can't be final until the story session has happened.

## Not in the slice
Chapters 2–5, the other 8 companions, class-branch picks beyond the first, magic and MP, the Physician and magic classes, recruiting by how you win, Switch, and publisher talks (those come after the slice).
