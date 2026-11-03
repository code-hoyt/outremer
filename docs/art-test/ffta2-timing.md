# FFTA2 walk and move timing (round 9)

Owner feedback: idle walk and tile-to-tile movement both felt a little fast. No published FFTA2 frame data was found (the FFHacktics wiki animation tables are for FFT on PS1, not FFTA2), so the FFTA2 numbers below were measured from gameplay footage with yt-dlp + ffmpeg frame differencing.

## Sources

- Footage A: "Final Fantasy Tactics A2: Grimoire of the Rift (DS) 100% Longplay - Part 43" (YouTube IoZgEdWPpLs), 720p at 30 fps, 10:00-14:00.
- Footage B: "Final Fantasy Tactics A2: Red King (20 lvl + hard mode)" (YouTube KDK12DKaFNo), 720p at 59.94 fps, 2:00-5:00.
- Reference only: FFHacktics wiki, Unit Animations / SEQ & Animation info (FFT PS1). Idle walk 0x06 waits 6,8,10,8,6,8,10,8 ticks (64 ticks, about 1.08 s per 8-frame cycle); WalkTo 0x18 waits 4,4,4,2,... (28 ticks, about 0.47 s per cycle). So moving walk cycles about 2.3x faster than the idle walk.

## Measurements

- **Idle walk-in-place (A, a unit walking in place with a static camera, 3.4 s):** pose changes at frames 2, 11, 15, 23, 27, 35, 39, 48, 52, 60, 64, 72, 76, 84, 88 (30 fps). Pattern: long hold about 8.3 frames (about 275 ms, roughly 16-17 DS ticks), then short hold 4 frames (about 135 ms, 8 ticks). The long holds alternate left and right step poses; the short ones are the in-between stride pose. A new step pose every about 410 ms; full 4-pose cycle about 820 ms. Confidence: high (±1 video frame, 33 ms).
- Not every unit animated in place in the footage; several stood still in both clips. The walk-in-place exists, but it isn't constant for every unit.
- **Per-tile move (A and B, camera-tracked with phase correlation):** A, about 5-6 tiles with stairs in about 2.1 s (about 0.35-0.42 s per tile). B, about 3-4 tiles up stairs in about 1.4-1.6 s (about 0.40-0.50 s per tile). Confidence: medium. Both moves included stairs, the camera follows the unit, and the tile counts are estimates. Flat ground is probably at the lower end.
- **Moving walk cadence:** not cleanly measurable (the camera pans and the sprite is small). It is derived from one stride per tile, which matches FFT's WalkTo being about 2.3x the idle cadence.

## Values (src/config.js)

| Setting | Old | New |
|---|---|---|
| `artTest.idleFrameMs` | 210 | 410 (one step pose per FFTA2 step, our walk has no in-between frame) |
| `artTest.moveFrameMs` | 130 | 170 (stepL + stepR = one tile) |
| `view.moveStepMs` | 140 | 340 (all units) |
