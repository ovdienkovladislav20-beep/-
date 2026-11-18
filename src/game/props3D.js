// Scanline-clipped 3D Polyhedral Prop, Collectible, Character & Monster Renderer for the Raycaster Engine.
// Clips every triangle/quad against ZN=0.14 and rasterizes columns strictly against wall zb[ri] and sprite zs[ri].

function clipPolyNear(verts, ZN = 0.14) {
  const out = [];
  const n = verts.length;
  for (let i = 0; i < n; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % n];
    const ai = a.cz >= ZN;
    const bi = b.cz >= ZN;
    if (ai && bi) {
      out.push(b);
    } else if (ai && !bi) {
      const t = (ZN - a.cz) / (b.cz - a.cz);
      out.push({ cx: a.cx + (b.cx - a.cx) * t, cz: ZN, wz: a.wz + (b.wz - a.wz) * t });
    } else if (!ai && bi) {
      const t = (ZN - a.cz) / (b.cz - a.cz);
      out.push({ cx: a.cx + (b.cx - a.cx) * t, cz: ZN, wz: a.wz + (b.wz - a.wz) * t });
      out.push(b);
    }
  }
  return out;
}

function makeTriColor(rgb, shade, L, invF, fog, em, isBright = false) {
  if (em) {
    if (!fog) return `rgb(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0})`;
    const fMix = isBright ? 0.30 : 0.50;
    return `rgb(${(rgb[0] * (1 - fog.a * fMix) + fog.r * fog.a * fMix) | 0},${(rgb[1] * (1 - fog.a * fMix) + fog.g * fog.a * fMix) | 0},${(rgb[2] * (1 - fog.a * fMix) + fog.b * fog.a * fMix) | 0})`;
  }
  const k = L * shade;
  const rr = Math.min(255, rgb[0] * k);
  const gg = Math.min(255, rgb[1] * k);
  const bb = Math.min(255, rgb[2] * k);
  if (!fog) return `rgb(${rr | 0},${gg | 0},${bb | 0})`;
  return `rgb(${(rr * invF + fog.r * fog.a) | 0},${(gg * invF + fog.g * fog.a) | 0},${(bb * invF + fog.b * fog.a) | 0})`;
}

// Fast mesh collector + z-buffered scanline rasterizer
function renderFaces3D(ctx, faces, wx, wy, yaw = 0) {
  const { g, W, H, RW, hor, VF, ox, oy, dx, dy, plx, ply, inv, zb, zs, L, fog, fogA, invF, baseAlpha = 1, allowAboveWall = false, wt = null } = ctx;
  const cw = W / RW;
  const colW = cw + 0.08;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const fogObj = fog ? { r: fog.r, g: fog.g, b: fog.b, a: fogA } : null;

  const drawList = [];
  for (let fi = 0; fi < faces.length; fi++) {
    const f = faces[fi];
    const rawPts = f.pts;
    const projPts = new Array(rawPts.length);
    for (let i = 0; i < rawPts.length; i++) {
      const p = rawPts[i];
      const rx = p[0] * cy - p[1] * sy + wx - ox;
      const ry = p[0] * sy + p[1] * cy + wy - oy;
      projPts[i] = {
        cx: inv * (dy * rx - dx * ry),
        cz: inv * (-ply * rx + plx * ry),
        wz: p[2],
      };
    }
    const cl = clipPolyNear(projPts, 0.14);
    if (cl.length < 3) continue;

    let avgZ = 0;
    const spts = new Array(cl.length);
    for (let i = 0; i < cl.length; i++) {
      const v = cl[i];
      avgZ += v.cz;
      spts[i] = {
        x: W * 0.5 * (1 + v.cx / v.cz),
        y: hor + (H / v.cz * VF) * (0.5 - v.wz),
        z: v.cz,
      };
    }
    avgZ /= cl.length;
    if (!f.ds && spts.length >= 3) {
      const ax = spts[1].x - spts[0].x;
      const ay = spts[1].y - spts[0].y;
      const bx = spts[2].x - spts[0].x;
      const by = spts[2].y - spts[0].y;
      if (f.cull && (ax * by - ay * bx) <= 0) continue;
    }
    const col = makeTriColor(f.rgb, f.sh ?? 1, L, invF, fogObj, !!f.em, !!f.bright);
    drawList.push({ spts, z: avgZ + (f.zBias || 0), col, a: (f.a ?? 1) * baseAlpha, above: !!f.above });
  }

  drawList.sort((a, b) => b.z - a.z);

  for (let di = 0; di < drawList.length; di++) {
    const q = drawList[di];
    const pts = q.spts;
    let minX = W;
    let maxX = -1;
    for (let i = 0; i < pts.length; i++) {
      if (pts[i].x < minX) minX = pts[i].x;
      if (pts[i].x > maxX) maxX = pts[i].x;
    }
    const rx0 = Math.max(0, Math.floor(minX / cw));
    const rx1 = Math.min(RW - 1, Math.ceil(maxX / cw));
    if (rx1 < rx0) continue;

    g.globalAlpha = q.a;
    g.fillStyle = q.col;
    for (let ri = rx0; ri <= rx1; ri++) {
      const xc = (ri + 0.5) * cw;
      let yMin = 1e9;
      let yMax = -1e9;
      let zHit = 1e9;
      let hits = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        if ((a.x <= xc && b.x >= xc) || (b.x <= xc && a.x >= xc)) {
          const dx2 = b.x - a.x;
          if (Math.abs(dx2) < 1e-4) {
            if (a.y < yMin) yMin = a.y;
            if (b.y < yMin) yMin = b.y;
            if (a.y > yMax) yMax = a.y;
            if (b.y > yMax) yMax = b.y;
            if (a.z < zHit) zHit = a.z;
            if (b.z < zHit) zHit = b.z;
            hits++;
          } else {
            const t = (xc - a.x) / dx2;
            const yy = a.y + (b.y - a.y) * t;
            const zz = a.z + (b.z - a.z) * t;
            if (yy < yMin) yMin = yy;
            if (yy > yMax) yMax = yy;
            if (zz < zHit) zHit = zz;
            hits++;
          }
        }
      }
      if (hits < 2) continue;

      if (allowAboveWall && q.above && wt && zb[ri] < zHit) {
        const clipBot = Math.min(yMax, wt[ri] + 2);
        const visH = clipBot - yMin;
        if (visH > 0.8) {
          g.fillRect(ri * cw, yMin, colW, visH);
        }
        continue;
      }

      if (zb[ri] > zHit) {
        if (q.a >= 0.98 && zHit < zs[ri]) zs[ri] = zHit;
        const hh = Math.max(0.85, yMax - yMin);
        g.fillRect(ri * cw, yMin, colW, hh);
      }
    }
  }
}

// Geometry helpers: push an axis-aligned 3D box [x0..x1, y0..y1, z0..z1]
function pushBox(faces, x0, x1, y0, y1, z0, z1, rgb, opts = {}) {
  const em = !!opts.em;
  const bright = !!opts.bright;
  const a = opts.a ?? 1;
  const zBias = opts.zBias || 0;
  const above = !!opts.above;
  const topSh = opts.topSh ?? 1.14;
  const botSh = opts.botSh ?? 0.65;
  const xSh = opts.xSh ?? 0.86;
  const ySh = opts.ySh ?? 0.96;

  faces.push({ pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], rgb, sh: ySh, em, bright, a, zBias, above });
  faces.push({ pts: [[x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]], rgb, sh: ySh * 0.88, em, bright, a, zBias, above });
  faces.push({ pts: [[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], rgb, sh: xSh, em, bright, a, zBias, above });
  faces.push({ pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], rgb, sh: xSh * 1.06, em, bright, a, zBias, above });
  faces.push({ pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], rgb, sh: topSh, em, bright, a, zBias, above });
  if (z0 > 0.02) {
    faces.push({ pts: [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]], rgb, sh: botSh, em, bright, a, zBias, above });
  }
}

// Oriented 3D limb / blade / beam connecting (x0,y0,z0) -> (x1,y1,z1) with half-width hw and half-height hh
function pushSegBox(faces, x0, y0, z0, x1, y1, z1, hw, hh, rgb, opts = {}) {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  const len = Math.hypot(dx, dy, dz) || 1e-4;
  const xyLen = Math.hypot(dx, dy);
  let sx, sy, sz = 0;
  if (xyLen > 1e-4) {
    sx = (-dy / xyLen) * hw;
    sy = (dx / xyLen) * hw;
  } else {
    sx = hw;
    sy = 0;
  }
  const ux = (dy * sz - dz * sy) / len;
  const uy = (dz * sx - dx * sz) / len;
  const uz = (dx * sy - dy * sx) / len;
  const uLen = Math.hypot(ux, uy, uz) || 1e-4;
  const nx = (ux / uLen) * hh;
  const ny = (uy / uLen) * hh;
  const nz = (uz / uLen) * hh;

  const p00 = [x0 - sx - nx, y0 - sy - ny, z0 - sz - nz];
  const p01 = [x0 + sx - nx, y0 + sy - ny, z0 + sz - nz];
  const p02 = [x0 + sx + nx, y0 + sy + ny, z0 + sz + nz];
  const p03 = [x0 - sx + nx, y0 - sy + ny, z0 - sz + nz];

  const p10 = [x1 - sx - nx, y1 - sy - ny, z1 - sz - nz];
  const p11 = [x1 + sx - nx, y1 + sy - ny, z1 + sz - nz];
  const p12 = [x1 + sx + nx, y1 + sy + ny, z1 + sz + nz];
  const p13 = [x1 - sx + nx, y1 - sy + ny, z1 - sz + nz];

  const em = !!opts.em;
  const bright = !!opts.bright;
  const a = opts.a ?? 1;
  const zBias = opts.zBias || 0;
  const above = !!opts.above;
  const topSh = opts.topSh ?? 1.12;
  const sideSh = opts.sideSh ?? 0.90;

  faces.push({ pts: [p03, p02, p12, p13], rgb, sh: topSh, em, bright, a, zBias, above });
  faces.push({ pts: [p01, p00, p10, p11], rgb, sh: 0.68, em, bright, a, zBias, above });
  faces.push({ pts: [p00, p03, p13, p10], rgb, sh: sideSh, em, bright, a, zBias, above });
  faces.push({ pts: [p02, p01, p11, p12], rgb, sh: sideSh * 1.04, em, bright, a, zBias, above });
  faces.push({ pts: [p00, p01, p02, p03], rgb, sh: 0.84, em, bright, a, zBias, above });
  faces.push({ pts: [p11, p10, p13, p12], rgb, sh: 0.94, em, bright, a, zBias, above });
}

// Regular n-sided prism / frustum along vertical Z axis
function pushPrism(faces, cx, cy, rBot, rTop, z0, z1, sides, rgb, opts = {}) {
  const em = !!opts.em;
  const bright = !!opts.bright;
  const a = opts.a ?? 1;
  const above = !!opts.above;
  const capTop = opts.capTop !== false;
  const zBias = opts.zBias || 0;
  const step = (Math.PI * 2) / sides;
  const topPts = [];
  for (let i = 0; i < sides; i++) {
    const a0 = i * step;
    const a1 = (i + 1) * step;
    const c0 = Math.cos(a0), s0 = Math.sin(a0);
    const c1 = Math.cos(a1), s1 = Math.sin(a1);
    const sh = 0.72 + 0.34 * (0.5 + 0.5 * Math.cos(a0 + 0.6));
    if (rTop > 0.002) {
      faces.push({
        pts: [
          [cx + c0 * rBot, cy + s0 * rBot, z0],
          [cx + c1 * rBot, cy + s1 * rBot, z0],
          [cx + c1 * rTop, cy + s1 * rTop, z1],
          [cx + c0 * rTop, cy + s0 * rTop, z1],
        ],
        rgb,
        sh,
        em,
        bright,
        a,
        above,
        zBias,
      });
      topPts.push([cx + c0 * rTop, cy + s0 * rTop, z1]);
    } else {
      faces.push({
        pts: [
          [cx + c0 * rBot, cy + s0 * rBot, z0],
          [cx + c1 * rBot, cy + s1 * rBot, z0],
          [cx, cy, z1],
        ],
        rgb,
        sh,
        em,
        bright,
        a,
        above,
        zBias,
      });
    }
  }
  if (capTop && topPts.length >= 3) {
    faces.push({ pts: topPts, rgb, sh: opts.topSh ?? 1.15, em, bright, a, above, zBias });
  }
}

function pushOcta(faces, cx, cy, cz, rx, ry, rz, rgb, opts = {}) {
  const em = !!opts.em;
  const bright = !!opts.bright;
  const a = opts.a ?? 1;
  const above = !!opts.above;
  const top = [cx, cy, cz + rz];
  const bot = [cx, cy, cz - rz];
  const ring = [
    [cx + rx, cy, cz],
    [cx, cy + ry, cz],
    [cx - rx, cy, cz],
    [cx, cy - ry, cz],
  ];
  const shades = [1.14, 0.96, 0.80, 0.92];
  for (let i = 0; i < 4; i++) {
    const n = (i + 1) % 4;
    faces.push({ pts: [ring[i], ring[n], top], rgb, sh: shades[i], em, bright, a, above });
    faces.push({ pts: [ring[n], ring[i], bot], rgb, sh: shades[i] * 0.72, em, bright, a, above });
  }
}

function hexToRgbArr(hex) {
  const clean = String(hex || '#d8d8d0').replace('#', '');
  if (clean.length !== 6) return [216, 216, 208];
  const n = parseInt(clean, 16);
  if (Number.isNaN(n)) return [216, 216, 208];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Anatomical realistic 3D Monsters (+X = facing direction, +Z = up)
function buildMonsterFaces(faces, variant, s, tm, ctx) {
  const hunting = !!s.hunting;
  const stride = Math.sin(tm * (hunting ? 11.5 : 4.2) + (s.x || 0) * 3) * (hunting ? 0.08 : 0.035);
  const sway = Math.sin(tm * (hunting ? 9.0 : 2.6) + (s.y || 0)) * (hunting ? 0.045 : 0.02);
  const twitch = hunting ? Math.sin(tm * 31) * 0.025 : Math.sin(tm * 5.2) * 0.01;
  const yaw = s.faceYaw ?? (ctx ? Math.atan2(ctx.oy - s.y, ctx.ox - s.x) : 0);

  if (variant === 'matrixman') {
    // Promo Skin 1 (1 user): Glitching Neon-Green & Obsidian Domino Knight with crimson scarf, star eye, glowing core ribs & blades
    const black = [7, 9, 8];
    const neonG = [38, 255, 72];
    const limeCore = [212, 255, 52];
    const crimson = [208, 16, 26];
    const crimsonBright = [255, 24, 38];
    const glt = Math.sin(tm * 24) * 0.015;

    // Legs with neon-green matrix stripes
    for (const sd of [-1, 1]) {
      const lf = sd * stride;
      pushBox(faces, lf - 0.055, lf + 0.055, sd * 0.08 - 0.05, sd * 0.08 + 0.05, 0.0, 0.36, black);
      pushBox(faces, lf + 0.048, lf + 0.062, sd * 0.08 - 0.036, sd * 0.08 + 0.036, 0.14, 0.24, neonG, { em: true, zBias: -0.004 });
    }
    // Blocky charcoal torso with glowing yellow-green inner void + green rib bars
    pushBox(faces, -0.095, 0.10, -0.155, 0.155, 0.35, 0.72, black);
    pushBox(faces, 0.085, 0.112, -0.11, 0.11, 0.40, 0.66, [12, 34, 14], { zBias: -0.005 });
    pushOcta(faces, 0.105, 0.01, 0.50, 0.025, 0.065, 0.075, limeCore, { em: true, bright: true });
    for (const rz of [0.43, 0.49, 0.55, 0.61]) {
      pushSegBox(faces, 0.114, -0.09, rz, 0.114, 0.09, rz - 0.008, 0.010, 0.009, neonG, { em: true, bright: true, zBias: -0.009 });
    }
    // Tattered crimson scarf draped across collar/shoulders + fluttering sash
    pushBox(faces, -0.115, 0.125, -0.17, 0.17, 0.66, 0.75, crimson, { zBias: -0.008 });
    pushSegBox(faces, 0.10, 0.02, 0.67, 0.13, -0.05, 0.52 + Math.sin(tm * 7) * 0.02, 0.045, 0.016, crimsonBright, { zBias: -0.011 });

    // Arms with neon-green matrix hatch cuffs + left Domino Pauldron + Dual Dark Swords
    pushSegBox(faces, 0.01, -0.16, 0.69, 0.08, -0.22, 0.42 - stride, 0.046, 0.046, black);
    pushBox(faces, -0.045, 0.065, -0.245, -0.145, 0.61, 0.77, neonG, { em: true, zBias: -0.006 }); // Domino shoulder plate
    pushBox(faces, -0.01, 0.072, -0.22, -0.17, 0.682, 0.698, black, { zBias: -0.010 });
    pushBox(faces, 0.055, 0.074, -0.205, -0.185, 0.72, 0.74, black, { zBias: -0.011 });
    pushBox(faces, 0.055, 0.074, -0.205, -0.185, 0.63, 0.65, black, { zBias: -0.011 });
    // Right arm + neon forearm cuff
    pushSegBox(faces, 0.01, 0.16, 0.69, 0.10, 0.23, 0.42 + stride, 0.046, 0.046, black);
    pushBox(faces, 0.04, 0.125, 0.17, 0.27, 0.46 + stride, 0.51 + stride, neonG, { em: true, zBias: -0.006 });
    // Dual dark blades with neon-green glowing edges
    for (const sd of [-1, 1]) {
      const bz = 0.40 + (sd > 0 ? stride : -stride);
      pushSegBox(faces, 0.08, sd * 0.225, bz, 0.34, sd * 0.215, bz + 0.18, 0.014, 0.022, [16, 20, 18]);
      pushSegBox(faces, 0.09, sd * 0.225, bz + 0.015, 0.35, sd * 0.215, bz + 0.195, 0.005, 0.006, neonG, { em: true, bright: true, zBias: -0.006 });
    }

    // Shadowed Head with neon-green jaw glitch & 3-pillar Domino Crown + Crimson Star Eye
    pushBox(faces, -0.09, 0.10, -0.10 + sway, 0.10 + sway, 0.74, 0.96, black);
    pushBox(faces, 0.085, 0.110, -0.09 + sway, 0.09 + sway, 0.745, 0.79, neonG, { em: true, zBias: -0.006 }); // Jaw hatch glow
    // Domino Crown Base + 3 Crown Pillars + X Emblem
    pushBox(faces, -0.10, 0.11, -0.11 + sway, 0.11 + sway, 0.94, 0.99, neonG, { em: true, bright: true });
    pushBox(faces, -0.03, 0.04, -0.04 + sway, 0.04 + sway, 0.99, 1.18, neonG, { em: true, bright: true }); // Tall middle domino
    pushBox(faces, 0.032, 0.052, -0.035 + sway, 0.035 + sway, 1.07, 1.086, black, { zBias: -0.008 }); // Domino divider
    pushBox(faces, 0.035, 0.055, -0.01 + sway, 0.01 + sway, 1.12, 1.14, black, { zBias: -0.009 }); // Top dot
    pushBox(faces, 0.035, 0.055, -0.026 + sway, 0.026 + sway, 1.015, 1.032, black, { zBias: -0.009 }); // Bottom pips
    pushBox(faces, -0.02, 0.03, -0.115 + sway, -0.075 + sway, 0.99, 1.11, neonG, { em: true }); // Left crown spike
    pushBox(faces, -0.02, 0.03, 0.075 + sway, 0.115 + sway, 0.99, 1.11, neonG, { em: true }); // Right crown spike
    // Crimson 4-point Star Eye Flare (Left) + glowing crimson slit (Right)
    const ex = 0.106;
    const ey = sway - 0.038;
    const ez = 0.87;
    pushBox(faces, ex, ex + 0.022, ey - 0.095, ey + 0.095, ez - 0.009, ez + 0.009, crimsonBright, { em: true, bright: true, zBias: -0.012 }); // Wide horizontal star ray
    pushBox(faces, ex, ex + 0.022, ey - 0.012, ey + 0.012, ez - 0.052, ez + 0.052, crimsonBright, { em: true, bright: true, zBias: -0.012 }); // Tall vertical star ray
    pushBox(faces, ex + 0.004, ex + 0.025, ey - 0.018, ey + 0.018, ez - 0.018, ez + 0.018, [255, 225, 225], { em: true, bright: true, zBias: -0.014 });
    pushBox(faces, ex, ex + 0.018, sway + 0.02, sway + 0.07, ez - 0.014, ez + 0.014, crimson, { em: true, bright: true, zBias: -0.010 });
    // Orbiting glitch sparks
    pushBox(faces, 0.04 + glt, 0.09 + glt, -0.24, -0.19, 0.82 + Math.sin(tm * 9) * 0.05, 0.87 + Math.sin(tm * 9) * 0.05, neonG, { em: true, bright: true });
    pushBox(faces, -0.04 - glt, 0.01 - glt, 0.21, 0.26, 0.56 + Math.cos(tm * 8) * 0.06, 0.61 + Math.cos(tm * 8) * 0.06, limeCore, { em: true, bright: true });
    return { yaw };
  }

  if (variant === 'figuraa') {
    // Promo Skin 2 (5 users): Towering meat-orange Figure with exposed pale ribcage, extra-long clawed arms & giant circular toothy mouth head (NO eyes)
    const meat = [182, 62, 20];
    const meatDark = [94, 24, 10];
    const meatHi = [218, 92, 28];
    const ribBone = [234, 202, 134];
    const toothCol = [248, 232, 186];
    const mawGlow = [245, 132, 26];

    // Extra-tall lanky striding legs + wide clawed feet (up to z = 0.58)
    for (const sd of [-1, 1]) {
      const lf = sd * stride * 1.45;
      pushSegBox(faces, 0.0, sd * 0.085, 0.58, lf * 0.7, sd * 0.115, 0.30, 0.042, 0.040, meat);
      pushSegBox(faces, lf * 0.7, sd * 0.115, 0.30, lf, sd * 0.105, 0.05, 0.036, 0.036, meatDark);
      pushBox(faces, lf - 0.06, lf + 0.13, sd * 0.105 - 0.048, sd * 0.105 + 0.048, 0.0, 0.065, [42, 12, 8]);
    }
    // Tall slender hunched torso (z: 0.54 -> 1.03) + prominent protruding pale ribs
    pushPrism(faces, 0.01, sway * 0.3, 0.11, 0.135, 0.54, 1.03, 8, meat);
    pushBox(faces, 0.07, 0.145, -0.09, 0.09, 0.72, 0.99, meatDark, { zBias: -0.004 });
    for (const rz of [0.76, 0.83, 0.90, 0.97]) {
      for (const sd of [-1, 1]) {
        pushSegBox(faces, 0.135, sd * 0.025, rz, 0.125, sd * 0.135, rz + 0.012, 0.016, 0.014, ribBone, { zBias: -0.008 });
      }
    }
    // Extra-long hunched double-jointed arms hanging almost down to ankles
    for (const sd of [-1, 1]) {
      const armReach = sd * stride * 0.8;
      pushSegBox(faces, 0.02, sd * 0.13, 0.99, -0.03, sd * 0.27, 0.56, 0.034, 0.034, meatHi);
      pushSegBox(faces, -0.03, sd * 0.27, 0.56, 0.15 + armReach, sd * 0.22, 0.16 - sd * stride, 0.028, 0.028, meatDark);
      for (let ci = -1; ci <= 1; ci++) {
        pushSegBox(faces, 0.15 + armReach, sd * 0.22 + ci * 0.018, 0.16 - sd * stride, 0.22 + armReach, sd * 0.20 + ci * 0.025, 0.08 - sd * stride, 0.008, 0.008, [30, 10, 8]);
      }
    }
    // Dark fleshy neck & huge round eyeless head (z: 1.02 -> 1.32) with giant circular tooth-ringed glowing mouth
    pushPrism(faces, 0.02, sway * 0.5, 0.068, 0.062, 1.01, 1.07, 7, meatDark);
    pushPrism(faces, 0.05, sway, 0.142, 0.118, 1.05, 1.29, 9, [46, 16, 12]);
    pushOcta(faces, 0.05, sway, 1.25, 0.132, 0.132, 0.08, [38, 14, 10]);
    // Giant circular gaping mouth pit glowing fiery orange inside + 10 inward teeth around the rim!
    const mouthX = 0.152;
    const mouthCz = 1.175;
    pushPrism(faces, mouthX - 0.015, sway, 0.105, 0.105, mouthCz - 0.095, mouthCz + 0.095, 8, meat, { zBias: -0.004 });
    pushBox(faces, mouthX - 0.008, mouthX + 0.028, sway - 0.098, sway + 0.098, mouthCz - 0.098, mouthCz + 0.098, [58, 14, 6], { zBias: -0.006 });
    pushBox(faces, mouthX + 0.005, mouthX + 0.036, sway - 0.072, sway + 0.072, mouthCz - 0.072, mouthCz + 0.072, mawGlow, { em: true, bright: true, zBias: -0.009 });
    for (let ti = 0; ti < 10; ti++) {
      const ta = (ti / 10) * Math.PI * 2;
      const oy0 = sway + Math.cos(ta) * 0.092;
      const oz0 = mouthCz + Math.sin(ta) * 0.092;
      const oy1 = sway + Math.cos(ta) * 0.052;
      const oz1 = mouthCz + Math.sin(ta) * 0.052;
      pushSegBox(faces, mouthX + 0.036, oy0, oz0, mouthX + 0.042, oy1, oz1, 0.010, 0.008, toothCol, { em: true, bright: true, zBias: -0.012 });
    }
    return { yaw };
  }

  if (variant === 'grannyde') {
    // Secret Skin (4 users): Charred blackened Granny in long grey buttoned dress, grey hair tufts, glowing white eyes & bloody bat
    const charred = [10, 10, 11];
    const dress = [78, 82, 88];
    const dressDark = [48, 50, 56];
    const hairGrey = [156, 163, 175];
    const batWood = [122, 74, 38];
    const gore = [156, 14, 18];

    // Dark footwear shadow + Long flared grey dress skirt & torso (z: 0.02 -> 0.74)
    pushPrism(faces, 0.0, 0.0, 0.24, 0.145, 0.02, 0.44, 8, dressDark);
    pushPrism(faces, 0.0, sway * 0.25, 0.145, 0.135, 0.44, 0.73, 8, dress);
    // Dress front vertical button placket
    for (const bz of [0.46, 0.52, 0.58, 0.64, 0.69]) {
      pushBox(faces, 0.128, 0.146, -0.012 + sway * 0.25, 0.012 + sway * 0.25, bz, bz + 0.016, [18, 20, 24], { zBias: -0.008 });
    }
    // Charred gaunt arms reaching down + blood-stained wooden baseball bat angled across torso
    for (const sd of [-1, 1]) {
      pushSegBox(faces, 0.01, sd * 0.14, 0.70, 0.08, sd * 0.21, 0.44, 0.028, 0.028, dress);
      pushSegBox(faces, 0.08, sd * 0.21, 0.44, 0.16, sd * 0.18, 0.26 - sd * stride * 0.6, 0.022, 0.022, charred);
    }
    pushSegBox(faces, 0.15, -0.15, 0.28, 0.19, 0.14, 0.56, 0.022, 0.022, batWood, { zBias: -0.006 });
    pushSegBox(faces, 0.165, 0.01, 0.43, 0.195, 0.15, 0.57, 0.026, 0.026, gore, { zBias: -0.009 });

    // Charred neck, blackened rounded head, grey side hair tufts, glowing white horror eyes & open mouth
    pushPrism(faces, 0.0, sway * 0.5, 0.045, 0.042, 0.72, 0.78, 7, charred);
    pushPrism(faces, 0.01, sway, 0.095, 0.088, 0.77, 0.99, 8, charred);
    pushOcta(faces, 0.01, sway, 0.97, 0.088, 0.088, 0.05, charred);
    for (const sd of [-1, 1]) {
      pushBox(faces, -0.04, 0.03, sway + sd * 0.082, sway + sd * 0.118, 0.85, 0.96, hairGrey);
      const ey = sway + sd * 0.034;
      pushBox(faces, 0.086, 0.110, ey - 0.016, ey + 0.016, 0.895, 0.925, [255, 255, 255], { em: true, bright: true, zBias: -0.012 });
    }
    // Gaping dark mouth with pale lip outline
    pushBox(faces, 0.086, 0.106, sway - 0.024, sway + 0.024, 0.79, 0.84, [118, 84, 72], { zBias: -0.007 });
    pushBox(faces, 0.092, 0.110, sway - 0.016, sway + 0.016, 0.798, 0.832, [4, 2, 2], { zBias: -0.011 });
    return { yaw };
  }

  if (variant === 'tvman') {
    // Secret Skin (3 users): Tall dark double-breasted trench-coat figure with bulky retro CRT TV head
    const coat = [26, 29, 34];
    const coatDark = [14, 16, 20];
    const trousers = [16, 18, 22];
    const tvShell = [20, 22, 27];
    const tvBezel = [42, 46, 54];
    const flicker = 0.86 + 0.14 * Math.sin(tm * 24);
    const screenCol = [Math.round(215 * flicker), Math.round(224 * flicker), Math.round(234 * flicker)];

    // Dark shoes & tailored trousers
    for (const sd of [-1, 1]) {
      const lf = sd * stride * 1.1;
      pushSegBox(faces, lf * 0.4, sd * 0.07, 0.46, lf, sd * 0.075, 0.05, 0.036, 0.036, trousers);
      pushBox(faces, lf - 0.05, lf + 0.11, sd * 0.075 - 0.038, sd * 0.075 + 0.038, 0.0, 0.055, [8, 9, 12]);
    }
    // Long dark double-breasted trench coat
    pushBox(faces, -0.085, 0.095, -0.14, 0.14, 0.28, 0.86, coat);
    pushBox(faces, 0.082, 0.106, -0.07, 0.07, 0.30, 0.85, coatDark, { zBias: -0.004 });
    for (const bz of [0.46, 0.56, 0.66, 0.76]) {
      for (const sd of [-1, 1]) {
        pushBox(faces, 0.098, 0.114, sd * 0.038 - 0.01, sd * 0.038 + 0.01, bz, bz + 0.018, [64, 70, 82], { zBias: -0.008 });
      }
    }
    // Sleeved arms & dark gloved hands
    for (const sd of [-1, 1]) {
      const aSwing = -sd * stride * 0.8;
      pushSegBox(faces, 0.0, sd * 0.14, 0.82, 0.04 + aSwing * 0.5, sd * 0.19, 0.58, 0.034, 0.034, coat);
      pushSegBox(faces, 0.04 + aSwing * 0.5, sd * 0.19, 0.58, 0.09 + aSwing, sd * 0.18, 0.36, 0.028, 0.028, coatDark);
      pushBox(faces, 0.06 + aSwing, 0.12 + aSwing, sd * 0.18 - 0.025, sd * 0.18 + 0.025, 0.30, 0.36, [10, 11, 14]);
    }
    // Bulky CRT TV Head (with deeper cathode back box & glowing pale static front glass)
    pushBox(faces, -0.17, -0.06, -0.12 + sway, 0.12 + sway, 0.90, 1.12, coatDark); // CRT rear tube housing
    pushBox(faces, -0.08, 0.12, -0.18 + sway, 0.18 + sway, 0.87, 1.17, tvShell); // Main TV cabinet
    pushBox(faces, 0.105, 0.132, -0.17 + sway, 0.17 + sway, 0.88, 1.16, tvBezel, { zBias: -0.004 });
    pushBox(faces, 0.122, 0.146, -0.145 + sway, 0.145 + sway, 0.905, 1.135, screenCol, { em: true, bright: true, zBias: -0.009 });
    // Subtle dark scanline bar moving across screen
    const scanZ = 0.92 + ((tm * 0.35) % 0.19);
    pushBox(faces, 0.136, 0.152, -0.14 + sway, 0.14 + sway, scanZ, scanZ + 0.018, [88, 98, 112], { zBias: -0.012 });
    return { yaw };
  }

  if (variant === 'ambush') {
    // Promo Skin (AMBUSH): Glitched spectral white face with two giant jagged hollow black eye sockets, gaping vertical oval mouth & lime-green static aura
    const boneWhite = [238, 246, 240];
    const paleGrey = [194, 212, 198];
    const voidBlack = [4, 6, 5];
    const glitchGreen = [64, 255, 118];
    const hover = Math.sin(tm * 5.4 + (s.x || 0)) * 0.06 + 0.12;
    const jx = (hunting ? Math.sin(tm * 37) : Math.sin(tm * 13)) * 0.016;
    const jy = (hunting ? Math.cos(tm * 29) : Math.cos(tm * 11)) * 0.018;

    // Spectral trailing glitch wisp below floating head
    pushPrism(faces, 0, sway * 0.4 + jy, 0.14, 0.06, 0.14 + hover, 0.56 + hover, 7, voidBlack, { a: 0.72 });
    pushPrism(faces, 0, sway * 0.4 + jy, 0.17, 0.08, 0.24 + hover, 0.54 + hover, 7, glitchGreen, { em: true, a: 0.22 });

    // Oversized pale oval skull mask
    pushPrism(faces, jx, sway + jy, 0.20, 0.17, 0.50 + hover, 1.12 + hover, 10, boneWhite, { bright: true });
    pushOcta(faces, jx, sway + jy, 1.12 + hover, 0.17, 0.17, 0.08, paleGrey);
    pushOcta(faces, jx, sway + jy, 0.50 + hover, 0.17, 0.17, 0.07, paleGrey);

    // Lime-green glitch aura halo shards around head
    for (let gi = 0; gi < 6; gi++) {
      const ang = (gi / 6) * Math.PI * 2 + tm * 1.8;
      const gx = jx + Math.cos(ang) * 0.04;
      const gy = sway + jy + Math.sin(ang) * 0.22;
      const gz = 0.80 + hover + Math.sin(tm * 7 + gi) * 0.18;
      pushBox(faces, gx - 0.015, gx + 0.025, gy - 0.018, gy + 0.018, gz - 0.025, gz + 0.025, glitchGreen, { em: true, bright: true, a: 0.85 });
    }

    // Two massive ragged pitch-black eye hollows + faint static specks inside
    for (const sd of [-1, 1]) {
      const ey = sway + jy + sd * 0.072;
      pushBox(faces, 0.155 + jx, 0.195 + jx, ey - 0.056, ey + 0.056, 0.83 + hover, 0.99 + hover, voidBlack, { zBias: -0.009 });
      pushBox(faces, 0.165 + jx, 0.200 + jx, ey - 0.036, ey + 0.036, 0.81 + hover, 1.01 + hover, [14, 24, 16], { zBias: -0.011 });
      // Tiny cyan/white noise pixel speck inside abyssal socket
      const spZ = 0.89 + hover + Math.sin(tm * 19 + sd) * 0.035;
      pushBox(faces, 0.192 + jx, 0.205 + jx, ey - 0.008, ey + 0.008, spZ, spZ + 0.014, [180, 255, 210], { em: true, zBias: -0.013 });
    }

    // Huge vertical gaping black oval screaming mouth
    pushBox(faces, 0.152 + jx, 0.196 + jx, sway + jy - 0.058, sway + jy + 0.058, 0.55 + hover, 0.78 + hover, voidBlack, { zBias: -0.010 });
    pushBox(faces, 0.165 + jx, 0.202 + jx, sway + jy - 0.036, sway + jy + 0.036, 0.52 + hover, 0.80 + hover, [8, 12, 10], { zBias: -0.012 });
    return { yaw };
  }

  if (variant === 'santagranny') {
    // Chapter 5 / Event Boss: Santa Granny matching attached reference (red fur-trimmed Santa gown & hat, white Santa beard, glowing white eyes, bloody bat)
    const suitRed = [188, 18, 26];
    const suitDark = [126, 10, 16];
    const furWhite = [238, 242, 248];
    const skin = [118, 106, 98];
    const batWood = [94, 52, 24];
    const gore = [132, 12, 16];

    // Long sleeveless crimson Santa dress with white fur hem band
    pushPrism(faces, 0, 0, 0.24, 0.22, 0.02, 0.12, 9, furWhite);
    pushPrism(faces, 0, 0, 0.22, 0.155, 0.12, 0.46, 9, suitDark);
    pushPrism(faces, 0, sway * 0.22, 0.155, 0.145, 0.46, 0.74, 9, suitRed);
    // White fur V-trim collar at top of red gown
    pushBox(faces, 0.125, 0.152, -0.085 + sway * 0.22, 0.085 + sway * 0.22, 0.69, 0.74, furWhite, { zBias: -0.005 });

    // Gaunt greyish arms & hands
    for (const sd of [-1, 1]) {
      pushSegBox(faces, 0.02, sd * 0.15, 0.70, 0.08, sd * 0.21, 0.46, 0.028, 0.028, skin);
      pushSegBox(faces, 0.08, sd * 0.21, 0.46, 0.15, sd * 0.17, 0.30 - sd * stride * 0.5, 0.023, 0.023, skin);
    }

    // Wooden baseball bat held across front of red dress (with dark dried blood stain)
    pushSegBox(faces, 0.15, -0.14, 0.34, 0.18, 0.12, 0.62, 0.022, 0.022, batWood, { zBias: -0.007 });
    pushSegBox(faces, 0.165, 0.02, 0.50, 0.19, 0.13, 0.63, 0.025, 0.025, gore, { zBias: -0.009 });

    // Neck, weathered dark-grey Granny face, fluffy white Santa beard + mustache, glowing white horror eyes & open black mouth
    pushPrism(faces, 0, sway * 0.45, 0.045, 0.042, 0.73, 0.79, 7, skin);
    pushPrism(faces, 0.01, sway, 0.095, 0.088, 0.78, 0.99, 8, skin);
    // Fluffy white Santa beard wrapping lower face
    pushPrism(faces, 0.055, sway, 0.072, 0.058, 0.72, 0.85, 8, furWhite, { zBias: -0.005 });
    pushBox(faces, 0.082, 0.114, sway - 0.042, sway + 0.042, 0.84, 0.865, furWhite, { zBias: -0.008 });
    // Red Santa hat with white fur band & hanging pom-pom
    pushPrism(faces, 0.0, sway, 0.105, 0.102, 0.96, 1.015, 8, furWhite);
    pushPrism(faces, -0.01, sway, 0.095, 0.028, 1.015, 1.15, 8, suitRed);
    pushBox(faces, -0.06, -0.01, sway - 0.022, sway + 0.022, 1.12, 1.17, furWhite);

    // Glowing white horror eyes & dark screaming O-mouth inside white beard
    for (const sd of [-1, 1]) {
      const ey = sway + sd * 0.034;
      pushBox(faces, 0.088, 0.112, ey - 0.016, ey + 0.016, 0.90, 0.928, [255, 255, 255], { em: true, bright: true, zBias: -0.012 });
    }
    pushBox(faces, 0.092, 0.118, sway - 0.020, sway + 0.020, 0.795, 0.838, [8, 2, 2], { zBias: -0.012 });
    return { yaw };
  }

  if (variant === 'monster5') {
    // Chapter 4: Hulking Garage Mechanic-Welder with cracked welding helmet & bloody pipe wrench
    const suit = [18, 23, 30];
    const suitMid = [34, 42, 52];
    const boot = [10, 12, 15];
    const gore = [148, 8, 12];
    const bone = [214, 204, 184];
    const steel = [52, 58, 66];
    const steelHi = [144, 154, 166];

    // Heavy boots & legs
    for (const sd of [-1, 1]) {
      const legFwd = sd * stride;
      pushSegBox(faces, legFwd * 0.5, sd * 0.085, 0.36, legFwd, sd * 0.095, 0.06, 0.056, 0.056, suit);
      pushBox(faces, legFwd - 0.07, legFwd + 0.12, sd * 0.095 - 0.052, sd * 0.095 + 0.052, 0.0, 0.075, boot);
    }
    // Broad coveralls torso + utility belt
    pushBox(faces, -0.09, 0.10, -0.17, 0.17, 0.34, 0.72, suit);
    pushBox(faces, -0.095, 0.108, -0.175, 0.175, 0.37, 0.42, [14, 15, 18]);
    pushBox(faces, 0.092, 0.114, -0.04, 0.04, 0.365, 0.425, [156, 164, 174]); // Steel belt buckle
    // Torn chest cavity with exposed ribs & arterial stains
    pushBox(faces, 0.085, 0.112, -0.08, 0.08, 0.46, 0.67, [38, 5, 7], { zBias: -0.005 });
    for (const rz of [0.49, 0.54, 0.59, 0.64]) {
      pushSegBox(faces, 0.110, -0.068, rz, 0.110, 0.068, rz - 0.008, 0.009, 0.008, bone, { zBias: -0.009 });
    }
    pushBox(faces, 0.09, 0.115, -0.14, -0.03, 0.43, 0.65, gore, { zBias: -0.006 });

    // Left clawed greasy arm + Right arm wielding giant blood-coated pipe wrench
    pushSegBox(faces, 0.02, -0.17, 0.67, 0.10, -0.25, 0.46, 0.044, 0.044, suitMid);
    pushSegBox(faces, 0.10, -0.25, 0.46, 0.21, -0.22, 0.28 - stride, 0.036, 0.036, suit);
    for (let ci = -1; ci <= 1; ci++) {
      pushSegBox(faces, 0.21, -0.22 + ci * 0.018, 0.28 - stride, 0.26, -0.21 + ci * 0.022, 0.21 - stride, 0.007, 0.007, bone);
    }

    pushSegBox(faces, 0.02, 0.17, 0.67, 0.11, 0.25, 0.48, 0.044, 0.044, suitMid);
    pushSegBox(faces, 0.11, 0.25, 0.48, 0.24, 0.23, 0.34 + stride, 0.038, 0.038, suit);
    // Giant Steel Pipe Wrench
    pushSegBox(faces, 0.21, 0.24, 0.25 + stride, 0.31, 0.22, 0.72 + stride, 0.018, 0.018, steelHi);
    pushBox(faces, 0.28, 0.36, 0.18, 0.28, 0.68 + stride, 0.78 + stride, steel);
    pushBox(faces, 0.30, 0.37, 0.185, 0.275, 0.70 + stride, 0.77 + stride, gore, { zBias: -0.006 });

    // Rotted flesh neck & Steel Welding Helmet with fractured dark visor + glowing amber welding eyes + jagged grill fangs
    pushPrism(faces, 0, sway * 0.5, 0.06, 0.055, 0.71, 0.78, 7, [82, 34, 30]);
    pushBox(faces, -0.08, 0.12, -0.10 + sway, 0.10 + sway, 0.76, 0.99, steel);
    pushBox(faces, -0.085, 0.125, -0.105 + sway, 0.105 + sway, 0.96, 1.01, steelHi);
    // Dark recessed visor slit
    pushBox(faces, 0.112, 0.132, -0.08 + sway, 0.08 + sway, 0.85, 0.93, [6, 7, 9], { zBias: -0.006 });
    // Left exposed rotting eye + burning orange core; right welding slit ember
    pushBox(faces, 0.120, 0.138, -0.065 + sway, -0.02 + sway, 0.865, 0.915, [190, 174, 146], { zBias: -0.009 });
    pushBox(faces, 0.126, 0.142, -0.052 + sway, -0.032 + sway, 0.880, 0.902, [255, 176, 32], { em: true, bright: true, zBias: -0.012 });
    pushBox(faces, 0.124, 0.142, 0.025 + sway, 0.065 + sway, 0.882, 0.904, [255, 130, 22], { em: true, bright: true, zBias: -0.012 });
    // Torn jagged steel grill teeth
    pushBox(faces, 0.114, 0.134, -0.065 + sway, 0.065 + sway, 0.78, 0.835, [8, 2, 2], { zBias: -0.006 });
    for (let ti = -2; ti <= 2; ti++) {
      const ty = ti * 0.024 + sway;
      pushBox(faces, 0.126, 0.140, ty - 0.007, ty + 0.007, 0.815, 0.836, bone, { zBias: -0.010 });
      pushBox(faces, 0.126, 0.140, ty - 0.007, ty + 0.007, 0.780, 0.802, bone, { zBias: -0.010 });
    }
    return { yaw };
  }

  if (variant === 'monster4') {
    // Chapter 3: Cemetery Gravekeeper in tattered dark shroud, exposed bloodstained skeleton & bloody grave spade
    const cloak = [10, 12, 10];
    const moss = [26, 44, 24];
    const skull = [212, 206, 182];
    const boneDark = [132, 126, 106];
    const gore = [138, 8, 12];

    // Flared ragged burial cloak
    pushPrism(faces, 0, 0, 0.25, 0.14, 0.02, 0.44, 8, cloak);
    pushPrism(faces, 0, sway * 0.3, 0.14, 0.12, 0.44, 0.74, 8, cloak);
    pushBox(faces, -0.14, -0.05, -0.19, 0.19, 0.03, 0.65, moss, { a: 0.7 });
    // Exposed bloodstained ribcage & spine
    pushBox(faces, 0.09, 0.125, -0.075, 0.075, 0.46, 0.70, [14, 4, 4], { zBias: -0.005 });
    pushBox(faces, 0.10, 0.132, -0.014, 0.014, 0.46, 0.71, boneDark, { zBias: -0.008 });
    for (const rz of [0.49, 0.54, 0.59, 0.64, 0.68]) {
      pushSegBox(faces, 0.126, -0.068, rz, 0.126, 0.068, rz - 0.005, 0.008, 0.007, skull, { zBias: -0.010 });
    }

    // Skeletal reaching claw arm (left) + Graveyard Spade arm (right)
    pushSegBox(faces, 0.01, -0.13, 0.68, 0.12, -0.22, 0.46, 0.024, 0.024, boneDark);
    pushSegBox(faces, 0.12, -0.22, 0.46, 0.26, -0.18, 0.24 - stride, 0.020, 0.020, skull);
    for (let ci = -1; ci <= 1; ci++) {
      pushSegBox(faces, 0.26, -0.18 + ci * 0.016, 0.24 - stride, 0.31, -0.17 + ci * 0.022, 0.16 - stride, 0.005, 0.005, gore);
    }

    pushSegBox(faces, 0.01, 0.13, 0.68, 0.10, 0.22, 0.48, 0.024, 0.024, boneDark);
    pushSegBox(faces, 0.10, 0.22, 0.48, 0.20, 0.24, 0.34, 0.020, 0.020, skull);
    // Long wooden handle & bloodstained iron graveyard spade
    pushSegBox(faces, 0.19, 0.24, 0.84, 0.22, 0.24, 0.14, 0.014, 0.014, [72, 48, 28]);
    pushBox(faces, 0.16, 0.28, 0.21, 0.27, 0.02, 0.15, [88, 96, 94]);
    pushBox(faces, 0.155, 0.285, 0.205, 0.275, 0.015, 0.065, gore, { zBias: -0.006 });

    // Hooded cracked skull with glowing necrotic green-white eyes + jagged fang maw
    pushBox(faces, -0.11, 0.08, -0.11 + sway, 0.11 + sway, 0.74, 0.99, cloak);
    pushPrism(faces, 0.02, sway, 0.088, 0.076, 0.75, 0.94, 7, skull);
    for (const sd of [-1, 1]) {
      const ey = sway + sd * 0.036;
      pushBox(faces, 0.082, 0.106, ey - 0.022, ey + 0.022, 0.84, 0.89, [4, 4, 4], { zBias: -0.006 });
      pushBox(faces, 0.094, 0.112, ey - 0.011, ey + 0.011, 0.855, 0.878, [120, 255, 130], { em: true, bright: true, zBias: -0.010 });
    }
    pushBox(faces, 0.082, 0.106, -0.038 + sway, 0.038 + sway, 0.76, 0.81, [8, 0, 0], { zBias: -0.006 });
    for (let ti = -2; ti <= 2; ti++) {
      pushBox(faces, 0.096, 0.110, ti * 0.016 + sway - 0.005, ti * 0.016 + sway + 0.005, 0.79, 0.81, skull, { zBias: -0.010 });
    }
    return { yaw };
  }

  if (variant === 'monster3') {
    // Chapter 2 Main Monster: Butchered pale-crimson entity with exposed sternum, dripping gore & bloodshot eyes
    const shroud = [20, 4, 9];
    const skin = [202, 182, 168];
    const gore = [152, 6, 12];
    const bone = [226, 214, 194];
    const hair = [12, 4, 6];

    pushPrism(faces, 0, 0, 0.22, 0.11, 0.02, 0.45, 7, shroud);
    pushPrism(faces, 0, sway * 0.4, 0.11, 0.10, 0.45, 0.73, 7, shroud);
    pushBox(faces, 0.075, 0.115, -0.07, 0.07, 0.44, 0.69, gore, { zBias: -0.005 });
    for (const rz of [0.51, 0.56, 0.61, 0.66]) {
      pushSegBox(faces, 0.114, -0.06, rz, 0.114, 0.06, rz, 0.008, 0.007, bone, { zBias: -0.009 });
    }
    // Long bloodied hanging pale arms & claws
    for (const sd of [-1, 1]) {
      pushSegBox(faces, 0.02, sd * 0.11, 0.69, 0.12, sd * 0.22, 0.44, 0.028, 0.028, skin);
      pushSegBox(faces, 0.12, sd * 0.22, 0.44, 0.24, sd * 0.19, 0.16 + sd * stride, 0.022, 0.022, gore);
      for (let ci = -1; ci <= 1; ci++) {
        pushSegBox(faces, 0.24, sd * 0.19 + ci * 0.015, 0.16 + sd * stride, 0.29, sd * 0.18 + ci * 0.02, 0.08 + sd * stride, 0.005, 0.005, bone);
      }
    }
    // Hair tendrils + tilted bruised skull + glowing pink-white eyes + torn jaw
    pushBox(faces, -0.11, -0.01, -0.12 + sway, 0.12 + sway, 0.56, 0.96, hair);
    pushPrism(faces, 0.01, sway, 0.086, 0.072, 0.74, 0.93, 7, skin);
    for (const sd of [-1, 1]) {
      const ey = sway + sd * 0.036;
      pushBox(faces, 0.078, 0.102, ey - 0.022, ey + 0.022, 0.84, 0.888, [10, 2, 2], { zBias: -0.006 });
      pushBox(faces, 0.090, 0.108, ey - 0.012, ey + 0.012, 0.855, 0.878, [255, 195, 195], { em: true, bright: true, zBias: -0.010 });
      pushBox(faces, 0.086, 0.102, ey - 0.006, ey + 0.006, 0.76, 0.84, gore, { zBias: -0.008 });
    }
    pushBox(faces, 0.078, 0.104, -0.045 + sway, 0.045 + sway, 0.755, 0.805, [8, 0, 0], { zBias: -0.006 });
    for (let ti = -2; ti <= 2; ti++) {
      pushBox(faces, 0.094, 0.108, ti * 0.017 + sway - 0.005, ti * 0.017 + sway + 0.005, 0.788, 0.806, bone, { zBias: -0.010 });
    }
    return { yaw };
  }

  if (variant === 'monster2' || variant === 'ghost') {
    // Chapter 2 / Hallucination Ghost: Pale stitched mask, floating shroud & icy-blue pinhole eyes
    const hover = variant === 'ghost' ? Math.sin(tm * 3.8 + (s.x || 0)) * 0.05 + 0.04 : 0;
    const gown = [16, 6, 10];
    const mask = [226, 220, 204];
    const bone = [194, 186, 168];
    const hair = [8, 8, 10];

    pushPrism(faces, 0, 0, 0.24, 0.10, 0.04 + hover, 0.46 + hover, 7, gown, variant === 'ghost' ? { a: 0.78 } : {});
    pushPrism(faces, 0, sway * 0.5, 0.10, 0.09, 0.46 + hover, 0.72 + hover, 7, gown);
    for (const sd of [-1, 1]) {
      pushSegBox(faces, 0.02, sd * 0.10, 0.68 + hover, 0.10, sd * 0.21, 0.44 + hover, 0.022, 0.022, bone);
      pushSegBox(faces, 0.10, sd * 0.21, 0.44 + hover, 0.22, sd * 0.18, 0.22 + hover + sd * stride, 0.016, 0.016, mask);
    }
    pushBox(faces, -0.10, 0.0, -0.11 + sway, 0.11 + sway, 0.62 + hover, 0.96 + hover, hair);
    pushPrism(faces, 0.02, sway, 0.088, 0.072, 0.74 + hover, 0.94 + hover, 7, mask);
    for (const sd of [-1, 1]) {
      const ey = sway + sd * 0.036;
      pushBox(faces, 0.082, 0.106, ey - 0.020, ey + 0.020, 0.84 + hover, 0.89 + hover, [4, 4, 6], { zBias: -0.006 });
      pushBox(faces, 0.094, 0.110, ey - 0.009, ey + 0.009, 0.858 + hover, 0.878 + hover, [205, 228, 255], { em: true, bright: true, zBias: -0.010 });
    }
    // Wide stitched grin line
    pushBox(faces, 0.086, 0.108, -0.05 + sway, 0.05 + sway, 0.78 + hover, 0.794 + hover, [10, 6, 6], { zBias: -0.008 });
    return { yaw };
  }

  // Chapter 1 Default Monster ('monster1'): Towering gaunt shadow horror with exposed ribs, crooked claws, crimson pinpoints & unhinged fang jaw
  const fleshDark = [10, 10, 12];
  const skullBone = [218, 210, 190];
  const skullShade = [124, 116, 100];
  const blood = [148, 8, 12];

  for (const sd of [-1, 1]) {
    const legFwd = sd * stride;
    pushSegBox(faces, 0, sd * 0.06, 0.40, legFwd * 0.6, sd * 0.08, 0.18, 0.026, 0.026, fleshDark);
    pushSegBox(faces, legFwd * 0.6, sd * 0.08, 0.18, legFwd, sd * 0.07, 0.0, 0.020, 0.020, fleshDark);
  }
  pushBox(faces, -0.06, 0.07, -0.10, 0.10, 0.38, 0.72, fleshDark);
  pushBox(faces, 0.055, 0.084, -0.012, 0.012, 0.42, 0.72, skullShade, { zBias: -0.006 });
  for (const rz of [0.46, 0.51, 0.56, 0.61, 0.66]) {
    pushSegBox(faces, 0.078, -0.072, rz, 0.078, 0.072, rz - 0.006, 0.008, 0.007, skullBone, { zBias: -0.009 });
  }
  // Long spindly 3-jointed arms with hooked bloody claws
  for (const sd of [-1, 1]) {
    pushSegBox(faces, 0.01, sd * 0.10, 0.69, -0.02, sd * 0.24, 0.50, 0.022, 0.022, fleshDark);
    pushSegBox(faces, -0.02, sd * 0.24, 0.50, 0.16, sd * 0.22, 0.28 + sd * stride, 0.018, 0.018, fleshDark);
    for (let ci = -1; ci <= 1; ci++) {
      pushSegBox(faces, 0.16, sd * 0.22 + ci * 0.015, 0.28 + sd * stride, 0.24, sd * 0.20 + ci * 0.024, 0.16 + sd * stride, 0.005, 0.005, ci === 0 ? blood : skullBone);
    }
  }
  // Neck & tilted elongated pale skull with wet dark hair strands
  pushPrism(faces, 0, sway * 0.4, 0.036, 0.032, 0.71, 0.78, 6, skullShade);
  pushBox(faces, -0.10, -0.01, -0.11 + sway + twitch, 0.11 + sway + twitch, 0.58, 0.98, [6, 6, 8]);
  pushPrism(faces, 0.01, sway + twitch, 0.086, 0.070, 0.75, 0.96, 7, skullBone);
  for (const sd of [-1, 1]) {
    const ey = sway + twitch + sd * 0.036;
    pushBox(faces, 0.078, 0.104, ey - 0.022, ey + 0.022, 0.855, 0.905, [2, 2, 2], { zBias: -0.006 });
    pushBox(faces, 0.092, 0.110, ey - 0.010, ey + 0.010, 0.870, 0.892, [255, 34, 34], { em: true, bright: true, zBias: -0.010 });
    pushBox(faces, 0.084, 0.100, ey - 0.005, ey + 0.005, 0.78, 0.855, blood, { zBias: -0.008 });
  }
  // Unhinged gaping jaw crammed with fangs
  const jawDrop = hunting ? 0.032 : 0.015;
  pushBox(faces, 0.078, 0.106, -0.048 + sway + twitch, 0.048 + sway + twitch, 0.74 - jawDrop, 0.815, [6, 0, 0], { zBias: -0.006 });
  for (let ti = -2; ti <= 2; ti++) {
    const ty = ti * 0.018 + sway + twitch;
    pushBox(faces, 0.092, 0.108, ty - 0.005, ty + 0.005, 0.795, 0.815, skullBone, { zBias: -0.010 });
    pushBox(faces, 0.092, 0.108, ty - 0.005, ty + 0.005, 0.74 - jawDrop, 0.76 - jawDrop, skullBone, { zBias: -0.010 });
  }
  return { yaw };
}

// Realistic 3D Co-op Survivor Player (+X = facing toward camera/aim direction, +Z = up)
function buildPlayerFaces(faces, s, tm, ctx) {
  const jacket = hexToRgbArr(s.jacketHex || '#d8d8d0');
  const pants = [30, 32, 38];
  const boots = [16, 16, 18];
  const skin = [226, 194, 164];
  const hair = [40, 26, 18];
  const stride = Math.sin(tm * 7.5 + (s.x || 0) * 4) * 0.045;
  const yaw = s.faceYaw ?? (ctx ? Math.atan2(ctx.oy - s.y, ctx.ox - s.x) : 0);

  for (const sd of [-1, 1]) {
    const lf = sd * stride;
    pushSegBox(faces, lf * 0.4, sd * 0.06, 0.36, lf, sd * 0.06, 0.05, 0.038, 0.038, pants);
    pushBox(faces, lf - 0.045, lf + 0.075, sd * 0.06 - 0.036, sd * 0.06 + 0.036, 0.0, 0.055, boots);
  }
  // Jacket torso + collar
  pushBox(faces, -0.07, 0.075, -0.125, 0.125, 0.35, 0.67, jacket);
  pushBox(faces, 0.068, 0.082, -0.03, 0.03, 0.36, 0.66, [34, 38, 44], { zBias: -0.004 }); // Jacket zipper
  // Left resting arm
  pushSegBox(faces, 0.0, -0.125, 0.63, 0.03, -0.15, 0.41, 0.030, 0.030, jacket);
  pushBox(faces, 0.0, 0.055, -0.175, -0.125, 0.36, 0.41, skin);
  // Right arm holding flashlight forward when s.f is on
  if (s.f) {
    pushSegBox(faces, 0.0, 0.125, 0.63, 0.16, 0.14, 0.56, 0.030, 0.030, jacket);
    pushBox(faces, 0.14, 0.24, 0.12, 0.16, 0.54, 0.58, [48, 54, 62]);
    pushBox(faces, 0.23, 0.26, 0.122, 0.158, 0.542, 0.578, [255, 240, 168], { em: true, bright: true });
  } else {
    pushSegBox(faces, 0.0, 0.125, 0.63, 0.03, 0.15, 0.41, 0.030, 0.030, jacket);
    pushBox(faces, 0.0, 0.055, 0.125, 0.175, 0.36, 0.41, skin);
  }
  // Head, hair & facial features
  pushPrism(faces, 0, 0, 0.036, 0.034, 0.67, 0.72, 6, skin);
  pushPrism(faces, 0, 0, 0.084, 0.074, 0.71, 0.87, 7, skin);
  pushPrism(faces, -0.006, 0, 0.088, 0.072, 0.81, 0.895, 7, hair);
  pushBox(faces, 0.076, 0.090, -0.036, -0.016, 0.785, 0.805, [20, 18, 18], { zBias: -0.006 });
  pushBox(faces, 0.076, 0.090, 0.016, 0.036, 0.785, 0.805, [20, 18, 18], { zBias: -0.006 });

  return { yaw };
}

function buildFacesForKind(kind, s, tm, ch, ctx) {
  const faces = [];
  let yaw = s.yaw || 0;

  switch (kind) {
    case 'monster1':
    case 'monster2':
    case 'monster3':
    case 'monster4':
    case 'monster5':
    case 'matrixman':
    case 'figuraa':
    case 'grannyde':
    case 'tvman':
    case 'ambush':
    case 'santagranny':
    case 'ghost': {
      const res = buildMonsterFaces(faces, kind, s, tm, ctx);
      yaw = res.yaw;
      break;
    }

    case 'player3d': {
      const res = buildPlayerFaces(faces, s, tm, ctx);
      yaw = res.yaw;
      break;
    }

    case 'crate': {
      // Recessed shipping crate with timber corner posts, slat boards, diagonal brace & iron brackets
      pushBox(faces, -0.205, 0.205, -0.205, 0.205, 0.015, 0.405, [58, 36, 19]); // Dark recessed core planks
      for (const sx of [-0.22, 0.165]) {
        for (const sy of [-0.22, 0.165]) {
          pushBox(faces, sx, sx + 0.055, sy, sy + 0.055, 0.0, 0.425, [82, 54, 30]); // 4 corner timber posts
        }
      }
      // Top & bottom frame rails + slightly ajar top lid
      pushBox(faces, -0.225, 0.225, -0.225, 0.225, 0.0, 0.055, [76, 48, 26], { zBias: -0.004 });
      pushBox(faces, -0.225, 0.225, -0.225, 0.225, 0.37, 0.425, [76, 48, 26], { zBias: -0.004 });
      pushBox(faces, -0.21, 0.21, -0.21, 0.21, 0.425, 0.445, [104, 70, 40]);
      // Front/back diagonal cross braces + rusted iron corner brackets
      for (const fy of [-0.216, 0.216]) {
        pushSegBox(faces, -0.18, fy, 0.05, 0.18, fy, 0.37, 0.022, 0.014, [96, 62, 34], { zBias: -0.008 });
      }
      for (const sx of [-0.228, 0.184]) {
        for (const sy of [-0.228, 0.184]) {
          pushBox(faces, sx, sx + 0.044, sy, sy + 0.044, 0.372, 0.432, [44, 48, 56], { zBias: -0.010 });
          pushBox(faces, sx, sx + 0.044, sy, sy + 0.044, 0.002, 0.054, [44, 48, 56], { zBias: -0.010 });
        }
      }
      break;
    }

    case 'barrel': {
      // 10-sided steel fuel drum with spilled oil stain, swaged rolling hoops, stenciled hazard stripe & bung plugs
      pushPrism(faces, 0.04, -0.02, 0.24, 0.24, 0.002, 0.008, 7, [14, 12, 12], { a: 0.72, zBias: 0.015 });
      pushPrism(faces, 0, 0, 0.19, 0.19, 0.0, 0.56, 10, [118, 28, 24]);
      pushPrism(faces, 0, 0, 0.194, 0.194, 0.22, 0.33, 10, [218, 162, 30], { capTop: false, zBias: -0.004 });
      pushPrism(faces, 0, 0, 0.196, 0.196, 0.36, 0.53, 10, [86, 34, 22], { a: 0.45, capTop: false, zBias: -0.006 }); // Rust grime patch
      for (const rz of [0.005, 0.18, 0.36, 0.535]) {
        pushPrism(faces, 0, 0, 0.205, 0.205, rz, rz + 0.028, 10, [34, 38, 44], { capTop: false, zBias: -0.009 });
      }
      pushPrism(faces, 0, 0, 0.175, 0.175, 0.556, 0.568, 10, [74, 38, 28], { zBias: -0.005 }); // Recessed drum top
      pushPrism(faces, 0.075, -0.02, 0.022, 0.022, 0.565, 0.588, 6, [180, 188, 198], { zBias: -0.010 }); // Main 2" bung plug
      pushPrism(faces, -0.075, 0.03, 0.014, 0.014, 0.565, 0.584, 6, [156, 164, 174], { zBias: -0.010 }); // Vent plug
      break;
    }

    case 'torch': {
      // Wrought-iron tripod floor torch with oil-soaked wrapped head, ember basket & 3-stage animated flame
      const fl = 0.88 + 0.18 * Math.sin(tm * 13 + (s.x || 0) * 5);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        pushSegBox(faces, 0, 0, 0.12, Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.0, 0.015, 0.014, [38, 40, 46]);
      }
      pushPrism(faces, 0, 0, 0.032, 0.024, 0.08, 0.52, 7, [48, 38, 30]);
      pushPrism(faces, 0, 0, 0.050, 0.068, 0.48, 0.56, 7, [30, 32, 36]); // Iron fire basket
      pushPrism(faces, 0, 0, 0.044, 0.056, 0.55, 0.61, 6, [66, 28, 14]); // Charred oil-soaked rag wrap
      pushPrism(faces, 0, 0, 0.052, 0.052, 0.56, 0.585, 6, [215, 64, 14], { em: true, zBias: -0.005 }); // Glowing embers
      pushPrism(faces, 0, 0, 0.068 * fl, 0.0, 0.59, 0.79 * fl, 5, [242, 112, 22], { em: true, bright: true });
      pushPrism(faces, 0, 0, 0.036 * fl, 0.0, 0.60, 0.72 * fl, 5, [255, 240, 145], { em: true, bright: true, zBias: -0.010 });
      break;
    }

    case 'candelabra': {
      // Ornate multi-tiered antique bronze candelabra with curved scroll arms, drip saucers & melting candles
      const fl = 0.90 + 0.16 * Math.sin(tm * 9 + (s.x || 0) * 3);
      pushPrism(faces, 0, 0, 0.14, 0.08, 0.0, 0.045, 8, [138, 94, 28]);
      pushPrism(faces, 0, 0, 0.075, 0.035, 0.045, 0.10, 8, [172, 122, 38]);
      pushPrism(faces, 0, 0, 0.024, 0.020, 0.10, 0.55, 7, [186, 134, 42]);
      pushPrism(faces, 0, 0, 0.042, 0.042, 0.34, 0.38, 7, [196, 144, 48]); // Stem knop
      // Curved scroll branches left & right
      for (const sd of [-1, 1]) {
        pushSegBox(faces, 0, 0, 0.36, sd * 0.11, 0, 0.42, 0.012, 0.012, [170, 116, 34]);
        pushSegBox(faces, sd * 0.11, 0, 0.42, sd * 0.16, 0, 0.48, 0.012, 0.012, [186, 134, 42]);
      }
      for (const [cx, cz, ch0] of [[-0.16, 0.48, 0.11], [0, 0.55, 0.14], [0.16, 0.48, 0.12]]) {
        pushPrism(faces, cx, 0, 0.040, 0.032, cz, cz + 0.018, 7, [188, 138, 44]); // Drip saucer
        pushPrism(faces, cx, 0, 0.018, 0.017, cz + 0.018, cz + 0.018 + ch0, 6, [242, 232, 202]); // Wax body
        pushBox(faces, cx - 0.022, cx - 0.014, -0.008, 0.008, cz + 0.03, cz + ch0, [224, 212, 180], { zBias: -0.004 }); // Wax drip
        pushPrism(faces, cx, 0, 0.025, 0, cz + 0.018 + ch0, cz + 0.09 * fl + ch0, 4, [254, 198, 72], { em: true, bright: true });
      }
      break;
    }

    case 'clock': {
      // Sculpted antique mahogany grandfather clock with pediment crown, rotating clock hands & swinging pendulum bob
      pushBox(faces, -0.22, 0.22, -0.15, 0.15, 0.0, 0.04, [38, 20, 10]); // Plinth feet
      pushBox(faces, -0.20, 0.20, -0.14, 0.14, 0.04, 0.15, [52, 28, 14]);
      pushBox(faces, -0.17, 0.17, -0.12, 0.12, 0.15, 0.78, [64, 34, 18]);
      // Side pilasters + dark recessed glass waist box
      pushBox(faces, -0.175, -0.135, -0.128, -0.105, 0.18, 0.76, [48, 24, 12], { zBias: -0.004 });
      pushBox(faces, 0.135, 0.175, -0.128, -0.105, 0.18, 0.76, [48, 24, 12], { zBias: -0.004 });
      pushBox(faces, -0.12, 0.12, -0.126, -0.09, 0.22, 0.70, [18, 10, 6], { zBias: -0.005 });
      const sw = Math.sin(tm * 3.14) * 0.065;
      pushSegBox(faces, 0, -0.125, 0.68, sw, -0.125, 0.29, 0.008, 0.008, [202, 156, 46], { zBias: -0.009 });
      pushPrism(faces, sw, -0.125, 0.036, 0.036, 0.26, 0.30, 8, [228, 178, 56], { zBias: -0.011 }); // Brass pendulum bob
      // Hood, arched pediment & brass finial
      pushBox(faces, -0.20, 0.20, -0.14, 0.14, 0.78, 1.06, [58, 30, 16]);
      pushBox(faces, -0.22, 0.22, -0.15, 0.15, 1.04, 1.09, [42, 22, 11]);
      pushBox(faces, -0.12, 0.12, -0.14, 0.14, 1.09, 1.15, [52, 28, 14]);
      pushPrism(faces, 0, 0, 0.025, 0.0, 1.15, 1.23, 5, [212, 166, 52]);
      // Front & Back brass-bezeled clock dials with real animated hands
      for (const sd of [-1, 1]) {
        const yFace = sd * 0.144;
        pushBox(faces, -0.115, 0.115, yFace - 0.008, yFace + 0.008, 0.815, 1.015, [196, 152, 46], { zBias: -0.008 });
        pushBox(faces, -0.10, 0.10, yFace - 0.012, yFace + 0.012, 0.83, 1.00, [232, 224, 200], { zBias: -0.011 });
        const minA = tm * 0.4;
        const hrA = tm * 0.04;
        pushSegBox(faces, 0, yFace + sd * 0.008, 0.915, Math.sin(minA) * 0.072, yFace + sd * 0.008, 0.915 + Math.cos(minA) * 0.072, 0.006, 0.005, [20, 18, 16], { zBias: -0.014 });
        pushSegBox(faces, 0, yFace + sd * 0.008, 0.915, Math.sin(hrA) * 0.046, yFace + sd * 0.008, 0.915 + Math.cos(hrA) * 0.046, 0.008, 0.006, [20, 18, 16], { zBias: -0.014 });
      }
      break;
    }

    case 'tires': {
      // Staggered stack of 3 10-sided treaded car tires + stamped steel rim & 4 lug bolts on top wheel
      const offs = [[0, 0, 0], [0.025, -0.015, 0.112], [-0.015, 0.022, 0.224]];
      for (let ti = 0; ti < offs.length; ti++) {
        const [ox0, oy0, oz] = offs[ti];
        pushPrism(faces, ox0, oy0, 0.235, 0.235, oz, oz + 0.108, 10, [24, 26, 30]);
        pushPrism(faces, ox0, oy0, 0.242, 0.242, oz + 0.022, oz + 0.086, 10, [18, 19, 22], { capTop: false, zBias: -0.004 }); // Tread band
        pushPrism(faces, ox0, oy0, 0.118, 0.118, oz + 0.006, oz + 0.112, 8, ti === 2 ? [146, 154, 164] : [12, 13, 16], { zBias: -0.006 });
        if (ti === 2) {
          pushPrism(faces, ox0, oy0, 0.042, 0.042, oz + 0.108, oz + 0.118, 6, [26, 28, 34], { zBias: -0.010 });
          for (let li = 0; li < 4; li++) {
            const la = li * Math.PI * 0.5 + 0.4;
            pushPrism(faces, ox0 + Math.cos(la) * 0.072, oy0 + Math.sin(la) * 0.072, 0.010, 0.010, oz + 0.110, oz + 0.120, 5, [196, 204, 214], { zBias: -0.012 });
          }
        }
      }
      break;
    }

    case 'cone': {
      // Weighted rubber octagon base with corner pads + scuffed hazard orange cone + dual white reflective bands
      pushBox(faces, -0.17, 0.17, -0.17, 0.17, 0.0, 0.038, [30, 32, 38]);
      pushPrism(faces, 0, 0, 0.145, 0.145, 0.036, 0.052, 8, [44, 46, 52]);
      pushPrism(faces, 0, 0, 0.128, 0.028, 0.052, 0.43, 8, [228, 86, 18]);
      pushPrism(faces, 0, 0, 0.104, 0.084, 0.14, 0.215, 8, [240, 244, 248], { capTop: false, zBias: -0.005 });
      pushPrism(faces, 0, 0, 0.072, 0.054, 0.26, 0.325, 8, [240, 244, 248], { capTop: false, zBias: -0.005 });
      pushPrism(faces, 0, 0, 0.024, 0.024, 0.425, 0.436, 8, [16, 18, 22], { zBias: -0.008 }); // Hollow tip
      break;
    }

    case 'urn': {
      // Weathered carved stone funerary urn with stepped granite plinth, twin amphora handles & bronze finial
      pushBox(faces, -0.165, 0.165, -0.165, 0.165, 0.0, 0.07, [82, 88, 94]);
      pushBox(faces, -0.135, 0.135, -0.135, 0.135, 0.07, 0.15, [104, 110, 116]);
      pushPrism(faces, 0, 0, 0.075, 0.105, 0.15, 0.22, 10, [118, 124, 130]);
      pushPrism(faces, 0, 0, 0.105, 0.175, 0.22, 0.34, 10, [126, 132, 138]);
      pushPrism(faces, 0, 0, 0.175, 0.120, 0.34, 0.42, 10, [108, 114, 120]);
      // Side sculptural amphora handles
      for (const sd of [-1, 1]) {
        pushSegBox(faces, sd * 0.13, 0, 0.26, sd * 0.20, 0, 0.34, 0.016, 0.014, [96, 102, 108]);
        pushSegBox(faces, sd * 0.20, 0, 0.34, sd * 0.12, 0, 0.40, 0.016, 0.014, [96, 102, 108]);
      }
      pushPrism(faces, 0, 0, 0.135, 0.06, 0.42, 0.46, 8, [168, 116, 34]); // Bronze lid
      pushPrism(faces, 0, 0, 0.032, 0.0, 0.46, 0.54, 6, [202, 146, 44]); // Bronze flame finial
      break;
    }

    case 'bonePile': {
      // Bloodstained remains: coagulated puddle, crossed articulated femurs + condyles, ribs, skull & jawbone
      pushPrism(faces, 0.02, 0.0, 0.25, 0.25, 0.002, 0.009, 7, [74, 6, 8], { a: 0.85, zBias: 0.018 });
      // Crossed femur bones with round joint knuckles
      pushSegBox(faces, -0.23, -0.05, 0.028, 0.23, 0.04, 0.032, 0.018, 0.016, [206, 198, 178]);
      pushPrism(faces, -0.23, -0.05, 0.028, 0.024, 0.012, 0.048, 6, [216, 208, 188]);
      pushPrism(faces, 0.23, 0.04, 0.028, 0.024, 0.014, 0.050, 6, [216, 208, 188]);
      pushSegBox(faces, -0.05, -0.21, 0.036, 0.07, 0.21, 0.040, 0.017, 0.015, [196, 188, 168]);
      // Curved ribs
      for (const ry of [-0.08, 0.10]) {
        pushSegBox(faces, -0.16, ry, 0.026, -0.06, ry + 0.04, 0.06, 0.009, 0.008, [214, 206, 186]);
      }
      // Sculpted human cranium with jawbone, eye sockets, nasal cavity & teeth
      pushPrism(faces, 0.03, 0.02, 0.088, 0.072, 0.06, 0.195, 8, [224, 216, 196]);
      pushBox(faces, 0.06, 0.115, -0.035, 0.075, 0.035, 0.095, [210, 202, 182]); // Jawbone
      pushBox(faces, 0.082, 0.118, -0.028, 0.002, 0.110, 0.148, [14, 10, 10], { zBias: -0.008 }); // Left eye pit
      pushBox(faces, 0.082, 0.118, 0.036, 0.066, 0.110, 0.148, [14, 10, 10], { zBias: -0.008 }); // Right eye pit
      pushBox(faces, 0.092, 0.122, 0.010, 0.026, 0.082, 0.108, [16, 12, 12], { zBias: -0.008 }); // Nasal cavity
      pushBox(faces, 0.096, 0.122, -0.018, 0.058, 0.060, 0.076, [238, 232, 216], { zBias: -0.010 }); // Teeth row
      break;
    }

    case 'stat': {
      // Weeping Angel Statue: cracked mossy stepped plinth, draped stone robe, layered feathered wings, hands raised over face
      pushBox(faces, -0.26, 0.26, -0.26, 0.26, 0.0, 0.08, [88, 92, 86]);
      pushBox(faces, -0.22, 0.22, -0.22, 0.22, 0.08, 0.21, [114, 116, 110]);
      pushBox(faces, -0.23, 0.23, -0.23, -0.19, 0.02, 0.12, [46, 72, 32], { a: 0.72, zBias: -0.005 }); // Moss
      pushPrism(faces, 0, 0, 0.19, 0.125, 0.21, 0.72, 8, [138, 140, 134]); // Draped gown
      pushBox(faces, -0.13, 0.13, -0.15, 0.15, 0.62, 0.74, [146, 148, 142]); // Shoulders
      // Multi-tiered carved stone feathered wings
      for (const sd of [-1, 1]) {
        pushSegBox(faces, -0.04, sd * 0.11, 0.64, -0.18, sd * 0.29, 0.90, 0.042, 0.028, [132, 134, 128]);
        pushSegBox(faces, -0.16, sd * 0.26, 0.86, -0.22, sd * 0.24, 0.34, 0.046, 0.026, [120, 122, 116]);
        pushSegBox(faces, -0.12, sd * 0.21, 0.76, -0.17, sd * 0.19, 0.42, 0.036, 0.022, [146, 148, 142]);
      }
      // Bowed head + raised weeping stone forearms & hands covering face
      pushPrism(faces, 0.02, 0, 0.102, 0.088, 0.73, 0.95, 8, [152, 154, 146]);
      for (const sd of [-1, 1]) {
        pushSegBox(faces, 0.04, sd * 0.12, 0.68, 0.11, sd * 0.08, 0.78, 0.030, 0.028, [144, 146, 140]);
        pushSegBox(faces, 0.11, sd * 0.08, 0.78, 0.115, sd * 0.035, 0.88, 0.026, 0.022, [158, 160, 152]);
      }
      // Dark crack line & tear stain
      pushBox(faces, 0.095, 0.115, -0.04, 0.04, 0.81, 0.84, [48, 50, 46], { zBias: -0.008 });
      break;
    }

    case 'tree': {
      // Gnarled Autumn Cemetery Tree: flared roots, twisted bark trunk, forked limbs & multi-clustered faceted foliage
      const sway = Math.sin(tm * 1.35 + (s.x || 0) * 1.9 + (s.y || 0)) * 0.030;
      for (let ri = 0; ri < 4; ri++) {
        const ra = ri * Math.PI * 0.5 + 0.4;
        pushSegBox(faces, Math.cos(ra) * 0.08, Math.sin(ra) * 0.08, 0.14, Math.cos(ra) * 0.28, Math.sin(ra) * 0.28, 0.0, 0.052, 0.048, [44, 28, 18]);
      }
      pushPrism(faces, 0, 0, 0.18, 0.105, 0.0, 0.84, 7, [54, 34, 22]);
      pushSegBox(faces, -0.02, 0, 0.56, -0.26 + sway * 0.5, -0.14, 0.96, 0.050, 0.045, [48, 30, 19]);
      pushSegBox(faces, 0.02, 0, 0.54, 0.28 + sway * 0.5, 0.14, 0.95, 0.048, 0.044, [48, 30, 19]);
      pushSegBox(faces, 0, 0.02, 0.66, sway * 0.7, 0.24, 1.04, 0.040, 0.036, [48, 30, 19]);
      const alt = ((Math.round((s.x || 0) * 3 + (s.y || 0) * 7)) & 1) === 1;
      const cA = alt ? [146, 52, 18] : [178, 102, 22];
      const cB = alt ? [112, 34, 14] : [142, 68, 18];
      const cC = alt ? [192, 92, 24] : [214, 142, 34];
      pushOcta(faces, sway, 0, 1.14, 0.58, 0.58, 0.36, cA, { above: true });
      pushOcta(faces, -0.32 + sway * 1.2, -0.16, 0.99, 0.38, 0.38, 0.25, cB, { above: true });
      pushOcta(faces, 0.33 + sway * 1.2, 0.16, 1.03, 0.38, 0.38, 0.26, cC, { above: true });
      pushOcta(faces, -0.08 + sway * 1.3, 0.28, 1.08, 0.34, 0.34, 0.24, cB, { above: true });
      pushOcta(faces, sway * 1.5, 0.02, 1.40, 0.38, 0.38, 0.26, cC, { above: true });
      break;
    }

    case 'chapelDome': {
      // Orthodox Chapel Cupola: molded cornice, 8-sided drum with recessed arched windows, ribbed slate onion dome & 3-bar cross
      pushBox(faces, -1.06, 1.06, -1.06, 1.06, 0.96, 1.05, [186, 170, 138], { above: true });
      pushBox(faces, -1.10, 1.10, -1.10, 1.10, 1.03, 1.08, [148, 134, 108], { above: true });
      pushPrism(faces, 0, 0, 0.62, 0.60, 1.08, 1.50, 8, [202, 186, 152], { above: true });
      // Dark recessed arched blind windows around drum
      for (let wi = 0; wi < 4; wi++) {
        const wa = wi * Math.PI * 0.5;
        const wx = Math.cos(wa) * 0.58;
        const wy = Math.sin(wa) * 0.58;
        pushBox(faces, wx - 0.11, wx + 0.11, wy - 0.11, wy + 0.11, 1.16, 1.42, [34, 30, 26], { above: true, zBias: -0.008 });
      }
      // Smooth tiered 10-sided copper-slate onion dome bulb
      pushPrism(faces, 0, 0, 0.62, 0.72, 1.50, 1.66, 10, [42, 50, 62], { above: true });
      pushPrism(faces, 0, 0, 0.72, 0.52, 1.66, 1.82, 10, [36, 44, 54], { above: true });
      pushPrism(faces, 0, 0, 0.52, 0.18, 1.82, 1.98, 10, [48, 56, 68], { above: true });
      pushPrism(faces, 0, 0, 0.18, 0.02, 1.98, 2.12, 10, [56, 66, 80], { above: true });
      // Gilded sphere + 3-bar Russian Orthodox Cross
      pushOcta(faces, 0, 0, 2.13, 0.055, 0.055, 0.055, [238, 192, 56], { em: true, above: true });
      pushBox(faces, -0.022, 0.022, -0.022, 0.022, 2.16, 2.48, [235, 188, 52], { em: true, above: true });
      pushBox(faces, -0.14, 0.14, -0.018, 0.018, 2.34, 2.375, [235, 188, 52], { em: true, above: true });
      pushBox(faces, -0.08, 0.08, -0.018, 0.018, 2.42, 2.445, [235, 188, 52], { em: true, above: true });
      pushSegBox(faces, -0.085, 0, 2.23, 0.085, 0, 2.27, 0.014, 0.014, [235, 188, 52], { em: true, above: true });
      break;
    }

    case 'table': {
      // Carved timber table with apron frame, drawer + brass knob, planked tabletop & bottle/candle clutter
      const legCol = [62, 40, 22];
      for (const lx of [-0.35, 0.29]) {
        for (const ly of [-0.21, 0.15]) {
          pushBox(faces, lx, lx + 0.055, ly, ly + 0.055, 0.0, 0.36, legCol);
          pushBox(faces, lx + 0.005, lx + 0.050, ly + 0.005, ly + 0.050, 0.0, 0.04, [32, 24, 18], { zBias: -0.004 });
        }
      }
      pushBox(faces, -0.35, 0.35, -0.20, 0.20, 0.28, 0.36, [76, 48, 26]); // Apron box
      pushBox(faces, -0.18, 0.18, -0.208, -0.18, 0.295, 0.345, [92, 58, 32], { zBias: -0.005 }); // Front drawer
      pushBox(faces, -0.02, 0.02, -0.222, -0.20, 0.312, 0.328, [202, 162, 62], { zBias: -0.008 }); // Brass pull
      pushBox(faces, -0.42, 0.42, -0.26, 0.26, 0.36, 0.415, [106, 70, 40]); // Tabletop
      // Bottle & old mug clutter on tabletop
      pushPrism(faces, -0.20, 0.06, 0.032, 0.030, 0.415, 0.51, 6, [34, 88, 46], { zBias: -0.006 });
      pushPrism(faces, -0.20, 0.06, 0.014, 0.012, 0.51, 0.56, 6, [34, 88, 46], { zBias: -0.006 });
      pushPrism(faces, 0.22, -0.08, 0.034, 0.034, 0.415, 0.475, 6, [156, 152, 140], { zBias: -0.006 });
      break;
    }

    case 'shelf': {
      // Antique bookcase with crown molding, 4 shelves & staggered tilted leather books + skull/tins
      pushBox(faces, -0.37, 0.37, -0.20, 0.20, 0.90, 0.95, [54, 34, 18]); // Crown cornice
      pushBox(faces, -0.36, 0.36, -0.185, 0.185, 0.0, 0.06, [52, 32, 18]); // Kickplate
      pushBox(faces, -0.36, -0.315, -0.18, 0.18, 0.0, 0.92, [68, 44, 24]);
      pushBox(faces, 0.315, 0.36, -0.18, 0.18, 0.0, 0.92, [68, 44, 24]);
      pushBox(faces, -0.36, 0.36, 0.145, 0.185, 0.0, 0.92, [42, 26, 14]);
      const bookPal = [[124, 34, 34], [46, 78, 52], [136, 98, 42], [44, 58, 92], [96, 64, 38]];
      const szs = [0.16, 0.40, 0.64, 0.87];
      for (let si = 0; si < szs.length; si++) {
        const sz = szs[si];
        pushBox(faces, -0.34, 0.34, -0.17, 0.16, sz, sz + 0.032, [86, 56, 32]);
        for (let bi = 0; bi < 4; bi++) {
          const bx = -0.26 + bi * 0.13 + ((si % 2) * 0.03);
          const bh = 0.11 + ((bi + si) % 3) * 0.025;
          pushBox(faces, bx, bx + 0.045, -0.12, 0.11, sz + 0.032, sz + 0.032 + bh, bookPal[(bi + si) % bookPal.length]);
        }
      }
      break;
    }

    case 'sofa': {
      // Tufted vintage parlor sofa with bun feet, rolled armrests, deep split cushions & crooked throw pillow
      for (const fx of [-0.48, 0.42]) {
        for (const fy of [-0.22, 0.18]) {
          pushPrism(faces, fx + 0.03, fy + 0.02, 0.032, 0.024, 0.0, 0.06, 6, [52, 30, 18]);
        }
      }
      pushBox(faces, -0.52, 0.52, -0.26, 0.26, 0.06, 0.24, [78, 28, 38]);
      // Split seat cushions
      pushBox(faces, -0.44, -0.015, -0.24, 0.12, 0.24, 0.32, [114, 42, 56]);
      pushBox(faces, 0.015, 0.44, -0.24, 0.12, 0.24, 0.32, [108, 38, 52]);
      // Tall tufted backrest
      pushBox(faces, -0.52, 0.52, 0.11, 0.28, 0.24, 0.56, [94, 34, 46]);
      // Rolled armrests + wooden scroll fronts
      for (const sd of [-1, 1]) {
        const ax0 = sd > 0 ? 0.44 : -0.57;
        const ax1 = sd > 0 ? 0.57 : -0.44;
        pushBox(faces, ax0, ax1, -0.26, 0.26, 0.06, 0.41, [88, 32, 44]);
        pushBox(faces, ax0 + 0.015, ax1 - 0.015, -0.272, -0.245, 0.14, 0.38, [58, 34, 20], { zBias: -0.005 });
      }
      // Crooked throw pillow
      pushSegBox(faces, -0.42, -0.10, 0.32, -0.28, 0.04, 0.45, 0.042, 0.068, [148, 128, 86], { zBias: -0.008 });
      break;
    }

    case 'bed': {
      // Carved wooden bedstead with corner finials, iron frame, stained mattress, rumpled quilt & indented pillow
      for (const px0 of [-0.54, 0.48]) {
        for (const py0 of [-0.29, 0.23]) {
          const topZ = px0 < 0 ? 0.62 : 0.44;
          pushBox(faces, px0, px0 + 0.06, py0, py0 + 0.06, 0.0, topZ, [58, 36, 20]);
          pushOcta(faces, px0 + 0.03, py0 + 0.03, topZ + 0.03, 0.035, 0.035, 0.035, [76, 48, 26]);
        }
      }
      pushBox(faces, -0.52, -0.48, -0.25, 0.25, 0.14, 0.56, [68, 42, 24]); // Headboard panel
      pushBox(faces, 0.48, 0.52, -0.25, 0.25, 0.14, 0.38, [68, 42, 24]); // Footboard panel
      pushBox(faces, -0.50, 0.50, -0.27, 0.27, 0.10, 0.23, [74, 48, 30]); // Side frame
      pushBox(faces, -0.47, 0.47, -0.25, 0.25, 0.23, 0.33, [186, 192, 204]); // Mattress
      pushBox(faces, -0.44, -0.21, -0.19, 0.19, 0.33, 0.40, [224, 222, 228]); // Pillow
      pushBox(faces, -0.14, 0.46, -0.26, 0.26, 0.24, 0.355, [106, 120, 146]); // Blanket
      pushBox(faces, -0.14, -0.04, -0.265, 0.265, 0.34, 0.365, [198, 204, 214], { zBias: -0.005 }); // Folded sheet cuff
      pushBox(faces, 0.06, 0.26, -0.08, 0.12, 0.355, 0.368, [106, 12, 16], { a: 0.72, zBias: -0.008 }); // Dried stain
      break;
    }

    case 'bench': {
      // Scrolled wrought-iron park/cemetery bench with slatted wooden boards & iron bolt studs
      for (const lx of [-0.36, 0.31]) {
        pushBox(faces, lx, lx + 0.045, -0.16, 0.15, 0.0, 0.23, [26, 28, 32]);
        pushSegBox(faces, lx + 0.022, 0.13, 0.23, lx + 0.022, 0.16, 0.48, 0.020, 0.018, [26, 28, 32]); // Back upright
        pushBox(faces, lx, lx + 0.045, -0.15, 0.14, 0.30, 0.34, [32, 34, 40]); // Armrest loop
      }
      // 3 seat slats + 2 backrest slats
      for (const sy of [-0.14, -0.03, 0.08]) {
        pushBox(faces, -0.43, 0.43, sy, sy + 0.075, 0.23, 0.265, [92, 64, 38]);
      }
      for (const bz of [0.31, 0.40]) {
        pushBox(faces, -0.43, 0.43, 0.115, 0.155, bz, bz + 0.07, [82, 56, 34]);
      }
      break;
    }

    case 'tub': {
      // Vintage clawfoot cast-iron bathtub with ball-and-claw feet, rolled rim, murky water & brass gooseneck faucet
      for (const fx of [-0.36, 0.36]) {
        for (const fy of [-0.17, 0.17]) {
          pushPrism(faces, fx, fy, 0.028, 0.018, 0.0, 0.08, 6, [54, 56, 62]);
        }
      }
      pushBox(faces, -0.46, 0.46, -0.25, 0.25, 0.07, 0.34, [202, 210, 214]); // Outer enameled iron tub
      pushBox(faces, -0.48, 0.48, -0.27, 0.27, 0.315, 0.355, [224, 230, 234]); // Rolled top rim
      pushBox(faces, -0.41, 0.41, -0.20, 0.20, 0.335, 0.360, [82, 22, 24], { a: 0.85, zBias: -0.008 }); // Murky bloodied bathwater
      // Brass gooseneck faucet + twin handles at head
      pushBox(faces, 0.38, 0.44, -0.03, 0.03, 0.355, 0.46, [176, 134, 48]);
      pushBox(faces, 0.32, 0.42, -0.02, 0.02, 0.44, 0.47, [176, 134, 48]);
      pushPrism(faces, 0.41, -0.09, 0.022, 0.022, 0.355, 0.39, 6, [196, 152, 56]);
      pushPrism(faces, 0.41, 0.09, 0.022, 0.022, 0.355, 0.39, 6, [196, 152, 56]);
      break;
    }

    case 'stove': {
      // Enamel Soviet gas stove with cast-iron grates, oven window, control knobs, splashback & cooking pot
      pushBox(faces, -0.26, 0.26, -0.24, 0.24, 0.02, 0.47, [194, 196, 200]); // Body
      pushBox(faces, -0.26, 0.26, 0.20, 0.25, 0.47, 0.56, [182, 186, 190]); // Rear splashback
      pushBox(faces, -0.26, 0.26, -0.25, 0.25, 0.445, 0.48, [34, 36, 40]); // Hob top
      pushBox(faces, -0.19, 0.19, -0.256, -0.22, 0.13, 0.35, [22, 24, 28], { zBias: -0.005 }); // Oven window
      pushBox(faces, -0.16, 0.16, -0.272, -0.25, 0.365, 0.385, [212, 218, 226], { zBias: -0.008 }); // Oven handle bar
      for (let ki = -2; ki <= 2; ki++) {
        pushPrism(faces, ki * 0.09, -0.255, 0.015, 0.015, 0.405, 0.435, 6, [24, 26, 30], { zBias: -0.008 });
      }
      for (const bx of [-0.12, 0.12]) {
        for (const by of [-0.10, 0.10]) {
          pushPrism(faces, bx, by, 0.056, 0.056, 0.48, 0.502, 6, [18, 20, 22]);
        }
      }
      // Old blackened cooking pot resting askew on front-left burner
      pushPrism(faces, -0.12, -0.10, 0.075, 0.080, 0.502, 0.60, 8, [68, 74, 80], { zBias: -0.006 });
      pushPrism(faces, -0.12, -0.10, 0.084, 0.04, 0.60, 0.625, 8, [96, 102, 110], { zBias: -0.008 });
      break;
    }

    case 'pc': {
      // Steel security workstation: desk frame, PC tower w/ glowing LED, CRT monitor with scanline CCTV image, keyboard & mouse
      pushBox(faces, -0.39, 0.39, -0.23, 0.23, 0.33, 0.37, [72, 50, 30]); // Desk surface
      for (const lx of [-0.36, 0.32]) {
        pushBox(faces, lx, lx + 0.04, -0.21, 0.21, 0.0, 0.33, [34, 38, 44]);
      }
      // Side PC Tower
      pushBox(faces, 0.19, 0.34, -0.14, 0.16, 0.37, 0.60, [48, 52, 58]);
      pushBox(faces, 0.22, 0.31, -0.146, -0.13, 0.52, 0.55, [28, 32, 36], { zBias: -0.005 });
      const screenOn = !!s.pcActive;
      pushBox(faces, 0.29, 0.315, -0.148, -0.132, 0.42, 0.44, screenOn ? [44, 240, 120] : [140, 28, 28], { em: true, zBias: -0.008 });
      // Deep CRT monitor housing + glowing green/teal phosphor glass
      pushBox(faces, -0.22, 0.10, -0.06, 0.16, 0.37, 0.65, [54, 58, 66]);
      pushBox(faces, -0.14, 0.02, 0.08, 0.20, 0.41, 0.60, [42, 46, 52]); // Rear CRT tube bulge
      pushBox(
        faces, -0.19, 0.07, -0.072, -0.05, 0.40, 0.62,
        screenOn ? [36, 198, 126] : [12, 30, 22],
        { em: screenOn, bright: screenOn, zBias: -0.010 }
      );
      // Mechanical keyboard & mouse
      pushBox(faces, -0.24, 0.06, -0.20, -0.11, 0.37, 0.39, [82, 88, 96]);
      pushBox(faces, 0.09, 0.15, -0.19, -0.13, 0.37, 0.392, [74, 80, 88]);
      break;
    }

    case 'stairs': {
      // Timber cellar stairs: notched stringers, 7 overhanging treads, vertical risers, newel posts & sloped handrails
      for (let i = 0; i < 7; i++) {
        const y0 = -0.36 + i * 0.105;
        const z1 = 0.105 + i * 0.115;
        pushBox(faces, -0.33, 0.33, y0, y0 + 0.115, 0.0, z1, [92 + i * 5, 58 + i * 4, 32 + i * 2]);
        pushBox(faces, -0.34, 0.34, y0 - 0.015, y0 + 0.115, z1 - 0.025, z1 + 0.008, [118 + i * 5, 78 + i * 4, 44 + i * 2], { zBias: -0.004 }); // Nosing tread
      }
      for (const sx of [-0.37, 0.34]) {
        pushBox(faces, sx, sx + 0.038, -0.38, -0.32, 0.0, 0.44, [62, 38, 20]); // Lower newel
        pushBox(faces, sx, sx + 0.038, 0.32, 0.38, 0.0, 1.02, [62, 38, 20]); // Upper newel
        pushSegBox(faces, sx + 0.019, -0.35, 0.44, sx + 0.019, 0.35, 1.02, 0.022, 0.020, [88, 56, 30]); // Sloped handrail
      }
      break;
    }

    case 'lamp': {
      // Fluted cast-iron streetlamp: stepped octagon base, collar rings, gooseneck bracket, glazed lantern cage & buzzing bulb
      const buzz = Math.sin(tm * 19 + (s.x || 0)) > 0.84 ? 0.52 : 1.0;
      pushPrism(faces, 0, 0, 0.115, 0.085, 0.0, 0.08, 8, [22, 24, 28]);
      pushPrism(faces, 0, 0, 0.070, 0.038, 0.08, 0.24, 8, [28, 30, 36]);
      pushPrism(faces, 0, 0, 0.028, 0.022, 0.24, 1.04, 7, [28, 32, 38]);
      pushPrism(faces, 0, 0, 0.042, 0.042, 0.62, 0.66, 7, [38, 42, 48]); // Mid collar
      // Glazed lantern hood & copper finial
      pushPrism(faces, 0, 0, 0.055, 0.095, 1.04, 1.18, 6, [24, 28, 34], { above: true });
      pushPrism(faces, 0, 0, 0.115, 0.0, 1.18, 1.28, 6, [20, 22, 26], { above: true });
      pushOcta(faces, 0, 0, 1.12, 0.068, 0.068, 0.075, [(244 * buzz) | 0, (238 * buzz) | 0, (162 * buzz) | 0], { em: true, bright: true, above: true });
      break;
    }

    case 'corpse': {
      const idx = (s.corpseKind ?? s.k ?? 0) % 3;
      if (s.yaw === undefined) {
        yaw = (s.fl ? Math.PI : 0) + Math.sin((s.x || 0) * 13.7 + (s.y || 0) * 7.9) * 0.95;
      }
      const jacket = idx === 1 ? [86, 26, 40] : idx === 2 ? [66, 58, 40] : [42, 46, 56];
      const shirt = idx === 1 ? [164, 146, 138] : idx === 2 ? [116, 106, 86] : [178, 174, 166];
      const pants = idx === 1 ? [34, 22, 28] : idx === 2 ? [44, 40, 32] : [26, 28, 34];
      const skin = idx === 1 ? [174, 158, 146] : idx === 2 ? [164, 152, 134] : [168, 160, 148];
      const hair = idx === 1 ? [48, 22, 16] : idx === 2 ? [84, 82, 76] : [18, 16, 18];
      const boot = [20, 18, 18];

      pushPrism(faces, 0.08, 0.02, 0.34, 0.33, 0.002, 0.010, 7, [68, 4, 6], { a: 0.88, zBias: 0.02 });
      pushPrism(faces, 0.19, -0.05, 0.21, 0.20, 0.004, 0.014, 6, [118, 8, 12], { a: 0.90, zBias: 0.012 });
      pushSegBox(faces, -0.34, 0.04, 0.006, 0.22, -0.08, 0.008, 0.06, 0.005, [92, 6, 8], { a: 0.82, zBias: 0.015 });

      pushSegBox(faces, -0.14, -0.06, 0.045, -0.30, -0.11, 0.055, 0.052, 0.042, pants);
      pushSegBox(faces, -0.30, -0.11, 0.052, -0.46, -0.06, 0.038, 0.042, 0.036, pants);
      pushSegBox(faces, -0.45, -0.06, 0.042, -0.52, -0.12, 0.052, 0.036, 0.046, boot);

      pushSegBox(faces, -0.14, 0.06, 0.045, -0.29, 0.14, 0.062, 0.052, 0.042, pants);
      pushSegBox(faces, -0.29, 0.14, 0.058, -0.44, 0.09, 0.036, 0.042, 0.036, pants);
      pushSegBox(faces, -0.43, 0.09, 0.042, -0.51, 0.16, 0.050, 0.036, 0.046, boot);

      pushBox(faces, -0.18, -0.04, -0.105, 0.105, 0.014, 0.105, pants);
      pushBox(faces, -0.05, 0.22, -0.13, 0.13, 0.014, 0.125, jacket);
      pushBox(faces, 0.04, 0.23, -0.065, 0.065, 0.02, 0.132, shirt, { zBias: -0.004 });
      pushBox(faces, 0.14, 0.24, -0.155, 0.155, 0.02, 0.122, jacket);

      pushBox(faces, 0.02, 0.16, -0.055, 0.055, 0.120, 0.138, [126, 8, 12], { zBias: -0.008 });
      for (const rx of [0.045, 0.09, 0.135]) {
        pushSegBox(faces, rx, -0.045, 0.138, rx + 0.01, 0.045, 0.138, 0.009, 0.008, [222, 210, 188], { zBias: -0.012 });
      }

      pushSegBox(faces, 0.19, -0.13, 0.085, 0.06, -0.24, 0.045, 0.036, 0.032, jacket);
      pushSegBox(faces, 0.06, -0.24, 0.045, -0.05, -0.28, 0.024, 0.028, 0.024, skin);
      pushBox(faces, -0.10, -0.03, -0.32, -0.25, 0.012, 0.032, skin);

      pushSegBox(faces, 0.20, 0.13, 0.085, 0.31, 0.22, 0.042, 0.036, 0.032, jacket);
      pushSegBox(faces, 0.31, 0.22, 0.042, 0.42, 0.17, 0.024, 0.028, 0.024, skin);
      pushBox(faces, 0.40, 0.47, 0.14, 0.20, 0.012, 0.032, skin);

      pushSegBox(faces, 0.21, 0.0, 0.07, 0.26, 0.015, 0.085, 0.038, 0.035, skin);
      pushPrism(faces, 0.315, 0.02, 0.088, 0.072, 0.018, 0.148, 7, skin);
      pushPrism(faces, 0.328, 0.024, 0.090, 0.068, 0.105, 0.162, 7, hair);
      pushBox(faces, 0.275, 0.305, -0.042, -0.012, 0.082, 0.112, [14, 10, 10], { zBias: -0.010 });
      pushBox(faces, 0.275, 0.305, 0.022, 0.052, 0.082, 0.112, [14, 10, 10], { zBias: -0.010 });
      pushSegBox(faces, 0.26, 0.01, 0.055, 0.36, -0.08, 0.016, 0.018, 0.012, [142, 8, 12], { zBias: -0.010 });
      break;
    }

    case 'friend': {
      // Anatomical fallen friend corpse in Chapter 2 (blue denim jacket, blood pool, boots, chest wound & horrified face)
      if (s.yaw === undefined) {
        yaw = s.fl ? Math.PI * 0.85 : -0.25;
      }
      const denim = [44, 72, 118];
      const pants = [34, 36, 44];
      const skin = [214, 182, 152];
      const hair = [48, 30, 18];
      const boot = [20, 18, 18];

      pushPrism(faces, 0.12, 0.02, 0.36, 0.34, 0.002, 0.012, 7, [98, 4, 8], { a: 0.90, zBias: 0.018 });
      pushPrism(faces, 0.24, -0.04, 0.22, 0.20, 0.005, 0.016, 6, [138, 8, 12], { a: 0.92, zBias: 0.012 });

      pushSegBox(faces, -0.15, -0.06, 0.045, -0.32, -0.11, 0.052, 0.050, 0.042, pants);
      pushSegBox(faces, -0.32, -0.11, 0.048, -0.47, -0.07, 0.036, 0.042, 0.035, pants);
      pushSegBox(faces, -0.46, -0.07, 0.04, -0.53, -0.13, 0.05, 0.035, 0.045, boot);

      pushSegBox(faces, -0.15, 0.06, 0.045, -0.30, 0.14, 0.058, 0.050, 0.042, pants);
      pushSegBox(faces, -0.30, 0.14, 0.055, -0.45, 0.10, 0.036, 0.042, 0.035, pants);
      pushSegBox(faces, -0.44, 0.10, 0.04, -0.52, 0.16, 0.05, 0.035, 0.045, boot);

      pushBox(faces, -0.18, -0.04, -0.105, 0.105, 0.015, 0.108, pants);
      pushBox(faces, -0.05, 0.23, -0.135, 0.135, 0.015, 0.132, denim);
      pushBox(faces, 0.03, 0.18, -0.06, 0.06, 0.125, 0.142, [134, 8, 12], { zBias: -0.008 });

      pushSegBox(faces, 0.19, -0.13, 0.085, 0.06, -0.25, 0.042, 0.035, 0.030, denim);
      pushSegBox(faces, 0.06, -0.25, 0.042, -0.04, -0.28, 0.022, 0.026, 0.022, skin);
      pushSegBox(faces, 0.20, 0.13, 0.085, 0.34, 0.21, 0.040, 0.035, 0.030, denim);
      pushSegBox(faces, 0.34, 0.21, 0.040, 0.44, 0.16, 0.022, 0.026, 0.022, skin);

      pushPrism(faces, 0.31, 0.01, 0.090, 0.074, 0.018, 0.155, 7, skin);
      pushPrism(faces, 0.324, 0.012, 0.092, 0.070, 0.11, 0.168, 7, hair);
      pushBox(faces, 0.28, 0.31, -0.04, -0.01, 0.088, 0.114, [16, 12, 12], { zBias: -0.010 });
      pushBox(faces, 0.28, 0.31, 0.02, 0.05, 0.088, 0.114, [16, 12, 12], { zBias: -0.010 });
      break;
    }

    case 'cageSpot': {
      const k = s.spotKind ?? s.k ?? 0;
      if (k === 0) {
        // Searchable skull & crossed femur cache
        pushPrism(faces, 0, 0, 0.19, 0.18, 0.002, 0.008, 6, [64, 6, 8], { a: 0.78 });
        pushSegBox(faces, -0.19, -0.04, 0.025, 0.19, 0.04, 0.028, 0.016, 0.014, [210, 202, 180]);
        pushPrism(faces, 0, 0, 0.088, 0.072, 0.045, 0.178, 7, [222, 214, 192]);
        pushBox(faces, 0.06, 0.095, -0.038, -0.008, 0.09, 0.13, [14, 10, 10], { zBias: -0.008 });
        pushBox(faces, 0.06, 0.095, 0.014, 0.044, 0.09, 0.13, [14, 10, 10], { zBias: -0.008 });
      } else if (k === 1) {
        // Galvanized riveted steel pail with arch bail handle & murky liquid
        pushPrism(faces, 0, 0, 0.125, 0.16, 0.0, 0.24, 8, [96, 102, 110]);
        pushPrism(faces, 0, 0, 0.165, 0.165, 0.215, 0.242, 8, [64, 70, 76], { capTop: false, zBias: -0.005 });
        pushPrism(faces, 0, 0, 0.145, 0.145, 0.232, 0.246, 8, [26, 30, 32], { zBias: -0.008 });
        pushSegBox(faces, -0.16, 0, 0.23, 0, 0.09, 0.34, 0.008, 0.008, [164, 172, 182]);
        pushSegBox(faces, 0, 0.09, 0.34, 0.16, 0, 0.23, 0.008, 0.008, [164, 172, 182]);
      } else if (k === 2) {
        // Stitched leather field satchel / metal tool box with brass clasps
        pushBox(faces, -0.22, 0.22, -0.15, 0.15, 0.0, 0.11, [112, 74, 38]);
        pushBox(faces, -0.225, 0.225, -0.155, 0.155, 0.095, 0.125, [138, 96, 48], { zBias: -0.004 });
        for (const sx of [-0.11, 0.11]) {
          pushBox(faces, sx - 0.02, sx + 0.02, -0.162, 0.162, 0.06, 0.132, [68, 42, 20], { zBias: -0.008 });
          pushBox(faces, sx - 0.016, sx + 0.016, -0.168, -0.15, 0.065, 0.095, [212, 172, 62], { zBias: -0.010 });
        }
      } else {
        // Slatted wood supply lockbox with iron hasp & brass padlock
        pushBox(faces, -0.19, 0.19, -0.14, 0.14, 0.0, 0.22, [88, 58, 34]);
        pushBox(faces, -0.20, 0.20, -0.15, 0.15, 0.18, 0.23, [68, 44, 24], { zBias: -0.004 });
        pushBox(faces, -0.025, 0.025, -0.158, -0.135, 0.11, 0.20, [48, 52, 58], { zBias: -0.008 });
        pushBox(faces, -0.022, 0.022, -0.164, -0.142, 0.085, 0.13, [202, 158, 48], { zBias: -0.010 });
      }
      break;
    }

    case 'photo': {
      // Three-legged wooden artist easel holding a gilded portrait frame with eerie backlit subject silhouette
      pushSegBox(faces, -0.16, 0.0, 0.0, -0.12, -0.02, 0.56, 0.018, 0.016, [52, 30, 16]);
      pushSegBox(faces, 0.16, 0.0, 0.0, 0.12, -0.02, 0.56, 0.018, 0.016, [52, 30, 16]);
      pushSegBox(faces, 0.0, 0.22, 0.0, 0.0, 0.03, 0.54, 0.018, 0.016, [44, 24, 14]);
      pushBox(faces, -0.20, 0.20, -0.04, 0.02, 0.21, 0.245, [76, 48, 26]); // Easel tray ledge
      pushBox(faces, -0.20, 0.20, -0.03, 0.03, 0.23, 0.63, [196, 152, 42]); // Outer gilt frame
      const accent = (s.photoIdx === 0) ? [38, 168, 88] : (s.photoIdx === 1) ? [196, 44, 48] : [74, 138, 228];
      pushBox(faces, -0.155, 0.155, -0.036, 0.036, 0.275, 0.585, accent, { em: true, zBias: -0.008 });
      // Dark eerie portrait silhouette + tiny red eye glints inside photo
      pushPrism(faces, 0, 0, 0.06, 0.05, 0.30, 0.50, 6, [18, 14, 18], { zBias: -0.011 });
      pushBox(faces, -0.035, -0.015, -0.040, 0.040, 0.44, 0.46, [255, 50, 50], { em: true, bright: true, zBias: -0.014 });
      pushBox(faces, 0.015, 0.035, -0.040, 0.040, 0.44, 0.46, [255, 50, 50], { em: true, bright: true, zBias: -0.014 });
      break;
    }

    case 'radio': {
      // 3D Vintage Garage Radio on heavy metal/wooden table stand playing Piggy - Duocara
      const on = s.radioOn !== false;
      const pulse = on ? (0.78 + 0.22 * Math.sin(tm * 9.2)) : 0.18;
      for (const lx of [-0.22, 0.18]) {
        for (const ly of [-0.14, 0.10]) {
          pushBox(faces, lx, lx + 0.04, ly, ly + 0.04, 0.0, 0.34, [42, 46, 54]);
        }
      }
      pushBox(faces, -0.26, 0.26, -0.18, 0.18, 0.34, 0.38, [88, 56, 32]);
      pushBox(faces, -0.18, 0.18, -0.11, 0.11, 0.38, 0.60, [104, 48, 22]);
      pushBox(faces, -0.14, 0.04, -0.116, -0.09, 0.42, 0.56, [186, 148, 72]);
      for (let gi = 0; gi < 3; gi++) {
        pushBox(faces, -0.13, 0.03, -0.12, -0.11, 0.44 + gi * 0.04, 0.455 + gi * 0.04, [38, 22, 12], { zBias: -0.008 });
      }
      const dialRgb = on ? [(250 * pulse) | 0, (176 * pulse) | 0, (54 * pulse) | 0] : [36, 38, 42];
      pushBox(faces, 0.06, 0.15, -0.116, -0.09, 0.48, 0.55, dialRgb, { em: on, bright: on, zBias: -0.008 });
      pushBox(faces, 0.06, 0.15, 0.09, 0.116, 0.48, 0.55, dialRgb, { em: on, bright: on, zBias: -0.008 });
      pushPrism(faces, 0.09, -0.125, 0.02, 0.02, 0.41, 0.45, 6, [202, 168, 92]);
      pushPrism(faces, 0.14, -0.125, 0.02, 0.02, 0.41, 0.45, 6, [202, 168, 92]);
      pushBox(faces, -0.14, -0.12, 0.06, 0.08, 0.60, 0.94, [196, 204, 214]);
      if (on) {
        pushOcta(faces, -0.13, 0.07, 0.96, 0.035 * pulse, 0.035 * pulse, 0.035 * pulse, [255, 110, 48], { em: true, bright: true });
      }
      break;
    }

    // Floating rotating collectibles
    case 'key': {
      // Ornate antique brass skeleton key: sculpted open ring bow, stepped collar, cylindrical shaft & warded bit teeth
      yaw = tm * 2.1 + (s.x || 0);
      const zb0 = 0.17 + 0.04 * Math.sin(tm * 3.4 + (s.x || 0));
      const gold = [246, 198, 46];
      const goldHi = [255, 228, 108];
      for (let ri = 0; ri < 8; ri++) {
        const a0 = (ri / 8) * Math.PI * 2;
        const a1 = ((ri + 1) / 8) * Math.PI * 2;
        pushSegBox(
          faces,
          Math.cos(a0) * 0.072, 0, zb0 + 0.22 + Math.sin(a0) * 0.068,
          Math.cos(a1) * 0.072, 0, zb0 + 0.22 + Math.sin(a1) * 0.068,
          0.015, 0.014, gold, { em: true }
        );
      }
      pushPrism(faces, 0, 0, 0.036, 0.032, zb0 + 0.145, zb0 + 0.168, 6, goldHi, { em: true }); // Stepped collar
      pushPrism(faces, 0, 0, 0.020, 0.018, zb0, zb0 + 0.155, 6, gold, { em: true }); // Cylindrical stem
      pushBox(faces, 0.016, 0.082, -0.014, 0.014, zb0 + 0.015, zb0 + 0.095, gold, { em: true }); // Bit plate
      pushBox(faces, 0.045, 0.088, -0.016, 0.016, zb0 + 0.046, zb0 + 0.066, [18, 14, 8], { zBias: -0.008 }); // Key ward notch
      pushBox(faces, 0.016, 0.078, -0.014, 0.014, zb0 + 0.015, zb0 + 0.038, goldHi, { em: true, bright: true });
      break;
    }

    case 'bat': {
      yaw = tm * 2.1 + (s.y || 0);
      const zb0 = 0.15 + 0.036 * Math.sin(tm * 3.2 + (s.y || 0));
      pushPrism(faces, 0, 0, 0.072, 0.074, zb0, zb0 + 0.022, 10, [196, 204, 214]);
      pushPrism(faces, 0, 0, 0.070, 0.070, zb0 + 0.022, zb0 + 0.160, 10, [24, 28, 34]);
      pushPrism(faces, 0, 0, 0.071, 0.071, zb0 + 0.160, zb0 + 0.226, 10, [208, 126, 30], { em: true });
      pushPrism(faces, 0, 0, 0.072, 0.072, zb0 + 0.226, zb0 + 0.246, 10, [210, 218, 228]);
      pushPrism(faces, 0, 0, 0.056, 0.056, zb0 + 0.246, zb0 + 0.254, 8, [26, 28, 32]);
      pushPrism(faces, 0, 0, 0.030, 0.028, zb0 + 0.254, zb0 + 0.284, 8, [244, 198, 66], { em: true, bright: true });
      for (const side of [-1, 1]) {
        const yy = side * 0.073;
        pushBox(faces, -0.024, 0.024, yy - 0.006, yy + 0.006, zb0 + 0.042, zb0 + 0.142, [28, 176, 76], { em: true, zBias: -0.008 });
        pushSegBox(faces, -0.014, yy, zb0 + 0.125, 0.012, yy, zb0 + 0.095, 0.010, 0.010, [166, 255, 132], { em: true, bright: true, zBias: -0.014 });
        pushSegBox(faces, -0.012, yy, zb0 + 0.095, 0.014, yy, zb0 + 0.058, 0.010, 0.010, [166, 255, 132], { em: true, bright: true, zBias: -0.014 });
      }
      break;
    }

    case 'pick': {
      yaw = tm * 2.2 + (s.x || 0);
      const zb0 = 0.15 + 0.036 * Math.sin(tm * 3.2 + (s.x || 0));
      pushPrism(faces, -0.115, 0, 0.022, 0.022, zb0 + 0.012, zb0 + 0.026, 8, [212, 168, 56], { em: true });
      pushSegBox(faces, -0.095, 0, zb0 + 0.022, 0.015, 0, zb0 + 0.088, 0.022, 0.017, [118, 74, 38]);
      pushSegBox(faces, 0.005, 0, zb0 + 0.082, 0.025, 0, zb0 + 0.094, 0.023, 0.018, [224, 178, 62], { em: true });
      for (const frac of [0.28, 0.65]) {
        const rx = -0.095 + 0.110 * frac;
        const rz = zb0 + 0.022 + 0.066 * frac;
        pushBox(faces, rx - 0.008, rx + 0.008, -0.024, 0.024, rz - 0.008, rz + 0.008, [238, 196, 78], { em: true, zBias: -0.006 });
      }
      pushSegBox(faces, 0.022, 0, zb0 + 0.092, 0.145, 0, zb0 + 0.166, 0.010, 0.009, [224, 232, 244], { em: true, bright: true });
      pushSegBox(faces, 0.142, 0, zb0 + 0.164, 0.166, 0, zb0 + 0.214, 0.009, 0.011, [238, 246, 255], { em: true, bright: true });
      pushSegBox(faces, 0.165, 0, zb0 + 0.212, 0.144, 0, zb0 + 0.228, 0.008, 0.009, [238, 246, 255], { em: true, bright: true });
      pushSegBox(faces, -0.075, -0.022, zb0 + 0.155, 0.085, 0.022, zb0 + 0.055, 0.010, 0.008, [186, 198, 214], { em: true });
      pushSegBox(faces, 0.085, 0.022, zb0 + 0.055, 0.132, 0.026, zb0 + 0.085, 0.009, 0.008, [216, 226, 238], { em: true });
      break;
    }

    case 'usb': {
      // Tactical ruggedized military USB drive: knurled metal casing, cap ridge, gold connector pins & pulsing cyan data LED
      yaw = tm * 2.4 + (s.x || 0);
      const zb0 = 0.16 + 0.035 * Math.sin(tm * 3.6);
      const pulse = 0.72 + 0.28 * Math.sin(tm * 7.5);
      pushBox(faces, -0.095, 0.045, -0.036, 0.036, zb0, zb0 + 0.052, [34, 46, 62]);
      pushBox(faces, -0.098, -0.065, -0.040, 0.040, zb0 - 0.003, zb0 + 0.055, [52, 62, 74]); // Rubberized end cap + loop
      pushPrism(faces, -0.105, 0, 0.018, 0.018, zb0 + 0.016, zb0 + 0.036, 6, [186, 194, 206]); // Lanyard eye
      pushBox(faces, 0.045, 0.125, -0.026, 0.026, zb0 + 0.008, zb0 + 0.044, [206, 216, 228], { em: true }); // Chrome USB plug
      pushBox(faces, 0.078, 0.112, -0.018, 0.018, zb0 + 0.038, zb0 + 0.048, [216, 174, 48], { em: true, zBias: -0.006 }); // Gold pins
      pushBox(faces, -0.05, 0.02, -0.040, 0.040, zb0 + 0.034, zb0 + 0.056, [(56 * pulse) | 0, (194 * pulse) | 0, 255], { em: true, bright: true });
      break;
    }

    case 'part': {
      yaw = tm * 1.9 + (s.pIdx || 0);
      const zb0 = 0.16 + 0.04 * Math.sin(tm * 3.1 + (s.pIdx || 0));
      const pIdx = (s.pIdx || 0) % 14;
      if (pIdx === 0) {
        // 12V Car Battery 6CT-60
        pushBox(faces, -0.125, 0.125, -0.085, 0.085, zb0, zb0 + 0.165, [28, 34, 44]);
        pushBox(faces, -0.132, 0.132, -0.090, 0.090, zb0 + 0.165, zb0 + 0.195, [44, 52, 66]);
        pushBox(faces, -0.08, 0.08, -0.089, -0.083, zb0 + 0.045, zb0 + 0.135, [218, 224, 232], { em: true, zBias: -0.008 });
        pushBox(faces, -0.065, 0.065, -0.091, -0.087, zb0 + 0.095, zb0 + 0.125, [196, 36, 36], { em: true, zBias: -0.012 });
        for (let ci = -2; ci <= 2; ci++) {
          pushPrism(faces, ci * 0.042, 0, 0.014, 0.013, zb0 + 0.195, zb0 + 0.212, 6, [186, 36, 36]);
        }
        pushBox(faces, -0.075, 0.075, -0.015, 0.015, zb0 + 0.245, zb0 + 0.262, [194, 202, 212]);
        pushBox(faces, -0.075, -0.055, -0.015, 0.015, zb0 + 0.195, zb0 + 0.248, [160, 168, 178]);
        pushBox(faces, 0.055, 0.075, -0.015, 0.015, zb0 + 0.195, zb0 + 0.248, [160, 168, 178]);
        pushPrism(faces, -0.088, -0.045, 0.020, 0.017, zb0 + 0.195, zb0 + 0.236, 6, [228, 44, 44], { em: true, bright: true });
        pushPrism(faces, 0.088, -0.045, 0.020, 0.017, zb0 + 0.195, zb0 + 0.236, 6, [54, 134, 246], { em: true, bright: true });
      } else if (pIdx === 2 || pIdx === 10) {
        // Alternator / Ventilated Clutch assembly with copper stator coil, ribbed housing, mounting ears & pulley sheave
        pushPrism(faces, 0, 0, 0.125, 0.125, zb0, zb0 + 0.135, 10, [132, 142, 156]);
        pushPrism(faces, 0, 0, 0.130, 0.130, zb0 + 0.042, zb0 + 0.092, 10, [184, 102, 34], { capTop: false, zBias: -0.005 }); // Copper stator ring
        pushBox(faces, -0.16, 0.16, -0.025, 0.025, zb0 + 0.055, zb0 + 0.085, [156, 166, 178]); // Mounting lugs
        pushPrism(faces, 0, 0, 0.058, 0.058, zb0 + 0.135, zb0 + 0.195, 8, [52, 58, 68]); // Pulley wheel
        pushPrism(faces, 0, 0, 0.022, 0.018, zb0 + 0.195, zb0 + 0.222, 6, [224, 168, 42], { em: true }); // Center spindle nut
      } else if (pIdx === 7) {
        // Copper/aluminum finned engine radiator with tanks, cooling louver fins, filler cap & hose necks
        pushBox(faces, -0.14, 0.14, -0.042, 0.042, zb0, zb0 + 0.036, [44, 48, 56]); // Lower header tank
        pushBox(faces, -0.14, 0.14, -0.042, 0.042, zb0 + 0.168, zb0 + 0.205, [44, 48, 56]); // Upper header tank
        pushBox(faces, -0.145, -0.118, -0.044, 0.044, zb0, zb0 + 0.205, [78, 86, 98]); // Side channels
        pushBox(faces, 0.118, 0.145, -0.044, 0.044, zb0, zb0 + 0.205, [78, 86, 98]);
        pushBox(faces, -0.118, 0.118, -0.032, 0.032, zb0 + 0.036, zb0 + 0.168, [166, 178, 192]); // Core
        for (let fi = -2; fi <= 2; fi++) {
          pushBox(faces, fi * 0.042 - 0.012, fi * 0.042 + 0.012, -0.038, 0.038, zb0 + 0.04, zb0 + 0.164, [118, 128, 140], { zBias: -0.005 });
        }
        pushPrism(faces, 0.085, 0, 0.024, 0.022, zb0 + 0.205, zb0 + 0.232, 6, [222, 168, 38], { em: true }); // Brass radiator cap
      } else {
        // Heavy cast starter motor / Bosch-style fuel pump / ECU with piggyback solenoid & brass fittings
        const col = pIdx % 3 === 0 ? [174, 114, 38] : pIdx % 3 === 1 ? [112, 128, 146] : [48, 132, 86];
        pushPrism(faces, -0.01, 0, 0.072, 0.072, zb0, zb0 + 0.16, 8, col);
        pushPrism(faces, 0.07, 0.03, 0.042, 0.042, zb0 + 0.03, zb0 + 0.14, 7, [44, 48, 56]); // Solenoid
        pushBox(faces, -0.095, 0.095, -0.085, 0.085, zb0 + 0.01, zb0 + 0.035, [86, 94, 106]); // Mounting flange
        pushPrism(faces, -0.01, 0, 0.028, 0.022, zb0 + 0.16, zb0 + 0.215, 6, [238, 198, 62], { em: true }); // Brass drive pinion/fitting
      }
      break;
    }

    case 'note': {
      // Aged creased parchment note with lifted curl corner, dark ink scribble rows & crimson bloody fingerprint smudge
      yaw = -0.2 + 0.12 * Math.sin(tm * 1.8);
      const zb0 = 0.038;
      pushBox(faces, -0.13, 0.13, -0.16, 0.16, zb0, zb0 + 0.014, [218, 204, 172], { em: true });
      pushSegBox(faces, 0.07, -0.16, zb0 + 0.008, 0.135, -0.10, zb0 + 0.030, 0.025, 0.005, [232, 220, 190], { em: true, zBias: -0.004 }); // Curled edge
      for (let li = 0; li < 4; li++) {
        pushBox(faces, -0.095, 0.06 - (li % 2) * 0.04, 0.09 - li * 0.055, 0.105 - li * 0.055, zb0 + 0.012, zb0 + 0.020, [56, 36, 28], { em: true, zBias: -0.006 });
      }
      pushPrism(faces, 0.055, -0.055, 0.034, 0.030, zb0 + 0.013, zb0 + 0.022, 6, [154, 14, 18], { em: true, zBias: -0.010 });
      break;
    }

    case 'trap': {
      yaw = s.yaw ?? ((s.x || 0) * 5.7 + (s.y || 0) * 9.3);
      const rustDeep = [52, 28, 18];
      const rustMid = [98, 48, 22];
      const rustOrange = [132, 64, 24];
      const soot = [26, 22, 20];
      const scuffSteel = [156, 164, 172];
      const toothEdge = [218, 224, 232];
      const bloodClot = [128, 10, 14];

      pushBox(faces, -0.24, 0.24, -0.030, 0.030, 0.004, 0.030, rustDeep);
      pushBox(faces, -0.028, 0.028, -0.18, 0.18, 0.004, 0.024, soot);
      pushBox(faces, -0.09, 0.09, -0.018, 0.018, 0.028, 0.036, scuffSteel, { zBias: -0.004 });

      for (let i = 0; i < 10; i++) {
        const a0 = (i / 10) * Math.PI * 2;
        const a1 = ((i + 1) / 10) * Math.PI * 2;
        const ringCol = i % 3 === 0 ? rustOrange : i % 2 === 0 ? rustMid : rustDeep;
        pushSegBox(
          faces,
          Math.cos(a0) * 0.185, Math.sin(a0) * 0.165, 0.015,
          Math.cos(a1) * 0.185, Math.sin(a1) * 0.165, 0.015,
          0.019, 0.014, ringCol
        );
      }

      for (const sd of [-1, 1]) {
        const hx = sd * 0.185;
        pushBox(faces, hx - 0.030, hx + 0.030, -0.044, 0.044, 0.016, 0.056, rustDeep);
        pushBox(faces, hx - 0.016, hx + 0.016, -0.046, 0.046, 0.048, 0.062, scuffSteel);
        for (let ci = 0; ci < 3; ci++) {
          const zc = 0.024 + ci * 0.015;
          pushPrism(faces, hx, 0, 0.028, 0.028, zc, zc + 0.009, 8, ci % 2 === 0 ? scuffSteel : rustOrange);
        }
        pushPrism(faces, hx, 0, 0.013, 0.011, 0.066, 0.084, 6, toothEdge, { em: true });

        pushSegBox(faces, sd * 0.195, -0.012, 0.024, sd * 0.295, 0.018, 0.048, 0.024, 0.009, rustMid);
        pushSegBox(faces, sd * 0.195, -0.012, 0.042, sd * 0.295, 0.018, 0.056, 0.020, 0.007, scuffSteel);
        pushPrism(faces, sd * 0.295, 0.018, 0.032, 0.032, 0.024, 0.060, 8, rustDeep);
        pushPrism(faces, sd * 0.295, 0.018, 0.020, 0.020, 0.058, 0.066, 8, scuffSteel);
      }

      pushPrism(faces, -0.44, 0.12, 0.020, 0.016, 0.0, 0.095, 6, rustDeep);
      pushPrism(faces, -0.44, 0.12, 0.024, 0.024, 0.085, 0.102, 6, scuffSteel);
      for (let li = 0; li < 4; li++) {
        const t0 = li / 4;
        const t1 = (li + 1) / 4;
        const lx0 = -0.305 - t0 * 0.13;
        const ly0 = 0.022 + t0 * 0.095;
        const lx1 = -0.305 - t1 * 0.13;
        const ly1 = 0.022 + t1 * 0.095;
        pushSegBox(
          faces,
          lx0, ly0, li % 2 === 0 ? 0.012 : 0.018,
          lx1, ly1, li % 2 === 0 ? 0.012 : 0.018,
          li % 2 === 0 ? 0.017 : 0.009,
          li % 2 === 0 ? 0.009 : 0.017,
          li % 2 === 0 ? [78, 82, 88] : rustMid
        );
      }

      pushPrism(faces, 0, 0, 0.092, 0.084, 0.014, 0.036, 8, rustMid);
      pushPrism(faces, 0, 0, 0.072, 0.068, 0.036, 0.041, 8, [96, 88, 78]);
      pushBox(faces, -0.058, 0.058, -0.014, 0.014, 0.038, 0.045, scuffSteel, { zBias: -0.006 });
      pushPrism(faces, 0.020, -0.015, 0.044, 0.042, 0.038, 0.046, 6, bloodClot, { a: 0.88, zBias: -0.008 });
      pushPrism(faces, 0, 0, 0.012, 0.010, 0.040, 0.050, 6, toothEdge);
      pushSegBox(faces, 0.055, 0.0, 0.038, 0.145, 0.06, 0.064, 0.011, 0.008, scuffSteel);
      pushBox(faces, 0.132, 0.158, 0.052, 0.078, 0.056, 0.074, toothEdge);

      for (const side of [-1, 1]) {
        const pts = [
          [-0.185, side * 0.018, 0.044],
          [-0.145, side * 0.112, 0.056],
          [-0.082, side * 0.162, 0.066],
          [0.0, side * 0.178, 0.072],
          [0.082, side * 0.162, 0.066],
          [0.145, side * 0.112, 0.056],
          [0.185, side * 0.018, 0.044],
        ];
        for (let i = 0; i < pts.length - 1; i++) {
          const jCol = i % 2 === 0 ? rustMid : rustDeep;
          pushSegBox(
            faces,
            pts[i][0], pts[i][1], pts[i][2],
            pts[i + 1][0], pts[i + 1][1], pts[i + 1][2],
            0.018, 0.015, jCol
          );
          pushSegBox(
            faces,
            pts[i][0], pts[i][1], pts[i][2] + 0.014,
            pts[i + 1][0], pts[i + 1][1], pts[i + 1][2] + 0.014,
            0.009, 0.005, scuffSteel, { zBias: -0.004 }
          );
        }

        const toothPts = [
          [-0.145, side * 0.110, 0.064, 0.046],
          [-0.105, side * 0.144, 0.070, 0.064],
          [-0.054, side * 0.168, 0.075, 0.050],
          [0.0, side * 0.178, 0.078, 0.072],
          [0.054, side * 0.168, 0.075, 0.050],
          [0.105, side * 0.144, 0.070, 0.064],
          [0.145, side * 0.110, 0.064, 0.046],
        ];
        for (let ti = 0; ti < toothPts.length; ti++) {
          const [tx, ty0, tz, h] = toothPts[ti];
          const bloody = ti === 1 || ti === 3 || ti === 5;
          pushPrism(
            faces,
            tx, ty0,
            0.014, 0.001,
            tz, tz + h,
            4,
            bloody ? bloodClot : toothEdge,
            { em: !bloody, bright: !bloody, zBias: -0.008 }
          );
        }
      }
      break;
    }

    case 'xmasTree': {
      // Decorated New Year spruce with yellow/red ornaments, blinking fairy lights & golden topper star
      const trunk = [78, 48, 24];
      const pineDark = [18, 66, 30];
      const pineMid = [24, 92, 38];
      const pineTop = [30, 114, 46];
      const gold = [246, 206, 48];
      const redBall = [218, 26, 36];
      const tw = 0.72 + 0.28 * Math.sin(tm * 4.5 + (s.x || 0));

      pushPrism(faces, 0, 0, 0.08, 0.07, 0.0, 0.26, 7, trunk);
      pushPrism(faces, 0, 0, 0.44, 0.18, 0.22, 0.62, 8, pineDark);
      pushPrism(faces, 0, 0, 0.34, 0.12, 0.52, 0.92, 8, pineMid);
      pushPrism(faces, 0, 0, 0.22, 0.02, 0.82, 1.24, 8, pineTop);
      // Yellow & red baubles around tiers
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        const r = i % 2 === 0 ? 0.31 : 0.22;
        const z = i % 2 === 0 ? 0.40 : 0.68;
        const col = i % 2 === 0 ? gold : redBall;
        pushOcta(faces, Math.cos(a) * r, Math.sin(a) * r, z, 0.042, 0.042, 0.042, col, { em: true, bright: i % 2 === 0 });
      }
      // Twinkling string lights
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + tm * 0.4;
        const col = Math.sin(tm * 6 + i * 1.7) > 0 ? [255, 242, 170] : [255, 110, 90];
        pushBox(faces, Math.cos(a) * 0.24 - 0.015, Math.cos(a) * 0.24 + 0.015, Math.sin(a) * 0.24 - 0.015, Math.sin(a) * 0.24 + 0.015, 0.48 + (i % 3) * 0.18, 0.51 + (i % 3) * 0.18, col, { em: true, bright: true, a: tw });
      }
      // Golden topper star
      pushOcta(faces, 0, 0, 1.28, 0.065, 0.030, 0.085, gold, { em: true, bright: true });
      break;
    }

    case 'giftBox': {
      // Festive wrapped New Year gift box with contrasting ribbon & bow
      const baseCols = [[185, 24, 34], [28, 128, 66], [36, 86, 178]];
      const ribCols = [[250, 212, 64], [240, 240, 245], [228, 46, 56]];
      const idx = Math.abs(Math.round(((s.x || 0) * 3 + (s.y || 0) * 5))) % 3;
      const boxCol = baseCols[idx];
      const ribCol = ribCols[idx];
      pushBox(faces, -0.14, 0.14, -0.14, 0.14, 0.0, 0.22, boxCol);
      pushBox(faces, -0.155, 0.155, -0.155, 0.155, 0.19, 0.24, boxCol);
      // Ribbon stripes + bow
      pushBox(faces, -0.16, 0.16, -0.025, 0.025, 0.0, 0.246, ribCol, { em: true, zBias: -0.004 });
      pushBox(faces, -0.025, 0.025, -0.16, 0.16, 0.0, 0.246, ribCol, { em: true, zBias: -0.004 });
      pushOcta(faces, 0, 0, 0.275, 0.06, 0.06, 0.035, ribCol, { em: true, bright: true });
      break;
    }

    case 'fuseBox': {
      // Industrial circuit breaker box with glowing red/green status LEDs & toggle switches
      const done = Boolean(s.done);
      pushBox(faces, -0.16, 0.16, -0.09, 0.09, 0.34, 0.86, [68, 76, 86]);
      pushBox(faces, -0.14, 0.14, -0.098, 0.098, 0.37, 0.83, [34, 38, 44], { zBias: -0.003 });
      for (const lz of [0.46, 0.58, 0.70]) {
        pushBox(faces, -0.09, 0.09, -0.106, 0.106, lz, lz + 0.04, [110, 120, 130], { zBias: -0.005 });
      }
      pushBox(
        faces, -0.10, -0.05, -0.112, 0.112, 0.76, 0.80,
        done ? [52, 245, 118] : [245, 58, 48],
        { em: true, bright: true, zBias: -0.008 }
      );
      pushBox(
        faces, 0.05, 0.10, -0.112, 0.112, 0.76, 0.80,
        [248, 198, 52],
        { em: true, bright: true, zBias: -0.008 }
      );
      break;
    }

    case 'keypad': {
      // Illuminated door security cipher keypad panel
      const done = Boolean(s.done);
      pushBox(faces, -0.11, 0.11, -0.06, 0.06, 0.42, 0.74, [42, 48, 58]);
      pushBox(
        faces, -0.08, 0.08, -0.068, 0.068, 0.62, 0.70,
        done ? [52, 245, 132] : [56, 189, 248],
        { em: true, bright: true, zBias: -0.006 }
      );
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const kx = -0.06 + c * 0.05;
          const kz = 0.46 + r * 0.05;
          pushBox(faces, kx - 0.016, kx + 0.016, -0.068, 0.068, kz, kz + 0.032, [215, 224, 236], { em: true, zBias: -0.006 });
        }
      }
      break;
    }

    case 'ventGrate': {
      // Louvered galvanized steel air-vent grate on corridor wall
      const open = Boolean(s.done);
      pushBox(faces, -0.22, 0.22, -0.04, 0.04, 0.22, 0.64, [72, 82, 92]);
      pushBox(faces, -0.19, 0.19, -0.046, 0.046, 0.25, 0.61, [12, 16, 20], { zBias: -0.004 });
      if (!open) {
        for (let vz = 0.29; vz <= 0.56; vz += 0.065) {
          pushBox(faces, -0.18, 0.18, -0.052, 0.052, vz, vz + 0.022, [138, 148, 162], { zBias: -0.006 });
        }
      } else {
        pushBox(faces, -0.16, 0.16, -0.052, 0.052, 0.27, 0.58, [34, 211, 153], { em: true, a: 0.45, zBias: -0.006 });
      }
      break;
    }

    case 'blueDoor': {
      // Tall pale-blue ajar painted interior door (matching IMG_b4b5f352 reference)
      pushBox(faces, -0.24, 0.24, -0.04, 0.04, 0.0, 0.94, [64, 42, 24]);
      pushBox(faces, -0.20, 0.20, -0.048, 0.048, 0.01, 0.90, [132, 162, 184], { zBias: -0.004 });
      pushBox(faces, -0.14, 0.14, -0.054, 0.054, 0.48, 0.82, [110, 140, 164], { zBias: -0.006 });
      pushBox(faces, -0.14, 0.14, -0.054, 0.054, 0.08, 0.42, [110, 140, 164], { zBias: -0.006 });
      pushBox(faces, 0.13, 0.18, -0.062, 0.062, 0.41, 0.45, [212, 182, 82], { zBias: -0.008 });
      break;
    }

    case 'fireplace': {
      // Stone hearth fireplace with flickering fire logs & hanging red Christmas stocking
      const fl = 0.78 + 0.22 * Math.sin(tm * 9.5 + (s.x || 0));
      pushBox(faces, -0.26, 0.26, -0.16, 0.16, 0.0, 0.82, [82, 74, 68]);
      pushBox(faces, -0.28, 0.28, -0.18, 0.18, 0.74, 0.84, [72, 46, 26]); // Timber mantel beam
      pushBox(faces, -0.16, 0.16, -0.168, 0.168, 0.04, 0.44, [16, 12, 12], { zBias: -0.004 });
      pushBox(faces, -0.11, 0.11, -0.14, 0.14, 0.05, 0.15, [76, 40, 18], { zBias: -0.006 }); // Firewood
      pushOcta(faces, -0.03, -0.02, 0.22, 0.09, 0.08, 0.14 * fl, [255, 136, 32], { em: true, bright: true });
      pushOcta(faces, 0.04, 0.0, 0.20, 0.07, 0.06, 0.11 * fl, [255, 224, 96], { em: true, bright: true });
      // Red Christmas stocking on mantel
      pushBox(faces, 0.16, 0.23, -0.185, -0.15, 0.56, 0.74, [202, 24, 34], { zBias: -0.008 });
      pushBox(faces, 0.155, 0.235, -0.19, -0.145, 0.70, 0.75, [240, 242, 246], { zBias: -0.009 });
      break;
    }

    case 'wallShelf': {
      // Timber wall shelf matching upper-left hall detail in IMG_b4b5f352 reference
      pushBox(faces, -0.22, 0.22, -0.09, 0.09, 0.54, 0.58, [96, 62, 34]);
      pushBox(faces, -0.18, -0.12, -0.08, 0.08, 0.44, 0.54, [66, 42, 22]);
      pushBox(faces, 0.12, 0.18, -0.08, 0.08, 0.44, 0.54, [66, 42, 22]);
      pushPrism(faces, -0.06, 0, 0.035, 0.032, 0.58, 0.69, 6, [154, 178, 162], { a: 0.78 });
      pushBox(faces, 0.04, 0.14, -0.05, 0.05, 0.58, 0.66, [142, 38, 32]);
      break;
    }

    default:
      return null;
  }

  return { faces, yaw, allowAboveWall: kind === 'tree' || kind === 'chapelDome' || kind === 'lamp' || kind === 'xmasTree' };
}

export function drawProp3D(ctx, s) {
  if (!s || !s.kind3d) return false;
  if (ctx.ty > 19.5) return false;
  const built = buildFacesForKind(s.kind3d, s, ctx.tm, ctx.ch, ctx);
  if (!built || !built.faces.length) return false;

  renderFaces3D(
    {
      ...ctx,
      allowAboveWall: built.allowAboveWall,
      baseAlpha: ctx.alpha ?? 1,
    },
    built.faces,
    s.x,
    s.y,
    built.yaw
  );
  return true;
}
