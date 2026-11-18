// Procedural 3D & atmospheric graphics helpers for the raycaster engine.
// Designed for 60 FPS performance with zero per-frame allocations where avoidable.

const fogResult = { r: 6, g: 4, b: 6, density: 0.14 };

export function getChapterFog(ch, camInBay, ltFl, stg, upf) {
  if (ch === 3) {
    fogResult.r = 10;
    fogResult.g = 13;
    fogResult.b = 20;
    fogResult.density = 0.155;
    return fogResult;
  }
  if (ch === 4) {
    if (camInBay) {
      fogResult.r = 12;
      fogResult.g = 15;
      fogResult.b = 20;
      fogResult.density = 0.13;
    } else {
      const fl = Math.max(0, Math.min(1, ltFl || 0));
      fogResult.r = (26 + fl * 90) | 0;
      fogResult.g = (34 + fl * 102) | 0;
      fogResult.b = (46 + fl * 124) | 0;
      fogResult.density = 0.095;
    }
    return fogResult;
  }
  if (ch === 5) {
    if (stg === 'ext') {
      fogResult.r = 14;
      fogResult.g = 20;
      fogResult.b = 32;
      fogResult.density = 0.105;
    } else if (upf) {
      fogResult.r = 16;
      fogResult.g = 14;
      fogResult.b = 18;
      fogResult.density = 0.122;
    } else {
      fogResult.r = 18;
      fogResult.g = 14;
      fogResult.b = 14;
      fogResult.density = 0.125;
    }
    return fogResult;
  }
  if (ch === 2) {
    if (stg === 'base') {
      fogResult.r = 7;
      fogResult.g = 9;
      fogResult.b = 11;
      fogResult.density = 0.135;
    } else if (upf) {
      fogResult.r = 14;
      fogResult.g = 17;
      fogResult.b = 16;
      fogResult.density = 0.118;
    } else {
      fogResult.r = 14;
      fogResult.g = 7;
      fogResult.b = 9;
      fogResult.density = 0.125;
    }
    return fogResult;
  }
  fogResult.r = 6;
  fogResult.g = 4;
  fogResult.b = 6;
  fogResult.density = 0.145;
  return fogResult;
}

export function collectWorldLights(ctx) {
  const {
    ch, EX, EY, keys, neededKeys, FUR,
    torchImg, candelabraImg, lampImg,
    ROOM, PCS, pcSt, VAZ, partsInstalled, tm,
    mon, hideAiMon,
  } = ctx;
  const lights = [];

  // Exit portal glow
  if (EX > 0 && EY > 0) {
    const unlocked = keys >= neededKeys;
    const pulse = unlocked ? (0.85 + 0.15 * Math.sin(tm * 3.5)) : (0.65 + 0.35 * Math.sin(tm * 4.2));
    lights.push({
      x: EX,
      y: EY,
      r: unlocked ? 36 * pulse : 225 * pulse,
      g: unlocked ? 230 * pulse : 28 * pulse,
      b: unlocked ? 98 * pulse : 34 * pulse,
      rad: unlocked ? 4.8 : 3.8,
      rad2: unlocked ? 23.04 : 14.44,
      pow: unlocked ? 1.15 : 0.9,
      haloY: 0.48,
    });
  }

  // Props (torches, candelabras, garage floodlights)
  if (FUR && FUR.length) {
    for (let i = 0; i < FUR.length; i++) {
      const f = FUR[i];
      if (f.img === torchImg) {
        const fl = 0.8 + 0.2 * Math.sin(tm * 11 + i * 2.1) * Math.cos(tm * 5.3 + i);
        lights.push({
          x: f.x,
          y: f.y,
          r: 255 * fl,
          g: 138 * fl,
          b: 42 * fl,
          rad: 3.7,
          rad2: 13.69,
          pow: 0.92,
          haloY: 0.25,
        });
      } else if (f.img === candelabraImg) {
        const fl = 0.86 + 0.14 * Math.sin(tm * 7.5 + i * 1.9);
        lights.push({
          x: f.x,
          y: f.y,
          r: 255 * fl,
          g: 196 * fl,
          b: 92 * fl,
          rad: 3.5,
          rad2: 12.25,
          pow: 0.85,
          haloY: 0.32,
        });
      } else if (f.img === lampImg) {
        const buzz = (i % 3 === 1 && Math.sin(tm * 19 + i) > 0.84) ? 0.38 : 1.0;
        lights.push({
          x: f.x,
          y: f.y,
          r: 215 * buzz,
          g: 230 * buzz,
          b: 175 * buzz,
          rad: 4.3,
          rad2: 18.49,
          pow: 0.78,
          haloY: 0.12,
        });
      }
    }
  }

  // Safe room CRT screens
  if (ROOM && ROOM.on && pcSt !== 'off' && PCS && PCS.length) {
    for (let i = 0; i < PCS.length; i++) {
      const p = PCS[i];
      lights.push({
        x: p.x,
        y: p.y,
        r: 45,
        g: 220,
        b: 145,
        rad: 2.6,
        rad2: 6.76,
        pow: 0.72,
        haloY: 0.42,
      });
    }
  }

  // Ch3 Chapel altar warm light
  if (ch === 3) {
    lights.push({
      x: 17.5,
      y: 6.5,
      r: 245,
      g: 190,
      b: 95,
      rad: 4.2,
      rad2: 17.64,
      pow: 0.65,
      haloY: 0.38,
    });
  }

  // Ch5 Christmas tree, fireplace & scenario terminal dynamic lights
  if (ch === 5 && FUR && FUR.length) {
    for (let i = 0; i < FUR.length; i++) {
      const f = FUR[i];
      if (f.kind3d === 'xmasTree') {
        const pulse = 0.78 + 0.22 * Math.sin(tm * 3.8 + i);
        lights.push({
          x: f.x,
          y: f.y,
          r: 255 * pulse,
          g: 215 * pulse,
          b: 112 * pulse,
          rad: 4.5,
          rad2: 20.25,
          pow: 0.95,
          haloY: 0.45,
        });
      } else if (f.kind3d === 'fireplace') {
        const fl = 0.8 + 0.2 * Math.sin(tm * 12 + i);
        lights.push({
          x: f.x,
          y: f.y,
          r: 255 * fl,
          g: 122 * fl,
          b: 38 * fl,
          rad: 4.6,
          rad2: 21.16,
          pow: 1.0,
          haloY: 0.35,
        });
      } else if (f.kind3d === 'fuseBox' || f.kind3d === 'keypad' || f.kind3d === 'ventGrate') {
        lights.push({
          x: f.x,
          y: f.y,
          r: f.done ? 52 : 240,
          g: f.done ? 235 : 85,
          b: f.done ? 132 : 70,
          rad: 2.6,
          rad2: 6.76,
          pow: 0.68,
          haloY: 0.42,
        });
      }
    }
  }

  // Escape car headlights & taillights
  if ((ch === 3 || ch === 4 || ch === 5) && VAZ && VAZ.on) {
    const yaw = VAZ.yaw || 0;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const ready = ch !== 4 || partsInstalled >= neededKeys;
    if (ready) {
      lights.push({
        x: VAZ.x + cy * 1.45,
        y: VAZ.y + sy * 1.45,
        r: 255,
        g: 242,
        b: 175,
        rad: 4.6,
        rad2: 21.16,
        pow: 1.05,
        haloY: 0.62,
      });
    }
    lights.push({
      x: VAZ.x - cy * 1.2,
      y: VAZ.y - sy * 1.2,
      r: ready ? 235 : 140,
      g: ready ? 38 : 22,
      b: ready ? 44 : 26,
      rad: ready ? 2.8 : 1.9,
      rad2: ready ? 7.84 : 3.61,
      pow: ready ? 0.72 : 0.35,
      haloY: 0.62,
    });
  }

  // Dynamic Monster eerie aura light (casts sinister glow & soft shadows on corridors)
  if (!hideAiMon && mon && (!mon.off || mon.vis)) {
    const hunt = mon.st === 'hunt';
    const pulse = (hunt ? 0.82 : 0.65) + (hunt ? 0.25 : 0.14) * Math.sin(tm * (hunt ? 9.5 : 4.2));
    let mr = 215, mg = 28, mb = 38;
    if (ch === 2) { mr = 148; mg = 198; mb = 255; }
    else if (ch === 3) { mr = 74; mg = 224; mb = 112; }
    else if (ch === 4) { mr = 248; mg = 162; mb = 36; }
    else if (ch === 5) { mr = 235; mg = 44; mb = 58; }
    const rad = hunt ? 3.8 : 2.9;
    lights.push({
      x: mon.x,
      y: mon.y,
      r: mr * pulse,
      g: mg * pulse,
      b: mb * pulse,
      rad,
      rad2: rad * rad,
      pow: hunt ? 0.78 : 0.48,
      haloY: 0.42,
      isMon: true,
    });
  }

  return lights;
}

// Fast soft-penumbra visibility check from wall surface point (wx, wy) toward light (lx, ly).
// Returns 0.18..1.0 smoothly so pillars/corners cast soft shadow edges instead of hard aliasing.
export function traceSoftLightVisibility(map, wx, wy, lx, ly) {
  if (!map) return 1;
  const dx = lx - wx;
  const dy = ly - wy;
  const dist2 = dx * dx + dy * dy;
  if (dist2 < 0.25) return 1;
  const steps = 6;
  let occ = 0;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const sx = wx + dx * t;
    const sy = wy + dy * t;
    const tx = sx | 0;
    const ty = sy | 0;
    const tile = map[ty]?.[tx] || 0;
    if (tile && tile !== 5 && tile !== 7) {
      // Soft penumbra near tile edges so corner shadows feather smoothly
      const fx = sx - tx;
      const fy = sy - ty;
      const edgeDist = Math.min(fx, 1 - fx, fy, 1 - fy);
      const edgeSoft = Math.min(1, edgeDist * 3.8);
      occ = Math.max(occ, 0.45 + 0.37 * edgeSoft);
      if (occ >= 0.8) return 0.18;
    } else if (tile === 5 || tile === 7) {
      occ = Math.max(occ, 0.22);
    }
  }
  return Math.max(0.18, 1 - occ);
}

// Computes soft shadows cast onto 3D walls by dynamic blockers (monster, car, iron bars)
// illuminated by player's flashlight and nearby dynamic lights.
export function computeWallCastShadow(ctx) {
  const { ox, oy, rx, ry, d, FL, mon, hideAiMon, vaz, ch, barD, barW, ri } = ctx;
  let shadow = 1.0;

  const rLen = Math.hypot(rx, ry) || 1;
  const rnx = rx / rLen;
  const rny = ry / rLen;
  const wDist = d * rLen;

  // Monster blocking flashlight beam -> casts towering soft shadow onto walls behind it
  if (FL > 0.05 && !hideAiMon && mon && (!mon.off || mon.vis)) {
    const mx = mon.x - ox;
    const my = mon.y - oy;
    const proj = mx * rnx + my * rny;
    if (proj > 0.35 && proj < wDist - 0.1) {
      const perp = Math.abs(mx * (-rny) + my * rnx);
      // Scale penumbra width gently with distance from monster to wall behind it
      const spread = Math.min(0.32, (wDist - proj) * 0.055);
      const rIn = 0.14;
      const rOut = 0.44 + spread;
      if (perp < rOut) {
        const u = Math.max(0, Math.min(1, (perp - rIn) / (rOut - rIn)));
        const s = u * u * (3 - 2 * u);
        const depthFade = Math.max(0.34, 1 - FL * 0.62 * (1 - s));
        shadow = Math.min(shadow, depthFade);
      }
    }
  }

  // Escape car blocking flashlight beam in Ch3/Ch4/Ch5
  if (FL > 0.05 && (ch === 3 || ch === 4 || ch === 5) && vaz && vaz.on) {
    const vx = vaz.x - ox;
    const vy = vaz.y - oy;
    const proj = vx * rnx + vy * rny;
    if (proj > 0.5 && proj < wDist - 0.15) {
      const perp = Math.abs(vx * (-rny) + vy * rnx);
      const rIn = 0.42;
      const rOut = 0.92;
      if (perp < rOut) {
        const u = Math.max(0, Math.min(1, (perp - rIn) / (rOut - rIn)));
        const s = u * u * (3 - 2 * u);
        shadow = Math.min(shadow, 0.36 + 0.64 * s);
      }
    }
  }

  // Iron bars casting soft striped shadows onto walls behind them
  if (barD && barD[ri] > 0 && barD[ri] < d) {
    const u = (barW[ri] * 5) % 1;
    if (u < 0.24) {
      const barCenter = Math.abs(u - 0.08) / 0.16;
      const pen = Math.min(1, barCenter);
      shadow = Math.min(shadow, 0.52 + 0.48 * pen * pen);
    }
  }

  return shadow;
}

// Multi-layer soft directional shadow (contact umbra + stretched feathered penumbra)
// driven dynamically by player flashlight, monster glow, and world point lights.
export function drawDynamicSoftShadow(ctx) {
  const {
    g, W, H, hor, ox, oy, dx, dy, plx, ply, inv, VF, zb, RW, cw, colW,
    sx, sy, scr, sw, ty, fy, isItem, isMon, FL, lights, fogFade, ch, ltFl,
  } = ctx;

  if (fy >= H + 8 || fy <= hor - 4) return;

  // Accumulate weighted dynamic light pull vector (pointing from light -> sprite)
  let dirX = 0.24;
  let dirY = 0.18;
  let weightSum = ch === 3 ? 0.55 : 0.22;

  // Player handheld flashlight (slightly offset to right hand)
  if (FL > 0.04) {
    const fx0 = ox + (-dy) * 0.15;
    const fy0 = oy + dx * 0.15;
    const vx = sx - fx0;
    const vy = sy - fy0;
    const dist = Math.hypot(vx, vy) || 0.1;
    const centerBias = Math.exp(-Math.pow(scr / W - 0.5, 2) * 8);
    const fw = FL * centerBias * (3.2 / (1 + dist * dist * 0.14));
    if (fw > 0.02) {
      dirX += (vx / dist) * fw;
      dirY += (vy / dist) * fw;
      weightSum += fw;
    }
  }

  // Active dynamic point lights (torches, candelabras, lamps, headlights, monster glow)
  if (lights && lights.length) {
    for (let li = 0; li < lights.length; li++) {
      const lt = lights[li];
      if (isMon && lt.isMon) continue;
      const vx = sx - lt.x;
      const vy = sy - lt.y;
      const d2 = vx * vx + vy * vy;
      if (d2 > 0.04 && d2 < lt.rad2) {
        const d = Math.sqrt(d2);
        const pw = (1 - d / lt.rad) * lt.pow * 1.45;
        dirX += (vx / d) * pw;
        dirY += (vy / d) * pw;
        weightSum += pw;
      }
    }
  }

  if (ch === 4 && ltFl > 0.15) {
    dirX += 0.35 * ltFl;
    dirY += 0.25 * ltFl;
    weightSum += 0.35 * ltFl;
  }

  const invW = 1 / Math.max(0.2, weightSum);
  let nx = dirX * invW;
  let ny = dirY * invW;
  const nLen = Math.hypot(nx, ny) || 1;
  nx /= nLen;
  ny /= nLen;

  const shLen = isItem ? 0.26 : isMon ? Math.min(1.35, 0.68 + FL * 0.45) : 0.56;
  const tipWx = sx + nx * shLen - ox;
  const tipWy = sy + ny * shLen - oy;
  const tipTx = inv * (dy * tipWx - dx * tipWy);
  const tipTy = Math.max(0.18, inv * (-ply * tipWx + plx * tipWy));
  const tipScr = W * 0.5 * (1 + tipTx / tipTy);
  const tipFy = hor + (H / tipTy) * VF * 0.5;

  const baseW = Math.max(3, sw * (isItem ? 0.46 : isMon ? 0.72 : 0.78));
  const baseH = Math.max(1.4, (H / ty) * VF * (isItem ? 0.045 : isMon ? 0.09 : 0.08));
  const zClip = Math.min(ty, tipTy) * 0.86;

  // 4 soft feathered tiers from dense base contact umbra -> wide outer penumbra
  const tiers = isMon
    ? [
        [0.0, 0.92, 0.85, 0.34],
        [0.32, 1.06, 1.02, 0.22],
        [0.66, 1.24, 1.18, 0.14],
        [1.0, 1.46, 1.38, 0.08],
      ]
    : [
        [0.0, 0.86, 0.82, 0.30],
        [0.45, 1.05, 1.0, 0.18],
        [0.95, 1.3, 1.22, 0.09],
      ];

  g.fillStyle = '#000';
  for (let ti = 0; ti < tiers.length; ti++) {
    const [tFrac, wMul, hMul, alpha] = tiers[ti];
    const cx = scr + (tipScr - scr) * tFrac;
    const cy = fy + (tipFy - fy) * tFrac;
    const rxW = baseW * 0.52 * wMul;
    const ryH = baseH * hMul;
    if (rxW < 1 || cy < hor - 2 || cy > H + 10) continue;
    const sri0 = Math.max(0, Math.floor((cx - rxW) / cw));
    const sri1 = Math.min(RW - 1, Math.ceil((cx + rxW) / cw));
    g.globalAlpha = alpha * fogFade;
    for (let ri = sri0; ri <= sri1; ri++) {
      if (zb[ri] > zClip) {
        const pxX = ri * cw;
        const nu = (pxX - cx) / rxW;
        const hCol = ryH * Math.sqrt(Math.max(0, 1 - nu * nu));
        if (hCol >= 0.45) g.fillRect(pxX, cy - hCol * 0.4, colW, hCol);
      }
    }
  }
}

export function drawEnhancedSkyAndFloor(ctx) {
  const { g, W, H, ch, camInBay, hor, ca, fovK, tm, ltFl, ox, oy, FL, floorCol, hv, stg, upf, flShakeX = 0, flShakeY = 0 } = ctx;

  if (ch === 4) {
    if (camInBay) {
      const cg = g.createLinearGradient(0, 0, 0, Math.max(10, hor));
      cg.addColorStop(0, '#05070a');
      cg.addColorStop(0.65, '#0d1117');
      cg.addColorStop(1, '#181e27');
      g.fillStyle = cg;
      g.fillRect(0, 0, W, Math.max(0, hor));
      // Perspective ceiling steel rafters & damp concrete seams
      g.fillStyle = 'rgba(255,255,255,0.035)';
      for (let by = 8; by < hor; by += 16) {
        const t = (hor - by) / Math.max(1, hor);
        const hBar = Math.max(1, 3 * t);
        g.fillRect(0, by, W, hBar);
      }
    } else {
      const skyB = ltFl * 0.45;
      const sk = g.createLinearGradient(0, 0, 0, Math.max(20, hor));
      sk.addColorStop(0, `rgb(${8 + skyB * 105 | 0},${13 + skyB * 122 | 0},${22 + skyB * 155 | 0})`);
      sk.addColorStop(0.55, `rgb(${20 + skyB * 110 | 0},${28 + skyB * 124 | 0},${42 + skyB * 145 | 0})`);
      sk.addColorStop(1, `rgb(${32 + skyB * 95 | 0},${40 + skyB * 108 | 0},${52 + skyB * 125 | 0})`);
      g.fillStyle = sk;
      g.fillRect(0, 0, W, Math.max(0, hor));

      // Forked lightning bolt high in the storm sky
      if (ltFl > 0.5) {
        const lx0 = ((Math.floor(tm * 0.7) * 137) % (W - 80)) + 40;
        g.save();
        g.strokeStyle = `rgba(225,240,255,${Math.min(1, (ltFl - 0.35) * 1.4)})`;
        g.lineWidth = 1.6;
        g.beginPath();
        let lx = lx0;
        let ly = 0;
        g.moveTo(lx, ly);
        for (let seg = 0; seg < 6; seg++) {
          lx += Math.sin(seg * 4.7 + lx0) * 14;
          ly += Math.max(4, hor * 0.14);
          g.lineTo(lx, ly);
        }
        g.stroke();
        g.restore();
      }

      // Layered rolling storm clouds
      for (let ci = 0; ci < 9; ci++) {
        const cx0 = ((ci * 68 + tm * (4 + (ci % 3) * 1.5) - ca * 42) % (W + 130) + W + 130) % (W + 130) - 65;
        const cy0 = 8 + (ci % 4) * 14;
        g.fillStyle = `rgba(${14 + skyB * 75 | 0},${20 + skyB * 82 | 0},${31 + skyB * 98 | 0},${0.38 + (ci % 2) * 0.14})`;
        g.beginPath();
        g.ellipse(cx0, cy0, 44 + (ci % 3) * 16, 8 + (ci % 3) * 4, 0, 0, 7);
        g.fill();
      }

      // Distant foggy forest silhouette along horizon
      const baseTreeY = hor + 2;
      g.fillStyle = `rgb(${10 + skyB * 22 | 0},${18 + skyB * 30 | 0},${14 + skyB * 24 | 0})`;
      g.beginPath();
      g.moveTo(0, baseTreeY);
      for (let tx = 0; tx <= W; tx += 6) {
        const ang = (tx / W - 0.5) * fovK * 2 + ca;
        const treeH = 12 + Math.abs(Math.sin(ang * 7.3)) * 14 + Math.abs(Math.cos(ang * 17.1)) * 9;
        g.lineTo(tx, baseTreeY - treeH);
      }
      g.lineTo(W, baseTreeY);
      g.closePath();
      g.fill();
    }

    // Wet asphalt / garage concrete gradient
    const fg = g.createLinearGradient(0, hor, 0, H);
    fg.addColorStop(0, camInBay ? '#10141b' : '#1b222c');
    fg.addColorStop(0.35, camInBay ? '#0d1016' : '#151b23');
    fg.addColorStop(1, '#090b0f');
    g.fillStyle = fg;
    g.fillRect(0, hor, W, H - hor);

    if (!camInBay) {
      // Rain puddles reflecting sky & storm flashes
      const skyB = ltFl * 0.45;
      for (let pi = 0; pi < 10; pi++) {
        const py0 = hor + 10 + pi * 10;
        const px0 = ((pi * 83 - ca * 70 + (ox + oy) * 10) % W + W) % W;
        const pw = 24 + (pi % 4) * 12;
        g.fillStyle = `rgba(${90 + skyB * 130 | 0},${125 + skyB * 120 | 0},${165 + skyB * 90 | 0},${0.075 + skyB * 0.14})`;
        g.beginPath();
        g.ellipse(px0, py0, pw, 2.2 + (pi % 2) * 1.1, 0, 0, 7);
        g.fill();
      }
    } else {
      // Garage bay floor expansion joints
      g.fillStyle = 'rgba(0,0,0,0.22)';
      for (let j = 1; j <= 5; j++) {
        const jy = hor + Math.pow(j / 5, 1.7) * Math.max(10, H - hor);
        g.fillRect(0, jy, W, 1);
      }
    }
  } else if (ch === 3) {
    // Pitch-dark moonlit cemetery midnight sky
    const sk3 = g.createLinearGradient(0, 0, 0, Math.max(20, hor));
    sk3.addColorStop(0, '#03050a');
    sk3.addColorStop(0.55, '#090d16');
    sk3.addColorStop(1, '#121826');
    g.fillStyle = sk3;
    g.fillRect(0, 0, W, Math.max(0, hor));

    // Faint stars peeking through drifting night clouds
    for (let si = 0; si < 20; si++) {
      const sx = ((hv(si * 7.3) * W - ca * 45) % W + W) % W;
      const sy = 4 + hv(si * 11.7) * Math.max(8, hor * 0.65);
      const tw = 0.15 + 0.25 * Math.sin(tm * 1.4 + si * 2.3);
      g.fillStyle = `rgba(195,212,238,${Math.max(0.04, tw).toFixed(3)})`;
      g.fillRect(sx, sy, 1, 1);
    }

    // Pale haunted full moon behind thin mist
    const moonX = ((0.6 - ca / (Math.PI * 2)) % 1 + 1) % 1 * W;
    const moonY = Math.max(12, hor * 0.34);
    const moonG = g.createRadialGradient(moonX, moonY, 1, moonX, moonY, 34);
    moonG.addColorStop(0, 'rgba(205,218,238,0.28)');
    moonG.addColorStop(0.28, 'rgba(130,148,180,0.11)');
    moonG.addColorStop(1, 'rgba(20,26,40,0)');
    g.fillStyle = moonG;
    g.fillRect(0, 0, W, Math.max(0, hor));
    g.fillStyle = 'rgba(218,228,244,0.34)';
    g.beginPath();
    g.arc(moonX, moonY, 5.5, 0, Math.PI * 2);
    g.fill();

    // Heavy dark night clouds
    for (let ci = 0; ci < 7; ci++) {
      const cx0 = ((ci * 78 + tm * 2.2 - ca * 34) % (W + 140) + W + 140) % (W + 140) - 70;
      const cy0 = 8 + (ci % 3) * 14;
      g.fillStyle = 'rgba(12,16,24,0.52)';
      g.beginPath();
      g.ellipse(cx0, cy0, 52 + (ci % 3) * 16, 8 + (ci % 2) * 5, 0, 0, 7);
      g.fill();
    }

    // Blackened midnight ridges & dead autumn forest treeline
    const baseTY = hor + 2;
    g.fillStyle = 'rgba(9,11,16,0.92)';
    g.beginPath();
    g.moveTo(0, baseTY);
    for (let tx = 0; tx <= W; tx += 8) {
      const ang = (tx / W - 0.5) * fovK * 2 + ca;
      const th = 22 + Math.sin(ang * 2.3) * 8 + Math.cos(ang * 5.1) * 5;
      g.lineTo(tx, baseTY - th);
    }
    g.lineTo(W, baseTY);
    g.closePath();
    g.fill();

    g.fillStyle = '#15100c';
    g.beginPath();
    g.moveTo(0, baseTY);
    for (let tx = 0; tx <= W; tx += 6) {
      const ang = (tx / W - 0.5) * fovK * 2 + ca;
      const th = 14 + Math.abs(Math.sin(ang * 5.7)) * 15 + Math.abs(Math.cos(ang * 13.3)) * 10;
      g.lineTo(tx, baseTY - th);
    }
    g.lineTo(W, baseTY);
    g.closePath();
    g.fill();

    g.fillStyle = '#1f160e';
    g.beginPath();
    g.moveTo(0, baseTY);
    for (let tx = 0; tx <= W; tx += 7) {
      const ang = (tx / W - 0.5) * fovK * 2 + ca;
      const th = 9 + Math.abs(Math.cos(ang * 8.1)) * 13 + Math.abs(Math.sin(ang * 15.7)) * 7;
      g.lineTo(tx, baseTY - th);
    }
    g.lineTo(W, baseTY);
    g.closePath();
    g.fill();

    // Cold low horizon haze
    const mistG = g.createLinearGradient(0, Math.max(0, hor - 16), 0, hor + 12);
    mistG.addColorStop(0, 'rgba(14,19,28,0)');
    mistG.addColorStop(0.55, 'rgba(18,24,35,0.44)');
    mistG.addColorStop(1, 'rgba(12,16,24,0)');
    g.fillStyle = mistG;
    g.fillRect(0, Math.max(0, hor - 16), W, 28);

    // Dark midnight soil & damp moss alley
    const fg3 = g.createLinearGradient(0, hor, 0, H);
    fg3.addColorStop(0, '#0c0d0f');
    fg3.addColorStop(0.32, '#141310');
    fg3.addColorStop(1, '#090907');
    g.fillStyle = fg3;
    g.fillRect(0, hor, W, H - hor);

    // Darkened wet grass shoulders
    g.fillStyle = 'rgba(20,26,14,0.48)';
    g.beginPath();
    g.moveTo(0, hor);
    g.lineTo(W * 0.36, hor);
    g.lineTo(0, H);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(W, hor);
    g.lineTo(W * 0.64, hor);
    g.lineTo(W, H);
    g.closePath();
    g.fill();

    // Subtle darkened leaves on night soil
    for (let li = 0; li < 40; li++) {
      const lx = ((hv(li * 9.7) * W - ca * 55 + ox * 18) % W + W) % W;
      const ly = hor + 5 + hv(li * 4.3) * Math.max(8, H - hor - 8);
      g.fillStyle = li % 3 === 0 ? 'rgba(68,42,14,0.42)' : li % 3 === 1 ? 'rgba(52,24,10,0.38)' : 'rgba(38,24,14,0.42)';
      g.fillRect(lx, ly, 2 + (li % 2), 1.4);
    }
  } else if (ch === 5) {
    if (stg === 'ext') {
      // Snowy winter night yard outside the Granny Christmas house
      const sk5 = g.createLinearGradient(0, 0, 0, Math.max(20, hor));
      sk5.addColorStop(0, '#040a16');
      sk5.addColorStop(0.55, '#0b1930');
      sk5.addColorStop(1, '#1a2d4c');
      g.fillStyle = sk5;
      g.fillRect(0, 0, W, Math.max(0, hor));

      // Pale frosted stars & moon
      for (let si = 0; si < 24; si++) {
        const sx = ((hv(si * 6.9) * W - ca * 42) % W + W) % W;
        const sy = 4 + hv(si * 10.3) * Math.max(8, hor * 0.62);
        const tw = 0.25 + 0.35 * Math.sin(tm * 1.9 + si * 2.1);
        g.fillStyle = `rgba(215,232,255,${Math.max(0.08, tw).toFixed(3)})`;
        g.fillRect(sx, sy, 1.2, 1.2);
      }
      const mX = ((0.55 - ca / (Math.PI * 2)) % 1 + 1) % 1 * W;
      const mY = Math.max(12, hor * 0.32);
      g.fillStyle = 'rgba(226,240,255,0.42)';
      g.beginPath();
      g.arc(mX, mY, 5.5, 0, Math.PI * 2);
      g.fill();

      // Snow-covered pine horizon silhouette
      const baseTY = hor + 2;
      g.fillStyle = '#0c1824';
      g.beginPath();
      g.moveTo(0, baseTY);
      for (let tx = 0; tx <= W; tx += 6) {
        const ang = (tx / W - 0.5) * fovK * 2 + ca;
        const th = 12 + Math.abs(Math.sin(ang * 6.2)) * 15 + Math.abs(Math.cos(ang * 14.3)) * 8;
        g.lineTo(tx, baseTY - th);
      }
      g.lineTo(W, baseTY);
      g.closePath();
      g.fill();

      // Crisp moonlight-blue snow ground
      const fg5 = g.createLinearGradient(0, hor, 0, H);
      fg5.addColorStop(0, '#1e2c3e');
      fg5.addColorStop(0.4, '#2a3b52');
      fg5.addColorStop(1, '#121a26');
      g.fillStyle = fg5;
      g.fillRect(0, hor, W, H - hor);
    } else {
      // Indoor Granny Christmas House (dark aged timber ceiling & wood plank floorboards matching IMG_b4b5f352)
      const cg5 = g.createLinearGradient(0, 0, 0, Math.max(10, hor));
      cg5.addColorStop(0, '#120d09');
      cg5.addColorStop(1, '#050403');
      g.fillStyle = cg5;
      g.fillRect(0, 0, W, Math.max(0, hor));

      g.fillStyle = 'rgba(255,220,175,0.032)';
      for (let k = 1; k <= 5; k++) {
        const cy = hor * (1 - Math.pow(k / 6, 1.65));
        g.fillRect(0, cy, W, 1);
      }

      const fg5 = g.createLinearGradient(0, hor, 0, H);
      fg5.addColorStop(0, '#0b0806');
      fg5.addColorStop(0.55, '#1d140d');
      fg5.addColorStop(1, '#281b11');
      g.fillStyle = fg5;
      g.fillRect(0, hor, W, H - hor);

      // Horizontal wood plank perspective lines
      const phase = ((ox + oy) * 0.7) % 1;
      g.fillStyle = 'rgba(0,0,0,0.34)';
      for (let k = 0; k < 7; k++) {
        const u = ((k + phase) % 7) / 7;
        const fy = hor + u * u * Math.max(10, H - hor);
        g.fillRect(0, fy, W, 1.2);
      }
    }
  } else {
    // Ch1 (Maze) & Ch2 (Mansion) atmospheric ceiling & floor with subtle perspective depth bands
    const cg = g.createLinearGradient(0, 0, 0, Math.max(10, hor));
    if (ch === 2 && stg !== 'base' && !upf) {
      cg.addColorStop(0, '#0c0608');
      cg.addColorStop(1, '#020102');
    } else if (ch === 2 && upf) {
      cg.addColorStop(0, '#0a0e0d');
      cg.addColorStop(1, '#020303');
    } else {
      cg.addColorStop(0, '#070608');
      cg.addColorStop(1, '#010102');
    }
    g.fillStyle = cg;
    g.fillRect(0, 0, W, Math.max(0, hor));

    // Perspective ceiling ribs / beams when flashlight or ambient exists
    g.fillStyle = 'rgba(255,255,255,0.022)';
    for (let k = 1; k <= 4; k++) {
      const cy = hor * (1 - Math.pow(k / 5, 1.8));
      g.fillRect(0, cy, W, 1);
    }

    const fg = g.createLinearGradient(0, hor, 0, H);
    if (ch === 2 && stg !== 'base' && !upf) {
      fg.addColorStop(0, '#050304');
      fg.addColorStop(1, '#1c1012');
    } else {
      fg.addColorStop(0, '#040406');
      fg.addColorStop(1, '#161314');
    }
    g.fillStyle = fg;
    g.fillRect(0, hor, W, H - hor);

    // Subtle perspective floor tile / plank bands scrolling gently with player motion
    const phase = ((ox + oy) * 0.6) % 1;
    g.fillStyle = 'rgba(255,255,255,0.025)';
    for (let k = 0; k < 6; k++) {
      const u = ((k + phase) % 6) / 6;
      const fy = hor + u * u * Math.max(10, H - hor);
      g.fillRect(0, fy, W, 1);
    }
  }

  // Flashlight ground pool (with sprinting hand-tremor jitter)
  if (FL > 0) {
    const spotR = Math.max(18, H * (0.48 + 0.48 * Math.min(1.25, FL)));
    const sx0 = W * (0.5 + flShakeX);
    const sy0 = H * (0.86 + flShakeY);
    const sx1 = W * (0.5 + flShakeX);
    const sy1 = H * (0.78 + flShakeY);
    const gr = g.createRadialGradient(sx0, sy0, 3, sx1, sy1, spotR);
    const fc = floorCol();
    gr.addColorStop(0, `rgba(${fc},${Math.min(1, 0.62 * FL)})`);
    gr.addColorStop(0.45, `rgba(${fc},${Math.min(1, 0.24 * FL)})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, hor, W, H - hor);
  }
}

export function drawFloorLightPools(ctx) {
  const { g, W, H, hor, ox, oy, dx, dy, plx, ply, inv, VF, zb, RW, lights } = ctx;
  if (!lights || !lights.length) return;

  const cw = W / RW;
  g.save();
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < lights.length; i++) {
    const lt = lights[i];
    const ex = lt.x - ox;
    const ey = lt.y - oy;
    const d2 = ex * ex + ey * ey;
    if (d2 > 144) continue;
    const tx = inv * (dy * ex - dx * ey);
    const ty = inv * (-ply * ex + plx * ey);
    if (ty < 0.25) continue;

    const scr = W * 0.5 * (1 + tx / ty);
    if (scr < -40 || scr > W + 40) continue;
    const rx = Math.max(0, Math.min(RW - 1, (scr / cw) | 0));
    if (zb[rx] < ty - 0.35) continue;

    const fade = Math.max(0, 1 - Math.sqrt(d2) / 11.5);
    const fy = hor + (H / ty) * VF * 0.5;
    const radX = Math.min(72, (H / ty) * VF * 0.45);
    const radY = Math.max(3, radX * 0.28);
    if (fy > hor - 4 && fy < H + 30) {
      const grad = g.createRadialGradient(scr, fy, 1, scr, fy, radX);
      grad.addColorStop(0, `rgba(${lt.r | 0},${lt.g | 0},${lt.b | 0},${(0.24 * fade * lt.pow).toFixed(3)})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.save();
      g.translate(scr, fy);
      g.scale(1, radY / Math.max(1, radX));
      g.translate(-scr, -fy);
      g.fillStyle = grad;
      g.fillRect(scr - radX, fy - radX, radX * 2, radX * 2);
      g.restore();
    }

    // Soft atmospheric halo around elevated emitters (torches, candelabras, lamps, exit)
    const hy = hor + (H / ty) * VF * ((lt.haloY ?? 0.35) - 0.5);
    const hRad = Math.min(54, (H / ty) * VF * 0.36);
    if (hy > -30 && hy < H + 30 && hRad > 2) {
      const hGrad = g.createRadialGradient(scr, hy, 0.5, scr, hy, hRad);
      hGrad.addColorStop(0, `rgba(${lt.r | 0},${lt.g | 0},${lt.b | 0},${(0.20 * fade * lt.pow).toFixed(3)})`);
      hGrad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = hGrad;
      g.beginPath();
      g.arc(scr, hy, hRad, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();
}

export function drawAtmosphereParticles(ctx) {
  const { g, W, H, ch, camInBay, hor, FL, tm, ltFl, hv, flShakeX = 0, flShakeY = 0 } = ctx;

  // Volumetric flashlight cone & illuminated dust motes in dark chapters (including nocturnal Ch3 cemetery & Ch5 house)
  if ((ch === 1 || ch === 2 || ch === 3 || ch === 5 || (ch === 4 && camInBay)) && FL > 0.08) {
    g.save();
    g.globalCompositeOperation = 'screen';
    const cx0 = W * (0.5 + flShakeX);
    const cy0 = H * (0.5 + flShakeY);
    const cone = g.createRadialGradient(cx0, cy0, 4, cx0 + W * 0.02, cy0 + H * 0.04, W * 0.44);
    cone.addColorStop(0, `rgba(255,248,225,${(0.068 * Math.min(1, FL)).toFixed(3)})`);
    cone.addColorStop(0.55, `rgba(215,228,255,${(0.026 * Math.min(1, FL)).toFixed(3)})`);
    cone.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = cone;
    g.fillRect(0, 0, W, H);

    // Floating dust motes illuminated inside flashlight beam
    for (let i = 0; i < 24; i++) {
      const bx = (hv(i * 5.1) * 0.7 + 0.15) * W + Math.sin(tm * (0.6 + (i % 3) * 0.25) + i * 1.7) * 18;
      const by = (hv(i * 8.3) * 0.72 + 0.14) * H + Math.cos(tm * (0.45 + (i % 4) * 0.18) + i * 2.3) * 12;
      const dx = (bx - cx0) / (W * 0.34);
      const dy = (by - cy0) / (H * 0.36);
      const dist = dx * dx + dy * dy;
      if (dist < 1) {
        const a = (1 - dist) * 0.38 * Math.min(1, FL) * (0.55 + 0.45 * Math.sin(tm * 3 + i));
        g.fillStyle = `rgba(255,246,220,${a.toFixed(3)})`;
        const sz = (i % 4 === 0) ? 1.4 : 0.9;
        g.fillRect(bx, by, sz, sz);
      }
    }
    g.restore();
  }

  // Drifting autumn leaves & eerie midnight cemetery fog in Ch3
  if (ch === 3) {
    g.save();
    for (let wi = 0; wi < 3; wi++) {
      const mx = ((tm * (7 + wi * 3) + wi * 150) % (W + 180)) - 90;
      const my = hor + 16 + wi * 22;
      const mg = g.createRadialGradient(mx, my, 4, mx, my, 82);
      mg.addColorStop(0, 'rgba(34,42,56,0.18)');
      mg.addColorStop(1, 'rgba(20,26,38,0)');
      g.fillStyle = mg;
      g.beginPath();
      g.ellipse(mx, my, 82, 15, 0, 0, Math.PI * 2);
      g.fill();
    }

    for (let li = 0; li < 20; li++) {
      const speedX = 14 + (li % 4) * 5;
      const speedY = 18 + (li % 3) * 6;
      const lx = ((hv(li * 3.7) * W + tm * speedX + Math.sin(tm * 2.4 + li) * 12) % (W + 16) + (W + 16)) % (W + 16) - 8;
      const ly = ((hv(li * 6.1) * H + tm * speedY) % (H + 10)) - 5;
      g.save();
      g.translate(lx, ly);
      g.rotate(tm * 2.2 + li);
      g.fillStyle = li % 3 === 0 ? 'rgba(92,56,20,0.52)' : li % 3 === 1 ? 'rgba(72,32,14,0.48)' : 'rgba(54,38,18,0.48)';
      g.fillRect(-1.8, -0.9, 3.6, 1.8);
      g.restore();
    }
    g.restore();
  }

  // Drifting snowfall & warm hearth sparks in Ch5 Christmas House
  if (ch === 5) {
    g.save();
    const isExt = ctx.stg === 'ext';
    const count = isExt ? 36 : 16;
    for (let si = 0; si < count; si++) {
      const sx = ((hv(si * 4.3) * W + Math.sin(tm * 1.4 + si) * 16 + (isExt ? tm * 9 : 0)) % (W + 12) + W + 12) % (W + 12) - 6;
      const sy = ((hv(si * 7.9) * H + tm * (isExt ? 24 : 10 + (si % 3) * 4)) % (H + 10)) - 5;
      if (isExt) {
        g.fillStyle = si % 3 === 0 ? 'rgba(235,245,255,0.68)' : 'rgba(205,225,250,0.45)';
        g.fillRect(sx, sy, si % 4 === 0 ? 2 : 1.3, si % 4 === 0 ? 2 : 1.3);
      } else {
        // Warm floating fireplace/tree sparks indoors
        g.fillStyle = si % 2 === 0 ? 'rgba(255,212,118,0.36)' : 'rgba(220,235,255,0.28)';
        g.fillRect(sx, sy, 1.3, 1.3);
      }
    }
    g.restore();
  }

  // Extra lightning sheen layer during Ch4 rainstorms
  if (ch === 4 && !camInBay && ltFl > 0.15) {
    g.fillStyle = `rgba(190,215,255,${(ltFl * 0.12).toFixed(3)})`;
    g.fillRect(0, 0, W, H);
  }
}

let cachedGrainCanvas = null;
function getFilmGrainCanvas() {
  if (cachedGrainCanvas) return cachedGrainCanvas;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(128, 128);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 22;
  }
  ctx.putImageData(img, 0, 0);
  cachedGrainCanvas = c;
  return c;
}

export function drawFilmGrain(g, W, H, intensity) {
  const tile = getFilmGrainCanvas();
  const ox = -((Math.random() * 64) | 0);
  const oy = -((Math.random() * 64) | 0);
  g.save();
  g.globalAlpha = Math.max(0.05, Math.min(0.65, intensity));
  g.globalCompositeOperation = 'overlay';
  for (let y = oy; y < H; y += 128) {
    for (let x = ox; x < W; x += 128) {
      g.drawImage(tile, x, y);
    }
  }
  g.restore();
}
