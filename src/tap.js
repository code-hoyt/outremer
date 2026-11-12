// v0.12: tap vs scroll. Lists on a phone scroll by dragging, and a drag must never pick anything
// (Cletus started a random mission while scrolling the board). A tap is press + release on the same element,
// without moving more than CONFIG.controls.tapSlopPx and without the scroll container moving.
import { CONFIG } from './config.js?v=0.14.2';

export function onTap(root, sel, fn, scroller = () => root.closest('.card') || root) {
  let t = null;
  root.addEventListener('pointerdown', (e) => { const b = e.target.closest(sel); t = b ? { id: e.pointerId, x: e.clientX, y: e.clientY, b, top: scroller().scrollTop } : null; });
  root.addEventListener('pointermove', (e) => { if (t && e.pointerId === t.id && Math.hypot(e.clientX - t.x, e.clientY - t.y) > CONFIG.controls.tapSlopPx) t = null; });
  root.addEventListener('pointercancel', () => { t = null; });
  root.addEventListener('pointerup', (e) => {
    const s0 = t; t = null;
    if (!s0 || e.pointerId !== s0.id || Math.hypot(e.clientX - s0.x, e.clientY - s0.y) > CONFIG.controls.tapSlopPx || Math.abs(scroller().scrollTop - s0.top) > 2) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    if (!hit || hit.closest(sel) !== s0.b) return; // released somewhere else
    e.preventDefault(); fn(s0.b, e);
  });
}
