// the bottom control panel (game's pad, in a new "4-way cross" context state)
window.panel = function ({ hint, held = '', dim = '', cap = '▲▼ row · ◀▶ −/+', a = 'select', b = 'back' }) {
  const arm = (c, s) => `<div class="arm ${c} ${held === c ? 'held' : ''} ${dim.includes(c) ? 'dim' : ''}">${s}</div>`;
  return `<div class="panel"><div class="hint">${hint}</div><div class="pad">
    <div><div class="dpad">${arm('u','▲')}${arm('d','▼')}${arm('l','◀')}${arm('r','▶')}<div class="hub">✠</div></div><div class="padcap">${cap}</div></div>
    <div class="ab"><div class="round b">B<small>${b}</small></div><div class="round a">A<small>${a}</small></div></div></div></div>`;
};
