// Outremer prototype — rendering, input, and turn flow.
import { CONFIG } from './config.js';
import * as G from './game.js';
import { planTurn, intents } from './ai.js';
import { MAPS, resolveMap, skirmishMaps } from './maps.js';
import { MISSIONS, missionById } from './missions.js';
import { loadParty, saveParty, clearParty, emptyParty, activeCompanions, joined, recruit, toggleActive, companionDef, traitDef,
  recruitWins, finaleUnlocked, startFinale, notJoined, recordWin, recordLoss, loadChronicle, addChronicle, openRecruits } from './party.js';
import { loadHero, saveHero, portraitSvg } from './hero.js';
import { openCreator, creatorOpen, creatorKey, creatorState } from './create.js';
import { onTap } from './tap.js';

const V = CONFIG.view, P = CONFIG.palette;
const $ = (id) => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d');

// ---------------------------------------------------------------- seeded RNG (?seed=N for tests)
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const params = new URLSearchParams(location.search);
const seedParam = params.get('seed');
const makeRng = () => (seedParam ? mulberry32(Number(seedParam)) : Math.random);
// ?map=<id|number> starts that map directly; otherwise the title screen offers a map picker
const mapParam = resolveMap(params.get('map'));
const missionParam = missionById(params.get('mission')); // ?mission=<id> starts that mission directly (tests)
const MAP_KEY = 'outremer.map';
const lastMap = () => { try { return resolveMap(localStorage.getItem(MAP_KEY)); } catch (_) { return null; } };

// ---------------------------------------------------------------- state
let S, ui, anims, floats, layout;
let intentCache = null; // Turncoat's Eye: { key, list }
let mapId = (mapParam || lastMap() || resolveMap(CONFIG.defaultMap) || MAPS[0]).id;
let playedBefore = !!lastMap(); // first visit → the title preselects "Create your hero"
let hero = loadHero(); // the created main character (localStorage), or null = default squad
let party = loadParty(); // recruited companions + mission progress (localStorage, src/party.js)
let mission = null; // the mission being fought (src/missions.js), or null = a plain map battle
let picker = null; // { kind: 'title'|'missions'|'brief'|'recruit'|'end', items: [{ label, sub, act }], index } while the overlay menu is up
function reset(id = mapId, { start = true, mission: m = null } = {}) {
  mission = m;
  if (m) id = m.map;
  mapId = id;
  try { if (!resolveMap(id).missionOnly) localStorage.setItem(MAP_KEY, id); } catch (_) { /* private mode */ }
  // campaign: the difficulty step counts recruit missions already won; the finale knows who you don't have
  const camp = hero && m && m.kind !== 'skirmish' ? { wins: recruitWins(party), missed: m.kind === 'finale' ? notJoined(party) : [] } : {};
  S = G.createState(makeRng(), id, hero, { companions: hero ? activeCompanions(party) : [], mission: m, ...camp });
  intentCache = null;
  ui = { mode: 'busy', cursor: { x: 0, y: 0 }, menu: null, menuIndex: 0, moveInfo: null, target: null, rangeOf: null, lastTap: null, ability: null };
  anims = new Map(); floats = [];
  $('title').querySelector('span').textContent = m && m.kind !== 'skirmish' ? m.title : S.mapName;
  if (layout) resize();
  if (!start) { updatePanel(); return; }
  playedBefore = true;
  closePicker();
  nextTurn();
}

// ---------------------------------------------------------------- map picker (title + Victory/Defeat overlay)
// Same flow as the command menu: d-pad/keys up/down move the highlight, A picks, taps pick directly.
const mapLabel = (m, i) => `${i + 1} · ${m.name}`;
const heroLine = () => `<span class="hero-line"><span class="hero-por">${portraitSvg(hero.portrait)}</span>${esc(hero.name)} · ${CONFIG.creation.classLabel[hero.role]}</span>`;
const compImg = (id, cls = '') => `<img class="comp-img ${cls}" src="${companionDef(id).portrait}" alt="">`;
// the squad strip on the mission board: hero + recruited companions (tap a companion: field / bench)
function partyStrip() {
  const act = activeCompanions(party);
  const comps = joined(party).map((id) => `<button class="comp ${act.includes(id) ? 'on' : 'off'}" data-comp="${id}" title="${esc(companionDef(id).name)}">${compImg(id)}<small>${esc(companionDef(id).short)}</small></button>`).join('');
  return `<span class="party"><span class="comp on hero-chip"><span class="hero-por">${portraitSvg(hero.portrait)}</span><small>${esc(hero.name)}</small></span>${comps}</span>`
    + `<span class="party-note">${joined(party).length ? `Squad: hero + ${act.length}/${CONFIG.party.maxCompanions} companions · tap to field / rest` : 'Win recruit missions to grow your company.'}</span>`;
}
function missionItem(m) {
  if (m.kind === 'skirmish') {
    const map = resolveMap(m.map), wins = party.done[m.id] || 0;
    return { id: 'm-' + m.id, label: m.title, sub: `${map.blurb}${wins ? ` · ✓ won ×${wins}` : ''}`, act: () => confirmStart({ title: m.title, line: map.blurb, go: () => reset(m.map, { mission: m }), back: () => openPicker('missions', m) }) };
  }
  if (m.kind === 'finale') {
    if (party.finale === 'won') return { id: 'm-' + m.id, cls: 'done', label: `✓ ${m.title}`, sub: 'Done · the Red Captain fell', act: () => {} };
    const need = CONFIG.campaign.finaleAfterWins - recruitWins(party);
    if (need > 0) return { id: 'm-' + m.id, cls: 'locked', label: `🔒 ${m.title}`, sub: `Win ${need} more recruit mission${need > 1 ? 's' : ''} to unlock`, act: () => {} };
    return { id: 'm-' + m.id, cls: 'new finale', label: `★ ${m.title}`, sub: m.sub, act: () => openPicker('brief', m) };
  }
  const done = party.done[m.id];
  if (done) {
    const c = companionDef(m.companion);
    const sub = done === 'missed' ? `Closed · ${esc(c.name)} was missed` : `${done === 'recruited' ? `Done · ${esc(c.name)} joined` : `Done · ${esc(c.name)} declined`}<br>Clue: ${esc(m.clue)}`;
    return { id: 'm-' + m.id, cls: 'done', label: `${done === 'missed' ? '✗' : '✓'} ${m.title}`, sub, act: () => {} };
  }
  return { id: 'm-' + m.id, cls: 'new', label: m.title, sub: m.sub, act: () => openPicker('brief', m) };
}
function openPicker(kind, arg = null) {
  const cur = MAPS.findIndex((m) => m.id === mapId);
  let items, index = 0;
  const title = (t) => { $('ov-title').textContent = t; };
  $('overlay').className = 'kind-' + kind;
  if (kind === 'title') {
    title('OUTREMER');
    if (hero) {
      items = [{ id: 'mission-board', label: 'Mission board', sub: 'Take a mission · recruit companions · skirmish', act: () => openPicker('missions') },
        { id: 'new-hero', label: 'New hero', sub: `Roll a new main character (replaces ${esc(hero.name)} and starts a new company)`, act: startCreator }];
      const chr = loadChronicle();
      if (chr.length) items.push({ id: 'chronicle', label: 'Chronicle', sub: `Last run: ${esc(chr[0].hero.name)} · ${chr.length} on this device`, act: () => openPicker('chronicle', { ...chr[0], fromTitle: true }) });
      $('ov-text').innerHTML = heroLine() + (joined(party).length ? `<br>Company: ${joined(party).map((id) => esc(companionDef(id).name)).join(', ')}` : '');
    } else {
      const maps = skirmishMaps();
      items = maps.map((m, i) => ({ id: 'map-' + m.id, label: mapLabel(m, i), sub: m.blurb, act: () => confirmStart({ title: m.name, line: m.blurb, go: () => reset(m.id), back: () => { openPicker('title'); picker.index = i + 1; syncPicker(); } }) }));
      items.unshift({ id: 'create-hero', label: 'Create your hero', sub: 'Portrait, class, stats, name — then take missions', act: startCreator });
      $('ov-text').innerHTML = 'Make your hero, or fight with the default squad';
      index = playedBefore ? Math.max(0, maps.findIndex((m) => m.id === mapId)) + 1 : 0; // first visit: "Create your hero"
    }
  } else if (kind === 'missions') {
    // FFTA2-style quest board: vague titles; the brief shows who you're going to save
    if (S.over || (mission && mission.kind !== 'skirmish')) reset(skirmishMaps().some((m) => m.id === mapId) ? mapId : CONFIG.defaultMap, { start: false }); // idle current squad behind the board
    title('MISSION BOARD');
    items = MISSIONS.map(missionItem);
    items.push({ id: 'back-title', label: '◀ Back', act: () => openPicker('title') });
    $('ov-text').innerHTML = partyStrip();
    index = Math.max(0, items.findIndex((it) => it.cls === 'new'));
    if (arg && arg.id) index = Math.max(0, MISSIONS.findIndex((m) => m.id === arg.id));
  } else if (kind === 'brief' && arg.kind === 'finale') {
    const m = arg, act = activeCompanions(party), miss = notJoined(party).concat(openRecruits(party).map((r) => r.companion));
    title(m.title.toUpperCase());
    const won = MISSIONS.filter((r) => r.kind === 'recruit' && (party.done[r.id] === 'recruited' || party.done[r.id] === 'declined'));
    const li = (t, cls = '') => `<li class="${cls}">${esc(t)}</li>`;
    const leftover = openRecruits(party);
    $('ov-text').innerHTML = `<span class="brief finale-brief"><span>${esc(m.intro)}<ul class="clues">${won.map((r) => li(r.clue, 'clue')).join('')}`
      + `${act.map((c) => li(m.fielded[c], 'pay')).join('')}${miss.filter((c, i) => miss.indexOf(c) === i).map((c) => li(m.missed[c], 'miss')).join('')}</ul></span></span>`
      + `<span class="party-note">Defeat the Red Captain (red ring), or every raider. ${leftover.length ? `Beginning closes ${leftover.map((r) => esc(r.title)).join(', ')}: ${leftover.map((r) => esc(companionDef(r.companion).short)).join(', ')} will be missed.` : ''}</span>`;
    items = [{ id: 'begin', label: 'Begin', sub: `${resolveMap(m.map).name}${leftover.length ? ' · closes the last mission' : ''}`, act: () => confirmStart({ title: m.title, line: esc(m.sub), warn: leftover.length ? `This closes ${leftover.map((r) => esc(r.title)).join(', ')}: ${leftover.map((r) => esc(companionDef(r.companion).short)).join(', ')} will be missed.` : '', go: () => { startFinale(party); saveParty(party); reset(m.map, { mission: m }); }, back: () => openPicker('brief', m) }) },
      { id: 'back-board', label: 'Back', act: () => openPicker('missions', m) }];
  } else if (kind === 'brief') {
    const m = arg;
    title(m.title.toUpperCase());
    const c = companionDef(m.companion);
    $('ov-text').innerHTML = `<span class="brief"><span class="comp-por">${compImg(m.companion)}</span><span><b class="who">${esc(c.name)}</b> <small>${esc(CONFIG.creation.classLabel[c.role])}</small><br>${esc(m.intro)}${Object.entries(m.clueLines || {}).filter(([id]) => party.done[id] === 'recruited' || party.done[id] === 'declined').map(([, t]) => `<br><i class="clue">${esc(t)}</i>`).join('')}</span></span>`
      + `<span class="party-note">Win the battle. ${esc(c.short)} (green ring) fights on their own and must survive.</span>`;
    items = [{ id: 'begin', label: 'Begin', sub: resolveMap(m.map).name, act: () => confirmStart({ title: m.title, line: `${esc(c.name)} · ${resolveMap(m.map).name}`, go: () => reset(m.map, { mission: m }), back: () => openPicker('brief', m) }) },
      { id: 'back-board', label: 'Back', act: () => openPicker('missions', m) }];
  } else if (kind === 'confirm') {
    // v0.12: every battle start asks first. Input-agnostic (tap, ▲▼ + A/B, Enter/Escape, later a controller).
    // Yes is highlighted, but taking it needs a fresh press after confirmDebounceMs; No and B go back.
    title('BEGIN MISSION?');
    $('ov-text').innerHTML = `<span class="confirm"><b>${esc(arg.title)}</b>${arg.line ? `<br><small>${arg.line}</small>` : ''}${arg.warn ? `<span class="warn">⚠ ${arg.warn}</span>` : ''}</span>`;
    items = [{ id: 'confirm-yes', cls: 'primary', label: 'Yes, begin', act: arg.go }, { id: 'confirm-no', label: 'No', sub: 'Back', act: arg.back }];
  } else if (kind === 'recruit') {
    // their join offer, then you choose. Declining is final for now (DESIGN open question).
    const m = mission, c = companionDef(m.companion), t = traitDef(c.trait);
    title(c.name.toUpperCase());
    $('ov-text').innerHTML = `<span class="brief"><span class="comp-por">${compImg(m.companion)}</span><span>${esc(m.outro)}</span></span>`
      + `<span class="trait"><b>${esc(CONFIG.creation.classLabel[c.role])} · ${esc(t.name)}</b><br>＋ ${esc(t.pro)}<br>－ ${esc(t.con)}</span>`;
    const decide = (yes) => () => { recruit(party, m.id, m.companion, yes); saveParty(party); openPicker('missions', m); };
    items = [{ id: 'accept', label: `Accept`, sub: `${esc(c.name)} joins your company`, act: decide(true) },
      { id: 'decline', label: 'Decline', sub: 'Part ways. The mission stays done.', act: decide(false) }];
  } else if (kind === 'ending') {
    // the finale won: one ending card (the reliquary stays a mystery; a hint if Wren was there)
    const m = mission, act = arg.squad;
    title('THE RELIQUARY');
    $('ov-text').innerHTML = `<span class="ending">${esc(m.ending)}${act.includes('wren') ? `<br><i>${esc(m.endingWren)}</i>` : ''}</span>`
      + `<span class="ending-lines">${act.map((c) => `<span class="brief"><span class="comp-por">${compImg(c)}</span><span>${esc(m.endLines[c])}</span></span>`).join('')}</span>`;
    items = [{ id: 'to-chronicle', label: 'Chronicle', sub: 'How this company\'s story went', act: () => openPicker('chronicle', arg) }];
  } else if (kind === 'chronicle') {
    // this run (saved on the device), then: roll a new hero, or keep this one on the board (skirmishes)
    const e = arg, all = loadChronicle();
    title('CHRONICLE');
    const st = { joined: 'joined', declined: 'declined', missed: 'missed' };
    const name = (id) => (MISSIONS.find((x) => x.id === id) || {}).title || id;
    $('ov-text').innerHTML = `<span class="chronicle"><span class="hero-line"><span class="hero-por">${portraitSvg(e.hero.portrait)}</span>${esc(e.hero.name)} · ${esc(CONFIG.creation.classLabel[e.hero.role] || e.hero.role)}</span>`
      + `<span class="chr-row">${Object.entries(e.companions).map(([c, v]) => `<span class="chr-comp ${v}">${compImg(c)}<small>${esc(companionDef(c).short)} · ${st[v] || v}</small></span>`).join('')}</span>`
      + `<span class="chr-line">Order: ${e.order.map((id) => esc(name(id))).join(' → ')}</span>`
      + `<span class="chr-line">Finale squad: ${esc(e.hero.name)}${e.squad.map((c) => ', ' + esc(companionDef(c).short)).join('')} · battles lost: ${e.losses}</span>`
      + `<span class="chr-line small">${all.length} run${all.length === 1 ? '' : 's'} in the chronicle on this device</span></span>`;
    items = arg.fromTitle ? [{ id: 'back-title', label: '◀ Back', act: () => openPicker('title') }]
      : [{ id: 'new-run', cls: 'primary', label: 'Roll a new hero', sub: 'Starts a new company (this chronicle is kept)', act: startCreator },
        { id: 'to-board', label: 'Back to board', sub: `Keep ${esc(hero.name)}: skirmishes stay open`, act: () => openPicker('missions') }];
  } else if (hero) {
    // Victory / Defeat with a hero: Retry (same squad, fresh battle; no penalty) or back to the board
    const lost = S.over !== 'victory';
    items = [];
    if (lost || !(mission && mission.kind === 'recruit' && party.done[mission.id])) items.push({ id: 'restart', label: lost ? 'Retry' : 'Play again', sub: mission ? mission.title : S.mapName, act: () => reset(mapId, { mission }) });
    items.push({ id: 'to-board', label: lost ? 'Back to board' : 'Mission board', act: () => openPicker('missions', mission) });
  } else {
    const maps = skirmishMaps(), ci = Math.max(0, maps.findIndex((m) => m.id === mapId));
    const next = maps[(ci + 1) % maps.length];
    items = [{ id: 'restart', label: 'Play again', sub: (MAPS[cur] || maps[0]).name, act: () => reset(mapId) }];
    if (maps.length > 1) items.push({ id: 'next-map', label: `Next map: ${next.name}`, act: () => reset(next.id) });
    items.push({ id: 'choose-map', label: 'Choose map', act: () => openPicker('title') });
  }
  picker = { kind, items, index, arg, at: performance.now() };
  $('ov-list').innerHTML = items.map((it, i) =>
    `<button class="btn pick ${it.cls || ''}" ${it.id ? `id="${it.id}"` : ''} data-pick="${i}">${it.label}${it.sub ? `<small>${it.sub}</small>` : ''}</button>`).join('');
  syncPicker();
  $('overlay').classList.remove('hidden');
  setPicking(true);
  syncPad();
}
// while a list screen is up, the unit panel steps aside so the list gets the room (the pad stays)
function setPicking(on) {
  if ($('app').classList.contains('picking') === on) return;
  $('app').classList.toggle('picking', on);
  if (layout) resize();
}
// B on a picker: one screen back (recruit offer: must choose)
function pickerBack() {
  const k = picker.kind;
  if (k === 'title' && S.over) return openPicker('end');
  if (k === 'missions') return openPicker('title');
  if (k === 'brief') return openPicker('missions', picker.arg);
  if (k === 'confirm') return picker.arg.back();
}
// the confirm dialog swallows input for a moment after it opens (a double tap or a held key can't pass through)
const pickerBusy = () => picker && picker.kind === 'confirm' && performance.now() - picker.at < C.confirmDebounceMs;
function confirmStart(o) { openPicker('confirm', o); }
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// "New hero": the BG-style creation wizard (src/create.js). Done = save + rebuild the squad + back to the title.
function startCreator() {
  closePicker();
  openCreator({
    // a new hero starts a new company: recruited companions and mission progress are cleared
    onDone: (h) => { hero = h; saveHero(h); party = emptyParty(); clearParty(); reset(skirmishMaps().some((m) => m.id === mapId) ? mapId : CONFIG.defaultMap, { start: false }); openPicker('title'); },
    onCancel: () => openPicker('title'),
  });
  syncPad();
}
function closePicker() { picker = null; $('overlay').className = 'hidden'; setPicking(false); syncPad(); }
function syncPicker() {
  if (!picker) return;
  $('ov-list').querySelectorAll('[data-pick]').forEach((b) => {
    const on = Number(b.dataset.pick) === picker.index;
    b.classList.toggle('sel', on);
    if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest' }); // long lists scroll with the pad
  });
}
function pickerStep(step) { if (pickerBusy()) return; picker.index = (picker.index + step + picker.items.length) % picker.items.length; syncPicker(); }
function pickerChoose(i = picker.index) { if (pickerBusy()) return; const it = picker.items[i]; if (it) it.act(); }

// ---------------------------------------------------------------- layout / projection
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const r = cv.getBoundingClientRect();
  cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const maxH = Math.max(...S.heights.flat());
  const pad = V.mapPaddingPx;
  const n = S.w + S.h;
  // width in tile-width units: n/2 ; height: n/4 + maxH*hz/64 + unit headroom
  const head = 62; // unit headroom above the highest tile, in base px
  const fitH = (r.height - pad * 2) / (n / 4 + ((maxH + 1) * V.tileHeightPx + head) / V.baseTileWidth);
  // zoom past fit-to-width on narrow screens (drag to pan), but never taller than the stage
  const zoom = r.width < V.zoomBelowWidthPx ? V.zoom : 1;
  const tw = Math.min(((r.width - pad * 2) / (n / 2)) * zoom, fitH);
  const k = tw / V.baseTileWidth;
  const hz = V.tileHeightPx * k;
  const top = maxH * hz + tw / 4 + head * k;        // above oy
  const bottom = (n - 2) * tw / 4 + tw / 4 + hz;    // below oy
  layout = { w: r.width, h: r.height, tw, k, hz,
    bx: r.width / 2 - (S.w - S.h) * tw / 4,
    by: (r.height - top - bottom) / 2 + top,
    panX: Math.max(0, ((n / 2) * tw - r.width) / 2 + pad * 4),
    panY: Math.max(0, (top + bottom - r.height) / 2 + pad * 4) };
  applyCam();
}
// ---------------------------------------------------------------- camera (drag to pan, follows active unit)
const cam = { x: 0, y: 0, tx: 0, ty: 0 };
const clampCam = (c) => { c.x = Math.max(-layout.panX, Math.min(layout.panX, c.x)); c.y = Math.max(-layout.panY, Math.min(layout.panY, c.y)); };
function applyCam() { clampCam(cam); layout.ox = layout.bx + cam.x; layout.oy = layout.by + cam.y; }
// ease the camera so tile (x,y) is centred horizontally (only matters when zoomed past fit)
function focusTile(x, y) {
  if (!layout) return;
  const c = { x: -(x - y) * layout.tw / 2 + (S.w - S.h) * layout.tw / 4, y: 0 };
  clampCam(c); cam.tx = c.x; cam.ty = c.y; cam.follow = true;
}
// top-center of tile (x,y) at height h, in CSS px
function proj(x, y, h) {
  const { tw, hz, ox, oy } = layout;
  return { x: ox + (x - y) * tw / 2, y: oy + (x + y) * tw / 4 - h * hz };
}
const tileTop = (x, y) => proj(x, y, G.heightAt(S, x, y));

// ---------------------------------------------------------------- drawing helpers
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function diamond(cx, cy, tw) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - tw / 4); ctx.lineTo(cx + tw / 2, cy); ctx.lineTo(cx, cy + tw / 4); ctx.lineTo(cx - tw / 2, cy);
  ctx.closePath();
}
function drawTile(x, y, hl) {
  const h = G.heightAt(S, x, y);
  const t = P.terrain[S.terrain[y][x]];
  const { tw, hz } = layout;
  const c = tileTop(x, y);
  const depth = (h + 1) * hz; // draw sides down to below ground
  // left face
  ctx.beginPath();
  ctx.moveTo(c.x - tw / 2, c.y); ctx.lineTo(c.x, c.y + tw / 4); ctx.lineTo(c.x, c.y + tw / 4 + depth); ctx.lineTo(c.x - tw / 2, c.y + depth);
  ctx.closePath(); ctx.fillStyle = shade(t.side, 0.95); ctx.fill();
  // right face
  ctx.beginPath();
  ctx.moveTo(c.x + tw / 2, c.y); ctx.lineTo(c.x, c.y + tw / 4); ctx.lineTo(c.x, c.y + tw / 4 + depth); ctx.lineTo(c.x + tw / 2, c.y + depth);
  ctx.closePath(); ctx.fillStyle = shade(t.side, 0.7); ctx.fill();
  // strata lines per level
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1;
  for (let i = 1; i <= h; i++) {
    const yy = c.y + i * hz;
    ctx.beginPath(); ctx.moveTo(c.x - tw / 2, yy); ctx.lineTo(c.x, yy + tw / 4); ctx.lineTo(c.x + tw / 2, yy); ctx.stroke();
  }
  // top
  diamond(c.x, c.y, tw);
  const light = 0.92 + h * 0.05 + ((x + y) % 2) * 0.04;
  ctx.fillStyle = shade(t.top, light); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.stroke();
  if (hl) { diamond(c.x, c.y, tw * 0.92); ctx.fillStyle = hl; ctx.fill(); }
  if (S.reliquary && S.reliquary.x === x && S.reliquary.y === y) { // Wren's amulet hums: the reliquary lies here
    const pulse = 0.55 + 0.35 * Math.sin(performance.now() * 0.004);
    diamond(c.x, c.y, tw * 0.7); ctx.globalAlpha = pulse; ctx.strokeStyle = P.reliquary; ctx.lineWidth = 2.5 * layout.k; ctx.stroke();
    ctx.font = `bold ${Math.round(14 * Math.max(0.8, layout.k))}px Georgia, serif`; ctx.textAlign = 'center'; ctx.fillStyle = P.reliquary;
    ctx.fillText('✦', c.x, c.y + tw / 8 + 5 * layout.k); ctx.globalAlpha = 1; ctx.lineWidth = 1;
  }
}

// Screen direction of a facing: N(-y)=up-right, E(+x)=down-right, S(+y)=down-left, W(-x)=up-left
const FACE_VEC = [[1, -0.5], [1, 0.5], [-1, 0.5], [-1, -0.5]];
const FACE_ARROW = ['↗', '↘', '↙', '↖'];

function unitScreenPos(u, now) {
  const a = anims.get(u.id);
  let fx = u.x, fy = u.y, h = G.heightAt(S, u.x, u.y), ox = 0, oy = 0;
  if (a && a.type === 'move') {
    const t = Math.min(1, (now - a.t0) / (V.moveStepMs * (a.path.length - 1 || 1)));
    const f = t * (a.path.length - 1);
    const i = Math.min(a.path.length - 2, Math.floor(f));
    const p0 = a.path[Math.max(0, i)], p1 = a.path[Math.max(0, i) + 1] || p0;
    const lt = f - i;
    fx = p0.x + (p1.x - p0.x) * lt; fy = p0.y + (p1.y - p0.y) * lt;
    const h0 = G.heightAt(S, p0.x, p0.y), h1 = G.heightAt(S, p1.x, p1.y);
    h = h0 + (h1 - h0) * lt + Math.sin(lt * Math.PI) * (Math.abs(h1 - h0) * 0.6 + 0.3);
  }
  if (a && a.type === 'lunge') {
    const t = Math.min(1, (now - a.t0) / V.attackLungeMs);
    const amt = Math.sin(t * Math.PI) * 0.35;
    const p0 = proj(u.x, u.y, 0), p1 = proj(a.tx, a.ty, 0);
    ox = (p1.x - p0.x) * amt; oy = (p1.y - p0.y) * amt;
  }
  const p = proj(fx, fy, h);
  return { x: p.x + ox, y: p.y + oy, depth: fx + fy };
}

function drawUnit(u, now) {
  const { k } = layout;
  const pos = unitScreenPos(u, now);
  const pal = P[u.team];
  const a = anims.get(u.id);
  const dying = a && a.type === 'die';
  const alpha = dying ? Math.max(0, 1 - (now - a.t0) / 600) : 1;
  if (u.hp <= 0 && !dying) return;
  const isActive = S.active === u && !S.over;
  const bob = isActive ? Math.sin(now * V.bobSpeed) * V.bobAmplitudePx * k : 0;
  const dir = FACE_VEC[u.facing];
  const flip = dir[0] < 0 ? -1 : 1;
  const back = dir[1] < 0; // facing away from camera
  ctx.save();
  ctx.globalAlpha = alpha;
  const x = pos.x, y = pos.y;
  // ground: shadow, active ring, facing wedge
  ctx.beginPath(); ctx.ellipse(x, y, 15 * k, 7 * k, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,.32)'; ctx.fill();
  if (u.captain) { ctx.beginPath(); ctx.ellipse(x, y, 18 * k, 9 * k, 0, 0, Math.PI * 2); ctx.strokeStyle = P.captainRing; ctx.lineWidth = 2.5 * k; ctx.stroke(); }
  if (u.npc) { ctx.beginPath(); ctx.ellipse(x, y, 17 * k, 8.5 * k, 0, 0, Math.PI * 2); ctx.strokeStyle = P.npcRing; ctx.lineWidth = 2 * k; ctx.setLineDash([4 * k, 3 * k]); ctx.stroke(); ctx.setLineDash([]); }
  if (isActive) { ctx.beginPath(); ctx.ellipse(x, y, 19 * k, 9.5 * k, 0, 0, Math.PI * 2); ctx.strokeStyle = '#ffd85a'; ctx.lineWidth = 2.5 * k; ctx.stroke(); }
  ctx.beginPath();
  ctx.moveTo(x + dir[0] * 25 * k, y + dir[1] * 25 * k);
  ctx.lineTo(x + dir[0] * 14 * k - dir[1] * 9 * k, y + dir[1] * 14 * k + dir[0] * 4.5 * k);
  ctx.lineTo(x + dir[0] * 14 * k + dir[1] * 9 * k, y + dir[1] * 14 * k - dir[0] * 4.5 * k);
  ctx.closePath(); ctx.fillStyle = u.team === 'player' ? '#ffffff' : '#f0cf72'; ctx.globalAlpha = alpha * 0.85; ctx.fill();
  ctx.globalAlpha = alpha;

  ctx.translate(x, y - 2 * k + bob);
  ctx.scale(k * flip, k);
  // legs
  ctx.fillStyle = '#2b2420';
  ctx.fillRect(-7, -12, 5, 12); ctx.fillRect(2, -12, 5, 12);
  // weapon behind body when facing away
  const drawWeapon = () => {
    ctx.lineCap = 'round';
    if (u.role === 'knight') {
      ctx.strokeStyle = '#d9dde3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(12, -22); ctx.lineTo(20, -46); ctx.stroke();
      ctx.strokeStyle = '#8a6a3e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(8, -20); ctx.lineTo(16, -23); ctx.stroke();
    } else if (u.role === 'sergeant') {
      ctx.strokeStyle = '#7a5a36'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(16, -62); ctx.stroke();
      ctx.fillStyle = '#d9dde3'; ctx.beginPath(); ctx.moveTo(16, -70); ctx.lineTo(19, -60); ctx.lineTo(13, -60); ctx.closePath(); ctx.fill();
    } else if (u.role === 'archer') {
      ctx.strokeStyle = '#7a5a36'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(10, -28, 16, -1.2, 1.2); ctx.stroke();
      ctx.strokeStyle = '#ddd'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(10 + 16 * Math.cos(-1.2), -28 + 16 * Math.sin(-1.2)); ctx.lineTo(10 + 16 * Math.cos(1.2), -28 + 16 * Math.sin(1.2)); ctx.stroke();
    } else if (u.role === 'skirmisher') {
      ctx.strokeStyle = '#d9dde3'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(11, -18); ctx.lineTo(19, -32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-11, -18); ctx.lineTo(-19, -30); ctx.stroke();
    }
  };
  if (back) drawWeapon();
  // body / tunic
  ctx.fillStyle = pal.body; ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-11, -38); ctx.lineTo(11, -38); ctx.lineTo(13, -10); ctx.lineTo(-13, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (u.team === 'player' && !u.templar) { // companions outside the Order: no cross, a plain sash
    ctx.strokeStyle = P.companionSash; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, -36); ctx.lineTo(11, -13); ctx.stroke();
  } else if (!back) {
    if (u.team === 'player') { // Templar red cross
      ctx.fillStyle = pal.trim; ctx.fillRect(-2.5, -35, 5, 20); ctx.fillRect(-8, -29, 16, 5);
    } else { // raider sash + trim
      ctx.strokeStyle = pal.trim; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, -36); ctx.lineTo(11, -13); ctx.stroke();
    }
  } else if (u.team === 'player') {
    ctx.fillStyle = pal.trim; ctx.fillRect(-2.5, -35, 5, 20); ctx.fillRect(-8, -29, 16, 5);
  }
  ctx.fillStyle = pal.trim; ctx.fillRect(-13, -12, 26, 2.5);
  // head
  ctx.fillStyle = '#d7a77f'; ctx.beginPath(); ctx.arc(0, -44, 6.5, 0, Math.PI * 2); ctx.fill();
  if (u.role === 'knight') { // great helm
    ctx.fillStyle = '#b8bec6'; ctx.fillRect(-7.5, -53, 15, 15); ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(-7.5, -53, 15, 15);
    if (!back) { ctx.fillStyle = '#222'; ctx.fillRect(-5, -47, 10, 2); ctx.fillRect(-0.8, -47, 1.6, 6); }
  } else if (u.role === 'sergeant') { // kettle hat
    ctx.fillStyle = '#9aa1a8'; ctx.beginPath(); ctx.ellipse(0, -48, 11, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -49, 6.5, Math.PI, 0); ctx.fill();
  } else if (u.role === 'archer') { // hood / turban
    ctx.fillStyle = u.team === 'player' ? '#efe2c0' : '#3f7a74'; ctx.beginPath(); ctx.arc(0, -47, 7.5, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
  } else if (u.role === 'skirmisher') { // wrapped head
    ctx.fillStyle = pal.trim; ctx.beginPath(); ctx.arc(0, -47, 7, Math.PI, 0); ctx.fill(); ctx.fillRect(-7, -47, 14, 3);
  }
  // shield
  if (u.role === 'knight' || u.role === 'sergeant') {
    ctx.save(); ctx.translate(back ? 9 : -10, -24);
    if (u.team === 'player') {
      ctx.fillStyle = '#f4efe2'; ctx.beginPath(); ctx.moveTo(-6, -9); ctx.lineTo(6, -9); ctx.lineTo(6, 2); ctx.lineTo(0, 10); ctx.lineTo(-6, 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = P.player.trim; ctx.fillRect(-1.3, -8, 2.6, 15); ctx.fillRect(-5, -4, 10, 2.6);
    } else {
      ctx.fillStyle = P.enemy.accent; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = P.enemy.trim; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = P.enemy.trim; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (!back) drawWeapon();
  // hit flash
  if (a && a.type === 'flash' && now - a.t0 < V.hitFlashMs) {
    ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-25, -75, 50, 80);
  }
  ctx.restore();
  // hp bar (unflipped)
  const bw = 30 * k, bh = 4 * k, bx = x - bw / 2, by = y - 64 * k + bob;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
  const f = u.hp / u.maxHp;
  ctx.fillStyle = f > 0.5 ? P.hpGood : f > 0.25 ? P.hpMid : P.hpLow; ctx.fillRect(bx, by, bw * f, bh);
  // status pips (one letter each) above the bar
  const st = Object.keys(u.status || {});
  if (st.length) {
    ctx.font = `bold ${Math.round(10 * Math.max(0.8, k))}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pw = 13 * Math.max(0.8, k), y0 = by - pw * 0.75;
    st.forEach((key, i) => {
      const cx = x + (i - (st.length - 1) / 2) * (pw + 2);
      ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(cx - pw / 2, y0 - pw / 2, pw, pw);
      ctx.fillStyle = P.status[key] || '#fff'; ctx.fillText(STATUS[key] ? STATUS[key].pip : '?', cx, y0 + 0.5);
    });
    ctx.textBaseline = 'alphabetic';
  }
  ctx.globalAlpha = 1;
}
// Turncoat's Eye (Yusuf): dashed line from each raider near him to whoever it means to strike.
// Recomputed only when the board changes (positions / HP / statuses / whose turn).
function currentIntents() {
  if (!S || S.over || !S.units.some((u) => u.hp > 0 && u.trait === 'turncoatsEye' && u.team === 'player')) return [];
  const key = S.turnCount + '|' + S.units.map((u) => `${u.x},${u.y},${u.hp},${u.facing},${Object.keys(u.status).join('')}`).join(';');
  if (!intentCache || intentCache.key !== key) intentCache = { key, list: intents(S, 'player') };
  return intentCache.list;
}
function drawIntents(now) {
  const list = currentIntents();
  if (!list.length) return;
  const { k } = layout;
  ctx.save();
  ctx.strokeStyle = P.intent; ctx.fillStyle = P.intent; ctx.lineWidth = 2 * k; ctx.setLineDash([5 * k, 4 * k]);
  ctx.lineDashOffset = -now / 40;
  for (const { from, to } of list) {
    const a = unitScreenPos(from, now), b = unitScreenPos(to, now);
    const ay = a.y - 30 * k, by = b.y - 30 * k;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.moveTo(a.x, ay); ctx.lineTo(b.x, by); ctx.stroke();
    const ang = Math.atan2(by - ay, b.x - a.x), L = 9 * k;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(b.x, by); ctx.lineTo(b.x - L * Math.cos(ang - 0.45), by - L * Math.sin(ang - 0.45)); ctx.lineTo(b.x - L * Math.cos(ang + 0.45), by - L * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
    ctx.setLineDash([5 * k, 4 * k]);
  }
  ctx.restore();
}
const STATUS = {
  wall: { pip: 'W', name: 'Shield Wall', text: 'front dmg ×½, covers adjacent allies' },
  brace: { pip: 'B', name: 'Braced', text: 'strikes the first foe entering its front zone' },
  pinned: { pip: 'P', name: 'Pinned', text: 'MOV −2, JUMP ≤1 this turn' },
  exposed: { pip: 'E', name: 'Exposed', text: 'DEF −3 until its next turn' },
  slowed: { pip: 'S', name: 'Slowed', text: 'MOV −1 this turn (after Shield Wall)' },
};

function render(now) {
  const { w, h } = layout;
  ctx.clearRect(0, 0, w, h);
  // highlights
  const hl = new Map();
  const key = (x, y) => y * S.w + x;
  if (ui.mode === 'move' && ui.moveInfo) for (const t of ui.moveInfo.tiles) hl.set(key(t.x, t.y), P.moveHighlight);
  // brace zones are always visible: a stance the other side can read and route around
  for (const b of S.units) if (b.hp > 0 && b.status.brace) for (const z of G.braceZone(S, b)) hl.set(key(z.x, z.y), P.zoneHighlight);
  if (ui.mode === 'facing' && S.active && S.active.status.brace) for (const z of G.braceZone(S, S.active)) hl.set(key(z.x, z.y), P.effectHighlight);
  if ((ui.mode === 'target' || ui.mode === 'confirm') && S.active) {
    const u = S.active;
    const tiles = ui.ability ? G.abilityRangeTiles(S, u, ui.ability) : G.attackTiles(S, u);
    for (const t of tiles) hl.set(key(t.x, t.y), P.attackHighlight);
    const tgt = ui.mode === 'confirm' ? ui.target : validTargetAt(ui.cursor.x, ui.cursor.y);
    if (ui.ability && tgt) for (const t of G.abilityPreview(S, u, ui.ability, tgt).tiles) hl.set(key(t.x, t.y), P.effectHighlight);
    if (ui.target) hl.set(key(ui.target.x, ui.target.y), P.targetHighlight);
  }
  if (ui.mode === 'free' && ui.rangeOf && ui.rangeOf.hp > 0) for (const t of G.reachable(S, ui.rangeOf).tiles) hl.set(key(t.x, t.y), P.rangeHighlight);
  // painter's order: back (low x+y) to front
  const order = [];
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) order.push([x, y]);
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[0] - b[0]);
  const units = S.units.map((u) => ({ u, d: unitScreenPos(u, now).depth }));
  let ui2 = 0;
  units.sort((a, b) => a.d - b.d);
  for (const [x, y] of order) {
    // draw units whose depth is strictly behind this tile's row first
    while (ui2 < units.length && units[ui2].d < x + y - 0.01) drawUnit(units[ui2++].u, now);
    drawTile(x, y, hl.get(key(x, y)));
  }
  while (ui2 < units.length) drawUnit(units[ui2++].u, now);
  if (isPlayerTurn()) drawIntents(now);
  if (ui.mode === 'facing' && S.active) drawFacingArrows(S.active, now);
  if (showCursor()) drawCursor(now);
  // floating numbers
  floats = floats.filter((f) => now - f.t0 < V.damageFloatMs);
  for (const f of floats) {
    const t = (now - f.t0) / V.damageFloatMs;
    const p = tileTop(f.x, f.y);
    ctx.globalAlpha = 1 - Math.max(0, t - 0.6) / 0.4;
    ctx.font = `bold ${Math.round((f.big ? 24 : 18) * Math.max(0.8, layout.k))}px Georgia, serif`;
    ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = '#000'; ctx.fillStyle = f.color;
    const yy = p.y - 70 * layout.k - t * V.damageFloatRisePx;
    ctx.strokeText(f.text, p.x, yy); ctx.fillText(f.text, p.x, yy);
    ctx.globalAlpha = 1;
  }
}

const showCursor = () => S.active && S.active.team === 'player' && !S.over && ['menu', 'actmenu', 'free', 'move', 'target', 'confirm'].includes(ui.mode);
function drawCursor(now) {
  const { x, y } = ui.cursor;
  const c = tileTop(x, y), tw = layout.tw, k = layout.k;
  const pulse = 0.75 + 0.25 * Math.sin(now * CONFIG.view.cursorPulseSpeed);
  diamond(c.x, c.y, tw * 0.98);
  ctx.lineWidth = 3 * Math.max(0.8, k); ctx.strokeStyle = `rgba(255,216,90,${pulse})`; ctx.stroke();
  // bouncing pointer above the tile (FFTA-style)
  const u = G.unitAt(S, x, y);
  const top = c.y - (u ? 70 : 18) * k - Math.abs(Math.sin(now * 0.006)) * 6 * k;
  ctx.beginPath(); ctx.moveTo(c.x, top + 10 * k); ctx.lineTo(c.x - 7 * k, top); ctx.lineTo(c.x + 7 * k, top); ctx.closePath();
  ctx.fillStyle = '#ffd85a'; ctx.fill(); ctx.strokeStyle = '#3a2a00'; ctx.lineWidth = 1.5; ctx.stroke();
}
// FFTA2-style facing picker: four arrows on the ground around the unit
function facingArrowPos(u, d) {
  const c = tileTop(u.x, u.y), k = layout.k, v = FACE_VEC[d];
  return { x: c.x + v[0] * 34 * k, y: c.y + v[1] * 34 * k };
}
function drawFacingArrows(u, now) {
  const k = layout.k;
  for (let d = 0; d < 4; d++) {
    const p = facingArrowPos(u, d), v = FACE_VEC[d];
    const len = Math.hypot(v[0], v[1]), ux = v[0] / len, uy = v[1] / len;
    const sel = u.facing === d;
    const sz = (sel ? 15 + 2 * Math.sin(now * 0.008) : 12) * k;
    ctx.beginPath();
    ctx.moveTo(p.x + ux * sz, p.y + uy * sz);
    ctx.lineTo(p.x - ux * sz * 0.6 - uy * sz, p.y - uy * sz * 0.6 + ux * sz);
    ctx.lineTo(p.x - ux * sz * 0.6 + uy * sz, p.y - uy * sz * 0.6 - ux * sz);
    ctx.closePath();
    ctx.fillStyle = sel ? '#ffd85a' : 'rgba(255,255,255,.55)'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
    if (C.facingArrowLabels && DIR_ARM[d]) { // which pad button gives this facing
      const lx = p.x + ux * 25 * k, ly = p.y + uy * 25 * k, r = 8 * k;
      ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2); ctx.fillStyle = sel ? '#8a6a2a' : 'rgba(13,12,18,.8)'; ctx.fill();
      ctx.strokeStyle = sel ? '#ffd85a' : 'rgba(216,196,143,.7)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = sel ? '#fff' : '#ffd85a'; ctx.font = `${Math.round(9 * k)}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ARM_GLYPH[DIR_ARM[d]], lx, ly + 0.5 * k); ctx.textBaseline = 'alphabetic';
    }
  }
}

function loop(now) {
  if (cam.follow) { cam.x += (cam.tx - cam.x) * V.camFollow; cam.y += (cam.ty - cam.y) * V.camFollow; if (Math.abs(cam.tx - cam.x) < 0.5) cam.follow = false; }
  applyCam(); render(now); syncPad(); requestAnimationFrame(loop);
}

// ---------------------------------------------------------------- picking
function pointInDiamond(px, py, cx, cy, tw) {
  return Math.abs(px - cx) / (tw / 2) + Math.abs(py - cy) / (tw / 4) <= 1;
}
function pick(px, py) {
  // units: among sprites under the finger, prefer valid targets while targeting, then the closest body centre
  const now = performance.now();
  const k = layout.k;
  const hits = G.alive(S).map((u) => ({ u, p: unitScreenPos(u, now) }))
    .filter(({ p }) => px > p.x - 16 * k && px < p.x + 16 * k && py > p.y - 58 * k && py < p.y + 6 * k)
    .map((h) => ({ ...h, d: Math.hypot(px - h.p.x, py - (h.p.y - 25 * k)) }));
  const targeting = (ui.mode === 'target' || ui.mode === 'confirm') && S.active;
  hits.sort((a, b) => (targeting ? (validTargetAt(b.u.x, b.u.y) ? 1 : 0) - (validTargetAt(a.u.x, a.u.y) ? 1 : 0) : 0) || a.d - b.d);
  const unitHit = hits.length ? hits[0].u : null;
  const tileHit = pickTile(px, py);
  // In move mode an exact hit on a highlighted empty tile wins over a sprite overlapping it.
  if (tileHit && ui.mode === 'move' && ui.moveInfo && !tileHit.unit &&
      ui.moveInfo.tiles.some((t) => t.x === tileHit.x && t.y === tileHit.y)) return tileHit;
  if (unitHit) return { x: unitHit.x, y: unitHit.y, unit: unitHit };
  return tileHit;
}
function pickTile(px, py) {
  const order = [];
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) order.push([x, y]);
  order.sort((a, b) => b[0] + b[1] - (a[0] + a[1]));
  for (const [x, y] of order) {
    const c = tileTop(x, y);
    if (pointInDiamond(px, py, c.x, c.y, layout.tw)) return { x, y, unit: G.unitAt(S, x, y) };
  }
  return null;
}

let down = null;
cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, drag: false }; e.preventDefault(); });
cv.addEventListener('pointermove', (e) => {
  if (!down) return;
  const dx = e.clientX - down.x, dy = e.clientY - down.y;
  if (!down.drag && Math.hypot(dx, dy) > V.dragThresholdPx) down.drag = true;
  if (down.drag) { cam.follow = false; cam.x = down.cx + dx; cam.y = down.cy + dy; applyCam(); }
});
cv.addEventListener('pointercancel', () => { down = null; });
cv.addEventListener('pointerup', (e) => {
  if (!down) return;
  const wasDrag = down.drag;
  down = null;
  if (wasDrag) return;
  const r = cv.getBoundingClientRect();
  onCanvasTap(e.clientX - r.left, e.clientY - r.top);
});

// ---------------------------------------------------------------- player input (FFTA2-style state machine)
// modes: busy | menu | actmenu | free | move | target | confirm | facing
const C = CONFIG.controls;
// allied NPCs (recruit missions) are on your side but act on their own (AI)
const isPlayerTurn = () => S.active && S.active.team === 'player' && !S.active.npc && !S.over && ui.mode !== 'busy';

function setCursor(x, y) {
  ui.cursor = { x: Math.max(0, Math.min(S.w - 1, x)), y: Math.max(0, Math.min(S.h - 1, y)) };
  focusTile(ui.cursor.x, ui.cursor.y);
  updatePanel();
}
const cursorUnit = () => G.unitAt(S, ui.cursor.x, ui.cursor.y);

function menuItems() {
  if (ui.mode === 'actmenu') {
    const u = S.active;
    return [{ id: 'attack', label: 'Attack', on: true }].concat(G.abilitiesOf(u).map((a) => {
      const cd = u.cd[a.id] || 0;
      const any = G.abilityTargets(S, u, a.id).length > 0;
      return { id: 'ab:' + a.id, ability: a.id, label: a.name, on: cd === 0 && any, note: cd > 0 ? `CD ${cd}` : any ? '' : 'no target' };
    }));
  }
  return [
    { id: 'move', label: 'Move', on: !S.moved },
    { id: 'action', label: 'Action', on: !S.acted && G.canAct(S), note: G.canAct(S) ? '' : 'skittish' },
    { id: 'wait', label: 'Wait', on: true },
  ];
}
function openMenu(focusId) {
  const u = S.active;
  ui.mode = 'menu'; ui.target = null; ui.rangeOf = null; ui.lastTap = null; ui.ability = null;
  const items = menuItems();
  let i = focusId ? items.findIndex((it) => it.id === focusId && it.on) : -1;
  if (i < 0) i = items.findIndex((it) => it.on); // FFTA2: highlight the first available command
  ui.menuIndex = Math.max(0, i);
  setCursor(u.x, u.y);
}
function openActMenu(focusId) {
  ui.mode = 'actmenu'; ui.ability = null;
  const i = focusId ? menuItems().findIndex((it) => it.id === focusId) : 0;
  ui.menuIndex = Math.max(0, i); updatePanel();
}
function enterMove() {
  const u = S.active;
  ui.mode = 'move'; ui.moveInfo = G.reachable(S, u); ui.lastTap = null;
  setCursor(u.x, u.y);
}
function enterTarget(ability = null) {
  const u = S.active;
  ui.mode = 'target'; ui.target = null; ui.lastTap = null; ui.ability = ability;
  setCursor(u.x, u.y); // FFTA2: cursor starts on the acting unit (which is the target for stances)
}
function enterFacing() { ui.mode = 'facing'; ui.facingTap = null; updatePanel(); }
const validTargetAt = (x, y) => {
  const t = G.unitAt(S, x, y), u = S.active;
  if (ui.ability) return t && G.abilityCanTarget(S, u, ui.ability, t) ? t : null;
  return t && t.team !== u.team && G.canAttackFrom(S, u, u.x, u.y, x, y) ? t : null;
};

function selectMenuItem(it) {
  if (!it || !it.on) return;
  if (it.id === 'move') enterMove();
  else if (it.id === 'action') openActMenu();
  else if (it.id === 'wait') enterFacing();
  else if (it.id === 'attack') enterTarget();
  else if (it.ability) enterTarget(it.ability);
}

function pressDir(d) {
  if (picker) { if (d === 0) pickerStep(-1); else if (d === 2) pickerStep(1); return; }
  if (!isPlayerTurn()) return;
  if (ui.mode === 'menu' || ui.mode === 'actmenu') { // menus only go up/down (keyboard ↑/↓); left/right do nothing
    if (d === 0) pressStep(-1); else if (d === 2) pressStep(1);
    return;
  }
  if (ui.mode === 'facing') { S.active.facing = d; ui.facingTap = null; updatePanel(); return; }
  if (ui.mode === 'confirm') return;
  const [dx, dy] = G.DIRS[d];
  setCursor(ui.cursor.x + dx, ui.cursor.y + dy);
}

function pressStep(step) { // vertical pad: move the menu highlight, skipping greyed items
  if (picker) return pickerStep(step);
  if (!isPlayerTurn() || !(ui.mode === 'menu' || ui.mode === 'actmenu')) return;
  const items = menuItems();
  let i = ui.menuIndex;
  for (let n = 0; n < items.length; n++) { i = (i + step + items.length) % items.length; if (items[i].on) break; }
  ui.menuIndex = i; updatePanel();
}

// which pad layout fits the current state
function padMode() {
  if (creatorOpen()) return 'off';
  if (picker) return 'menu';
  if (!isPlayerTurn()) return 'off';
  if (ui.mode === 'menu' || ui.mode === 'actmenu') return 'menu';
  if (ui.mode === 'facing') return 'facing';
  if (ui.mode === 'free' || ui.mode === 'move' || ui.mode === 'target') return 'map';
  return 'off'; // confirm: only A/B mean anything
}
let padShown = null, padFacing = null;
function syncPad() {
  const m = padMode(), el = $('dpad');
  if (m !== padShown) {
    padShown = m; el.dataset.mode = m; el.classList.toggle('off', m === 'off');
    if (m !== 'off') { const lay = m === 'menu' ? 'lay-menu' : m === 'facing' ? 'lay-face' : 'lay-map';
      el.querySelectorAll('.lay').forEach((l) => l.classList.toggle('on', l.classList.contains(lay))); }
    // 'off' keeps the last layout on screen, just dimmed and inert, so nothing jumps
  }
  $('ab').classList.toggle('off', !(picker || isPlayerTurn()));
  const f = m === 'facing' ? S.active.facing : null;
  if (f !== padFacing) { padFacing = f; el.querySelectorAll('.lay-face [data-face]').forEach((b) => b.classList.toggle('cur', Number(b.dataset.face) === f)); }
}

function pressA() {
  if (picker) return pickerChoose();
  if (!isPlayerTurn()) return;
  const u = S.active, { x, y } = ui.cursor;
  switch (ui.mode) {
    case 'menu': case 'actmenu': return selectMenuItem(menuItems()[ui.menuIndex]);
    case 'free': return openMenu(); // A: cursor back to the active unit, show commands
    case 'move':
      if (ui.moveInfo.tiles.some((t) => t.x === x && t.y === y) && !(x === u.x && y === u.y)) return doPlayerMove(x, y);
      return;
    case 'target': { const t = validTargetAt(x, y); if (t) { ui.target = t; ui.mode = 'confirm'; updatePanel(); } return; }
    case 'confirm': return ui.ability ? doPlayerAbility(ui.ability, ui.target) : doPlayerAttack(ui.target);
    case 'facing': return playerEnd();
  }
}

function pressB() {
  if (picker) { if (pickerBusy()) return; return pickerBack(); } // one screen back
  if (!isPlayerTurn()) return;
  const u = S.active;
  switch (ui.mode) {
    case 'menu':
      if (S.moved && !S.acted && !S.intercepted) { G.undoMove(S, u); return openMenu('move'); } // FFTA2: B undoes the move
      ui.mode = 'free'; ui.rangeOf = null; updatePanel(); return;              // look around the field
    case 'actmenu': return openMenu('action');
    case 'free': {
      const cu = cursorUnit();
      if (cu && cu !== u && ui.rangeOf !== cu) { ui.rangeOf = cu; updatePanel(); return; } // show its move range
      return openMenu();
    }
    case 'move': return openMenu('move');
    case 'target': { const ab = ui.ability; ui.ability = null; openActMenu(ab ? 'ab:' + ab : null); return; }
    case 'confirm': ui.mode = 'target'; ui.target = null; updatePanel(); return;
    case 'facing': return openMenu('wait');
  }
}

function onCanvasTap(px, py) {
  if (!isPlayerTurn()) return;
  const u = S.active;
  if (ui.mode === 'facing') {
    // pick the arrow closest to the tap direction; tapping the same arrow again confirms
    const c = tileTop(u.x, u.y);
    const vx = px - c.x, vy = (py - c.y) * 2;
    let best = 0, bd = -Infinity;
    for (let d = 0; d < 4; d++) { const v = FACE_VEC[d]; const dot = v[0] * vx + v[1] * 2 * vy; if (dot > bd) { bd = dot; best = d; } }
    if (ui.facingTap === best && C.tapConfirmsSecondTap) return playerEnd();
    u.facing = best; ui.facingTap = best; updatePanel(); return;
  }
  const hit = pick(px, py);
  if (!hit) return;
  const same = ui.cursor.x === hit.x && ui.cursor.y === hit.y && ui.lastTap === `${hit.x},${hit.y}`;
  ui.lastTap = `${hit.x},${hit.y}`;
  if (ui.mode === 'target' && validTargetAt(hit.x, hit.y)) { // stylus: touching a target selects it
    setCursor(hit.x, hit.y); ui.target = validTargetAt(hit.x, hit.y); ui.mode = 'confirm'; updatePanel(); return;
  }
  if (ui.mode === 'confirm') {
    if (ui.target && hit.x === ui.target.x && hit.y === ui.target.y) return pressA();
    ui.mode = 'target'; ui.target = null; setCursor(hit.x, hit.y); return;
  }
  if (same && C.tapConfirmsSecondTap) { if (ui.mode === 'menu' || ui.mode === 'actmenu') { ui.mode = 'free'; } return pressA(); }
  if (ui.mode === 'menu' || ui.mode === 'actmenu') ui.mode = 'free';
  setCursor(hit.x, hit.y);
}

async function doPlayerMove(x, y) {
  const u = S.active;
  ui.mode = 'busy'; updatePanel();
  await moveWithBrace(u, ui.moveInfo.pathTo(x, y));
  if (S.over) return finish();
  if (u.hp <= 0) { G.endTurn(S); updatePanel(); setTimeout(nextTurn, 300); return; }
  openMenu(); // menu returns; Move is greyed, B undoes the move (unless a brace stopped it)
}
// walk a path; a braced foe's zone stops the walk and its thrust lands automatically (no prompt)
async function moveWithBrace(u, path) {
  const ic = G.braceIntercept(S, u, path);
  const walk = ic ? path.slice(0, ic.index + 1) : path;
  await animateMove(u, walk);
  const end = walk[walk.length - 1];
  G.moveUnit(S, u, end.x, end.y, walk);
  setCursor(u.x, u.y);
  if (!ic) return null;
  const b = ic.by;
  b.facing = G.facingTo(b.x, b.y, u.x, u.y, b.facing);
  floats.push({ x: b.x, y: b.y, text: 'BRACE!', color: P.status.brace, t0: performance.now() });
  anims.set(b.id, { type: 'lunge', tx: u.x, ty: u.y, t0: performance.now() });
  await wait(V.attackLungeMs * 0.5);
  const r = G.braceStrike(S, b, u);
  lastResult = { ...r, brace: true, by: b.id, target: u.id };
  showHit(u, r);
  await wait(V.attackLungeMs * 0.5);
  anims.delete(b.id);
  await afterHit(u, r.killed || u.hp <= 0);
  return r;
}

async function doPlayerAbility(id, t) {
  const u = S.active;
  ui.mode = 'busy'; ui.target = null; ui.ability = null; updatePanel();
  await abilitySequence(u, id, t);
  if (S.over) return finish();
  if (S.moved || id === 'brace') return enterFacing(); // brace: the zone follows the facing you pick now
  openMenu();
}

async function doPlayerAttack(t) {
  const u = S.active;
  ui.mode = 'busy'; ui.target = null; ui.ability = null; updatePanel();
  await attackSequence(u, t);
  if (S.over) return finish();
  if (S.moved) return enterFacing(); // moved + acted: straight to facing (FFTA2)
  openMenu();
}

function playerEnd() { ui.mode = 'busy'; G.endTurn(S); updatePanel(); setTimeout(nextTurn, 150); }

// ---------------------------------------------------------------- on-screen pad + keyboard
function bindHold(el, fn) {
  let t1 = null, t2 = null;
  const stop = () => { clearTimeout(t1); clearInterval(t2); t1 = t2 = null; el.classList.remove('held'); };
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault(); stop(); el.classList.add('held');
    try { el.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ }
    fn(); t1 = setTimeout(() => { t2 = setInterval(fn, C.repeatRateMs); }, C.repeatDelayMs);
  });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(ev, stop);
}
function bindPress(el, fn) {
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); el.classList.add('held'); fn(); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, () => el.classList.remove('held'));
}
// cross arms → grid directions from config (both the map-cursor and the facing layer)
const ARM_GLYPH = { up: '▲', right: '▶', down: '▼', left: '◀' };
const DIR_ARM = {}; for (const [arm, d] of Object.entries(C.padCross)) DIR_ARM[d] = arm;
document.querySelectorAll('#dpad .lay-map [data-arm]').forEach((b) => { b.dataset.dir = C.padCross[b.dataset.arm]; });
document.querySelectorAll('#dpad .lay-face [data-arm]').forEach((b) => { b.dataset.face = C.padCross[b.dataset.arm]; });
document.querySelectorAll('#dpad [data-dir]').forEach((b) => bindHold(b, () => pressDir(Number(b.dataset.dir))));
document.querySelectorAll('#dpad [data-step]').forEach((b) => bindHold(b, () => pressStep(Number(b.dataset.step))));
document.querySelectorAll('#dpad [data-face]').forEach((b) => bindPress(b, () => pressDir(Number(b.dataset.face))));
document.documentElement.style.setProperty('--pad-ms', C.padMorphMs + 'ms');
document.documentElement.style.setProperty('--pad-dim', String(C.padDimOpacity));
bindPress($('btnA'), pressA);
bindPress($('btnB'), pressB);
document.documentElement.style.setProperty('--dpad', C.dpadSizePx + 'px');
document.documentElement.style.setProperty('--ab', C.abSizePx + 'px');
document.documentElement.style.setProperty('--menu-h', C.menuItemHeightPx + 'px');

if (C.keyboard) {
  const KEYS = { ArrowUp: C.padCross.up, KeyW: C.padCross.up, ArrowRight: C.padCross.right, KeyD: C.padCross.right, ArrowDown: C.padCross.down, KeyS: C.padCross.down, ArrowLeft: C.padCross.left, KeyA: C.padCross.left };
  let last = 0;
  window.addEventListener('keydown', (e) => {
    if (creatorOpen()) { creatorKey(e); return; }
    if (e.code in KEYS) { e.preventDefault(); const now = performance.now(); if (e.repeat && now - last < C.repeatRateMs) return; last = now; pressDir(KEYS[e.code]); }
    else if (['KeyZ', 'Enter', 'Space'].includes(e.code)) { e.preventDefault(); if (!e.repeat) pressA(); }
    else if (['KeyX', 'Escape', 'Backspace'].includes(e.code)) { e.preventDefault(); if (!e.repeat) pressB(); }
  });
}
// ---------------------------------------------------------------- shared sequences
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function animateMove(u, path) {
  if (!path || path.length < 2) return Promise.resolve();
  anims.set(u.id, { type: 'move', path, t0: performance.now() });
  return wait(V.moveStepMs * (path.length - 1)).then(() => anims.delete(u.id));
}
async function attackSequence(u, t) {
  u.facing = G.facingTo(u.x, u.y, t.x, t.y, u.facing);
  anims.set(u.id, { type: 'lunge', tx: t.x, ty: t.y, t0: performance.now() });
  await wait(V.attackLungeMs * 0.5);
  const res = G.resolveAttack(S, u, t);
  lastResult = res;
  if (res.miss) floats.push({ x: t.x, y: t.y, text: 'MISS', color: '#cfd6df', t0: performance.now() });
  else {
    floats.push({ x: t.x, y: t.y, text: String(res.amount) + (res.crit ? '!' : ''), color: res.crit ? '#ffd85a' : '#ffffff', big: res.crit, t0: performance.now() });
    if (res.side !== 'front') floats.push({ x: t.x, y: t.y, text: res.side === 'back' ? 'BACK' : 'SIDE', color: '#ff9a5a', t0: performance.now() - V.damageFloatMs * 0.35 });
    anims.set(t.id, { type: 'flash', t0: performance.now() });
  }
  await wait(V.attackLungeMs * 0.5);
  anims.delete(u.id);
  if (res.killed) { anims.set(t.id, { type: 'die', t0: performance.now() }); await wait(600); }
  else await wait(V.hitFlashMs);
  if (anims.get(t.id)) anims.delete(t.id);
  updateOrder();
  return res;
}
let lastResult = null;
function showHit(t, r) {
  if (r.miss) { floats.push({ x: t.x, y: t.y, text: 'MISS', color: '#cfd6df', t0: performance.now() }); return; }
  floats.push({ x: t.x, y: t.y, text: String(r.amount) + (r.crit ? '!' : ''), color: r.crit ? '#ffd85a' : '#ffffff', big: r.crit, t0: performance.now() });
  if (r.side && r.side !== 'front') floats.push({ x: t.x, y: t.y, text: r.side === 'back' ? 'BACK' : 'SIDE', color: '#ff9a5a', t0: performance.now() - V.damageFloatMs * 0.35 });
  anims.set(t.id, { type: 'flash', t0: performance.now() });
}
async function afterHit(t, killed) {
  if (killed) { anims.set(t.id, { type: 'die', t0: performance.now() }); await wait(600); }
  else await wait(V.hitFlashMs);
  if (anims.get(t.id)) anims.delete(t.id);
  updateOrder(); updatePanel();
}
async function abilitySequence(u, id, t) {
  const self = CONFIG.abilities[id].kind === 'self';
  floats.push({ x: u.x, y: u.y, text: CONFIG.abilities[id].name, color: '#ffe9a8', t0: performance.now() - V.damageFloatMs * 0.2 });
  if (!self && id !== 'vaultStrike') {
    u.facing = G.facingTo(u.x, u.y, t.x, t.y, u.facing);
    anims.set(u.id, { type: 'lunge', tx: t.x, ty: t.y, t0: performance.now() });
    await wait(V.attackLungeMs * 0.5);
  }
  const res = G.useAbility(S, u, id, t);
  lastResult = res;
  if (self) { await wait(V.hitFlashMs); updatePanel(); return res; }
  const hop = res.moves.find((m) => m.hop);
  if (hop) { await animateMove(u, [hop.from, hop.to]); anims.set(u.id, { type: 'lunge', tx: t.x, ty: t.y, t0: performance.now() }); await wait(V.attackLungeMs * 0.5); }
  const tx = res.moves.find((m) => !m.hop);
  showHit(tx ? { id: t.id, x: tx.from.x, y: tx.from.y } : t, res);
  if (tx) await animateMove(t, [tx.from, tx.to]);
  for (const g of res.tags) floats.push({ x: g.x, y: g.y, text: g.text, color: '#ffb36b', t0: performance.now() - V.damageFloatMs * 0.15 });
  await wait(V.attackLungeMs * 0.5);
  anims.delete(u.id);
  if (res.collided != null) { const o = S.units[res.collided]; if (o.hp <= 0) anims.set(o.id, { type: 'die', t0: performance.now() }); }
  await afterHit(t, t.hp <= 0);
  setCursor(u.x, u.y);
  return res;
}

function banner(text, team) {
  const b = $('banner'); b.textContent = text; b.className = team;
  return wait(V.turnBannerMs).then(() => { b.className = team + ' hidden'; });
}

async function nextTurn() {
  if (S.over) return finish();
  const u = G.startNextTurn(S);
  ui.mode = 'busy'; ui.rangeOf = null; updatePanel();
  if (S.spawned) { // finale, Wren missed: a raider urchin opens the chapel's side door
    const r = S.spawned; S.spawned = null;
    setCursor(r.x, r.y); floats.push({ x: r.x, y: r.y, text: 'Side door!', color: '#ff8a4a', t0: performance.now() });
    await banner(`${r.name} slips in by the side door`, 'enemy');
    setCursor(u.x, u.y);
  }
  setCursor(u.x, u.y);
  if (u.team === 'player' && !u.npc) {
    banner(u.name, 'player');
    if (S.skittish) floats.push({ x: u.x, y: u.y, text: 'Skittish!', color: '#ffb36b', t0: performance.now() });
    openMenu();
  } else {
    await banner(u.name, u.npc ? 'player npc' : 'enemy');
    await wait(CONFIG.ai.thinkDelayMs);
    let plan = planTurn(S, u);
    if (plan.path && plan.path.length > 1) {
      const ic = await moveWithBrace(u, plan.path);
      if (S.over) return finish();
      if (u.hp <= 0) { G.endTurn(S); await wait(200); return nextTurn(); }
      if (ic) plan = planTurn(S, u, { fixed: true }); // stopped short: act from where it stands
    }
    const a = plan.action;
    if (a && a.type === 'attack' && G.canAttackFrom(S, u, u.x, u.y, a.target.x, a.target.y)) {
      await wait(150);
      await attackSequence(u, a.target);
    } else if (a && a.type === 'ability' && G.abilityReady(u, a.id) && G.abilityCanTarget(S, u, a.id, a.target)) {
      await wait(150);
      await abilitySequence(u, a.id, a.target);
    }
    if (S.over) return finish();
    G.faceNearestFoe(S, u);
    G.endTurn(S);
    await wait(200);
    nextTurn();
  }
}

function finish() {
  if (S.finishShown) return; // forceWin (tests) can race an AI turn that also ends the battle
  S.finishShown = true;
  updatePanel();
  const win = S.over === 'victory';
  if (win && mission && mission.kind === 'skirmish') { party.done[mission.id] = (party.done[mission.id] || 0) + 1; saveParty(party); }
  if (hero && mission && mission.kind !== 'skirmish') { if (win) recordWin(party, mission.id); else recordLoss(party); saveParty(party); }
  let run = null;
  if (win && hero && mission && mission.kind === 'finale' && party.finale !== 'won') {
    party.finale = 'won'; saveParty(party);
    const squad = S.units.filter((u) => u.companion && !u.npc).map((u) => u.companion);
    run = { at: new Date().toISOString(), version: CONFIG.version, hero: { name: hero.name, role: hero.role, portrait: hero.portrait },
      companions: Object.fromEntries(Object.entries(party.companions).map(([c, v]) => [c, v.status])), order: party.order.slice(), losses: party.losses, squad };
    addChronicle(run);
  }
  setTimeout(() => {
    if (run) return openPicker('ending', run);
    if (win && mission && mission.kind === 'recruit' && !party.done[mission.id]) return openPicker('recruit'); // who was it? Accept / Decline
    openPicker('end');
    $('ov-title').textContent = win ? 'VICTORY' : 'DEFEAT';
    const fell = S.units.find((u) => u.mustSurvive && u.hp <= 0);
    $('ov-text').textContent = win ? (S.captainFell ? 'The Red Captain falls. His band breaks and flees.' : 'The field is held. Deus vult.') : fell ? `${fell.name} has fallen. The mission is lost.` : 'Your company has fallen.';
  }, 500);
}

// ---------------------------------------------------------------- HUD
function updateOrder() {
  const list = G.previewOrder(S);
  $('order').innerHTML = list.map((u, i) =>
    `<button class="chip ${u.team} ${u.hero ? 'hero' : ''} ${u.companion ? 'comp' : ''} ${u.npc ? 'npc' : ''} ${i === 0 && S.active ? 'now' : ''}" data-uid="${u.id}" title="${esc(u.name)}">${chipFace(u)}<small>${i === 0 ? '' : i}</small></button>`).join('');
}
// hero / companions (and the recruit-mission ally) show their face in the turn strip
const chipFace = (u) => u.hero ? `<span class="chip-por">${portraitSvg(u.hero.portrait)}</span>`
  : u.companion ? `<span class="chip-por"><img src="${u.portraitImg}" alt=""></span>` : roleGlyph(u.role);
const roleGlyph = (r) => ({ knight: '⚔', sergeant: '↟', archer: '➶', skirmisher: '»' }[r] || '?');
// tapping a chip = FFTA2's L/R unit cycling: look at that unit
$('order').addEventListener('click', (e) => {
  const b = e.target.closest('[data-uid]'); if (!b || !isPlayerTurn() || ui.mode === 'confirm' || ui.mode === 'facing') return;
  const u = S.units[Number(b.dataset.uid)];
  if (['menu', 'actmenu'].includes(ui.mode)) ui.mode = 'free';
  setCursor(u.x, u.y);
});

function unitInfo(u) {
  const f = u.hp / u.maxHp;
  const col = f > 0.5 ? P.hpGood : f > 0.25 ? P.hpMid : P.hpLow;
  const r = CONFIG.roles[u.role];
  const terr = Object.entries(r.terrainCost || {}).map(([k, v]) => `${CONFIG.terrain[k].short || CONFIG.terrain[k].name[0]}${v}`).join(' ');
  const row1 = `<div class="row1"><span class="name ${u.team}">${esc(u.name)}</span><span class="hpt">HP <b>${u.hp}</b>/${u.maxHp}</span></div>`;
  if (u.companion) {
    const t = traitDef(u.trait);
    const por = `<span class="hero-por comp-por" title="${esc(u.name)}"><img src="${u.portraitImg}" alt=""></span>`;
    const tline = `<div class="traitline"><b>${esc(t.name)}</b> ＋${esc(t.pro)} · －${esc(t.con)}${u.npc ? ` · ${esc(CONFIG.party.npcLabel)}, must survive` : ''}</div>`;
    return `<div class="herorow">${por}<div>${row1}${unitInfoRest(u, f, col, r, terr)}${tline}</div></div>`;
  }
  if (u.hero) return `<div class="herorow"><span class="hero-por" title="${esc(u.name)} (your hero)">${portraitSvg(u.hero.portrait)}</span><div>${row1}${unitInfoRest(u, f, col, r, terr)}</div></div>`;
  return row1 + unitInfoRest(u, f, col, r, terr);
}
function unitInfoRest(u, f, col, r, terr) {
  return `
    <div class="hpbar"><div style="width:${f * 100}%;background:${col}"></div></div>
    <div class="stats"><span>ATK <b>${u.atk}</b></span><span>DEF <b>${u.def}</b></span><span>SPD <b>${u.spd}</b></span>
    <span>MOV <b>${u.move}</b></span><span>JMP <b>${u.jump}</b></span><span>RNG <b>${r.minRange}-${r.maxRange}${r.straightLine ? 'L' : ''}</b></span>
    <span>Face <b>${FACE_ARROW[u.facing]}</b></span>${terr ? `<span>Terr <b>${terr}</b></span>` : ''}${u.hero ? heroExtras(u) : ''}</div>
    ${statusLine(u)}`;
}

const heroExtras = (u) => (u.hitBonus ? `<span>Hit <b>${u.hitBonus > 0 ? '+' : ''}${u.hitBonus}%</b></span>` : '') + (u.resist ? `<span>Res <b>${u.resist}%</b></span>` : '');
function statusLine(u) {
  const st = Object.keys(u.status || {}).filter((k) => STATUS[k]);
  const cds = Object.entries(u.cd || {}).filter(([, v]) => v > 0).map(([id, v]) => `${CONFIG.abilities[id].short} CD${v}`);
  const SH = CONFIG.campaign.finale.shaken;
  const shaken = G.isShaken(S, u) ? `<span style="color:#ffb36b" title="Renaud is next to him: −${SH.hitPenalty}% hit">● Shaken</span>` : '';
  const boss = u.captain ? `<span style="color:${P.captainRing}" title="When he falls, his band flees">● Captain</span>` : '';
  if (!st.length && !cds.length && !shaken && !boss) return '';
  return `<div class="status">${boss}${shaken}${st.map((k) => `<span style="color:${P.status[k]}" title="${STATUS[k].text}">● ${STATUS[k].name}</span>`).join('')}${cds.map((c) => `<span class="cd">${c}</span>`).join('')}</div>`;
}
function abilityPredictionHtml(u, id, t, confirming) {
  const pv = G.abilityPreview(S, u, id, t);
  const tags = [];
  if (pv.p) {
    const p = pv.p;
    tags.push(p.side === 'front' ? (p.cover ? 'Front (covered)' : 'Front') : `${p.side === 'back' ? 'Back' : 'Side'} +${Math.round((p.facingMod - 1) * 100)}%`);
    if (p.nFlank) tags.push(`Flank ×${p.nFlank}`);
    if (p.hAdv) tags.push(`Height ${p.hAdv > 0 ? '+' : ''}${Math.round((p.heightMod - 1) * 100)}%`);
    if (p.wallMod && p.wallMod < 1) tags.push('Shield Wall ×½');
    if (p.exposed) tags.push('Exposed');
  }
  const main = pv.p
    ? `<span>Hit <b>${pv.hit}%</b></span><span>Dmg <b>~${pv.dmg}${pv.extra ? '+' + pv.extra : ''}</b></span><span>HP ${t.hp}→${Math.max(0, t.hp - pv.dmg - (pv.extra || 0))}</span>`
    : `<span>Stance · CD ${CONFIG.abilities[id].cooldown}</span>`;
  return `<div class="pv-title">${pv.name} → ${pv.p ? t.name : 'self'}</div>
    <div class="pv-main">${main}</div>
    ${tags.length ? `<div class="pv-tags">${tags.join(' · ')}</div>` : ''}
    <div class="pv-fx">${pv.effects.map((e) => `<div>${e}</div>`).join('')}</div>
    ${confirming ? '<div class="pv-confirm"><b>A</b> Execute &nbsp; <b>B</b> Back</div>' : ''}`;
}
function predictionHtml(u, t, confirming) {
  if (ui.ability) return abilityPredictionHtml(u, ui.ability, t, confirming);
  const p = G.preview(S, u, t);
  const tags = [];
  tags.push(p.side === 'front' ? 'Front' : `${p.side === 'back' ? 'Back' : 'Side'} +${Math.round((p.facingMod - 1) * 100)}%`);
  if (p.nFlank) tags.push(`Flank ×${p.nFlank} +${Math.round((p.flankMod - 1) * 100)}%`);
  if (p.hAdv) tags.push(`Height ${p.hAdv > 0 ? '+' : ''}${Math.round((p.heightMod - 1) * 100)}%`);
  if (p.shaken) tags.push(`Shaken −${CONFIG.campaign.finale.shaken.hitPenalty}% hit`);
  return `<div class="pv-title">Attack → ${t.name}</div>
    <div class="pv-main"><span>Hit <b>${p.hit}%</b></span><span>Dmg <b>~${p.dmg}</b></span><span>HP ${t.hp}→${Math.max(0, t.hp - p.dmg)}</span></div>
    <div class="pv-tags">${tags.join(' · ')}</div>
    ${confirming ? '<div class="pv-confirm"><b>A</b> Execute &nbsp; <b>B</b> Back</div>' : ''}`;
}

const HINTS = {
  menu: () => (S.moved && !S.acted && !S.intercepted ? '▲▼ choose · A select · B undo move' : '▲▼ choose · A select · B look around'),
  actmenu: () => '▲▼ choose · A select · B back',
  free: () => '✚ look around · B show range / return · A back to unit',
  move: () => '✚ move cursor to a blue tile · A move · B back',
  target: () => (ui.ability && CONFIG.abilities[ui.ability].kind === 'self' ? 'A select (yourself) · B back' : '✚ pick a target in red · A select · B back'),
  confirm: () => 'A execute · B back',
  facing: () => '✚ choose facing · A confirm · B back',
};

function updatePanel() {
  const u = S.active;
  const cu = cursorUnit && S.units ? G.unitAt(S, ui.cursor.x, ui.cursor.y) : null;
  const shown = ui.mode === 'facing' ? u : (showCursor() && cu) || u;
  $('info').innerHTML = shown ? unitInfo(shown) : '';
  let hint = '';
  if (S.over) hint = S.over === 'victory' ? 'Victory!' : 'Defeat.';
  else if (!u || ui.mode === 'busy') hint = u && (u.team === 'enemy' || u.npc) ? `${u.name} is acting…` : '';
  else if (u.team === 'player') hint = (S.skittish && ui.mode === 'menu' ? 'Skittish: too many foes close — move away, no action this turn · ' : '') + (HINTS[ui.mode] || (() => ''))();
  $('hint').textContent = hint;
  // command menu (right side of the field, like FFTA2)
  const cmd = $('cmd');
  if (isPlayerTurn() && (ui.mode === 'menu' || ui.mode === 'actmenu')) {
    const items = menuItems();
    cmd.innerHTML = `<div class="cmd-title">${ui.mode === 'actmenu' ? 'Action' : u.name}</div>` + items.map((it, i) =>
      `<button class="cmd-item ${i === ui.menuIndex ? 'sel' : ''}" data-cmd="${i}" data-id="${it.id}" ${it.on ? '' : 'disabled'}>${it.label}${it.note ? `<small>${it.note}</small>` : ''}</button>`).join('');
    cmd.classList.remove('hidden');
  } else cmd.classList.add('hidden');
  // prediction (middle of the field, like FFTA2)
  const pv = $('pv');
  const tgt = ui.mode === 'confirm' ? ui.target : ui.mode === 'target' ? validTargetAt(ui.cursor.x, ui.cursor.y) : null;
  if (isPlayerTurn() && tgt) { pv.innerHTML = predictionHtml(u, tgt, ui.mode === 'confirm'); pv.className = ui.mode === 'confirm' ? 'confirm' : ''; }
  else pv.className = 'hidden';
  $('facing-tip').className = isPlayerTurn() && ui.mode === 'facing' ? '' : 'hidden';
  updateOrder();
  syncPad();
}

// tap a menu item = highlight + A (stylus behaviour)
$('cmd').addEventListener('pointerdown', (e) => {
  const b = e.target.closest('[data-cmd]'); if (!b || b.disabled || !isPlayerTurn()) return;
  e.preventDefault();
  ui.menuIndex = Number(b.dataset.cmd);
  selectMenuItem(menuItems()[ui.menuIndex]);
});
// v0.12: a tap is press + release on the same button without moving more than tapSlopPx and without the
// card scrolling, so dragging a list to scroll never picks anything (pointercancel = the browser took it as a scroll)
onTap($('ov-text'), '[data-comp]', (b) => {
  if (!picker || picker.kind !== 'missions') return;
  toggleActive(party, b.dataset.comp); saveParty(party);
  const i = picker.index; openPicker('missions'); picker.index = i; syncPicker();
  reset(mapId, { start: false }); // rebuild the idle squad behind the board
});
onTap($('ov-list'), '[data-pick]', (b) => {
  if (!picker || pickerBusy()) return;
  picker.index = Number(b.dataset.pick); syncPicker();
  pickerChoose();
});

// prevent double-tap zoom / pinch on iOS
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

window.addEventListener('resize', () => resize());

if (missionParam && hero) reset(missionParam.map, { mission: missionParam }); // ?mission= (tests) skips the board
else if (mapParam) reset(mapParam.id);      // ?map= skips the title screen
else { reset(mapId, { start: false }); openPicker('title'); }
resize();
requestAnimationFrame(loop);

// ---------------------------------------------------------------- test/debug hook
window.__outremer = {
  get state() { return S; }, get hero() { return hero; }, get creator() { return creatorState(); }, get mode() { return ui.mode; }, get mapId() { return mapId; },
  get picker() { return picker ? { kind: picker.kind, index: picker.index, items: picker.items.map((it) => it.label) } : null; }, get cursor() { return { ...ui.cursor }; },
  get menuIndex() { return ui.menuIndex; }, get lastResult() { return lastResult; },
  get camSettled() { return !cam.follow; }, get padMode() { return padMode(); },
  get ability() { return ui.ability; }, get target() { return ui.target ? ui.target.id : null; },
  get menu() { return isPlayerTurn() && ['menu', 'actmenu'].includes(ui.mode) ? menuItems().map((it) => ({ id: it.id, label: it.label, on: it.on })) : []; },
  abilityPreview(uid, id, tid) { return G.abilityPreview(S, S.units[uid], id, S.units[tid]); },
  tileClient(x, y) { const r = cv.getBoundingClientRect(); const c = tileTop(x, y); return { x: r.left + c.x, y: r.top + c.y }; },
  groundClient(x, y) { const r = cv.getBoundingClientRect(); const c = proj(x, y, 0); return { x: r.left + c.x, y: r.top + c.y }; }, // ignores tile height (screen direction checks)
  unitClient(id) { const u = S.units[id]; const r = cv.getBoundingClientRect(); const p = unitScreenPos(u, performance.now()); return { x: r.left + p.x, y: r.top + p.y - 25 * layout.k }; },
  facingClient(d) { const r = cv.getBoundingClientRect(); const p = facingArrowPos(S.active, d); return { x: r.left + p.x, y: r.top + p.y }; },
  get party() { return JSON.parse(JSON.stringify(party)); }, get mission() { return mission ? mission.id : null; },
  infoHtml(id) { return unitInfo(S.units[id]); }, // the unit info panel's markup for any unit (tests)
  get intents() { return currentIntents().map((i) => ({ from: i.from.id, to: i.to.id })); },
  // auto-resolve for tests: every enemy falls, the battle ends as a victory (normal finish flow)
  forceWin() { if (S.over) return false; for (const u of S.units) if (u.team === 'enemy') u.hp = 0; G.checkOver(S); finish(); return S.over; },
  // ... and a defeat: your whole squad falls (Retry / Back to board)
  forceLose() { if (S.over) return false; for (const u of S.units) if (u.team === 'player' && !u.npc) u.hp = 0; G.checkOver(S); finish(); return S.over; },
  G, CONFIG,
};
