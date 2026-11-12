# Outremer — Class list (DRAFT v0.1, 2026-11-12)

> **DRAFT. Nothing in this file is locked.** Names are working titles. Numbers (MOV, JUMP, multipliers) are starting points for tuning in `src/config.js`. It is built on the locked answers in [DESIGN.md → Classes and races](DESIGN.md#classes-and-races--open-questions-2026-11-11) (Q1–Q15) and the races in [research/RACES.md](research/RACES.md).

## Ground rules this draft follows (all locked)
- **Free class switching** between battles, never mid-fight. Class sets **MOV / JUMP / terrain**; learned abilities are kept.
- **Abilities are learned from gear** (FFTA2 mastery). Teaching gear is **sold in shops**, never loot-only. Most classes unlock by **mastering N abilities in prerequisite classes**; special classes unlock through **quests**.
- **Weapons are tied to class.** An **Equip X** ability lets a unit carry another class's weapon at the cost of one carried slot.
- **Loadout (recommendation kept):** the class's own set + **one borrowed set** from another class + about **4 carried abilities** (passives, Equip X, and so on). Borrowing a set never borrows its movement.
- **Sideways tree:** later classes are different, not better. Every class keeps a niche no other class covers (listed per class as **Niche**).
- **Every ability has a cost** built into what it does (no cooldowns): weak damage, rooted, Exposed, Slowed, self-damage, friendly fire, a visible tell, a lost facing choice. No interrupts or button prompts in the enemy turn.
- **Stat growth comes from the class you level in** (FFT-style), so each class has a **growth lean**.
- **Races:** small stat lean + one movement quirk, on top of class movement (Peri: short wing hop over gaps; Ifriti: cheap sand and heat; Cynocephali: cheap rough ground).
- **Holy / profane ground** is a map condition, set by the node you fight on. Some abilities are stronger or weaker on it, so battles ask for different builds.

### Stat key
Stats from DESIGN: **MGT** (attack), **END** (HP), **FOR** (defence), **AGI** (turn speed), **AIM** (hit, crit), **RES** (resist status and shoves). This draft adds a proposed **SPR, Spirit** (spell power and MP once magic arrives); see open question 1.
Growth lean: **▲▲** strong, **▲** good, **–** average, **▼** weak.

---

## 1. Core classes and who can take them

13 core classes in 4 families. **✓** = can take it. **S** = a starting class (no prerequisites).

| Family | Class | Human | Peri | Ifriti | Cynocephali |
|---|---|:-:|:-:|:-:|:-:|
| Fighter | **Sergeant** (S) | ✓ | | | ✓ |
| Fighter | **Knight** | ✓ | | | ✓ |
| Fighter | **Man-at-Arms** | ✓ | | | ✓ |
| Fighter | **Crossbowman** | ✓ | | | ✓ |
| Nimble | **Skirmisher** (S) | ✓ | ✓ | | |
| Nimble | **Archer** (S) | ✓ | ✓ | | ✓ |
| Nimble | **Harrier** | | ✓ | | ✓ |
| Magic | **Physician** (S) | ✓ | ✓ | ✓ | |
| Magic | **Alchemist** (S) | ✓ | | ✓ | |
| Magic | **Astrologer** | ✓ | | ✓ | |
| Magic | **Geomancer** | | ✓ | ✓ | |
| Holy | **Chaplain** | ✓ | | | |
| Holy | **Hunter** | ✓ | | | ✓ |
| | **Core total** | **11** | **5** | **4** | **7** |
| | **+ race-only** | 2 | 3 | 3 | 3 |
| | **Classes per race** | **13** | **8** | **7** | **10** |

Why this split:
- **Humans get almost everything** except Harrier and Geomancer, which belong to the other peoples. **Chaplain** is the one Human-only core class (crusader clergy).
- **Peri** = nimble core + Physician (the research had them as scouts, healers and archers) + Geomancer (light and quick, reading the land).
- **Ifriti** = the magic core. That is their whole core list, so their three race-only classes add the physical side (see open question 3).
- **Cynocephali** = the fighter core, plus Archer, Harrier and Hunter for the tracker identity.
- Every core class is open to **at least two races**, except Chaplain. Every race has **at least two starting classes**.

---

## 2. Core classes

Format: **Weapon · MOV/JUMP (terrain) · growth lean · unlock**, then the niche and 3–4 signature abilities, each with its cost. Abilities marked *(v0.13)* already exist in the prototype.

### Fighters

#### Sergeant (starting)
- **Spear / pike · 4/2 (standard) · MGT ▲ END ▲ FOR – AGI – AIM – RES ▲ · Starting**
- **Niche:** zone control and reach. The only class that punishes enemies for walking.

| Ability | Effect | Cost |
|---|---|---|
| Brace *(v0.13)* | Stance: first foe that walks into the 2 tiles in front is stopped and thrust | No attack; the zone is visible, so smart foes route around it |
| Hook *(v0.13)* | Foe exactly 2 tiles away, ×0.5, pulled 1 tile toward you | Weak hit; the pulled foe ends next to you |
| Run Through | Hits two foes in a line at ×0.8 each | Spear stuck: you can't move after |
| Hold the Line *(passive)* | +1 RES against shoves for each adjacent ally | Lose it if you end your turn alone |

#### Knight
- **Sword + shield · 3/1 (heavy: sand 2, rock 3) · END ▲▲ FOR ▲▲ MGT ▲ AGI ▼ AIM – RES – · Sergeant: 2 mastered**
- **Niche:** the anchor. Turns flanks into fronts and protects others.

| Ability | Effect | Cost |
|---|---|---|
| Shield Bash *(v0.13)* | ×0.6, shove 1 tile; ledges, walls and units add damage | Weak unless the terrain behind pays off |
| Shield Wall *(v0.13)* | Stance: front damage ×0.5; adjacent allies covered | No attack; Slowed (MOV −1) next turn |
| Stand Guard | Pick an adjacent ally: hits on them land on you until your next turn | You take them as side hits, and you can't act next turn if you guarded twice in a row |
| Charge | Move 3+ tiles in a straight line, hit at ×1.3 | You face the way you charged, with no facing choice |

#### Man-at-Arms
- **Mace / axe (two-handed) · 4/1 (standard, rubble 2) · MGT ▲▲ END ▲ FOR – AGI ▼ AIM ▼ RES – · Sergeant: 3 mastered**
- **Niche:** breaks armour and terrain. Raw single-target damage.

| Ability | Effect | Cost |
|---|---|---|
| Crushing Blow | ×1.4 and ignores half the target's DEF | Slowed next turn (overswing) |
| Sunder | Target's FOR −3 for the rest of the battle | ×0.5 damage; you're Exposed until your next turn |
| Ground Slam | Every adjacent tile takes ×0.6, allies included | Stuck: you can't move on your next turn |
| Wade In *(passive)* | Rubble and shallows cost 1 | −1 JUMP |

#### Crossbowman
- **Crossbow · 3/1 (standard) · AIM ▲▲ MGT ▲ FOR ▲ AGI ▼ END – RES – · Archer: 2 + Sergeant: 1**
- **Niche:** armour-piercing ranged fire that doesn't need height. The answer to Knights and Shield Walls.

| Ability | Effect | Cost |
|---|---|---|
| Heavy Quarrel | Range 2–5, ignores half DEF and Shield Wall | Planted: only if you haven't moved, and you can't move after |
| Pavise | Place a pavise on an adjacent tile; it blocks ranged shots through it | Uses your action; enemies can break it |
| Bolt Through | Pierces two foes in a line | No height bonus; friendly fire on allies in the line |
| Flat Trajectory *(passive)* | No penalty for shooting uphill | Height advantage never adds range |

### Nimble

#### Skirmisher (starting)
- **Daggers / short blades · 5/3 (nimble: sand 1, rock 1) · AGI ▲▲ AIM ▲ MGT – END ▼ FOR ▼ RES – · Starting**
- **Niche:** facing manipulation and getting behind the line.

| Ability | Effect | Cost |
|---|---|---|
| Feint *(v0.13)* | ×0.4; the target turns to face you | Pure setup, almost no damage |
| Vault Strike *(v0.13)* | Leap over a foe, strike its back at ×0.8 | Hard landing: you can't move after |
| Hamstring | ×0.5; the target has MOV −2 next turn | You end adjacent and can't move after |
| Slip Away | After attacking, move up to 2 tiles | You end facing away from the foe, with no facing choice |

#### Archer (starting)
- **Bow · 4/3 (light: rock 1) · AIM ▲▲ AGI ▲ MGT – END ▼ FOR ▼ RES – · Starting**
- **Niche:** height. The only class that gets more from high ground the higher it goes.

| Ability | Effect | Cost |
|---|---|---|
| Pinning Shot *(v0.13)* | ×0.6; target MOV −2, JUMP ≤1 next turn | Planted (no move before or after) |
| Plunging Shot *(v0.13)* | Needs height; +15% per level, never a front hit | Exposed (DEF −3) until your next turn |
| Volley | 3-tile area at ×0.5 | Hits allies in the area too |
| Mark the Range *(passive)* | +1 range when you start your turn on your highest tile so far | Lose it as soon as you step down |

#### Harrier (Peri, Cynocephali)
- **Javelins + sling · 5/3 (nimble) · AGI ▲ MGT ▲ AIM ▲ END – FOR ▼ RES – · Archer: 3**
- **Niche:** hit-and-run at short range. The only ranged class that can move after it shoots.

| Ability | Effect | Cost |
|---|---|---|
| Javelin | Range 2–3, ×1.2 | Your next turn's attack is the sling (×0.6) while you "pick up" another (automatic, no button) |
| Hit and Run | Throw, then spend your leftover MOV | Exposed until your next turn |
| Stunning Stone | Sling, ×0.4; target AGI −20% (acts later) | Very weak damage |
| Light Pack *(passive)* | +1 MOV | −15% max HP |

### Magic
*Magic and MP are parked in DESIGN. Until then the spells below cost only their drawback; see open question 2.*

#### Physician (starting)
- **Staff + satchel · 4/2 (standard) · RES ▲ END ▲ SPR ▲ AIM – MGT ▼ AGI – · Starting**
- **Niche:** healing and curing without faith or magic. The only heals that work the same on holy and profane ground.

| Ability | Effect | Cost |
|---|---|---|
| Bind Wounds | Heal an adjacent ally a lot | You kneel: you can't move after |
| Poultice Toss | Range 3, small heal | The target is Slowed next turn (sticky) |
| Bleed the Humours | Cure an ally's statuses | You both lose 10% HP |
| Triage | Huge heal on an ally under 25% HP | The ally has MOV −2 next turn (stitched up) |

#### Alchemist (starting)
- **Rod + flasks · 4/2 (standard) · SPR ▲▲ AIM ▲ AGI – END ▼ FOR ▼ MGT ▼ · Starting**
- **Niche:** area damage and tile effects. Naft (Greek fire), quicklime, salts.

| Ability | Effect | Cost |
|---|---|---|
| Naft Flask | 3-tile area, fire stays on the tiles for one round | Burns anyone who enters, allies included |
| Quicklime | Area: targets −30% hit next turn | No damage |
| Salt Ward | One tile: profane units can't enter it this round | Uses your action; tiny area |
| Volatile Mix | Next flask ×1.5 | You take 10% max HP; the flask must be thrown next turn |

#### Astrologer
- **Book / astrolabe · 4/2 (standard) · SPR ▲ RES ▲ AGI ▲ AIM – MGT ▼ END ▼ · Alchemist: 2 + Physician: 1**
- **Niche:** turn order (CT). The only class that bends who acts when.

| Ability | Effect | Cost |
|---|---|---|
| Auspice | An ally gains +40 CT (acts sooner) | You drop to 0 CT (you act last) |
| Ill Omen | A foe loses 40 CT | You're Exposed until your next turn |
| Conjunction | Swap the CT of two units in a line | Both must be in a straight line from you, friend or foe |
| Read the Heavens *(passive)* | The turn strip shows 4 more turns | −10% max HP |

#### Geomancer (Peri, Ifriti)
- **Staff · 4/3 (standard; ignores 1 height when climbing slopes) · SPR ▲ RES ▲ AGI ▲ FOR – END – MGT ▼ · Physician: 3**
- **Niche:** reshaping the map. Effects change with the tile you stand on.

| Ability | Effect | Cost |
|---|---|---|
| Earthsong | Effect set by your tile: sand blinds, rock lowers DEF, grass roots, water slows | You must stand on that tile type; moving changes the spell |
| Raise Ground | A tile rises 1 level | Your own tile sinks 1 level |
| Sink | A tile drops 1 level (ledges, falls) | You can't move next turn |
| Quake | Adjacent units shoved 1 tile outward | Allies are shoved too |

### Holy

#### Chaplain (Human only)
- **Staff / censer · 4/2 (standard) · RES ▲▲ SPR ▲ FOR ▲ END – AGI ▼ MGT ▼ · Physician: 2 + Sergeant: 1**
- **Niche:** blessings, and fighting on profane ground. Strongest when the ground is holy.

| Ability | Effect | Cost |
|---|---|---|
| Bless | An ally gets +20% ATK until their next turn | You can't attack this turn or next |
| Psalm of Shelter | Adjacent allies resist statuses this round | You kneel in prayer: no move next turn |
| Rebuke | Profane units within 2 tiles are shoved 1 tile | Weaker on profane ground; doesn't affect non-profane foes |
| Last Rites | A fallen ally rises with 1 HP | You take their Wound instead (Wounded next battle) |

#### Hunter (Human, Cynocephali)
- **Hunting spear / short blade + lantern · 4/3 (light: rock 1) · AIM ▲ AGI ▲ MGT ▲ RES ▲ END – FOR ▼ · Archer: 2 + Sergeant: 1**
- **Niche:** hunting the profane (Dismas's trade). Single-target focus and tracking.

| Ability | Effect | Cost |
|---|---|---|
| Mark Quarry | One foe: allies +15% damage against it | The quarry knows: it targets you first (AI weight) |
| Lantern | Adjacent profane units turn to face you and take ×0.5 | You're lit: −20% DEF until your next turn |
| Snare | Trap a tile; the first foe to enter it is rooted | No attack; the trap is visible to the enemy |
| Finishing Stroke | ×2 against a foe under 30% HP | ×0.5 otherwise |

---

## 3. Race-only classes (unlocked by race quests)

All units of any race can be recruited from the start; these unlock through that race's quest line.

### Humans (2)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Turcopole** | Short bow · 5/2 · AGI ▲▲ AIM ▲ | The only class that shoots while moving | **Shoot on the Move:** move, shoot, move again (×0.7) · **Parthian Shot:** shoot behind you as you retreat (you end facing away) · **Outride:** +2 MOV this turn (can't act) |
| **Standard-Bearer** | Banner (polearm) · 3/1 · RES ▲▲ END ▲ | An aura from where you stand | **Raise the Standard:** allies within 2 get +RES and +10% damage (only while you stay put; moving drops it) · **Rally:** a Slowed or Pinned ally is freed (you're Exposed) · **Banner as a target:** foes prefer to target you |

### Peri (3)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Kestrel** | Glaive · 5/4 · AGI ▲ MGT ▲ | Dive attacks from height, using the wing hop | **Stoop:** drop from height onto a foe, ×1.2 + 10% per level dropped (you land Exposed) · **Updraft:** hop up 2 levels (no attack this turn) · **Harry:** strike and hop back 1 tile (×0.6) |
| **Lightweaver** | Wand · 4/3 · SPR ▲▲ RES ▲ | Healing and decoys with light | **Mend Light:** heal in a line (also heals foes in the line) · **Glamour:** a decoy that draws the next attack (costs you 15% HP) · **Dazzle:** foes in an area −hit (also allies) |
| **Divbane** | Twin blades · 5/3 · AGI ▲ AIM ▲ | Peri warriors of the old div wars: fast duels against the profane | **Div-Cut:** ×1.4 against profane units, ×0.7 otherwise · **Wingguard:** dodge the next melee hit (Slowed next turn) · **Swift Pair:** two ×0.6 hits (can't move after) |

### Ifriti (3)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Emberblade** | Scimitar · 4/2 · MGT ▲ AGI ▲ SPR ▲ | The fire duellist: melee that hurts more the hotter it gets | **Kindle:** each hit you land this battle +5% damage, stacking (you take +5% damage per stack too) · **Flame Lunge:** dash 2 and hit (leave a burning trail) · **Searing Parry** *(passive)*: melee attackers take fire damage (you take +10% from ranged) |
| **Smokecaller** | Censer-chain · 4/2 · SPR ▲ RES ▲ | Smoke and cover: blocks sight lines | **Smokebank:** a 3-tile cloud that blocks ranged shots, yours too · **Choke:** foes in the smoke −AGI · **Vanish:** you can't be targeted until your next turn (you can't act on it) |
| **Dune Warden** | Spear + buckler · 4/2 (sand 1, heat 1) · FOR ▲ END ▲ | The Ifriti front line, only at home on sand | **Dust Devil:** pull a foe across sand 2 tiles (weak on other ground) · **Sand Wall:** raise a 1-level wall on a sand tile (only on sand) · **Heat Shimmer** *(passive)*: ranged hits on you −20% on sand and heat tiles (+20% on water) |

### Cynocephali (3)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Houndknight** | Sword + shield · 4/2 · FOR ▲ END ▲ AGI ▲ | A fast knight: guard on the move | **Bodyguard:** move to an ally and take their next hit (you can't attack this turn) · **Bark Down:** an adjacent foe can't use abilities next turn (×0.3) · **Stalwart** *(passive)*: can't be shoved (−1 MOV) |
| **Riverwarden** | Staff · 4/2 (shallows 1) · END ▲▲ RES ▲ | Carries allies across water and rough ground (a nod to the legend of the dog-headed giant who ferried travellers) | **Ferry:** carry an adjacent ally with you as you move (both act later: −30 CT) · **Breakwater:** allies behind you take no ranged damage (you take double) · **Steady Footing** *(passive)*: no fall damage |
| **Bayer** | Horn + hand-axe · 5/3 · AGI ▲ MGT ▲ | The pack howl: flanking specialist | **Bay:** foes within 3 face you (it gives away your spot: you're targeted first) · **Run Down:** +2 MOV this turn toward a marked or wounded foe · **Pack Tactics** *(passive)*: flank bonus +10% (−10% damage when no ally is adjacent to your target) |

---

## 4. Hero unique classes (sketch only; story not locked)

The four heroes are **plain Humans**. Each can take every Human class, plus one unique class unlocked through **that hero's side quests**. Unique classes are sideways, not stronger.

| Hero | Class (working) | Weapon · MOV/JUMP | Fantasy and niche | Sketch abilities (cost) | Unlock |
|---|---|---|---|---|---|
| **Tristan** | **Templar** | Sword + shield · 3/1 | Holds the line and lifts the squad. | **Rule of the Order** *(passive)*: +20% DEF and RES, but he can't end his turn farther from the nearest foe (the Templars' no-retreat rule) · **Beauséant:** allies within 2 +15% damage while he stays put · **Non Nobis:** take half the damage dealt to adjacent allies this round | Tristan's side quests (his faith arc) |
| **Aveline** | **Saint-Caller** (Hospitaller) | Staff · 4/2 | Healer who calls blessed help. Strongest on holy ground. | **Intercession:** call blessed help (list not designed; see CHARACTERS) and channel: no move next turn · **Hospital:** heal all adjacent allies (she takes 10% HP) · **Hold Everything Together** *(passive)*: allies near her resist fear-type statuses; she's weaker alone | Aveline's side quests (Act 2+) |
| **Godric** | **Vanguard** | Mace · 4/2 | Charges over defence. | **Headlong:** charge through a foe's tile, hitting them (you end Exposed) · **Hot Blood** *(passive)*: +damage as his HP drops, −DEF as well · **Stand By Me:** a charge that ends next to Tristan heals Godric 10% (he must reach him) | Godric's side quests (after he's found) |
| **Lucien** | **Shadow Archer** | Bow · 5/3 | The Hooded Figure's style: shoots from cover. | **Hooded Shot:** ×1.3 if no foe can see you (only from behind an obstacle; you can't move after) · **Smuggler's Step:** move through foes' tiles · **Second Thoughts** *(passive)*: crits on foes at full HP, −damage on wounded ones | Lucien's side quests after his return (Act 4) |

**Dismas** (two-handed sword) is a hero character but not a real-worlder; he could have a unique **Penitent** class (Hunter + Man-at-Arms). See open question 5.
**Simeon** (lamp on a staff) is the villain. No player class should copy the lamp-staff look; the Chaplain and Saint-Caller use the censer and staff.

---

## 5. Supporting notes

**Unlock tree (core)**
```
Sergeant ──2──► Knight
Sergeant ──3──► Man-at-Arms
Archer 2 + Sergeant 1 ──► Crossbowman, Hunter
Archer ──3──► Harrier
Physician 2 + Sergeant 1 ──► Chaplain
Physician ──3──► Geomancer
Alchemist 2 + Physician 1 ──► Astrologer
```
"N" = abilities mastered in that class. Every race can reach every core class it's allowed, using only its own classes.

**Equip X (escape hatch, one carried slot each)**
| Ability | Learned in | Lets you carry |
|---|---|---|
| Equip Shields | Knight | A shield on any class (keeps class MOV) |
| Equip Spears | Sergeant | Spears |
| Equip Bows | Archer | Bows |
| Equip Heavy | Man-at-Arms | Maces and axes |
| Equip Crossbows | Crossbowman | Crossbows |

**Enemies:** Fallen enemies (Fallen Human, Peri, Ifriti, Cynocephali) use these same kits with a profane twist, so the player learns enemy classes by playing them. Pure profane monsters (Imps, Fiends and so on) have their own kits.

---

## 6. Open questions for Cletus
1. **A magic stat?** The six stats have no magic stat. Add **SPR (Spirit)** for spell power, or let magic run off RES?
2. **MP or drawbacks only for spells?** DESIGN parks "MP later". Should spells cost MP *and* a drawback, or a drawback only, like physical abilities?
3. **Ifriti have the shortest list (7).** Give them a fourth race class, or open Skirmisher to them (fire duellists)?
4. **Chaplain Human-only?** Or open it to Cynocephali (the dog-headed saint tradition)?
5. **Dismas:** should he get a unique class too, like the four heroes?
6. **Ability count:** 3–4 signature abilities per class (about 75 total). FFTA2 had more per class. Is that enough to learn, or too few?
7. **Hero class names:** Templar, Saint-Caller, Vanguard and Shadow Archer are placeholders. Any you'd like changed?
