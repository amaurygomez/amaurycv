// Home projects: scroll-driven story (one project at a time) with essential animated diagrams.
// Receives shared helpers from main.js.
export function initProjects(c) {
  var gsap = c.gsap, $ = c.$, $$ = c.$$, clamp = c.clamp, lerp = c.lerp, mulberry32 = c.mulberry32, t = c.t,
    langListeners = c.langListeners, REDUCED = c.REDUCED, hasGsap = c.hasGsap, Ticker = c.Ticker, onceInView = c.onceInView;
  var story = $('#story'); if (!story) return;
  var ANIM = hasGsap && !REDUCED;

  /* ---------- svg + build-up helpers ---------- */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }
  function draw(tl, els, dur, at, each) {
    els.forEach(function (el, i) {
      var L;
      try { L = el.getTotalLength(); } catch { return; }
      if (!L || !isFinite(L)) return;
      tl.fromTo(el, { strokeDasharray: L + ' ' + L, strokeDashoffset: L },
        { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', immediateRender: false, clearProps: 'strokeDasharray,strokeDashoffset' }, at + i * (each || 0));
    });
  }
  function pop(tl, els, at, each, from) {
    if (!els.length) return;
    tl.fromTo(els, { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.8)', immediateRender: false, stagger: { each: each || 0.05, from: from || 0 } }, at);
  }
  function fade(tl, els, at, y, each) {
    if (!els.length) return;
    tl.fromTo(els, { opacity: 0, y: y || 0 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false, stagger: each || 0.06 }, at);
  }

  /* ---------- diagram registry ---------- */
  var diagrams = [];
  function register(svg, api) {
    var d = { svg: svg, on: true, tl: api.tl || null, reset: api.reset || function () {}, built: false };
    // Without animation the static final frame is already rendered: keep it.
    d.play = function () { d.built = true; if (!d.tl) return; d.reset(); d.tl.restart(); };
    if (api.tick) Ticker.add(svg, function (dt, now) { if (d.on) api.tick(dt, now); });
    diagrams.push(d);
    return d;
  }

  /* ---------- diagram 1: coverage map in the CRM ---------- */
  (function () {
    var svg = $('#d1'); if (!svg) return;
    var R = 40, W = Math.sqrt(3) * R, VS = 1.5 * R;
    var title = svgEl('text', { x: 24, y: 34, 'class': 't-ink', 'data-i': 'd1.title' }, svg); title.textContent = t('d1.title');
    var gStreets = svgEl('g', {}, svg);
    var streets = ['M-10 120 C 130 96, 300 176, 530 132', 'M176 -10 C 196 110, 132 250, 206 400', 'M-10 268 C 160 236, 330 306, 530 258']
      .map(function (d) { return svgEl('path', { 'class': 'street', d: d }, gStreets); });
    var gHex = svgEl('g', {}, svg);
    var hexes = [];
    for (var row = 0; row < 4; row++) for (var col = 0; col < 7; col++) {
      var cx = 62 + col * W + (row % 2 ? W / 2 : 0), cy = 96 + row * VS;
      if (Math.hypot((cx - 260) / 1.45, cy - 186) > 132) continue;
      var pts = [];
      for (var k = 0; k < 6; k++) { var ang = Math.PI / 6 + k * Math.PI / 3; pts.push((cx + (R - 3) * Math.cos(ang)).toFixed(1) + ',' + (cy + (R - 3) * Math.sin(ang)).toFixed(1)); }
      var el = svgEl('polygon', { 'class': 'hex', points: pts.join(' ') }, gHex);
      hexes.push({ el: el, cx: cx, cy: cy, id: (row + 1) + String.fromCharCode(65 + col), lit: 0, kind: 0 });
    }
    var gPin = svgEl('g', {}, svg), gIn = svgEl('g', {}, gPin);
    var ring = svgEl('circle', { 'class': 'ring', cx: 0, cy: 0, r: 8 }, gIn);
    var ring2 = svgEl('circle', { 'class': 'ring', cx: 0, cy: 0, r: 8 }, gIn);
    svgEl('circle', { 'class': 'pin-c', cx: 0, cy: 0, r: 10 }, gIn);
    svgEl('circle', { 'class': 'pin', cx: 0, cy: 0, r: 4.5 }, gIn);
    var legend = svgEl('g', {}, svg);
    svgEl('rect', { x: 436, y: 23, width: 11, height: 11, rx: 3, style: 'fill:none;stroke:var(--primary);stroke-dasharray:2.5 2' }, legend);
    var tM = svgEl('text', { x: 496, y: 34, 'text-anchor': 'end', 'data-i': 'd1.mobile' }, legend); tM.textContent = t('d1.mobile');
    svgEl('rect', { x: 366, y: 23, width: 11, height: 11, rx: 3, style: 'fill:var(--primary-soft);stroke:var(--primary)' }, legend);
    var tF = svgEl('text', { x: 424, y: 34, 'text-anchor': 'end', 'data-i': 'd1.fixed' }, legend); tF.textContent = t('d1.fixed');
    var card = svgEl('g', {}, svg);
    svgEl('rect', { x: 24, y: 330, width: 472, height: 44, rx: 8, 'class': 'card' }, card);
    svgEl('circle', { cx: 44, cy: 352, r: 4.5, 'class': 'pin' }, card);
    var zone = svgEl('text', { x: 60, y: 356.5, 'class': 't-ink t-lg' }, card);
    var kind = svgEl('text', { x: 480, y: 356.5, 'text-anchor': 'end', 'class': 't-pri t-lg' }, card);

    var rnd, cur, px, py, tx, ty, timer, ringT, curKind;
    function cardText() {
      zone.textContent = (t('d1.zone') + ' ' + cur.id).toUpperCase();
      kind.textContent = (curKind === 2 ? t('d1.both') : t('d1.only')).toUpperCase();
    }
    langListeners.push(cardText);
    function light(now) {
      cur.lit = now; cur.kind = curKind;
      hexes.forEach(function (h) {
        if (h === cur) return;
        if (Math.hypot(h.cx - cur.cx, h.cy - cur.cy) < W * 1.05 && rnd() < 0.72) { h.lit = now; h.kind = curKind === 2 && rnd() < 0.55 ? 2 : 1; }
      });
      cardText();
    }
    function pickNext(now) {
      var next = hexes[Math.floor(rnd() * hexes.length)];
      if (next === cur) next = hexes[(hexes.indexOf(cur) + 5) % hexes.length];
      cur = next; tx = cur.cx; ty = cur.cy; ringT = 0;
      curKind = rnd() < 0.68 ? 2 : 1;
      light(now);
    }
    function reset() {
      rnd = mulberry32(5);
      hexes.forEach(function (h) { h.lit = 0; h.kind = 0; h.el.classList.remove('fixed', 'mob'); });
      cur = hexes[Math.floor(hexes.length / 2)]; px = tx = cur.cx; py = ty = cur.cy; timer = -0.6; ringT = 0; curKind = 2;
      light(-1);
      gPin.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
    }
    reset();
    function tick(dt, now) {
      timer += dt;
      if (timer > 2.6) { timer = 0; pickNext(now); }
      px = lerp(px, tx, 1 - Math.pow(0.001, dt)); py = lerp(py, ty, 1 - Math.pow(0.001, dt));
      gPin.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
      ringT += dt;
      var r1 = clamp(ringT / 1.3, 0, 1), r2 = clamp((ringT - 0.3) / 1.3, 0, 1);
      ring.setAttribute('r', (8 + r1 * 54).toFixed(1)); ring.style.opacity = (1 - r1) * 0.8;
      ring2.setAttribute('r', (8 + r2 * 54).toFixed(1)); ring2.style.opacity = (1 - r2) * 0.5;
      hexes.forEach(function (h) {
        if (h.lit === -1) h.lit = now || 0.001;
        var on = h.lit && now - h.lit < 7.5;
        if (!on) { h.kind = 0; h.lit = 0; }
        h.el.classList.toggle('fixed', on && h.kind === 2);
        h.el.classList.toggle('mob', on && h.kind >= 1);
      });
    }
    var tl = null;
    if (ANIM) {
      tl = gsap.timeline({ paused: true });
      fade(tl, [title, legend], 0, 6);
      draw(tl, streets, 0.9, 0.05, 0.1);
      pop(tl, hexes.map(function (h) { return h.el; }), 0.15, 0.035, 'center');
      tl.fromTo(gIn, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'bounce.out', immediateRender: false }, 0.8);
      fade(tl, [card], 1.2, 14);
    }
    register(svg, { tl: tl, reset: reset, tick: tick });
  })();

  /* ---------- diagram 2: identity middleware with contingency cache ---------- */
  (function () {
    var svg = $('#d2'); if (!svg) return;
    var paths = ['#d2-p1', '#d2-p2', '#d2-p3', '#d2-p4', '#d2-p5'].map(function (s) { var el = $(s, svg); return { el: el, len: el.getTotalLength() }; });
    var ext2 = $('#d2-ext2', svg), cache = $('#d2-cache', svg), served = $('#d2-served', svg), pool = $('#d2-pk', svg);
    var packets = [], free = [];
    function circle(cls) {
      var el = free.pop() || svgEl('circle', { r: 3.6 }, pool);
      el.setAttribute('class', cls); el.style.display = '';
      return el;
    }
    function spawn(lane, cls, delay) { packets.push({ lane: lane, t: -(delay || 0), speed: 0.55 + Math.random() * 0.15, cls: cls, el: null }); }
    var CYC = 10, spawnT, cacheT, cycle, down;
    function setDown(v) {
      down = v;
      ext2.classList.toggle('down', v); cache.classList.toggle('active', v); served.classList.toggle('on', v);
    }
    function reset() {
      packets.forEach(function (pk) { if (pk.el) { pk.el.style.display = 'none'; free.push(pk.el); } });
      packets = []; spawnT = [-0.9, -0.55, -0.2]; cacheT = 0; cycle = 0; setDown(false);
    }
    reset();
    function tick(dt) {
      cycle = (cycle + dt) % CYC;
      var isDown = cycle > 3.6 && cycle < 7.4;
      if (isDown !== down) setDown(isDown);
      for (var l = 0; l < 3; l++) {
        spawnT[l] += dt;
        if (spawnT[l] > 1.05) { spawnT[l] = 0; if (!(down && l === 1)) spawn(l, 'pkt'); }
      }
      if (down) { cacheT += dt; if (cacheT > 0.7) { cacheT = 0; spawn(4, 'pkt-acc'); } }
      for (var i = packets.length - 1; i >= 0; i--) {
        var pk = packets[i];
        pk.t += dt * pk.speed;
        if (pk.t < 0) continue;
        if (!pk.el) pk.el = circle(pk.cls);
        var ph = paths[pk.lane];
        if (pk.t >= 1) {
          pk.el.style.display = 'none'; free.push(pk.el); packets.splice(i, 1);
          if (pk.lane < 3) spawn(3, 'pkt', 0.12);
          continue;
        }
        var pt = ph.el.getPointAtLength(pk.t * ph.len);
        pk.el.setAttribute('cx', pt.x.toFixed(1)); pk.el.setAttribute('cy', pt.y.toFixed(1));
        pk.el.style.opacity = pk.t < 0.1 ? pk.t * 10 : pk.t > 0.9 ? (1 - pk.t) * 10 : 1;
      }
    }
    if (REDUCED) { cycle = 1.6; for (var w = 0; w < 80; w++) tick(0.05); }
    var tl = null;
    if (ANIM) {
      tl = gsap.timeline({ paused: true });
      pop(tl, [$('#d2-mw', svg)], 0);
      pop(tl, [$('#d2-ext1', svg), ext2, $('#d2-ext3', svg)], 0.15, 0.1);
      draw(tl, [paths[0].el, paths[1].el, paths[2].el], 0.6, 0.4, 0.08);
      fade(tl, [cache], 0.45, 8);
      pop(tl, [$('#d2-app', svg)], 0.65);
      draw(tl, [paths[3].el, paths[4].el], 0.5, 0.75, 0.1);
    }
    register(svg, { tl: tl, reset: reset, tick: tick });
  })();

  /* ---------- diagram 3: quality monitoring ---------- */
  (function () {
    var svg = $('#d3'); if (!svg) return;
    var wave = $('#d3-wave', svg), rec = $('#d3-rec', svg), timer = $('#d3-timer', svg);
    var rows = $$('.row', svg).map(function (g) {
      var lv = $('.lv', g), segs = [];
      for (var k = 0; k < 14; k++) segs.push(svgEl('rect', { x: k * 11, y: 0, width: 7, height: 10, rx: 1.5, 'class': 'lvl' }, lv));
      return { g: g, dot: $('.st', g), label: $('.st-l', g), segs: segs, level: 0.3 + Math.random() * 0.5, target: 0.5, status: +$('.st', g).getAttribute('class').replace(/.*s(\d).*/, '$1') };
    });
    var NPTS = 96, x0 = 24, x1 = 496, mid = 100;
    var seconds = 12 * 60 + 37, secAcc = 0, env = 1, envT = 0.8, speaking = true, lvlT = 0, stT = 0;
    function fmtT(s) { var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r; }
    function tick(dt, now) {
      secAcc += dt; if (secAcc >= 1) { secAcc -= 1; seconds++; timer.textContent = fmtT(seconds); }
      rec.style.opacity = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(now * Math.PI * 2));
      envT -= dt; if (envT <= 0) { speaking = !speaking; envT = speaking ? 0.8 + Math.random() * 1.6 : 0.3 + Math.random() * 0.7; }
      env = lerp(env, speaking ? 1 : 0.06, 1 - Math.pow(0.02, dt));
      var pts = [];
      for (var i = 0; i < NPTS; i++) {
        var u = i / (NPTS - 1), x = x0 + u * (x1 - x0);
        var e = env * (0.55 + 0.45 * Math.sin(u * 6.3 + now * 1.7)) * Math.sin(u * Math.PI);
        var y = Math.sin(x * 0.11 + now * 9.0) * 20 + Math.sin(x * 0.27 - now * 14.0) * 10 + Math.sin(x * 0.045 + now * 3.1) * 14;
        pts.push(x.toFixed(1) + ',' + (mid - y * e).toFixed(1));
      }
      wave.setAttribute('points', pts.join(' '));
      lvlT += dt;
      if (lvlT > 0.9) { lvlT = 0; rows.forEach(function (r) { r.target = r.status === 1 || r.status === 3 ? 0.35 + Math.random() * 0.6 : 0.05 + Math.random() * 0.2; }); }
      rows.forEach(function (r) {
        r.level = lerp(r.level, r.target, 1 - Math.pow(0.05, dt));
        var n = Math.round(r.level * r.segs.length);
        r.segs.forEach(function (s, k) { s.classList.toggle('on', k < n); });
      });
      stT += dt;
      if (stT > 3.2) {
        stT = 0;
        var cand = rows.filter(function (r) { return !r.g.classList.contains('live'); });
        var r = cand[Math.floor(Math.random() * cand.length)];
        var next = 1 + Math.floor(Math.random() * 4);
        if (next === r.status) next = next % 4 + 1;
        r.status = next;
        r.dot.setAttribute('class', 'st s' + next);
        r.label.setAttribute('data-i', 'd3.s' + next);
        r.label.textContent = t('d3.s' + next);
      }
    }
    if (REDUCED) tick(0.5, 1.2);
    var tl = null;
    if (ANIM) {
      tl = gsap.timeline({ paused: true });
      fade(tl, [$('#d3-hdr', svg)], 0, -6);
      draw(tl, [$('.wave-bg', svg), $('#d3-div', svg)], 0.8, 0.1, 0.1);
      fade(tl, [wave], 0.45);
      tl.fromTo(rows.map(function (r) { return r.g; }), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', immediateRender: false, stagger: 0.09 }, 0.4);
      fade(tl, [$('#d3-title', svg)], 0.9);
    }
    register(svg, { tl: tl, tick: tick });
  })();

  /* ---------- story controller ---------- */
  var stage = $('.story-stage', story), curEl = $('#story-cur', story);
  var btns = $$('.story-jump', story);
  var items = $$('.story-item', story).map(function (el, i) { return { el: el, fig: $('.story-fig', el), body: $('.story-body', el), btn: btns[i] }; });
  var N = items.length;
  var pinned = false, cur = -1, leaveT = 0, pinTl = null, st = null;

  function setStep(i) {
    if (i === cur) return;
    var prev = cur; cur = i;
    items.forEach(function (it, k) {
      it.fig.classList.toggle('is-active', k === i); it.body.classList.toggle('is-active', k === i);
      it.fig.classList.toggle('is-leaving', k === prev); it.body.classList.toggle('is-leaving', k === prev);
      if (it.btn) { if (k === i) it.btn.setAttribute('aria-current', 'true'); else it.btn.removeAttribute('aria-current'); }
    });
    clearTimeout(leaveT);
    leaveT = setTimeout(function () { items.forEach(function (it) { it.fig.classList.remove('is-leaving'); it.body.classList.remove('is-leaving'); }); }, 650);
    if (curEl) curEl.textContent = (i < 9 ? '0' : '') + (i + 1);
    diagrams.forEach(function (d, k) { d.on = k === i; if (k === i) d.play(); });
    Ticker.kick();
  }
  function apply(p) {
    if (!pinned) return;
    p = clamp(p, 0, 1);
    story.style.setProperty('--p', p.toFixed(4));
    setStep(clamp(Math.floor(p * N + 0.02), 0, N - 1));
  }
  function navH() {
    var v = 64;
    try { v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64; } catch { /* keep the default */ }
    return v;
  }
  function enterPinned() {
    pinned = true;
    story.classList.add('is-ready');
    cur = -1;
    pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
        start: function () { return 'top top+=' + Math.max(navH() + 16, Math.round((window.innerHeight - stage.offsetHeight) / 2)); },
        end: function () { return '+=' + Math.round(window.innerHeight * 1.8); },
        onUpdate: function (self) { apply(self.progress); },
        onRefresh: function (self) { apply(self.progress); }
      }
    });
    st = pinTl.scrollTrigger;
    apply(st ? st.progress : 0);
  }
  function enterList() {
    pinned = false;
    if (st) { st.kill(true); st = null; }
    if (pinTl) { pinTl.kill(); pinTl = null; }
    story.classList.remove('is-ready');
    story.style.removeProperty('--p');
    clearTimeout(leaveT);
    items.forEach(function (it) {
      it.fig.classList.remove('is-active', 'is-leaving'); it.body.classList.remove('is-active', 'is-leaving');
      if (it.btn) it.btn.removeAttribute('aria-current');
    });
    cur = -1;
    diagrams.forEach(function (d) {
      d.on = true;
      if (!d.built) onceInView(d.svg, function () { if (!pinned && !d.built) d.play(); }, 0.3);
    });
    Ticker.kick();
  }

  var mq = null;
  try { mq = window.matchMedia('(min-width: 901px)'); } catch { /* unavailable: list layout */ }
  function wantPinned() { return ANIM && c.hasST && !!mq && mq.matches; }
  function applyMode() {
    if (wantPinned() && !pinned) enterPinned();
    else if (!wantPinned() && pinned) enterList();
  }
  if (wantPinned()) enterPinned(); else enterList();
  if (mq) {
    var onMq = function () { applyMode(); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  btns.forEach(function (b, i) {
    b.addEventListener('click', function () {
      if (pinned && st) {
        window.scrollTo({ top: Math.round(st.start + (st.end - st.start) * ((i + 0.5) / N)), behavior: REDUCED ? 'auto' : 'smooth' });
      } else if (items[i]) {
        items[i].el.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
      }
    });
  });
}
