// Outremer — character-creation wizard (mockup B, picked by Cletus): Portrait → Class → Stats → Name.
// Touch-first. The battle pad (d-pad + A/B) is hidden here; only the Stats step shows a 4-way cross,
// because nudging six numbers up and down is where a held pad beats tapping. See DESIGN.md → d-pad states.
import { CONFIG } from './config.js';
import * as H from './hero.js';
import { onTap } from './tap.js';

const CR = CONFIG.creation;
const $ = (id) => document.getElementById(id);
const STEPS = ['Portrait', 'Class', 'Stats', 'Name'];
let W = null; // wizard state while open
let cb = null;

export const creatorOpen = () => !!W;
export const creatorState = () => (W ? { step: W.step, portrait: W.portrait, role: W.role, stats: { ...W.sheet.stats }, pool: W.sheet.pool, row: W.row, name: W.name, stored: !!W.stored } : null);

export function openCreator(opts) {
  cb = opts;
  const role = CR.classes[0];
  W = { step: 0, portrait: 0, role, sheet: { role, stats: H.rollStats(role), pool: 0 }, row: 0, stored: null,
    name: CR.defaultNames[Math.floor(Math.random() * CR.defaultNames.length)] };
  $('create').classList.remove('hidden');
  render();
}
function close() { W = null; $('create').classList.add('hidden'); $('create').innerHTML = ''; }

function go(step) {
  if (step < 0) { close(); return cb.onCancel(); }
  if (W.step === 3) W.name = ($('cr-name') && $('cr-name').value) || W.name;
  if (step >= STEPS.length) return finish();
  if (step === 2 && W.sheet.role !== W.role) { W.sheet = { role: W.role, stats: H.rollStats(W.role), pool: 0 }; W.stored = null; } // BG: new class = new roll
  W.step = step; render();
}
function finish() {
  const name = (W.name || '').replace(/[<>&"`]/g, '').trim().slice(0, CR.nameMaxLen) || CR.defaultNames[0];
  const hero = { name, role: W.role, portrait: W.portrait, stats: { ...W.sheet.stats } };
  close(); cb.onDone(hero);
}

// ---------------------------------------------------------------- actions (shared by taps, pad and keys)
const A = {
  portrait(i) { W.portrait = i; render(); },
  cls(step) { const n = CR.classes.length; W.role = CR.classes[(CR.classes.indexOf(W.role) + step + n) % n]; render(); },
  setCls(r) { W.role = r; render(); },
  row(step) { W.row = (W.row + step + 6) % 6; render(); },
  lower(k = H.statKeys()[W.row]) { if (!H.lowerStat(W.sheet, k)) { render(); return false; } render(); return true; },
  raise(k = H.statKeys()[W.row]) { if (!H.raiseStat(W.sheet, k)) { render(); return false; } render(); return true; },
  reroll() { W.sheet = { role: W.role, stats: H.rollStats(W.role), pool: 0 }; render(); },
  store() { W.stored = { stats: { ...W.sheet.stats }, pool: W.sheet.pool }; render(); },
  recall() { if (W.stored) { W.sheet = { role: W.role, stats: { ...W.stored.stats }, pool: W.stored.pool }; render(); } },
};

// ---------------------------------------------------------------- rendering
const steps = () => `<div class="cr-steps">${STEPS.map((s, i) =>
  `<button class="cr-st ${i < W.step ? 'done' : i === W.step ? 'now' : ''}" data-step="${i}" ${i < W.step ? '' : 'disabled'}><b>${i + 1}</b>${s}</button>`).join('')}</div>`;
const derivedLine = (d) => `HP <b>${d.hp}</b> · ATK <b>${d.atk}</b> · DEF <b>${d.def}</b> · SPD <b>${d.spd}</b> · MOV <b>${d.move}</b> · JMP <b>${d.jump}</b>
  · Hit <b>${d.hitBonus >= 0 ? '+' : ''}${d.hitBonus}%</b> · Crit <b>${d.critBonus >= 0 ? '+' : ''}${d.critBonus}%</b> · Resist <b>${d.resist}%</b>`;
const sign = (v) => (v > 0 ? '+' + v : v < 0 ? '−' + -v : '±0');

function stepPortrait() {
  return `<div class="cr-q">Who are you?</div>
    <div class="cr-big">${H.portraitSvg(W.portrait, { tag: true })}</div>
    <div class="cr-grid">${Array.from({ length: H.portraitCount() }, (_, i) =>
      `<button class="cr-por ${i === W.portrait ? 'sel' : ''}" data-por="${i}" aria-label="portrait ${i + 1}">${H.portraitSvg(i)}</button>`).join('')}</div>
    <div class="cr-note">Placeholder portraits. Real art style is still to be decided.</div>`;
}
function stepClass() {
  const r = CONFIG.roles[W.role], i = CR.classes.indexOf(W.role);
  const terr = Object.entries(r.terrainCost || {}).map(([k, v]) => `${CONFIG.terrain[k].name} ${v}`).join(', ');
  return `<div class="cr-q">How do you fight?</div>
    <div class="cr-car"><button class="cr-arr" data-cls="-1" aria-label="previous class">◀</button>
    <div class="cr-card" id="cr-card">
      <div class="cr-cname"><h2>${CR.classLabel[W.role]}</h2><span>${i + 1} / ${CR.classes.length}</span></div>
      <div class="cr-role">${CR.classBlurb[W.role]}</div>
      <div class="cr-prev">${H.isoPreviewSvg(W.role)}</div>
      <div class="cr-legend"><span style="color:#5aa7e8">■</span> where you can move · climbs ${r.jump} level${r.jump > 1 ? 's' : ''}${terr ? ` · ${terr}` : ''}</div>
      <div class="cr-mv"><div><b>${r.move}</b>MOV</div><div><b>${r.jump}</b>JUMP</div><div><b>${r.minRange}–${r.maxRange}</b>RANGE</div><div><b>${r.spd}</b>SPD</div></div>
      <div class="cr-abil">${r.abilities.map((a) => `<div><b>${CONFIG.abilities[a].name}</b> <span>— ${CR.abilityBlurb[a] || ''}</span></div>`).join('')}</div>
    </div>
    <button class="cr-arr" data-cls="1" aria-label="next class">▶</button></div>
    <div class="cr-dots">${CR.classes.map((c) => `<button data-setcls="${c}" class="${c === W.role ? 'on' : ''}" aria-label="${CR.classLabel[c]}">●</button>`).join('')}</div>`;
}
function stepStats() {
  const d = H.deriveHero({ role: W.role, stats: W.sheet.stats });
  const der = { mgt: `ATK <b>${d.atk}</b>`, end: `HP <b>${d.hp}</b>`, fort: `DEF <b>${d.def}</b>`, agi: `SPD <b>${d.spd}</b>`,
    aim: `Hit <b>${sign(d.hitBonus)}%</b>`, res: `Res <b>${d.resist}%</b>` };
  const rows = CR.stats.map((s, i) => { const v = W.sheet.stats[s.key];
    const canLo = v > H.statMin(W.role, s.key), canHi = W.sheet.pool > 0 && v < CR.cap;
    return `<div class="cr-row ${i === W.row ? 'sel' : ''}" data-row="${i}"><span class="ab2">${s.short}</span><span class="nm">${s.name}<small>→ ${s.feeds}</small></span>
      <button class="pm" data-lo="${s.key}" ${canLo ? '' : 'disabled'} aria-label="lower ${s.name}">−</button><span class="num ${v >= 15 ? 'hi' : v <= 8 ? 'lo' : ''}" data-val="${s.key}">${v}</span>
      <button class="pm" data-hi="${s.key}" ${canHi ? '' : 'disabled'} aria-label="raise ${s.name}">+</button><span class="der">${der[s.key]}</span></div>`; }).join('');
  return `<div class="cr-who"><span class="cr-mini">${H.portraitSvg(W.portrait)}</span><span><b>${CR.classLabel[W.role]}</b><br><small>Roll, then move points between stats</small></span></div>
    <div class="cr-sheet">${rows}
      <div class="cr-pool"><span>Points to spend <b id="cr-pool">${W.sheet.pool}</b></span><span class="muted">Total <b>${H.statTotal(W.sheet.stats)}</b> · each ${CR.floor}–${CR.cap}</span></div></div>
    <div class="cr-derived">In battle → ${derivedLine(d)}</div>
    <div class="cr-ctl">
      <div class="cr-pad"><div class="xpad" aria-label="stat pad">
        <button class="arm u" data-pad="up" aria-label="previous stat">▲</button><button class="arm d" data-pad="down" aria-label="next stat">▼</button>
        <button class="arm l" data-pad="left" aria-label="take a point">◀</button><button class="arm r" data-pad="right" aria-label="give a point">▶</button><div class="hub">✠</div></div>
        <div class="padcap">▲▼ stat · ◀▶ −/+</div></div>
      <div class="cr-btns"><button class="btn primary" id="cr-reroll">Reroll</button><button class="btn" id="cr-store">Store</button>
        <button class="btn" id="cr-recall" ${W.stored ? '' : 'disabled'}>Recall${W.stored ? `<small>${H.statTotal(W.stored.stats)}</small>` : ''}</button></div>
    </div>`;
}
function stepName() {
  const d = H.deriveHero({ role: W.role, stats: W.sheet.stats });
  return `<div class="cr-q">What are you called?</div>
    <div class="cr-namerow"><input id="cr-name" type="text" maxlength="${CR.nameMaxLen}" value="${W.name.replace(/"/g, '&quot;')}" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" aria-label="hero name"/>
      <button class="btn" id="cr-rname" aria-label="random name">⚄</button></div>
    <div class="cr-sum"><div class="cr-sumpor">${H.portraitSvg(W.portrait, { tag: true })}</div>
      <div><div class="cr-sumname" id="cr-sumname">${esc(W.name)}</div><div class="muted">${CR.classLabel[W.role]} · background fixed (story TBD)</div>
      <div class="cr-sumstats">${CR.stats.map((s) => `<span>${s.short} <b>${W.sheet.stats[s.key]}</b></span>`).join('')}</div></div></div>
    <div class="cr-derived">In battle → ${derivedLine(d)}</div>
    <div class="cr-note">Your hero takes the ${CR.classLabel[W.role]}'s place in the squad. Saved on this device; "New hero" on the title screen starts over.</div>`;
}
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function render() {
  if (!W) return;
  const body = [stepPortrait, stepClass, stepStats, stepName][W.step]();
  const unspent = W.step === 2 && W.sheet.pool > 0 ? ` <small>(${W.sheet.pool} unspent)</small>` : '';
  $('create').innerHTML = `<div class="cr-top"><div class="cr-title">OUTREMER <span>New hero</span></div>${steps()}</div>
    <div class="cr-body step-${W.step}">${body}</div>
    <div class="cr-foot"><button class="btn cr-back" id="cr-back">◀ ${W.step === 0 ? 'Title' : 'Back'}</button>
      <button class="btn primary cr-next" id="cr-next">${W.step === 3 ? 'Begin ✠' : 'Next ▶'}${unspent}</button></div>`;
  wire();
}

// Re-rendering replaces the buttons under the finger, so press-and-hold repeats through one module-level
// timer that a window pointerup stops (same timings as the battle pad). It also stops when nothing changes.
let padTimer = null;
function startRepeat(f, heldSel) {
  stopRepeat();
  const tick = () => { const ok = f(); if (heldSel) { const b = document.querySelector('#create ' + heldSel); if (b) b.classList.add('held'); } if (ok === false) stopRepeat(); };
  tick();
  padTimer = setTimeout(() => { padTimer = setInterval(tick, CONFIG.controls.repeatRateMs); }, CONFIG.controls.repeatDelayMs);
}
function stopRepeat() { clearTimeout(padTimer); clearInterval(padTimer); padTimer = null; document.querySelectorAll('#create .held').forEach((b) => b.classList.remove('held')); }
const PAD = { up: () => A.row(-1), down: () => A.row(1), left: () => A.lower(), right: () => A.raise() };
// a list button armed on pointerdown: a release within tapSlopPx = one step; holding still past repeatDelayMs =
// auto-repeat; moving (or the list scrolling: pointercancel) = nothing happens
let armed = null;
function armPress(e, f, heldSel, scroller) {
  disarm();
  armed = { id: e.pointerId, x: e.clientX, y: e.clientY, f, heldSel, scroller, top: scroller.scrollTop,
    timer: setTimeout(() => { const a = armed; armed = null; if (a) startRepeat(a.f, a.heldSel); }, CONFIG.controls.repeatDelayMs) };
}
function disarm() { if (armed) clearTimeout(armed.timer); armed = null; }
window.addEventListener('pointermove', (e) => { if (armed && e.pointerId === armed.id && (Math.hypot(e.clientX - armed.x, e.clientY - armed.y) > CONFIG.controls.tapSlopPx || armed.scroller.scrollTop !== armed.top)) disarm(); });
window.addEventListener('pointerup', (e) => { if (armed && e.pointerId === armed.id) { const a = armed; disarm(); if (a.scroller.scrollTop === a.top) a.f(); } stopRepeat(); });
window.addEventListener('pointercancel', () => { disarm(); stopRepeat(); });

function wire() {
  const root = $('create'), on = (sel, fn) => root.querySelectorAll(sel).forEach((el) => el.addEventListener('click', (e) => fn(el, e)));
  $('cr-back').onclick = () => go(W.step - 1);
  $('cr-next').onclick = () => go(W.step + 1);
  on('[data-step]', (el) => go(Number(el.dataset.step)));
  on('[data-por]', (el) => A.portrait(Number(el.dataset.por)));
  on('[data-cls]', (el) => A.cls(Number(el.dataset.cls)));
  on('[data-setcls]', (el) => A.setCls(el.dataset.setcls));
  // v0.12: the stat list scrolls on small phones, so rows and the − / ＋ buttons act on a tap or a still hold, never on a drag
  const body = () => root.querySelector('.cr-body') || root;
  root.querySelectorAll('[data-row]').forEach((el) => onTap(el, '[data-row]', (r, e) => { if (!e.target.closest('button')) { W.row = Number(r.dataset.row); render(); } }, body));
  const press = (sel, mk) => root.querySelectorAll(sel).forEach((el) => el.addEventListener('pointerdown', (e) => { e.preventDefault(); const [f, hs] = mk(el); armPress(e, f, hs, body()); }));
  const now = (sel, mk) => root.querySelectorAll(sel).forEach((el) => el.addEventListener('pointerdown', (e) => { e.preventDefault(); const [f, hs] = mk(el); startRepeat(f, hs); }));
  press('[data-lo]', (el) => [() => { W.row = H.statKeys().indexOf(el.dataset.lo); return A.lower(el.dataset.lo); }, `[data-lo="${el.dataset.lo}"]`]);
  press('[data-hi]', (el) => [() => { W.row = H.statKeys().indexOf(el.dataset.hi); return A.raise(el.dataset.hi); }, `[data-hi="${el.dataset.hi}"]`]);
  now('[data-pad]', (el) => [PAD[el.dataset.pad], `[data-pad="${el.dataset.pad}"]`]); // the on-screen pad isn't in the scrolling list: acts on press
  if ($('cr-reroll')) { $('cr-reroll').onclick = A.reroll; $('cr-store').onclick = A.store; $('cr-recall').onclick = A.recall; }
  const card = $('cr-card');
  if (card) { // swipe between classes
    let x0 = null;
    card.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    card.addEventListener('pointerup', (e) => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) >= CR.swipePx) A.cls(dx < 0 ? 1 : -1); });
    card.addEventListener('pointercancel', () => { x0 = null; });
  }
  const inp = $('cr-name');
  if (inp) {
    inp.addEventListener('input', () => { W.name = inp.value; $('cr-sumname').textContent = inp.value || CR.defaultNames[0]; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
    $('cr-rname').onclick = () => { W.name = CR.defaultNames[Math.floor(Math.random() * CR.defaultNames.length)]; inp.value = W.name; $('cr-sumname').textContent = W.name; };
  }
}

// desktop keyboard: arrows steer the current step, Enter = Next, Esc = Back (typing in the name box is left alone)
export function creatorKey(e) {
  if (!W) return false;
  if (e.target && e.target.tagName === 'INPUT') { if (e.key === 'Escape') { e.target.blur(); } return true; }
  const k = e.key;
  if (k === 'Enter' || k === 'z' || k === 'Z' || k === ' ') { e.preventDefault(); go(W.step + 1); return true; }
  if (k === 'Escape' || k === 'x' || k === 'X' || k === 'Backspace') { e.preventDefault(); go(W.step - 1); return true; }
  const dir = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }[k];
  if (!dir) return true;
  e.preventDefault();
  if (W.step === 0) { const n = H.portraitCount(), cols = 4; A.portrait((W.portrait + { left: -1, right: 1, up: -cols, down: cols }[dir] + n) % n); }
  else if (W.step === 1) { if (dir === 'left' || dir === 'right') A.cls(dir === 'left' ? -1 : 1); }
  else if (W.step === 2) PAD[dir]();
  return true;
}
