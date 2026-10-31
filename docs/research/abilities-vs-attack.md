# Outremer — Why players just attack (and how to fix it)

*Research for Stage 1, written Oct 31, 2026. No gameplay was changed. Everything here is a proposal for Cletus to confirm.*

## Summary
- **"Just attack" is a math problem.** Players attack when Attack is free, full damage, always available and safe. They use abilities when the situation makes an ability clearly bigger, not +15%.
- **In Outremer v0.4 the math favours Attack almost every time.** Every ability does 40–80% of Attack's damage and has a cooldown. The payoffs (fall 5 per level, slam 6) only roughly break even. Example: Shield Bash off a 1-level ledge does about 9 + 5 = 14, while a plain Knight attack does about 15.
- **What the best games did:**
  - make the situation decide the fight: displacement into hazards, objectives other than "kill all", and telegraphed enemy intent
  - make plain hits cost something: counters and armour
  - make abilities "attack plus a rider" instead of a weaker attack
- **The top five proposals for this slice:**
  1. Frontal riposte
  2. Retune every ability so it is at least as strong as Attack when its condition is met
  3. A second map with lethal edges and a non-kill objective
  4. Show what each Raider intends to do
  5. Show the damage or effect of each ability in the Action menu

---

## 1. Why "just attack" dominates
| Cause | What it looks like | Source |
|---|---|---|
| Attack is the best average action | Free, every turn, full damage, no setup. Target choice is trivial (lowest HP / biggest threat). | r/RPGdesign "I attack, you attack…" thread (u/notbatmanyet): https://www.reddit.com/r/RPGdesign/comments/gq4zzt/combat_i_attack_you_attack_repeat_until_one_of_us/ |
| Bonuses too small to set up | "Situational bonuses that are too small (+1) don't justify setting them up." | same thread; also https://www.reddit.com/r/RPGdesign/comments/g4hhdx/it_feels_like_attacking_is_the_best_option_every_turn/ |
| Abilities are "attack but different number" | Banner Saga devs on FFT: "you're basically looking at them saying, 'I want to do a bigger fireball.'" and "you may have 30 abilities, but they're all just doing a different amount of damage." | Polygon: https://www.polygon.com/gaming/2012/9/28/3412786/the-banner-saga-is-a-strategy-rpg-that-makes-stats-matter/ |
| Abilities cost a resource the basic attack doesn't, and lose its perks | FE Three Houses combat arts cost extra durability and can't double, so a plain doubled attack usually wins: "felt way more reliable to use basic attacks instead 80% of the time" (u/Am_Shigar00). | https://www.reddit.com/r/fireemblem/comments/l3z3y1/combat_arts_are_underutalised/ · https://www.fe3h.com/combat_arts · https://serenesforest.net/three-houses/miscellaneous/combat-arts/ |
| Players are trained to shoot at the enemy | Into the Breach: players "struggled" with an artillery weapon you fire *next to* an enemy to push it, because "all games have always trained us to shoot at the enemy". | GDC 2019 Into the Breach Design Postmortem (Matthew Davis): https://www.youtube.com/watch?v=s_I07Iq_2XM · transcript: https://gameindustrylibrary.com/documents/into-the-breach-design-postmortem |
| Kill-all objectives | FFTA: "Just about 99% of every mission is simply a battle that requires gamers to defeat all the enemies." If killing wins, damage wins. | RPGFan FFTA review: https://www.rpgfan.com/review/final-fantasy-tactics-advance-2/ |
| Early turns have no resource | FFTA2 units start a battle at 0 MP and gain +10 per turn, so the opening turns are attack turns by design. | GameFAQs: https://gamefaqs.gamespot.com/boards/937330-final-fantasy-tactics-a2-grimoire-of-the-rift/44172513 |

**Outremer v0.4, in numbers.** Rough figures, before height and variance:

| Option | Damage |
|---|---|
| Knight Attack vs Raider Spearman | (14 × 1.6 − 7) ≈ 15 |
| Shield Bash (0.6×) + 1-level fall | ≈ 9 + 5 = 14 |
| Shield Bash + slam | ≈ 9 + 6 = 15 |
| Feint (0.4×) then an archer hits the back | ≈ 6 + 11 = 17 |
| Two plain attacks (knight front + archer front) | ≈ 15 + 8 = 23 |

Bash at best equals Attack and then goes on cooldown, and Feint loses. The 3000-battle sim agrees:
- Bash, Pin and Feint are used about 0.01–0.06 times per battle, and Hook 0.
- Plunging Shot (the only ability with a pure damage bonus) is used 1.7 times per battle.

**The game is telling Cletus that Attack is right, and he's reading it correctly.**

---

## 2. The levers, game by game
| Game | Main lever against "just attack" | Pillar fit |
|---|---|---|
| Into the Breach | Telegraphed enemy attacks, no misses, protect buildings, displacement as the main verb | Fits (all on your turn, no prompts) |
| Slay the Spire / Wildfrost | Enemy intent icons / visible attack counters | Fits |
| Fire Emblem Engage | Break (weapon advantage stops counters), Smash knockback weapons, Backup chain attacks | Fits (all automatic) |
| FE Three Houses | Combat arts (cost durability) | Cautionary: cost felt "not interesting" |
| Triangle Strategy | TP economy, knockback on height, follow-up when sandwiching, falls/collisions | Fits |
| XCOM 2 | Cover makes plain shots bad; flanking shown in UI; abilities "big, obvious" | Fits (Overwatch is set on your own turn) |
| Unicorn Overlord | Pre-set passive reactions (PP) with conditions, front/back rows | Fits very well ("from your own choices") |
| Tactics Ogre Reborn | One MP pool for skills, auto-skills, buff cards on the field | Partly: random cards criticised |
| Banner Saga | Strength = HP and damage; armour vs strength choice every hit; Willpower spend | Fits (Stage 2 material) |
| DOS2 | Surfaces + teleport; armour gates control | Surfaces fit; armour gate is a warning |
| Disgaea | Geo panels; Lift/Throw | Fits; can get busy |
| FFTA / FFTA2 | Laws ban actions (e.g. swords); MP starts at 0 | Laws conflict with the pillars |
| Tactical Breach Wizards | Knock enemies out of windows; rewind; each wizard's magic distinct | Fits |

### Into the Breach: manipulation beats killing
- Telegraphed attacks with no hit chance made the player's turn deterministic, "like a micro chess puzzle".
- Once the goal became protecting buildings, "killing enemies just fundamentally wasn't as fun as manipulating them". The push, pull and teleport weapons "made the player feel really smart".
- A turn limit, instead of kill-all, meant "we could make interesting non-lethal weapons".
- Prototypes with standard move-and-attack, and even a timeline system, "ended up with just a turn-based system… you had to move and shoot".
- Sources:
  - GDC postmortem: https://www.youtube.com/watch?v=s_I07Iq_2XM (transcript: https://gameindustrylibrary.com/documents/into-the-breach-design-postmortem)
  - Road to the IGF: https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-

### Slay the Spire and Wildfrost: show intent
- Slay the Spire's intent icons came from about ten iterations. Early random, Final Fantasy-style enemy moves were "too random and unplannable".
  - GDC: https://gdcvault.com/play/1025731/-Slay-the-Spire-Metrics
  - https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder
- Wildfrost shows every unit's attack countdown. Reviewers praise the planning it allows; the downside is that losses can feel inevitable.
  - https://wildfrostwiki.com/Counter
  - https://www.pcgamer.com/wildfrost-review/

### Fire Emblem: make plain hits risky, then give a way around it
- In Engage, a weapon-advantage hit inflicts Break: the target can't counter this combat or the next one. Attacking is risky because of counters, and Break is the reward for picking the right unit and angle.
- Smash weapons give up doubling for big damage plus a 1-tile knockback (extra damage into walls or units). This is an attack *upgrade*, not a replacement.
- Backup units within range join an ally's attack automatically (Chain Attack).
- Source: https://www.gamerguides.com/fire-emblem-engage/guide/walkthrough/gameplay/the-weapon-triangle-break-and-chain-attacks-explained
- Three Houses shows the opposite. Most arts are slight damage boosts that cost durability and can't double, so players ignore them. The arts players praise change range or bypass a defence (Curved Shot, Point Blank Volley).
  - https://www.reddit.com/r/fireemblem/comments/l3z3y1/combat_arts_are_underutalised/
  - https://www.reddit.com/r/FireEmblemThreeHouses/comments/ck4ofh/are_combat_artes_spells_and_better_weapons_broken/

### Triangle Strategy: height, knockback, sandwiches
- The devs' favourite moment: "knocking an enemy back while they're on higher ground… that feels good!" They also highlight the ice wall that blocks a path and lightning paralysis.
  - https://www.nintendo.com/us/whatsnew/get-insight-and-tips-for-triangle-strategy-from-the-devs-themselves/
- How its systems work:
  - TP starts at 2 and grows by 1 per turn, while the basic attack is free.
  - Allies on opposite sides of a target trigger automatic follow-ups.
  - Falls and collisions deal damage, friendly fire included.
  - Sources:
    - https://www.mmorpg.com/reviews/the-rpg-files-triangle-strategy-review-2000124651
    - https://gamefaqs.gamespot.com/switch/313526-triangle-strategy/faqs/79838/principle-of-combat

### XCOM 2: big, obvious, and enemies that break habits
- Jake Solomon: "Making all of the soldier abilities do something not big, but obvious… It's not like +15% to something." Enemies are designed to break the player's habits, such as overwatch creep.
  - https://www.gamebanshee.com/news/116850-xcom-2-interview.html
- Cover makes a plain shot at a covered target bad. The flank shield in the UI turns yellow so the opportunity is obvious.
  - https://www.gamedeveloper.com/design/a-deep-dive-into-xcom-and-xcom-2
  - https://xcom.fandom.com/wiki/Flanking_(XCOM_2)

### Unicorn Overlord: reactions you set up, not prompts
- Active skills cost AP. Passive skills cost PP and fire automatically when their condition is met, such as when an ally is attacked. Players set priorities and conditions in advance.
- This is the clearest model for "systems from your own choices, no stop-and-press".
- Sources:
  - https://unicorn-overlord.com/system/stage-battle/
  - https://www.destructoid.com/unicorn-overlord-details-its-gambit-like-tactical-battle-system-and-more-characters/
  - https://www.polygon.com/reviews/24106947/unicorn-overlord-review-vanillaware-sega-atlus/

### Banner Saga: stats that make every hit a choice
- Strength is both HP and damage, so a wounded unit hits weaker.
- Every attack picks between hitting armour and hitting strength.
- Classes have only one or two abilities, each distinctive.
- Source: https://www.polygon.com/gaming/2012/9/28/3412786/the-banner-saga-is-a-strategy-rpg-that-makes-stats-matter/

### Tactics Ogre Reborn, DOS2, Disgaea, FFTA laws
- **Tactics Ogre Reborn.** It folded TP into one MP pool and turned some skills into auto-skills. It also added random buff cards on the field, which RPG Site found made fights "uneven".
  - https://www.rpgsite.net/review/13468-tactics-ogre-reborn-review
  - https://www.square-enix-games.com/en_US/news/tactics-ogre-reborn-new-features
- **Divinity: Original Sin 2.**
  - Teleport is loved because it moves enemies into surfaces or groups them.
    - https://www.reddit.com/r/DivinityOriginalSin2/comments/6mwur4/teleport_is_one_of_the_best_spell_and_maybe_needs/
  - Its physical and magic armour, which blocks all crowd control until stripped, is criticised for turning fights back into a damage race.
    - https://www.reddit.com/r/DivinityOriginalSin/comments/71oo4u/physmag_armor_is_too_blackwhite_with_100_disable/
- **Disgaea.** Lift/Throw and geo panels turn moving units into the main play.
  - https://disgaea.fandom.com/wiki/Geo_Effects
  - https://strategywiki.org/wiki/Disgaea:_Hour_of_Darkness/Geo_Panels
- **FFTA laws.** Banning a command does force variety, but reviewers called it "a cheap method to force different strategic methods" that "far too often leads to frustration".
  - https://www.rpgfan.com/review/final-fantasy-tactics-advance-2/
- **Tactical Breach Wizards.** Tom Francis built it from his problems with XCOM 2. Knocking enemies through windows is the signature move, and each wizard's magic works differently so abilities don't feel samey.
  - https://www.pcgamer.com/tactical-breach-wizards-interview/

---

## 3. Abilities players love vs ignore
**Loved, with evidence:**
- **Displacement into something:** a ledge, a wall, a hazard, another enemy. Evidence: Into the Breach pushes, Triangle Strategy's height knockback, DOS2 teleport, Tactical Breach Wizards windows, Disgaea throws.
- **Abilities that change the rules of a hit.** Examples:
  - range: Three Houses Curved Shot and Point Blank Volley
  - ignoring a defence: Engage's Break and Smash
  - flank shot: XCOM
- **Battlefield control you can see:** the ice wall that blocks a path, and paralysis (both from the Triangle Strategy devs).
- **Free extras from positioning:** Triangle Strategy sandwich follow-ups, Engage chain attacks, and Unicorn Overlord passives. In the Triangle Strategy thread, players' carries were whoever "can exploit good positioning for follow-up and backstabs".
  - https://www.reddit.com/r/TriangleStrategy/comments/t9azg6/whats_overpowered_for_you_so_far/

**Ignored:**
- Small damage bumps that cost something: Three Houses arts, and "bigger fireball" FFT spells.
- Status that the target resists or that rarely matters. FFT players steer clear of Mustadio's Aimed Shot against status-immune targets.
  - https://www.reddit.com/r/finalfantasytactics/comments/ljd4oq/mustadio_usage/
- Setup that pays out on a later turn, when the attack pays now (the r/RPGdesign thread).

**What this means for Outremer.**
- Bash, Hook and Vault are in the loved category on paper, but their numbers are too small and the map has almost no edges worth pushing anyone off.
- Pin and Feint pay out later, the ignored pattern, unless the enemy's next move is visible and matters.

---

## 4. Teaching attack-only players without nagging
- **Show the opportunity in the forecast.** XCOM's yellow flank shield is one example. Engage shows Break in the combat preview. Outremer already shows facing and flank in the prediction, so extend this to abilities.
- **Show enemy intent.** The value of Pin, Brace and Hook only appears when you can see the charge they stop (Into the Breach, Slay the Spire).
- **Let the enemy do it to you first.** Into the Breach kept push attacks off early enemies because "push attacks made it really complex". The other side of that lesson: an enemy that shoves your knight off a ledge teaches Shield Bash better than any tooltip. XCOM likewise designed enemies to break habits.
- **Start with the obvious version.** Into the Breach's starting squad avoided the "shoot next to it" artillery as the first lesson. Outremer's first map should have one big, obvious ledge.
- **Don't ban Attack.** FFTA's laws taught variety through penalties, and reviewers hated it.

---

## 5. Pillar check for each lever
| Lever | Pillar verdict |
|---|---|
| Counters / riposte on frontal hits | Fits: automatic, and it makes facing matter more |
| Enemies that resist plain hits (shields, armour) | Fits: keep it partial, since DOS2's all-or-nothing armour is the warning |
| Terrain, ledges, hazards | Fits |
| Objectives beyond kill-all | Fits |
| Telegraphed intent | Fits (information, no prompts) |
| Resource economies (MP, TP, cooldowns) | Fits; already have cooldowns |
| Automatic combos (follow-ups, chains) | Fits if automatic; any "press now" reaction prompt is out |
| Abilities that upgrade the attack | Fits; matches "trade-off over pure power" when the rider has a cost |
| Attack costs (durability, fatigue) | Weak fit: bookkeeping; FE3H players found it uninteresting |
| Banning Attack (FFTA laws) | Conflicts: imposed from outside, not emergent |
| Random field buffs (TO Reborn cards) | Weak fit: hurts replaying the same battle with intent |

---

## 6. Recommendations for the current slice
### Quick tuning (config only)
- **Make abilities at least as strong as Attack when their condition is met.**
  - Shield Bash dmgMul 0.6 → 1.0; fall 5 → 8 per level; slam 6 → 10.
  - Hook dmgMul 0.5 → 0.9.
  - Vault Strike 0.8 → 1.0. It already lands behind the target, so it gets the back bonus.
- **Feint becomes a rider, not a hit.** Either:
  - it costs only the Move (you can still Attack), or
  - it does 0.4× and the target loses its counter (if riposte goes in).
- **Pinning Shot becomes "pin in place".** It sets MOV to 0 instead of −2, so it plainly stops a charge.
- **Cooldown 1 for the cheap utility abilities** (Pin, Hook) once they are not stronger than Attack.

### Encounters, map and enemies
- **Map 2 (already on the roadmap): build it around edges.** A ruined curtain wall with 2–3 level drops, a well or cistern, and a narrow bridge. Falls of 16–24 damage make Bash and Hook the obvious play.
- **Raider Shieldbearer** (reuse the Swordsman). Frontal plain hits do half damage and side or back hits do full. Feint, Vault, Hook and Bash are the answers.
- **A non-kill objective on one map.** Examples: escort pilgrims to the gate, hold the chapel for 6 turns, or carry the relic out. Displacing and blocking become worth as much as damage.
- **AI uses displacement against the player.** Raise wFall and wPullIntoFlank and let Raiders shove Templars off ledges. Enemies teach by example.

### System changes
- **Frontal riposte.** A unit hit from the front by a plain Attack counters automatically at 50%, if the attacker is in its range. Abilities, side hits and back hits are not countered. Engage's Break is the model. No prompts.
- **Visible intent.** Each Raider shows a thin line to the unit it currently plans to hit, recomputed after each of your actions.
- **The Action menu shows the numbers.** Each ability row shows its full predicted result next to Attack's. For example: "Bash 15 + fall 16", or "Pin: Swordsman can't reach Archer".
- **End-of-battle tally.** Show Attacks vs each ability used, per side, so playtests measure the mix.

### Innovation ideas unique to Outremer
- **The Rule (pre-battle vow).** Before a battle, the squad takes one Templar Rule. Each is a trade-off that shifts what's best, chosen by you rather than imposed like an FFTA law. Examples:
  - "Never retreat": no backward moves, +20% front damage
  - "Shield-brothers": +flank but −MOV when alone
- **Beauséant (the battle standard).** A carried banner: units adjacent to it get automatic follow-ups (Triangle Strategy sandwiches, Engage chains). Where you plant it becomes a positioning decision.
- **Standing orders.** Brace, generalised: each class can end its turn in a stance that reacts automatically on the enemy turn (Unicorn Overlord passives). This is set on your turn, never prompted.
- **Charge.** A Knight that moves 3+ tiles in a straight line before attacking adds the distance as damage and pushes the target. This is an attack upgrade that comes from movement.
- **Relics as terrain.** Objects on the map that change rules nearby. For example, a reliquary that makes falls deal double damage. Varies replays without randomness.

---

## 7. Top 5: what we'd build and how we'd test it
Stage 1 is done when "a fight is fun to replay with the same squad; Cletus wants to play the same battle again and tries different positioning each time".

Test method for all five:
- **Sim.** 3000 battles with `tools/sim.mjs`. Track win rate (target band 0.40–0.55), stalls (under 3%) and ability uses per battle.
- **Playtest.** Cletus plays the same battle 3 times; the end-screen tally shows the action mix.

| # | Build | Test (pass if…) |
|---|---|---|
| 1 | **Frontal riposte** (config `combat.riposte: { mul: 0.5, frontOnly: true, plainAttackOnly: true }`). Shown in the prediction as "Counter −7". | Sim: Feint, Vault and Hook uses per battle go from about 0 to 0.5 or more. Playtest: Cletus reports at least once choosing an angle or an ability to avoid the counter. |
| 2 | **"Attack-plus" retune** (Section 6 quick tuning numbers). | Sim: every ability is used at least 0.3 per battle per side, and no ability is over 2.5. Win rate stays in band. Playtest: at least 25% of player actions are abilities across 3 runs. |
| 3 | **Map 2 "The Curtain Wall"**: 8×8 with 2–3 level drops, a well and a pilgrim-escort objective. Reuses the existing config. | Sim: Bash and Hook falls happen in more than 50% of battles. Playtest: the 3 runs show different opening moves, and Cletus wants a 4th. |
| 4 | **Visible intent lines** from each Raider to its planned target, recomputed live. | Playtest: Pin and Brace each get used at least once per battle by Cletus, and he can say why. Sim: unchanged (UI only). |
| 5 | **Action-menu forecast** (each ability's full result vs Attack, the best one marked) plus the **end-of-battle tally**. | Playtest: Cletus picks an ability because the menu showed it beat Attack, without being told. The tally confirms the action mix moves between runs. |

**Order:** 5 and 2 first (cheap, and they make the rest measurable), then 1, then 3, then 4.

---

*Not separately sourced:* the exact Disgaea and FFT ability praise comes from general knowledge plus wiki pages; ResetEra threads weren't reached.
