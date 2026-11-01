// AI-vs-AI balance sim: both sides use the enemy AI (incl. abilities). node tools/sim.mjs [N] [map]   (MAP=all for every map)
import * as G from '../src/game.js';
import { planTurn } from '../src/ai.js';
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
import { CONFIG } from '../src/config.js';
import { MAPS } from '../src/maps.js';
import { rollStats } from '../src/hero.js';
// HERO=avg|great|poor|roll [HERO_ROLE=knight|sergeant|archer|skirmisher]: put a created hero in the squad
// avg = 3d6 average (10/11s), roll = a fresh 3d6 roll per battle, great/poor = strong/weak redistributed rolls
const HERO = process.env.HERO, HERO_ROLE = process.env.HERO_ROLE || 'knight';
const PRESET = { avg: { mgt: 11, end: 10, fort: 11, agi: 10, aim: 11, res: 10 },
  great: { mgt: 18, end: 17, fort: 14, agi: 13, aim: 12, res: 9 }, poor: { mgt: 9, end: 9, fort: 8, agi: 8, aim: 9, res: 9 } };
const heroFor = (i) => !HERO ? null : { name: 'Hero', role: HERO_ROLE, portrait: 0,
  stats: HERO === 'roll' ? rollStats(HERO_ROLE, mulberry32(10007 * (i + 1))) : PRESET[HERO] };
const N = Number(process.argv[2] || 2000);
// OFF=shieldWall,brace  -> remove abilities (ablation); OFF=all -> no abilities at all
const OFF = (process.env.OFF || '').split(',').filter(Boolean);
CONFIG.teams.player.disabledAbilities = (process.env.OFF_P || '').split(',');
CONFIG.teams.enemy.disabledAbilities = (process.env.OFF_E || '').split(',');
for (const r of Object.values(CONFIG.roles)) r.abilities = (r.abilities || []).filter((a) => !OFF.includes(a) && !OFF.includes('all'));
function run(mapId) {
let w = 0, l = 0, turns = 0; const used = {};
for (let i = 0; i < N; i++) {
  const s = G.createState(mulberry32(i + 1), mapId, heroFor(i));
  for (let t = 0; t < 300 && !s.over; t++) {
    const u = G.startNextTurn(s);
    let p = planTurn(s, u);
    if (p.path && p.path.length > 1) {
      const ic = G.braceIntercept(s, u, p.path);
      const path = ic ? p.path.slice(0, ic.index + 1) : p.path;
      const end = path[path.length - 1];
      G.moveUnit(s, u, end.x, end.y, path);
      if (ic) { G.braceStrike(s, ic.by, u); used.braceTrigger = (used.braceTrigger || 0) + 1; if (s.over || u.hp <= 0) { if (!s.over) G.endTurn(s); continue; } p = planTurn(s, u, { fixed: true }); }
    }
    const a = p.action;
    if (a && a.type === 'attack' && G.canAttackFrom(s, u, u.x, u.y, a.target.x, a.target.y)) G.resolveAttack(s, u, a.target);
    if (a && a.type === 'ability' && G.abilityCanTarget(s, u, a.id, a.target)) { G.useAbility(s, u, a.id, a.target); used[`${u.team[0]}:${a.id}`] = (used[`${u.team[0]}:${a.id}`] || 0) + 1; }
    if (!s.over) { G.faceNearestFoe(s, u); G.endTurn(s); }
    turns++;
  }
  if (s.over === 'victory') w++; else if (s.over === 'defeat') l++;
}
console.log(`[${mapId}${HERO ? ` hero ${HERO} ${HERO_ROLE}` : ''}] player (Templar) win rate ${(w / N).toFixed(3)} · loss ${(l / N).toFixed(3)} · stalled ${((N - w - l) / N).toFixed(3)} · avg turns ${(turns / N).toFixed(1)} · N ${N}`);
console.log('ability uses per battle:', Object.fromEntries(Object.entries(used).sort().map(([k, v]) => [k, +(v / N).toFixed(2)])));
}
const arg = process.argv[3] || process.env.MAP || CONFIG.defaultMap;
for (const id of arg === 'all' ? MAPS.map((m) => m.id) : [arg]) run(id);
