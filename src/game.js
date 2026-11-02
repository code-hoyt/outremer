// Core rules: state, CT turn order, movement, combat math. No rendering here.
import { CONFIG } from './config.js';
import { MAPS, resolveMap } from './maps.js';
import { applyHero } from './hero.js';
import { companionDef, applyCompanion } from './party.js';

export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N E S W

// Squad-aware enemy HP trim (CONFIG.difficulty.bySquad / byCompanion): the exact squad's entry for this battle
// if tuned ('' = no companions, 'renaud+wren', finale keys add '/missed' e.g. 'renaud+wren/yusuf'), else the
// product of the per-companion trims.
export const squadKey = (comps, missed = []) => [...comps].sort().join('+') + (missed.length ? '/' + [...missed].sort().join('+') : '');
export function squadTrim(d, battleId, comps, missed = []) {
  const t = (d.bySquad || {})[battleId] || {}, k = squadKey(comps, missed);
  if (t[k] != null) return t[k];
  return comps.reduce((a, c) => a * ((d.byCompanion || {})[c] ?? 1), 1);
}

// mapKey: a map id ('breach') or 1-based number; unknown/empty = CONFIG.defaultMap
// hero: optional created main character (src/hero.js); replaces the Templar of the same class (keeps its slot),
// or slot 0 if the squad has no unit of that class.
// opts: { companions: [id...] fielded with the hero, mission: recruit/skirmish/finale mission from src/missions.js,
//   wins: recruit missions already won (campaign difficulty step), missed: [companion id...] not in your company (finale) }
export function createState(rng = Math.random, mapKey, hero = null, opts = {}) {
  const mission = opts.mission || null;
  const m = resolveMap(mission ? mission.map : mapKey) || resolveMap(CONFIG.defaultMap) || MAPS[0];
  const units = [];
  let id = 0;
  const make = (team, role, x, y, facing) => {
    const b = CONFIG.teams[team].statBonus || {};
    const r = Object.fromEntries(Object.entries(CONFIG.roles[role]).map(([k, v]) => [k, typeof v === 'number' && b[k] ? v + b[k] : v]));
    const u = {
      id: id++, team, role, name: CONFIG.teams[team].names[role],
      x, y, facing,
      hp: r.hp, maxHp: r.hp, atk: r.atk, def: r.def, spd: r.spd,
      move: r.move, jump: r.jump,
      ct: Math.floor(rng() * (CONFIG.turn.startCtSpread + 1)),
      status: {}, cd: {}, templar: team === 'player',
    };
    if (team === 'enemy') {
      const d = CONFIG.difficulty || {};
      const b = ((d.byBattle || {})[mission ? mission.id : m.id]) ?? 1; // a number, or { hp, atk } to tune them apart
      const camp = CONFIG.campaign || {}, steps = camp.stepByWins || [1];
      const step = mission && mission.kind !== 'skirmish' ? steps[Math.min(opts.wins || 0, steps.length - 1)] : 1; // by missions won
      const sq = squadTrim(d, mission ? mission.id : m.id, opts.companions || [], opts.missed || []); // squad-aware trim
      // the step and the squad trim scale HP only: ATK is a small integer, so × ATK jumps in rounding cliffs
      const kh = (typeof b === 'number' ? b : (b.hp ?? 1)) * step * sq, ka = typeof b === 'number' ? b : (b.atk ?? 1);
      u.hp = u.maxHp = Math.max(1, Math.round(u.hp * (d.enemyHpMul ?? 1) * kh));
      u.atk = Math.max(1, Math.round(u.atk * (d.enemyAtkMul ?? 1) * ka));
      u.def = Math.max(0, u.def + (d.enemyDefAdd || 0));
      u.spd = Math.max(1, u.spd + (d.enemySpdAdd || 0));
    }
    units.push(u);
    return u;
  };
  const dep = { player: m.deployment.player, enemy: (mission && mission.enemy) || m.deployment.enemy };
  for (const team of ['player', 'enemy']) for (const [role, x, y, facing] of dep[team]) make(team, role, x, y, facing);
  // the finale (CONFIG.campaign.finale): the Red Captain, and what the companions you don't have cost you
  const F = mission && mission.kind === 'finale' ? CONFIG.campaign.finale : null;
  const missed = opts.missed || [], fielded = opts.companions || [];
  let reserve = null;
  if (F) {
    const cap = units.find((u) => u.team === 'enemy' && u.x === F.captain.at[0] && u.y === F.captain.at[1]);
    if (cap) {
      cap.captain = true; cap.name = F.captain.name;
      cap.hp = cap.maxHp = Math.round(cap.maxHp * F.captain.hpMul);
      cap.atk += (F.captain.atkAdd || 0) + (missed.includes('renaud') ? F.missed.renaud.captainAtkAdd : 0);
      cap.def += F.captain.defAdd || 0;
    }
    if (missed.includes('yusuf')) make('enemy', ...F.missed.yusuf.extra);
  }
  const mine = units.filter((u) => u.team === 'player');
  if (hero) applyHero(mine.find((u) => u.role === hero.role) || mine[0], hero);
  // companions take a generic slot of their own class if there is one, else any generic slot
  for (const cid of opts.companions || []) {
    const c = companionDef(cid);
    const free = mine.filter((u) => !u.hero && !u.companion);
    if (!c || !free.length) continue;
    applyCompanion(free.find((u) => u.role === c.role) || free[0], cid);
  }
  // recruit mission: the companion-to-be stands on the field as an AI-driven ally who must survive
  if (mission && mission.npc) {
    const c = companionDef(mission.companion), [x, y, facing] = mission.npc;
    const a = applyCompanion(make('player', c.role, x, y, facing), mission.companion, { npc: true });
    a.aiStyle = mission.npcAi || c.aiStyle || 'steady'; // in-character AI (CONFIG.ai.personalities)
    const hm = (mission.npcHpMul || 1) * ((CONFIG.difficulty && CONFIG.difficulty.npcHpMul) || 1); // per-mission toughness × global knob
    a.hp = a.maxHp = Math.round(a.maxHp * hm);
  }
  // skipped Wren: a raider urchin opens the chapel's side door on round N (made last so ids stay = indices)
  if (F && missed.includes('wren')) {
    const w = F.missed.wren;
    reserve = { unit: make('enemy', ...w.reinforce), round: w.atRound };
    reserve.unit.name = w.name;
    units.pop();
  }
  let heights = m.heights, terrain = m.terrain, reliquary = null;
  if (F && fielded.includes('wren')) { // Wren: stepping stones + the marked reliquary
    heights = m.heights.map((r) => r.slice()); terrain = m.terrain.slice();
    for (const [x, y, h, t] of F.wrenShortcut) { heights[y][x] = h; terrain[y] = terrain[y].slice(0, x) + t + terrain[y].slice(x + 1); }
    reliquary = { x: F.reliquary[0], y: F.reliquary[1] };
  }
  return {
    mapId: m.id, mapName: m.name, w: m.width, h: m.height, heights, terrain,
    missionId: mission ? mission.id : null, finale: !!F, reliquary, reserve, roundLen: units.length,
    units, active: null, moved: false, acted: false, over: null, turnCount: 0, rng,
  };
}

// ---------------------------------------------------------------- companion traits (CONFIG.party.traits)
const TR = (id) => CONFIG.party.traits[id] || {};
const adjFoes = (s, u, x = u.x, y = u.y) => s.units.filter((f) => f.hp > 0 && f.team !== u.team && Math.abs(f.x - x) + Math.abs(f.y - y) === 1);
// Under the Rule (Renaud): +DEF next to another Templar
export function traitDefBonus(s, t) {
  if (t.trait !== 'underTheRule') return 0;
  const near = s.units.some((a) => a !== t && a.hp > 0 && a.team === t.team && a.templar && Math.abs(a.x - t.x) + Math.abs(a.y - t.y) === 1);
  return near ? TR('underTheRule').defAdjTemplar : 0;
}
// Mercy (Yusuf): won't strike a foe below the threshold
export const mercyBlocks = (u, t) => u.trait === 'turncoatsEye' && t.hp > 0 && t.hp < t.maxHp * TR('turncoatsEye').mercyBelow;
// Skittish (Wren): starting her turn next to 2+ foes, she can't act this turn
export const skittishAt = (s, u) => u.trait === 'lightFeet' && adjFoes(s, u).length >= TR('lightFeet').skittishAdj;
// Holds ground (Renaud): starting next to a foe, may only end a move next to a foe
export const holdsGround = (s, u) => u.trait === 'underTheRule' && adjFoes(s, u).length > 0;
export const canAct = (s) => !s.skittish;

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

// finale: the reserve raider steps onto the field at the start of its round (nearest free tile to its spot)
function spawnReserve(s) {
  const r = s.reserve;
  if (!r || s.turnCount < (r.round - 1) * s.roundLen) return null;
  s.reserve = null;
  const u = r.unit;
  let best = null;
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    if (unitAt(s, x, y)) continue;
    const d = Math.abs(x - u.x) + Math.abs(y - u.y);
    if (!best || d < best.d) best = { x, y, d };
  }
  if (!best) return null;
  u.x = best.x; u.y = best.y; u.id = s.units.length; u.ct = 0;
  s.units.push(u);
  s.spawned = u;
  return u;
}

export function startNextTurn(s) {
  spawnReserve(s);
  const u = nextActor(s.units);
  s.active = u; s.moved = false; s.acted = false; s.intercepted = false; s.turnCount++;
  s.skittish = !!(u && skittishAt(s, u));
  if (u) {
    for (const k of Object.keys(u.cd)) if (u.cd[k] > 0) u.cd[k]--;
    const had = { ...u.status };
    for (const [k, v] of Object.entries(u.status)) if (v.until === 'start') delete u.status[k];
    if (had.wall && CONFIG.abilities.shieldWall.slowNextTurn) u.status.slowed = { until: 'end', move: CONFIG.abilities.shieldWall.slowNextTurn };
  }
  s.startPos = u ? { x: u.x, y: u.y, facing: u.facing } : null;
  return u;
}

export function endTurn(s) {
  const t = CONFIG.turn;
  const u = s.active;
  if (u) {
    u.ct -= s.moved && s.acted ? t.costMovedAndActed : s.moved || s.acted ? t.costOneOf : t.costNeither;
    for (const [k, v] of Object.entries(u.status)) if (v.until === 'end') delete u.status[k];
  }
  s.active = null;
}

// Simulated preview of upcoming turns (assumes each unit spends the full cost).
export function previewOrder(s, n = CONFIG.turn.previewLength) {
  const sim = s.units.filter((u) => u.hp > 0).map((u) => ({ id: u.id, ct: u.ct, spd: u.spd, hp: 1 }));
  const out = [];
  const a = s.active && sim.find((x) => x.id === s.active.id); // (the active unit may have just fallen)
  if (a) {
    out.push(a.id);
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

// Effective MOV / JUMP after statuses (Pinned, Slowed).
export function effMove(u) {
  let m = u.move;
  if (u.status.pinned) m -= u.status.pinned.move;
  if (u.status.slowed) m -= u.status.slowed.move;
  return Math.max(0, m);
}
export function effJump(u) { return u.status.pinned ? Math.min(u.jump, u.status.pinned.jumpCap) : u.jump; }

export function reachable(s, u) {
  const MOVE = effMove(u), JUMP = effJump(u);
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
      if (Math.abs(heightAt(s, nx, ny) - heightAt(s, x, y)) > JUMP) continue;
      const occ = unitAt(s, nx, ny);
      if (occ && occ.team !== u.team) continue;
      const nd = d + moveCost(s, u, nx, ny, heightAt(s, x, y));
      if (nd > MOVE) continue;
      const k = key(nx, ny);
      if (dist.has(k) && dist.get(k) <= nd) continue;
      dist.set(k, nd); prev.set(k, key(x, y)); open.push([nd, nx, ny]);
    }
  }
  const tiles = [];
  const hold = holdsGround(s, u);
  for (const k of dist.keys()) {
    const x = k % s.w, y = Math.floor(k / s.w);
    const occ = unitAt(s, x, y);
    if (hold && !(x === u.x && y === u.y) && !adjFoes(s, u, x, y).length) continue;
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
  return alive(s).filter((t) => t.team !== u.team && !mercyBlocks(u, t) && canAttackFrom(s, u, fx, fy, t.x, t.y));
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

// Shield Wall cover: an orthogonally adjacent ally of t (not t itself) is holding a Shield Wall.
export function coveredBy(s, t) {
  if (!CONFIG.abilities.shieldWall.coverAllies) return null;
  return alive(s).find((a) => a !== t && a.team === t.team && a.status.wall && Math.abs(a.x - t.x) + Math.abs(a.y - t.y) === 1) || null;
}

// Finale: the Red Captain is Shaken while Renaud (alive) stands next to him (at fx, fy)
export function isShaken(s, u, fx = u.x, fy = u.y) {
  if (!u.captain) return false;
  const by = CONFIG.campaign.finale.shaken.by;
  return s.units.some((r) => r.hp > 0 && r.companion === by && r.team !== u.team && Math.abs(r.x - fx) + Math.abs(r.y - fy) === 1);
}
// opt: { mul, minSide ('side' = never a front hit), extraMul }
export function preview(s, u, t, fx = u.x, fy = u.y, opt = {}) {
  const c = CONFIG.combat;
  const nFlank = Math.min(c.flankMaxAllies, flankers(s, u, t, fx, fy));
  const flankMod = 1 + c.flankBonusPerAlly * nFlank;
  const hAdv = heightAt(s, fx, fy) - heightAt(s, t.x, t.y);
  const ranged = Math.abs(fx - t.x) + Math.abs(fy - t.y) > 1;
  const perLevel = hAdv > 0 ? (ranged ? c.rangedHeightBonusPerLevel ?? c.heightBonusPerLevel : c.heightBonusPerLevel) : (c.heightPenaltyPerLevel ?? c.heightBonusPerLevel);
  const heightMod = Math.min(c.heightModMax, Math.max(c.heightModMin, 1 + perLevel * hAdv));
  const rawSide = hitSide({ x: fx, y: fy }, t);
  let side = rawSide;
  if (opt.minSide === 'side' && side === 'front') side = 'side';
  const cover = side !== 'front' ? coveredBy(s, t) : null;
  if (cover) side = 'front'; // Shield Wall: no side/back bonus against covered allies
  const wallMod = t.status.wall && side === 'front' ? CONFIG.abilities.shieldWall.frontDmgMul : 1;
  const def = t.def + traitDefBonus(s, t) - (t.status.exposed ? t.status.exposed.def : 0);
  const base = u.atk * c.atkMul - def * c.defMul;
  const mul = (opt.mul ?? 1) * (opt.extraMul ?? 1);
  let dmg = Math.max(c.minDamage, Math.round(base * heightMod * c.facingMod[side] * flankMod * wallMod * mul));
  const shaken = isShaken(s, u, fx, fy), SH = shaken ? CONFIG.campaign.finale.shaken : null;
  if (SH) dmg = Math.max(c.minDamage, Math.round(dmg * SH.dmgMul));
  const hit = Math.max(5, Math.min(100, c.hitChance[side] + c.hitPerHeightLevel * hAdv + (u.hitBonus || 0) - (SH ? SH.hitPenalty : 0))); // hitBonus: hero's Aim
  return { dmg, hit, shaken, crit: Math.max(0, c.critChance + (u.critBonus || 0)), side, rawSide, heightMod, hAdv, nFlank, flankMod, facingMod: c.facingMod[side], cover, wallMod, exposed: !!t.status.exposed };
}

// roll + apply damage from a preview
function strike(s, p, t, extra = 0) {
  const c = CONFIG.combat;
  if (s.rng() * 100 >= p.hit) return { ...p, miss: true, amount: 0, extra: 0 };
  const crit = s.rng() * 100 < (p.crit ?? c.critChance);
  const v = 1 + (s.rng() * 2 - 1) * c.variance;
  const amount = Math.max(c.minDamage, Math.round(p.dmg * v * (crit ? c.critMul : 1)));
  t.hp = Math.max(0, t.hp - amount - extra);
  return { ...p, miss: false, crit, amount, extra, killed: t.hp === 0 };
}

export function resolveAttack(s, u, t) {
  const p = preview(s, u, t);
  u.facing = facingTo(u.x, u.y, t.x, t.y, u.facing);
  s.acted = true;
  const r = strike(s, p, t);
  checkOver(s);
  return r;
}

export function moveUnit(s, u, x, y, path) {
  if (path && path.length > 1) {
    const a = path[path.length - 2], b = path[path.length - 1];
    u.facing = facingTo(a.x, a.y, b.x, b.y, u.facing);
  }
  u.x = x; u.y = y; s.moved = true;
}

export function checkOver(s) {
  // you lose when your own (controllable) units are all down, or a must-survive ally falls
  const p = s.units.some((u) => u.team === 'player' && !u.npc && u.hp > 0);
  const e = s.units.some((u) => u.team === 'enemy' && u.hp > 0);
  const lostAlly = s.units.some((u) => u.mustSurvive && u.hp <= 0);
  const capFell = s.finale && s.units.some((u) => u.captain && u.hp <= 0); // his band breaks and flees
  if (lostAlly) { s.over = 'defeat'; s.lostAlly = true; }
  else if (!e || capFell) { s.over = 'victory'; if (capFell) s.captainFell = true; }
  else if (!p) s.over = 'defeat';
  return s.over;
}

// Undo a move (FFTA2: B after moving, as long as the unit has not acted yet).
export function undoMove(s, u) {
  if (!s.moved || s.acted || s.intercepted || !s.startPos) return false;
  u.x = s.startPos.x; u.y = s.startPos.y; u.facing = s.startPos.facing; s.moved = false;
  return true;
}

// Used by the enemy AI only: face the nearest foe. Player facing is always chosen explicitly.
export function faceNearestFoe(s, u) {
  const foes = alive(s).filter((f) => f.team !== u.team);
  if (!foes.length) return;
  foes.sort((a, b) => (Math.abs(a.x - u.x) + Math.abs(a.y - u.y)) - (Math.abs(b.x - u.x) + Math.abs(b.y - u.y)));
  u.facing = facingTo(u.x, u.y, foes[0].x, foes[0].y, u.facing);
}

// ================================================================ abilities
const AB = () => CONFIG.abilities;
const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export const abilitiesOf = (u) => (CONFIG.roles[u.role].abilities || [])
  .filter((id) => !(CONFIG.teams[u.team].disabledAbilities || []).includes(id)).map((id) => ({ id, ...AB()[id] }));
export const abilityReady = (u, id) => !(u.cd[id] > 0);
const foesOf = (s, u) => alive(s).filter((t) => t.team !== u.team);
const free = (s, x, y) => inBounds(s, x, y) && !unitAt(s, x, y);

// can u (standing at fx,fy) use ability id on unit t?
export function abilityCanTarget(s, u, id, t, fx = u.x, fy = u.y) {
  const a = AB()[id], r = CONFIG.roles[u.role];
  if (a.kind === 'self') return t === u;
  if (!t || t.team === u.team || t.hp <= 0 || mercyBlocks(u, t)) return false;
  const d = Math.abs(t.x - fx) + Math.abs(t.y - fy), dh = Math.abs(heightAt(s, fx, fy) - heightAt(s, t.x, t.y));
  switch (id) {
    case 'shieldBash': case 'feint': return d === 1 && dh <= r.maxHeightReach;
    case 'vaultStrike': return d === 1 && dh <= r.maxHeightReach && !!vaultLanding(s, u, t, fx, fy);
    case 'hook': return d === a.range && (t.x === fx || t.y === fy) && dh <= r.maxHeightReach;
    case 'pinningShot': return canAttackFrom(s, u, fx, fy, t.x, t.y);
    case 'plungingShot': {
      const adv = heightAt(s, fx, fy) - heightAt(s, t.x, t.y);
      return adv >= a.minHeightAdv && d >= r.minRange && d <= maxRangeFrom(s, u, fx, fy, t.x, t.y) + a.rangeBonus;
    }
  }
  return false;
}
export function abilityTargets(s, u, id, fx = u.x, fy = u.y) {
  if (AB()[id].kind === 'self') return [u];
  return foesOf(s, u).filter((t) => abilityCanTarget(s, u, id, t, fx, fy));
}
// tiles to light up as the ability's reach (for the map highlight)
export function abilityRangeTiles(s, u, id, fx = u.x, fy = u.y) {
  const a = AB()[id], r = CONFIG.roles[u.role], out = [];
  if (a.kind === 'self') return [{ x: fx, y: fy }];
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    const d = Math.abs(x - fx) + Math.abs(y - fy), dh = Math.abs(heightAt(s, fx, fy) - heightAt(s, x, y));
    let ok = false;
    if (id === 'shieldBash' || id === 'feint' || id === 'vaultStrike') ok = d === 1 && dh <= r.maxHeightReach;
    else if (id === 'hook') ok = d === a.range && (x === fx || y === fy) && dh <= r.maxHeightReach;
    else if (id === 'pinningShot') ok = canAttackFrom(s, u, fx, fy, x, y);
    else if (id === 'plungingShot') { const adv = heightAt(s, fx, fy) - heightAt(s, x, y); ok = adv >= a.minHeightAdv && d >= r.minRange && d <= maxRangeFrom(s, u, fx, fy, x, y) + a.rangeBonus; }
    if (ok) out.push({ x, y });
  }
  return out;
}

export function vaultLanding(s, u, t, fx = u.x, fy = u.y) {
  const lx = t.x + (t.x - fx), ly = t.y + (t.y - fy);
  if (!free(s, lx, ly) && !(lx === u.x && ly === u.y)) return null;
  if (!inBounds(s, lx, ly)) return null;
  if (Math.abs(heightAt(s, lx, ly) - heightAt(s, fx, fy)) > effJump(u)) return null;
  return { x: lx, y: ly };
}

// Shove / pull outcome for t moving one tile by (dx,dy).
function displace(s, t, dx, dy, a, maxUp = 0) {
  const nx = t.x + dx, ny = t.y + dy;
  if (!inBounds(s, nx, ny)) return { kind: 'slam', extra: a.slamDmg || 0, dest: null, why: 'edge' };
  const occ = unitAt(s, nx, ny);
  if (occ) return { kind: 'collide', extra: a.slamDmg || 0, dest: null, other: occ, otherDmg: a.collideDmg || 0 };
  const up = heightAt(s, nx, ny) - heightAt(s, t.x, t.y);
  if (up > maxUp) return { kind: 'slam', extra: a.slamDmg || 0, dest: null, why: 'wall' };
  const drop = Math.max(0, -up);
  return { kind: 'move', extra: drop * a.fallDmgPerLevel, drop, dest: { x: nx, y: ny } };
}

// Shield-wall cover list, brace zone tiles
export function coveredAllies(s, u, fx = u.x, fy = u.y) {
  return alive(s).filter((a) => a !== u && a.team === u.team && Math.abs(a.x - fx) + Math.abs(a.y - fy) === 1);
}
export function braceZone(s, u, facing = u.facing, fx = u.x, fy = u.y) {
  const [dx, dy] = DIRS[facing], r = CONFIG.roles[u.role], out = [];
  for (let i = 1; i <= AB().brace.zoneLength; i++) {
    const x = fx + dx * i, y = fy + dy * i;
    if (!inBounds(s, x, y)) break;
    if (Math.abs(heightAt(s, x, y) - heightAt(s, fx, fy)) > r.maxHeightReach) continue;
    out.push({ x, y });
  }
  return out;
}

// Full prediction for the confirm step / AI. t = target unit (self for self abilities).
export function abilityPreview(s, u, id, t, fx = u.x, fy = u.y) {
  const a = AB()[id];
  const out = { id, name: a.name, kind: a.kind, effects: [], extra: 0, dest: null, tiles: [] };
  if (id === 'shieldWall') {
    const cov = coveredAllies(s, u, fx, fy);
    out.covered = cov; out.tiles = cov.map((c) => ({ x: c.x, y: c.y }));
    out.effects.push(`Front damage ×${a.frontDmgMul}`, cov.length ? `Covers ${cov.map((c) => c.name).join(', ')}` : 'No adjacent allies to cover', `Trade-off: MOV −${a.slowNextTurn} next turn`);
    return out;
  }
  if (id === 'brace') {
    out.tiles = braceZone(s, u, u.facing, fx, fy);
    out.effects.push(`First foe to step into the ${a.zoneLength} tiles in front is struck and stopped`, 'Zone follows your end-of-turn facing');
    return out;
  }
  let p;
  if (id === 'vaultStrike') {
    const land = vaultLanding(s, u, t, fx, fy);
    p = preview(s, u, t, land.x, land.y, { mul: a.dmgMul });
    out.dest = land; out.self = land; out.tiles = [land];
    out.effects.push('Leap behind the target, strike on landing (Move still free)');
  } else if (id === 'plungingShot') {
    const adv = heightAt(s, fx, fy) - heightAt(s, t.x, t.y);
    p = preview(s, u, t, fx, fy, { mul: a.dmgMul, extraMul: 1 + a.dmgBonusPerLevel * adv, minSide: 'side' });
    out.effects.push(`Plunge +${Math.round(a.dmgBonusPerLevel * adv * 100)}% · never a front hit`, `Trade-off: you're Exposed (DEF −${a.exposedDefPenalty})`);
  } else p = preview(s, u, t, fx, fy, { mul: a.dmgMul });
  Object.assign(out, { dmg: p.dmg, hit: p.hit, side: p.side, p });
  if (id === 'shieldBash' || id === 'hook') {
    const dir = id === 'shieldBash' ? [Math.sign(t.x - fx), Math.sign(t.y - fy)] : [Math.sign(fx - t.x), Math.sign(fy - t.y)];
    const o = displace(s, t, dir[0], dir[1], a, id === 'hook' ? a.maxPullUp : 0);
    out.disp = o; out.extra = o.extra; out.dest = o.dest;
    if (o.dest) out.tiles = [o.dest];
    const verb = id === 'shieldBash' ? 'Shoved' : 'Pulled';
    if (o.kind === 'move') out.effects.push(`${verb} to (${o.dest.x},${o.dest.y})` + (o.drop ? ` · falls ${o.drop} lv +${o.extra}` : ''));
    else if (o.kind === 'collide') out.effects.push(`${id === 'hook' ? 'Pull blocked by' : 'Slams into'} ${o.other.name}: +${o.extra}` + (id === 'shieldBash' ? ` / ${o.other.name} +${o.otherDmg}` : ''));
    else out.effects.push(id === 'hook' ? `Can't pull (${o.why === 'edge' ? 'edge' : 'too high'}): +${o.extra}` : `Slams into the ${o.why === 'edge' ? 'map edge' : 'wall'}: +${o.extra}`);
    if (id === 'hook' && o.kind !== 'move') { out.extra = 0; out.effects[out.effects.length - 1] = o.kind === 'collide' ? `Pull blocked by ${o.other.name}` : "Can't pull (blocked)"; }
  }
  if (id === 'pinningShot') out.effects.push(`Pinned next turn: MOV −${a.pinMovePenalty}, JUMP ≤${a.pinJumpCap}`);
  if (id === 'feint') out.effects.push('Target turns to face you, showing its back to the other side');
  if (t.resist > 0 && ['shieldBash', 'hook', 'pinningShot', 'feint'].includes(id)) out.effects.push(`${t.name} may resist (${t.resist}%)`);
  return out;
}

// Resolve an ability. Returns { miss, amount, extra, killed, moves:[{id,from,to}], tags:[{x,y,text}] }
export function useAbility(s, u, id, t) {
  const a = AB()[id];
  const pv = abilityPreview(s, u, id, t);
  u.cd[id] = a.cooldown + 1; // ticks down at the start of each of u's turns
  s.acted = true;
  const res = { id, name: a.name, miss: false, amount: 0, extra: 0, moves: [], tags: [], pv };
  if (id === 'shieldWall') { u.status.wall = { until: 'start' }; res.tags.push({ x: u.x, y: u.y, text: 'WALL' }); return res; }
  if (id === 'brace') { u.status.brace = { until: 'start' }; res.tags.push({ x: u.x, y: u.y, text: 'BRACE' }); return res; }
  if (id === 'vaultStrike') { const from = { x: u.x, y: u.y }; u.x = pv.self.x; u.y = pv.self.y; res.moves.push({ id: u.id, from, to: { ...pv.self }, hop: true }); }
  u.facing = facingTo(u.x, u.y, t.x, t.y, u.facing);
  const r = strike(s, pv.p, t, 0);
  Object.assign(res, { miss: r.miss, amount: r.amount, crit: r.crit, side: r.side });
  // Resolve (hero stat): a chance to shrug off displacement, Pin and Feint's turn. Only rolled when resist > 0.
  const resisted = !r.miss && t.hp > 0 && t.resist > 0 && ['shieldBash', 'hook', 'pinningShot', 'feint'].includes(id) && s.rng() * 100 < t.resist;
  if (resisted) res.tags.push({ x: t.x, y: t.y, text: 'RESISTED' });
  res.resisted = resisted;
  if (!r.miss && !resisted) {
    if (pv.disp) {
      const o = pv.disp;
      if (o.kind === 'move' && t.hp > 0) { const from = { x: t.x, y: t.y }; t.x = o.dest.x; t.y = o.dest.y; res.moves.push({ id: t.id, from, to: { ...o.dest } }); }
      if (pv.extra) { t.hp = Math.max(0, t.hp - pv.extra); res.extra = pv.extra; res.tags.push({ x: t.x, y: t.y, text: o.kind === 'move' ? `FALL ${pv.extra}` : `SLAM ${pv.extra}` }); }
      if (o.kind === 'collide' && id === 'shieldBash' && o.otherDmg) { o.other.hp = Math.max(0, o.other.hp - o.otherDmg); res.tags.push({ x: o.other.x, y: o.other.y, text: `-${o.otherDmg}` }); res.collided = o.other.id; }
    }
    if (id === 'pinningShot' && t.hp > 0) { t.status.pinned = { until: 'end', move: a.pinMovePenalty, jumpCap: a.pinJumpCap }; res.tags.push({ x: t.x, y: t.y, text: 'PINNED' }); }
    if (id === 'feint' && t.hp > 0) { t.facing = facingTo(t.x, t.y, u.x, u.y, t.facing); res.tags.push({ x: t.x, y: t.y, text: 'TURNED' }); }
  }
  if (id === 'plungingShot') { u.status.exposed = { until: 'start', def: a.exposedDefPenalty }; res.tags.push({ x: u.x, y: u.y, text: 'EXPOSED' }); }
  res.killed = t.hp === 0;
  checkOver(s);
  return res;
}

// ---------------------------------------------------------------- Brace interception (automatic, no prompt)
// First tile along `path` (after the start) that lies in a braced foe's zone and is empty.
export function braceIntercept(s, mover, path) {
  if (!path || path.length < 2) return null;
  const braced = alive(s).filter((b) => b.team !== mover.team && b.status.brace);
  if (!braced.length) return null;
  for (let i = 1; i < path.length; i++) {
    const st = path[i];
    const occ = unitAt(s, st.x, st.y);
    if (occ && occ !== mover) continue; // passing through an ally
    for (const b of braced) if (braceZone(s, b).some((z) => z.x === st.x && z.y === st.y)) return { index: i, by: b };
  }
  return null;
}
// the braced unit thrusts at the mover (call after the mover has been placed on the stop tile)
export function braceStrike(s, b, mover) {
  const p = preview(s, b, mover, b.x, b.y, { mul: AB().brace.dmgMul });
  delete b.status.brace;
  s.intercepted = true;
  const r = strike(s, p, mover);
  checkOver(s);
  return r;
}
