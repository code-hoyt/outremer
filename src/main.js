// Outremer prototype — rendering, input, and turn flow.
import { CONFIG } from './config.js';
import * as G from './game.js';
import { planTurn } from './ai.js';

const V = CONFIG.view, P = CONFIG.palette;
const $ = (id) => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d');

// ---------------------------------------------------------------- seeded RNG (?seed=N for tests)
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const seedParam = new URLSearchParams(location.search).get('seed');
const makeRng = () => (seedParam ? mulberry32(Number(seedParam)) : Math.random);

// ---------------------------------------------------------------- state
let S, ui, anims, floats, layout;
function reset() {
  S = G.createState(makeRng());
  ui = { mode: 'busy', inspect: null, moveInfo: null, target: null };
  anims = new Map(); floats = [];
  $('overlay').classList.add('hidden');
  nextTurn();
}

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
  const tw = Math.min(((r.width - pad * 2) / (n / 2)) * V.zoom, fitH);
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
function focusOn(u) {
  if (!layout || !u) return;
  const c = { x: -(u.x - u.y) * layout.tw / 2 + (S.w - S.h) * layout.tw / 4, y: 0 };
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
  if (!back) {
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
  ctx.globalAlpha = 1;
}

function render(now) {
  const { w, h } = layout;
  ctx.clearRect(0, 0, w, h);
  // highlights
  const hl = new Map();
  const key = (x, y) => y * S.w + x;
  if (ui.mode === 'move' && ui.moveInfo) for (const t of ui.moveInfo.tiles) hl.set(key(t.x, t.y), P.moveHighlight);
  if ((ui.mode === 'attack' || ui.mode === 'confirm') && S.active) {
    for (const t of G.attackTiles(S, S.active)) hl.set(key(t.x, t.y), P.attackHighlight);
    if (ui.target) hl.set(key(ui.target.x, ui.target.y), P.targetHighlight);
  }
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

function loop(now) {
  if (cam.follow) { cam.x += (cam.tx - cam.x) * V.camFollow; cam.y += (cam.ty - cam.y) * V.camFollow; if (Math.abs(cam.tx - cam.x) < 0.5) cam.follow = false; }
  applyCam(); render(now); requestAnimationFrame(loop);
}

// ---------------------------------------------------------------- picking
function pointInDiamond(px, py, cx, cy, tw) {
  return Math.abs(px - cx) / (tw / 2) + Math.abs(py - cy) / (tw / 4) <= 1;
}
function pick(px, py) {
  // units first (front-most first), using a body-sized box
  const now = performance.now();
  let unitHit = null;
  const us = G.alive(S).map((u) => ({ u, p: unitScreenPos(u, now) })).sort((a, b) => b.p.depth - a.p.depth);
  for (const { u, p } of us) {
    const k = layout.k;
    if (px > p.x - 16 * k && px < p.x + 16 * k && py > p.y - 58 * k && py < p.y + 6 * k) { unitHit = u; break; }
  }
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
  onTap(pick(e.clientX - r.left, e.clientY - r.top));
});

// ---------------------------------------------------------------- player input
const isPlayerTurn = () => S.active && S.active.team === 'player' && !S.over && ui.mode !== 'busy';

function onTap(hit) {
  if (!hit) { if (isPlayerTurn() && ui.mode === 'confirm') { ui.mode = 'attack'; ui.target = null; } updatePanel(); return; }
  const u = S.active;
  if (isPlayerTurn() && ui.mode === 'move' && ui.moveInfo.tiles.some((t) => t.x === hit.x && t.y === hit.y) && !(hit.x === u.x && hit.y === u.y)) {
    doPlayerMove(hit.x, hit.y); return;
  }
  if (isPlayerTurn() && (ui.mode === 'attack' || ui.mode === 'confirm') && hit.unit && hit.unit.team !== u.team &&
      G.canAttackFrom(S, u, u.x, u.y, hit.unit.x, hit.unit.y)) {
    if (ui.mode === 'confirm' && ui.target === hit.unit) { doPlayerAttack(hit.unit); return; }
    ui.mode = 'confirm'; ui.target = hit.unit; ui.inspect = null; updatePanel(); return;
  }
  // otherwise: inspect (select) whatever unit was tapped
  ui.inspect = hit.unit && hit.unit !== u ? hit.unit : null;
  if (ui.mode === 'confirm') { ui.mode = 'attack'; ui.target = null; }
  updatePanel();
}

async function doPlayerMove(x, y) {
  const u = S.active;
  const path = ui.moveInfo.pathTo(x, y);
  ui.mode = 'busy'; ui.inspect = null; updatePanel();
  await animateMove(u, path);
  G.moveUnit(S, u, x, y, path);
  afterPlayerStep();
}

async function doPlayerAttack(t) {
  const u = S.active;
  ui.mode = 'busy'; ui.target = null; updatePanel();
  await attackSequence(u, t);
  afterPlayerStep();
}

function afterPlayerStep() {
  if (S.over) return finish();
  if (S.moved && S.acted) return playerEnd(); // nothing left to do: no extra button press
  enterDefaultMode();
}

function enterDefaultMode() {
  const u = S.active;
  ui.target = null;
  if (!S.acted && G.targetsFrom(S, u).length) ui.mode = 'attack';
  else if (!S.moved) { ui.mode = 'move'; ui.moveInfo = G.reachable(S, u); }
  else ui.mode = 'menu';
  updatePanel();
}

function playerEnd() { ui.mode = 'busy'; G.endTurn(S); updatePanel(); setTimeout(nextTurn, 150); }

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

function banner(text, team) {
  const b = $('banner'); b.textContent = text; b.className = team;
  return wait(V.turnBannerMs).then(() => { b.className = team + ' hidden'; });
}

async function nextTurn() {
  if (S.over) return finish();
  const u = G.startNextTurn(S);
  ui.inspect = null; ui.mode = 'busy'; updatePanel();
  focusOn(u);
  if (u.team === 'player') {
    banner(u.name, 'player');
    enterDefaultMode();
  } else {
    await banner(u.name, 'enemy');
    await wait(CONFIG.ai.thinkDelayMs);
    const plan = planTurn(S, u);
    if (plan.path && plan.path.length > 1) {
      await animateMove(u, plan.path);
      G.moveUnit(S, u, plan.tile.x, plan.tile.y, plan.path);
    }
    if (plan.target && G.canAttackFrom(S, u, u.x, u.y, plan.target.x, plan.target.y)) {
      await wait(150);
      await attackSequence(u, plan.target);
    }
    if (S.over) return finish();
    G.endTurn(S);
    await wait(200);
    nextTurn();
  }
}

function finish() {
  updatePanel();
  const win = S.over === 'victory';
  $('ov-title').textContent = win ? 'VICTORY' : 'DEFEAT';
  $('ov-text').textContent = win ? 'The field is held. Deus vult.' : 'Your company has fallen.';
  setTimeout(() => $('overlay').classList.remove('hidden'), 500);
}

// ---------------------------------------------------------------- HUD
function updateOrder() {
  const list = G.previewOrder(S);
  $('order').innerHTML = list.map((u, i) =>
    `<div class="chip ${u.team} ${i === 0 && S.active ? 'now' : ''}" title="${u.name}">${roleGlyph(u.role)}<small>${i === 0 ? '' : i}</small></div>`).join('');
}
const roleGlyph = (r) => ({ knight: '⚔', sergeant: '↟', archer: '➶', skirmisher: '»' }[r] || '?');

function unitInfo(u) {
  const f = u.hp / u.maxHp;
  const col = f > 0.5 ? P.hpGood : f > 0.25 ? P.hpMid : P.hpLow;
  const r = CONFIG.roles[u.role];
  const terr = Object.entries(r.terrainCost || {}).map(([k, v]) => `${CONFIG.terrain[k].name} ${v}`).join(', ');
  return `<div><span class="name ${u.team}">${u.name}</span><span class="team">${CONFIG.teams[u.team].label} · facing ${FACE_ARROW[u.facing]}</span></div>
    <div class="hpbar"><div style="width:${f * 100}%;background:${col}"></div></div>
    <div class="stats"><span>HP <b>${u.hp}/${u.maxHp}</b></span><span>ATK <b>${u.atk}</b></span><span>DEF <b>${u.def}</b></span>
    <span>SPD <b>${u.spd}</b></span><span>MOV <b>${u.move}</b></span><span>JMP <b>${u.jump}</b></span>
    <span>RNG <b>${r.minRange}-${r.maxRange}${r.straightLine ? ' line' : ''}</b></span>${terr ? `<span>Terrain: ${terr}</span>` : ''}</div>`;
}

function previewHtml(u, t) {
  const p = G.preview(S, u, t);
  const tags = [];
  if (p.side !== 'front') tags.push(`${p.side === 'back' ? 'Back' : 'Side'} +${Math.round((p.facingMod - 1) * 100)}%`);
  if (p.nFlank) tags.push(`Flank ×${p.nFlank} +${Math.round((p.flankMod - 1) * 100)}%`);
  if (p.hAdv) tags.push(`Height ${p.hAdv > 0 ? '+' : ''}${Math.round((p.heightMod - 1) * 100)}%`);
  return `<div class="pv">→ ${t.name}: <b>~${p.dmg}</b> dmg · <b>${p.hit}%</b> hit${tags.length ? ' · ' + tags.join(' · ') : ' · Front'}</div>`;
}

function btn(label, act, opts = {}) {
  return `<button class="btn ${opts.cls || ''}" data-act="${act}" ${opts.disabled ? 'disabled' : ''}>${label}</button>`;
}

function updatePanel() {
  const u = S.active;
  const shown = ui.inspect || u;
  let info = shown ? unitInfo(shown) : '';
  if (ui.mode === 'confirm' && ui.target) info = unitInfo(ui.target) + previewHtml(u, ui.target);
  $('info').innerHTML = info;
  let hint = '', acts = '';
  if (S.over) { hint = S.over === 'victory' ? 'Victory!' : 'Defeat.'; }
  else if (!u || ui.mode === 'busy') { hint = u && u.team === 'enemy' ? `${u.name} is acting…` : ''; }
  else if (u.team === 'player') {
    if (ui.mode === 'move') hint = 'Tap a blue tile to move.';
    else if (ui.mode === 'attack') hint = G.targetsFrom(S, u).length ? 'Tap a foe in red range to aim.' : 'No foe in range from here.';
    else if (ui.mode === 'confirm') hint = 'Tap the foe again or Confirm. Tap elsewhere to cancel.';
    else hint = 'Done? End turn — you\'ll auto-face the nearest foe.';
    if (ui.mode === 'confirm') {
      acts = btn('Confirm', 'confirm', { cls: 'primary' }) + btn('Cancel', 'cancel');
    } else {
      acts = btn('Move', 'move', { cls: ui.mode === 'move' ? 'on' : '', disabled: S.moved }) +
        btn('Attack', 'attack', { cls: ui.mode === 'attack' ? 'on' : '', disabled: S.acted }) +
        btn('End Turn', 'end');
    }
    // optional one-tap facing override (default is automatic)
    const cur = S.manualFacing;
    acts += `<div class="facing"><span>Face</span>${[3, 0, 2, 1].map((d) =>
      `<button class="fbtn ${cur === d ? 'on' : ''}" data-face="${d}" aria-label="face ${FACE_ARROW[d]}">${FACE_ARROW[d]}</button>`).join('')}
      <button class="fbtn ${cur == null ? 'on' : ''}" data-face="auto">auto</button></div>`;
  }
  $('hint').textContent = hint;
  $('actions').innerHTML = acts;
  updateOrder();
}

$('actions').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || !isPlayerTurn()) return;
  const u = S.active;
  if (b.dataset.face) {
    S.manualFacing = b.dataset.face === 'auto' ? null : Number(b.dataset.face);
    if (S.manualFacing != null) u.facing = S.manualFacing;
    updatePanel(); return;
  }
  const act = b.dataset.act;
  if (act === 'move' && !S.moved) { ui.mode = ui.mode === 'move' ? 'menu' : 'move'; ui.moveInfo = G.reachable(S, u); }
  else if (act === 'attack' && !S.acted) { ui.mode = ui.mode === 'attack' ? 'menu' : 'attack'; ui.target = null; }
  else if (act === 'confirm' && ui.target) return doPlayerAttack(ui.target);
  else if (act === 'cancel') { ui.mode = 'attack'; ui.target = null; }
  else if (act === 'end') return playerEnd();
  updatePanel();
});
$('restart').addEventListener('click', reset);

// prevent double-tap zoom / pinch on iOS
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

window.addEventListener('resize', () => resize());

reset();
resize();
requestAnimationFrame(loop);

// ---------------------------------------------------------------- test/debug hook
window.__outremer = {
  get state() { return S; }, get mode() { return ui.mode; }, get lastResult() { return lastResult; },
  get camSettled() { return !cam.follow; },
  tileClient(x, y) { const r = cv.getBoundingClientRect(); const c = tileTop(x, y); return { x: r.left + c.x, y: r.top + c.y }; },
  unitClient(id) { const u = S.units[id]; const r = cv.getBoundingClientRect(); const p = unitScreenPos(u, performance.now()); return { x: r.left + p.x, y: r.top + p.y - 25 * layout.k }; },
  G, CONFIG,
};
