// Outremer — battle maps. Map DATA only (layout, heights, terrain, deployment).
// Terrain types, move costs, colors and every other tuning number stay in config.js.
//
// heights[y][x]: integer height levels (0 = ground). terrain[y][x]: key into CONFIG.terrain.
// deployment: [role, x, y, facing]   facing: 0=N(-y) 1=E(+x) 2=S(+y) 3=W(-x)
// Objective on every map for now: defeat all enemies.

export const MAPS = [
  {
    id: 'ridge',
    name: 'The Ridge',
    blurb: 'Open hills. Raiders hold the high ground to the north.',
    width: 8,
    height: 8,
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
    deployment: {
      player: [['knight', 3, 6, 0], ['sergeant', 4, 6, 0], ['archer', 1, 6, 0]],
      enemy: [['knight', 3, 1, 2], ['skirmisher', 1, 1, 2], ['archer', 5, 1, 2]],
    },
  },
  {
    id: 'breach',
    name: 'The Breach',
    blurb: 'A ruined keep. Storm the gap in the curtain wall from the west.',
    width: 8,
    height: 8,
    // x=4 is the curtain wall (height 3) with a rubble breach at rows 3–4 (height 1).
    // West: open ground outside the walls with a small rubble mound (2,1)-(2,2) and a
    // rocky rise in the south-west. East: a sunken flagstone courtyard (height 0) with a
    // ramp (5,2) and a stair tower in the south-east climbing to height 4.
    // JUMP decides who uses the walls: knights (JUMP 1) can only go through the breach;
    // sergeants (2) can take the ramp and stairs; archers/skirmishers (3) scale the
    // curtain wall straight from the ground.
    heights: [
      [0, 0, 0, 0, 3, 0, 0, 3],
      [0, 0, 1, 0, 3, 0, 0, 2],
      [0, 1, 1, 0, 3, 2, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 3, 0, 2, 3],
      [2, 1, 0, 0, 3, 2, 3, 4],
      [2, 2, 1, 0, 3, 3, 3, 4],
    ],
    terrain: [
      'sggsweew',
      'sgbgweew',
      'sgbsweee',
      'ggddbbee',
      'gddsbbee',
      'gggsweew',
      'rgssweww',
      'rrgswwww',
    ],
    deployment: {
      player: [['knight', 1, 4, 1], ['sergeant', 1, 3, 1], ['archer', 0, 6, 1]],
      // Tuned by AI-vs-AI sim (spawns/terrain only): an archer spawned on the tower
      // (6,6) or the ledge (6,5) wins ~95% for the defenders, so it starts in the courtyard.
      enemy: [['knight', 6, 4, 3], ['skirmisher', 5, 1, 3], ['archer', 6, 3, 3]],
    },
  },
];

export const mapById = (id) => MAPS.find((m) => m.id === id) || null;
// accepts an id ('breach') or a 1-based number ('2')
export function resolveMap(key) {
  if (key == null || key === '') return null;
  const n = Number(key);
  if (Number.isInteger(n) && n >= 1 && n <= MAPS.length) return MAPS[n - 1];
  return mapById(String(key).toLowerCase());
}
