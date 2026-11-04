# Art test (style test only)

Not final art and not used by the game. Two AI-generated images to check whether the FFTA2-style direction holds up.

## renaud-portrait.png
> Character portrait in the style of Final Fantasy Tactics A2 character portraits: painterly anime bust, soft cel shading, clean light cream background. Brother Renaud, a grizzled middle-aged Templar Knight with short greying hair and stubble, stern but kind eyes, white surcoat with a red Templar cross over chainmail coif and hauberk. Three-quarter view, shoulders up, elegant linework, muted warm palette.

## renaud-battle.png
> Game battle screenshot mockup in the style of Final Fantasy Tactics Advance 2: a small isometric diamond tile map of stone and grass tiles with a little height variation (raised stone steps), viewed from the classic FFTA isometric camera. Standing on it, a chibi FFTA-proportioned 2D pixel-art style sprite of a Templar knight in white surcoat with red cross and chainmail holding a sword, facing an enemy desert raider sprite in a dark turban with a curved scimitar a few tiles away. Bright soft colors, clean painted tiles, no UI text, plain dark background around the map.

# Round 2 (v2/) — style test only

Picks: `v2/renaud-portrait.png`, `v2/yusuf-portrait.png`, `v2/wren-portrait.png`, `v2/battle.png`, `v2/style-sheet.png` (composed with PIL). 6 generations total.

- Renaud v2a: "FFTA2 / Ivalice-style anime character portrait bust: clean cel shading, crisp thin lineart, soft gradient shading, stylized anime face, muted Ivalice palette, plain off-white background. Middle-aged Templar Knight, swept grey hair, grey stubble, stern but kind, white surcoat with red cross over chainmail, no helmet."
- Renaud v2b (pick): v2a as reference + "much more stylized anime, simplified face, fewer wrinkles, larger anime eyes, smooth flat cel shading, crisp uniform lineart."
- Yusuf (Renaud as style ref): "lean Levantine scout, late 20s, sand-colored turban with keffiyeh, short dark beard, calm watchful eyes, leather and cloth scout outfit, quiver strap, short recurve bow."
- Wren (Renaud as style ref): "17-year-old English girl, camp follower turned scout, choppy auburn hair, freckles, quick nervous eyes, patched brown hooded cloak, small bronze amulet."
- Battle v2a: "FFTA2-style battle mockup: bright hand-painted iso tile map, height steps, sand, grass, sandstone ruins; chibi painted sprites ~3 heads tall with visible faces: knight, turbaned archer, auburn-haired girl; two red-and-black raiders with scimitars; blue movement tiles; not pixel art."
- Battle v2b (pick): v2a as reference + "compact floating iso map block, stacked tile heights with cliff sides, bright saturated colors, larger more chibi sprites, raiders on higher ground, sky-blue background."

# Round 3 (v3/) — style test only

Style target: the Ivalice / Akihiko Yoshida-era Final Fantasy (FFT, FFXII) full-body illustration tradition, inspired by an artist Cletus likes. We aimed at the broad tradition and did not clone that artist: no reference images from them were used and their name isn't in any prompt. 6 generations total.

Picks: `v3/renaud-full.png`, `v3/yusuf-full.png`, `v3/wren-full.png`, `v3/contact-sheet.png` (PIL), `v3/battle.png`, and `v3/battle-phone-390.png` (the battle image scaled to 390px wide, phone size). `v3/battle-pixel-alt.png` is the rejected pixel-art take, kept for comparison.

- Renaud a: "Full-body character illustration in the Ivalice-era Final Fantasy Tactics / FFXII concept-art tradition (Akihiko Yoshida-like): soft watercolor-like painterly shading, light thin linework, muted earthy palette of leather browns, worn steel, faded creams; slender realistic proportions with a lightly stylized anime face. Grizzled middle-aged Templar Knight, short grey hair, grey stubble, stern but kind, worn white surcoat with faded red cross over chainmail, belts and pouches, kite shield, longsword, braced low stance, no helmet. Plain white background, soft cast shadow at feet."
- Renaud b (pick): a as reference + "far less texture, smooth soft watercolor washes, light clean linework, simplified chainmail, slender proportions, stylized anime-leaning face, more dynamic braced pose."
- Yusuf (Renaud b as style ref): "lean Levantine scout, late 20s, short dark beard, calm watchful eyes, cream turban with keffiyeh tail, layered faded blue and sand tunic over leather jerkin, wrapped legs, quiver, drawing a composite short recurve bow."
- Wren (Renaud b as style ref): "17-year-old English camp follower turned scout, choppy auburn hair, freckles, nervous eyes, patched brown cloak flaring, faded blue tunic, pouches, bronze amulet, dagger, mid-dodge."
- Battle a (rejected, came out as pixel art): "FFT-style compact iso map with stacked heights, sandstone ruins, sand and grass; small FFT-proportion sprites of the knight, archer and girl; two raiders on a ledge; blue movement tiles."
- Battle b (pick): the three full-body pieces as reference + "same soft watercolor painterly style, NOT pixel art, small painted sprites about 4 heads tall, raiders on the raised ledge, pale blue movement tiles."

# Round 4 (v4/) — style test only (MIX direction)

The direction combines Dojen/Yoshida-style full-body art (round 3) with FFTA2-style dialogue portraits and battle sprites. Only Renaud was made this round. Reference sheets were used for study only; none were used as generation inputs. 4 generations in total.

**In-game test:** open the game with `?art=test` (https://code-hoyt.github.io/outremer/?art=test). Renaud is drawn with the new sprite (front or back, mirrored for the other facings) and uses the new portrait in the turn strip and info panel. The default build is unchanged. Assets are in `assets/art-test/`.

Files: `renaud-portrait-hires.png` plus `-96x128` and `-64x90` (white background flood-filled to transparent). `renaud-sprite-{front,back}-hires.png`, plus `-128` (used in game, drawn at about 58 base px, roughly 1 tile wide) and `-32` (FFTA2-native height, for comparison). Screenshots: `ingame-phone.png` (iPhone 13) and `ingame-zoom.png` (2x crop around Renaud).

- Portrait (renaud-full.png as reference): "handheld tactics RPG dialogue portrait: head-and-shoulders bust turned three-quarters right, top of head slightly cropped, cut at upper chest; clean even dark-brown outline, flat cel shading 3-4 tone bands, rim light on grey hair, younger stylized anime face, large almond eyes, tiny nose, slim jaw, still a grizzled middle-aged Templar with grey stubble, stern but kind; white surcoat with red cross, chainmail coif; bright clean palette; flat white background."
- Sprite a (rejected, about 5 heads tall; renaud-full.png as reference): "single pixel-art isometric battle sprite, chibi 2.5-3 heads, three-quarter front facing down-left, 1 px dark outline, ~3 shades per material, white surcoat with red cross, kite shield, longsword, 8x nearest-neighbour, flat magenta background."
- Sprite front (pick; sprite a as reference): "super-deformed CHIBI, only 2.5 heads tall, oversized head ~40% of height, grey spiky hair, tiny dot eyes, stubby body, chunky boots; same surcoat, shield, sword; facing down-left; 1 px outline, 3 shades per color; magenta background."
- Sprite back (front as reference): "the exact same chibi sprite seen from behind, three-quarter back view facing up-left; magenta background."

# Round 5 (v5/) — style test only (Renaud, building on round 4)

5 generations. The `?art=test` build now uses the v5 assets; the default build is unchanged. The comparison sheet is `v5/compare.png` (top row round 4, bottom row round 5: portrait, front sprite, back sprite, 32px sprite).

**Post-processing (code):** the magenta or white background is removed; images are downscaled with Lanczos; the palette is reduced with median-cut (20 colors for the 128px sprite, 16 at 32px, 24 for the portraits); and a crisp 1px dark-brown (#341E14) outline is added around the silhouette.

- Portrait a (rejected; round 4 portrait as reference, so it stayed realistic with an oval cut): "DS tactics RPG dialogue portrait, strongly stylized anime: big bright almond eyes, tiny nose, slim pointed jaw; grey hair, simple stubble strokes; flat chainmail bands; rectangular crop, no oval; 3 tone bands; white background."
- Portrait b (no reference; this is what broke the realism): "Anime JRPG dialogue portrait in the style of Final Fantasy Tactics A2 / DS-era Square Enix portraits: youthful bishounen face, very large glossy almond eyes, tiny nose, very slim V jaw; veteran Templar, spiky silver-grey hair with anime highlights, faint stubble, stern brow, kind smile; white surcoat with bold red cross, chainmail coif as flat grey diamond pattern; rectangular framing edge to edge; thin dark-brown outline, 3-tone cel shading; white background."
- Portrait c (pick; b as reference): "edit: add clearly visible grey stubble along jaw, chin and lip, a small cheek scar, heavier brows, faint under-eye lines so he reads in his forties; keep the big anime eyes and slim jaw; one red cross centered."
- Sprite front (pick; round 4 front as reference): "same chibi sprite and proportions, but an older veteran: grey stubble, furrowed brow, age lines, narrower eyes; simplified: flat color areas, plain chainmail, one belt, plain shield; thick dark-brown outline, 3 shades per material; magenta background."
- Sprite back (pick; v5 front as reference): "exact same sprite seen from behind, three-quarter back view facing up-left; magenta background."

# Round 6 (v6/) — animated sprite test (Renaud)

The spec is in `ffta2-sprite-anim-notes.md`. Renaud is unarmed when idle or walking, with no shield. The sword exists only in the attack frames. 3 generations.

- **Generated:** 10 poses in total. Front sheet (1 call): stand, walk1, walk2, attack wind-up, attack swing. Back sheet (2 calls): the first call got the stand right but drew poses 3–5 from the front, so a second "back-only" call produced walk1, walk2, wind-up and swing.
- **Done in code:** slicing by transparent columns; a common scale per facing (stand = 120 px); feet aligned at the bottom and the body centered (lower-body center of mass); 20-color palette and 1 px #341E14 outline; packing into `renaud-sheet.png` (5×2 cells of 176×128); mirroring for the other facings; frame selection and timing in `src/main.js`, `?art=test` only.
- **In game (`?art=test`):** idle loops walk1/stand/walk2/stand at 210 ms; moving uses walk1/walk2 at 130 ms; his own turn shows the stand frame; attacking shows the wind-up for 200 ms, then holds the swing until 520 ms.
- Preview: `renaud-anim.gif` (3×) and `sheet.png`.

Prompts: front sheet, with the v5 front sprite as reference: "pixel-art sprite sheet of this exact same chibi Templar knight…ONE horizontal row of 5 poses, magenta background: 1) standing still, UNARMED, no shield; 2) walking-in-place step, left foot forward; 3) right foot forward; 4) attack wind-up, sword raised; 5) attack swing." Back sheet: the same, but "every pose seen from BEHIND, three-quarter back view facing up-left". The back retry: "ONE row of 4 poses, ONLY FROM BEHIND, NO face visible: walk L, walk R, wind-up from behind, swing from behind."

# Round 7 (v7/) — full left/right walk steps + empty-handed attacks with a weapon layer (Renaud)

Cletus on round 6: each walk frame must be a full step, left foot then right foot (round 6 only had stand → right-foot step, so the left foot never showed). And weapons will be their own sprites painted on during attacks.

- **Sheet:** now **6×2 cells** of 176×128: `stand, stepL, pass, stepR, windup, swing` (row 0 front, row 1 back). Timings, frame order, hand anchors and the weapon list live in `CONFIG.artTest` (`src/config.js`); the same metadata is in `assets/art-test/renaud-sheet.json`.
- **Walk = left step, pass, right step, pass** (`artTest.walk = [1, 2, 3, 2]`, 210 ms idle / 130 ms moving). His own turn shows `stand`.
- **How the steps were made (consistency first):** the image model kept drawing the *same* leg forward however it was asked (4 tries: strip prompt, "swap the legs" edit, cleanup of a hand-made swap). So only ONE step per facing was generated (front: a stand+step strip; back: a stand+step strip). The opposite step and the pass frame were **derived in code from that same image**: the two boots are cut out below the tabard hem and their positions swapped (toe direction kept, so he still faces the same way), the gap to the hem filled with dark leg, and the arms re-swung opposite to the legs by stretching one forearm down and shortening the other. All three walk frames per facing come from one source image and one transform, so the **head, hair, face and torso are pixel-identical** across stepL/pass/stepR (only legs, hem and arms change). A plain mirror was rejected: it flips his 3/4 facing.
- **Attacks are empty-handed** (fists closed on an invisible hilt; 3 generations: front wind-up+swing strip, back wind-up+swing strip, and a back swing redo because the strip drew it from the front). Each attack frame has a **hand anchor** `[x, y, angleDeg]` in cell pixels (unmirrored, art faces left). A weapon sprite (`assets/art-test/weapon-sword.png`, a placeholder sword, grip point `[6, 49]`) is drawn with its grip on the anchor, rotated, inside the same mirrored transform as the body, so it follows all four facings.
- **Post-processing:** magenta keyed by chroma; premultiplied Lanczos downscale (front stand = 120 px tall, back stand = 118); one shared 19-colour median-cut palette for all 12 frames + the #341E14 1 px outline = 20 colours; specks removed and pinholes filled.
- **Known rough spots:** the `stand` frame and the attack frames are separate generations, so the face is redrawn slightly differently from the walk frames (stand is only held on his turn, so it doesn't flicker). The derived step's hem edge where the old boot was has a few stray pixels. The front wind-up has the fists apart (cheer pose) rather than together on a hilt; the anchor uses the rear fist.
- Previews: `v7/sheet.png` (labelled, anchors marked), `v7/renaud-walk.gif` (3×, front and back), `v7/ingame-zoom.png` (iPhone 13, every frame forced in game, weapons drawn at the anchors).

# Round 8 (rd2/) — 2-frame walk made with Retro Diffusion (Renaud)

Cletus picked the Retro Diffusion walk (`rd2/walk-2frame.gif`) as the walk.

- **Walk = 2 frames:** `stepL, stepR` (`artTest.walk = [1, 3]`), 210 ms idle / 130 ms moving. His own turn still shows the round 7 `stand`; the empty-handed attacks and the hand anchors are unchanged. The `pass` column (2) stays in the sheet but is no longer used.
- **How:** Retro Diffusion API, `rd_advanced_animation__walking` (8 frames, `remove_bg`, our 20-colour palette as `input_palette`). The input was our round 7 stand frame, front and back. From each 8-frame walk we picked frames 7 and 2 (front stepL/stepR; back is the other way round). Cleanup in code: snap to the palette, flood-fill away the halo and dust, keep the largest blob, align on the head centre with the feet on one baseline.
- **In the sheet:** the frames go in 1:1 (same source scale as the stand, about 122–125 px tall; the game draws every cell at 58 px). Feet sit on the stand's ground row (cell y 127) and the head centre matches the stand's, so he doesn't jump between stand and walk.
- **Known:** the two RD frames have slightly different body angles (a small swivel between steps). A hybrid with one shared body was tried and rejected: it lost the arm swing.
- Files: `rd2/walk-2frame.gif` (3x preview), `rd2/renaud-sheet.png`, `rd2/ingame-zoom.png` (iPhone 13, front then back: stand, stepL, stepR).

## Round 9: FFTA2 timing

- Owner said the walk and the tile-to-tile movement were a little fast. FFTA2 timing measured from gameplay footage is in `ffta2-timing.md`.
- Idle walk-in-place is now **410 ms** per frame (was 210). The moving walk is **170 ms** per frame (was 130). Movement is **340 ms per tile** for all units (`view.moveStepMs`, was 140).

## Round 10 (native1/): native-res Renaud, pixel-exact renderer (`?art=test` only)

- **Sprite:** Renaud redrawn by hand at native size: **30 px tall** (head 12 px, about 0.4 of the height), 18 px wide with the hair (about 0.6), front 3/4 and back 3/4, frames `stand, stepL, stepR`. Sheet `assets/art-test/renaud-native.png`: 3 cols x 2 rows of 24x32 cells (row 0 front, row 1 back; art faces left and is mirrored in game).
- **Palette:** 13 colours used (15 in the ramp set). Three tones per material, with shadows shifted toward purple/red and lights toward cream/yellow: white tabard, red cross, leather, warm grey (hair + mail), and two flat skin tones. Eyes are 1x2 near-black in the lower half of the head; there is no nose. The coloured 1 px outline uses the darkest shade of the adjacent material, with near-black only on the shadow (right) side and under the feet. Inner lines are drawn only between materials.
- **How it was made:** the pixel maps are text files (`docs/art-test/native1/maps/*.txt`, one character per pixel) built into the sheet by `build_sheet.py`. The rd2 walk frames were the pose reference. Retro Diffusion `rd_pro__pixelate` (32x40, 2 images, $0.36) was tried as an underlay but came out too noisy to use (mushy cross, unreadable face), so every pixel is hand-placed. Head, face and torso are identical across stand/stepL/stepR; only the legs and the arm swing change.
- **Renderer:** for stand/walk frames the sprite is drawn in device space. Each art pixel becomes `round(CONFIG.artTest.pixelScale (2) x tile scale k x devicePixelRatio)` whole device pixels (5 on an iPhone 13). The feet anchor is rounded to a whole device pixel, the active bob moves in whole art pixels, and `imageSmoothingEnabled = false`. Mirroring is done around a pixel-boundary anchor, so it stays on the grid.
- **Not changed:** attack frames (windup/swing) still use the old 122 px sheet and the weapon layer, drawn smoothly as before. Tiles and the other units are still vector and smoothed, so they don't match the hard pixel grid. The default build is unchanged.
