// Simple scoring AI: evaluate every reachable tile × (attack | each ready ability) × target, pick the best.
import { CONFIG } from './config.js';
import {
  reachable, targetsFrom, preview, heightAt, alive, canAttackFrom, faceNearestFoe, effMove, hitSide, facingTo,
  abilitiesOf, abilityReady, abilityTargets, abilityPreview, braceIntercept, braceZone, unitAt,
} from './game.js';

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
  const abil = abilitiesOf(u).filter((a) => abilityReady(u, a.id));
  let best = null;
  const offer = (score, tile, action) => { if (!best || score > best.score) best = { score, tile, action }; };
  for (const tile of tiles) {
    let baseScore = A.wHeight * heightAt(s, tile.x, tile.y) - A.wDanger * dangerAt(s, u, tile.x, tile.y);
    if (!opts.fixed && braceIntercept(s, u, pathTo(tile.x, tile.y))) baseScore -= A.wAvoidBrace;
    const nearest = Math.min(...foes.map((f) => manhattan(tile, f)));
    let spacing = 0;
    if (u.role === 'archer' && nearest < A.archerKeepDistance) spacing = -A.wArcherSpacing * (A.archerKeepDistance - nearest);
    // ghost u on the tile so geometry (facing, flankers, cover) is evaluated from there
    const ox = u.x, oy = u.y; u.x = tile.x; u.y = tile.y;
    let bestAttack = -Infinity;
    for (const t of targetsFrom(s, u, tile.x, tile.y)) {
      const p = preview(s, u, t, tile.x, tile.y);
      const v = hitValue(A, t, p.dmg, 0, p.hit, p.side);
      bestAttack = Math.max(bestAttack, v);
      offer(100 + v + baseScore + spacing, tile, { type: 'attack', target: t });
    }
    for (const ab of abil) {
      for (const t of abilityTargets(s, u, ab.id, tile.x, tile.y)) {
        const pv = abilityPreview(s, u, ab.id, t, tile.x, tile.y);
        const bonus = abilityBonus(s, u, ab.id, t, pv, tile);
        if (bonus === -Infinity) continue;
        const v = ab.kind === 'self' ? bonus : hitValue(A, t, pv.dmg, pv.extra || 0, pv.hit, pv.side) + bonus;
        if (ab.kind !== 'self' && bestAttack > -Infinity && v < bestAttack + A.abilityMinGain) continue;
        // stances don't hit anything: they compete with repositioning, not with attacks
        const head = ab.kind === 'self' ? -A.wApproach * nearest : 100;
        offer(head + v + baseScore + spacing, tile, { type: 'ability', id: ab.id, target: t });
      }
    }
    u.x = ox; u.y = oy;
    // option: just reposition toward foes
    offer(-A.wApproach * nearest + baseScore + spacing, tile, null);
  }
  if (!best) return { tile: { x: u.x, y: u.y }, path: [{ x: u.x, y: u.y }], action: null, target: null };
  const a = best.action;
  return { tile: best.tile, path: pathTo(best.tile.x, best.tile.y), action: a, target: a && a.type === 'attack' ? a.target : null };
}

export { canAttackFrom, faceNearestFoe, braceZone, unitAt };
