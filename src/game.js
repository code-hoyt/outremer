// Core rules: state, CT turn order, movement, combat math. No rendering here.
import { CONFIG } from './config.js';

export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N E S W

export function createState(rng = Math.random) {
  const m = CONFIG.map;
  const units = [];
  let id = 0;
  for (const team of ['player', 'enemy']) {
    for (const [role, x, y, facing] of CONFIG.deployment[team]) {
      const b = CONFIG.teams[team].statBonus || {};
      const r = Object.fromEntries(Object.entries(CONFIG.roles[role]).map(([k, v]) => [k, typeof v === 'number' && b[k] ? v + b[k] : v]));
      units.push({
        id: id++, team, role, name: CONFIG.teams[team].names[role],
        x, y, facing,
        hp: r.hp, maxHp: r.hp, atk: r.atk, def: r.def, spd: r.spd,
        move: r.move, jump: r.jump,
        ct: Math.floor(rng() * (CONFIG.turn.startCtSpread + 1)),
      });
    }
  }
  return {
    w: m.width, h: m.height, heights: m.heights, terrain: m.terrain,
    units, active: null, moved: false, acted: false, over: null, turnCount: 0, rng,
  };
}

export const heightAt = (s, x, y) => s.heights[y][x];
export const inBounds = (s, x, y) => x >= 0 && y >= 0 && x < s.w && y < s.h;
export const alive = (s) => s.units.filter((u) => u.hp > 0);
export const unitAt = (s, x, y) => s.units.find((u) => u.hp > 0 && u.x === x && u.y === y);

// ---------------------------------------------------------------- CT turn order
// Advance ticks until someone reaches the threshold. Ties: higher CT, then higher spd, then id.
export function nextActor(units) {
  const T = CONFIG.turn.ctThreshold;
  const live = units.filter((u) => u.hp > 0);
  if (!live.length) return null;
  while (true) {
    const ready = live.filter((u) => u.ct >= T);
    if (ready.length) {
      ready.sort((a, b) => b.ct - a.ct || b.spd - a.spd || a.id - b.id);
      return ready[0];
    }
    for (const u of live) u.ct += u.spd;
  }
}

export function startNextTurn(s) {
  const u = nextActor(s.units);
  s.active = u; s.moved = false; s.acted = false; s.manualFacing = null; s.turnCount++;
  s.startPos = u ? { x: u.x, y: u.y } : null;
  return u;
}

export function endTurn(s) {
  const t = CONFIG.turn;
  const u = s.active;
  if (u) autoFace(s, u);
  if (u) u.ct -= s.moved && s.acted ? t.costMovedAndActed : s.moved || s.acted ? t.costOneOf : t.costNeither;
  s.active = null;
}

// Simulated preview of upcoming turns (assumes each unit spends the full cost).
export function previewOrder(s, n = CONFIG.turn.previewLength) {
  const sim = s.units.filter((u) => u.hp > 0).map((u) => ({ id: u.id, ct: u.ct, spd: u.spd, hp: 1 }));
  const out = [];
  if (s.active) {
    out.push(s.active.id);
    const a = sim.find((x) => x.id === s.active.id);
    a.ct -= CONFIG.turn.costMovedAndActed;
  }
  while (out.length < n && sim.length) {
    const u = nextActor(sim);
    out.push(u.id);
    u.ct -= CONFIG.turn.costMovedAndActed;
  }
  return out.map((id) => s.units[id]);
}

// ---------------------------------------------------------------- movement
// Dijkstra over move points: per-class terrain cost, jump limit, enemies block, allies pass.
export function moveCost(s, u, x, y, fromH) {
  const t = s.terrain[y][x];
  const role = CONFIG.roles[u.role];
  const base = role.terrainCost && role.terrainCost[t] != null ? role.terrainCost[t] : CONFIG.terrain[t].cost;
  const climb = Math.max(0, heightAt(s, x, y) - fromH) * CONFIG.climbCostPerLevel;
  return base + climb;
}

export function reachable(s, u) {
  const key = (x, y) => y * s.w + x;
  const dist = new Map([[key(u.x, u.y), 0]]);
  const prev = new Map();
  const open = [[0, u.x, u.y]];
  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [d, x, y] = open.shift();
    if (d > dist.get(key(x, y))) continue;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (!inBounds(s, nx, ny)) continue;
      if (Math.abs(heightAt(s, nx, ny) - heightAt(s, x, y)) > u.jump) continue;
      const occ = unitAt(s, nx, ny);
      if (occ && occ.team !== u.team) continue;
      const nd = d + moveCost(s, u, nx, ny, heightAt(s, x, y));
      if (nd > u.move) continue;
      const k = key(nx, ny);
      if (dist.has(k) && dist.get(k) <= nd) continue;
      dist.set(k, nd); prev.set(k, key(x, y)); open.push([nd, nx, ny]);
    }
  }
  const tiles = [];
  for (const k of dist.keys()) {
    const x = k % s.w, y = Math.floor(k / s.w);
    const occ = unitAt(s, x, y);
    if (!occ || occ === u) tiles.push({ x, y });
  }
  const pathTo = (x, y) => {
    const p = [];
    let k = key(x, y);
    if (!dist.has(k)) return null;
    while (k !== undefined) { p.unshift({ x: k % s.w, y: Math.floor(k / s.w) }); k = prev.get(k); }
    return p;
  };
  return { tiles, pathTo };
}

// ---------------------------------------------------------------- attack range
export function maxRangeFrom(s, u, fx, fy, tx, ty) {
  const r = CONFIG.roles[u.role];
  let max = r.maxRange;
  if (r.rangeBonusPerHeight) {
    const adv = heightAt(s, fx, fy) - heightAt(s, tx, ty);
    if (adv > 0) max += Math.floor(adv / r.rangeBonusPerHeight);
  }
  return max;
}

export function canAttackFrom(s, u, fx, fy, tx, ty) {
  const r = CONFIG.roles[u.role];
  const dx = tx - fx, dy = ty - fy;
  const d = Math.abs(dx) + Math.abs(dy);
  if (d < r.minRange || d > maxRangeFrom(s, u, fx, fy, tx, ty)) return false;
  if (r.straightLine && dx !== 0 && dy !== 0) return false;
  if (Math.abs(heightAt(s, fx, fy) - heightAt(s, tx, ty)) > r.maxHeightReach) return false;
  return true;
}

export function attackTiles(s, u, fx = u.x, fy = u.y) {
  const out = [];
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    if (canAttackFrom(s, u, fx, fy, x, y)) out.push({ x, y });
  }
  return out;
}

export function targetsFrom(s, u, fx = u.x, fy = u.y) {
  return alive(s).filter((t) => t.team !== u.team && canAttackFrom(s, u, fx, fy, t.x, t.y));
}

// ---------------------------------------------------------------- combat
export function facingTo(fx, fy, tx, ty, fallback = 0) {
  const dx = tx - fx, dy = ty - fy;
  if (dx === 0 && dy === 0) return fallback;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 1 : 3;
  return dy > 0 ? 2 : 0;
}

// Which side of the target is being hit: front / side / back.
export function hitSide(attackerPos, target) {
  const dirToAttacker = facingTo(target.x, target.y, attackerPos.x, attackerPos.y, target.facing);
  const diff = (dirToAttacker - target.facing + 4) % 4;
  return diff === 0 ? 'front' : diff === 2 ? 'back' : 'side';
}

// Allies of the attacker (other than the attacker) adjacent to the target.
export function flankers(s, u, t, fx = u.x, fy = u.y) {
  return alive(s).filter((a) => a.team === u.team && a !== u && !(a.x === fx && a.y === fy) &&
    Math.abs(a.x - t.x) + Math.abs(a.y - t.y) === 1).length;
}

export function preview(s, u, t, fx = u.x, fy = u.y) {
  const c = CONFIG.combat;
  const nFlank = Math.min(c.flankMaxAllies, flankers(s, u, t, fx, fy));
  const flankMod = 1 + c.flankBonusPerAlly * nFlank;
  const hAdv = heightAt(s, fx, fy) - heightAt(s, t.x, t.y);
  const heightMod = Math.min(c.heightModMax, Math.max(c.heightModMin, 1 + c.heightBonusPerLevel * hAdv));
  const side = hitSide({ x: fx, y: fy }, t);
  const base = u.atk * c.atkMul - t.def * c.defMul;
  const dmg = Math.max(c.minDamage, Math.round(base * heightMod * c.facingMod[side] * flankMod));
  const hit = Math.max(5, Math.min(100, c.hitChance[side] + c.hitPerHeightLevel * hAdv));
  return { dmg, hit, side, heightMod, hAdv, nFlank, flankMod, facingMod: c.facingMod[side] };
}

export function resolveAttack(s, u, t) {
  const c = CONFIG.combat;
  const p = preview(s, u, t);
  u.facing = facingTo(u.x, u.y, t.x, t.y, u.facing);
  s.acted = true;
  const roll = s.rng() * 100;
  if (roll >= p.hit) return { ...p, miss: true, amount: 0 };
  const crit = s.rng() * 100 < c.critChance;
  const v = 1 + (s.rng() * 2 - 1) * c.variance;
  const amount = Math.max(c.minDamage, Math.round(p.dmg * v * (crit ? c.critMul : 1)));
  t.hp = Math.max(0, t.hp - amount);
  checkOver(s);
  return { ...p, miss: false, crit, amount, killed: t.hp === 0 };
}

export function moveUnit(s, u, x, y, path) {
  if (path && path.length > 1) {
    const a = path[path.length - 2], b = path[path.length - 1];
    u.facing = facingTo(a.x, a.y, b.x, b.y, u.facing);
  }
  u.x = x; u.y = y; s.moved = true;
}

export function checkOver(s) {
  const p = s.units.some((u) => u.team === 'player' && u.hp > 0);
  const e = s.units.some((u) => u.team === 'enemy' && u.hp > 0);
  if (!e) s.over = 'victory';
  else if (!p) s.over = 'defeat';
  return s.over;
}

// Auto-facing at end of turn: keep the attack facing if the unit attacked,
// otherwise turn toward the nearest foe. A manual override (one tap) wins.
export function autoFace(s, u) {
  if (s.manualFacing != null) { u.facing = s.manualFacing; return; }
  if (s.acted || !CONFIG.facing.autoFaceNearestFoe) return;
  const foes = alive(s).filter((f) => f.team !== u.team);
  if (!foes.length) return;
  foes.sort((a, b) => (Math.abs(a.x - u.x) + Math.abs(a.y - u.y)) - (Math.abs(b.x - u.x) + Math.abs(b.y - u.y)));
  u.facing = facingTo(u.x, u.y, foes[0].x, foes[0].y, u.facing);
}
