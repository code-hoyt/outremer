// Simple scoring AI: evaluate every reachable tile × every attackable target, pick the best.
import { CONFIG } from './config.js';
import { reachable, targetsFrom, preview, heightAt, alive, canAttackFrom, faceNearestFoe } from './game.js';

const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Rough threat: how much damage foes could deal to a unit standing on (x,y) next turn.
function dangerAt(s, u, x, y) {
  let total = 0;
  const ghost = { ...u, x, y };
  for (const f of alive(s)) {
    if (f.team === u.team) continue;
    const r = CONFIG.roles[f.role];
    // can f reach an attack position? approximate: distance minus range within move
    if (manhattan(f, ghost) <= f.move + r.maxRange) total += preview(s, f, ghost, f.x, f.y).dmg;
  }
  return total;
}

export function planTurn(s, u) {
  const A = CONFIG.ai;
  const { tiles, pathTo } = reachable(s, u);
  const foes = alive(s).filter((f) => f.team !== u.team);
  let best = null;
  for (const tile of tiles) {
    const baseScore = A.wHeight * heightAt(s, tile.x, tile.y) - A.wDanger * dangerAt(s, u, tile.x, tile.y);
    const nearest = Math.min(...foes.map((f) => manhattan(tile, f)));
    let spacing = 0;
    if (u.role === 'archer' && nearest < A.archerKeepDistance) spacing = -A.wArcherSpacing * (A.archerKeepDistance - nearest);
    // option A: attack from here
    for (const t of targetsFrom(s, u, tile.x, tile.y)) {
      const p = preview(s, u, t, tile.x, tile.y);
      const exp = (p.dmg * p.hit) / 100;
      const kill = p.dmg >= t.hp ? A.wKill * (p.hit / 100) : 0;
      const flank = p.side === 'back' ? A.wFlankBack : p.side === 'side' ? A.wFlankSide : 0;
      const score = 100 + A.wDamage * exp + kill + flank + baseScore + spacing;
      if (!best || score > best.score) best = { score, tile, target: t };
    }
    // option B: just reposition toward foes
    const score = -A.wApproach * nearest + baseScore + spacing;
    if (!best || score > best.score) best = { score, tile, target: null };
  }
  if (!best) return { tile: { x: u.x, y: u.y }, path: [{ x: u.x, y: u.y }], target: null };
  return { tile: best.tile, path: pathTo(best.tile.x, best.tile.y), target: best.target };
}

export { canAttackFrom, faceNearestFoe };
