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
