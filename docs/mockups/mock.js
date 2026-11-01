// Shared placeholder art for the creation mockups: SVG busts and a tiny iso move-range preview.
// PLACEHOLDER ONLY — real portrait style is an open question (DESIGN.md).
window.bust = function (kind, opts = {}) {
  const bg = opts.bg || '#2a2430', skin = opts.skin || '#c99b72', cloth = opts.cloth || '#ece6d6', trim = '#b8141c', metal = '#9aa0a8';
  const head = `<ellipse cx="50" cy="44" rx="15" ry="18" fill="${skin}"/>`;
  const shoulders = `<path d="M10 100 C12 74 30 66 50 66 C70 66 88 74 90 100 Z" fill="${cloth}"/>`;
  const cross = `<path d="M46 74h8v8h8v8h-8v10h-8V90h-8v-8h8z" fill="${trim}"/>`;
  let top = '';
  if (kind === 'knight') top = `<path d="M33 30 C33 16 67 16 67 30 L67 58 L33 58 Z" fill="${metal}"/><rect x="36" y="38" width="28" height="3" fill="#2b2a30"/><rect x="48.5" y="42" width="3" height="12" fill="#2b2a30"/><path d="M47 22h6v6h-6z" fill="${trim}"/>`;
  if (kind === 'sergeant') top = `<path d="M28 34 Q50 10 72 34 Z" fill="${metal}"/><rect x="26" y="32" width="48" height="5" rx="2" fill="#7e848c"/><path d="M36 54 Q50 66 64 54 L64 60 Q50 72 36 60Z" fill="#6b5a44"/>`;
  if (kind === 'archer') top = `<path d="M32 40 C30 18 70 18 68 40 L66 32 C60 26 40 26 34 32Z" fill="#7a2f2b"/><path d="M30 40 C30 60 34 66 50 68 C66 66 70 60 70 40 C68 52 62 56 50 56 C38 56 32 52 30 40Z" fill="#d8d2c0"/>`;
  if (kind === 'skirmisher') top = `<path d="M30 46 C26 18 74 18 70 46 C66 30 34 30 30 46Z" fill="#3b3226"/><path d="M34 52 Q50 62 66 52 L66 64 Q50 70 34 64Z" fill="#3b3226"/>`;
  if (kind === 'monk') top = `<path d="M28 50 C26 14 74 14 72 50 C68 30 32 30 28 50Z" fill="#5a4a3a"/>`;
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="${bg}"/>
    <circle cx="50" cy="40" r="36" fill="rgba(255,216,90,.06)"/>${shoulders}${kind !== 'skirmisher' ? cross : ''}${head}${top}</svg>`;
};
// tiny iso preview: tiles reachable with MOV/JUMP on a fixed 7x7 test patch with a ledge
window.isoPreview = function (mov, jump, opts = {}) {
  const N = 7, H = [
    [0,0,0,1,2,2,2],[0,0,0,1,2,3,2],[0,0,0,0,1,2,2],[0,0,0,0,0,1,1],[0,0,0,0,0,0,0],[1,1,0,0,0,0,0],[2,1,0,0,0,0,0]];
  const sx = 3, sy = 3; const dist = Array.from({length:N},()=>Array(N).fill(99)); dist[sy][sx] = 0; const q = [[sx,sy]];
  while (q.length) { const [x,y] = q.shift(); for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx=x+dx, ny=y+dy;
    if (nx<0||ny<0||nx>=N||ny>=N) continue; if (Math.abs(H[ny][nx]-H[y][x])>jump) continue; const d=dist[y][x]+1;
    if (d<=mov && d<dist[ny][nx]) { dist[ny][nx]=d; q.push([nx,ny]); } } }
  const tw = opts.tw || 26, th = tw/2, lh = tw*(opts.lh || 0.32), W = tw*N+4, Hh = th*N+lh*3+8;
  let out = ''; const tiles = []; for (let y=0;y<N;y++) for (let x=0;x<N;x++) tiles.push([x,y]);
  tiles.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
  for (const [x,y] of tiles) { const h=H[y][x], cx=W/2+(x-y)*tw/2, cy=lh*3+4+(x+y)*th/2-h*lh;
    const reach = dist[y][x] <= mov, me = x===sx&&y===sy;
    const top = me ? '#ffd85a' : reach ? (opts.reach || '#5aa7e8') : (h>=2 ? '#9a948a' : '#7da35a');
    const side = h>=2 ? '#6a645c' : '#5d4632';
    const p = (a)=>a.map(v=>v.join(',')).join(' ');
    out += `<polygon points="${p([[cx-tw/2,cy+th/2],[cx,cy+th],[cx,cy+th+h*lh+3],[cx-tw/2,cy+th/2+h*lh+3]])}" fill="${side}"/>`;
    out += `<polygon points="${p([[cx+tw/2,cy+th/2],[cx,cy+th],[cx,cy+th+h*lh+3],[cx+tw/2,cy+th/2+h*lh+3]])}" fill="${side}" opacity=".8"/>`;
    out += `<polygon points="${p([[cx,cy],[cx+tw/2,cy+th/2],[cx,cy+th],[cx-tw/2,cy+th/2]])}" fill="${top}" stroke="rgba(0,0,0,.25)" stroke-width=".7" ${reach&&!me?'opacity=".92"':''}/>`;
    if (me) out += `<path d="M${cx-3} ${cy+th/2-14}h6v4h4v5h-4v8h-6v-8h-4v-5h4z" fill="#b8141c" stroke="#ece6d6" stroke-width="1"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}">${out}</svg>`;
};
// draft stat model (matches DESIGN.md → Main character & party)
window.STATS = [
  ['MGT','Might','ATK'], ['END','Endurance','HP'], ['FOR','Fortitude','DEF'],
  ['AGI','Agility','SPD (turns)'], ['AIM','Aim','Hit / crit'], ['RES','Resolve','Resist'] ];
window.ROLL = { MGT: 16, END: 15, FOR: 13, AGI: 9, AIM: 11, RES: 12 };
