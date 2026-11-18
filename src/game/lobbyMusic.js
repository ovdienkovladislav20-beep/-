/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Atmospheric Lobby Background Music Generator for "НЕ ОБОРАЧИВАЙСЯ"
 * Synthesizes a haunting, gothic horror soundscape (crypt drones, cold wind, and eerie broken music box / bell melody)
 * using the Web Audio API with zero external asset dependencies.
 */

class LobbyMusicSystem {
  constructor() {
    this.ac = null;
    this.outputGain = null;
    this.mainGain = null;
    this.droneGain = null;
    this.melodyGain = null;
    this.windGain = null;
    this.isPlaying = false;
    this.isEnabled = true;
    this.volume = 0.75;
    this.droneNodes = [];
    this.melodyInterval = null;
    this.melodyIndex = 0;
    this.delayNode = null;
    this.feedbackNode = null;
    this.track = 'horror'; // 'horror' | 'christmas_horror'

    // Atmospheric horror motif notes in D minor / Harmonic minor (frequencies in Hz)
    this.horrorNotes = [
      { f: 146.83, dur: 2.2, v: 0.28 }, // D3
      { f: 174.61, dur: 2.0, v: 0.24 }, // F3
      { f: 220.00, dur: 2.5, v: 0.26 }, // A3
      { f: 233.08, dur: 1.8, v: 0.22 }, // Bb3
      { f: 277.18, dur: 2.6, v: 0.30 }, // C#4
      { f: 293.66, dur: 3.2, v: 0.32 }, // D4
      { f: 277.18, dur: 1.8, v: 0.22 }, // C#4
      { f: 233.08, dur: 2.2, v: 0.25 }, // Bb3
      { f: 220.00, dur: 2.8, v: 0.27 }, // A3
      { f: 174.61, dur: 2.4, v: 0.24 }, // F3
      { f: 138.59, dur: 3.8, v: 0.35 }, // C#3
    ];

    // Haunting Christmas-horror carol music box (F# minor broken celesta chimes)
    this.xmasHorrorNotes = [
      { f: 392.00, dur: 1.5, v: 0.25 }, // G4
      { f: 369.99, dur: 1.4, v: 0.24 }, // F#4
      { f: 392.00, dur: 1.4, v: 0.24 }, // G4
      { f: 329.63, dur: 2.2, v: 0.28 }, // E4
      { f: 392.00, dur: 1.5, v: 0.24 }, // G4
      { f: 369.99, dur: 1.4, v: 0.23 }, // F#4
      { f: 392.00, dur: 1.4, v: 0.24 }, // G4
      { f: 293.66, dur: 2.5, v: 0.30 }, // D4
      { f: 493.88, dur: 1.8, v: 0.22 }, // B4
      { f: 440.00, dur: 1.8, v: 0.24 }, // A4
      { f: 369.99, dur: 2.2, v: 0.26 }, // F#4
      { f: 246.94, dur: 3.2, v: 0.30 }, // B3 (cold eerie cadence)
    ];

    this.melodyNotes = this.horrorNotes;
  }

  setTrack(trackName = 'horror') {
    const next = trackName === 'christmas_horror' ? 'christmas_horror' : 'horror';
    if (this.track === next) return;
    this.track = next;
    this.melodyNotes = next === 'christmas_horror' ? this.xmasHorrorNotes : this.horrorNotes;
    this.melodyIndex = 0;
  }

  playLobbySfx(kind = 'click') {
    const ac = this.ac || (typeof window !== 'undefined' && (window.__horrorAc || null));
    if (!ac) return;
    try {
      if (ac.state === 'suspended') ac.resume();
      const now = ac.currentTime;
      const out = this.outputGain || ac.destination;
      const playBeep = (freq, startOff, dur, type = 'triangle', peak = 0.18, endFreq = null) => {
        const osc = ac.createOscillator();
        const gn = ac.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + startOff);
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + startOff + dur);
        gn.gain.setValueAtTime(0.001, now + startOff);
        gn.gain.linearRampToValueAtTime(peak, now + startOff + 0.015);
        gn.gain.exponentialRampToValueAtTime(0.0005, now + startOff + dur);
        osc.connect(gn);
        gn.connect(out);
        osc.start(now + startOff);
        osc.stop(now + startOff + dur + 0.03);
      };
      if (kind === 'promo_ok') {
        playBeep(523.25, 0, 0.14, 'triangle', 0.24);
        playBeep(659.25, 0.09, 0.16, 'triangle', 0.26);
        playBeep(783.99, 0.18, 0.18, 'sine', 0.28);
        playBeep(1046.5, 0.27, 0.38, 'triangle', 0.30);
      } else if (kind === 'promo_err') {
        playBeep(175, 0, 0.16, 'sawtooth', 0.22, 130);
        playBeep(140, 0.14, 0.26, 'sawtooth', 0.24, 95);
      } else if (kind === 'gift') {
        playBeep(587.33, 0, 0.12, 'sine', 0.22);
        playBeep(880, 0.08, 0.25, 'triangle', 0.24);
      } else if (kind === 'vote') {
        playBeep(440, 0, 0.09, 'sine', 0.16, 560);
      } else {
        playBeep(480, 0, 0.07, 'triangle', 0.12, 340);
      }
    } catch (e) {}
  }

  init(audioCtx, destinationNode, enabled = true, volume = 0.75) {
    if (this.ac) return;
    this.ac = audioCtx;
    this.isEnabled = enabled;
    this.volume = volume;

    try {
      // Main output gain for lobby music
      this.outputGain = this.ac.createGain();
      this.outputGain.gain.setValueAtTime(this.isEnabled ? this.volume : 0, this.ac.currentTime);

      if (destinationNode) {
        this.outputGain.connect(destinationNode);
      } else {
        this.outputGain.connect(this.ac.destination);
      }

      // Reverb / Echo simulation delay network for eerie cemetery depth
      this.delayNode = this.ac.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.42, this.ac.currentTime);

      this.feedbackNode = this.ac.createGain();
      this.feedbackNode.gain.setValueAtTime(0.48, this.ac.currentTime);

      const delayFilter = this.ac.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1400, this.ac.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.feedbackNode);
      this.feedbackNode.connect(this.delayNode);
      delayFilter.connect(this.outputGain);

      // Start sound sources
      this.startDrone();
      this.startWind();
      this.startMelody();

      this.isPlaying = true;
    } catch (e) {
      console.warn('Lobby music init error', e);
    }
  }

  startDrone() {
    if (!this.ac) return;
    this.droneGain = this.ac.createGain();
    this.droneGain.gain.setValueAtTime(0.18, this.ac.currentTime);
    this.droneGain.connect(this.outputGain);

    // Dark subterranean drone frequencies: D1 (36.71 Hz), A1 (55.00 Hz), D2 (73.42 Hz)
    const droneFreqs = [
      { f: 36.71, type: 'sine', pan: -0.2 },
      { f: 55.00, type: 'triangle', pan: 0.2 },
      { f: 73.42, type: 'sine', pan: 0 },
    ];

    droneFreqs.forEach((spec) => {
      try {
        const osc = this.ac.createOscillator();
        const filter = this.ac.createBiquadFilter();
        const gn = this.ac.createGain();

        osc.type = spec.type;
        osc.frequency.setValueAtTime(spec.f, this.ac.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, this.ac.currentTime);

        gn.gain.setValueAtTime(0.2, this.ac.currentTime);

        // Slow tremolo/throbbing (heartbeat of the void)
        const lfo = this.ac.createOscillator();
        const lfoGain = this.ac.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.18, this.ac.currentTime);
        lfoGain.gain.setValueAtTime(0.06, this.ac.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(gn.gain);
        lfo.start();

        osc.connect(filter);
        filter.connect(gn);
        gn.connect(this.droneGain);

        osc.start();
        this.droneNodes.push(osc, lfo);
      } catch (e) {}
    });
  }

  startWind() {
    if (!this.ac) return;
    try {
      // Wind generator using bandpass-filtered noise with slow resonant sweep
      const bufferSize = this.ac.sampleRate * 2;
      const noiseBuffer = this.ac.createBuffer(1, bufferSize, this.ac.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ac.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = this.ac.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320, this.ac.currentTime);
      bandpass.Q.setValueAtTime(3.5, this.ac.currentTime);

      this.windGain = this.ac.createGain();
      this.windGain.gain.setValueAtTime(0.09, this.ac.currentTime);

      // Modulate wind pitch and gain slowly
      const windLfo = this.ac.createOscillator();
      windLfo.type = 'sine';
      windLfo.frequency.setValueAtTime(0.09, this.ac.currentTime);

      const windLfoDepth = this.ac.createGain();
      windLfoDepth.gain.setValueAtTime(140, this.ac.currentTime);
      windLfo.connect(windLfoDepth);
      windLfoDepth.connect(bandpass.frequency);
      windLfo.start();

      whiteNoise.connect(bandpass);
      bandpass.connect(this.windGain);
      this.windGain.connect(this.outputGain);

      whiteNoise.start();
      this.droneNodes.push(whiteNoise, windLfo);
    } catch (e) {}
  }

  playMelodyNote(noteSpec) {
    if (!this.ac || !this.outputGain || !this.isEnabled) return;
    try {
      const now = this.ac.currentTime;
      const osc = this.ac.createOscillator();
      const oscHarmonic = this.ac.createOscillator();
      const noteGain = this.ac.createGain();
      const noteFilter = this.ac.createBiquadFilter();

      // Sound design: dark music box bell with slight metallic detune
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteSpec.f, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(noteSpec.f * 2.01, now); // slightly detuned octave

      noteFilter.type = 'lowpass';
      noteFilter.frequency.setValueAtTime(1600, now);
      noteFilter.frequency.exponentialRampToValueAtTime(300, now + noteSpec.dur);

      const vol = noteSpec.v * 0.45;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(vol, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + noteSpec.dur);

      osc.connect(noteFilter);
      oscHarmonic.connect(noteFilter);
      noteFilter.connect(noteGain);

      // Connect to dry output AND to the eerie delay line
      noteGain.connect(this.outputGain);
      if (this.delayNode) {
        noteGain.connect(this.delayNode);
      }

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + noteSpec.dur + 0.1);
      oscHarmonic.stop(now + noteSpec.dur + 0.1);
    } catch (e) {}
  }

  startMelody() {
    if (this.melodyInterval) return;

    this.melodyIndex = 0;
    this.melodyInterval = setInterval(() => {
      if (!this.ac || !this.isEnabled || !this.isPlaying) return;
      const list = this.melodyNotes && this.melodyNotes.length ? this.melodyNotes : this.horrorNotes;
      const note = list[this.melodyIndex % list.length];
      this.playMelodyNote(note);
      this.melodyIndex++;
    }, 2200);
  }

  updateState(state) {
    if (!this.ac || !this.outputGain) return;
    const now = this.ac.currentTime;

    // Only play in lobby / menu state! Fade out seamlessly during gameplay
    const shouldPlay = state === 'menu' && this.isEnabled;
    const targetGain = shouldPlay ? this.volume : 0;

    this.outputGain.gain.setTargetAtTime(targetGain, now, shouldPlay ? 0.8 : 0.25);
  }

  setEnabled(enabled) {
    this.isEnabled = Boolean(enabled);
    if (!this.ac || !this.outputGain) return;
    const now = this.ac.currentTime;
    const targetGain = this.isEnabled ? this.volume : 0;
    this.outputGain.gain.setTargetAtTime(targetGain, now, 0.2);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.ac || !this.outputGain || !this.isEnabled) return;
    this.outputGain.gain.setTargetAtTime(this.volume, this.ac.currentTime, 0.15);
  }

  stop() {
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    this.droneNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.droneNodes = [];
    this.isPlaying = false;
  }
}

export const lobbyMusic = new LobbyMusicSystem();
