// Outremer — ALL tuning values live here. Change numbers, reload, play.
// Nothing else in src/ should hard-code a gameplay or presentation number.

export const CONFIG = {
  version: '0.8.0',

  // ---------------------------------------------------------------- maps
  // Map layouts/heights/terrain/deployment live in src/maps.js. Pick with ?map=<id|number>
  // or the map picker on the start and Victory/Defeat screens.
  defaultMap: 'ridge',

  // ---------------------------------------------------------------- terrain
  // Base move cost per terrain key. Roles may override via `terrainCost`.
  terrain: {
    g: { name: 'Grass', cost: 1 },
    d: { name: 'Road', cost: 1 },
    s: { name: 'Sand', cost: 2 },
    r: { name: 'Rock', cost: 2 },
    // The Breach (map 2)
    e: { name: 'Flagstone', short: 'F', cost: 1 },
    w: { name: 'Wall', short: 'W', cost: 1 },      // wall-walk / tower stone: tall, not slow
    b: { name: 'Rubble', short: 'Ru', cost: 2 },   // the breach and the rubble mound
    // The Baggage Train (mission map)
    c: { name: 'Cart', short: 'C', cost: 2 },      // overturned baggage carts: slow to clamber over
  },
  // extra move cost for each height level climbed UP in one step (down is free)
  climbCostPerLevel: 0,

  // ---------------------------------------------------------------- units / classes
  // Each class has a distinct movement profile: move points, jump height, terrain affinity.
  // Roles are shared by both sides; teams differ in name + colors only.
  roles: {
    knight: {
      // heavy: tough, short move, low jump, bogged down by sand and rock
      hp: 44, atk: 14, def: 10, spd: 6, move: 3, jump: 1,
      terrainCost: { s: 2, r: 3, b: 3 },
      minRange: 1, maxRange: 1, straightLine: false,
      maxHeightReach: 1, // melee can only reach targets within this height difference
      abilities: ['shieldBash', 'shieldWall'],
    },
    sergeant: {
      // spear: solid all-rounder, reaches 2 tiles in a straight line
      hp: 34, atk: 12, def: 7, spd: 8, move: 4, jump: 2,
      terrainCost: {},
      minRange: 1, maxRange: 2, straightLine: true,
      maxHeightReach: 2,
      abilities: ['brace', 'hook'],
    },
    archer: {
      // light-footed: high jump, rock is easy going, fragile
      hp: 26, atk: 11, def: 4, spd: 10, move: 4, jump: 3,
      terrainCost: { r: 1, b: 1 },
      minRange: 2, maxRange: 4, straightLine: false,
      maxHeightReach: 99,
      rangeBonusPerHeight: 2, // +1 max range for every N levels above the target
      abilities: ['pinningShot', 'plungingShot'],
    },
    skirmisher: {
      // nimble: fast, long move, big jump, ignores rough terrain; hits weakly — wants backs
      hp: 28, atk: 12, def: 5, spd: 11, move: 5, jump: 3,
      terrainCost: { s: 1, r: 1, b: 1 },
      minRange: 1, maxRange: 1, straightLine: false,
      maxHeightReach: 2,
      abilities: ['feint', 'vaultStrike'],
    },
  },

  // ---------------------------------------------------------------- abilities (Action ▸ submenu)
  // Cost model: per-ability COOLDOWN in the user's own turns. Using an ability takes the Action.
  // `cooldown: N` = after use, unavailable for your next N turns (0 = usable every turn).
  // Damage abilities run through the normal formula (facing, flank, height) times `dmgMul`.
  // Statuses end at the start ('start') or end ('end') of the affected unit's next turn.
  abilities: {
    shieldBash: { // knight: shove 1 tile straight away. Off a ledge = fall damage; into a wall/unit = slam
      name: 'Shield Bash', short: 'Bash', kind: 'unit', cooldown: 1,
      dmgMul: 0.6, fallDmgPerLevel: 5, slamDmg: 6, collideDmg: 4,
    },
    shieldWall: { // knight stance: front hits halved; adjacent allies can't be hit for side/back bonus
      name: 'Shield Wall', short: 'Wall', kind: 'self', cooldown: 2,
      frontDmgMul: 0.5, // knight's own front damage taken
      coverAllies: true, // orthogonally adjacent allies: side/back hits count as front
      slowNextTurn: 1,   // trade-off: MOV −1 on the knight's next turn (setting down the wall)
    },
    brace: { // sergeant stance: the first foe to step into the 2 tiles in front gets a free thrust and stops
      name: 'Brace', short: 'Brace', kind: 'self', cooldown: 1,
      zoneLength: 2, dmgMul: 1.0, // zone follows the facing you pick at end of turn
    },
    hook: { // sergeant: spear-hook a foe exactly 2 tiles away in a line, pulling it 1 tile in
      name: 'Hook', short: 'Hook', kind: 'unit', cooldown: 2,
      range: 2, dmgMul: 0.5, fallDmgPerLevel: 5, maxPullUp: 1, // can't drag a foe up more than this
    },
    pinningShot: { // archer: weak shot, target's next turn: MOV −2 and JUMP capped
      name: 'Pinning Shot', short: 'Pin', kind: 'unit', cooldown: 2,
      dmgMul: 0.6, pinMovePenalty: 2, pinJumpCap: 1,
    },
    plungingShot: { // archer: only from higher ground; never counts as a front hit; leaves archer Exposed
      name: 'Plunging Shot', short: 'Plunge', kind: 'unit', cooldown: 2,
      minHeightAdv: 1, rangeBonus: 0, // was 1: +1 reach let archers duel from spawn heights and swung the sim 46%→85%
      dmgBonusPerLevel: 0.15, dmgMul: 1.0,
      exposedDefPenalty: 3, // trade-off: archer DEF −3 until its next turn
    },
    feint: { // skirmisher: light hit that turns the target to face the skirmisher (its back to everyone else)
      name: 'Feint', short: 'Feint', kind: 'unit', cooldown: 1, dmgMul: 0.4,
    },
    vaultStrike: { // skirmisher: leap over an adjacent foe to the tile behind it and strike as you land
      name: 'Vault Strike', short: 'Vault', kind: 'unit', cooldown: 2, dmgMul: 0.8,
      // landing tile must be empty and within the skirmisher's JUMP of its start height. Doesn't use Move.
    },
  },

  teams: {
    player: {
      label: 'Templars',
      // flat per-team stat adjustments (difficulty knob): added to the role's base stats
      statBonus: { hp: 6, def: 1 },
      names: { knight: 'Templar Knight', sergeant: 'Sergeant', archer: 'Turcopole Archer', skirmisher: 'Scout' },
    },
    enemy: {
      label: 'Raiders',
      statBonus: {},
      names: { knight: 'Raider Swordsman', sergeant: 'Raider Spearman', archer: 'Raider Bowman', skirmisher: 'Raider Skirmisher' },
    },
  },

  // ---------------------------------------------------------------- character creation (BG1/BG2-style hero)
  // One hero you create; the rest of the party are set companions (later). See DESIGN.md → Main character & party.
  // Each stat is rolled dice×d(sides). Then BG rules: take points out of a stat (not below max(floor, classMin))
  // into a pool and spend them on another (not above cap). 10 = neutral.
  // Modifier for stat v: (v − neutral) × perPoint, rounded toward zero, added to the class base (+ team statBonus).
  creation: {
    dice: 3, sides: 6,          // 3d6 per stat
    floor: 3, cap: 18, neutral: 10,
    stats: [
      { key: 'mgt', short: 'MGT', name: 'Might', feeds: 'ATK' },
      { key: 'end', short: 'END', name: 'Endurance', feeds: 'HP' },
      { key: 'fort', short: 'FOR', name: 'Fortitude', feeds: 'DEF' },
      { key: 'agi', short: 'AGI', name: 'Agility', feeds: 'SPD (turns)' },
      { key: 'aim', short: 'AIM', name: 'Aim', feeds: 'Hit / crit' },
      { key: 'res', short: 'RES', name: 'Resolve', feeds: 'Resist' },
    ],
    perPoint: {
      mgt: { atk: 0.5 },
      end: { hp: 1.5 },
      fort: { def: 0.5 },
      agi: { spd: 0.5 },
      aim: { hit: 2, crit: 0.5 },    // + hit % and + crit % on every attack/ability
      res: { resist: 5 },            // % chance to shrug off Pin, Feint's turn, and Bash/Hook displacement
    },
    resistFloor: 0,                  // RES below 10 gives no penalty yet (resist can't go under this %)
    minSpd: 3, minHp: 10,            // safety floors for derived stats
    // class minimums (BG-style): rolls below are raised to this, and you can't take points below it
    classMin: { knight: { mgt: 9, end: 9 }, sergeant: { mgt: 8 }, archer: { aim: 9 }, skirmisher: { agi: 9 } },
    classes: ['knight', 'sergeant', 'archer', 'skirmisher'],
    classLabel: { knight: 'Knight', sergeant: 'Sergeant', archer: 'Archer', skirmisher: 'Scout' },
    classBlurb: {
      knight: 'Heavy armour and a shield. Tough anchor, slow over rough ground.',
      sergeant: 'Spear. Solid all-rounder that holds a line at reach 2.',
      archer: 'Bow. Fragile, sure-footed, deadly from high ground.',
      skirmisher: 'Light and quick. Climbs anything, lives for an exposed back.',
    },
    abilityBlurb: {
      shieldBash: 'shove a foe 1 tile; ledges and walls hurt',
      shieldWall: 'halve front hits, cover adjacent allies',
      brace: 'stop and strike the first foe walking into your spear',
      hook: 'pull a foe 2 tiles away one step toward you',
      pinningShot: 'weak shot; target MOV −2, JUMP ≤1',
      plungingShot: 'from above: never a front hit, but you\'re Exposed',
      feint: 'turn a foe to face you, showing its back',
      vaultStrike: 'leap over a foe and strike its back',
    },
    defaultNames: ['Brother Aimery', 'Brother Odo', 'Brother Gerard', 'Brother Hugh', 'Brother Raoul', 'Brother Thierry', 'Brother Bernard', 'Brother Amalric'],
    nameMaxLen: 20,
    portraitCount: 8,                // placeholder SVG busts in src/hero.js
    // where the hero fights: replaces the Templar of the same class (keeps its slot);
    // a class the squad doesn't have (Scout) takes slot 0 (the knight's).
    swipePx: 40,                     // class cards: horizontal swipe distance to change class
  },

  // ---------------------------------------------------------------- party & companions (v0.8)
  // Set companions with their own stories (Baldur's Gate-style). They join by WINNING their
  // recruit mission (src/missions.js), then Accept/Decline. Fixed stats go through the same
  // formula as the created hero (src/hero.js deriveHero). Squad size stays 3: hero + up to
  // `maxCompanions` companions, generic Templars fill the rest.
  party: {
    storageKey: 'outremer.party',
    maxCompanions: 2,                // squad is 3: hero + 2. More recruits wait in camp (toggle on the board)
    companions: {
      renaud: {
        name: 'Brother Renaud', short: 'Renaud', role: 'knight', templar: true, trait: 'underTheRule',
        portrait: 'assets/companions/renaud.jpg',
        stats: { mgt: 12, end: 13, fort: 14, agi: 7, aim: 10, res: 14 },
        blurb: 'Templar of the old Rule, about sixty. Holds the line; will not give ground.',
      },
      yusuf: {
        name: 'Yusuf ibn Qasim', short: 'Yusuf', role: 'skirmisher', templar: false, trait: 'turncoatsEye',
        portrait: 'assets/companions/yusuf.jpg',
        stats: { mgt: 12, end: 10, fort: 9, agi: 14, aim: 13, res: 10 },
        blurb: 'A raider who turned on his own band. Reads them like a book; shows mercy.',
      },
      wren: {
        name: 'Wren', short: 'Wren', role: 'skirmisher', templar: false, trait: 'lightFeet',
        portrait: 'assets/companions/wren.jpg',
        stats: { mgt: 9, end: 6, fort: 6, agi: 16, aim: 12, res: 8 },
        blurb: 'A camp orphan of fifteen with quick hands. Frail and skittish. Her amulet hums.',
      },
    },
    // Signature traits: one pro, one con each (simple v0.8 versions of the pitch doc).
    traits: {
      underTheRule: {
        name: 'Under the Rule',
        pro: '+2 DEF while next to another Templar',
        con: 'Holds ground: starting next to a foe, may only move to tiles still next to a foe',
        defAdjTemplar: 2,
      },
      turncoatsEye: {
        name: "Turncoat's Eye",
        pro: 'Shows what raiders within 4 tiles of him intend to strike next',
        con: 'Mercy: will not strike a foe below 25% HP',
        intentRange: 4,
        mercyBelow: 0.25,
      },
      lightFeet: {
        name: 'Light Feet',
        pro: '+1 MOV',
        con: 'Frail; skittish: starting her turn next to 2+ foes, she cannot act',
        moveBonus: 1,
        skittishAdj: 2,
      },
    },
    // allied NPC in a recruit mission (AI-driven, must survive): turn-strip / info colour
    npcLabel: 'Ally',
  },

  // starting layouts are per map: see src/maps.js

  // ---------------------------------------------------------------- turn order (CT)
  // ---------------------------------------------------------------- controls (FFTA2-style)
  controls: {
    // On-screen d-pad is a classic ▲▶▼◀ cross (v0.7, Cletus: the diagonal quadrants felt weird).
    // The iso map is drawn rotated, so each arm is mapped to one grid direction, rotating clockwise from Up:
    //   ▲ up = north (-y, up-right on screen)   ▶ right = east (+x, down-right)
    //   ▼ down = south (+y, down-left)          ◀ left = west (-x, up-left)
    // Used for the map cursor, the facing step and the keyboard arrows/WASD. Values are game.js DIRS indices (0 N, 1 E, 2 S, 3 W).
    padCross: { up: 0, right: 1, down: 2, left: 3 },
    facingArrowLabels: true, // facing step: draw the matching ▲▶▼◀ button glyph next to each facing arrow on the map
    dpadSizePx: 156,        // overall d-pad footprint (square, before rotation)
    abSizePx: 70,           // A / B button diameter
    repeatDelayMs: 320,     // hold a d-pad arm: delay before auto-repeat starts
    repeatRateMs: 120,      // then one step per this many ms
    menuItemHeightPx: 44,   // command menu row height
    // Context-aware d-pad: the pad shows only the directions that mean something right now.
    //   map cursor (free/move/target) = ▲▶▼◀ cross (padCross); menus = vertical ▲▼;
    //   facing step = the same cross, current facing lit; nothing to steer (enemy turn, animations, confirm, end screen) = dimmed.
    padMorphMs: 140,        // cross-fade/morph time between pad layouts
    padDimOpacity: 0.35,    // opacity of the pad (and A/B) when there is no input to give
    tapConfirmsSecondTap: true, // tap a tile once = move cursor there; tap it again = A
    keyboard: true,         // desktop: arrows/WASD move cursor, Z/Enter/Space = A, X/Esc/Backspace = B
  },

  turn: {
    ctThreshold: 100,     // a unit acts when its CT reaches this
    costMovedAndActed: 100, // CT spent at end of turn
    costOneOf: 80,        // moved OR acted
    costNeither: 60,      // waited
    previewLength: 8,     // turns shown in the order strip
    startCtSpread: 0,     // random 0..N added to starting CT (0 = deterministic)
  },

  // ---------------------------------------------------------------- combat
  combat: {
    // damage = (atk * atkMul - def * defMul) * heightMod * facingMod * variance
    atkMul: 1.6,
    defMul: 1.0,
    minDamage: 1,
    heightBonusPerLevel: 0.10, // +10% per level above target, -10% per level below
    heightModMin: 0.7,
    heightModMax: 1.4,
    // Facing matters: where the attacker stands relative to the target's facing.
    facingMod: { front: 1.0, side: 1.25, back: 1.5 },   // damage multiplier
    hitChance: { front: 80, side: 90, back: 100 },     // percent
    // Flanking: +X damage per OTHER ally of the attacker adjacent to the target (pincer).
    flankBonusPerAlly: 0.15,
    flankMaxAllies: 2,
    hitPerHeightLevel: 3,  // +/- hit% per level of height advantage
    variance: 0.10,        // ±10% random spread
    critChance: 5,         // percent
    critMul: 1.5,
  },

  // ---------------------------------------------------------------- enemy AI
  ai: {
    wDamage: 1.0,        // expected damage dealt
    wKill: 25,           // bonus for a likely kill
    wHeight: 2,          // bonus per height level of the destination tile
    wDanger: 0.35,       // penalty per point of damage enemies could deal back next turn
    npcDangerMul: 30,    // allied NPC in a recruit mission (must survive): x danger penalty
    wApproach: 1.5,
    wFlankSide: 4,       // extra score for attacking from a side / back
    wFlankBack: 10,      // per tile closer to nearest foe (when no attack available)
    archerKeepDistance: 3, // archers try not to end turn closer than this
    wArcherSpacing: 4,
    thinkDelayMs: 350,
    // abilities
    wFall: 1.0,          // expected extra (fall/slam) damage, like normal damage
    wWallBase: 4,        // Shield Wall when foes threaten this tile
    wWallPerAlly: 7,     // + per adjacent ally it covers
    wBrace: 12,          // Brace when a foe could walk into the zone next turn
    wPullIntoFlank: 6,   // Hook/Bash that leaves the target next to one of our units
    wPin: 3,             // Pinning Shot: × target's MOV / 2
    wExposed: 4,         // penalty for leaving the archer Exposed
    wFeintBack: 8,       // Feint: per ally who'd then be behind the target
    wFeintSide: 3,
    wAvoidBrace: 22,     // penalty for a path that walks into a braced spear
    abilityMinGain: 2,   // ability must beat a plain attack by this much to be picked
    // AI picks its own end-of-turn facing: toward the nearest foe
  },

  // ---------------------------------------------------------------- presentation
  view: {
    tileHeightPx: 16,        // vertical px per height level (at scale 1, tile width 64)
    baseTileWidth: 64,
    mapPaddingPx: 4,
    zoom: 1.3,               // >1 zooms past fit-to-width on phones; drag to pan
    zoomBelowWidthPx: 520,   // only zoom/pan on narrow (phone) stages
    camFollow: 0.15,         // camera easing toward the cursor per frame
    dragThresholdPx: 12,     // movement before a touch counts as a pan instead of a tap
    moveStepMs: 140,         // per tile of movement
    attackLungeMs: 220,
    damageFloatMs: 900,
    damageFloatRisePx: 34,
    turnBannerMs: 700,
    hitFlashMs: 200,
    bobAmplitudePx: 2,
    bobSpeed: 0.005,
    cursorPulseSpeed: 0.008,
  },

  palette: {
    background: ['#1b1a26', '#3a2f3f'],
    terrain: {
      g: { top: '#7da35a', side: '#5d4632' }, // grass
      d: { top: '#c9a86a', side: '#8a6a3e' }, // dirt road
      s: { top: '#e0c48a', side: '#a5824f' }, // sand
      r: { top: '#9a948a', side: '#6a645c' }, // rock
      e: { top: '#c2b49a', side: '#7d705d' }, // flagstone courtyard
      w: { top: '#a99f8e', side: '#6b6153' }, // wall stone
      b: { top: '#8f8371', side: '#5e5446' }, // rubble
      c: { top: '#8a5a32', side: '#5a3a1e' }, // baggage cart (wood)
    },
    npcRing: '#7fd48f',            // allied NPC (recruit mission) ground ring
    companionSash: '#6a4a2a',      // companions who are not Templars wear a sash, not the cross
    intent: '#ff8a4a',             // Turncoat's Eye: raider → intended target
    moveHighlight: 'rgba(80,170,255,0.45)',
    attackHighlight: 'rgba(255,80,70,0.45)',
    targetHighlight: 'rgba(255,220,80,0.65)',
    rangeHighlight: 'rgba(150,120,255,0.40)', // another unit's move range (B in free look)
    effectHighlight: 'rgba(255,150,40,0.70)', // ability destination (shove/pull/landing) or covered tile
    zoneHighlight: 'rgba(255,120,40,0.30)',   // braced spear zones (always shown)
    status: { wall: '#7fb2ff', brace: '#ff9a3c', pinned: '#e8534a', exposed: '#e8c547', slowed: '#b0a4c8' },
    player: { body: '#ece6d6', trim: '#b8141c', accent: '#d8d2c0' },
    enemy: { body: '#2f5d5a', trim: '#d4a73c', accent: '#1f3d3b' },
    hpGood: '#5fd36a', hpMid: '#e8c547', hpLow: '#e8534a',
  },
};
