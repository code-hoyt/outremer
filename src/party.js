// Outremer — party: recruited companions, mission progress, and fielding a squad.
// No DOM at import time except localStorage access inside functions (tools/sim.mjs imports this).
import { CONFIG } from './config.js';
import { applyHero } from './hero.js';

const P = () => CONFIG.party;
export const companionDef = (id) => P().companions[id] || null;
export const traitDef = (id) => P().traits[id] || null;

// progress: { companions: { id: { status: 'joined'|'declined', active } }, done: { missionId: 'recruited'|'declined'|n wins } }
export const emptyParty = () => ({ companions: {}, done: {} });
export function loadParty() {
  try {
    const p = JSON.parse(localStorage.getItem(P().storageKey));
    if (!p || typeof p !== 'object') return emptyParty();
    const out = emptyParty();
    for (const [id, c] of Object.entries(p.companions || {})) if (companionDef(id) && c && (c.status === 'joined' || c.status === 'declined')) out.companions[id] = { status: c.status, active: !!c.active && c.status === 'joined' };
    for (const [id, v] of Object.entries(p.done || {})) if (typeof v === 'string' || Number.isFinite(v)) out.done[id] = v;
    return out;
  } catch (_) { return emptyParty(); }
}
export function saveParty(p) { try { localStorage.setItem(P().storageKey, JSON.stringify(p)); } catch (_) { /* private mode */ } }
export function clearParty() { try { localStorage.removeItem(P().storageKey); } catch (_) { /* */ } }

export const joined = (p) => Object.keys(p.companions).filter((id) => p.companions[id].status === 'joined');
export const activeCompanions = (p) => joined(p).filter((id) => p.companions[id].active).slice(0, P().maxCompanions);

// Accept / Decline after a recruit mission. A new recruit goes straight into the squad if there's room.
export function recruit(p, missionId, compId, accept) {
  p.done[missionId] = accept ? 'recruited' : 'declined';
  if (accept) p.companions[compId] = { status: 'joined', active: activeCompanions(p).length < P().maxCompanions };
  else p.companions[compId] = { status: 'declined', active: false };
  return p;
}
// Tap a companion on the board: bench / field. Fielding when full benches the earliest-fielded one.
export function toggleActive(p, id) {
  const c = p.companions[id];
  if (!c || c.status !== 'joined') return p;
  if (c.active) { c.active = false; return p; }
  const act = activeCompanions(p);
  if (act.length >= P().maxCompanions) p.companions[act[0]].active = false;
  c.active = true;
  return p;
}

// Turn a unit made by createState into a companion (keeps its slot: position + facing).
export function applyCompanion(u, id, { npc = false } = {}) {
  const c = companionDef(id), t = traitDef(c.trait);
  applyHero(u, { name: c.name, role: c.role, portrait: 0, stats: c.stats });
  delete u.hero;
  u.companion = id; u.trait = c.trait; u.templar = !!c.templar; u.portraitImg = c.portrait;
  if (t && t.moveBonus) u.move += t.moveBonus;
  if (npc) { u.npc = true; u.mustSurvive = true; }
  return u;
}
