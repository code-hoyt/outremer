# Outremer: Unit kit systems research (FFTA and FFTA2)

*Research for the unit-kit template, written 2026-11-18. **Nothing here is locked.** DESIGN.md is unchanged. Section 6 is a proposal for Cletus to answer one question at a time.*

**What "kit" means here:** everything a unit takes into battle. That's its **equipment** (what it wears and holds) and its **abilities** (what it can do).

**How sure we are.** Facts marked **✓✓** were checked against two independent sources. Facts marked **✓** come from one source. **⚠** marks sources that disagree or numbers we couldn't confirm. Sources are listed at the end, and the bracketed numbers in the text (for example [F1]) point to them.

---

## 1. One-screen summary

| | **FFTA** (GBA, 2003) | **FFTA2** (DS, 2007–08) |
|---|---|---|
| Equipment slots | 5 general slots ✓✓ | 5 general slots ✓✓ |
| Ability slots | Job command set + 1 secondary set + 1 Reaction + 1 Support (+ Combo) ✓✓ | Job command set + 1 secondary set + 1 Reaction + 1 Passive ✓✓ |
| How abilities are learned | From equipment, by earning AP after battles ✓✓. **Action abilities come only from weapons** ✓ | From equipment, by earning AP ✓✓. Action abilities can be taught by weapons, armour or accessories ✓ |
| Do learned abilities carry over? | Yes, to any job ✓✓ | Yes, to any job ✓✓ |
| How gear is bought | Shops, mission rewards, a few trade or loot-only items (the Mythril combo weapons) ✓ | **Bazaar**: trade in loot to unlock items for sale ✓✓ |
| Job unlocks | Master 1–5 action abilities in prerequisite jobs ✓✓ | Master 1–4 action abilities in prerequisite jobs ✓✓, plus about 22 quest-locked jobs ✓ |
| Job change | Free, between battles ✓✓ | Free, between battles ✓✓ |
| MP | Starts at 0 and regenerates each turn (about +5 per turn) ✓ ⚠ | Starts at 0 and regenerates (+10 per turn) ✓✓ |
| Meter specials | **Judge Points** power Combos and Totema summons ✓✓ | Combos removed ✓. **Smash Gauge** plus a special accessory summons Scions ✓✓. Random **Opportunity Commands** ✓ |
| Law effect on the kit | Bans weapon types, elements or job command sets. Cards and fines ✓✓ | Bans an action. Obeying it keeps your **Clan Privilege**, a team-wide stat or reward buff ✓✓ |

---

## 2. Equipment kit

### 2.1 Slots

| | FFTA | FFTA2 |
|---|---|---|
| Layout | 5 slots: a weapon, then 4 slots for armour, a shield or accessories. Most units wear 1 weapon, 1 body armour and 1 head piece, and the other 2 slots take accessories, a shield, or a two-handed weapon ✓✓ [S3][S9] | Same 5-slot shape ✓✓ [S5][S10] |
| Limits per type | At most 1 shield, 1 head piece and 1 body armour. At most 1 pair of boots and 1 pair of gloves. "Other" accessories (rings and the like) stack, up to 5 on a unit wearing nothing else ✓ [S9] | Same limits ✓ [S10]. One difference: in FFTA2 a unit with no weapon could wear two shields, and in FFTA it couldn't ✓ [S9] |
| Accessories | Any job can wear them. Shoes give MOV, JUMP or Evade (Sprint Shoes MOV+1, Spiked Boots JUMP+1) ✓✓ [F9][S9]. In FFTA, shoes teach no abilities ✓ [F9] | Any job can wear them ✓ [S10]. Some teach abilities (Spiked Boots teach Avoid Traps to Rangers) ✓ [F10]. **Scion accessories** are needed to summon ✓✓ [S5][F14] |

**One-handed, two-handed and dual wield** (the same in both games except where noted):

| Rule | How it works | Source |
|---|---|---|
| Two-handed weapons | Greatswords, broadswords, bows and greatbows. FFTA2 adds hammers and hand-cannons. They block the shield. | ✓✓ [F7][F8][S9][S10] |
| **Monkey Grip** (support) | Hold a two-handed weapon in one hand, so you can carry a shield too. It only matters for the few jobs that can already use shields: 3 jobs in FFTA, 6 in FFTA2. For everyone else it's a dead pick. | ✓✓ [F6][S9][S10] |
| **Doublehand** (support) | Hold a one-handed weapon in both hands for more damage | ✓✓ [F6][S8] |
| **Dual Wield / "Double Sword"** (support, Ninja) | A weapon in each hand, so you attack twice. Only one-handed Hume-type weapons qualify, not rapiers, spears, maces, guns and so on. In FFTA it costs 999 AP. | ✓✓ [F6][S8][S10] |
| **Shieldbearer** (support) | Any job can use shields. FFTA2 also has **Ribbon-bearer** (ribbons) and **Tank** (heavy armour). There is **no Equip Sword or Equip Axe** in either game: weapons stay locked to the job, and only shields and armour have escape hatches. | ✓ [F12] (FFT had Equip-weapon abilities; FFTA/A2 dropped them) |

### 2.2 How each job limits gear

- **Weapons:** each weapon type is owned by a few jobs. For example, Paladins use knightswords and greatswords, and FFTA2 Soldiers use swords and greatswords ✓✓ [F11][F16][F17]. A weapon you can't equip can't teach you anything.
- **Armour:** each job has a list of armour types (helms, hats, ribbons, heavy armour, light armour, robes, shields). For example, the FFTA Paladin wears helms, robes, heavy armour and shields, and the FFTA2 Soldier wears hats, helms, heavy, light and shields ✓✓ [F11][F16].
- **Race limits come first:** a job only exists for certain races, so gear access follows race too ✓✓ [F2][S6].

### 2.3 What equipment gives you

1. **Stats.** Weapons give Attack, and armour gives Defense and Resistance. FFTA2 armour also lists Evade and Speed ✓✓ [F7][F8].
2. **Abilities to learn.** Each item lists abilities, *each tied to specific jobs*: for example, "Shieldbearer (Soldier)". While the item is equipped and the unit is in a job that can learn the ability, the ability can be used and it collects AP. Once mastered, the item isn't needed anymore ✓✓ [F1][S5][S6].
3. **Built-in effects.** Elements, status immunity, and MOV, JUMP or Speed bonuses. Some items have odd perks: the FFTA2 Knightsword, Sequencer and Peytral get stronger with Opportunity Commands ✓ [F15]. ⚠ The Japanese wiki says **FFTA armour elements did nothing**, and FFTA2 made them work ✓ [S9].
4. **Scions** (FFTA2): one accessory per Scion, each usable once per battle ✓✓ [S5][F14].

### 2.4 Shops, loot and the FFTA2 bazaar

- **FFTA:** gear comes from shops (the stock grows as you progress), mission rewards and trading. The Mythril weapons that teach Combos only come from beating rival clans or trading at Nono's shop ✓ [F4].
- **FFTA2:** loot from kills and quests goes to the **Bazaar**. Each item needs a ranked (A–E) combination of loot, and once unlocked it goes on sale. Some items have to be "remade" with fresh loot for every copy ✓✓ [F13][S5]. Nearly all gear goes through the bazaar ✓ [F8].

### 2.5 FFTA vs FFTA2: equipment differences

- FFTA2 lets armour and accessories teach more of the ability list. In FFTA, action abilities come from weapons only ✓ [F1][F2].
- FFTA2's bazaar makes gear depend on random loot drops. FFTA's shops were straightforward. Players' biggest complaint is in section 5.
- FFTA2 armour elements work, two shields are possible, and it adds the Tank and Ribbon-bearer escape hatches.

---

## 3. Ability kit

### 3.1 Slots

| Slot | FFTA | FFTA2 |
|---|---|---|
| **Action set 1** | Locked to the current job. You can use the job's abilities you've mastered, plus any unmastered ones taught by the gear you're wearing ✓✓ [F1][S5] | Same ✓✓ [S5][S6][S7] |
| **Action set 2** | Any job's set in which you've mastered at least one ability, but only the mastered abilities work. **The default is Item**: borrowing a set costs you your item use. Some borrowed abilities still need the right weapon (Jump needs a spear) ✓✓ [F3][S8][S11] | Any mastered set ✓✓ [S5][S7]. ⚠ We didn't confirm whether Items still sits in this slot by default |
| **Reaction (R)** | 1 slot. It fires on its own when hit: counters, dodges, "Critical:" buffs ✓✓ [F1][S8] | 1 slot ✓✓ [S6][S7] |
| **Support / Passive (S/P)** | 1 slot: stat boosts and equipment-unlock passives (Shieldbearer, Monkey Grip, Dual Wield) ✓✓ [F6][S8] | 1 slot ✓✓ [S6][S7] |
| **Combo (C)** | 1 combo ability set. Spend Judge Points so nearby allies join an attack ✓✓ [F5][S11] | Removed ✓ [F2] |

**What a unit carries into battle:** two command menus (often 6–9 abilities each, unlocked one at a time), one reaction and one passive. A typical late-game unit has **15+ action buttons**, but only **2 passive choices**. For example, the FFTA2 Paladin has 8 Chivalry actions, 1 reaction and 1 passive of its own ✓ [F17].

### 3.2 Learning and AP

| | FFTA | FFTA2 |
|---|---|---|
| AP to master one ability | Usually 100–300. Dual Wield costs 999 ✓✓ [F4][F6][S12] | Usually 100–400 (Paladin: 100–400; Soldier: 100–350) ✓ [F16][F17] |
| AP per battle | Depends on the mission: clan engagements 50, turf battles 80 ✓ [F3] | 30 per normal battle quest, 80 per story quest, 10 for non-battle quests. The "Bonus AP" clan privilege adds more ✓ [F3] ⚠ (one source, and its "20/40/60" for the bonus may be percent or flat) |
| How many battles that takes | Roughly 2–6 battles per ability (estimate) | Roughly 4–13 normal battles for one 100–400 AP ability (estimate) |
| Who gets AP | All equipped abilities on the units that earn it. Changing gear early keeps the AP already banked ✓ [F1] | **Every clan member gets AP, even those who didn't fight** (they get no EXP) ✓ [S6] |
| Do abilities carry over? | Yes. R, S and Combo abilities can go on any job, and action sets go in the secondary slot ✓✓ [F3][S11] | Yes ✓✓ [S5][S7] |

### 3.3 MP and other costs

- Magic and some techniques cost MP. Physical techniques are mostly free: in both games most Soldier and Paladin abilities cost no MP, while Holy Blade and Saint Cross do ✓✓ [F16][F17][S12].
- **MP starts at 0** and builds over the battle in FFTA2 (+10 per turn, or +20 with the MP Channeling privilege) ✓✓ [S5][F18]. For FFTA, Wikipedia (citing the manual) says MP also starts at 0 and regenerates, and a GameFAQs FAQ says +5 per turn ✓ [W1][S13]. ⚠ The fandom FFTA2 page calls "MP starting from 0" new in FFTA2 [F2]. We trust the manual-cited source and treat the fandom line as an error.
- **There are no cooldowns in either game.** Costs come from MP, Judge Points and the Smash Gauge.

### 3.4 Job change and unlocks

- **Changing jobs** is free between battles ✓✓ [F3][S5]. On a change, action set 1 switches to the new job, and gear the new job can't use comes off ✓ [S5].
- **Unlock rules** are counts of mastered **action** abilities. For example:
  - FFTA Paladin: 2 Soldier abilities ✓✓ [F11][S4]
  - FFTA2 Paladin: 3 Soldier abilities ✓ [F17][F19]
  - FFTA Illusionist: 5 Black Mage + 3 White Mage ✓✓ [F3][S4]
  - FFTA2 Illusionist: 2 White Mage + 4 Black Mage ✓ [F19]
  - FFTA2 also locks about 22 jobs behind quests ✓ [S7]
- **Race limits:** each race has its own job list. In FFTA2, Humes have 13 jobs and Moogles 10 ✓ [F2]. The same job name can appear on more than one race (Thief, White Mage, Archer and so on).

### 3.5 Combos, Totema, Scions and Opportunity Commands

| | FFTA | FFTA2 |
|---|---|---|
| Meter | **Judge Points**, up to 10. You earn them by KOs and by doing the law's "recommended" action ✓✓ [F5][W1] | **Smash Gauge**: each successful action adds about 1/9 ✓ [F14]. A privilege can speed it up ✓ [F15law] |
| Combos | Spend all your JP. Allies with a combo ability in range join in, and damage scales with the starter's JP. Taught by Mythril weapons that are hard to get ✓✓ [F4][S11] | Removed ✓ [F2] |
| Summons | **Totema**: one per race, unlocked by story progress, costs 10 JP ✓✓ [F4][F5]. A Hunter's "Hunt" KO gives 10 JP, which lets you spam them ✓ [F4] | **Scions**: need the Scion's accessory plus the gauge, once per battle each ✓✓ [S5][F14]. ⚠ The manual says the gauge must be **full**, and fandom says **one third** |
| Opportunity Commands | none | Show up at random on a unit's turn, and change with nearby allies and enemies. Examples: alone → Protect and Shell; one adjacent ally → a Resilience buff; one adjacent foe → a double strike ✓✓ [F15][S5] |

**Takeaway for us:** neither game has a "signature move" slot. A job's identity comes from its command set, its weapon type and, in FFTA, its combo. No ability is innate on the day you take a job. You need the teaching gear even for the first ability.

---

## 4. Laws and judges (only where they touch kits)

- **FFTA:** each day's law bans a weapon type, element, job command set or status. Breaking it earns a yellow card (a fine after battle: gil, items, **equipment confiscated**, or a **permanent stat loss**). A KO while breaking it earns a red card (jail). Obeying the "recommended" action earns Judge Points ✓✓ [F15lawA][S3]. Law and Antilaw cards let you change laws ✓ [F2b]. Because of laws, players carry a spare weapon type or a borrowed set, which is a reason to have a secondary set.
- **FFTA2:** each mission comes with a law that bans one action, and before battle you pick **one Clan Privilege**. Privileges include team-wide **Speed↑ 1–5, Agility↑ 1–5 (hit and evade), Move↑ 1–2, Power↑, Regen, MP Channeling, Smash Gauge Bonus, Empowered [race], Bonus AP/EXP/Gil, and status immunities**. You earn them through Clan Trials and can raise one tier per trial. If you break the law, the Judge leaves: you lose the privilege, you can't revive anyone, and you lose the bonus loot ✓✓ [F15][F15law][W2].
- **How this relates to Outremer:** the **Oath Mage already is our law system**. It's a team-wide stat buff paired with a random law, which is FFTA2's privilege-plus-law deal folded into one class. We shouldn't add a separate clan-privilege layer, or it would compete with the oaths.

---

## 5. What players and critics say

### Works
- **"Wear it to learn it"** turns every shop visit into a build decision, and a weapon you've outgrown is still worth wearing for what it teaches. Reviewers praised the depth and the customisation ✓ [W1][W2].
- **Abilities that carry across jobs** plus a secondary set allow strong hybrids. The famous FFTA2 example is Paladin + Seer's Magick Frenzy + Dual Wield ✓ [F17][S14]. It's the part of the system players talk about most.
- **Laws changed battles** in FFTA (GameSpot, Edge) ✓ [W1]. FFTA2's privilege-for-obedience trade was praised by Game Informer and ONM ✓ [W2].
- **Opportunity Commands** reward positioning without adding menus.

### Doesn't work
- **Learning takes three keys.** To learn even Cure you need the right job, the right item and enough AP. NWR called the system "more complicated than ever" and the jobs "overlapping", with near-duplicates across races ✓ [S15].
- **The FFTA2 bazaar is driven by random drops.** Players report bottlenecks, reloading saves to check bazaar results, and needing guides to know which monster drops what ✓ [S16][S17][S18]. FFTA's loot-only Mythril combo weapons had the same problem on a smaller scale.
- **One passive slot creates "tax" picks.** Shieldbearer, Dual Wield and Monkey Grip all compete for the single slot, and Monkey Grip only helps a few jobs, so it's a dead pick for most ✓ [S10] (the "tax" framing is our reading).
- **Reactions are set-and-forget.** Some never matter: MP regeneration made Absorb MP close to useless ✓ [S13]. They also can't be planned around because you don't control them, though that is also why they're fast.
- **Laws divided people.** In FFTA2, 1UP, Eurogamer and GameSpot found them restrictive ✓ [W2], and some fans think FFTA2's version is worse ✓ [S18]. In FFTA, losing gear and stats to fines felt punishing ✓ [F15lawA].
- **Menus.** Confusing menus and slow battles are common complaints for both games ✓ [W1][W2].
- **Race locks** gave strong identities, but also duplicate jobs (a Hume White Mage and a Nu Mou White Mage), thin rosters for some races, and weak physical options for Nu Mou ✓ [S15][S19].
- **AP for units who didn't fight** (FFTA2) goes against Cletus's locked bench rule: no free progress for not fighting.

---

## 6. Proposed Outremer kit template (DRAFT, not locked)

### 6.0 Already locked (the template must respect these)
- Free class switching between battles, never mid-fight. Learned abilities are kept (Q1, Q5).
- Classes unlock by gear mastery (master N in prerequisite classes), with quest classes for specials. **Teaching gear can always be bought** (Q2).
- Weapon types are class-gated, with an **Equip X** escape hatch that costs **one carried ability slot** (Q4).
- Every ability is a trade-off with a built-in drawback, and there are no cooldowns. Magic and MP are parked.
- No fog of war. The phone is the smallest supported screen, not a design limit.
- Class kits already picked:
  - **Templar Knight:** one-handed sword + shield, signature **Smite**, **Last Stand** is an equippable passive.
  - **Oath Mage:** team oaths with laws.
  - **Shieldbrother:** shield + mace, signature **Guard**, the **Ridge-Warden** action, and **Christopher** and **Pack-Bulwark** as equippable passives.
  - **Roost-Keeper:** flock, Pecking Swarm, Murmuration.
  - **Div-Hunter:** light blade, signature **Scent of Paradise**.

### 6.1 The recommended template

```
EQUIPMENT (5)                     ABILITIES
Weapon       class-gated          Class set    the current class's actions; signature always in it
Off-hand     shield / empty       Borrowed set 1 other class's mastered actions (no signature)
Head         by weight            Passives     3 slots, one shared pool:
Body         by weight                           reactions, supports, Equip X
Charm        1, any class                         (at most 1 reaction)
```

On a phone that's one unit screen with about 10 rows (5 gear, 2 sets, 3 passives). It fits without tabs.

### 6.2 Choices, with a recommendation for each

**A. Ability slot structure**

| Option | What it is | For | Against |
|---|---|---|---|
| A1. FFTA2 classic | Class set + borrowed set + 1 Reaction + 1 Support | Proven and familiar | 2 passive slots and an Equip X that eats half of them. Christopher, Pack-Bulwark and Last Stand would all fight for one Support slot |
| **A2. Shared passive pool (recommended)** | Class set + borrowed set + **3 passive slots**. Reactions, supports and Equip X all draw from the same pool, with at most 1 reaction | More customisation, which Cletus likes. Equip X costs a real third of your passives, not all of them. No "tax" picks | Three passives can stack. That's covered by the trade-off rule and the 1-reaction cap |
| A3. Curated loadout | No sets: pick about 4 actions + 2 passives per battle | Very readable on a phone, and every pick matters | Gives up FFTA2's "the whole job menu" feel, and borrowed sets are what make hybrids fun |
| A4. CLASSES.md draft | Class set + borrowed set + **4** passive slots | Most freedom | Higher risk of a dominant stack, and the unit screen gets longer |

**B. Signature move**

| Option | What it is |
|---|---|
| **B1. Innate and class-bound (recommended)** | Known the moment a unit takes the class, with no gear or AP needed. Always in the class set. **It can't be borrowed** into another class's secondary slot. That means you have to *be* a Templar to Smite, which keeps each class's identity and is a sideways trade-off (pillar 7). |
| B2. Innate and borrowable | Known on taking the class. Once used in, say, 3 battles, it can go into a borrowed set. |
| B3. Learned like everything else | FFTA2's way: it comes from the class's starter gear. Simple, but on day one the class has no identity. |

**C. Borrowed (secondary) set rules**

| Option | What it is |
|---|---|
| **C1. Any class you've mastered 1+ ability in (recommended)** | Only your mastered abilities, never the signature. **A borrowed ability that needs a weapon still needs that weapon** (as FFTA's Jump needed a spear). Getting the weapon may mean Equip X, which costs a passive slot. That chain of trade-offs is the point. Borrowing never brings the other class's movement (already in CLASSES.md). |
| C2. Same family only | Fighters borrow from fighters. Safer balance, but less variety. |
| C3. No borrowed set | One class set plus more passive slots. The simplest, but it loses the hybrids players love. |

**D. Equipment slots**

| Option | Slots |
|---|---|
| **D1. Fixed 5 (recommended)** | Weapon · Off-hand (shield, or empty if two-handed) · Head · Body · Charm. Fixed slots are easier on a phone than FFTA's flexible ones. |
| D2. FFTA2 flexible 5 | 1 weapon plus 4 general slots that take armour, a shield or stackable accessories. More room to tinker, but harder to read and easier to break. |
| D3. Slim 3 | Weapon · Armour · Charm. Fastest, but fewer gear decisions and fewer things to teach from. |

**E. How armour is gated**

| Option | What it is |
|---|---|
| **E1. By weight, not class (recommended)** | Light, Medium and Heavy. Heavier means more DEF but **−MOV and/or −JUMP**. This is pillar 3 word for word. Any class can wear any weight and pays in movement. Shields stay class-gated, with Equip Shields as the escape hatch. Weapons stay class-gated (locked). |
| E2. By class (FFTA) | Each class has an armour list. Clear identity, less freedom. |
| E3. By class, with a "Tank"-style escape passive | FFTA2's way. |

**F. What a piece of gear gives**
- **Recommended:** stats, plus **1–2 teachable abilities**, each tied to listed classes (FFTA2 style), plus at most 1 property, such as holy/profane, a status ward, or MOV/JUMP.
- Keep teaching lists short so the item card fits on a phone.
- Gear is **sold in shops** as you progress through the story. Loot can give variant gear (better stats or odd properties), but **never the only copy of a teaching item**. No bazaar random drops.

**G. AP rules**
- **Recommended:** AP goes only to units that **fought**, which keeps the locked bench rule. AP per battle and AP per ability live in `src/config.js`. Aim for about 3–5 battles per ability.
- Changing gear before mastery keeps the AP already earned, as in FFTA.

**H. Two-handed weapons and dual wield**
- **Recommended:** have two-handed weapons (they block the shield) from the start. **Park** Dual Wield, Doublehand and Monkey Grip as future passives. The Templar's one-handed rule is locked, and dual wield is FFTA's most famous balance-breaker.

**I. Class set size**
- **Recommended:** signature + 4–5 learnable actions + 1–2 passives per class, so about 6–8 things to learn.
- That's smaller than FFTA2's roughly 10, so mastering a class takes a reasonable number of battles, and every ability can carry a real drawback. (CLASSES.md open question 6 asks the same thing.)

**J. Meters, combos and summons**
- **Recommended: park them.** The Oath Mage already brings the law and team-buff layer, and Roost-Keeper roosts bring positional tricks.
- Opportunity-style positional bonuses are worth a look later, since they fit "abilities are about position".

### 6.3 How the five first classes fit (sanity check)

| Class | Class set (signature first) | Passives it teaches (anyone can carry them) | Gear notes |
|---|---|---|---|
| Templar Knight | **Smite**, then learnables (from the kept ideas: Judgement, Crusader's Charge, Shield Bash of Faith…) | **Last Stand** | 1-handed sword + shield only. Teaches Equip Shields? (TBD) |
| Oath Mage | Oaths (Attack, Defense, Jump, Speed…). ⚠ A signature oath? | (TBD) | Weapon TBD |
| Shieldbrother | **Guard**, **Ridge-Warden**, + learnables (Lock Shields, Bonebreaker, Shield Shove) | **Christopher**, **Pack-Bulwark** ⚠ (a race-themed passive: can a non-Cyno carry it?) | Mace + shield |
| Roost-Keeper | Roosts + flock carry, **Pecking Swarm**, **Murmuration** ⚠ (no signature named yet) | (TBD) | Weapon TBD |
| Div-Hunter | **Scent of Paradise**, + learnables (Stooping Dive, Glide-Cut…) | (TBD, maybe Featherfall Ward) | Light blade |

---

## 7. Open questions for Cletus (one at a time, in this order)

1. **Ability slot structure:** FFTA2 classic (1 Reaction + 1 Support), a **shared pool of 3 passives** (recommended), a curated loadout, or 4 passives?
2. **Signature move:** innate and class-bound, so it can't be borrowed (recommended)? Or innate and borrowable, or learned from gear?
3. **Borrowed set:** any class with 1+ mastered ability, no signature, borrowed weapon abilities still need the weapon (recommended)? Or the same family only, or no borrowed set?
4. **Reaction cap:** if the pool is shared, at most one reaction per unit (recommended)?
5. **Equipment slots:** fixed 5, Weapon · Off-hand · Head · Body · Charm (recommended)? Or FFTA2's flexible 5, or a slim 3?
6. **Armour gating:** by weight with a MOV/JUMP cost and open to every class (recommended)? Or by class list?
7. **Charm slot:** 1 (recommended) or 2?
8. **What gear teaches:** 1–2 abilities per item, tied to listed classes, shop-bought, with loot giving only variants (recommended)?
9. **AP:** only for units that fought (recommended)? Or FFTA2's whole-clan AP? And how many battles per ability: 3–5 (recommended)?
10. **Two-handed weapons and dual wield:** two-handers yes, dual wield and the grip passives parked (recommended)?
11. **Class set size:** signature + 4–5 actions + 1–2 passives (recommended)?
12. **Race-themed passives** (Pack-Bulwark): can any race carry them, or only that race?
13. **Meters, combos and summons:** park for now (recommended)?
14. **Items:** like FFTA, does Item sit in the borrowed-set slot, so a secondary costs you item use? (Items aren't designed yet, so this may wait.)

---

## Sources

**Final Fantasy Wiki (fandom)**, read via its MediaWiki API on 2026-11-18:
- [F1] FFTA abilities: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance_abilities
- [F2] FFTA2 (gameplay, races and jobs, combos removed): https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift. [F2b] FFTA (Law and Antilaw cards): https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance
- [F3] FFTA jobs: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance_jobs. Ability Points: https://finalfantasy.fandom.com/wiki/Ability_Points
- [F4] Combo (Tactics Advance): https://finalfantasy.fandom.com/wiki/Combo_(Tactics_Advance). Totema: https://finalfantasy.fandom.com/wiki/Totema
- [F5] Judge Points: https://finalfantasy.fandom.com/wiki/Judge_Points
- [F6] FFTA support abilities: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance_support_abilities
- [F7] FFTA weapons: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance_weapons. FFTA armor: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance_armor
- [F8] FFTA2 weapons: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift_weapons. FFTA2 armor: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift_armor
- [F9] FFTA accessories: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_Advance_accessories
- [F10] FFTA2 accessories: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift_accessories
- [F11] Paladin (Tactics Advance): https://finalfantasy.fandom.com/wiki/Paladin_(Tactics_Advance)
- [F12] Equipment abilities: https://finalfantasy.fandom.com/wiki/Equipment_abilities
- [F13] Bazaar (Tactics A2): https://finalfantasy.fandom.com/wiki/Bazaar_(Tactics_A2)
- [F14] Scion (Ivalice): https://finalfantasy.fandom.com/wiki/Scion_(Ivalice)
- [F15] Clan Privilege: https://finalfantasy.fandom.com/wiki/Clan_Privilege. Opportunity Command: https://finalfantasy.fandom.com/wiki/Opportunity_Command
- [F15law] Law system (Tactics A2): https://finalfantasy.fandom.com/wiki/Law_system_(Tactics_A2). [F15lawA] Law system (Tactics Advance): https://finalfantasy.fandom.com/wiki/Law_system_(Tactics_Advance)
- [F16] Soldier (Tactics A2): https://finalfantasy.fandom.com/wiki/Soldier_(Tactics_A2)
- [F17] Paladin (Tactics A2): https://finalfantasy.fandom.com/wiki/Paladin_(Tactics_A2)
- [F18] MP (stat): https://finalfantasy.fandom.com/wiki/MP_(stat)
- [F19] FFTA2 jobs: https://finalfantasy.fandom.com/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift_jobs

**Other sources**
- [S3] FF Extreme, FFTA Game Basics (5 slots; yellow and red cards): https://ffextreme.com/ffta/game-basics/
- [S4] StrategyWiki, FFTA Jobs (unlock requirements): https://strategywiki.org/wiki/Final_Fantasy_Tactics_Advance/Jobs
- [S5] FFTA2 instruction booklet (Set Abilities, MP from 0, Smash Gauge, Scions, Bazaar, Opportunity Commands): https://gamegear.net/media/canonical/console/nds/manual/final-fantasy-tactics-a2-fuuketsu-no-grimoire-japan__62999.pdf
- [S6] GameFAQs, FFTA2 Guide by Dark_Vortex (1 R and 1 S; AP for non-participants): https://gamefaqs.gamespot.com/ds/937330-final-fantasy-tactics-a2-grimoire-of-the-rift/faqs/53446
- [S7] LP Archive, FFTA2 "Jobs 101" (4 ability slots; about 22 quest jobs): https://lparchive.org/Final-Fantasy-Tactics-A2-Grimoire-of-the-Rift/Update%2077/
- [S8] MythrilMoth, FFTA Skill List (2 A slots, 1 R, 1 S): http://www.mythrilmoth.net/ffta/skills.html
- [S9] FF用語辞典 Wiki, FFTA equipment list (slot limits, two-hand and dual-wield rules, armour elements did nothing): https://wikiwiki.jp/ffdic/データ/装備品一覧/FFTA
- [S10] FF用語辞典 Wiki, FFTA2 equipment list (same, for FFTA2; Monkey Grip only useful on 6 jobs): https://wikiwiki.jp/ffdic/データ/装備品一覧/FFTA2
- [S11] Wikipedia 2007 snapshot, FFTA (A, R, S and C ability types; Item as the default secondary): https://wikipedia2007.classicistranieri.com/en/f/i/n/Final_Fantasy_Tactics_Advance_1692.html
- [S12] GameFAQs, FFTA Ability FAQ by NeoBlitz (AP costs): https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/26226
- [S13] GameFAQs, FFTA R/S Ability FAQ by DDragoon (+5 MP per turn; Absorb MP near-useless): https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/39140
- [S14] GBAtemp, "Job combos of FFTA2?": https://gbatemp.net/threads/job-combos-of-ffta2.94971/
- [S15] Nintendo World Report, FFTA review by Jonathan Metts (2003): http://www.nintendoworldreport.com/review/4138/final-fantasy-tactics-advance-game-boy-advance
- [S16] r/finalfantasytactics, "FFTA2: Can someone explain gear progression?": https://www.reddit.com/r/finalfantasytactics/comments/9dlp9n/ffta2_can_someone_explain_gear_progression/ and "Thinking about replaying FFTA2…": https://www.reddit.com/r/finalfantasytactics/comments/eltsz9/thinking_about_replaying_ffta2_and_have_a/
- [S17] GameFAQs board, "Bazaar + Loot System (How do you guys do it)": https://gamefaqs.gamespot.com/boards/937330-final-fantasy-tactics-a2-grimoire-of-the-rift/54225524
- [S18] r/FFTA, "Something is finally clicking with FFTA2 for me": https://www.reddit.com/r/FFTA/comments/135lm7h/something_is_finally_clicking_with_ffta2_for_me/
- [S19] RPGClassics forum, FFTA thread (race and job discussion): https://discourse.rpgclassics.com/t/ffta/21599/31
- [W1] Wikipedia, Final Fantasy Tactics Advance (gameplay, MP, reception): https://en.wikipedia.org/wiki/Final_Fantasy_Tactics_Advance
- [W2] Wikipedia, Final Fantasy Tactics A2 (gameplay, laws, reception): https://en.wikipedia.org/wiki/Final_Fantasy_Tactics_A2:_Grimoire_of_the_Rift
