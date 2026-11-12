// Home (/) interactions: ported from the approved prototype.
// Hero city (three.js), scroll reveals, count-ups, animated case diagrams, process rail, ES/EN and theme.
import { I18N } from "./i18n.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initProjects } from "./projects.js";


  /* ---------- utils ---------- */
  var root = document.documentElement;
  var REDUCED = false;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* unavailable: keep the default */ }
  var hasGsap = true;
  var hasST = true;
  if (hasST) { try { gsap.registerPlugin(ScrollTrigger); } catch { hasST = false; } }
  var hasIO = 'IntersectionObserver' in window;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hexRgb(h) {
    h = (h || '#000000').trim().replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mixHex(a, b, t) {
    var x = hexRgb(a), y = hexRgb(b);
    return 'rgb(' + Math.round(lerp(x[0], y[0], t)) + ',' + Math.round(lerp(x[1], y[1], t)) + ',' + Math.round(lerp(x[2], y[2], t)) + ')';
  }
  function rgba(h, a) { var c = hexRgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  /* ---------- theme (light by default; dark only by explicit choice) ---------- */
  function effectiveTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  try { var saved = localStorage.getItem('ag-theme'); if (saved === 'dark') root.setAttribute('data-theme', 'dark'); } catch { /* unavailable: keep the default */ }
  var themeListeners = [];
  function onTheme(fn) { themeListeners.push(fn); }
  function emitTheme() {
    var th = effectiveTheme();
    themeListeners.forEach(function (f) { try { f(th); } catch { /* unavailable: keep the default */ } });
  }
  function tokens() {
    var cs = getComputedStyle(root);
    var g = function (n) { return cs.getPropertyValue(n).trim(); };
    return {
      bg: g('--bg'), surface: g('--surface'), sunken: g('--sunken'), line: g('--line'), lineStrong: g('--line-strong'),
      ink: g('--ink'), ink2: g('--ink-2'), muted: g('--ink-muted'), primary: g('--primary'), accent: g('--accent'),
      success: g('--success'), isLight: effectiveTheme() === 'light'
    };
  }
  $('#theme-btn').addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    if (next === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('ag-theme', next); } catch { /* unavailable: keep the default */ }
    emitTheme();
  });

  /* ---------- i18n ---------- */
  var LANG = 'es';
  function t(k) { var d = I18N[LANG]; return (d && d[k] != null) ? d[k] : (I18N.es[k] || ''); }
  var langListeners = [];
  function applyLang(l, animate) {
    LANG = I18N[l] ? l : 'es';
    root.setAttribute('lang', LANG);
    $$('[data-i]').forEach(function (el) { var v = t(el.getAttribute('data-i')); if (v) el.textContent = v; });
    $$('[data-i-aria]').forEach(function (el) { var v = t(el.getAttribute('data-i-aria')); if (v) el.setAttribute('aria-label', v); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === LANG)); });
    buildH1(animate);
    langListeners.forEach(function (f) { try { f(LANG); } catch { /* unavailable: keep the default */ } });
  }
  $$('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (l === LANG) return;
      applyLang(l, true);
      rememberLang();
      try { history.replaceState(null, '', (l === 'en' ? '/en' : '/') + location.hash); } catch { /* unavailable: keep the default */ }
      document.title = t('meta.title');
    });
  });

  /* ---------- hero copy entrance ---------- */
  var hero = $('#hero');
  var h1 = $('#hero-h1');
  function buildH1(rerun) {
    var words = t('hero.h1').split(' ');
    h1.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w';
      s.style.setProperty('--i', i);
      s.textContent = w;
      h1.appendChild(s);
      if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    if (REDUCED) return;
    if (rerun) { hero.classList.remove('anim'); void hero.offsetWidth; }
    hero.classList.add('anim');
  }
  /* The page is served in its language (/ in Spanish, /en in English); /cv and /world read the same preference. */
  function rememberLang() { try { localStorage.setItem('amaurycv-lang', LANG); } catch { /* unavailable: keep the default */ } }
  applyLang(root.getAttribute('lang') === 'en' ? 'en' : 'es', false);
  rememberLang();

  /* ---------- nav: scrolled state, mobile menu, scrollspy ---------- */
  var nav = $('#nav'), menuBtn = $('#menu-btn'), mobile = $('#mobile-menu');
  var spyLinks = $$('.nav-links a[data-spy]'), ind = $('#nav-ind'), spyCurrent = null;
  function spy() {
    var y = window.scrollY + window.innerHeight * 0.4, active = null;
    spyLinks.forEach(function (a) {
      var s = document.getElementById(a.getAttribute('data-spy'));
      if (s && s.getBoundingClientRect().top + window.scrollY <= y) active = a;
    });
    if (window.scrollY < 120) active = null;
    if (active === spyCurrent) return;
    spyCurrent = active;
    spyLinks.forEach(function (a) { a.classList.toggle('is-active', a === active); });
    if (active) { ind.style.left = active.offsetLeft + 'px'; ind.style.width = active.offsetWidth + 'px'; ind.classList.add('on'); }
    else ind.classList.remove('on');
  }
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 16); spy(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { spyCurrent = null; spy(); });
  langListeners.push(function () { spyCurrent = null; spy(); });
  onScroll();
  function setMenu(open) {
    mobile.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? t('nav.menuClose') : t('nav.menu'));
  }
  menuBtn.addEventListener('click', function () { setMenu(!mobile.classList.contains('is-open')); });
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobile.classList.contains('is-open')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000 && mobile.classList.contains('is-open')) setMenu(false); });

  /* ---------- scroll progress on the nav edge ---------- */
  (function () {
    var bar = $('#progress'); if (!bar || REDUCED) return;
    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--p', max > 0 ? clamp(window.scrollY / max, 0, 1).toFixed(4) : '0');
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  })();

  /* ---------- cursor spotlight on cards ---------- */
  if (!REDUCED) document.addEventListener('pointermove', function (e) {
    var card = e.target && e.target.closest ? e.target.closest('.svc, .ag, .cv, .start') : null;
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- primary button cursor glow ---------- */
  if (!REDUCED) document.addEventListener('pointermove', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.btn-primary') : null;
    if (!b) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    b.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- reveal on scroll (visible by default) ---------- */
  var pendingReveal = [];
  (function () {
    var els = $$('.reveal');
    if (REDUCED) return;
    var vh = window.innerHeight;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > vh * 0.92) { el.classList.add('js-reveal'); pendingReveal.push(el); }
    });
    function show(el) {
      el.classList.add('is-in');
      var i = pendingReveal.indexOf(el);
      if (i > -1) pendingReveal.splice(i, 1);
    }
    if (hasIO) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      pendingReveal.forEach(function (el) { io.observe(el); });
    }
    var ticking = false;
    function check() {
      ticking = false;
      var h = window.innerHeight;
      pendingReveal.slice().forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.95 && r.bottom > 0) show(el);
      });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    setTimeout(check, 400);
    setTimeout(function () { pendingReveal.slice().forEach(show); }, 12000);
  })();

  function onceInView(el, fn, threshold) {
    if (!hasIO || !el) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold || 0.2 });
    io.observe(el);
  }

  /* ---------- metrics count-up ---------- */
  (function () {
    var nums = $$('.metric .num').filter(function (el) { return !el.hasAttribute('data-static'); });
    nums.forEach(function (el) {
      el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
    });
    if (REDUCED || !hasGsap) return;
    onceInView($('.metrics'), function () {
      nums.forEach(function (el, i) {
        var target = +el.getAttribute('data-target'), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
        var o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.4, ease: 'power3.out', delay: i * 0.08, onUpdate: function () { el.textContent = pre + Math.round(o.v) + suf; } });
      });
    }, 0.4);
  })();

  /* ---------- shared ticker for 2D animations ---------- */
  var Ticker = (function () {
    var items = [], raf = 0, last = 0;
    function anyActive() { for (var i = 0; i < items.length; i++) if (items[i].active) return true; return false; }
    function loop(now) {
      raf = 0;
      var dt = Math.max(0, Math.min(0.05, (now - last) / 1000)) || 0;
      last = now;
      for (var i = 0; i < items.length; i++) if (items[i].active) { try { items[i].fn(dt, now / 1000); } catch { items[i].active = false; } }
      if (anyActive() && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    function add(el, fn) {
      var it = { fn: fn, active: false, once: function () { try { fn(0, performance.now() / 1000); } catch { /* unavailable: keep the default */ } } };
      items.push(it);
      if (REDUCED) { it.once(); return it; }
      if (hasIO) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { it.active = e.isIntersecting; if (it.active) kick(); });
        }, { rootMargin: '60px' }).observe(el);
      } else { it.active = true; kick(); }
      return it;
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
    return { add: add, kick: kick };
  })();

  /* ---------- 2D isometric city (AG World card + WebGL fallback) ---------- */
  function isoCity(canvas, cfg) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var N = cfg.size, SP = 4;
    var rnd = mulberry32(cfg.seed || 3);
    var H = new Float32Array(N * N);
    var cx0 = N / 2, cz0 = N / 2;
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      if (i % SP === 0 || j % SP === 0) continue;
      var d = Math.hypot(i - cx0, j - cz0) / (N * 0.6);
      var fall = Math.max(0, 1 - d);
      if (rnd() < 0.1) continue;
      H[i * N + j] = 0.3 + Math.pow(rnd(), 1.7) * (0.5 + 3.6 * fall);
    }
    var M = Math.floor((N - 1) / SP) + 1;
    var nodeI = new Float32Array(M * M);
    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function mkAgent(speed) {
      var d = DIRS[Math.floor(rnd() * 4)];
      return { a: 1 + Math.floor(rnd() * (M - 2)), b: 1 + Math.floor(rnd() * (M - 2)), di: d[0], dj: d[1], t: rnd(), speed: speed, hist: [] };
    }
    var pulses = [];
    for (var p = 0; p < (cfg.pulses || 6); p++) pulses.push(mkAgent(0.9 + rnd() * 0.9));
    var avatar = cfg.avatar ? mkAgent(0.42) : null;
    function stepAgent(ag, dt) {
      ag.t += ag.speed * dt;
      while (ag.t >= 1) {
        ag.t -= 1; ag.a += ag.di; ag.b += ag.dj;
        if (ag.a >= 0 && ag.a < M && ag.b >= 0 && ag.b < M) nodeI[ag.a * M + ag.b] = 1;
        var keep = rnd() < 0.5;
        var na = ag.a + ag.di, nb = ag.b + ag.dj;
        if (!keep || na < 0 || na >= M || nb < 0 || nb >= M) {
          var opts = DIRS.filter(function (d) {
            if (d[0] === -ag.di && d[1] === -ag.dj) return false;
            var x = ag.a + d[0], y = ag.b + d[1];
            return x >= 0 && x < M && y >= 0 && y < M;
          });
          if (!opts.length) opts = [[-ag.di, -ag.dj]];
          var pick = opts[Math.floor(rnd() * opts.length)];
          ag.di = pick[0]; ag.dj = pick[1];
        }
      }
      var x = (ag.a + ag.di * ag.t) * SP + 0.5, z = (ag.b + ag.dj * ag.t) * SP + 0.5;
      x += -ag.dj * 0.22; z += ag.di * 0.22;
      var last = ag.hist[ag.hist.length - 1];
      if (!last || Math.hypot(last[0] - x, last[1] - z) > 0.18) { ag.hist.push([x, z]); if (ag.hist.length > 14) ag.hist.shift(); }
      ag.x = x; ag.z = z;
    }
    var W = 0, Hh = 0, dpr = 1, tile = 10, ox = 0, oy = 0, C = null, staticLayer = null;
    function P(x, z, y) { return [ox + (x - z) * tile / 2, oy + (x + z) * tile / 4 - (y || 0) * tile * 0.5]; }
    function poly(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]); ctx.closePath(); }
    function colors() {
      var T = tokens();
      C = {
        panel: T.sunken, street: T.bg, block: T.isLight ? mixHex(T.sunken, T.line, 0.35) : mixHex(T.sunken, T.surface, 0.55),
        top: T.isLight ? mixHex(T.surface, T.line, 0.2) : mixHex(T.surface, T.lineStrong, 0.5),
        right: T.isLight ? mixHex(T.surface, T.lineStrong, 0.28) : T.surface, left: T.isLight ? mixHex(T.surface, T.lineStrong, 0.55) : mixHex(T.surface, T.sunken, 0.55),
        edge: T.isLight ? T.lineStrong : T.line, win: T.isLight ? mixHex(T.lineStrong, T.ink, 0.25) : mixHex(T.ink, T.primary, 0.4),
        curb: T.isLight ? T.lineStrong : mixHex(T.bg, T.line, 0.7), primary: T.primary, accent: T.accent, isLight: T.isLight
      };
    }
    function buildStatic() {
      staticLayer = document.createElement('canvas');
      staticLayer.width = Math.max(1, Math.round(W * dpr)); staticLayer.height = Math.max(1, Math.round(Hh * dpr));
      var sc = staticLayer.getContext('2d');
      var real = ctx; ctx = sc;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = C.panel; ctx.fillRect(0, 0, W, Hh);
      var s, i, j;
      for (s = 0; s <= 2 * N - 2; s++) for (i = 0; i < N; i++) {
        j = s - i; if (j < 0 || j >= N) continue;
        var street = (i % SP === 0 || j % SP === 0);
        poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]);
        ctx.fillStyle = street ? C.street : C.block; ctx.fill();
        if (street) { ctx.strokeStyle = C.curb; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      for (s = 0; s <= 2 * N - 2; s++) for (i = 0; i < N; i++) {
        j = s - i; if (j < 0 || j >= N) continue;
        var h = H[i * N + j]; if (!h) continue;
        var m = 0.14, x0 = i + m, x1 = i + 1 - m, z0 = j + m, z1 = j + 1 - m;
        ctx.lineWidth = 0.75; ctx.strokeStyle = C.edge;
        poly([P(x1, z0, h), P(x1, z1, h), P(x1, z1, 0), P(x1, z0, 0)]); ctx.fillStyle = C.right; ctx.fill(); ctx.stroke();
        poly([P(x0, z1, h), P(x1, z1, h), P(x1, z1, 0), P(x0, z1, 0)]); ctx.fillStyle = C.left; ctx.fill(); ctx.stroke();
        poly([P(x0, z0, h), P(x1, z0, h), P(x1, z1, h), P(x0, z1, h)]); ctx.fillStyle = C.top; ctx.fill(); ctx.stroke();
        if (h > 1.1 && tile > 14) {
          ctx.fillStyle = C.win;
          var rows = Math.floor((h - 0.35) / 0.34);
          for (var r = 0; r < rows; r++) {
            var y = 0.25 + r * 0.34;
            for (var c = 0; c < 2; c++) {
              var f = (c + 1) / 3;
              var hsh = Math.sin((i * 7 + j * 13 + r * 3 + c * 5) * 12.9898) * 43758.5453; hsh = hsh - Math.floor(hsh);
              if (hsh > 0.62) { var q = P(x1, z0 + (z1 - z0) * f, y); ctx.fillRect(q[0] - 1, q[1] - 1.5, 2, 2.4); }
              hsh = Math.sin((i * 3 + j * 17 + r * 7 + c * 11) * 12.9898) * 43758.5453; hsh = hsh - Math.floor(hsh);
              if (hsh > 0.62) { var q2 = P(x0 + (x1 - x0) * f, z1, y); ctx.fillRect(q2[0] - 1, q2[1] - 1.5, 2, 2.4); }
            }
          }
        }
      }
      ctx = real;
    }
    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = Math.max(1, r.width); Hh = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(Hh * dpr);
      tile = Math.min(W * (cfg.fit || 1.25) / N, Hh * 2.1 / N);
      ox = W / 2 + (cfg.shiftX || 0) * W; oy = Hh / 2 - N * tile / 4 + tile * 0.7;
      if (!C) colors();
      buildStatic();
    }
    function drawDynamic(dt, time) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, Hh);
      ctx.drawImage(staticLayer, 0, 0, W, Hh);
      var k;
      for (k = 0; k < nodeI.length; k++) {
        nodeI[k] *= Math.exp(-dt * 1.8);
        var a = k / M | 0, b = k % M, q = P(a * SP + 0.5, b * SP + 0.5, 0.02);
        ctx.fillStyle = rgba(C.primary, 0.12 + nodeI[k] * 0.85);
        ctx.beginPath(); ctx.arc(q[0], q[1], 1.2 + nodeI[k] * 2.2, 0, Math.PI * 2); ctx.fill();
      }
      function drawAgent(ag, col, size, ring) {
        if (ag.hist.length > 1) {
          for (k = 1; k < ag.hist.length; k++) {
            var a0 = P(ag.hist[k - 1][0], ag.hist[k - 1][1], 0.06), a1 = P(ag.hist[k][0], ag.hist[k][1], 0.06);
            ctx.strokeStyle = rgba(col, 0.55 * k / ag.hist.length); ctx.lineWidth = size * 0.6 * k / ag.hist.length + 0.4;
            ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
          }
        }
        var q = P(ag.x, ag.z, 0.06);
        ctx.fillStyle = rgba(col, 0.22); ctx.beginPath(); ctx.arc(q[0], q[1], size * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(q[0], q[1], size, 0, Math.PI * 2); ctx.fill();
        if (ring) { ctx.strokeStyle = rgba(col, 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(q[0], q[1], size * 2.4 + Math.sin(time * 3) * 0.8, 0, Math.PI * 2); ctx.stroke(); }
      }
      for (k = 0; k < pulses.length; k++) { stepAgent(pulses[k], dt); drawAgent(pulses[k], C.primary, 1.6, false); }
      if (avatar) { stepAgent(avatar, dt); drawAgent(avatar, C.accent, 2.4, true); }
    }
    if ('ResizeObserver' in window) { new ResizeObserver(function () { resize(); if (REDUCED) drawDynamic(0, 0); }).observe(canvas.parentElement); }
    else window.addEventListener('resize', function () { resize(); if (REDUCED) drawDynamic(0, 0); });
    resize();
    if (REDUCED) for (var w = 0; w < 30; w++) { for (var k2 = 0; k2 < pulses.length; k2++) stepAgent(pulses[k2], 0.05); if (avatar) stepAgent(avatar, 0.05); }
    var item = Ticker.add(canvas, drawDynamic);
    onTheme(function () { colors(); buildStatic(); if (REDUCED) item.once(); });
    return item;
  }

  function ctx() {
    return { gsap: gsap, $: $, $$: $$, clamp: clamp, lerp: lerp, mulberry32: mulberry32, rgba: rgba, mixHex: mixHex,
      tokens: tokens, onTheme: onTheme, t: t, langListeners: langListeners, REDUCED: REDUCED, hasGsap: hasGsap, hasST: hasST, hasIO: hasIO,
      Ticker: Ticker, isoCity: isoCity, onceInView: onceInView, hero: hero };
  }
  /* The 3D hero (three.js) is the heaviest part of the page: it loads on its own, after the page is interactive. */
  import('./hero.js').then(function (m) { m.initHero(ctx()); }).catch(function () { /* the page works without the scene */ });

  initProjects(ctx());

  /* ---------- process timeline: pulse travels the rail (scroll scrub + idle loop) ---------- */
  (function () {
    var list = $('#steps'); if (!list) return;
    var steps = $$('.step', list), n = steps.length;
    var P = 0, target = 0, lastScrollT = -10;
    function apply(p) {
      var active = clamp(Math.floor(p), 0, n - 1);
      for (var i = 0; i < n; i++) {
        var f = clamp(p - i, 0, 1);
        steps[i].style.setProperty('--f', f.toFixed(3));
        steps[i].classList.toggle('is-done', f >= 1);
        steps[i].classList.toggle('is-active', i === active && p >= 0);
        steps[i].classList.toggle('is-live', f > 0 && f < 1);
      }
    }
    if (REDUCED) { apply(2.55); return; }
    function fromScroll() {
      var r = list.getBoundingClientRect(), vh = window.innerHeight;
      target = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.45), 0, 1) * (n + 0.4);
    }
    window.addEventListener('scroll', function () { fromScroll(); lastScrollT = performance.now() / 1000; }, { passive: true });
    fromScroll(); P = target; apply(P);
    Ticker.add(list, function (dt, now) {
      if (now - lastScrollT < 1.8) P = lerp(P, target, 1 - Math.pow(0.002, dt));
      else { P += dt * 0.7; if (P > n + 0.6) P = -0.4; }
      apply(P);
    });
  })();

  /* ---------- copy email (every [data-copy] next to its [data-email]) ---------- */
  $$('[data-copy]').forEach(function (btn) {
    var row = btn.closest('.email-row'), emailEl = $('[data-email]', row), label = $('[data-copy-label]', btn), tId = 0;
    function done() {
      label.textContent = t('contact.copied'); btn.classList.add('is-done');
      clearTimeout(tId);
      tId = setTimeout(function () { label.textContent = t('contact.copy'); btn.classList.remove('is-done'); }, 1800);
    }
    function selectFallback() {
      try {
        var range = document.createRange(); range.selectNodeContents(emailEl);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        if (document.execCommand && document.execCommand('copy')) done();
      } catch { /* unavailable: keep the default */ }
    }
    btn.addEventListener('click', function () {
      var txt = emailEl.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(selectFallback);
        else selectFallback();
      } catch { selectFallback(); }
    });
  });
