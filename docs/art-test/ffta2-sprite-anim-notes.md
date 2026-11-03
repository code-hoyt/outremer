# Battle sprite animation spec (Outremer), informed by FFT / FFTA / FFTA2

## What the originals do (research summary)
- **Idle = walk-in-place.** Units that aren't acting loop their walk cycle on the spot. They don't stand frozen. FFT's walk animation is a ping-pong over about 4 distinct frames (an 8-step loop), each held for 10–14 ticks at 60 fps (about 170–230 ms). The idle "walk slow" variant uses the same frames with longer holds. Sources: FFHacktics wiki, Unit Animations (walk 0x06–0x0B, "LoadFrameAndWait" 0x0a–0x0e).
- **A separate standing frame** is used for facing and stopped states. FFT's "Facing Angles" animations are 1 frame each, and FFTA2's menu and job-gallery sprites are this standing pose.
- **Two drawn facings, mirrored to four.** Every animation exists as a Forward (front, facing the camera) and a Backward (back) version. The left and right variants are horizontal mirrors.
- **Weapons aren't part of the body sprite.** The standing and walking frames are unarmed. In FFTA2's own Templar job sprite (36×36 cell), the figure stands with no weapon or shield. Weapons appear only in attack animations: FFT keeps them in a separate weapon sprite file drawn on top, and the FFTA2 editor has a patch that "ports weapon animations" between units, which shows they're separate data. Shields appear only in the guard or block poses.
- **Other single- or few-frame poses:** taking damage (front and back), dodge or guard, critical (low-HP kneel), dead, jump up and down, charging or casting (looped), cast execute, plus special per-ability animations.
- **Size:** DS sprite cells are about 32–36 px, and the figure is about 28–32 px tall (2.5–3 heads) on a tile diamond about 32 px wide. The unit is about 1 tile wide and 2 tile-heights tall.

## Our spec
Cell: **176×128 px** at master size, with the feet 2 px above the bottom edge and the body centered horizontally. It's drawn in game at about 58 base px tall (tile width is 64 base px). Rows: 0 = front (down-left), 1 = back (up-left). Down-right and up-right are mirrors.

| Anim | Frames (cols) | Timing | When |
|---|---|---|---|
| stand | 0 | held | the unit's own turn (menu open, choosing) |
| idle walk-in-place | 1, 0, 2, 0 | 210 ms each | everyone not acting |
| walk (moving) | 1, 2 | 130 ms each | while moving along a path |
| attack | 3 (wind-up), 4 (swing) | 200 ms, then 320 ms | when attacking; **the weapon exists only in these frames** |
| hurt / guard / KO / cast | (planned) one frame each | 300 ms or held | later: hit flash for now, fade on KO |

- Shields are stowed (not drawn) when idle or walking, and could appear in a future guard frame.
- The weapon is baked into the attack frames for now. A separate weapon overlay layer (FFT-style, one set of swing frames per weapon type) is the scalable version once there's gear.
- Each frame gets a palette reduction (about 20 colors) and a 1 px #341E14 outline.
