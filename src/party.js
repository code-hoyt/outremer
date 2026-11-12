// Outremer — party: recruited companions, mission progress, and fielding a squad.
// No DOM at import time except localStorage access inside functions (tools/sim.mjs imports this).
import { CONFIG } from './config.js?v=0.14.1';
import { applyHero } from './hero.js?v=0.14.1';
import { MISSIONS } from './missions.js?v=0.14.1';

const P = () => CONFIG.party;
export const companionDef = (id) => P().companions[id] || null;
export const traitDef = (id) => P().traits[id] || null;

// progress (v0.11 adds the campaign's story flags; full HP every battle, nothing else carries over):
// { companions: { id: { status: 'joined'|'declined'|'missed', active } },
//   done: { missionId: 'recruited'|'declined'|'missed'|'won' (finale)|n skirmish wins },
//   order: [missionId...] recruit missions + finale in the order they were won,
//   losses: n battles lost (any kind), finale: null|'started'|'won' }
export const emptyParty = () => ({ companions: {}, done: {}, order: [], losses: 0, finale: null });
const STATUSES = ['joined', 'declined', 'missed'];
export function loadParty() {
  try {
    const p = JSON.parse(localStorage.getItem(P().storageKey));
    if (!p || typeof p !== 'object') return emptyParty();
    const out = emptyParty();
    for (const [id, c] of Object.entries(p.companions || {})) if (companionDef(id) && c && STATUSES.includes(c.status)) out.companions[id] = { status: c.status, active: !!c.active && c.status === 'joined' };
    for (const [id, v] of Object.entries(p.done || {})) if (typeof v === 'string' || Number.isFinite(v)) out.done[id] = v;
    if (Array.isArray(p.order)) out.order = p.order.filter((id) => typeof id === 'string');
    if (Number.isFinite(p.losses)) out.losses = p.losses;
    if (p.finale === 'started' || p.finale === 'won') out.finale = p.finale;
    return out;
  } catch (_) { return emptyParty(); }
}
export function saveParty(p) { try { localStorage.setItem(P().storageKey, JSON.stringify(p)); } catch (_) { /* private mode */ } }
export function clearParty() { try { localStorage.removeItem(P().storageKey); } catch (_) { /* */ } }

// ---------------------------------------------------------------- campaign (Option B: open board, finale after N wins)
const CAMP = () => CONFIG.campaign;
const recruitMissions = () => MISSIONS.filter((m) => m.kind === 'recruit');
// recruit missions won (the companion accepted or declined; 'missed' = closed unplayed)
export const recruitWins = (p) => recruitMissions().filter((m) => p.done[m.id] === 'recruited' || p.done[m.id] === 'declined').length;
export const finaleUnlocked = (p) => recruitWins(p) >= CAMP().finaleAfterWins;
export const finaleDone = (p) => p.finale === 'won';
// the recruit missions still open (not won, not closed)
export const openRecruits = (p) => recruitMissions().filter((m) => !p.done[m.id]);
// clues collected = recruit missions won (their clue lines feed the other briefs and the finale)
export const clues = (p) => recruitMissions().filter((m) => p.done[m.id] === 'recruited' || p.done[m.id] === 'declined').map((m) => m.id);
// Begin on the finale: closes the leftover recruit mission(s); their companion is missed
export function startFinale(p) {
  if (CAMP().closeLeftoverOnFinale) for (const m of openRecruits(p)) { p.done[m.id] = 'missed'; p.companions[m.companion] = { status: 'missed', active: false }; }
  if (!p.finale) p.finale = 'started';
  return p;
}
// companions not in your company (missed or declined): the finale's "missed" effects
export const notJoined = (p) => recruitMissions().map((m) => m.companion).filter((id) => p.companions[id] && p.companions[id].status !== 'joined');
export function recordWin(p, missionId) { if (!p.order.includes(missionId)) p.order.push(missionId); return p; }
export function recordLoss(p) { p.losses = (p.losses || 0) + 1; return p; }

// Chronicle: one entry per finished run, kept on the device (survives rolling a new hero)
export function loadChronicle() {
  try { const c = JSON.parse(localStorage.getItem(CAMP().chronicleKey)); return Array.isArray(c) ? c : []; } catch (_) { return []; }
}
export function addChronicle(entry) {
  const c = [entry, ...loadChronicle()].slice(0, CAMP().chronicleMax);
  try { localStorage.setItem(CAMP().chronicleKey, JSON.stringify(c)); } catch (_) { /* private mode */ }
  return c;
}

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
  u.companion = id; u.trait = c.trait; u.templar = !!c.templar; u.portraitImg = c.portrait; if (id === 'renaud' && typeof location !== 'undefined' && /[?&]art=test\b/.test(location.search)) u.portraitImg = 'assets/art-test/renaud-portrait-96x128.png';
  if (t && t.moveBonus) u.move += t.moveBonus;
  if (npc) { u.npc = true; u.mustSurvive = true; }
  return u;
}
