/* Outremer scripture burn feel-test.
   All timings and visual knobs live in CONFIG. The speed slider
   divides holdLatinMs and burnMs (and linger) by CONFIG.speed. */

const CONFIG = {
  // Timing (milliseconds at speed 1)
  holdLatinMs: 2400,
  burnMs: 3200,
  englishDelayMs: 2000,    // start the English fade late so mid-burn stays readable
  englishFadeMs: 1000,
  lingerEnglishMs: 4800,   // toast stays after the reveal, then auto-hides
  toastFadeOutMs: 900,
  // Burn front, in character-counts
  igniteWindow: 3,         // words alight at once
  charRatio: 0.35,         // fraction of the window before a letter chars
  goneRatio: 0.75,         // fraction of the window before a letter is gone
  // Embers
  maxParticles: 70,
  sparksPerFrame: 1.15,
  // Typography (px). fitVerses() may shrink to minFontPx.
  titleFontPx: 20,
  toastFontPx: 15.5,
  minFontPx: 13,
  // Defaults
  speed: 1,
  mode: "title",           // "title" | "toast"
  startIndex: 0,
};

// Clementine Vulgate (1592/98) and KJV. Psalm 23:4 is Vulgate Psalm 22:4.
// Excerpts match the requested span (Ps 23:4 and Rev 21:5 stop at the first sentence).
const VERSES = [
  {
    id: "eph-6-12",
    kicker: "Act I",
    title: "The Tear",
    toastKicker: "Ground consecrated",
    reference: "Ephesians 6:12",
    latin: "Quoniam non est nobis colluctatio adversus carnem et sanguinem, sed adversus principes, et potestates, adversus mundi rectores tenebrarum harum, contra spiritualia nequitiæ, in cælestibus.",
    english: "For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places.",
  },
  {
    id: "john-1-5",
    kicker: "Act II",
    title: "The Lamp",
    toastKicker: "Ground consecrated",
    reference: "John 1:5",
    latin: "Et lux in tenebris lucet, et tenebræ eam non comprehenderunt.",
    english: "And the light shineth in darkness; and the darkness comprehended it not.",
  },
  {
    id: "ps-23-4",
    kicker: "Act III",
    title: "Two Faces",
    toastKicker: "Ground consecrated",
    reference: "Psalm 23:4",
    referenceSub: "Vulgate 22:4",
    latin: "Nam etsi ambulavero in medio umbræ mortis, non timebo mala, quoniam tu mecum es.",
    english: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.",
  },
  {
    id: "rev-21-5",
    kicker: "The ending",
    title: "The Way Home",
    toastKicker: "Ground consecrated",
    reference: "Revelation 21:5",
    latin: "Et dixit qui sedebat in throno: Ecce nova facio omnia.",
    english: "And he that sat upon the throne said, Behold, I make all things new.",
  },
];

const $ = (id) => document.getElementById(id);
const els = {};
const particles = [];
let index = CONFIG.startIndex;
let raf = 0;
let hideTimer = 0;
let running = false;
let burnStart = 0;
let phase = "idle"; // idle | hold | burn | revealed | hidden
let lastTs = 0;
let canvas, ctx;
let reducedMotion = false;

function effective() {
  const s = Math.max(0.25, CONFIG.speed || 1);
  return {
    hold: CONFIG.holdLatinMs / s,
    burn: CONFIG.burnMs / s,
    engDelay: CONFIG.englishDelayMs / s,
    engFade: CONFIG.englishFadeMs / s,
    linger: CONFIG.lingerEnglishMs / s,
    toastFade: CONFIG.toastFadeOutMs / s,
  };
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function wrapLatin(text) {
  // Burn word-by-word so the fire front does not leave mid-word stumps.
  return text.split(/(\s+)/).map((tok) => {
    if (!tok) return "";
    if (/^\s+$/.test(tok)) return tok.replace(/ /g, " ");
    return `<span class="ch">${escapeHtml(tok)}</span>`;
  }).join("");
}

function currentVerse() {
  return VERSES[index];
}

function renderCopy() {
  const v = currentVerse();
  const toast = CONFIG.mode === "toast";
  els.kicker.textContent = toast ? v.toastKicker : v.kicker;
  els.actTitle.textContent = v.title;
  if (v.referenceSub) {
    els.reference.innerHTML = `${escapeHtml(v.reference)}<span class="sub">${escapeHtml(v.referenceSub)}</span>`;
  } else {
    els.reference.textContent = v.reference;
  }
  els.english.textContent = v.english;
  els.latin.innerHTML = wrapLatin(v.latin);
  els.english.classList.remove("is-in", "is-settled");
  els.english.style.opacity = "";
  els.english.style.filter = "";
  els.english.style.transform = "";
  els.frame.classList.remove("is-hidden");
}

function availableVerseHeight() {
  const stage = els.stage.getBoundingClientRect();
  const toast = CONFIG.mode === "toast";
  // Leave room for kicker, title, filigree, reference, padding.
  const chrome = toast ? 92 : 168;
  return Math.max(80, stage.height - chrome);
}

function fitVerses() {
  const toast = CONFIG.mode === "toast";
  let size = toast ? CONFIG.toastFontPx : CONFIG.titleFontPx;
  const min = CONFIG.minFontPx;
  const cap = availableVerseHeight();
  const well = els.well;
  const verses = [els.latin, els.english];

  const apply = (px) => {
    verses.forEach((p) => { p.style.fontSize = px + "px"; });
  };

  apply(size);
  well.style.height = "auto";

  const tooBig = () => {
    const h = Math.max(els.latin.scrollHeight, els.english.scrollHeight);
    const wOverflow = els.latin.scrollWidth - 1 > well.clientWidth
      || els.english.scrollWidth - 1 > well.clientWidth;
    return h > cap || wOverflow;
  };

  while (size > min && tooBig()) {
    size -= 0.5;
    apply(size);
  }

  const h = Math.max(els.latin.scrollHeight, els.english.scrollHeight);
  well.style.height = h + "px";
  return { fontPx: size, height: h, overflow: tooBig() };
}

function chars() {
  return [...els.latin.querySelectorAll(".ch")];
}

function setLetterProgress(p) {
  const nodes = chars();
  const n = nodes.length;
  if (!n) return;
  const windowN = Math.max(3, CONFIG.igniteWindow);
  const front = p * (n + windowN);
  for (let i = 0; i < n; i++) {
    const d = front - i;
    const el = nodes[i];
    el.classList.remove("ignite", "char", "gone");
    if (d <= 0) continue;
    if (d < windowN * CONFIG.charRatio) el.classList.add("ignite");
    else if (d < windowN * CONFIG.goneRatio) el.classList.add("char");
    else el.classList.add("gone");
  }
}

function englishProgress(p, t) {
  const { engDelay, burn, engFade } = effective();
  const start = engDelay / burn;
  const span = Math.max(0.2, engFade / burn);
  if (p < start) return 0;
  return Math.min(1, (p - start) / span);
}

function applyEnglish(ep) {
  const eng = els.english;
  if (ep <= 0) {
    eng.classList.remove("is-in", "is-settled");
    eng.style.opacity = "0";
    return;
  }
  eng.classList.add("is-in");
  eng.style.setProperty("--eng-ms", "0ms");
  eng.style.opacity = String(ep);
  eng.style.filter = `blur(${(1 - ep) * 2}px)`;
  eng.style.transform = `translateY(${(1 - ep) * 5}px)`;
  if (ep >= 1) eng.classList.add("is-settled");
  else eng.classList.remove("is-settled");
}

function resizeCanvas() {
  if (!canvas) return;
  const rect = els.well.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnFromLetters() {
  const burning = els.latin.querySelectorAll(".ch.ignite");
  if (!burning.length) return;
  const wellRect = els.well.getBoundingClientRect();
  const pick = burning[(Math.random() * burning.length) | 0];
  const r = pick.getBoundingClientRect();
  const x = r.left - wellRect.left + r.width * Math.random();
  const y = r.top - wellRect.top + r.height * 0.35;
  const kind = Math.random() < 0.82 ? "spark" : "smoke";
  if (kind === "spark") {
    particles.push({
      kind, x, y,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.35 - Math.random() * 0.85,
      life: 0,
      max: 420 + Math.random() * 520,
      size: 0.8 + Math.random() * 1.8,
      hue: Math.random() < 0.3 ? "core" : "ember",
    });
  } else {
    particles.push({
      kind, x, y,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.12 - Math.random() * 0.28,
      life: 0,
      max: 700 + Math.random() * 800,
      size: 3 + Math.random() * 5,
    });
  }
  if (particles.length > CONFIG.maxParticles) particles.splice(0, particles.length - CONFIG.maxParticles);
}

function drawParticles(dt) {
  const w = canvas.width;
  const h = canvas.height;
  // css pixels via current transform
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += dt;
    if (p.life >= p.max) { particles.splice(i, 1); continue; }
    const t = p.life / p.max;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.kind === "spark") p.vy -= 0.0004 * dt;
    else { p.vx *= 0.995; p.size += 0.004 * dt; }
    const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    if (p.kind === "spark") {
      ctx.beginPath();
      ctx.fillStyle = p.hue === "core"
        ? `rgba(255, 244, 200, ${0.95 * alpha})`
        : `rgba(255, 140, 50, ${0.85 * alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 80, 20, ${0.28 * alpha})`;
      ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.fillStyle = `rgba(90, 55, 30, ${0.12 * alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  void w; void h;
}

function clearParticles() {
  particles.length = 0;
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function setMode(mode) {
  CONFIG.mode = mode === "toast" ? "toast" : "title";
  els.app.dataset.mode = CONFIG.mode;
  els.btnTitle.classList.toggle("on", CONFIG.mode === "title");
  els.btnToast.classList.toggle("on", CONFIG.mode === "toast");
  els.btnTitle.setAttribute("aria-selected", String(CONFIG.mode === "title"));
  els.btnToast.setAttribute("aria-selected", String(CONFIG.mode === "toast"));
}

function updateSpeedLabel() {
  const t = effective();
  els.speedVals.textContent = `${CONFIG.speed.toFixed(1)}×  ·  hold ${(t.hold / 1000).toFixed(1)}s  ·  burn ${(t.burn / 1000).toFixed(1)}s`;
  els.speed.setAttribute("aria-valuetext", `${CONFIG.speed} times`);
}

function stop() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = 0;
}

function applyProgress(p) {
  const clamped = Math.max(0, Math.min(1, p));
  setLetterProgress(clamped);
  applyEnglish(englishProgress(clamped));
  return clamped;
}

function afterReveal() {
  phase = "revealed";
  applyProgress(1);
  applyEnglish(1);
  if (CONFIG.mode !== "toast") return;
  const t = effective();
  hideTimer = setTimeout(() => {
    phase = "hidden";
    els.frame.classList.add("is-hidden");
  }, t.linger);
}

function tick(ts) {
  if (!running) return;
  raf = requestAnimationFrame(tick);
  const dt = lastTs ? Math.min(64, ts - lastTs) : 16;
  lastTs = ts;
  const t = effective();

  if (phase === "hold") {
    if (ts - burnStart >= t.hold) {
      phase = "burn";
      burnStart = ts;
    }
    drawParticles(dt);
    return;
  }

  if (phase === "burn") {
    const p = (ts - burnStart) / t.burn;
    applyProgress(p);
    const budget = CONFIG.sparksPerFrame * (dt / 16.67);
    let n = budget + (Math.random() < (budget % 1) ? 1 : 0);
    n = Math.floor(n);
    for (let i = 0; i < n; i++) spawnFromLetters();
    drawParticles(dt);
    if (p >= 1) {
      applyProgress(1);
      afterReveal();
    }
    return;
  }

  // revealed: let remaining embers die out
  drawParticles(dt);
}

function play() {
  stop();
  clearParticles();
  renderCopy();
  const fit = fitVerses();
  resizeCanvas();
  applyProgress(0);
  applyEnglish(0);
  els.frame.classList.remove("is-hidden");
  lastTs = 0;

  if (reducedMotion) {
    applyProgress(1);
    applyEnglish(1);
    phase = "revealed";
    if (CONFIG.mode === "toast") afterReveal();
    return fit;
  }

  running = true;
  phase = "hold";
  burnStart = performance.now();
  raf = requestAnimationFrame(tick);
  return fit;
}

/**
 * Jump to a 0–1 burn progress (1 = fully revealed). Used by the Playwright
 * capture and for anyone tuning the feel. Holds/auto-hide are skipped.
 */
function seek(progress) {
  stop();
  renderCopy();
  const fit = fitVerses();
  resizeCanvas();
  els.frame.classList.remove("is-hidden");
  const p = applyProgress(progress);
  applyEnglish(englishProgress(p));
  phase = p <= 0 ? "hold" : p < 1 ? "burn" : "revealed";
  // Seed a few embers so mid-burn screenshots show the fire.
  if (p > 0 && p < 1) {
    for (let i = 0; i < 36; i++) spawnFromLetters();
    if (ctx) {
      for (let k = 0; k < 8; k++) drawParticles(20);
    }
  } else {
    clearParticles();
  }
  return fit;
}

function go(delta) {
  index = (index + delta + VERSES.length) % VERSES.length;
  play();
}

function bind() {
  els.app = $("app");
  els.stage = $("stage");
  els.frame = $("frame");
  els.kicker = $("kicker");
  els.actTitle = $("act-title");
  els.reference = $("reference");
  els.well = $("verse-well");
  els.latin = $("latin");
  els.english = $("english");
  els.btnTitle = $("btn-title");
  els.btnToast = $("btn-toast");
  els.speed = $("speed");
  els.speedVals = $("speed-vals");
  canvas = $("embers");
  ctx = canvas.getContext("2d");

  $("btn-title").addEventListener("click", () => { setMode("title"); play(); });
  $("btn-toast").addEventListener("click", () => { setMode("toast"); play(); });
  $("btn-next").addEventListener("click", () => go(1));
  $("btn-prev").addEventListener("click", () => go(-1));
  $("btn-replay").addEventListener("click", () => play());
  els.speed.addEventListener("input", () => {
    CONFIG.speed = Number(els.speed.value) / 100;
    updateSpeedLabel();
  });

  window.addEventListener("resize", () => {
    fitVerses();
    resizeCanvas();
  });

  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setMode(CONFIG.mode);
  updateSpeedLabel();
}

function boot() {
  bind();
  const start = () => { play(); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
}

window.__verseTest = {
  CONFIG,
  VERSES,
  play,
  seek,
  go,
  setMode: (m) => { setMode(m); play(); },
  setIndex: (i) => { index = (i + VERSES.length) % VERSES.length; play(); },
  getState: () => ({
    index,
    id: currentVerse().id,
    mode: CONFIG.mode,
    phase,
    speed: CONFIG.speed,
    fontPx: parseFloat(els.latin.style.fontSize) || null,
    well: els.well.getBoundingClientRect(),
    latinOverflow: els.latin.scrollHeight > els.well.clientHeight + 1
      || els.latin.scrollWidth > els.well.clientWidth + 1,
    englishOverflow: els.english.scrollHeight > els.well.clientHeight + 1
      || els.english.scrollWidth > els.well.clientWidth + 1,
    frameHidden: els.frame.classList.contains("is-hidden"),
  }),
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
