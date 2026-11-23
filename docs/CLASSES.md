# Outremer — Classes

Home for every class: race lock, role, weapons, armor, signature, actions, reactions, passives, kit status, saved ideas and open questions. System rules live in [DESIGN.md → Unit kit template (locked 2026-11-18)](DESIGN.md#unit-kit-template-locked-2026-11-18). Lore and look notes live in [WORLD.md](WORLD.md).

Numbers (MOV, JUMP, multipliers, durations) go in `src/config.js` when built, unless a value is already locked here.

---

## The five first race classes

Groundwork started 2026-11-15 as racial callings; the five first classes were picked 2026-11-17. Flavour and look notes stay in [WORLD.md → Racial callings](WORLD.md#racial-callings-class-groundwork-started-2026-11-15).

### Racial callings — class direction and other class ideas

Moved from WORLD.md. Cultural callings stay there; the class-direction sentences and idea lists are here.

- **Humans (locked 2026-11-15):** Their race classes lean toward leadership and faith (for example the Standard-Bearer). Other Human race-class ideas from the pitch, kept for later: Standard-Bearer, Chaplain, Marshal and Turcopole, plus the Hospitaller (the healing-focused order, suggested by Cletus).
- **Ifriti (locked 2026-11-15):** Their magic is sworn: each vow grants power with a limit attached (for example "never retreat" or "never strike first"). These are trade-off upgrades built into the class. **Superseded in part (2026-11-17):** the Oath Mage was reworked the same day (see below); this replaces the earlier "backlash damage to the mage" idea, and oaths are now team stat buffs with a random law on the whole team. Other Ifriti class ideas kept for later: Covenant-Keeper, Truthsayer, Ember-Sworn and Witness.
- **Cynocephali (locked 2026-11-15):** their race classes start as protectors and bodyguards. Pack fighters (stronger beside allies) and mountain hunters (trackers, beast-handlers) are kept as future Cynocephali class ideas. **Howler** (a war-cry guardian that draws attention and shakes enemy morale) is kept as its own future Cynocephali class (from the Shieldbrother notes, 2026-11-17).
- **Hoopoe-kin (locked 2026-11-15):** Charm-wrights (support casters whose charms from every faith really work, a little) and magpie thieves (pickpockets and snoops who steal items and dig up secrets) are kept as future Hoopoe-kin class ideas. Other Hoopoe-kin class ideas kept for later: Courier, Lookout, Herald, Gossip, Skirmisher, Pathfinder, Relay, Decoy and Solomon's Messenger.
- **Peri (locked 2026-11-15):** Their class is built for demon-slaying out of an old grudge: deadly against demons. (The iron weakness was scratched by Cletus on 2026-11-17.) Light-bearers (healers and purifiers), penitents (power earned through redemptive deeds, after the legend of Peri atoning to re-enter paradise), perfumers (scent auras, since Peri live on the scent of flowers), songweavers (battle-singers) and star-readers (seers who manipulate turn order) are kept as future Peri class ideas. Other Peri class ideas kept for later: Cage-Breaker, Grudge-Bearer, Skyblade and Ward-Archer.

### Templar Knight

**Race lock:** Humans (picked 2026-11-17).

**Role:** The heart of the Order, Outremer's take on the FFTA2 Paladin: an armored holy warrior who leans fighter: a front-line sword-and-shield combatant first, with holy power as an edge rather than a caster kit. Its holy power is a holy striker's (locked 2026-11-17): weapon strikes carry holy damage that hits demons and the profane hardest. Healing belongs to a separate, future Hospitaller class, not the Templar.

**Weapons (locked 2026-11-17):** exclusively one-handed swords and shields, with no two-handers, lances or maces.

**Armor:** TBD.

**Signature (locked 2026-11-17):** **Smite**, a simple strike with holy damage that does 1.5x against demons and the profane, with no downside.

**Actions (picked 2026-11-18, rough pitches, numbers still open):** 6 in total, including Smite.
- **Smite** (signature, above)
- **Judgment:** a heavier holy strike that also scores the ground, strongest against demons on profane tiles
- **Shield Bash of Faith:** shield blow that knocks back a tile and stuns if the target is profane
- **Non Nobis:** battle-prayer giving adjacent allies a holy edge on their next attack
- **Beauséant:** plant the banner on a tile; allies near it hold steady and resist fear
- **Relic Blade:** press a relic to the sword so the next few strikes count as holy, but the knight can't defend meanwhile

**Reactions (picked 2026-11-18):**
- **Martyr's Resolve:** survive one fatal hit at 1 HP, once per battle; pairs with Last Stand
- **Rebuke:** when a profane enemy hits the knight with magic, it takes holy damage back

**Passives (picked 2026-11-18):**
- **Last Stand** (picked 2026-11-17) is an equippable passive, not an action: the lower the knight's HP, the harder its holy strikes hit. Its scaling numbers are still to be tuned and will go in `src/config.js` when it's built.
- **Holy Ground:** the tile the knight stands on counts as holy for him alone, buffing only the knight; no movement penalty

**Kit status:** complete (2026-11-18). 6 actions, 2 reactions, 2 passives; numbers go in `src/config.js` when built.

**Ideas kept for later:** Crusader's Charge; reactions Riposte of the Cross, Shield Wall and Bodyguard; passives Equip Shield, Vow of Poverty, Brother-in-Arms and Penitent.

**Open questions:**
- The Templar Knight's limitation is still open; leave it open until Cletus decides.
- Whether it carries a built-in limit (such as a Rule it must keep) is still open, so don't lock one in yet.
- Scaling numbers for Last Stand and the other moves are still to be tuned and will go in `src/config.js` when built.

### Oath Mage

**Race lock:** Ifriti (picked 2026-11-17, mechanic reworked same day).

**Role:** Its defining moves are oaths that are stat buffs, one per stat (for example Attack, Defense, Jump, Speed). Swearing an oath buffs that stat **for the whole team** (locked 2026-11-17), and a **random limitation is then placed on the Oath Mage's whole team**, like the laws in FFTA and FFTA2 (for example "no ranged attacks" or "no items"). If anyone on the team breaks that limit, the oath breaks, and **the penalty mirrors the oath**: an Attack oath breaks into damage to the whole team, a Speed oath breaks into the whole team being slowed, and so on. This replaces the earlier "backlash damage to the mage" idea.

**Weapons (locked 2026-11-18):** book of covenants only.

**Armor (locked 2026-11-18):** robes only.

**Signature (locked 2026-11-18):** **Seal the Page**, learned late (see Actions).

**Actions — oath rules (picked / locked 2026-11-17):**
- **Duration (changed 2026-11-18):** every oath lasts 3 turns and is then fulfilled; still always ends if the Oath Mage falls. 3 is a starting value in `src/config.js`, open to balancing. Replaces the 2026-11-17 rule below.
- ~~Duration (locked 2026-11-17):~~ superseded 2026-11-18: every oath always ends if the Oath Mage falls. On top of that, each oath has a balancing duration matched to the strength of its buff: stronger oaths last a set number of rounds, and milder ones last until the battle ends or the law breaks. Each oath's duration will go in `src/config.js`.
- **Oath finishers stay open (2026-11-17):** besides rounds or battle end, an oath can also end on other conditions, such as a number of kills, a number of deaths or items used. Keep the possibilities open, and don't lock the list.
- **Stacking (locked 2026-11-17):** oaths stack, and stacking oaths means stacking laws, so the player chooses how much risk to take. Each oath is either **once per battle** (only one copy can be active, even with several Oath Mages, and it can't be sworn again unless it breaks) or **stackable** (for example, maybe Attack: each Oath Mage can swear it, the team buff stacks, and every copy adds its own random law). Which oaths stack, and any caps, will be set per oath in `src/config.js`.
- **Single-target oaths (2026-11-17):** some powerful oaths (for example auto-resurrection) affect only one unit instead of the team. Each mage can place one, so bringing several Oath Mages lets you cover several units, one each.

**Actions kept (picked 2026-11-18):**
- **Seal the Page**: write an enemy's name in the book so one of the team's laws binds them too; if they break it, they suffer the oath's penalty. Meant as one of the last, most powerful moves the class learns (Cletus: "sounds powerful").
- **Oaths (picked 2026-11-18):** **Oath of Arms** (team Attack up), **Oath of Iron** (team Defense up), **Oath of the Wind** (team Speed up), **Oath of the Heights** (team Move and Jump up), **Oath of Flame** (team Magic up), and **Oath of Return** (single-target: that unit gets back up once if it falls). Each team oath adds a random law; buff sizes, durations and stacking are set per oath in `src/config.js`.
- **Covenant (picked 2026-11-18):** strengthen one active oath, but its law is drawn from the harsher half of the pool.
- **No attack skill (Cletus, 2026-11-18):** the Oath Mage needs no damage action; like every unit it can make a basic weapon attack (weak with a book). FFTA2 precedent: White Mage, Bard and Dancer had no damaging skills. **No escape move:** no way to end an oath safely early; making or breaking oaths is the player's choice (Release and Recitation rejected).
- **Idea kept (2026-11-18):** some oaths aimed at enemies (timed like all oaths).

**Reactions (picked 2026-11-18):** chosen to be worth equipping on other classes too (Cletus: why would a unit that mastered it equip it elsewhere?).
- **Sworn Witness**: when an enemy hits this unit, that enemy is marked for 1 turn and allies deal more damage to it. Turns any tank into a target-painter.
- **Last Word**: when a hit drops this unit below 25% HP, it immediately gets one free item or ability use.

**Passives (picked 2026-11-18):**
- **Word Kept**: any buff on this unit lasts 1 extra turn.
- **Burden of the Law**: +1 to all stats while any law is active on this unit's team, −1 to all stats while none is.

**Kit status:** complete (2026-11-18). Numbers go in `src/config.js` during balancing. Look notes (paper wards) live in [WORLD.md](WORLD.md#first-race-classes).

**Ideas kept for later:** Covenant-Keeper, Truthsayer, Ember-Sworn and Witness (other Ifriti class ideas).

**Reaction ideas not picked (2026-11-18):** Ward Slip (chance to fully dodge magic), Debt Called (attacker of an adjacent ally loses MP), Steadfast Word (no knockback, move or interrupt when hit); earlier oath-dependent pitches Unbroken and Oathbound Retort.

**Passive ideas not picked (2026-11-18):** Witness Me (allies within 2 tiles gain accuracy, this unit draws more aggro), Ink-Stained (items hit a 1-tile cross but weaker), Silver Tongue (enemy statuses and own buffs both expire a turn sooner).

**Open questions:**
- Still open: the list of limitations, and the numbers (which will go in `src/config.js`).
- ~~Whether oaths stack~~ **superseded (2026-11-17):** the same day's notes also lock stacking (oaths stack; which oaths stack, and any caps, are set per oath in `src/config.js`). The earlier "still open: … and whether oaths stack" line is kept here only so that wording is not lost.
- Oath finishers stay open (2026-11-17), as above.

### Shieldbrother

**Race lock:** Cynocephali (picked 2026-11-17).

**Role:** The basic shield-wall guardian. It takes hits for adjacent allies and gets tougher standing shoulder to shoulder with another Shieldbrother, so formations pay off.

**Weapons (locked 2026-11-17):** shield and mace. For now the game has a single standard shield type. Tower shields might come later as separate equipment, but that isn't decided.

**Armor (locked 2026-11-18):** heavy armor only.

**Signature (locked 2026-11-17):** **Guard**, which picks one ally in range so that every attack on that ally hits the Shieldbrother instead until its next turn.

**Actions (picked 2026-11-18):** five actions so far.
- **Guard** (signature): pick one ally in range; every attack on that ally hits the Shieldbrother instead until its next turn.
- **Ridge-Warden**: dig in on a tile and become almost impossible to move. Strong on high ground and chokepoints, but slow to get moving again.
- **Shield Shove**: push an enemy back 1 tile (2 if it's light), with bonus damage if it hits a wall or falls off a ledge.
- **Bonebreaker**: a mace blow that lowers the target's defense.
- **Hold the Gate**: enemies can't move through the tiles next to the Shieldbrother until its next turn.

**Action ideas not picked (2026-11-18):** Lock Shields (two adjacent Shieldbrothers get a big defense boost), Rally to Me (allies within 2 tiles step 1 tile toward it; costs its move).

**Reactions (picked 2026-11-18):**
- **Pack Instinct**: when an adjacent ally is hit, this unit's next attack does extra damage.

**Reaction ideas not picked (2026-11-18):** Shield Ward (chance to fully block ranged physical attacks; needs a shield), Counterblow (weaker counter in melee that lowers the attacker's defense), Brace (ignore push and knockback, take a bit less damage), Stubborn Hide (ignore the first stat-lowering hit each battle).

**Passives (picked 2026-11-19):**
- **Thick Skin**: physical damage taken is cut by a flat amount, but healing received is a bit weaker.
- **Christopher** (added 2026-11-19, may be cut later): this unit can carry an adjacent wounded or stranded ally with it when it moves, including across water or up a ledge.

**Passive ideas not picked (2026-11-19):** Pack-Bulwark (+defense per other Cynocephalus on the team), Iron Jaw (immune to stun and sleep, slightly more magic damage taken), Heavy Footing (+1 defense per height tile above the attacker, −1 jump), Shoulder to Shoulder (+defense per adjacent ally, −defense alone), Scent of Blood (see every enemy's HP, small hit bonus under half HP), Loyal Hound (attack and defense up for the battle when an adjacent ally falls), Sure-Footed (no rough-ground move penalty, −1 jump), Watchdog (enemies entering an adjacent tile must stop).

**Kit status:** complete (2026-11-19). Lean by design: 5 actions, 1 reaction, 2 passives; more can be added in balancing. Numbers go in `src/config.js`.

**Ideas kept for later:** **Howler** (a war-cry guardian that draws attention and shakes enemy morale) is kept as its own future Cynocephali class.

**Open questions:**
- Tower shields might come later as separate equipment, but that isn't decided.
- The numbers are still open and will go in `src/config.js` when built.

### Rooster

**Name (changed 2026-11-19):** Rooster, renamed from Roost-Keeper.

**Race lock:** Hoopoe-kin (picked 2026-11-17).

**Role:** Sets up roosts on tiles, drawn from their relay-roost courier network, and allies can teleport between them. Reworked 2026-11-17 into a **bird whisperer**: the "teleport" is a flock of birds that swoops up a unit and carries it between roosts. **Roosts can be used by enemies too.** The flock is the class's toolkit: it can also be sent at enemies, and it can take a hit for an ally.

**Weapons (locked 2026-11-19):** perch staff only (a crook-topped staff the flock lands on).

**Armor (locked 2026-11-19):** light armor only.

**Signature (locked 2026-11-19):** **Set Roost**. The Rooster places a roost, a field object that takes up one cell. Any unit standing next to a roost gets a **Use Roost** command: the flock picks it up and carries it to another roost (the teleport, called Flock Flight). Use Roost is open to enemies too. The roost is the move; the flight is what it enables (Cletus).

**Actions (moves picked 2026-11-17):**
- **Pecking Swarm:** the flock blankets a few tiles, lightly damaging and blinding enemies so they miss more
- **Murmuration:** a swirl of birds hides one ally, so attacks on them are likelier to miss until their next turn
- **Messenger Bird (picked 2026-11-19):** send a bird to any ally on the map; that unit takes the very next turn, right after the Rooster's.
- **Homing Call (picked 2026-11-22):** the Rooster flies itself to any of its own roosts, even when it isn't standing next to one.
- **Mobbing (picked 2026-11-22):** the flock harasses one enemy, lowering its accuracy for a turn. No roost bonus (Cletus).
- **Airlift (picked 2026-11-22):** the flock carries an adjacent ally up to 3 tiles in any direction, ignoring height and water. No roost needed.
- **Blackout (picked 2026-11-22):** a dense cloud of birds covers a 3x3 area and lingers; every unit inside has lower accuracy. A lingering area move (see DESIGN.md).
- **Flock Block (picked 2026-11-22):** the Rooster is covered in birds. It can't move, but it absorbs one hit with no damage until its next turn (Cletus).

**Roosts (locked 2026-11-19):** roosts have HP and can be destroyed by attacks from either side. Keeping your roosts up or knocking the enemy's down is a choice for the player, and enemies can wreck the player's plans by destroying them. There is no "remove roost" ability (Scatter the Roost rejected).

**Action ideas not picked (2026-11-19):** Snatch, Carrion Call, Lookout. (2026-11-22): Mend the Roost (repair a roost's HP), Hidden Roost (enemies can't see or use it until one walks next to it), Nesting Flock (roost takes less damage and hurts its attackers), Updraft (an ally next to a roost gets +2 jump). Also: Cuckoo's Egg (fake roost that sends enemies to a cell the Rooster picks), Crest Flare (confuse adjacent enemies), Stone Drop (damage scales with height advantage), Roost Swap (two units next to roosts trade places). Bird actions pitched 2026-11-22: Dawn Song, Molt, Plume Gift, Feather Shroud, Dive Bomb, Owl's Eye. Flock actions not picked: V Formation, Living Wall, Mimic Chorus, Swarm Rescue.

**Reaction:** **Tailwind (picked 2026-11-22):** when this unit is hit, it gains a Speed boost (Cletus changed it from "next turn comes sooner" to a speed boost). Open: how big, how long, and whether it stacks.

**Passive:** **Featherfall (picked 2026-11-22):** this unit never takes fall damage; whenever it would, the birds catch it and lower it down. It can drop off high ledges, even on purpose, but it can't jump up them (no jump bonus) (Cletus).

**Kit status:** complete as of 2026-11-22: nine actions, one reaction (Tailwind) and one passive (Featherfall). Numbers are still open.

**Reaction ideas (2026-11-22):** Flock Cover (chance the birds block a ranged attack) was liked. A general version, full immunity to ranged attacks (like the FFTA2 move), should go in the main archer class's move list (Cletus). Not picked yet: Scatter, Alarm Call, Peck Back, Stink Gland, Snake Hiss, Ruffle, Early Warning, Shared Burden, Lend a Wing, Talon Grip, Scavenger, Sky Sight.

**Ideas kept for later:** Flock Size as a resource. Other Hoopoe-kin class ideas are listed under Racial callings above.

**Open questions:**
- The numbers are still open.

### Div-Hunter

**Race lock:** Peri (picked 2026-11-17).

**Role:** The basic slayer: a fast striker with a light blade, deadly against demons, using wing hop, glide and dive to reach targets. No iron weakness. Flowers and lingering scent are the theme of all her attacks. (The iron weakness was scratched by Cletus on 2026-11-17.)

**Weapons (locked 2026-11-22):** two-handed sword only (Cletus). This replaces the earlier light-blade description, so she reads as a heavy-hitting slayer more than a quick striker; wing hop, glide and dive still get her to targets.

**Armor (locked 2026-11-22):** heavy armor only (Cletus). Heavy armor does not limit her wing hop, glide or dive (no general armor penalties; see DESIGN.md).

**Signature (picked 2026-11-18):** **Scent of Paradise**, a strike that leaves a holy fragrance on the target, burning demons each turn and stopping them from healing (Peri live on the scent of flowers).

**Actions (picked 2026-11-22):**
- **Thorn Sweep:** a wide arc hitting all three cells in front of her; leaves thorns that slow anyone walking through.
- **Rosewater Edge:** she anoints her blade, so her attacks this turn and next deal holy damage (big against demons).
- **Unmask:** a strike that strips a demon's disguise or illusion and cancels its buffs.
- **Lingering Bloom:** she plants her sword; a 3x3 field of flowers lingers for a few turns, hurting demons standing in it (a lingering area move, see DESIGN.md).
- **Banish:** a heavy finisher, lethal to a demon under 25% HP, weak against everything else.

**Action ideas not picked (2026-11-22):** Stooping Dive (stays in ideas kept for later).

**Reactions (picked 2026-11-23):**
- **Iron Will:** once per battle, a hit that would KO her leaves her at 1 HP instead.
- **Ward of Petals:** the first magic attack against her each battle does half damage.

**Reaction ideas not picked (2026-11-23):** Grudge Strike (free attack on whoever drops an ally within 2 tiles), Sweet Air (when hit, heals adjacent allies a little), Wingbeat (pushes a melee attacker back 1 tile).

**Passives:** still to be designed.

**Kit status:** in progress. Weapon, armor, signature, five actions and two reactions are picked; passives are next.

**Ideas kept for later:** Stooping Dive, Glide-Cut, Iron Cage Turned, Old Grudge, Featherfall Ward, Banish, Hunter's Mark, Unmask and Flurry. Other Peri class ideas: Cage-Breaker, Grudge-Bearer, Skyblade and Ward-Archer (plus the earlier list under Racial callings).

**Open questions:**
- The rest of the kit is still to be designed.
- The numbers are still open and will go in `src/config.js` when built.

---

## Older draft (v0.1, 2026-11-12)

The 2026-11-12 class-list draft is kept below because parts of it are still valid. **It is not the live kit source.** Where it conflicts with a later locked decision, the item is marked **superseded** (newer date wins). The original banner ("DRAFT. Nothing in this file is locked.") is itself **superseded (2026-11-18):** the [unit kit template](DESIGN.md#unit-kit-template-locked-2026-11-18) is locked, and the Templar Knight kit is complete.

It was built on the locked answers in [DESIGN.md → Classes and races](DESIGN.md#classes-and-races--open-questions-2026-11-11) (Q1–Q15) and the races in [research/RACES.md](research/RACES.md). Names in this draft are working titles. Numbers (MOV, JUMP, multipliers) are starting points for tuning in `src/config.js`.

### Ground rules this draft follows (all locked)
- **Free class switching** between battles, never mid-fight. Class sets **MOV / JUMP / terrain**; learned abilities are kept.
- **Abilities are learned from gear** (FFTA2 mastery). Teaching gear is **sold in shops**, never loot-only. Most classes unlock by **mastering N abilities in prerequisite classes**; special classes unlock through **quests**. **Superseded in part (2026-11-18):** shops are still the main source and stock plenty, but rare or unique items that teach rare skills have to be found (for example as a quest-line reward). Ordinary loot gives variants. See [DESIGN.md kit template item 7](DESIGN.md#unit-kit-template-locked-2026-11-18).
- **Weapons are tied to class.** An **Equip X** ability lets a unit carry another class's weapon at the cost of one carried slot. **Superseded in part (2026-11-18):** Equip X uses the unit's single passive slot, not a separate "carried" slot. See kit template items 1 and 13.
- **Loadout (recommendation kept):** the class's own set + **one borrowed set** from another class + about **4 carried abilities** (passives, Equip X, and so on). Borrowing a set never borrows its movement. **Superseded (2026-11-18):** loadout is 1 reaction + 1 passive per unit, plus the class set and one borrowed set (from any class the unit has learned at least one ability in; signatures can be borrowed). Item uses the borrowed-set slot. See kit template items 1, 3, 13 and 14.
- **Sideways tree:** later classes are different, not better. Every class keeps a niche no other class covers (listed per class as **Niche**).
- **Every ability has a cost** built into what it does (no cooldowns): weak damage, rooted, Exposed, Slowed, self-damage, friendly fire, a visible tell, a lost facing choice. ~~No interrupts or button prompts in the enemy turn.~~ **Superseded (2026-11-15):** that clause came from a retired design pillar and no longer applies.
- **Stat growth comes from the class you level in** (FFT-style), so each class has a **growth lean**.
- **Races:** small stat lean + one movement quirk, on top of class movement (Peri: short wing hop over gaps; Ifriti: cheap sand and heat; Cynocephali: cheap rough ground).
- **Holy / profane ground** is a map condition, set by the node you fight on. Some abilities are stronger or weaker on it, so battles ask for different builds.

#### Stat key
Stats from DESIGN: **MGT** (attack), **END** (HP), **FOR** (defense), **AGI** (turn speed), **AIM** (hit, crit), **RES** (resist status and shoves). This draft adds a proposed **SPR, Spirit** (spell power and MP once magic arrives); see open question 1.
Growth lean: **▲▲** strong, **▲** good, **–** average, **▼** weak.

---

### 1. Core classes and who can take them

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

**Note (2026-11-12 / 2026-11-17):** this roster has no Hoopoe-kin column (Hoopoe-kin were added as a playable race after this draft). Race-only counts and the first race classes were later replaced; see [The five first race classes](#the-five-first-race-classes).

Why this split:
- **Humans get almost everything** except Harrier and Geomancer, which belong to the other peoples. **Chaplain** is the one Human-only core class (crusader clergy).
- **Peri** = nimble core + Physician (the research had them as scouts, healers and archers) + Geomancer (light and quick, reading the land).
- **Ifriti** = the magic core. That is their whole core list, so their three race-only classes add the physical side (see open question 3).
- **Cynocephali** = the fighter core, plus Archer, Harrier and Hunter for the tracker identity.
- Every core class is open to **at least two races**, except Chaplain. Every race has **at least two starting classes**.

---

### 2. Core classes

Format: **Weapon · MOV/JUMP (terrain) · growth lean · unlock**, then the niche and 3–4 signature abilities, each with its cost. Abilities marked *(v0.13)* already exist in the prototype.

#### Fighters

##### Sergeant (starting)
- **Spear / pike · 4/2 (standard) · MGT ▲ END ▲ FOR – AGI – AIM – RES ▲ · Starting**
- **Niche:** zone control and reach. The only class that punishes enemies for walking.

| Ability | Effect | Cost |
|---|---|---|
| Brace *(v0.13)* | Stance: first foe that walks into the 2 tiles in front is stopped and thrust | No attack; the zone is visible, so smart foes route around it |
| Hook *(v0.13)* | Foe exactly 2 tiles away, ×0.5, pulled 1 tile toward you | Weak hit; the pulled foe ends next to you |
| Run Through | Hits two foes in a line at ×0.8 each | Spear stuck: you can't move after |
| Hold the Line *(passive)* | +1 RES against shoves for each adjacent ally | Lose it if you end your turn alone |

##### Knight
- **Sword + shield · 3/1 (heavy: sand 2, rock 3) · END ▲▲ FOR ▲▲ MGT ▲ AGI ▼ AIM – RES – · Sergeant: 2 mastered**
- **Niche:** the anchor. Turns flanks into fronts and protects others.

| Ability | Effect | Cost |
|---|---|---|
| Shield Bash *(v0.13)* | ×0.6, shove 1 tile; ledges, walls and units add damage | Weak unless the terrain behind pays off |
| Shield Wall *(v0.13)* | Stance: front damage ×0.5; adjacent allies covered | No attack; Slowed (MOV −1) next turn |
| Stand Guard | Pick an adjacent ally: hits on them land on you until your next turn | You take them as side hits, and you can't act next turn if you guarded twice in a row |
| Charge | Move 3+ tiles in a straight line, hit at ×1.3 | You face the way you charged, with no facing choice |

##### Man-at-Arms
- **Mace / axe (two-handed) · 4/1 (standard, rubble 2) · MGT ▲▲ END ▲ FOR – AGI ▼ AIM ▼ RES – · Sergeant: 3 mastered**
- **Niche:** breaks armor and terrain. Raw single-target damage.

| Ability | Effect | Cost |
|---|---|---|
| Crushing Blow | ×1.4 and ignores half the target's DEF | Slowed next turn (overswing) |
| Sunder | Target's FOR −3 for the rest of the battle | ×0.5 damage; you're Exposed until your next turn |
| Ground Slam | Every adjacent tile takes ×0.6, allies included | Stuck: you can't move on your next turn |
| Wade In *(passive)* | Rubble and shallows cost 1 | −1 JUMP |

##### Crossbowman
- **Crossbow · 3/1 (standard) · AIM ▲▲ MGT ▲ FOR ▲ AGI ▼ END – RES – · Archer: 2 + Sergeant: 1**
- **Niche:** armor-piercing ranged fire that doesn't need height. The answer to Knights and Shield Walls.

| Ability | Effect | Cost |
|---|---|---|
| Heavy Quarrel | Range 2–5, ignores half DEF and Shield Wall | Planted: only if you haven't moved, and you can't move after |
| Pavise | Place a pavise on an adjacent tile; it blocks ranged shots through it | Uses your action; enemies can break it |
| Bolt Through | Pierces two foes in a line | No height bonus; friendly fire on allies in the line |
| Flat Trajectory *(passive)* | No penalty for shooting uphill | Height advantage never adds range |

#### Nimble

##### Skirmisher (starting)
- **Daggers / short blades · 5/3 (nimble: sand 1, rock 1) · AGI ▲▲ AIM ▲ MGT – END ▼ FOR ▼ RES – · Starting**
- **Niche:** facing manipulation and getting behind the line.

| Ability | Effect | Cost |
|---|---|---|
| Feint *(v0.13)* | ×0.4; the target turns to face you | Pure setup, almost no damage |
| Vault Strike *(v0.13)* | Leap over a foe, strike its back at ×0.8 | Hard landing: you can't move after |
| Hamstring | ×0.5; the target has MOV −2 next turn | You end adjacent and can't move after |
| Slip Away | After attacking, move up to 2 tiles | You end facing away from the foe, with no facing choice |

##### Archer (starting)
- **Bow · 4/3 (light: rock 1) · AIM ▲▲ AGI ▲ MGT – END ▼ FOR ▼ RES – · Starting**
- **Niche:** height. The only class that gets more from high ground the higher it goes.

| Ability | Effect | Cost |
|---|---|---|
| Pinning Shot *(v0.13)* | ×0.6; target MOV −2, JUMP ≤1 next turn | Planted (no move before or after) |
| Plunging Shot *(v0.13)* | Needs height; +15% per level, never a front hit | Exposed (DEF −3) until your next turn |
| Volley | 3-tile area at ×0.5 | Hits allies in the area too |
| Mark the Range *(passive)* | +1 range when you start your turn on your highest tile so far | Lose it as soon as you step down |

##### Harrier (Peri, Cynocephali)
- **Javelins + sling · 5/3 (nimble) · AGI ▲ MGT ▲ AIM ▲ END – FOR ▼ RES – · Archer: 3**
- **Niche:** hit-and-run at short range. The only ranged class that can move after it shoots.

| Ability | Effect | Cost |
|---|---|---|
| Javelin | Range 2–3, ×1.2 | Your next turn's attack is the sling (×0.6) while you "pick up" another (automatic, no button) |
| Hit and Run | Throw, then spend your leftover MOV | Exposed until your next turn |
| Stunning Stone | Sling, ×0.4; target AGI −20% (acts later) | Very weak damage |
| Light Pack *(passive)* | +1 MOV | −15% max HP |

#### Magic
*Magic and MP are parked in DESIGN. Until then the spells below cost only their drawback; see open question 2.*

##### Physician (starting)
- **Staff + satchel · 4/2 (standard) · RES ▲ END ▲ SPR ▲ AIM – MGT ▼ AGI – · Starting**
- **Niche:** healing and curing without faith or magic. The only heals that work the same on holy and profane ground.

| Ability | Effect | Cost |
|---|---|---|
| Bind Wounds | Heal an adjacent ally a lot | You kneel: you can't move after |
| Poultice Toss | Range 3, small heal | The target is Slowed next turn (sticky) |
| Bleed the Humours | Cure an ally's statuses | You both lose 10% HP |
| Triage | Huge heal on an ally under 25% HP | The ally has MOV −2 next turn (stitched up) |

##### Alchemist (starting)
- **Rod + flasks · 4/2 (standard) · SPR ▲▲ AIM ▲ AGI – END ▼ FOR ▼ MGT ▼ · Starting**
- **Niche:** area damage and tile effects. Naft (Greek fire), quicklime, salts.

| Ability | Effect | Cost |
|---|---|---|
| Naft Flask | 3-tile area, fire stays on the tiles for one round | Burns anyone who enters, allies included |
| Quicklime | Area: targets −30% hit next turn | No damage |
| Salt Ward | One tile: profane units can't enter it this round | Uses your action; tiny area |
| Volatile Mix | Next flask ×1.5 | You take 10% max HP; the flask must be thrown next turn |

##### Astrologer
- **Book / astrolabe · 4/2 (standard) · SPR ▲ RES ▲ AGI ▲ AIM – MGT ▼ END ▼ · Alchemist: 2 + Physician: 1**
- **Niche:** turn order (CT). The only class that bends who acts when.

| Ability | Effect | Cost |
|---|---|---|
| Auspice | An ally gains +40 CT (acts sooner) | You drop to 0 CT (you act last) |
| Ill Omen | A foe loses 40 CT | You're Exposed until your next turn |
| Conjunction | Swap the CT of two units in a line | Both must be in a straight line from you, friend or foe |
| Read the Heavens *(passive)* | The turn strip shows 4 more turns | −10% max HP |

##### Geomancer (Peri, Ifriti)
- **Staff · 4/3 (standard; ignores 1 height when climbing slopes) · SPR ▲ RES ▲ AGI ▲ FOR – END – MGT ▼ · Physician: 3**
- **Niche:** reshaping the map. Effects change with the tile you stand on.

| Ability | Effect | Cost |
|---|---|---|
| Earthsong | Effect set by your tile: sand blinds, rock lowers DEF, grass roots, water slows | You must stand on that tile type; moving changes the spell |
| Raise Ground | A tile rises 1 level | Your own tile sinks 1 level |
| Sink | A tile drops 1 level (ledges, falls) | You can't move next turn |
| Quake | Adjacent units shoved 1 tile outward | Allies are shoved too |

#### Holy

##### Chaplain (Human only)

**Note (2026-11-17):** Chaplain is also listed among later Human race-class ideas, and healing was given to a future Hospitaller class rather than the Templar Knight. This core-class sketch is kept; whether Chaplain is a core class, a race class, or both is not yet re-decided.
- **Staff / censer · 4/2 (standard) · RES ▲▲ SPR ▲ FOR ▲ END – AGI ▼ MGT ▼ · Physician: 2 + Sergeant: 1**
- **Niche:** blessings, and fighting on profane ground. Strongest when the ground is holy.

| Ability | Effect | Cost |
|---|---|---|
| Bless | An ally gets +20% ATK until their next turn | You can't attack this turn or next |
| Psalm of Shelter | Adjacent allies resist statuses this round | You kneel in prayer: no move next turn |
| Rebuke | Profane units within 2 tiles are shoved 1 tile | Weaker on profane ground; doesn't affect non-profane foes |
| Last Rites | A fallen ally rises with 1 HP | You take their Wound instead (Wounded next battle) |

Name clash with the Templar Knight reaction **Rebuke** (picked 2026-11-18, different effect).

##### Hunter (Human, Cynocephali)
- **Hunting spear / short blade + lantern · 4/3 (light: rock 1) · AIM ▲ AGI ▲ MGT ▲ RES ▲ END – FOR ▼ · Archer: 2 + Sergeant: 1**
- **Niche:** hunting the profane (Dismas's trade). Single-target focus and tracking.

| Ability | Effect | Cost |
|---|---|---|
| Mark Quarry | One foe: allies +15% damage against it | The quarry knows: it targets you first (AI weight) |
| Lantern | Adjacent profane units turn to face you and take ×0.5 | You're lit: −20% DEF until your next turn |
| Snare | Trap a tile; the first foe to enter it is rooted | No attack; the trap is visible to the enemy |
| Finishing Stroke | ×2 against a foe under 30% HP | ×0.5 otherwise |

---

### 3. Race-only classes (unlocked by race quests)

All units of any race can be recruited from the start; these unlock through that race's quest line. **Superseded in part (2026-11-12):** Peri are hidden and unlock as recruits through a Peri side-quest tree (DESIGN.md Q12). **Superseded as the first race-class roster (2026-11-17):** the first race classes are now Templar Knight, Oath Mage, Shieldbrother, Rooster and Div-Hunter, and Hoopoe-kin is a playable race not listed in this draft. The classes in the tables below are kept as ideas, not deleted.

#### Humans (2)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Turcopole** | Short bow · 5/2 · AGI ▲▲ AIM ▲ | The only class that shoots while moving | **Shoot on the Move:** move, shoot, move again (×0.7) · **Parthian Shot:** shoot behind you as you retreat (you end facing away) · **Outride:** +2 MOV this turn (can't act) |
| **Standard-Bearer** | Banner (polearm) · 3/1 · RES ▲▲ END ▲ | An aura from where you stand | **Raise the Standard:** allies within 2 get +RES and +10% damage (only while you stay put; moving drops it) · **Rally:** a Slowed or Pinned ally is freed (you're Exposed) · **Banner as a target:** foes prefer to target you |

#### Peri (3)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Kestrel** | Glaive · 5/4 · AGI ▲ MGT ▲ | Dive attacks from height, using the wing hop | **Stoop:** drop from height onto a foe, ×1.2 + 10% per level dropped (you land Exposed) · **Updraft:** hop up 2 levels (no attack this turn) · **Harry:** strike and hop back 1 tile (×0.6) |
| **Lightweaver** | Wand · 4/3 · SPR ▲▲ RES ▲ | Healing and decoys with light | **Mend Light:** heal in a line (also heals foes in the line) · **Glamour:** a decoy that draws the next attack (costs you 15% HP) · **Dazzle:** foes in an area −hit (also allies) |
| **Divbane** | Twin blades · 5/3 · AGI ▲ AIM ▲ | Peri warriors of the old div wars: fast duels against the profane | **Div-Cut:** ×1.4 against profane units, ×0.7 otherwise · **Wingguard:** dodge the next melee hit (Slowed next turn) · **Swift Pair:** two ×0.6 hits (can't move after) |

#### Ifriti (3)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Emberblade** | Scimitar · 4/2 · MGT ▲ AGI ▲ SPR ▲ | The fire duellist: melee that hurts more the hotter it gets | **Kindle:** each hit you land this battle +5% damage, stacking (you take +5% damage per stack too) · **Flame Lunge:** dash 2 and hit (leave a burning trail) · **Searing Parry** *(passive)*: melee attackers take fire damage (you take +10% from ranged) |
| **Smokecaller** | Censer-chain · 4/2 · SPR ▲ RES ▲ | Smoke and cover: blocks sight lines | **Smokebank:** a 3-tile cloud that blocks ranged shots, yours too · **Choke:** foes in the smoke −AGI · **Vanish:** you can't be targeted until your next turn (you can't act on it) |
| **Dune Warden** | Spear + buckler · 4/2 (sand 1, heat 1) · FOR ▲ END ▲ | The Ifriti front line, only at home on sand | **Dust Devil:** pull a foe across sand 2 tiles (weak on other ground) · **Sand Wall:** raise a 1-level wall on a sand tile (only on sand) · **Heat Shimmer** *(passive)*: ranged hits on you −20% on sand and heat tiles (+20% on water) |

#### Cynocephali (3)
| Class | Weapon · MOV/JUMP · lean | Niche | Signature abilities (cost) |
|---|---|---|---|
| **Houndknight** | Sword + shield · 4/2 · FOR ▲ END ▲ AGI ▲ | A fast knight: guard on the move | **Bodyguard:** move to an ally and take their next hit (you can't attack this turn) · **Bark Down:** an adjacent foe can't use abilities next turn (×0.3) · **Stalwart** *(passive)*: can't be shoved (−1 MOV) |
| **Riverwarden** | Staff · 4/2 (shallows 1) · END ▲▲ RES ▲ | Carries allies across water and rough ground (a nod to the legend of the dog-headed giant who ferried travelers) | **Ferry:** carry an adjacent ally with you as you move (both act later: −30 CT) · **Breakwater:** allies behind you take no ranged damage (you take double) · **Steady Footing** *(passive)*: no fall damage |
| **Bayer** | Horn + hand-axe · 5/3 · AGI ▲ MGT ▲ | The pack howl: flanking specialist | **Bay:** foes within 3 face you (it gives away your spot: you're targeted first) · **Run Down:** +2 MOV this turn toward a marked or wounded foe · **Pack Tactics** *(passive)*: flank bonus +10% (−10% damage when no ally is adjacent to your target) |

---

### 4. Hero unique classes (sketch only; story not locked)

The four heroes are **plain Humans**. Each can take every Human class, plus one unique class unlocked through **that hero's side quests**. Unique classes are sideways, not stronger.

| Hero | Class (working) | Weapon · MOV/JUMP | Fantasy and niche | Sketch abilities (cost) | Unlock |
|---|---|---|---|---|---|
| **Tristan** | **Templar** **superseded in part (2026-11-17 / 2026-11-18):** the working name Templar, and the abilities Beauséant and Non Nobis, now belong to the Human race class Templar Knight (kit complete 2026-11-18), with different effects. Whether Tristan still gets a separate unique class is still per DESIGN.md Q3. | Sword + shield · 3/1 | Holds the line and lifts the squad. | **Rule of the Order** *(passive)*: +20% DEF and RES, but he can't end his turn farther from the nearest foe (the Templars' no-retreat rule) · **Beauséant:** allies within 2 +15% damage while he stays put · **Non Nobis:** take half the damage dealt to adjacent allies this round | Tristan's side quests (his faith arc) |
| **Aveline** | **Saint-Caller** (Hospitaller) | Staff · 4/2 | Healer who calls blessed help. Strongest on holy ground. | **Intercession:** call blessed help (list not designed; see CHARACTERS) and channel: no move next turn · **Hospital:** heal all adjacent allies (she takes 10% HP) · **Hold Everything Together** *(passive)*: allies near her resist fear-type statuses; she's weaker alone | Aveline's side quests (Act 2+) |
| **Godric** | **Vanguard** | Mace · 4/2 | Charges over defense. | **Headlong:** charge through a foe's tile, hitting them (you end Exposed) · **Hot Blood** *(passive)*: +damage as his HP drops, −DEF as well · **Stand By Me:** a charge that ends next to Tristan heals Godric 10% (he must reach him) | Godric's side quests (after he's found) |
| **Lucien** | **Shadow Archer** | Bow · 5/3 | The Hooded Figure's style: shoots from cover. | **Hooded Shot:** ×1.3 if no foe can see you (only from behind an obstacle; you can't move after) · **Smuggler's Step:** move through foes' tiles · **Second Thoughts** *(passive)*: crits on foes at full HP, −damage on wounded ones | Lucien's side quests after his return (Act 4) |

**Dismas** (two-handed sword) is a hero character but not a real-worlder; he could have a unique **Penitent** class (Hunter + Man-at-Arms). See open question 5.
**Simeon** (lamp on a staff) is the villain. No player class should copy the lamp-staff look; the Chaplain and Saint-Caller use the censer and staff.

---

### 5. Supporting notes

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

**Equip X (escape hatch, one carried slot each)** **Superseded in part (2026-11-18):** Equip X uses the single passive slot, not one of several carried slots. The learn-in / weapon table below is otherwise kept as a draft idea.
| Ability | Learned in | Lets you carry |
|---|---|---|
| Equip Shields | Knight | A shield on any class (keeps class MOV) |
| Equip Spears | Sergeant | Spears |
| Equip Bows | Archer | Bows |
| Equip Heavy | Man-at-Arms | Maces and axes |
| Equip Crossbows | Crossbowman | Crossbows |

**Enemies:** Fallen enemies (Fallen Human, Peri, Ifriti, Cynocephali) use these same kits with a profane twist, so the player learns enemy classes by playing them. Pure profane monsters (Imps, Fiends and so on) have their own kits. **Note (2026-11-12):** for Peri, hostile followers of the old faith are just "Peri"; Peri call their converts "Fallen" (DESIGN.md Q14, WORLD.md).

---

### 6. Open questions for Cletus
1. **A magic stat?** The six stats have no magic stat. Add **SPR (Spirit)** for spell power, or let magic run off RES?
2. **MP or drawbacks only for spells?** DESIGN parks "MP later". Should spells cost MP *and* a drawback, or a drawback only, like physical abilities?
3. **Ifriti have the shortest list (7).** Give them a fourth race class, or open Skirmisher to them (fire duellists)?
4. **Chaplain Human-only?** Or open it to Cynocephali (the dog-headed saint tradition)?
5. **Dismas:** should he get a unique class too, like the four heroes?
6. **Ability count:** 3–4 signature abilities per class (about 75 total). FFTA2 had more per class. Is that enough to learn, or too few? **Superseded (2026-11-18):** class sets are FFTA2-sized: signature plus 6–10 actions in total, and a few reactions and passives (roughly 2–4 of each). See kit template item 10.
7. **Hero class names:** Templar, Saint-Caller, Vanguard and Shadow Archer are placeholders. Any you'd like changed? **Note (2026-11-17):** Templar is now the name of the Human race class (Templar Knight), so this unique-class placeholder name conflicts.
