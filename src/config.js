// Outremer — ALL tuning values live here. Change numbers, reload, play.
// Nothing else in src/ should hard-code a gameplay or presentation number.

export const CONFIG = {
  version: '0.4.0',

  // ---------------------------------------------------------------- map
  map: {
    width: 8,
    height: 8,
    // heights[y][x] — integer height levels (0 = ground)
    heights: [
      [0, 0, 1, 1, 2, 2, 1, 0],
      [0, 0, 0, 1, 2, 3, 1, 0],
      [0, 0, 0, 0, 1, 2, 1, 0],
      [1, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 1],
      [2, 1, 1, 0, 0, 0, 1, 1],
      [2, 2, 1, 0, 0, 1, 1, 2],
      [3, 2, 1, 0, 0, 1, 2, 2],
    ],
    // terrain[y][x] — key into palette.terrain (purely visual for now)
    terrain: [
      'ssggrrrs',
      'ssgggrrs',
      'sgggggrs',
      'ggggdggs',
      'gggdddgg',
      'rggdddgg',
      'rrgdddgr',
      'rrggdgrr',
    ],
  },

  // ---------------------------------------------------------------- terrain
  // Base move cost per terrain key. Roles may override via `terrainCost`.
  terrain: {
    g: { name: 'Grass', cost: 1 },
    d: { name: 'Road', cost: 1 },
    s: { name: 'Sand', cost: 2 },
    r: { name: 'Rock', cost: 2 },
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
      terrainCost: { s: 2, r: 3 },
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
      terrainCost: { r: 1 },
      minRange: 2, maxRange: 4, straightLine: false,
      maxHeightReach: 99,
      rangeBonusPerHeight: 2, // +1 max range for every N levels above the target
      abilities: ['pinningShot', 'plungingShot'],
    },
    skirmisher: {
      // nimble: fast, long move, big jump, ignores rough terrain; hits weakly — wants backs
      hp: 28, atk: 12, def: 5, spd: 11, move: 5, jump: 3,
      terrainCost: { s: 1, r: 1 },
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

  // starting layout: [role, x, y, facing]  facing: 0=N(-y) 1=E(+x) 2=S(+y) 3=W(-x)
  deployment: {
    player: [
      ['knight', 3, 6, 0],
      ['sergeant', 4, 6, 0],
      ['archer', 1, 6, 0],
    ],
    enemy: [
      ['knight', 3, 1, 2],
      ['skirmisher', 1, 1, 2],
      ['archer', 5, 1, 2],
    ],
  },

  // ---------------------------------------------------------------- turn order (CT)
  // ---------------------------------------------------------------- controls (FFTA2-style)
  controls: {
    // On-screen d-pad is a classic cross rotated 45° so each arm points along an iso grid axis:
    //   ↗ = north (-y)   ↘ = east (+x)   ↙ = south (+y)   ↖ = west (-x)
    // i.e. the cursor moves exactly where the arrow points on screen.
    dpadSizePx: 156,        // overall d-pad footprint (square, before rotation)
    abSizePx: 70,           // A / B button diameter
    repeatDelayMs: 320,     // hold a d-pad arm: delay before auto-repeat starts
    repeatRateMs: 120,      // then one step per this many ms
    menuItemHeightPx: 44,   // command menu row height
    // Context-aware d-pad: the pad shows only the directions that mean something right now.
    //   map cursor (free/move/target) = four diagonal quadrants; menus = vertical ▲▼;
    //   facing step = four facing arrows; nothing to steer (enemy turn, animations, confirm, end screen) = dimmed.
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
    },
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
