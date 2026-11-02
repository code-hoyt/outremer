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
    // rocky rise in the south-west. East: a sunken flagstone courtyard (height 0) and a
    // stair tower in the south-east climbing to height 4.
    // v0.10 (map rule: every tile reachable at MOV 2 / JUMP 2, and we hold it to JUMP 1):
    // stone STAIRS (terrain t, one level per step) climb the wall from BOTH sides, so a
    // Knight can walk up and fight an archer on the wall-walk:
    //   west, outside: (3,2)→(3,1)→ wall (4,1)   and   (3,5)→(3,6)→ wall (4,6)
    //   east, inside:  (6,2)→(5,2)→ wall (4,2)   (7,2)→(7,1)→ tower (7,0)   (5,5)→(5,6)/(6,5)→ south tower
    heights: [
      [0, 0, 0, 0, 3, 0, 0, 3],
      [0, 0, 1, 2, 3, 0, 0, 2],
      [0, 1, 1, 1, 3, 2, 1, 1],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 1, 3, 1, 2, 3],
      [2, 1, 0, 2, 3, 2, 3, 4],
      [2, 2, 1, 0, 3, 3, 3, 4],
    ],
    terrain: [
      'sggsweew',
      'sgbtweew',
      'sgbtwttt',
      'ggddbbee',
      'gddsbbee',
      'gggtwtew',
      'rgstweww',
      'rrgswwww',
    ],
    deployment: {
      player: [['knight', 1, 4, 1], ['sergeant', 1, 3, 1], ['archer', 0, 6, 1]],
      // Tuned by AI-vs-AI sim (spawns/terrain only): an archer spawned on the tower
      // (6,6) or the ledge (6,5) wins ~95% for the defenders, so it starts in the courtyard.
      enemy: [['knight', 6, 4, 3], ['skirmisher', 5, 1, 3], ['archer', 6, 3, 3]],
    },
  },
  {
    id: 'baggage',
    name: 'The Baggage Train',
    blurb: 'A raided column on the coast road. Overturned carts block the way.',
    missionOnly: true, // only used by a mission: not listed in the skirmish / map pickers
    width: 8,
    height: 8,
    // The coast road runs west-east along rows 3-4. Overturned carts (terrain c, height 1)
    // break it up; low dunes north and south, a rocky shoulder in the corners.
    heights: [
      [1, 1, 0, 0, 0, 1, 2, 2],
      [1, 0, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [2, 1, 0, 0, 0, 0, 1, 2],
    ],
    terrain: [
      'sssggsss',
      'ssgggsrs',
      'sggcgggs',
      'dddcddcd',
      'dddddddd',
      'sgcggcgs',
      'ssggggss',
      'rssgggsr',
    ],
    deployment: {
      player: [['knight', 0, 4, 1], ['sergeant', 0, 3, 1], ['archer', 1, 6, 1]],
      enemy: [['knight', 7, 4, 3], ['skirmisher', 6, 1, 3], ['archer', 7, 6, 3]],
    },
  },
  {
    id: 'ford',
    name: 'The Chapel Ford',
    blurb: 'A ruined chapel on a hill above a river ford. The Red Captain waits on its steps.',
    missionOnly: true, // the campaign finale (v0.11)
    width: 8,
    height: 8,
    // A shallow river (terrain f, cost 2) runs north-south at x = 3-4; one stone ford (road) crosses it at
    // rows 3-4. West bank: open grass, rocky corners. East bank: the ground rises to the chapel (height 2-3),
    // climbed by stairs on the north and south flanks and a road ramp in the middle. Wren's stepping stones
    // (CONFIG.campaign.finale.wrenShortcut) are added only when she is fielded. Passes tools/reach.mjs.
    heights: [
      [0, 0, 0, 0, 0, 1, 2, 3],
      [0, 1, 0, 0, 0, 1, 2, 3],
      [0, 1, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 2],
      [2, 1, 0, 0, 0, 1, 2, 3],
      [2, 2, 1, 0, 0, 0, 2, 3],
    ],
    terrain: [
      'ggsffgte',
      'grsffgte',
      'ggdffgte',
      'dddddddt',
      'ggdddddd',
      'gggffgtt',
      'rggffgte',
      'rrgffgte',
    ],
    deployment: {
      player: [['knight', 0, 3, 1], ['sergeant', 0, 4, 1], ['archer', 1, 6, 1]],
      // the knight at (7, 3) is the Red Captain (CONFIG.campaign.finale.captain.at)
      enemy: [['knight', 7, 3, 3], ['sergeant', 5, 3, 3], ['archer', 6, 1, 3], ['skirmisher', 5, 6, 3]],
    },
  },
];

// maps offered as skirmishes / in the map picker (mission-only maps are left out)
export const skirmishMaps = () => MAPS.filter((m) => !m.missionOnly);
export const mapById = (id) => MAPS.find((m) => m.id === id) || null;
// accepts an id ('breach') or a 1-based number ('2')
export function resolveMap(key) {
  if (key == null || key === '') return null;
  const n = Number(key);
  if (Number.isInteger(n) && n >= 1 && n <= MAPS.length) return MAPS[n - 1];
  return mapById(String(key).toLowerCase());
}
