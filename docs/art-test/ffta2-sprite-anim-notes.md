# Battle sprite animation spec (Outremer), informed by FFT / FFTA / FFTA2

## What the originals do (research summary)
- **Idle = walk-in-place.** Units that aren't acting loop their walk cycle on the spot. They don't stand frozen. FFT's walk animation is a ping-pong over about 4 distinct frames (an 8-step loop), each held for 10–14 ticks at 60 fps (about 170–230 ms). The idle "walk slow" variant uses the same frames with longer holds. Sources: FFHacktics wiki, Unit Animations (walk 0x06–0x0B, "LoadFrameAndWait" 0x0a–0x0e).
- **A separate standing frame** is used for facing and stopped states. FFT's "Facing Angles" animations are 1 frame each, and FFTA2's menu and job-gallery sprites are this standing pose.
- **Two drawn facings, mirrored to four.** Every animation exists as a Forward (front, facing the camera) and a Backward (back) version. The left and right variants are horizontal mirrors.
- **Weapons aren't part of the body sprite.** The standing and walking frames are unarmed. In FFTA2's own Templar job sprite (36×36 cell), the figure stands with no weapon or shield. Weapons appear only in attack animations: FFT keeps them in a separate weapon sprite file drawn on top, and the FFTA2 editor has a patch that "ports weapon animations" between units, which shows they're separate data. Shields appear only in the guard or block poses.
- **Other single- or few-frame poses:** taking damage (front and back), dodge or guard, critical (low-HP kneel), dead, jump up and down, charging or casting (looped), cast execute, plus special per-ability animations.
- **Size:** DS sprite cells are about 32–36 px, and the figure is about 28–32 px tall (2.5–3 heads) on a tile diamond about 32 px wide. The unit is about 1 tile wide and 2 tile-heights tall.

## Our spec (round 7)
Cell: **176×128 px** at master size, feet on the bottom row (outline at y = 127), head centred at x = 88. Drawn in game at `CONFIG.artTest.drawHeightPx` (58) base px tall (tile width is 64 base px). Rows: 0 = front (down-left), 1 = back (up-left). Down-right and up-right are mirrors. Everything below is in `CONFIG.artTest`.

| Col | Frame | Use |
|---|---|---|
| 0 | stand | the unit's own turn (menu open, choosing), held |
| 1 | stepL | walk: left foot forward, right arm forward |
| 2 | pass | walk: feet together under the hem, arms half-swung |
| 3 | stepR | walk: right foot forward, left arm forward |
| 4 | windup | attack, 200 ms (`windupMs`) — **empty-handed** |
| 5 | swing | attack, held until 520 ms (`attackMs`) — **empty-handed** |

- **Walk / idle:** `walk = [1, 2, 3, 2]` (left, pass, right, pass). Idle walk-in-place at 210 ms per frame (`idleFrameMs`); moving along a path at 130 ms (`moveFrameMs`). Every frame is a full step: the left and right steps differ in which leg is forward, so the loop reads as walking in place, FFTA2-style.
- **Weapon layer (decision, round 7):** body frames never contain a weapon. Each attack frame records a **hand anchor** `hand[facing][frame] = [x, y, angleDeg]` (cell px, unmirrored art space, angle 0 = weapon pointing up, + = clockwise). A weapon sprite has a **grip point**; in game it is drawn with the grip on the anchor, rotated by the angle, inside the body's mirror transform. One body animation therefore works with any weapon sprite (FFT-style). Today there is one placeholder, `weapons.sword`. Later: per-weapon-type sprites (sword, spear, bow…) and possibly per-frame weapon poses; anchors for guard/cast frames when those exist.
- Shields are stowed (not drawn) when idle or walking, and could appear in a future guard frame as another layer.
- Planned single frames: hurt, guard, KO, cast (hit flash and fade for now).
- Each frame: shared ~20-colour palette and a 1 px #341E14 outline.
