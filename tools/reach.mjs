// Map design rule (Cletus, v0.10): every walkable tile must be reachable — over any number of turns —
// by a unit with MOV 2 and JUMP 2. We also hold maps to JUMP 1 (Knights) and check every class with its
// real MOV / JUMP / terrain costs. Rules live in CONFIG.mapRules. Units on the field are ignored.
//   node tools/reach.mjs          check every map, exit 1 if any tile is cut off (run by the test suite)
//   node tools/reach.mjs 3 1      also report another MOV/JUMP (info only)
import { CONFIG } from '../src/config.js';
import { MAPS } from '../src/maps.js';
import { fileURLToPath } from 'node:url';

// costOf(terrainKey) -> move cost of entering that tile. A step a→b is possible when |height diff| <= jump
// and entering b costs <= move (incl. climb cost going up). The map passes when every walkable tile can
// reach every other one (strongly connected; checked with a forward and a reverse search from one tile).
export function checkMap(m, move, jump, costOf = (k) => CONFIG.terrain[k].cost) {
  const W = m.width, H = m.height;
  const enter = (ax, ay, bx, by) => costOf(m.terrain[by][bx]) + Math.max(0, m.heights[by][bx] - m.heights[ay][ax]) * (CONFIG.climbCostPerLevel || 0);
  const walk = (x, y) => CONFIG.terrain[m.terrain[y][x]] && costOf(m.terrain[y][x]) <= move;
  const step = (ax, ay, bx, by) => Math.abs(m.heights[by][bx] - m.heights[ay][ax]) <= jump && enter(ax, ay, bx, by) <= move;
  const tiles = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (walk(x, y)) tiles.push([x, y]);
  const search = (sx, sy, rev) => {
    const seen = new Set([sy * W + sx]), q = [[sx, sy]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || !walk(nx, ny) || seen.has(ny * W + nx)) continue;
        if (rev ? !step(nx, ny, x, y) : !step(x, y, nx, ny)) continue;
        seen.add(ny * W + nx); q.push([nx, ny]);
      }
    }
    return seen;
  };
  // tiles a unit can't even stand on (cost > MOV) count as cut off too
  const all = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (CONFIG.terrain[m.terrain[y][x]]) all.push([x, y]);
  if (!tiles.length) return { tiles: all.length, bad: all };
  const [sx, sy] = tiles[0], fwd = search(sx, sy, false), back = search(sx, sy, true);
  const bad = all.filter(([x, y]) => !fwd.has(y * W + x) || !back.has(y * W + x));
  return { tiles: all.length, bad };
}

export function checkAll(maps = MAPS, log = console.log) {
  let fail = false;
  const line = (ok, m, label, tiles, bad, info) => log(`${ok ? 'OK  ' : 'FAIL'} ${m.id.padEnd(8)} ${label}: ${tiles - bad.length}/${tiles} tiles connected${ok ? '' : ' · cut off: ' + bad.map(([x, y]) => `(${x},${y})`).join(' ')}${info ? ' (info)' : ''}`);
  for (const m of maps) {
    for (const r of CONFIG.mapRules) { const { tiles, bad } = checkMap(m, r.move, r.jump); if (bad.length) fail = true; line(!bad.length, m, `MOV ${r.move} JUMP ${r.jump}`, tiles, bad); }
    for (const [id, r] of Object.entries(CONFIG.roles)) {
      const { tiles, bad } = checkMap(m, r.move, r.jump, (k) => (r.terrainCost && r.terrainCost[k] != null ? r.terrainCost[k] : CONFIG.terrain[k].cost));
      if (bad.length) fail = true; line(!bad.length, m, `${id} (MOV ${r.move} JUMP ${r.jump})`, tiles, bad);
    }
  }
  return !fail;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let ok = checkAll();
  if (process.argv[2]) for (const m of MAPS) { const { tiles, bad } = checkMap(m, +process.argv[2], +process.argv[3]); console.log(`${bad.length ? 'FAIL' : 'OK  '} ${m.id.padEnd(8)} MOV ${process.argv[2]} JUMP ${process.argv[3]}: ${tiles - bad.length}/${tiles} (info)`); }
  console.log(ok ? 'map reachability: ALL OK' : 'map reachability: FAILED');
  process.exit(ok ? 0 : 1);
}
