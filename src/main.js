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
  ui = { mode: 'busy', cursor: { x: 0, y: 0 }, menu: null, menuIndex: 0, moveInfo: null, target: null, rangeOf: null, lastTap: null };
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
  if ((ui.mode === 'target' || ui.mode === 'confirm') && S.active) {
    for (const t of G.attackTiles(S, S.active)) hl.set(key(t.x, t.y), P.attackHighlight);
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
const isPlayerTurn = () => S.active && S.active.team === 'player' && !S.over && ui.mode !== 'busy';

function setCursor(x, y) {
  ui.cursor = { x: Math.max(0, Math.min(S.w - 1, x)), y: Math.max(0, Math.min(S.h - 1, y)) };
  focusTile(ui.cursor.x, ui.cursor.y);
  updatePanel();
}
const cursorUnit = () => G.unitAt(S, ui.cursor.x, ui.cursor.y);

function menuItems() {
  if (ui.mode === 'actmenu') return [{ id: 'attack', label: 'Attack', on: true }];
  return [
    { id: 'move', label: 'Move', on: !S.moved },
    { id: 'action', label: 'Action', on: !S.acted },
    { id: 'wait', label: 'Wait', on: true },
  ];
}
function openMenu(focusId) {
  const u = S.active;
  ui.mode = 'menu'; ui.target = null; ui.rangeOf = null; ui.lastTap = null;
  const items = menuItems();
  let i = focusId ? items.findIndex((it) => it.id === focusId && it.on) : -1;
  if (i < 0) i = items.findIndex((it) => it.on); // FFTA2: highlight the first available command
  ui.menuIndex = Math.max(0, i);
  setCursor(u.x, u.y);
}
function openActMenu() { ui.mode = 'actmenu'; ui.menuIndex = 0; updatePanel(); }
function enterMove() {
  const u = S.active;
  ui.mode = 'move'; ui.moveInfo = G.reachable(S, u); ui.lastTap = null;
  setCursor(u.x, u.y);
}
function enterTarget() {
  const u = S.active;
  ui.mode = 'target'; ui.target = null; ui.lastTap = null;
  setCursor(u.x, u.y); // FFTA2: cursor starts on the acting unit
}
function enterFacing() { ui.mode = 'facing'; ui.facingTap = null; updatePanel(); }
const validTargetAt = (x, y) => {
  const t = G.unitAt(S, x, y), u = S.active;
  return t && t.team !== u.team && G.canAttackFrom(S, u, u.x, u.y, x, y) ? t : null;
};

function selectMenuItem(it) {
  if (!it || !it.on) return;
  if (it.id === 'move') enterMove();
  else if (it.id === 'action') openActMenu();
  else if (it.id === 'wait') enterFacing();
  else if (it.id === 'attack') enterTarget();
}

function pressDir(d) {
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
  if (!isPlayerTurn() || !(ui.mode === 'menu' || ui.mode === 'actmenu')) return;
  const items = menuItems();
  let i = ui.menuIndex;
  for (let n = 0; n < items.length; n++) { i = (i + step + items.length) % items.length; if (items[i].on) break; }
  ui.menuIndex = i; updatePanel();
}

// which pad layout fits the current state
function padMode() {
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
    $('ab').classList.toggle('off', !isPlayerTurn());
  }
  const f = m === 'facing' ? S.active.facing : null;
  if (f !== padFacing) { padFacing = f; el.querySelectorAll('.lay-face [data-face]').forEach((b) => b.classList.toggle('cur', Number(b.dataset.face) === f)); }
}

function pressA() {
  if (!isPlayerTurn()) return;
  const u = S.active, { x, y } = ui.cursor;
  switch (ui.mode) {
    case 'menu': case 'actmenu': return selectMenuItem(menuItems()[ui.menuIndex]);
    case 'free': return openMenu(); // A: cursor back to the active unit, show commands
    case 'move':
      if (ui.moveInfo.tiles.some((t) => t.x === x && t.y === y) && !(x === u.x && y === u.y)) return doPlayerMove(x, y);
      return;
    case 'target': { const t = validTargetAt(x, y); if (t) { ui.target = t; ui.mode = 'confirm'; updatePanel(); } return; }
    case 'confirm': return doPlayerAttack(ui.target);
    case 'facing': return playerEnd();
  }
}

function pressB() {
  if (!isPlayerTurn()) return;
  const u = S.active;
  switch (ui.mode) {
    case 'menu':
      if (S.moved && !S.acted) { G.undoMove(S, u); return openMenu('move'); } // FFTA2: B undoes the move
      ui.mode = 'free'; ui.rangeOf = null; updatePanel(); return;              // look around the field
    case 'actmenu': return openMenu('action');
    case 'free': {
      const cu = cursorUnit();
      if (cu && cu !== u && ui.rangeOf !== cu) { ui.rangeOf = cu; updatePanel(); return; } // show its move range
      return openMenu();
    }
    case 'move': return openMenu('move');
    case 'target': return openMenu('action');
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
    if (ui.target && hit.x === ui.target.x && hit.y === ui.target.y) return doPlayerAttack(ui.target);
    ui.mode = 'target'; ui.target = null; setCursor(hit.x, hit.y); return;
  }
  if (same && C.tapConfirmsSecondTap) { if (ui.mode === 'menu' || ui.mode === 'actmenu') { ui.mode = 'free'; } return pressA(); }
  if (ui.mode === 'menu' || ui.mode === 'actmenu') ui.mode = 'free';
  setCursor(hit.x, hit.y);
}

async function doPlayerMove(x, y) {
  const u = S.active;
  const path = ui.moveInfo.pathTo(x, y);
  ui.mode = 'busy'; updatePanel();
  await animateMove(u, path);
  G.moveUnit(S, u, x, y, path);
  openMenu(); // menu returns; Move is greyed, B undoes the move
}

async function doPlayerAttack(t) {
  const u = S.active;
  ui.mode = 'busy'; ui.target = null; updatePanel();
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
  const KEYS = { ArrowUp: 0, KeyW: 0, ArrowRight: 1, KeyD: 1, ArrowDown: 2, KeyS: 2, ArrowLeft: 3, KeyA: 3 };
  let last = 0;
  window.addEventListener('keydown', (e) => {
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

function banner(text, team) {
  const b = $('banner'); b.textContent = text; b.className = team;
  return wait(V.turnBannerMs).then(() => { b.className = team + ' hidden'; });
}

async function nextTurn() {
  if (S.over) return finish();
  const u = G.startNextTurn(S);
  ui.mode = 'busy'; ui.rangeOf = null; updatePanel();
  setCursor(u.x, u.y);
  if (u.team === 'player') {
    banner(u.name, 'player');
    openMenu();
  } else {
    await banner(u.name, 'enemy');
    await wait(CONFIG.ai.thinkDelayMs);
    const plan = planTurn(S, u);
    if (plan.path && plan.path.length > 1) {
      await animateMove(u, plan.path);
      G.moveUnit(S, u, plan.tile.x, plan.tile.y, plan.path);
      setCursor(u.x, u.y);
    }
    if (plan.target && G.canAttackFrom(S, u, u.x, u.y, plan.target.x, plan.target.y)) {
      await wait(150);
      await attackSequence(u, plan.target);
    }
    if (S.over) return finish();
    G.faceNearestFoe(S, u);
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
    `<button class="chip ${u.team} ${i === 0 && S.active ? 'now' : ''}" data-uid="${u.id}" title="${u.name}">${roleGlyph(u.role)}<small>${i === 0 ? '' : i}</small></button>`).join('');
}
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
  const terr = Object.entries(r.terrainCost || {}).map(([k, v]) => `${CONFIG.terrain[k].name[0]}${v}`).join(' ');
  return `<div class="row1"><span class="name ${u.team}">${u.name}</span><span class="hpt">HP <b>${u.hp}</b>/${u.maxHp}</span></div>
    <div class="hpbar"><div style="width:${f * 100}%;background:${col}"></div></div>
    <div class="stats"><span>ATK <b>${u.atk}</b></span><span>DEF <b>${u.def}</b></span><span>SPD <b>${u.spd}</b></span>
    <span>MOV <b>${u.move}</b></span><span>JMP <b>${u.jump}</b></span><span>RNG <b>${r.minRange}-${r.maxRange}${r.straightLine ? 'L' : ''}</b></span>
    <span>Face <b>${FACE_ARROW[u.facing]}</b></span>${terr ? `<span>Terr <b>${terr}</b></span>` : ''}</div>`;
}

function predictionHtml(u, t, confirming) {
  const p = G.preview(S, u, t);
  const tags = [];
  tags.push(p.side === 'front' ? 'Front' : `${p.side === 'back' ? 'Back' : 'Side'} +${Math.round((p.facingMod - 1) * 100)}%`);
  if (p.nFlank) tags.push(`Flank ×${p.nFlank} +${Math.round((p.flankMod - 1) * 100)}%`);
  if (p.hAdv) tags.push(`Height ${p.hAdv > 0 ? '+' : ''}${Math.round((p.heightMod - 1) * 100)}%`);
  return `<div class="pv-title">Attack → ${t.name}</div>
    <div class="pv-main"><span>Hit <b>${p.hit}%</b></span><span>Dmg <b>~${p.dmg}</b></span><span>HP ${t.hp}→${Math.max(0, t.hp - p.dmg)}</span></div>
    <div class="pv-tags">${tags.join(' · ')}</div>
    ${confirming ? '<div class="pv-confirm"><b>A</b> Execute &nbsp; <b>B</b> Back</div>' : ''}`;
}

const HINTS = {
  menu: () => (S.moved && !S.acted ? '▲▼ choose · A select · B undo move' : '◆ choose · A select · B look around'),
  actmenu: () => '▲▼ choose · A select · B back',
  free: () => '◆ look around · B show range / return · A back to unit',
  move: () => '◆ move cursor to a blue tile · A move · B back',
  target: () => '◆ pick a foe in red · A select · B back',
  confirm: () => 'A execute · B back',
  facing: () => '◆ choose facing · A confirm · B back',
};

function updatePanel() {
  const u = S.active;
  const cu = cursorUnit && S.units ? G.unitAt(S, ui.cursor.x, ui.cursor.y) : null;
  const shown = ui.mode === 'facing' ? u : (showCursor() && cu) || u;
  $('info').innerHTML = shown ? unitInfo(shown) : '';
  let hint = '';
  if (S.over) hint = S.over === 'victory' ? 'Victory!' : 'Defeat.';
  else if (!u || ui.mode === 'busy') hint = u && u.team === 'enemy' ? `${u.name} is acting…` : '';
  else if (u.team === 'player') hint = (HINTS[ui.mode] || (() => ''))();
  $('hint').textContent = hint;
  // command menu (right side of the field, like FFTA2)
  const cmd = $('cmd');
  if (isPlayerTurn() && (ui.mode === 'menu' || ui.mode === 'actmenu')) {
    const items = menuItems();
    cmd.innerHTML = `<div class="cmd-title">${ui.mode === 'actmenu' ? 'Action' : u.name}</div>` + items.map((it, i) =>
      `<button class="cmd-item ${i === ui.menuIndex ? 'sel' : ''}" data-cmd="${i}" ${it.on ? '' : 'disabled'}>${it.label}</button>`).join('');
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
  get state() { return S; }, get mode() { return ui.mode; }, get cursor() { return { ...ui.cursor }; },
  get menuIndex() { return ui.menuIndex; }, get lastResult() { return lastResult; },
  get camSettled() { return !cam.follow; }, get padMode() { return padMode(); },
  tileClient(x, y) { const r = cv.getBoundingClientRect(); const c = tileTop(x, y); return { x: r.left + c.x, y: r.top + c.y }; },
  unitClient(id) { const u = S.units[id]; const r = cv.getBoundingClientRect(); const p = unitScreenPos(u, performance.now()); return { x: r.left + p.x, y: r.top + p.y - 25 * layout.k }; },
  facingClient(d) { const r = cv.getBoundingClientRect(); const p = facingArrowPos(S.active, d); return { x: r.left + p.x, y: r.top + p.y }; },
  G, CONFIG,
};
