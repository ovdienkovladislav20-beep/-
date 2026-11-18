// Spatial Vintage Garage Radio synthesizer playing Piggy: Book 2 - Duocara's Theme (procedural).
// Includes analog radio speaker bandpass coloration, warm distortion, tape hiss, distance rolloff, and stereo panning.

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// D minor / harmonic minor mechanical music-box & bass motif inspired by Duocara's chase theme
// Step timing at ~138 BPM (16th notes)
const MELODY_NOTES = [
  587.33, 0, 698.46, 0, 880.0, 0, 932.33, 880.0,
  783.99, 0, 698.46, 0, 659.25, 0, 554.37, 0,
  587.33, 0, 880.0, 0, 1174.66, 0, 1108.73, 1174.66,
  1046.5, 932.33, 880.0, 783.99, 698.46, 659.25, 554.37, 0,
];

const BELL_HARMONY = [
  0, 440.0, 0, 523.25, 0, 587.33, 0, 554.37,
  0, 466.16, 0, 440.0, 0, 392.0, 0, 440.0,
  0, 587.33, 0, 698.46, 0, 880.0, 0, 830.61,
  0, 783.99, 0, 698.46, 0, 587.33, 554.37, 0,
];

const BASS_PULSE = [
  146.83, 0, 146.83, 0, 174.61, 0, 146.83, 0,
  155.56, 0, 155.56, 0, 138.59, 0, 146.83, 0,
  146.83, 0, 220.0, 0, 174.61, 0, 155.56, 0,
  146.83, 0, 138.59, 0, 110.0, 0, 138.59, 0,
];

export function createDuocaraRadio() {
  let enabled = true;
  let playing = false;
  let acRef = null;
  let radioBus = null;
  let speakerGain = null;
  let doorFilter = null;
  let panner = null;
  let hissSrc = null;
  let timer = null;
  let step = 0;
  let nextNoteAt = 0;
  let distFactor = 0;

  function ensureChain(ac, nb, dest) {
    if (!ac || !dest || radioBus) return;
    acRef = ac;

    // Vintage radio chain: preBus -> WaveShaper -> Highpass(320Hz) -> Lowpass(2750Hz) -> doorFilter -> panner -> speakerGain -> dest
    radioBus = ac.createGain();
    radioBus.gain.value = 0.82;

    const shaper = ac.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      curve[i] = Math.tanh(x * 2.1);
    }
    shaper.curve = curve;

    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 310;

    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2850;
    lp.Q.value = 1.6;

    doorFilter = ac.createBiquadFilter();
    doorFilter.type = 'lowpass';
    doorFilter.frequency.value = 3200;

    speakerGain = ac.createGain();
    speakerGain.gain.value = 0.0001;

    if (typeof ac.createStereoPanner === 'function') {
      panner = ac.createStereoPanner();
      panner.pan.value = 0;
      radioBus.connect(shaper);
      shaper.connect(hp);
      hp.connect(lp);
      lp.connect(doorFilter);
      doorFilter.connect(panner);
      panner.connect(speakerGain);
    } else {
      radioBus.connect(shaper);
      shaper.connect(hp);
      hp.connect(lp);
      lp.connect(doorFilter);
      doorFilter.connect(speakerGain);
    }
    speakerGain.connect(dest);

    // Subtle analog radio crackle/static noise bed
    if (nb) {
      hissSrc = ac.createBufferSource();
      hissSrc.buffer = nb;
      hissSrc.loop = true;
      const hBp = ac.createBiquadFilter();
      hBp.type = 'bandpass';
      hBp.frequency.value = 2100;
      hBp.Q.value = 0.85;
      const hGain = ac.createGain();
      hGain.gain.value = 0.042;
      hissSrc.connect(hBp);
      hBp.connect(hGain);
      hGain.connect(radioBus);
      hissSrc.start();
    }
  }

  function triggerChime(t, freq, dur, vol, wave = 'triangle') {
    if (!acRef || !radioBus || !freq) return;
    const osc = acRef.createOscillator();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t);
    // Subtle mechanical pitch wow/flutter on old radio tape
    osc.frequency.linearRampToValueAtTime(freq * (0.996 + (step % 3) * 0.002), t + dur);

    const g = acRef.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g);
    g.connect(radioBus);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function triggerTick(t, accent) {
    if (!acRef || !radioBus) return;
    const o = acRef.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(accent ? 1320 : 880, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.032);
    const g = acRef.createGain();
    g.gain.setValueAtTime(accent ? 0.075 : 0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    o.connect(g);
    g.connect(radioBus);
    o.start(t);
    o.stop(t + 0.04);
  }

  function scheduleStep(sIdx, t) {
    const idx = sIdx % MELODY_NOTES.length;
    const mel = MELODY_NOTES[idx];
    const harm = BELL_HARMONY[idx];
    const bass = BASS_PULSE[idx];

    if (mel > 0) {
      triggerChime(t, mel, 0.24, 0.22, 'triangle');
      triggerChime(t, mel * 2, 0.14, 0.07, 'sine');
    }
    if (harm > 0) {
      triggerChime(t, harm, 0.18, 0.11, 'sine');
    }
    if (bass > 0) {
      triggerChime(t, bass, 0.22, 0.28, 'sawtooth');
    }
    if (sIdx % 2 === 0) {
      triggerTick(t, sIdx % 4 === 0);
    }
  }

  function startSequencer() {
    if (timer || !acRef) return;
    nextNoteAt = acRef.currentTime + 0.06;
    const stepSec = 60 / 138 / 4;
    timer = setInterval(() => {
      if (!acRef || !playing || !enabled) return;
      if (acRef.state !== 'running') return;
      while (nextNoteAt < acRef.currentTime + 0.22) {
        if (distFactor > 0.015) {
          scheduleStep(step, nextNoteAt);
        }
        nextNoteAt += stepSec;
        step++;
      }
    }, 55);
  }

  function stopSequencer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function update({ ac, nb, dest, active, px, py, pa, rx, ry, indoor }) {
    if (!active || !enabled) {
      playing = false;
      if (speakerGain && acRef) {
        speakerGain.gain.setTargetAtTime(0.0001, acRef.currentTime, 0.08);
      }
      distFactor = 0;
      return;
    }
    if (!ac || !dest) return;
    ensureChain(ac, nb, dest);
    playing = true;
    startSequencer();

    const dist = Math.hypot(rx - px, ry - py);
    const maxDist = 14.5;
    let atten = Math.max(0, 1 - dist / maxDist);
    atten = atten * atten;
    if (!indoor) atten *= 0.42;

    distFactor = atten;
    const targetVol = Math.max(0.0001, atten * 0.65);
    if (speakerGain) {
      speakerGain.gain.setTargetAtTime(targetVol, ac.currentTime, 0.08);
    }
    if (doorFilter) {
      doorFilter.frequency.setTargetAtTime(indoor ? 3200 : 1150, ac.currentTime, 0.1);
    }
    if (panner) {
      const ang = Math.atan2(ry - py, rx - px);
      let diff = ang - pa;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      panner.pan.setTargetAtTime(clamp(Math.sin(diff), -0.95, 0.95), ac.currentTime, 0.06);
    }
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  function setEnabled(v) {
    enabled = !!v;
  }

  function isEnabled() {
    return enabled;
  }

  function destroy() {
    stopSequencer();
    playing = false;
    try { hissSrc && hissSrc.stop(); } catch (e) {}
    try { speakerGain && speakerGain.disconnect(); } catch (e) {}
    hissSrc = null;
    radioBus = null;
    speakerGain = null;
    doorFilter = null;
    panner = null;
  }

  return { update, toggle, setEnabled, isEnabled, destroy };
}
