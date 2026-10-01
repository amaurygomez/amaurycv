// Home hero: 3D city-network (three.js). Receives shared helpers from main.js.
// Look: a white architectural maquette by day (soft hemisphere + key light, contact shadows, thin edge lines)
// and a graphite night model with lit windows after dark. On both, a cobalt data network travels the streets
// of the dense core: street pulses, rooftop links with flowing packets, light beams on the landmarks,
// a radar sweep on the ground and a drifting particle field. Kept to the right of the headline.
/* eslint-disable @typescript-eslint/no-unused-vars -- shared helper bag; each module uses a subset */
export function initHero(c) {
  var THREE = c.THREE, gsap = c.gsap, $ = c.$, $$ = c.$$, clamp = c.clamp, lerp = c.lerp, mulberry32 = c.mulberry32, rgba = c.rgba, mixHex = c.mixHex,
    tokens = c.tokens, onTheme = c.onTheme, t = c.t, langListeners = c.langListeners, REDUCED = c.REDUCED, hasGsap = c.hasGsap, hasST = c.hasST, hasIO = c.hasIO,
    Ticker = c.Ticker, isoCity = c.isoCity, onceInView = c.onceInView, hero = c.hero;
  /* ---------- hero: 3D city-network ---------- */
  (function () {
    var host = $('#hero-scene'), canvas = $('#hero-canvas');
    var state = { scroll: 0, p: 0, mx: 0, my: 0, smx: 0, smy: 0, visible: true, running: false };
    var narrow = window.innerWidth < 720;
    var fine = false;
    try { fine = window.matchMedia('(pointer: fine)').matches; } catch { /* unavailable: keep the default */ }

    function fallback() {
      host.classList.add('is-fallback');
      isoCity(canvas, { size: narrow ? 21 : 29, seed: 11, pulses: narrow ? 6 : 12, fit: narrow ? 1.6 : 1.15, shiftX: narrow ? 0 : 0.12 });
    }

    var renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
      if (!renderer.getContext()) throw new Error('no context');
    } catch { renderer = null; }
    if (!renderer) { fallback(); return; }

    var DPR = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2);
    renderer.setPixelRatio(DPR);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 1, 600);

    var CELL = 6, SW = 1.6, N = 16, half = N * CELL / 2;
    var rnd = mulberry32(7919);

    /* shared uniforms (theme colors are re-set in applyTheme) */
    var U = {
      uBg: { value: new THREE.Color('#FAFAF9') }, uSurface: { value: new THREE.Color('#FFFFFF') }, uSunken: { value: new THREE.Color('#F2F3F6') },
      uLine: { value: new THREE.Color('#E3E5EA') }, uLineStrong: { value: new THREE.Color('#C9CDD6') }, uPrimary: { value: new THREE.Color('#1F4FE0') },
      uAccent: { value: new THREE.Color('#6A3BD6') }, uInk: { value: new THREE.Color('#0B0F19') },
      uShadow: { value: new THREE.Color('#9AA1AE') }, uShadowA: { value: 0.42 }, uEdge: { value: new THREE.Color('#C9CDD6') }, uEdgeA: { value: 0.55 },
      uTime: { value: 0 }, uFogNear: { value: 40 }, uFogFar: { value: 90 }, uCell: { value: CELL }, uHalf: { value: half }, uSW: { value: SW },
      uPx: { value: DPR }, uLight: { value: 1 }, uSun: { value: new THREE.Vector3(0.85, 0.5, 0.12).normalize() }
    };
    var FOG = 'float fogF(vec3 w){ return smoothstep(uFogNear, uFogFar, distance(w, cameraPosition)); }';

    /* ground: off-white plates, streets barely indicated; a radar sweep and a soft core glow travel the grid */
    var groundMat = new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: [
        'varying vec3 vW;',
        'void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uBg,uSurface,uSunken,uLine,uLineStrong,uPrimary,uAccent; uniform float uCell,uHalf,uSW,uFogNear,uFogFar,uLight,uTime;',
        'varying vec3 vW;', FOG,
        'void main(){',
        '  vec2 g = mod(vW.xz + uHalf, uCell); vec2 de = min(g, uCell - g); float ds = min(de.x, de.y);',
        '  float street = 1.0 - smoothstep(uSW*0.5 - 0.06, uSW*0.5 + 0.06, ds);',
        '  vec3 plate = mix(mix(uSurface, uSunken, 0.35), mix(uSurface, uSunken, 0.55), uLight);',
        '  vec3 road  = mix(mix(uBg, uSunken, 0.5), mix(uSunken, uLineStrong, 0.16), uLight);',
        '  vec3 col = mix(plate, road, street);',
        '  float curb = 1.0 - smoothstep(0.0, 0.09, abs(ds - uSW*0.5));',
        '  col = mix(col, uLine, curb * mix(0.35, 0.5, uLight));',
        '  float rr = length(vW.xz);',
        '  float inCity = 1.0 - smoothstep(uHalf - 2.0, uHalf + 8.0, max(abs(vW.x), abs(vW.z)));',
        /* night: streets carry a faint cobalt light and the core glows from below */
        '  float night = 1.0 - uLight;',
        '  col += uPrimary * street * 0.10 * night;',
        '  col += uPrimary * (1.0 - smoothstep(0.0, uHalf * 0.95, rr)) * 0.09 * night;',
        /* radar sweep: a ring expanding from the core every few seconds */
        '  float ringR = mod(uTime * 13.0, 120.0);',
        '  float ring = exp(-pow((rr - ringR) * 0.38, 2.0)) * (1.0 - smoothstep(50.0, 115.0, ringR));',
        '  col = mix(col, uPrimary, ring * mix(0.14, 0.5, night));',
        /* holographic grid: street centre lines glow at night */
        '  float centre = 1.0 - smoothstep(0.0, 0.14, ds);',
        '  col += uPrimary * centre * 0.35 * night * (0.6 + 0.4 * sin(uTime * 0.8 + rr * 0.12));',
        '  col = mix(uBg, col, inCity);',
        '  col = mix(col, uBg, fogF(vW));',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.renderOrder = 0;
    scene.add(ground);

    /* city layout: dense tall core at the origin, low periphery, a few slender landmarks */
    var lots = [];
    var inner = CELL - SW, lotSz = inner / 2, gap = 0.34;
    function addLot(x, z, w, d, h, seed) { lots.push({ x: x, z: z, w: w, d: d, h: h, seed: seed }); }
    for (var bi = 0; bi < N; bi++) for (var bj = 0; bj < N; bj++) {
      var bx = -half + bi * CELL + CELL / 2, bz = -half + bj * CELL + CELL / 2;
      var dist = Math.hypot(bx, bz) / (half * 0.98);
      var fall = Math.pow(Math.max(0, 1 - dist), 1.7);
      if (dist > 0.62 && rnd() < 0.42) continue; /* open lots on the periphery */
      var r = rnd();
      if (r < 0.22 + fall * 0.3) {
        /* one tower per block */
        var ms = inner - gap * 2;
        var th = 2.5 + Math.pow(rnd(), 1.35) * (3 + 15 * fall);
        var tw = ms * (0.72 + rnd() * 0.24), td = ms * (0.72 + rnd() * 0.24);
        addLot(bx, bz, tw, td, th, rnd());
        if (th > 9 && rnd() < 0.5) addLot(bx, bz, tw * 0.62, td * 0.62, th * (1.14 + rnd() * 0.12), rnd()); /* setback crown */
      } else if (r < 0.42 + fall * 0.2) {
        /* two slabs */
        var vert = rnd() < 0.5;
        for (var si = 0; si < 2; si++) {
          if (rnd() < 0.1) continue;
          var sh = 1.6 + Math.pow(rnd(), 1.6) * (2.5 + 9 * fall);
          var sx = vert ? bx - inner / 2 + lotSz / 2 + si * lotSz : bx, sz = vert ? bz : bz - inner / 2 + lotSz / 2 + si * lotSz;
          var sw = vert ? lotSz - gap : inner - gap * 2, sd = vert ? inner - gap * 2 : lotSz - gap;
          addLot(sx, sz, sw * (0.86 + rnd() * 0.14), sd * (0.86 + rnd() * 0.14), sh, rnd());
        }
      } else {
        /* four lots */
        for (var li = 0; li < 2; li++) for (var lj = 0; lj < 2; lj++) {
          if (rnd() < 0.18) continue;
          var lx = bx - inner / 2 + lotSz / 2 + li * lotSz, lz = bz - inner / 2 + lotSz / 2 + lj * lotSz;
          var h = 1.2 + Math.pow(rnd(), 1.8) * (1.5 + 7 * fall);
          var s = lotSz - gap;
          addLot(lx, lz, s * (0.78 + rnd() * 0.22), s * (0.78 + rnd() * 0.22), h, rnd());
        }
      }
    }
    /* landmarks: three slender towers close to the core */
    var landmarks = [];
    [[1, 0], [-1, 1], [0, -2]].forEach(function (o, k) {
      var cx = o[0] * CELL, cz = o[1] * CELL, ms2 = inner - gap * 2;
      for (var q = lots.length - 1; q >= 0; q--) if (Math.abs(lots[q].x - cx) < CELL / 2 && Math.abs(lots[q].z - cz) < CELL / 2) lots.splice(q, 1);
      var lh = 21 - k * 2.5, lw = ms2 * 0.58, ld = ms2 * 0.66;
      addLot(cx, cz, lw, ld, lh, rnd());
      addLot(cx, cz, lw * 0.7, ld * 0.7, lh * 1.12, rnd());
      landmarks.push({ x: cx, z: cz, h: lh * 1.12 });
    });

    var boxGeo = new THREE.BoxGeometry(1, 1, 1);
    boxGeo.translate(0, 0.5, 0);
    var seeds = new Float32Array(lots.length), hts = new Float32Array(lots.length);
    lots.forEach(function (l, i) { seeds[i] = l.seed; hts[i] = l.h; });
    boxGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    boxGeo.setAttribute('aH', new THREE.InstancedBufferAttribute(hts, 1));
    var bMat = new THREE.ShaderMaterial({
      uniforms: U,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2,
      vertexShader: [
        'attribute float aSeed; attribute float aH;',
        'varying vec3 vW; varying vec3 vN; varying float vTop; varying float vSeed; varying float vH;',
        'void main(){',
        '  vec4 lp = instanceMatrix * vec4(position, 1.0);',
        '  vec4 wp = modelMatrix * lp; vW = wp.xyz;',
        '  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);',
        '  vTop = position.y; vSeed = aSeed; vH = aH;',
        '  gl_Position = projectionMatrix * viewMatrix * wp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uBg,uSurface,uSunken,uLine,uLineStrong,uInk,uSun,uPrimary,uAccent; uniform float uFogNear,uFogFar,uLight,uTime;',
        'varying vec3 vW; varying vec3 vN; varying float vTop; varying float vSeed; varying float vH;', FOG,
        'void main(){',
        '  vec3 n = normalize(vN);',
        '  float ndl = max(dot(n, uSun), 0.0);',
        '  float wall = 1.0 - step(0.5, n.y);',
        /* procedural windows on every wall: a grid of panes, each one lit or dark by a stable hash */
        '  float sideX = step(0.5, abs(n.x));',
        '  float hc = mix(vW.x, vW.z, sideX);',
        '  vec2 cell = vec2(hc / 0.78, vW.y / 0.92);',
        '  vec2 cf = fract(cell); vec2 ci = floor(cell);',
        '  float wx = step(0.24, cf.x) - step(0.76, cf.x);',
        '  float wy = step(0.30, cf.y) - step(0.72, cf.y);',
        '  float band = step(0.5, vW.y) * (1.0 - step(vH - 0.45, vW.y));',
        '  float win = wx * wy * wall * band;',
        '  float hsh = fract(sin(dot(ci + vec2(vSeed * 91.7, n.x * 3.1 + n.z * 7.3), vec2(12.9898, 78.233))) * 43758.5453);',
        '  float lit = smoothstep(0.52, 0.60, hsh + 0.05 * sin(uTime * 0.6 + hsh * 60.0));',
        /* light: white foam-board maquette. tops white, sun-facing walls warm-white, shade walls cool gray */
        '  float lighting = mix(0.30 + 0.5 * ndl, 0.97, step(0.5, n.y));',
        '  lighting += (vSeed - 0.5) * 0.04;',
        '  vec3 albedoL = uSurface;',
        '  vec3 shadeL = mix(uLineStrong, uLine, 0.2);',
        '  vec3 colL = mix(shadeL, albedoL, clamp(lighting, 0.0, 1.0));',
        '  float aoL = (1.0 - smoothstep(0.0, 2.6, vW.y)) * (1.0 - step(0.5, n.y));',
        '  colL = mix(colL, mix(uLineStrong, uInk, 0.08), aoL * 0.28);',
        '  colL = mix(colL, mix(colL, uLineStrong, 0.55), win * 0.55);',
        '  colL = mix(colL, mix(colL, uPrimary, 0.22), win * lit * 0.5);',
        /* dark: graphite model, tops catch a faint sky, windows glow cobalt-white */
        '  vec3 litD = mix(uSurface, uLineStrong, 0.8);',
        '  vec3 shadeD = mix(uSunken, uSurface, 0.35);',
        '  vec3 colD = mix(shadeD, litD, clamp(lighting, 0.0, 1.0));',
        '  float aoD = (1.0 - smoothstep(0.0, 3.0, vW.y)) * (1.0 - step(0.5, n.y));',
        '  colD = mix(colD, uBg, aoD * 0.5);',
        '  colD = mix(colD, uBg, win * (1.0 - lit) * 0.6);',
        '  vec3 glow = mix(uPrimary, vec3(1.0), 0.45 + 0.25 * hsh);',
        '  colD += glow * win * lit * (0.75 + 0.25 * sin(uTime * 1.3 + hsh * 20.0));',
        '  colD += uPrimary * step(0.5, n.y) * 0.06;',
        '  vec3 col = mix(colD, colL, uLight);',
        '  col = mix(col, uBg, fogF(vW));',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });
    var buildings = new THREE.InstancedMesh(boxGeo, bMat, lots.length);
    var m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
    lots.forEach(function (l, i) {
      v3.set(l.x, 0, l.z); s3.set(l.w, l.h, l.d);
      m4.compose(v3, q0, s3);
      buildings.setMatrixAt(i, m4);
    });
    buildings.instanceMatrix.needsUpdate = true;
    buildings.renderOrder = 2;
    scene.add(buildings);

    /* contact shadows: one soft quad under each building (instanced, no shadow maps) */
    var shGeo = new THREE.PlaneGeometry(1, 1);
    shGeo.rotateX(-Math.PI / 2);
    var shPad = new Float32Array(lots.length * 2), shStr = new Float32Array(lots.length);
    var shadows = new THREE.InstancedMesh(shGeo, new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false,
      vertexShader: [
        'attribute vec2 aPad; attribute float aStr;',
        'varying vec2 vUv; varying vec2 vPad; varying float vStr; varying vec3 vW;',
        'void main(){ vUv = uv; vPad = aPad; vStr = aStr; vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uShadow; uniform float uShadowA,uFogNear,uFogFar;',
        'varying vec2 vUv; varying vec2 vPad; varying float vStr; varying vec3 vW;', FOG,
        'void main(){',
        '  vec2 e = abs(vUv - 0.5) - (0.5 - vPad);',
        '  vec2 o = max(e, 0.0) / max(vPad, vec2(0.0001));',
        '  float d = length(o);',
        '  float a = (1.0 - smoothstep(0.0, 1.0, d));',
        '  a = a * a * uShadowA * vStr * (1.0 - fogF(vW));',
        '  if (a < 0.003) discard;',
        '  gl_FragColor = vec4(uShadow, a);',
        '}'
      ].join('\n')
    }), lots.length);
    lots.forEach(function (l, i) {
      var pad = 0.9 + Math.min(l.h, 30) * 0.075;
      var w = l.w + pad * 2, d = l.d + pad * 2;
      var k = clamp(l.h / 14, 0.25, 1);
      v3.set(l.x + 0.55 * k, 0.02, l.z + 0.4 * k); s3.set(w, 1, d);
      m4.compose(v3, q0, s3);
      shadows.setMatrixAt(i, m4);
      shPad[i * 2] = pad / w; shPad[i * 2 + 1] = pad / d;
      shStr[i] = 0.55 + 0.45 * k;
    });
    shGeo.setAttribute('aPad', new THREE.InstancedBufferAttribute(shPad, 2));
    shGeo.setAttribute('aStr', new THREE.InstancedBufferAttribute(shStr, 1));
    shadows.instanceMatrix.needsUpdate = true;
    shadows.renderOrder = 1;
    scene.add(shadows);

    /* edge lines: vertical + roof edges of every box merged into one LineSegments */
    var EDGES = [
      [[-0.5, 0, -0.5], [-0.5, 1, -0.5]], [[0.5, 0, -0.5], [0.5, 1, -0.5]], [[0.5, 0, 0.5], [0.5, 1, 0.5]], [[-0.5, 0, 0.5], [-0.5, 1, 0.5]],
      [[-0.5, 1, -0.5], [0.5, 1, -0.5]], [[0.5, 1, -0.5], [0.5, 1, 0.5]], [[0.5, 1, 0.5], [-0.5, 1, 0.5]], [[-0.5, 1, 0.5], [-0.5, 1, -0.5]]
    ];
    var edgePos = new Float32Array(lots.length * EDGES.length * 6);
    lots.forEach(function (l, i) {
      EDGES.forEach(function (e, k) {
        var o = (i * EDGES.length + k) * 6;
        edgePos[o] = l.x + e[0][0] * l.w; edgePos[o + 1] = e[0][1] * l.h; edgePos[o + 2] = l.z + e[0][2] * l.d;
        edgePos[o + 3] = l.x + e[1][0] * l.w; edgePos[o + 4] = e[1][1] * l.h; edgePos[o + 5] = l.z + e[1][2] * l.d;
      });
    });
    var edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    var edgeMat = new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false,
      vertexShader: 'varying vec3 vW; void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }',
      fragmentShader: [
        'uniform vec3 uEdge; uniform float uEdgeA,uFogNear,uFogFar; varying vec3 vW;', FOG,
        'void main(){ float a = uEdgeA * (1.0 - smoothstep(uFogNear * 0.8, uFogFar * 0.8, distance(vW, cameraPosition))); if (a < 0.01) discard; gl_FragColor = vec4(uEdge, a); }'
      ].join('\n')
    });
    var edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.renderOrder = 3;
    scene.add(edges);

    /* points shader (pulses, nodes, arc dots, particles): solid core + soft halo */
    var ptsVert = [
      'attribute float aAlpha; attribute float aSize;',
      'uniform float uPx, uFogNear, uFogFar;',
      'varying float vA;',
      'void main(){',
      '  vec4 wp = modelMatrix * vec4(position, 1.0);',
      '  float d = distance(wp.xyz, cameraPosition);',
      '  vA = aAlpha * (1.0 - smoothstep(uFogNear, uFogFar, d));',
      '  vec4 mv = viewMatrix * wp;',
      '  gl_PointSize = aSize * uPx * (140.0 / -mv.z);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n');
    var ptsFrag = [
      'uniform vec3 uColor; uniform float uLight; varying float vA;',
      'void main(){',
      '  vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0;',
      '  float core = 1.0 - smoothstep(0.50, 0.68, d);',
      '  float halo = pow(clamp(1.0 - d, 0.0, 1.0), 2.0) * mix(0.55, 0.28, uLight);',
      '  float a = clamp(core + halo, 0.0, 1.0) * vA;',
      '  if (a < 0.01) discard;',
      '  gl_FragColor = vec4(mix(uColor, vec3(1.0), core * 0.25 * (1.0 - uLight)), a);',
      '}'
    ].join('\n');
    function ptsMat(color) {
      var u = { uPx: U.uPx, uFogNear: U.uFogNear, uFogFar: U.uFogFar, uLight: U.uLight, uColor: { value: color } };
      return new THREE.ShaderMaterial({ uniforms: u, vertexShader: ptsVert, fragmentShader: ptsFrag, transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending });
    }
    function ptsGeo(count, sizeFn) {
      var g = new THREE.BufferGeometry();
      var pos = new Float32Array(count * 3), al = new Float32Array(count), sz = new Float32Array(count);
      for (var i = 0; i < count; i++) sz[i] = sizeFn(i);
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('aAlpha', new THREE.BufferAttribute(al, 1).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1).setUsage(THREE.DynamicDrawUsage));
      return g;
    }

    /* camera */
    var time = 0;
    function updateCamera() {
      var p = state.p;
      var theta = 0.74 + Math.sin(time * 0.04) * 0.07 + state.smx * 0.05;
      var el = (narrow ? 0.68 : 0.58) + p * 0.45 + state.smy * 0.03;
      var R = (narrow ? 170 : 150) + p * 40;
      var shift = narrow ? 0 : 27;
      var rx = Math.cos(theta), rz = -Math.sin(theta);
      var tx = -rx * shift, tz = -rz * shift;
      camera.position.set(tx + R * Math.cos(el) * Math.sin(theta), R * Math.sin(el), tz + R * Math.cos(el) * Math.cos(theta));
      camera.lookAt(tx, narrow ? 2 : 4, tz);
      U.uFogNear.value = R * 0.95; U.uFogFar.value = R * 1.75;
    }
    function resize() {
      var w = host.clientWidth || 1, h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      if (REDUCED) render();
    }
    resize();
    updateCamera();
    camera.updateMatrixWorld();
    var prj = new THREE.Vector3();
    function ndcX(x, y, z) { prj.set(x, y, z).project(camera); return prj.x; }
    var minX = narrow ? -1.2 : -0.06; /* keep the network clear of the headline (left ~45%) */

    /* street network: nodes are intersections inside the core, right of the headline */
    var NN = N + 1, T = 30;
    var allowed = new Uint8Array(NN * NN);
    for (var ni = 0; ni < NN; ni++) for (var nj = 0; nj < NN; nj++) {
      var nx = -half + ni * CELL, nz = -half + nj * CELL;
      var inCore = Math.hypot(nx, nz) < half * 0.66;
      allowed[ni * NN + nj] = (inCore && ndcX(nx, 0, nz) > minX) ? 1 : 0;
    }
    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function ok(i, j) { return i >= 0 && i < NN && j >= 0 && j < NN && allowed[i * NN + j] === 1; }
    var P = narrow ? 10 : 24, pulses = [];
    var startNodes = [];
    for (var s0 = 0; s0 < NN * NN; s0++) if (allowed[s0]) startNodes.push(s0);
    for (var pi = 0; pi < P && startNodes.length; pi++) {
      var sn = startNodes[Math.floor(rnd() * startNodes.length)], si0 = sn / NN | 0, sj0 = sn % NN;
      var dd = DIRS.filter(function (d) { return ok(si0 + d[0], sj0 + d[1]); });
      if (!dd.length) continue;
      var d0 = dd[Math.floor(rnd() * dd.length)];
      pulses.push({ i: si0, j: sj0, di: d0[0], dj: d0[1], t: rnd(), speed: 8 + rnd() * 7, accent: pi % 5 === 4, hist: new Float32Array(T * 2), hLen: 0, hHead: 0, lx: 0, lz: 0 });
    }
    P = pulses.length;
    var pulseGeo = ptsGeo(P * T, function (i) { var k = i % T; return k === 0 ? 8.5 : 4.6 * Math.pow(1 - k / T, 0.8) + 2.2; });
    var pulseMat = ptsMat(U.uPrimary.value);
    var pulsePts = new THREE.Points(pulseGeo, pulseMat);
    pulsePts.frustumCulled = false;
    pulsePts.renderOrder = 5;
    scene.add(pulsePts);
    var pulseAccGeo = ptsGeo(P * T, function (i) { var k = i % T; return k === 0 ? 8.5 : 4.6 * Math.pow(1 - k / T, 0.8) + 2.2; });
    var pulseAccMat = ptsMat(U.uAccent.value);
    var pulseAccPts = new THREE.Points(pulseAccGeo, pulseAccMat);
    pulseAccPts.frustumCulled = false;
    pulseAccPts.renderOrder = 5;
    scene.add(pulseAccPts);

    var nodeGeo = ptsGeo(NN * NN, function () { return 2.8; });
    var nodePos = nodeGeo.getAttribute('position').array;
    var nodeAl = nodeGeo.getAttribute('aAlpha').array, nodeSz = nodeGeo.getAttribute('aSize').array;
    var nodeI = new Float32Array(NN * NN);
    var NODE_BASE = 0.14;
    for (var ni2 = 0; ni2 < NN; ni2++) for (var nj2 = 0; nj2 < NN; nj2++) {
      var idx = ni2 * NN + nj2;
      nodePos[idx * 3] = -half + ni2 * CELL; nodePos[idx * 3 + 1] = 0.12; nodePos[idx * 3 + 2] = -half + nj2 * CELL;
      nodeAl[idx] = allowed[idx] ? NODE_BASE : 0;
    }
    nodeGeo.getAttribute('position').needsUpdate = true;
    var nodeMat = ptsMat(U.uPrimary.value);
    var nodePts = new THREE.Points(nodeGeo, nodeMat);
    nodePts.frustumCulled = false;
    nodePts.renderOrder = 4;
    scene.add(nodePts);

    /* rooftop links: glowing tubes between tall towers of the core, each carrying a flowing packet */
    var tall = lots.filter(function (l) { return l.h > 8 && Math.hypot(l.x, l.z) < half * 0.6 && ndcX(l.x, l.h, l.z) > minX + 0.08; });
    tall.sort(function (a, b) { return b.h - a.h; });
    var arcs = [], tries = 0, ARCS = narrow ? 5 : 10;
    while (arcs.length < ARCS && tries < 600 && tall.length > 3) {
      tries++;
      var a = tall[Math.floor(rnd() * Math.min(tall.length, 14))], b = tall[Math.floor(rnd() * tall.length)];
      var dab = Math.hypot(a.x - b.x, a.z - b.z);
      if (a === b || dab < 10 || dab > 28) continue;
      if (Math.abs(ndcX(a.x, a.h, a.z) - ndcX(b.x, b.h, b.z)) < 0.06) continue; /* would read as a vertical line */
      var dup = arcs.some(function (c) { return c.a === a || c.b === a || c.a === b || c.b === b; });
      if (dup && rnd() < 0.7) continue;
      var v0 = new THREE.Vector3(a.x, a.h + 0.3, a.z), v2 = new THREE.Vector3(b.x, b.h + 0.3, b.z);
      var v1 = v0.clone().add(v2).multiplyScalar(0.5); v1.y = Math.max(a.h, b.h) + 2.5 + dab * 0.14;
      if (ndcX(v1.x, v1.y, v1.z) < minX + 0.04 || prj.y > 0.7) continue;
      var curve = new THREE.QuadraticBezierCurve3(v0, v1, v2);
      arcs.push({ a: a, b: b, curve: curve, pts: curve.getPoints(32), accent: arcs.length === 2 || (ARCS > 6 && arcs.length === 6), t: rnd(), speed: 0.10 + rnd() * 0.08 });
    }
    var arcVert = [
      'varying vec2 vUv; varying vec3 vW;',
      'void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }'
    ].join('\n');
    var arcFrag = [
      'uniform vec3 uColor, uBg; uniform float uHead, uLight, uFogNear, uFogFar;',
      'varying vec2 vUv; varying vec3 vW;', FOG,
      'void main(){',
      '  float u = vUv.x;',
      '  float d = fract(uHead - u);',               /* distance behind the packet head along the link */
      '  float tail = exp(-d * 7.0);',
      '  float base = mix(0.16, 0.30, 1.0 - uLight) * (0.35 + 0.65 * sin(u * 3.14159));',
      '  float a = (base + tail * 0.9) * (1.0 - fogF(vW));',
      '  vec3 col = mix(uColor, vec3(1.0), tail * mix(0.25, 0.55, 1.0 - uLight));',
      '  gl_FragColor = vec4(col, a);',
      '}'
    ].join('\n');
    var arcMats = [];
    arcs.forEach(function (c) {
      var geo = new THREE.TubeGeometry(c.curve, 40, narrow ? 0.16 : 0.13, 6, false);
      var mat = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: (c.accent ? U.uAccent : U.uPrimary).value }, uBg: U.uBg, uHead: { value: c.t }, uLight: U.uLight, uFogNear: U.uFogNear, uFogFar: U.uFogFar },
        vertexShader: arcVert, fragmentShader: arcFrag, transparent: true, depthWrite: false
      });
      c.mat = mat;
      arcMats.push(mat);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 6;
      scene.add(mesh);
    });
    var arcDotGeo = ptsGeo(arcs.length, function () { return 5.2; });
    var arcDotMat = ptsMat(U.uPrimary.value);
    var arcDots = new THREE.Points(arcDotGeo, arcDotMat);
    arcDots.frustumCulled = false;
    arcDots.renderOrder = 7;
    scene.add(arcDots);
    var arcAccGeo = ptsGeo(arcs.length, function () { return 5.2; });
    var arcAccDots = new THREE.Points(arcAccGeo, ptsMat(U.uAccent.value));
    arcAccDots.frustumCulled = false;
    arcAccDots.renderOrder = 7;
    scene.add(arcAccDots);
    /* anchor dots on the towers each link leaves from */
    var anchorGeo = ptsGeo(arcs.length * 2, function () { return 3.2; });
    var anchorPos = anchorGeo.getAttribute('position').array, anchorAl = anchorGeo.getAttribute('aAlpha').array;
    arcs.forEach(function (c, i) {
      anchorPos[i * 6] = c.a.x; anchorPos[i * 6 + 1] = c.a.h + 0.3; anchorPos[i * 6 + 2] = c.a.z;
      anchorPos[i * 6 + 3] = c.b.x; anchorPos[i * 6 + 4] = c.b.h + 0.3; anchorPos[i * 6 + 5] = c.b.z;
      anchorAl[i * 2] = 0.7; anchorAl[i * 2 + 1] = 0.7;
    });
    anchorGeo.getAttribute('position').needsUpdate = true; anchorGeo.getAttribute('aAlpha').needsUpdate = true;
    var anchorMat = ptsMat(U.uPrimary.value);
    var anchors = new THREE.Points(anchorGeo, anchorMat);
    anchors.frustumCulled = false;
    anchors.renderOrder = 7;
    scene.add(anchors);

    /* light beams: crossed vertical planes rising from the landmarks and the tallest towers */
    var beamTowers = landmarks.slice();
    tall.slice(0, 4).forEach(function (l) {
      if (!beamTowers.some(function (b) { return Math.abs(b.x - l.x) < 1 && Math.abs(b.z - l.z) < 1; })) beamTowers.push({ x: l.x, z: l.z, h: l.h });
    });
    var beamGeo = new THREE.PlaneGeometry(1, 1);
    beamGeo.translate(0, 0.5, 0);
    var beamPhase = new Float32Array(beamTowers.length * 2);
    beamGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(beamPhase, 1));
    var beamMat = new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: [
        'attribute float aPhase; varying vec2 vUv; varying float vPhase; varying vec3 vW;',
        'void main(){ vUv = uv; vPhase = aPhase; vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uPrimary, uAccent; uniform float uTime, uLight, uFogNear, uFogFar;',
        'varying vec2 vUv; varying float vPhase; varying vec3 vW;', FOG,
        'void main(){',
        '  float x = abs(vUv.x - 0.5) * 2.0;',
        '  float horiz = pow(1.0 - x, 2.4);',
        '  float vert = pow(1.0 - vUv.y, 1.7) * smoothstep(0.0, 0.05, vUv.y);',
        '  float flow = 0.55 + 0.45 * sin(vUv.y * 22.0 - uTime * 2.6 + vPhase * 6.0);',
        '  float a = horiz * vert * flow * mix(0.16, 0.6, 1.0 - uLight) * (1.0 - fogF(vW));',
        '  if (a < 0.004) discard;',
        '  vec3 col = mix(uPrimary, uAccent, step(0.5, fract(vPhase * 0.37)));',
        '  gl_FragColor = vec4(mix(col, vec3(1.0), 0.15 * (1.0 - uLight)), a);',
        '}'
      ].join('\n')
    });
    var beams = new THREE.InstancedMesh(beamGeo, beamMat, beamTowers.length * 2);
    beamTowers.forEach(function (b, i) {
      for (var k = 0; k < 2; k++) {
        var qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), k * Math.PI / 2);
        v3.set(b.x, b.h + 0.1, b.z); s3.set(2.2, 14 + b.h * 0.5, 1);
        m4.compose(v3, qy, s3);
        beams.setMatrixAt(i * 2 + k, m4);
        beamPhase[i * 2 + k] = i * 1.7;
      }
    });
    beams.instanceMatrix.needsUpdate = true;
    beams.frustumCulled = false;
    beams.renderOrder = 8;
    scene.add(beams);

    /* crown lights: slow blink on the tallest roofs */
    var crowns = lots.filter(function (l) { return l.h > 11.5; });
    var crownGeo = ptsGeo(crowns.length, function () { return 3.4; });
    var crownPos = crownGeo.getAttribute('position').array, crownAl = crownGeo.getAttribute('aAlpha').array;
    var crownPhase = new Float32Array(crowns.length);
    crowns.forEach(function (l, i) {
      crownPos[i * 3] = l.x; crownPos[i * 3 + 1] = l.h + 0.25; crownPos[i * 3 + 2] = l.z;
      crownPhase[i] = rnd() * Math.PI * 2;
    });
    crownGeo.getAttribute('position').needsUpdate = true;
    var crownMat = ptsMat(U.uAccent.value);
    var crownPts = new THREE.Points(crownGeo, crownMat);
    crownPts.frustumCulled = false;
    crownPts.renderOrder = 7;
    scene.add(crownPts);

    /* particle field: slow motes drifting up through the core */
    var PN = narrow ? 70 : 160;
    var partGeo = ptsGeo(PN, function (i) { return 1.6 + (i % 3) * 0.6; });
    var partPos = partGeo.getAttribute('position').array, partAl = partGeo.getAttribute('aAlpha').array;
    var partSeed = new Float32Array(PN * 2);
    for (var pk = 0; pk < PN; pk++) {
      partPos[pk * 3] = (rnd() - 0.5) * half * 1.5; partPos[pk * 3 + 1] = 1 + rnd() * 34; partPos[pk * 3 + 2] = (rnd() - 0.5) * half * 1.5;
      partSeed[pk * 2] = 0.25 + rnd() * 0.6; partSeed[pk * 2 + 1] = rnd() * Math.PI * 2;
    }
    partGeo.getAttribute('position').needsUpdate = true;
    var partMat = ptsMat(U.uPrimary.value);
    var particles = new THREE.Points(partGeo, partMat);
    particles.frustumCulled = false;
    particles.renderOrder = 7;
    scene.add(particles);

    /* theme */
    function applyTheme() {
      var T = tokens();
      U.uBg.value.set(T.bg); U.uSurface.value.set(T.surface); U.uSunken.value.set(T.sunken);
      U.uLine.value.set(T.line); U.uLineStrong.value.set(T.lineStrong); U.uPrimary.value.set(T.primary); U.uAccent.value.set(T.accent);
      U.uInk.value.set(T.ink);
      U.uLight.value = T.isLight ? 1 : 0;
      if (T.isLight) {
        U.uShadow.value.set(T.lineStrong).lerp(new THREE.Color(T.ink), 0.22); U.uShadowA.value = 0.55;
        U.uEdge.value.set(T.lineStrong).lerp(new THREE.Color(T.ink), 0.1); U.uEdgeA.value = 0.6;
      } else {
        U.uShadow.value.set('#000000'); U.uShadowA.value = 0.6;
        U.uEdge.value.set(T.lineStrong); U.uEdgeA.value = 0.7;
      }
      var blend = T.isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      [pulseMat, pulseAccMat, nodeMat, arcDotMat, arcAccDots.material, anchorMat, crownMat, partMat, beamMat].concat(arcMats).forEach(function (m) { m.blending = blend; m.needsUpdate = true; });
      renderer.setClearColor(new THREE.Color(T.bg), 1);
      if (REDUCED) render();
    }

    /* simulation */
    var pulsePosArr = pulseGeo.getAttribute('position').array, pulseAlArr = pulseGeo.getAttribute('aAlpha').array;
    var pulseAccPosArr = pulseAccGeo.getAttribute('position').array, pulseAccAlArr = pulseAccGeo.getAttribute('aAlpha').array;
    function stepPulses(dt) {
      for (var p = 0; p < P; p++) {
        var u = pulses[p];
        u.t += u.speed * dt / CELL;
        while (u.t >= 1) {
          u.t -= 1; u.i += u.di; u.j += u.dj;
          if (u.i >= 0 && u.i < NN && u.j >= 0 && u.j < NN) nodeI[u.i * NN + u.j] = 1;
          var keep = rnd() < 0.6;
          if (!keep || !ok(u.i + u.di, u.j + u.dj)) {
            var opts = [];
            for (var d = 0; d < 4; d++) {
              var dr = DIRS[d];
              if (dr[0] === -u.di && dr[1] === -u.dj) continue;
              if (ok(u.i + dr[0], u.j + dr[1])) opts.push(dr);
            }
            var pick = opts.length ? opts[Math.floor(rnd() * opts.length)] : [-u.di, -u.dj];
            u.di = pick[0]; u.dj = pick[1];
          }
        }
        var px = -half + (u.i + u.di * u.t) * CELL - u.dj * 0.3, pz = -half + (u.j + u.dj * u.t) * CELL + u.di * 0.3;
        if (u.hLen === 0 || Math.hypot(u.lx - px, u.lz - pz) > 0.16) {
          u.hHead = (u.hHead + 1) % T; u.hist[u.hHead * 2] = px; u.hist[u.hHead * 2 + 1] = pz; u.hLen = Math.min(T, u.hLen + 1);
          u.lx = px; u.lz = pz;
        }
        var posArr = u.accent ? pulseAccPosArr : pulsePosArr, alArr = u.accent ? pulseAccAlArr : pulseAlArr, otherAl = u.accent ? pulseAlArr : pulseAccAlArr;
        var base = p * T;
        posArr[base * 3] = px; posArr[base * 3 + 1] = 0.45; posArr[base * 3 + 2] = pz; alArr[base] = 1; otherAl[base] = 0;
        for (var k = 1; k < T; k++) {
          var ix = base + k;
          otherAl[ix] = 0;
          if (k < u.hLen) {
            var hIdx = ((u.hHead - k) % T + T) % T;
            posArr[ix * 3] = u.hist[hIdx * 2]; posArr[ix * 3 + 1] = 0.45; posArr[ix * 3 + 2] = u.hist[hIdx * 2 + 1];
            alArr[ix] = 0.85 * Math.pow(1 - k / T, 1.6);
          } else alArr[ix] = 0;
        }
      }
      pulseGeo.getAttribute('position').needsUpdate = true;
      pulseGeo.getAttribute('aAlpha').needsUpdate = true;
      pulseAccGeo.getAttribute('position').needsUpdate = true;
      pulseAccGeo.getAttribute('aAlpha').needsUpdate = true;
      var decay = Math.exp(-dt * 1.6);
      for (var n = 0; n < nodeI.length; n++) {
        if (nodeI[n] > 0.001) {
          nodeI[n] *= decay;
          nodeAl[n] = (allowed[n] ? NODE_BASE : 0) + nodeI[n] * 0.86;
          nodeSz[n] = 2.8 + nodeI[n] * 5.0;
        }
      }
      nodeGeo.getAttribute('aAlpha').needsUpdate = true;
      nodeGeo.getAttribute('aSize').needsUpdate = true;
      var ap = arcDotGeo.getAttribute('position').array, aa = arcDotGeo.getAttribute('aAlpha').array;
      var bp = arcAccGeo.getAttribute('position').array, ba = arcAccGeo.getAttribute('aAlpha').array;
      arcs.forEach(function (c, i) {
        c.t = (c.t + c.speed * dt) % 1;
        c.mat.uniforms.uHead.value = c.t;
        var f = c.t * (c.pts.length - 1), k0 = Math.floor(f), k1 = Math.min(c.pts.length - 1, k0 + 1), ft = f - k0;
        var x = lerp(c.pts[k0].x, c.pts[k1].x, ft), y = lerp(c.pts[k0].y, c.pts[k1].y, ft), z = lerp(c.pts[k0].z, c.pts[k1].z, ft);
        var arrP = c.accent ? bp : ap, arrA = c.accent ? ba : aa, other = c.accent ? aa : ba;
        arrP[i * 3] = x; arrP[i * 3 + 1] = y; arrP[i * 3 + 2] = z; arrA[i] = 0.95; other[i] = 0;
      });
      arcDotGeo.getAttribute('position').needsUpdate = true; arcDotGeo.getAttribute('aAlpha').needsUpdate = true;
      arcAccGeo.getAttribute('position').needsUpdate = true; arcAccGeo.getAttribute('aAlpha').needsUpdate = true;
      /* crown lights blink, particles drift */
      for (var ci = 0; ci < crowns.length; ci++) crownAl[ci] = 0.15 + 0.85 * Math.pow(0.5 + 0.5 * Math.sin(time * 2.2 + crownPhase[ci]), 8);
      crownGeo.getAttribute('aAlpha').needsUpdate = true;
      var partBase = U.uLight.value > 0.5 ? 0.28 : 0.6;
      for (var pi2 = 0; pi2 < PN; pi2++) {
        var y2 = partPos[pi2 * 3 + 1] + dt * partSeed[pi2 * 2] * 1.4;
        if (y2 > 36) y2 = 1;
        partPos[pi2 * 3 + 1] = y2;
        partPos[pi2 * 3] += Math.sin(time * 0.5 + partSeed[pi2 * 2 + 1]) * dt * 0.4;
        partAl[pi2] = partBase * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 1.4 + partSeed[pi2 * 2 + 1]))) * Math.min(1, (36 - y2) / 8) * Math.min(1, (y2 - 1) / 3);
      }
      partGeo.getAttribute('position').needsUpdate = true;
      partGeo.getAttribute('aAlpha').needsUpdate = true;
    }

    function render() { updateCamera(); U.uTime.value = time; renderer.render(scene, camera); }
    var rafId = 0, last = 0;
    function frame(now) {
      rafId = 0;
      if (!state.running) return;
      var dt = Math.max(0, Math.min(0.05, (now - last) / 1000)) || 0;
      last = now; time += dt;
      state.p = lerp(state.p, state.scroll, 0.1);
      state.smx = lerp(state.smx, state.mx, 0.04); state.smy = lerp(state.smy, state.my, 0.04);
      stepPulses(dt);
      render();
      hero.style.setProperty('--px', state.smx.toFixed(3));
      hero.style.setProperty('--py', state.smy.toFixed(3));
      rafId = requestAnimationFrame(frame);
    }
    function start() { if (REDUCED || state.running || !state.visible || document.hidden) return; state.running = true; last = performance.now(); rafId = requestAnimationFrame(frame); }
    function stop() { state.running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);
    applyTheme();
    onTheme(applyTheme);

    if (hasIO) new IntersectionObserver(function (es) { es.forEach(function (e) { state.visible = e.isIntersecting; if (state.visible) start(); else stop(); }); }).observe(host);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if (fine && !REDUCED) window.addEventListener('pointermove', function (e) {
      state.mx = (e.clientX / window.innerWidth - 0.5) * 2; state.my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    if (REDUCED) {
      for (var w = 0; w < 40; w++) { time += 0.05; stepPulses(0.05); }
      render();
    } else {
      if (hasST) {
        gsap.to(state, { scroll: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 } });
        gsap.to(host, { opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '90% top', scrub: 0.5 } });
        gsap.to('.hero-copy', { y: 70, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: hero, start: '12% top', end: 'bottom top', scrub: 0.5 } });
        gsap.to('.hero-console', { y: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: '8% top', end: '70% top', scrub: 0.5 } });
      } else {
        window.addEventListener('scroll', function () {
          var p = clamp(window.scrollY / Math.max(1, hero.offsetHeight), 0, 1);
          state.scroll = p; host.style.opacity = String(1 - p);
        }, { passive: true });
      }
      start();
    }
  })();

}
