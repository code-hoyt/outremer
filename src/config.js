// Outremer — ALL tuning values live here. Change numbers, reload, play.
// Nothing else in src/ should hard-code a gameplay or presentation number.

export const CONFIG = {
  version: '0.1.0',

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
    },
    sergeant: {
      // spear: solid all-rounder, reaches 2 tiles in a straight line
      hp: 34, atk: 12, def: 7, spd: 8, move: 4, jump: 2,
      terrainCost: {},
      minRange: 1, maxRange: 2, straightLine: true,
      maxHeightReach: 2,
    },
    archer: {
      // light-footed: high jump, rock is easy going, fragile
      hp: 26, atk: 11, def: 4, spd: 10, move: 4, jump: 3,
      terrainCost: { r: 1 },
      minRange: 2, maxRange: 4, straightLine: false,
      maxHeightReach: 99,
      rangeBonusPerHeight: 2, // +1 max range for every N levels above the target
    },
    skirmisher: {
      // nimble: fast, long move, big jump, ignores rough terrain; hits weakly — wants backs
      hp: 28, atk: 12, def: 5, spd: 11, move: 5, jump: 3,
      terrainCost: { s: 1, r: 1 },
      minRange: 1, maxRange: 1, straightLine: false,
      maxHeightReach: 2,
    },
  },

  teams: {
    player: {
      label: 'Templars',
      names: { knight: 'Templar Knight', sergeant: 'Sergeant', archer: 'Turcopole Archer', skirmisher: 'Scout' },
    },
    enemy: {
      label: 'Raiders',
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
  // End-of-turn facing: auto-face (target if attacked, else nearest foe), with an
  // optional one-tap override in the panel. No mandatory facing step.
  facing: {
    autoFaceNearestFoe: true,
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
  },

  // ---------------------------------------------------------------- presentation
  view: {
    tileHeightPx: 16,        // vertical px per height level (at scale 1, tile width 64)
    baseTileWidth: 64,
    mapPaddingPx: 4,
    zoom: 1.3,               // >1 zooms past fit-to-width on phones; drag to pan
    camFollow: 0.15,         // camera easing toward active unit per frame
    dragThresholdPx: 12,     // movement before a touch counts as a pan instead of a tap
    moveStepMs: 140,         // per tile of movement
    attackLungeMs: 220,
    damageFloatMs: 900,
    damageFloatRisePx: 34,
    turnBannerMs: 700,
    hitFlashMs: 200,
    bobAmplitudePx: 2,
    bobSpeed: 0.005,
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
    player: { body: '#ece6d6', trim: '#b8141c', accent: '#d8d2c0' },
    enemy: { body: '#2f5d5a', trim: '#d4a73c', accent: '#1f3d3b' },
    hpGood: '#5fd36a', hpMid: '#e8c547', hpLow: '#e8534a',
  },
};
