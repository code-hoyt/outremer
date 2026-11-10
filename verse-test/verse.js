/* Outremer scripture burn feel-test.
   Latin letters burn away one glyph at a time (CSS animation-delay),
   then the KJV English fades in one letter at a time. All timings
   live in CONFIG; the speed slider divides every duration and stagger. */

const CONFIG = {
  // Timing at speed 1 (milliseconds)
  holdLatinMs: 1700,       // Latin sits fully visible before the burn
  burnLetterMs: 580,       // one glyph: flare → char → drift away
  burnStaggerMs: 16,       // delay between letters; scaled to the wave window
  pauseBetweenMs: 380,     // beat of ash after the last Latin letter
  fadeLetterMs: 500,       // one English glyph: glow in and settle
  fadeStaggerMs: 13,       // delay between English letters; also scaled
  lingerEnglishMs: 4500,   // toast reading hold after the reveal, then auto-hide
  toastFadeOutMs: 900,
  // Keep the burn/fade waves in these windows after scaling by text length,
  // so short verses are not sluggish and Eph 6:12 stays around 6–9s total.
  burnWaveMinMs: 2000,
  burnWaveMaxMs: 3450,
  fadeWaveMinMs: 1600,
  fadeWaveMaxMs: 2700,
  // Reduced-motion crossfade
  reducedFadeMs: 700,
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
let index = CONFIG.startIndex;
let hideTimer = 0;
let phaseTimers = [];
let phase = "idle"; // idle | hold | burn | pause | fade | revealed | hidden
let startedAt = 0;
let currentTimings = null;
let reducedMotion = false;
let wellHeight = 0;

function speed() {
  return Math.max(0.25, CONFIG.speed || 1);
}

function glyphCount(text) {
  let n = 0;
  for (const ch of text) if (!/\s/.test(ch)) n++;
  return n;
}

function scaleStagger(base, count, letterMs, minWave, maxWave) {
  if (count <= 1) return base;
  const natural = (count - 1) * base + letterMs;
  const wave = Math.min(maxWave, Math.max(minWave, natural));
  return (wave - letterMs) / (count - 1);
}

function timingsFor(verse, spd) {
  const s = spd == null ? speed() : spd;
  const hold = CONFIG.holdLatinMs / s;
  const burnLetter = CONFIG.burnLetterMs / s;
  const fadeLetter = CONFIG.fadeLetterMs / s;
  const pause = CONFIG.pauseBetweenMs / s;
  const linger = CONFIG.lingerEnglishMs / s;
  const toastFade = CONFIG.toastFadeOutMs / s;
  const nL = glyphCount(verse.latin);
  const nE = glyphCount(verse.english);
  const burnStagger = scaleStagger(
    CONFIG.burnStaggerMs / s, nL, burnLetter,
    CONFIG.burnWaveMinMs / s, CONFIG.burnWaveMaxMs / s
  );
  const fadeStagger = scaleStagger(
    CONFIG.fadeStaggerMs / s, nE, fadeLetter,
    CONFIG.fadeWaveMinMs / s, CONFIG.fadeWaveMaxMs / s
  );
  const burnWave = nL <= 1 ? burnLetter : (nL - 1) * burnStagger + burnLetter;
  const fadeWave = nE <= 1 ? fadeLetter : (nE - 1) * fadeStagger + fadeLetter;
  if (reducedMotion) {
    const fade = CONFIG.reducedFadeMs / s;
    return {
      reduced: true, hold, fade, linger, toastFade,
      burnLetter: 0, burnStagger: 0, burnWave: 0, pause: 0,
      fadeLetter: fade, fadeStagger: 0, fadeWave: fade,
      total: hold + fade, nL, nE,
    };
  }
  return {
    reduced: false,
    hold, burnLetter, burnStagger, burnWave, pause,
    fadeLetter, fadeStagger, fadeWave, linger, toastFade,
    total: hold + burnWave + pause + fadeWave,
    nL, nE,
  };
}

function timings() {
  return timingsFor(currentVerse());
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function wrapLetters(text) {
  let i = 0;
  const html = text.split(/(\s+)/).map((tok) => {
    if (!tok) return "";
    if (/^\s+$/.test(tok)) return tok;
    const letters = [...tok].map((ch) =>
      `<span class="ch" style="--i:${i++}">${escapeHtml(ch)}</span>`
    ).join("");
    return `<span class="word">${letters}</span>`;
  }).join("");
  return { html, count: i };
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
  const lat = wrapLetters(v.latin);
  const eng = wrapLetters(v.english);
  els.latin.innerHTML = lat.html;
  els.english.innerHTML = eng.html;
  els.latin.classList.remove("play", "rm-out");
  els.english.classList.remove("play", "rm-in");
  els.frame.classList.remove("is-hidden");
  return { nL: lat.count, nE: eng.count };
}

function availableVerseHeight() {
  const stage = els.stage.getBoundingClientRect();
  const toast = CONFIG.mode === "toast";
  const chrome = toast ? 92 : 168;
  return Math.max(80, stage.height - chrome);
}

function fitVerses() {
  const toast = CONFIG.mode === "toast";
  let size = toast ? CONFIG.toastFontPx : CONFIG.titleFontPx;
  const min = CONFIG.minFontPx;
  const cap = availableVerseHeight();
  const well = els.well;

  const apply = (px) => {
    els.latin.style.fontSize = px + "px";
    els.english.style.fontSize = px + "px";
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
  wellHeight = h;
  return { fontPx: size, height: h, overflow: tooBig() };
}

function applyCssTimings(t) {
  currentTimings = t;
  const st = els.stage;
  st.style.setProperty("--hold-ms", t.hold + "ms");
  st.style.setProperty("--burn-letter-ms", t.burnLetter + "ms");
  st.style.setProperty("--burn-stagger-ms", t.burnStagger + "ms");
  st.style.setProperty("--pause-ms", t.pause + "ms");
  st.style.setProperty("--fade-letter-ms", t.fadeLetter + "ms");
  st.style.setProperty("--fade-stagger-ms", t.fadeStagger + "ms");
  st.style.setProperty("--burn-wave-ms", t.burnWave + "ms");
  st.style.setProperty("--rm-fade-ms", (t.fade || CONFIG.reducedFadeMs) + "ms");
  els.frame.style.setProperty("--toast-fade-ms", t.toastFade + "ms");
}

function updateSpeedLabel() {
  const t = timings();
  const s = speed();
  els.speedVals.textContent =
    `${s.toFixed(1)}×  ·  ${ (t.total / 1000).toFixed(1)}s  ·  hold ${(t.hold / 1000).toFixed(1)}s  ·  burn ${(t.burnWave / 1000).toFixed(1)}s  ·  fade ${(t.fadeWave / 1000).toFixed(1)}s`;
  els.speed.setAttribute("aria-valuetext", `${s} times`);
}

function setMode(mode) {
  CONFIG.mode = mode === "toast" ? "toast" : "title";
  els.app.dataset.mode = CONFIG.mode;
  els.btnTitle.classList.toggle("on", CONFIG.mode === "title");
  els.btnToast.classList.toggle("on", CONFIG.mode === "toast");
  els.btnTitle.setAttribute("aria-selected", String(CONFIG.mode === "title"));
  els.btnToast.setAttribute("aria-selected", String(CONFIG.mode === "toast"));
}

function clearTimers() {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = 0;
  for (const id of phaseTimers) clearTimeout(id);
  phaseTimers = [];
}

function schedulePhases(t, fromMs) {
  clearTimers();
  const start = fromMs || 0;
  const marks = reducedMotion
    ? [
        [t.hold, "fade"],
        [t.total, "revealed"],
      ]
    : [
        [t.hold, "burn"],
        [t.hold + t.burnWave, "pause"],
        [t.hold + t.burnWave + t.pause, "fade"],
        [t.total, "revealed"],
      ];
  for (const [at, name] of marks) {
    const delay = at - start;
    if (delay <= 0) {
      if (name === "revealed") afterReveal();
      else phase = name;
    } else {
      phaseTimers.push(setTimeout(() => {
        if (name === "revealed") afterReveal();
        else phase = name;
      }, delay));
    }
  }
}

function afterReveal() {
  phase = "revealed";
  if (CONFIG.mode !== "toast") return;
  const t = currentTimings || timings();
  hideTimer = setTimeout(() => {
    phase = "hidden";
    els.frame.classList.add("is-hidden");
  }, t.linger);
}

function letterAnimations() {
  return [
    ...els.latin.getAnimations({ subtree: true }),
    ...els.english.getAnimations({ subtree: true }),
  ];
}

function phaseAt(ms, t) {
  if (reducedMotion) {
    if (ms < t.hold) return "hold";
    if (ms < t.total) return "fade";
    return "revealed";
  }
  if (ms < t.hold) return "hold";
  if (ms < t.hold + t.burnWave) return "burn";
  if (ms < t.hold + t.burnWave + t.pause) return "pause";
  if (ms < t.total) return "fade";
  return "revealed";
}

function freezeAt(ms) {
  const t = currentTimings || timings();
  const clamped = Math.max(0, ms);
  const anims = letterAnimations();
  for (const a of anims) {
    a.currentTime = clamped;
    a.pause();
  }
  phase = phaseAt(clamped, t);
  clearTimers();
  if (phase === "revealed" && CONFIG.mode === "toast") {
    // Screenshots and seeks should keep the toast visible.
  } else {
    els.frame.classList.remove("is-hidden");
  }
}

function armAnimations() {
  els.latin.classList.remove("play", "rm-out");
  els.english.classList.remove("play", "rm-in");
  void els.latin.offsetWidth;
  els.latin.style.transitionDelay = "";
  els.english.style.transitionDelay = "";
  if (reducedMotion) {
    els.latin.style.transitionDelay = currentTimings.hold + "ms";
    els.english.style.transitionDelay = currentTimings.hold + "ms";
    els.latin.classList.add("rm-out");
    els.english.classList.add("rm-in");
  } else {
    els.latin.classList.add("play");
    els.english.classList.add("play");
  }
}

function play(opts) {
  const freezeMs = opts && opts.freezeAt;
  clearTimers();
  renderCopy();
  const fit = fitVerses();
  const t = timings();
  applyCssTimings(t);
  updateSpeedLabel();
  els.frame.classList.remove("is-hidden");
  armAnimations();
  startedAt = performance.now();
  phase = "hold";

  if (freezeMs != null) {
    // A frame lets the CSS animations exist so they can be scrubbed.
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          freezeAt(freezeMs);
          resolve(fit);
        });
      });
    });
  }

  schedulePhases(t, 0);
  return Promise.resolve(fit);
}

function seek(spec) {
  const t = timingsFor(currentVerse());
  let ms = 0;
  if (typeof spec === "number") {
    ms = spec;
  } else if (spec && typeof spec === "object") {
    const p = spec.t != null ? spec.t : (spec.progress != null ? spec.progress : 0);
    if (spec.phase === "hold") ms = 0;
    else if (spec.phase === "burn") ms = t.hold + p * t.burnWave;
    else if (spec.phase === "pause") ms = t.hold + t.burnWave + p * t.pause;
    else if (spec.phase === "fade") ms = t.hold + t.burnWave + t.pause + p * t.fadeWave;
    else if (spec.phase === "revealed") ms = t.total;
    else if (spec.ms != null) ms = spec.ms;
  }
  return play({ freezeAt: ms });
}

function go(delta) {
  index = (index + delta + VERSES.length) % VERSES.length;
  return play();
}

function overflowState() {
  const latin = els.latin;
  const english = els.english;
  const well = els.well.getBoundingClientRect();
  const frame = els.frame.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clipped = (r) => r.left < -1 || r.top < -1 || r.right > vw + 1 || r.bottom > vh + 1;
  return {
    well,
    wellHeight,
    frame,
    latinOverflow: latin.scrollHeight > els.well.clientHeight + 1
      || latin.scrollWidth > els.well.clientWidth + 1,
    englishOverflow: english.scrollHeight > els.well.clientHeight + 1
      || english.scrollWidth > els.well.clientWidth + 1,
    frameClipped: clipped(frame),
    wellClipped: clipped(well),
  };
}

function getState() {
  const t = currentTimings || timings();
  return {
    index,
    id: currentVerse().id,
    mode: CONFIG.mode,
    phase,
    speed: speed(),
    fontPx: parseFloat(els.latin.style.fontSize) || null,
    timings: t,
    elapsed: startedAt ? Math.max(0, performance.now() - startedAt) : 0,
    frameHidden: els.frame.classList.contains("is-hidden"),
    reducedMotion,
    ...overflowState(),
  };
}

function sequenceTable() {
  return VERSES.map((v) => {
    const t = timingsFor(v, 1);
    return {
      id: v.id,
      nL: t.nL,
      nE: t.nE,
      hold: Math.round(t.hold),
      burnWave: Math.round(t.burnWave),
      pause: Math.round(t.pause),
      fadeWave: Math.round(t.fadeWave),
      total: Math.round(t.total),
      burnStagger: Math.round(t.burnStagger * 100) / 100,
      fadeStagger: Math.round(t.fadeStagger * 100) / 100,
    };
  });
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
  });

  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onRm = (e) => { reducedMotion = e.matches; };
  if (mq.addEventListener) mq.addEventListener("change", onRm);
  else if (mq.addListener) mq.addListener(onRm);

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
  timings,
  timingsFor,
  sequenceTable,
  setMode: (m) => { setMode(m); return play(); },
  setIndex: (i) => { index = (i + VERSES.length) % VERSES.length; return play(); },
  getState,
  freezeAt,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
