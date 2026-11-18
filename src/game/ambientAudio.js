/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Dynamic Procedural Ambient Sound System per Chapter:
 *  - Ch 1 (Лабиринт): hollow knocks on distant doors/bars, scurrying rustles, metallic scrapes, water drips.
 *  - Ch 2 (Особняк): wooden door knocks (spatially panned toward doors), floorboard/hinge creaks, wall rustles, clock chimes.
 *  - Ch 3 (Кладбище): distant dog barking outside the fence, crow caws, autumn wind & leaf rustles, iron gate/chain clinks.
 *  - Ch 4 (Гаражи): stray dog barking beyond garages, heavy knocks on corrugated garage doors, gravel rustles, dropped wrench clinks.
 *  - Ch 5 (Новогодний дом): winter blizzard gusts, distant sleigh bells, fireplace ember crackles, frozen wooden door knocks.
 */

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function makePanNode(ac, dest, pan = 0) {
  if (typeof ac.createStereoPanner === 'function') {
    const p = ac.createStereoPanner();
    p.pan.value = clamp(pan, -1, 1);
    p.connect(dest);
    return p;
  }
  return dest;
}

function playNoiseBurst(ac, nb, dest, {
  startTime,
  dur = 0.25,
  freq = 800,
  freqEnd = null,
  q = 1.2,
  vol = 0.12,
  filterType = 'bandpass',
  attack = 0.015,
  pan = 0,
}) {
  if (!ac || !nb || !dest) return;
  const t0 = startTime ?? ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = nb;

  const flt = ac.createBiquadFilter();
  flt.type = filterType;
  flt.frequency.setValueAtTime(Math.max(20, freq), t0);
  if (freqEnd && freqEnd !== freq) {
    flt.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + dur);
  }
  if (flt.Q) flt.Q.value = q;

  const gn = ac.createGain();
  gn.gain.setValueAtTime(0.0001, t0);
  gn.gain.linearRampToValueAtTime(Math.max(0.0002, vol), t0 + Math.min(attack, dur * 0.45));
  gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  const panNode = makePanNode(ac, dest, pan);
  src.connect(flt);
  flt.connect(gn);
  gn.connect(panNode);

  const offset = Math.random() * Math.max(0.1, (nb.duration || 2) - 0.25);
  src.loop = true;
  src.start(t0, offset);
  src.stop(t0 + dur + 0.03);
}

function playTone(ac, dest, {
  startTime,
  f0 = 200,
  f1 = null,
  dur = 0.2,
  vol = 0.12,
  type = 'sine',
  attack = 0.008,
  filterFreq = null,
  filterType = 'lowpass',
  pan = 0,
}) {
  if (!ac || !dest) return;
  const t0 = startTime ?? ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, f0), t0);
  if (f1 && f1 !== f0) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  }

  const gn = ac.createGain();
  gn.gain.setValueAtTime(0.0001, t0);
  gn.gain.linearRampToValueAtTime(Math.max(0.0002, vol), t0 + Math.min(attack, dur * 0.4));
  gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  let tail = osc;
  if (filterFreq) {
    const flt = ac.createBiquadFilter();
    flt.type = filterType;
    flt.frequency.setValueAtTime(filterFreq, t0);
    osc.connect(flt);
    tail = flt;
  }

  const panNode = makePanNode(ac, dest, pan);
  tail.connect(gn);
  gn.connect(panNode);

  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

// --- INDIVIDUAL PROCEDURAL AMBIENT EVENTS ---

function sfxDoorKnock(ac, nb, dest, pan, { metallic = false, muffled = 1.0 } = {}) {
  const now = ac.currentTime + 0.02;
  const count = Math.random() < 0.45 ? 4 : 3;
  const baseVol = (0.19 + Math.random() * 0.09) * muffled;

  for (let i = 0; i < count; i++) {
    const t = now + i * (0.17 + Math.random() * 0.09) + (i === 2 ? 0.06 : 0);
    const v = baseVol * (i === count - 1 ? 1.15 : 0.78 + Math.random() * 0.25);

    if (metallic) {
      // Heavy iron / corrugated garage door knock
      playTone(ac, dest, {
        startTime: t,
        f0: 145 + Math.random() * 25,
        f1: 58,
        dur: 0.22,
        vol: v,
        type: 'triangle',
        filterFreq: 680 * muffled,
        pan,
      });
      playTone(ac, dest, {
        startTime: t,
        f0: 365 + Math.random() * 45,
        f1: 290,
        dur: 0.28,
        vol: v * 0.32,
        type: 'sine',
        pan,
      });
      playNoiseBurst(ac, nb, dest, {
        startTime: t,
        dur: 0.09,
        freq: 750 * muffled,
        q: 2.2,
        vol: v * 0.55,
        attack: 0.004,
        pan,
      });
    } else {
      // Hollow wooden door knock ("тук-тук-тук")
      playTone(ac, dest, {
        startTime: t,
        f0: 185 + Math.random() * 28,
        f1: 72,
        dur: 0.13,
        vol: v,
        type: 'sine',
        filterFreq: 900 * muffled,
        pan,
      });
      playNoiseBurst(ac, nb, dest, {
        startTime: t,
        dur: 0.065,
        freq: 520 * muffled,
        q: 2.5,
        vol: v * 0.52,
        filterType: 'bandpass',
        attack: 0.003,
        pan,
      });
    }
  }
}

function sfxRustle(ac, nb, dest, pan, { leafy = false, muffled = 1.0 } = {}) {
  const now = ac.currentTime + 0.02;
  const bursts = 3 + Math.floor(Math.random() * 3);
  let p = pan;
  for (let i = 0; i < bursts; i++) {
    const t = now + i * (0.09 + Math.random() * 0.11);
    p = clamp(p + (Math.random() - 0.5) * 0.25, -0.95, 0.95);
    const fStart = leafy ? (2100 + Math.random() * 900) : (1400 + Math.random() * 800);
    const fEnd = leafy ? (3200 + Math.random() * 800) : (2300 + Math.random() * 700);
    playNoiseBurst(ac, nb, dest, {
      startTime: t,
      dur: 0.09 + Math.random() * 0.1,
      freq: fStart * muffled,
      freqEnd: fEnd * muffled,
      q: leafy ? 1.4 : 2.1,
      vol: (0.06 + Math.random() * 0.05) * muffled,
      filterType: 'bandpass',
      attack: 0.012,
      pan: p,
    });
  }
}

function sfxDistantDogBark(ac, nb, dest, pan, { muffled = 0.85 } = {}) {
  const now = ac.currentTime + 0.02;
  const barks = 2 + (Math.random() < 0.5 ? 1 : 0);
  const distAtten = (0.55 + Math.random() * 0.35) * muffled;

  for (let i = 0; i < barks; i++) {
    const t = now + i * (0.28 + Math.random() * 0.12) + (i === 2 ? 0.14 : 0);
    const dur = 0.13 + Math.random() * 0.05;
    const pitch = 290 + Math.random() * 75 - i * 18;
    const v = 0.14 * distAtten * (i === barks - 1 ? 0.85 : 1);

    // Vocal bark formant
    playTone(ac, dest, {
      startTime: t,
      f0: pitch * 0.72,
      f1: pitch * 1.18,
      dur: dur * 0.45,
      vol: v,
      type: 'sawtooth',
      attack: 0.01,
      filterFreq: 850 * muffled,
      pan,
    });
    playTone(ac, dest, {
      startTime: t + dur * 0.4,
      f0: pitch * 1.15,
      f1: pitch * 0.48,
      dur: dur * 0.65,
      vol: v * 0.9,
      type: 'sawtooth',
      attack: 0.005,
      filterFreq: 720 * muffled,
      pan,
    });
    // Raspy breath transient
    playNoiseBurst(ac, nb, dest, {
      startTime: t,
      dur: dur * 0.95,
      freq: 620 * muffled,
      freqEnd: 420 * muffled,
      q: 1.8,
      vol: v * 0.65,
      filterType: 'bandpass',
      attack: 0.01,
      pan,
    });
    // Subtle distant echo tail
    playTone(ac, dest, {
      startTime: t + 0.24,
      f0: pitch * 0.9,
      f1: pitch * 0.5,
      dur: dur * 0.8,
      vol: v * 0.2,
      type: 'triangle',
      filterFreq: 520 * muffled,
      pan: clamp(-pan * 0.5, -1, 1),
    });
  }
}

function sfxCreak(ac, nb, dest, pan) {
  const now = ac.currentTime + 0.02;
  const dur = 0.55 + Math.random() * 0.5;
  const f0 = 260 + Math.random() * 140;
  const f1 = f0 * (Math.random() < 0.5 ? 1.38 : 0.72);
  playTone(ac, dest, {
    startTime: now,
    f0,
    f1,
    dur,
    vol: 0.065 + Math.random() * 0.03,
    type: 'sawtooth',
    attack: 0.06,
    filterFreq: 950,
    pan,
  });
  playTone(ac, dest, {
    startTime: now + 0.03,
    f0: f0 * 1.49,
    f1: f1 * 1.46,
    dur: dur * 0.9,
    vol: 0.035,
    type: 'triangle',
    attack: 0.08,
    filterFreq: 1100,
    pan,
  });
}

function sfxWaterDrip(ac, dest, pan) {
  const now = ac.currentTime + 0.02;
  const count = Math.random() < 0.4 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    const t = now + i * (0.28 + Math.random() * 0.22);
    const f = 850 + Math.random() * 450;
    playTone(ac, dest, {
      startTime: t,
      f0: f,
      f1: f * 1.85,
      dur: 0.075,
      vol: 0.085,
      type: 'sine',
      attack: 0.004,
      pan,
    });
  }
}

function sfxDistantSteps(ac, nb, dest, pan) {
  const now = ac.currentTime + 0.02;
  const steps = 3 + Math.floor(Math.random() * 3);
  let p = pan;
  for (let i = 0; i < steps; i++) {
    const t = now + i * (0.34 + Math.random() * 0.08);
    p = clamp(p + (pan > 0 ? -0.07 : 0.07), -0.95, 0.95);
    const v = 0.08 * (1 - i * 0.1);
    playNoiseBurst(ac, nb, dest, {
      startTime: t,
      dur: 0.09,
      freq: 260,
      q: 1.4,
      vol: v,
      filterType: 'lowpass',
      attack: 0.005,
      pan: p,
    });
    playTone(ac, dest, {
      startTime: t,
      f0: 85,
      f1: 42,
      dur: 0.08,
      vol: v * 0.7,
      type: 'sine',
      pan: p,
    });
  }
}

function sfxCrowCaw(ac, nb, dest, pan) {
  const now = ac.currentTime + 0.02;
  const caws = Math.random() < 0.6 ? 2 : 3;
  for (let i = 0; i < caws; i++) {
    const t = now + i * (0.24 + Math.random() * 0.07);
    const f = 540 + Math.random() * 90;
    playTone(ac, dest, {
      startTime: t,
      f0: f,
      f1: f * 0.78,
      dur: 0.16,
      vol: 0.055,
      type: 'sawtooth',
      attack: 0.015,
      filterFreq: 1350,
      pan,
    });
    playNoiseBurst(ac, nb, dest, {
      startTime: t,
      dur: 0.15,
      freq: 1150,
      q: 3.2,
      vol: 0.045,
      filterType: 'bandpass',
      attack: 0.015,
      pan,
    });
  }
}

function sfxWindGust(ac, nb, dest, pan, { indoor = false } = {}) {
  const now = ac.currentTime + 0.02;
  const dur = 1.6 + Math.random() * 1.2;
  playNoiseBurst(ac, nb, dest, {
    startTime: now,
    dur,
    freq: indoor ? 220 : 340,
    freqEnd: indoor ? 380 : 690,
    q: 2.2,
    vol: indoor ? 0.05 : 0.085,
    filterType: 'bandpass',
    attack: dur * 0.35,
    pan,
  });
}

function sfxWrenchOrChain(ac, dest, pan, { isWrench = false } = {}) {
  const now = ac.currentTime + 0.02;
  if (isWrench) {
    // Dropped steel wrench ringing on garage concrete
    const t1 = now;
    const t2 = now + 0.13;
    playTone(ac, dest, { startTime: t1, f0: 1420, f1: 1380, dur: 0.24, vol: 0.085, type: 'triangle', pan });
    playTone(ac, dest, { startTime: t1, f0: 2140, f1: 2090, dur: 0.18, vol: 0.045, type: 'sine', pan });
    playTone(ac, dest, { startTime: t2, f0: 1510, f1: 1470, dur: 0.16, vol: 0.05, type: 'triangle', pan });
  } else {
    // Rusty iron chain / cemetery gate rattle
    for (let i = 0; i < 3; i++) {
      const t = now + i * (0.09 + Math.random() * 0.05);
      const f = 980 + Math.random() * 650;
      playTone(ac, dest, { startTime: t, f0: f, f1: f * 0.92, dur: 0.14, vol: 0.055, type: 'triangle', pan });
    }
  }
}

function sfxMansionClock(ac, dest, pan) {
  const now = ac.currentTime + 0.02;
  const strikes = Math.random() < 0.5 ? 2 : 1;
  for (let i = 0; i < strikes; i++) {
    const t = now + i * 0.95;
    playTone(ac, dest, { startTime: t, f0: 220, f1: 218, dur: 0.9, vol: 0.08, type: 'sine', attack: 0.01, pan });
    playTone(ac, dest, { startTime: t, f0: 440, f1: 438, dur: 0.55, vol: 0.035, type: 'triangle', attack: 0.01, pan });
  }
}

function sfxSleighBells(ac, dest, pan) {
  const now = ac.currentTime + 0.02;
  const jingles = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < jingles; i++) {
    const t = now + i * (0.08 + Math.random() * 0.05);
    const f = 2400 + Math.random() * 900;
    playTone(ac, dest, { startTime: t, f0: f, f1: f * 0.98, dur: 0.16, vol: 0.04, type: 'sine', attack: 0.003, pan });
    playTone(ac, dest, { startTime: t, f0: f * 1.48, f1: f * 1.45, dur: 0.12, vol: 0.022, type: 'triangle', attack: 0.003, pan });
  }
}

function sfxFireplaceCrackle(ac, nb, dest, pan) {
  const now = ac.currentTime + 0.02;
  const pops = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < pops; i++) {
    const t = now + i * (0.07 + Math.random() * 0.14);
    playNoiseBurst(ac, nb, dest, {
      startTime: t,
      dur: 0.045,
      freq: 2600 + Math.random() * 1400,
      q: 3.4,
      vol: 0.045 + Math.random() * 0.03,
      filterType: 'bandpass',
      attack: 0.003,
      pan,
    });
  }
}

// --- CHAPTER MANAGER ---

export function createAmbientAudioSystem() {
  let nextEventAt = 4.0;
  let lastKind = '';

  function reset(delayMin = 3.2, delayMax = 6.5) {
    nextEventAt = delayMin + Math.random() * (delayMax - delayMin);
    lastKind = '';
  }

  function computeDoorPan(px, py, pa, doors) {
    if (!Array.isArray(doors) || !doors.length) {
      return (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.6);
    }
    let best = null;
    let bestDist = 999;
    for (const d of doors) {
      if (!d || d.st === 'broken') continue;
      const dist = Math.hypot((d.cx + 0.5) - px, (d.cy + 0.5) - py);
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    if (!best || bestDist > 18) {
      return (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.6);
    }
    const ang = Math.atan2((best.cy + 0.5) - py, (best.cx + 0.5) - px);
    let diff = ang - pa;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return clamp(Math.sin(diff), -0.95, 0.95);
  }

  function pickEvent(ch, indoor, stg) {
    let pool;
    if (ch === 1) {
      pool = ['knock_metal', 'rustle', 'drip', 'steps', 'creak', 'wind'];
    } else if (ch === 2) {
      pool = stg === 'base'
        ? ['knock_wood', 'rustle', 'drip', 'steps', 'creak']
        : ['knock_wood', 'creak', 'rustle', 'clock', 'steps', 'wind'];
    } else if (ch === 3) {
      pool = ['dog_bark', 'dog_bark', 'wind', 'leaf_rustle', 'crow', 'chain'];
    } else if (ch === 5) {
      pool = indoor
        ? ['fireplace', 'knock_wood', 'creak', 'sleigh_bells', 'wind', 'steps']
        : ['wind', 'sleigh_bells', 'creak', 'dog_bark', 'steps'];
    } else {
      pool = indoor
        ? ['knock_garage', 'wrench', 'rustle', 'drip', 'dog_bark_muffled']
        : ['knock_garage', 'dog_bark', 'rustle', 'wrench', 'wind'];
    }
    const filtered = pool.filter((k) => k !== lastKind);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
    lastKind = chosen;
    return chosen;
  }

  function update(dt, ctx) {
    const { ac, nb, dest, ch, stg = '', indoor = false, monState = 'patrol', monDist = 99, px = 0, py = 0, pa = 0, doors = null } = ctx;
    if (!ac || !nb || !dest || ac.state !== 'running') return;

    nextEventAt -= dt;
    if (nextEventAt > 0) return;

    // Schedule next dynamic ambient event based on tension & chapter pacing
    const tense = monState === 'hunt' || monDist < 8;
    const baseMin = tense ? 7.5 : 4.8;
    const baseMax = tense ? 13.5 : 10.5;
    nextEventAt = baseMin + Math.random() * (baseMax - baseMin);

    // During very close active hunt, only occasionally knock on a nearby door, skip gentle whispers
    if (monState === 'hunt' && monDist < 5.5) {
      if (Math.random() < 0.45) {
        const pan = computeDoorPan(px, py, pa, doors);
        sfxDoorKnock(ac, nb, dest, pan, { metallic: ch === 1 || ch === 4, muffled: 0.95 });
      }
      return;
    }

    const kind = pickEvent(ch, indoor, stg);
    const sidePan = (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.6);

    switch (kind) {
      case 'knock_wood': {
        const pan = computeDoorPan(px, py, pa, doors);
        sfxDoorKnock(ac, nb, dest, pan, { metallic: false, muffled: 1.0 });
        break;
      }
      case 'knock_metal':
      case 'knock_garage': {
        sfxDoorKnock(ac, nb, dest, sidePan, { metallic: true, muffled: indoor ? 1.05 : 0.9 });
        break;
      }
      case 'rustle': {
        sfxRustle(ac, nb, dest, sidePan, { leafy: false, muffled: 1.0 });
        break;
      }
      case 'leaf_rustle': {
        sfxRustle(ac, nb, dest, sidePan, { leafy: true, muffled: 1.0 });
        break;
      }
      case 'dog_bark': {
        sfxDistantDogBark(ac, nb, dest, sidePan, { muffled: 0.9 });
        break;
      }
      case 'dog_bark_muffled': {
        sfxDistantDogBark(ac, nb, dest, sidePan, { muffled: 0.52 });
        break;
      }
      case 'creak': {
        sfxCreak(ac, nb, dest, sidePan);
        break;
      }
      case 'drip': {
        sfxWaterDrip(ac, dest, sidePan);
        break;
      }
      case 'steps': {
        sfxDistantSteps(ac, nb, dest, sidePan);
        break;
      }
      case 'crow': {
        sfxCrowCaw(ac, nb, dest, sidePan);
        break;
      }
      case 'wind': {
        sfxWindGust(ac, nb, dest, sidePan * 0.6, { indoor });
        break;
      }
      case 'wrench': {
        sfxWrenchOrChain(ac, dest, sidePan, { isWrench: true });
        break;
      }
      case 'chain': {
        sfxWrenchOrChain(ac, dest, sidePan, { isWrench: false });
        break;
      }
      case 'clock': {
        sfxMansionClock(ac, dest, sidePan);
        break;
      }
      case 'sleigh_bells': {
        sfxSleighBells(ac, dest, sidePan);
        break;
      }
      case 'fireplace': {
        sfxFireplaceCrackle(ac, nb, dest, sidePan);
        break;
      }
      default:
        break;
    }
  }

  return { reset, update };
}

export function playSurfaceFootstep(ac, nb, dest, opts = {}) {
  if (!ac || !nb || !dest || ac.state !== 'running') return;
  const { surface = 'stone', sprint = false, crouch = false } = opts;
  const now = ac.currentTime;
  const volMul = crouch ? 0.34 : sprint ? 1.28 : 0.85;
  const pitchVar = 0.9 + Math.random() * 0.22;

  const pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
  if (pan) {
    pan.pan.value = (Math.random() - 0.5) * 0.14;
    pan.connect(dest);
  }
  const out = pan || dest;

  if (surface === 'concrete') {
    // Hard heel tap + crisp slapback echo inside Ch4 garage bays
    const o = ac.createOscillator();
    const og = ac.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime((sprint ? 165 : 138) * pitchVar, now);
    o.frequency.exponentialRampToValueAtTime(52, now + 0.055);
    og.gain.setValueAtTime(0.11 * volMul, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    o.connect(og); og.connect(out);
    o.start(now); o.stop(now + 0.075);

    const n = ac.createBufferSource();
    n.buffer = nb;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = (sprint ? 1650 : 1200) * pitchVar;
    bp.Q.value = 1.8;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.08 * volMul, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    n.connect(bp); bp.connect(ng); ng.connect(out);
    n.start(now); n.stop(now + 0.065);

    // Subtle concrete slapback echo
    const echoDelay = 0.068;
    const ne = ac.createBufferSource();
    ne.buffer = nb;
    const ebp = ac.createBiquadFilter();
    ebp.type = 'bandpass';
    ebp.frequency.value = 920;
    ebp.Q.value = 1.4;
    const eg = ac.createGain();
    eg.gain.setValueAtTime(0.0001, now);
    eg.gain.setValueAtTime(0.026 * volMul, now + echoDelay);
    eg.gain.exponentialRampToValueAtTime(0.001, now + echoDelay + 0.07);
    ne.connect(ebp); ebp.connect(eg); eg.connect(out);
    ne.start(now + echoDelay); ne.stop(now + echoDelay + 0.075);
  } else if (surface === 'wet_asphalt') {
    // Low asphalt thud + rainy puddle splash
    const o = ac.createOscillator();
    const og = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(118 * pitchVar, now);
    o.frequency.exponentialRampToValueAtTime(42, now + 0.065);
    og.gain.setValueAtTime(0.10 * volMul, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    o.connect(og); og.connect(out);
    o.start(now); o.stop(now + 0.08);

    const n = ac.createBufferSource();
    n.buffer = nb;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime((sprint ? 2600 : 1900) * pitchVar, now);
    bp.frequency.exponentialRampToValueAtTime(900, now + 0.09);
    bp.Q.value = 1.1;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.085 * volMul, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    n.connect(bp); bp.connect(ng); ng.connect(out);
    n.start(now); n.stop(now + 0.115);
  } else if (surface === 'grass') {
    // Soft muted earth impact + dry cemetery grass & autumn leaf crunch
    const o = ac.createOscillator();
    const og = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(84 * pitchVar, now);
    o.frequency.exponentialRampToValueAtTime(34, now + 0.07);
    og.gain.setValueAtTime(0.075 * volMul, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    o.connect(og); og.connect(out);
    o.start(now); o.stop(now + 0.085);

    const n = ac.createBufferSource();
    n.buffer = nb;
    const hp = ac.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.value = (sprint ? 3100 : 2400) * pitchVar;
    hp.Q.value = 0.85;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.01 * volMul, now);
    ng.gain.linearRampToValueAtTime(0.085 * volMul, now + 0.018);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.115);
    n.connect(hp); hp.connect(ng); ng.connect(out);
    n.start(now); n.stop(now + 0.12);
  } else if (surface === 'wood') {
    // Hollow mansion timber plank thud + subtle dry creak
    const o = ac.createOscillator();
    const og = ac.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime((sprint ? 148 : 118) * pitchVar, now);
    o.frequency.exponentialRampToValueAtTime(48, now + 0.085);
    og.gain.setValueAtTime(0.13 * volMul, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    o.connect(og); og.connect(out);
    o.start(now); o.stop(now + 0.10);

    const n = ac.createBufferSource();
    n.buffer = nb;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 540 * pitchVar;
    bp.Q.value = 2.4;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.065 * volMul, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    n.connect(bp); bp.connect(ng); ng.connect(out);
    n.start(now); n.stop(now + 0.075);

    // Occasional old floorboard groan
    if (Math.random() < (crouch ? 0.08 : 0.24)) {
      const cr = ac.createOscillator();
      const crg = ac.createGain();
      cr.type = 'sawtooth';
      const bf = 280 + Math.random() * 140;
      cr.frequency.setValueAtTime(bf, now + 0.02);
      cr.frequency.linearRampToValueAtTime(bf * 0.78, now + 0.16);
      crg.gain.setValueAtTime(0.001, now + 0.02);
      crg.gain.linearRampToValueAtTime(0.018 * volMul, now + 0.055);
      crg.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      const crf = ac.createBiquadFilter();
      crf.type = 'bandpass'; crf.frequency.value = 620; crf.Q.value = 3.2;
      cr.connect(crf); crf.connect(crg); crg.connect(out);
      cr.start(now + 0.02); cr.stop(now + 0.18);
    }
  } else if (surface === 'snow') {
    // Crisp winter snow crunch under boots
    const o = ac.createOscillator();
    const og = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(92 * pitchVar, now);
    o.frequency.exponentialRampToValueAtTime(36, now + 0.08);
    og.gain.setValueAtTime(0.08 * volMul, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    o.connect(og); og.connect(out);
    o.start(now); o.stop(now + 0.095);

    const n = ac.createBufferSource();
    n.buffer = nb;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime((sprint ? 3600 : 2800) * pitchVar, now);
    bp.frequency.exponentialRampToValueAtTime(1600, now + 0.11);
    bp.Q.value = 1.15;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.015 * volMul, now);
    ng.gain.linearRampToValueAtTime(0.11 * volMul, now + 0.02);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.125);
    n.connect(bp); bp.connect(ng); ng.connect(out);
    n.start(now); n.stop(now + 0.13);
  } else {
    // 'stone' (Maze & Mansion Basement damp gritty stone)
    const o = ac.createOscillator();
    const og = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime((sprint ? 128 : 96) * pitchVar, now);
    o.frequency.exponentialRampToValueAtTime(38, now + 0.075);
    og.gain.setValueAtTime(0.11 * volMul, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
    o.connect(og); og.connect(out);
    o.start(now); o.stop(now + 0.09);

    const n = ac.createBufferSource();
    n.buffer = nb;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = (sprint ? 1150 : 780) * pitchVar;
    bp.Q.value = 1.3;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.072 * volMul, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    n.connect(bp); bp.connect(ng); ng.connect(out);
    n.start(now); n.stop(now + 0.085);
  }
}

export function playAuditoryPing(ac, dest) {
  if (!ac || !dest || ac.state !== 'running') return;
  const now = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(520, now);
  o.frequency.exponentialRampToValueAtTime(1180, now + 0.09);
  o.frequency.exponentialRampToValueAtTime(240, now + 0.26);
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.065, now + 0.025);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
  o.connect(g); g.connect(dest);
  o.start(now); o.stop(now + 0.28);
}

