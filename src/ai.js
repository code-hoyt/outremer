// Simple scoring AI: evaluate every reachable tile × (attack | each usable ability) × target, pick the best.
// v0.13: no cooldowns, so only an ability's own drawback limits it (Pin: only from the tile you start on).
import { CONFIG } from './config.js?v=0.14.2';
import {
  reachable, targetsFrom, preview, heightAt, alive, canAttackFrom, faceNearestFoe, effMove, hitSide, facingTo,
  abilitiesOf, abilityReady, moveCost, abilityTargets, abilityPreview, braceIntercept, braceZone, unitAt, canAct, skittishAt,
} from './game.js?v=0.14.2';

const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Rough threat: how much damage foes could deal to a unit standing on (x,y) next turn.
function dangerAt(s, u, x, y) {
  let total = 0;
  const ghost = { ...u, x, y };
  for (const f of alive(s)) {
    if (f.team === u.team) continue;
    const r = CONFIG.roles[f.role];
    if (manhattan(f, ghost) <= effMove(f) + r.maxRange) total += preview(s, f, ghost, f.x, f.y).dmg;
  }
  return total;
}

// Walking distance (move points, over terrain cost + height, ignoring units) from every tile to the nearest
// tile u could attack a foe from. The approach pull uses this instead of straight-line distance, so a unit
// walks round to the stairs instead of pressing against the foot of a wall (v0.10). Unreachable = Infinity.
function approachField(s, u, foes) {
  const W = s.w, H = s.h, JUMP = u.jump, d = new Array(W * H).fill(Infinity), open = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (foes.some((f) => canAttackFrom(s, u, x, y, f.x, f.y))) { d[y * W + x] = 0; open.push([0, x, y]); }
  }
  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [c, x, y] = open.shift();
    if (c > d[y * W + x]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { // reverse edge: stepping (nx,ny) -> (x,y)
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (Math.abs(heightAt(s, nx, ny) - heightAt(s, x, y)) > JUMP) continue;
      const nc = c + moveCost(s, u, x, y, heightAt(s, nx, ny));
      if (nc < d[ny * W + nx]) { d[ny * W + nx] = nc; open.push([nc, nx, ny]); }
    }
  }
  return (x, y) => d[y * W + x];
}

// value of hitting t for `dmg` (+extra) at `hit`% from side
function hitValue(A, t, dmg, extra, hit, side) {
  const total = dmg + extra;
  const exp = (total * hit) / 100;
  const kill = total >= t.hp ? A.wKill * (hit / 100) : 0;
  const flank = side === 'back' ? A.wFlankBack : side === 'side' ? A.wFlankSide : 0;
  return A.wDamage * exp + kill + flank;
}

// ability-specific bonus (positioning value), evaluated with u standing on `tile`
function abilityBonus(s, u, id, t, pv, tile) {
  const A = CONFIG.ai;
  const allies = alive(s).filter((a) => a.team === u.team && a !== u);
  const foes = alive(s).filter((f) => f.team !== u.team);
  switch (id) {
    case 'shieldWall': {
      if (dangerAt(s, u, tile.x, tile.y) <= 0) return -Infinity;
      return A.wWallBase + A.wWallPerAlly * pv.covered.length;
    }
    case 'brace': {
      const near = foes.some((f) => manhattan(f, tile) <= effMove(f) + 2);
      return near ? A.wBrace : -Infinity;
    }
    case 'shieldBash': case 'hook': {
      if (!pv.dest) return 0;
      const nextToUs = allies.some((a) => manhattan(a, pv.dest) === 1);
      return nextToUs ? A.wPullIntoFlank : 0;
    }
    case 'pinningShot': return A.wPin * (t.move / 2);
    case 'plungingShot': { // price the Exposed trade-off: extra damage foes could deal to us here
      const ex = { ...u, status: { ...u.status, exposed: { def: CONFIG.abilities.plungingShot.exposedDefPenalty } } };
      return -A.wExposed - A.wDanger * (dangerAt(s, ex, tile.x, tile.y) - dangerAt(s, u, tile.x, tile.y)) * 2;
    }
    case 'feint': {
      let b = 0;
      const turned = { ...t, facing: facingTo(t.x, t.y, tile.x, tile.y, t.facing) };
      for (const a of allies) {
        if (manhattan(a, t) > effMove(a) + CONFIG.roles[a.role].maxRange) continue;
        const sd = hitSide(a, turned);
        b += sd === 'back' ? A.wFeintBack : sd === 'side' ? A.wFeintSide : 0;
      }
      return b;
    }
    case 'vaultStrike': return -CONFIG.ai.wDanger * dangerAt(s, u, pv.dest.x, pv.dest.y) * 0.5;
  }
  return 0;
}

// opts.fixed: only consider the unit's current tile (used after a move got stopped by a Brace)
export function planTurn(s, u, opts = {}) {
  const A = CONFIG.ai;
  const { tiles, pathTo } = opts.fixed ? { tiles: [{ x: u.x, y: u.y }], pathTo: () => [{ x: u.x, y: u.y }] } : reachable(s, u);
  const foes = alive(s).filter((f) => f.team !== u.team);
  const abil = abilitiesOf(u).filter((a) => abilityReady(s, u, a.id));
  const prevAb = s.active === u ? u.prevAbility : u.lastAbility; // this unit's ability on its previous turn
  const mayAct = s.active === u ? canAct(s) : !skittishAt(s, u); // Wren's Skittish: no action this turn
  let best = null;
  const P = (A.personalities || {})[u.aiStyle] || { danger: 1, approach: 1 }; // AI personality
  const friends = P.rally ? alive(s).filter((f) => f.team === u.team && f !== u && !f.npc) : [];
  const npcMul = (CONFIG.difficulty && CONFIG.difficulty.npcTargetMul) ?? 1; // raiders' interest in the recruit-mission stranger
  // opts.noise (sim only): random jitter on every option, a stand-in for a human's imperfect choices
  const jit = opts.noise ? () => opts.noise * (2 * (opts.rng || Math.random)() - 1) : () => 0;
  const offer = (score, tile, action) => { score += jit(); if (!best || score > best.score) best = { score, tile, action }; };
  const walk = foes.length ? approachField(s, u, foes) : () => 0;
  for (const tile of tiles) {
    let baseScore = A.wHeight * heightAt(s, tile.x, tile.y) - A.wDanger * P.danger * dangerAt(s, u, tile.x, tile.y);
    if (!opts.fixed && braceIntercept(s, u, pathTo(tile.x, tile.y))) baseScore -= A.wAvoidBrace;
    const nearest = Math.min(...foes.map((f) => manhattan(tile, f)));
    const wd = walk(tile.x, tile.y); // approach distance: walking cost to an attack tile (+1 ≈ the old 'adjacent = 1')
    const far = wd === Infinity ? nearest + 20 : wd + 1;
    if (P.rally && friends.length) baseScore -= P.rally * Math.min(...friends.map((f) => manhattan(tile, f))); // stay near the squad
    let spacing = 0;
    if (u.role === 'archer' && nearest < A.archerKeepDistance) spacing = -A.wArcherSpacing * (A.archerKeepDistance - nearest);
    // ghost u on the tile so geometry (facing, flankers, cover) is evaluated from there
    const ox = u.x, oy = u.y; u.x = tile.x; u.y = tile.y;
    let bestAttack = -Infinity;
    for (const t of mayAct ? targetsFrom(s, u, tile.x, tile.y) : []) {
      const p = preview(s, u, t, tile.x, tile.y);
      const v = hitValue(A, t, p.dmg, 0, p.hit, p.side) * (t.npc ? npcMul : 1);
      bestAttack = Math.max(bestAttack, v);
      offer((t.npc ? 100 * npcMul : 100) + v + baseScore + spacing, tile, { type: 'attack', target: t });
    }
    for (const ab of mayAct ? abil : []) {
      if (ab.noMoveBefore && (tile.x !== ox || tile.y !== oy)) continue; // planted: can't walk to the shot
      for (const t of abilityTargets(s, u, ab.id, tile.x, tile.y)) {
        const pv = abilityPreview(s, u, ab.id, t, tile.x, tile.y);
        const bonus = abilityBonus(s, u, ab.id, t, pv, tile);
        if (bonus === -Infinity) continue;
        const rep = ab.id === prevAb ? A.wRepeatAbility || 0 : 0; // no cooldowns: don't spam one ability every turn
        const v = (ab.kind === 'self' ? bonus * (P.stance ?? 1) : hitValue(A, t, pv.dmg, pv.extra || 0, pv.hit, pv.side) * (t.npc ? npcMul : 1) + bonus) - rep;
        if (ab.kind !== 'self' && bestAttack > -Infinity && v < bestAttack + A.abilityMinGain) continue;
        // stances don't hit anything: they compete with repositioning, not with attacks
        const head = ab.kind === 'self' ? -A.wApproach * P.approach * far : t.npc ? 100 * npcMul : 100;
        offer(head + v + baseScore + spacing, tile, { type: 'ability', id: ab.id, target: t });
      }
    }
    u.x = ox; u.y = oy;
    // option: just reposition toward foes
    offer(-A.wApproach * P.approach * far + baseScore + spacing, tile, null);
  }
  if (!best) return { tile: { x: u.x, y: u.y }, path: [{ x: u.x, y: u.y }], action: null, target: null };
  const a = best.action;
  return { tile: best.tile, path: pathTo(best.tile.x, best.tile.y), action: a, target: a && a.type === 'attack' ? a.target : null };
}

// Turncoat's Eye (Yusuf): what each foe within range of him would strike if it acted now.
// Returns [{ from: unit, to: unit }]. Only for living observers with the trait.
export function intents(s, team = 'player') {
  const eyes = alive(s).filter((u) => u.team === team && u.trait === 'turncoatsEye');
  if (!eyes.length) return [];
  const R = CONFIG.party.traits.turncoatsEye.intentRange, out = [];
  const far = (f) => f.captain && CONFIG.campaign && CONFIG.campaign.finale.captainIntentAnywhere; // finale: Yusuf reads the Captain anywhere
  for (const e of alive(s).filter((f) => f.team !== team && (far(f) || eyes.some((y) => manhattan(y, f) <= R)))) {
    const p = planTurn(s, e);
    const a = p.action;
    if (a && a.target && a.target !== e && a.target.team !== e.team) out.push({ from: e, to: a.target, id: a.type === 'ability' ? a.id : 'attack' });
  }
  return out;
}

export { canAttackFrom, faceNearestFoe, braceZone, unitAt };
