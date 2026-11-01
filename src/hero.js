// Outremer — the created hero (BG1/BG2-style): stat rolls, point redistribution, derived combat stats,
// storage, and PLACEHOLDER portrait art. No DOM access at import time (tools/sim.mjs imports this).
import { CONFIG } from './config.js';

const CR = () => CONFIG.creation;
export const HERO_KEY = 'outremer.hero';
export const statKeys = () => CR().stats.map((s) => s.key);
const towardZero = (v) => (v < 0 ? Math.ceil(v) : Math.floor(v));
export const modOf = (key, field, v) => towardZero((v - CR().neutral) * (CR().perPoint[key][field] || 0));

// lowest value a stat may be lowered to for this class
export const statMin = (role, key) => Math.max(CR().floor, (CR().classMin[role] || {})[key] || 0);

export function rollStats(role, rng = Math.random) {
  const c = CR(), out = {};
  for (const k of statKeys()) {
    let v = 0; for (let i = 0; i < c.dice; i++) v += 1 + Math.floor(rng() * c.sides);
    out[k] = Math.min(c.cap, Math.max(statMin(role, k), v));
  }
  return out;
}
// BG-style redistribution. sheet = { role, stats, pool }. Returns true if it changed.
export function lowerStat(sheet, k) {
  if (sheet.stats[k] <= statMin(sheet.role, k)) return false;
  sheet.stats[k]--; sheet.pool++; return true;
}
export function raiseStat(sheet, k) {
  if (sheet.pool <= 0 || sheet.stats[k] >= CR().cap) return false;
  sheet.stats[k]++; sheet.pool--; return true;
}
export const statTotal = (stats) => statKeys().reduce((a, k) => a + stats[k], 0);

// Hero's battle stats: class base + team statBonus + rolled modifiers.
export function deriveHero(hero, teamBonus = CONFIG.teams.player.statBonus || {}) {
  const c = CR(), r = CONFIG.roles[hero.role], st = hero.stats;
  const b = (k) => r[k] + (teamBonus[k] || 0);
  const hp = Math.max(c.minHp, b('hp') + modOf('end', 'hp', st.end));
  return {
    hp, atk: Math.max(1, b('atk') + modOf('mgt', 'atk', st.mgt)), def: Math.max(0, b('def') + modOf('fort', 'def', st.fort)),
    spd: Math.max(c.minSpd, b('spd') + modOf('agi', 'spd', st.agi)), move: r.move, jump: r.jump,
    hitBonus: modOf('aim', 'hit', st.aim), critBonus: (st.aim - c.neutral) * c.perPoint.aim.crit,
    resist: Math.max(c.resistFloor, modOf('res', 'resist', st.res)),
  };
}
// apply to a unit made by createState (keeps its slot: position + facing)
export function applyHero(u, hero) {
  const d = deriveHero(hero);
  Object.assign(u, { role: hero.role, name: hero.name, hp: d.hp, maxHp: d.hp, atk: d.atk, def: d.def, spd: d.spd,
    move: d.move, jump: d.jump, hitBonus: d.hitBonus, critBonus: d.critBonus, resist: d.resist,
    hero: { portrait: hero.portrait, stats: { ...hero.stats } } });
  return u;
}
export function validHero(h) {
  return !!(h && typeof h.name === 'string' && CR().classes.includes(h.role) && h.stats && statKeys().every((k) => Number.isFinite(h.stats[k])));
}
export function loadHero() {
  try { const h = JSON.parse(localStorage.getItem(HERO_KEY)); if (!validHero(h)) return null; h.name = h.name.replace(/[<>&"`]/g, '').slice(0, CR().nameMaxLen) || CR().defaultNames[0]; return h; } catch (_) { return null; }
}
export function saveHero(h) { try { localStorage.setItem(HERO_KEY, JSON.stringify(h)); } catch (_) { /* private mode */ } }

// ---------------------------------------------------------------- PLACEHOLDER portraits (SVG busts)
// Real portrait art style is an open question (DESIGN.md). These are stand-ins.
const PORTRAITS = [
  { kind: 'greathelm', skin: '#c99b72', cloth: '#ece6d6', bg: '#3a2f3f' },
  { kind: 'kettle', skin: '#b98260', cloth: '#ece6d6', bg: '#2f3a3f', beard: '#5a3a22' },
  { kind: 'bare', skin: '#e0b48e', cloth: '#ece6d6', bg: '#3f342a', hair: '#7a5530', beard: '#7a5530' },
  { kind: 'coif', skin: '#d2a07a', cloth: '#ece6d6', bg: '#2a2f3f' },
  { kind: 'wrap', skin: '#9a6a48', cloth: '#d8d2c0', bg: '#3f2f2a', beard: '#2a1d14' },
  { kind: 'hood', skin: '#c18f68', cloth: '#5a4a3a', bg: '#2a2430', beard: '#3b2a1a' },
  { kind: 'tonsure', skin: '#e3bc98', cloth: '#ece6d6', bg: '#33303f', hair: '#a07850' },
  { kind: 'long', skin: '#8a5a3c', cloth: '#ece6d6', bg: '#2f3a33', hair: '#1f1712' },
];
export const portraitCount = () => Math.min(PORTRAITS.length, CR().portraitCount);
export function portraitSvg(i, { tag = false } = {}) {
  const p = PORTRAITS[((i % PORTRAITS.length) + PORTRAITS.length) % PORTRAITS.length];
  const metal = '#9aa0a8', trim = '#b8141c', dark = '#2b2a30';
  const shoulders = `<path d="M8 100 C10 74 30 66 50 66 C70 66 90 74 92 100 Z" fill="${p.cloth}"/>`;
  const cross = `<path d="M46 74h8v8h8v8h-8v10h-8V90h-8v-8h8z" fill="${trim}"/>`;
  const head = `<ellipse cx="50" cy="44" rx="15" ry="18" fill="${p.skin}"/>`;
  const eyes = `<rect x="42" y="42" width="4" height="2" fill="${dark}"/><rect x="54" y="42" width="4" height="2" fill="${dark}"/>`;
  const beard = p.beard ? `<path d="M36 48 Q50 70 64 48 Q62 60 50 63 Q38 60 36 48Z" fill="${p.beard}"/>` : '';
  let top = '';
  switch (p.kind) {
    case 'greathelm': top = `<path d="M33 30 C33 15 67 15 67 30 L67 60 L33 60 Z" fill="${metal}"/><rect x="36" y="39" width="28" height="3" fill="${dark}"/><rect x="48.5" y="43" width="3" height="12" fill="${dark}"/><path d="M47 22h6v6h-6z" fill="${trim}"/>`; break;
    case 'kettle': top = `<path d="M28 34 Q50 8 72 34 Z" fill="${metal}"/><rect x="25" y="32" width="50" height="5" rx="2" fill="#7e848c"/>`; break;
    case 'bare': top = `<path d="M35 38 C34 22 66 22 65 38 C60 30 40 30 35 38Z" fill="${p.hair}"/>`; break;
    case 'coif': top = `<path d="M31 50 C28 18 72 18 69 50 L69 66 Q50 72 31 66Z" fill="#8c9096"/><ellipse cx="50" cy="46" rx="12" ry="14" fill="${p.skin}"/>`; break;
    case 'wrap': top = `<path d="M32 40 C30 16 70 16 68 40 L66 32 C60 25 40 25 34 32Z" fill="#7a2f2b"/><path d="M30 40 C30 60 34 66 50 68 C66 66 70 60 70 40 C68 52 62 56 50 56 C38 56 32 52 30 40Z" fill="#d8d2c0"/>`; break;
    case 'hood': top = `<path d="M27 56 C22 14 78 14 73 56 C70 36 30 36 27 56Z" fill="#3b3226"/>`; break;
    case 'tonsure': top = `<path d="M34 40 C33 30 37 28 40 34 L60 34 C63 28 67 30 66 40 C64 34 60 32 50 32 C40 32 36 34 34 40Z" fill="${p.hair}"/>`; break;
    case 'long': top = `<path d="M33 46 C30 18 70 18 67 46 L68 64 L62 60 L62 38 C56 32 44 32 38 38 L38 60 L32 64Z" fill="${p.hair}"/>`; break;
  }
  const face = p.kind === 'greathelm' ? '' : eyes + beard;
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-label="placeholder portrait ${i + 1}">
    <rect width="100" height="100" fill="${p.bg}"/><circle cx="50" cy="42" r="36" fill="rgba(255,216,90,.07)"/>${shoulders}${p.kind === 'hood' ? '' : cross}${head}${face}${top}
    ${tag ? '<rect x="2" y="88" width="96" height="11" fill="rgba(232,197,71,.92)"/><text x="50" y="96.5" font-size="8" text-anchor="middle" font-family="system-ui,sans-serif" fill="#1b1a26" letter-spacing="1">PLACEHOLDER</text>' : ''}</svg>`;
}

// ---------------------------------------------------------------- mini iso move preview (class cards)
// A fixed 7×7 test patch with a ledge and some sand/rock; reach uses the class's real MOV, JUMP and terrain costs.
const PATCH_H = [[0,0,0,1,2,2,2],[0,0,0,1,2,3,2],[0,0,0,0,1,2,2],[0,0,0,0,0,1,1],[0,0,0,0,0,0,0],[1,1,0,0,0,0,0],[2,1,0,0,0,0,0]];
const PATCH_T = ['gggrrrr', 'gggrrrr', 'ggggrrr', 'ssgggrr', 'ssggggg', 'rrsgggg', 'rrsgggg'];
export function isoPreviewSvg(role, { tw = 30, lh = 0.42 } = {}) {
  const r = CONFIG.roles[role], N = 7, sx = 3, sy = 3;
  const cost = (x, y) => { const t = PATCH_T[y][x]; return (r.terrainCost && r.terrainCost[t]) ?? CONFIG.terrain[t].cost; };
  const dist = Array.from({ length: N }, () => Array(N).fill(Infinity)); dist[sy][sx] = 0;
  const q = [[sx, sy]];
  while (q.length) {
    q.sort((a, b) => dist[a[1]][a[0]] - dist[b[1]][b[0]]); const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= N || ny >= N || Math.abs(PATCH_H[ny][nx] - PATCH_H[y][x]) > r.jump) continue;
      const d = dist[y][x] + cost(nx, ny);
      if (d <= r.move && d < dist[ny][nx]) { dist[ny][nx] = d; q.push([nx, ny]); }
    }
  }
  const th = tw / 2, L = tw * lh, W = tw * N + 4, H = th * N + L * 4 + 8;
  const tiles = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) tiles.push([x, y]);
  tiles.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const pal = CONFIG.palette.terrain, pts = (a) => a.map((v) => v.map((n) => n.toFixed(1)).join(',')).join(' ');
  let out = '';
  for (const [x, y] of tiles) {
    const h = PATCH_H[y][x], cx = W / 2 + (x - y) * tw / 2, cy = L * 3 + 4 + (x + y) * th / 2 - h * L;
    const me = x === sx && y === sy, reach = dist[y][x] <= r.move, t = pal[PATCH_T[y][x]];
    const top = me ? '#ffd85a' : reach ? '#5aa7e8' : t.top, d = h * L + 3;
    out += `<polygon points="${pts([[cx - tw / 2, cy + th / 2], [cx, cy + th], [cx, cy + th + d], [cx - tw / 2, cy + th / 2 + d]])}" fill="${t.side}"/>`;
    out += `<polygon points="${pts([[cx + tw / 2, cy + th / 2], [cx, cy + th], [cx, cy + th + d], [cx + tw / 2, cy + th / 2 + d]])}" fill="${t.side}" opacity=".8"/>`;
    out += `<polygon points="${pts([[cx, cy], [cx + tw / 2, cy + th / 2], [cx, cy + th], [cx - tw / 2, cy + th / 2]])}" fill="${top}" stroke="rgba(0,0,0,.28)" stroke-width=".7"/>`;
    if (me) out += `<path d="M${cx - 3} ${cy + th / 2 - 15}h6v4h4v5h-4v9h-6v-9h-4v-5h4z" fill="#b8141c" stroke="#ece6d6" stroke-width="1"/>`;
  }
  return `<svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="100%" style="max-width:${W.toFixed(0)}px" aria-label="move range preview">${out}</svg>`;
}
