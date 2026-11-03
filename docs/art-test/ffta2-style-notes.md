# FFTA2 style notes (internal study reference for Outremer)

Reference images are kept on the box only (`/workspace/art-ref/ffta2/`, contact sheets `ffta2-*.jpg`). They're copyrighted, so they're never committed. These notes describe the look in words.

## Portraits (dialogue)
- **Native size is about 64×90 px** (DS). The framing is a **head and shoulders bust** with the face turned three-quarters (mostly toward screen-right). The crown is often cropped by the top edge, and the frame cuts off at the upper chest. Hair and ears or hats can break the frame.
- They're **hand-cleaned pixel paintings** rather than downscaled illustrations. Each has a crisp **1 px dark outline** (dark brown or desaturated, not pure black) with no anti-aliasing to the background. There's no background at all: the portrait sits on the textbox.
- **Shading:** 3–4 tone cel bands per material, a bright rim on hair, and glossy anime hair highlights. Skin uses only 2–3 tones.
- **Faces:** large almond eyes with a bright iris, about 1/5 of the head width. The nose is a tiny dot or line, the mouth a short stroke, the jaw slender and pointed. They're young and pretty, even on grown men. Non-humans (bangaa, moogle, viera) follow the same rendering.

## Character art (Ryoma Ito)
- Full-body figures on **plain white with no ground shadow, or only a faint one**. Poses are relaxed but asymmetric, often with a weapon held out.
- **Linework:** thin, even, warm-brown or sepia ink, with a lot of interior detail on straps, buckles and fabric folds.
- **Shading:** flat color with light watercolor or airbrush soft shading. There's less contrast than in the Dojen or Yoshida look and almost no cast shadow.
- **Palette:** brighter and more saturated than FFT or FFXII. Clear primaries (reds, blues, greens), cream highlights, with earth tones as the base. It's more storybook than gritty.
- **Proportions:** humes are about **6.5–7 heads, slender and long-legged**, with big blocky boots, puffy trousers, and layered asymmetric costumes. Races are strongly stylized silhouettes.

## In-game sprites and tiles
- Battle sprites are **about 24–32 px tall** (Luso 16×29, Adelle 21×31, job sprites in 36×36 cells). That's **about 2.5–3 heads tall, chibi**, with the head about 40% of the height.
- The tile diamond is **about 32 px wide by 16 px tall** in a 2:1 iso view, and each height step is about 8 px. **A unit is about 1 tile wide and roughly 2 tile-heights tall**, so it stands about one height step above the cliffs beside it.
- Sprites have a **1 px dark outline**, very limited color ramps (about 3 per material), and big bright hair and hat shapes. Units are recognized by **hair or hat color and silhouette, not faces**. The face is 2 eye pixels.
- **Tiles** are lush, painterly pixel textures. Grass tops are clearly lighter than cliff sides, which are darker and stony, so height reads by value contrast. Fences, trees and props are at the same pixel density.
- **On a small screen**, the full 256×192 view shows about 8×8 tiles, with 6–10 units fitting comfortably. The UI is small pill-shaped buttons in the corners, and a floating crystal or arrow cursor sits above the active unit. Readability comes from saturated unit colors against mid-green or mid-gray terrain.

## How this differs from our round 3 art
- Round 3 is **muted, desaturated, earthy, with watercolor wash** (closer to the Dojen and Yoshida reference). FFTA2 is **brighter, cleaner cel shading** with more saturated primaries.
- Round 3 lines are sketchy and variable. FFTA2 lines are **thin, even and clean**.
- Round 3 faces are semi-realistic (Renaud especially). FFTA2 faces are **smaller-nosed, bigger-eyed and slimmer-jawed**.
- Round 3 has grounded soft shadows. FFTA2 art has **little to no shadow**.
- Round 3 battle figures were about 2× too big and realistically proportioned. FFTA2 sprites are **about 30 px chibis at 2.5–3 heads, 1 tile wide**.
- Decision point: Dojen's look fits the full-body illustrations, while FFTA2 fits the **portraits and sprites**. One option is Dojen-ish character art with FFTA2-rule portraits and sprites.

## GenerateImage prompt blocks
**Full-body character art:**
> Official-style character illustration for a handheld tactics RPG, full body, standing three-quarter pose, plain pure white background, no cast shadow. Thin clean even sepia-brown ink linework with detailed straps, buckles and fabric folds. Flat cel colors with light soft airbrush shading, bright saturated storybook palette (clear reds, blues, greens on warm earth tones). Slender youthful anime proportions about 7 heads tall, long legs, oversized chunky boots, layered asymmetric costume. Large almond eyes, tiny nose, small mouth, narrow pointed jaw. Character: [DESCRIPTION].

**Dialogue portrait:**
> Pixel-art dialogue portrait, 64×96 px native, head-and-shoulders bust facing three-quarter right, top of head slightly cropped, transparent background. 1 px dark-brown outline, no anti-aliasing, 3–4 tone cel shading, glossy hair highlights, big bright anime eyes, slim jaw, tiny nose. Bright saturated palette. Character: [DESCRIPTION]. Render at 4× nearest-neighbour.

**Battle sprite:**
> Pixel-art isometric battle sprite, about 30 px tall in a 32×32 cell, chibi 2.5–3 heads tall, facing down-left, 1 px dark outline, 3-colour ramps per material, bold hair or hat colour for readability, transparent background, standing on a 32×16 px iso grass tile. Character: [DESCRIPTION]. Render at 4× nearest-neighbour.
