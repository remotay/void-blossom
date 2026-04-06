/**
 * AudioGenerator.ts - Void Blossom Runtime Audio System
 *
 * Generates all game sound effects at runtime using the Web Audio API.
 * No external audio files required. All sounds are synthesized from
 * oscillators, noise buffers, and gain envelopes.
 */

// Musical note frequencies (Hz)
const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, E6: 1318.5, G6: 1567.98,
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private activeMusicNodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private musicInterval: number | null = null;
  private initialized = false;

  private _masterVolume = 0.7;
  private _sfxVolume = 0.8;
  private _musicVolume = 0.4;

  // ── Initialization ──────────────────────────────────────────────

  init(): void {
    if (this.initialized) return;

    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Master → destination
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._masterVolume;
    this.masterGain.connect(this.ctx.destination);

    // SFX → master
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this._sfxVolume;
    this.sfxGain.connect(this.masterGain);

    // Music → master
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this._musicVolume;
    this.musicGain.connect(this.masterGain);

    // Pre-generate white noise buffer (2 seconds)
    this.noiseBuffer = this.createNoiseBuffer(2);

    this.initialized = true;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx!.state === 'suspended') {
      this.ctx!.resume();
    }
    return this.ctx!;
  }

  // ── Volume Controls ─────────────────────────────────────────────

  get masterVolume(): number { return this._masterVolume; }
  set masterVolume(v: number) {
    this._masterVolume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this._masterVolume, this.ctx!.currentTime);
    }
  }

  get sfxVolume(): number { return this._sfxVolume; }
  set sfxVolume(v: number) {
    this._sfxVolume = Math.max(0, Math.min(1, v));
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this._sfxVolume, this.ctx!.currentTime);
    }
  }

  get musicVolume(): number { return this._musicVolume; }
  set musicVolume(v: number) {
    this._musicVolume = Math.max(0, Math.min(1, v));
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this._musicVolume, this.ctx!.currentTime);
    }
  }

  // ── Utility Helpers ─────────────────────────────────────────────

  private createNoiseBuffer(durationSec: number): AudioBuffer {
    const ctx = this.ensureContext();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * durationSec;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private createNoiseSource(): AudioBufferSourceNode {
    const ctx = this.ensureContext();
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    return source;
  }

  private createOsc(
    type: OscillatorType,
    freq: number,
    dest: AudioNode,
  ): OscillatorNode {
    const ctx = this.ensureContext();
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(dest);
    return osc;
  }

  private createGain(value: number, dest: AudioNode): GainNode {
    const ctx = this.ensureContext();
    const gain = ctx.createGain();
    gain.gain.value = value;
    gain.connect(dest);
    return gain;
  }

  private createFilter(
    type: BiquadFilterType,
    freq: number,
    q: number,
    dest: AudioNode,
  ): BiquadFilterNode {
    const ctx = this.ensureContext();
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    filter.connect(dest);
    return filter;
  }

  private now(): number {
    return this.ensureContext().currentTime;
  }

  // ── Sound Effects ───────────────────────────────────────────────

  /**
   * Player shot: crisp high-pitched "pew" - sine wave sweeping 1200Hz → 400Hz in ~50ms
   */
  playShot(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    const gain = this.createGain(0, this.sfxGain!);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    const osc = this.createOsc('sine', 1200, gain);
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    osc.start(t);
    osc.stop(t + 0.06);

    // Add a subtle click layer for crispness
    const clickGain = this.createGain(0, this.sfxGain!);
    clickGain.gain.setValueAtTime(0.15, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    const clickOsc = this.createOsc('square', 2400, clickGain);
    clickOsc.start(t);
    clickOsc.stop(t + 0.02);
  }

  /**
   * Enemy shot: lower, slightly menacing blip
   */
  playEnemyShot(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    const gain = this.createGain(0, this.sfxGain!);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    const osc = this.createOsc('sawtooth', 600, gain);
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.07);
    osc.start(t);
    osc.stop(t + 0.08);

    // Low sub layer
    const subGain = this.createGain(0, this.sfxGain!);
    subGain.gain.setValueAtTime(0.1, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    const sub = this.createOsc('sine', 150, subGain);
    sub.start(t);
    sub.stop(t + 0.06);
  }

  /**
   * Hit on enemy: punchy impact with noise burst + sine thud
   */
  playHit(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // Noise burst through bandpass filter
    const noiseGain = this.createGain(0, this.sfxGain!);
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    const filter = this.createFilter('bandpass', 3000, 1.5, noiseGain);

    const noise = this.createNoiseSource();
    noise.connect(filter);
    noise.start(t);
    noise.stop(t + 0.08);

    // Sine thud
    const thudGain = this.createGain(0, this.sfxGain!);
    thudGain.gain.setValueAtTime(0.3, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    const thud = this.createOsc('sine', 200, thudGain);
    thud.frequency.setValueAtTime(200, t);
    thud.frequency.exponentialRampToValueAtTime(80, t + 0.08);
    thud.start(t);
    thud.stop(t + 0.1);
  }

  /**
   * Graze: subtle high shimmer, tiny bell/chime ~100ms
   */
  playGraze(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // High sine shimmer
    const gain = this.createGain(0, this.sfxGain!);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    const osc = this.createOsc('sine', 3000, gain);
    osc.frequency.setValueAtTime(3000, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.08);
    osc.start(t);
    osc.stop(t + 0.1);

    // Harmonic overtone
    const hGain = this.createGain(0, this.sfxGain!);
    hGain.gain.setValueAtTime(0.06, t);
    hGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    const hOsc = this.createOsc('sine', 4500, hGain);
    hOsc.start(t);
    hOsc.stop(t + 0.08);
  }

  /**
   * Pickup collected: bright ascending arpeggio C5-E5-G5 in quick succession
   */
  playPickup(): void {
    const ctx = this.ensureContext();
    const t = this.now();
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
    const spacing = 0.04; // 40ms apart
    const noteDuration = 0.1;

    notes.forEach((freq, i) => {
      const noteStart = t + i * spacing;

      const gain = this.createGain(0, this.sfxGain!);
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      const osc = this.createOsc('sine', freq, gain);
      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);

      // Slight triangle layer for shimmer
      const shimGain = this.createGain(0, this.sfxGain!);
      shimGain.gain.setValueAtTime(0.001, noteStart);
      shimGain.gain.linearRampToValueAtTime(0.08, noteStart + 0.005);
      shimGain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      const shim = this.createOsc('triangle', freq * 2, shimGain);
      shim.start(noteStart);
      shim.stop(noteStart + noteDuration);
    });
  }

  /**
   * Bomb activation: deep bass sweep up + noise explosion ~500ms
   */
  playBomb(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // Bass sweep up
    const bassGain = this.createGain(0, this.sfxGain!);
    bassGain.gain.setValueAtTime(0.4, t);
    bassGain.gain.setValueAtTime(0.4, t + 0.2);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    const bass = this.createOsc('sine', 40, bassGain);
    bass.frequency.setValueAtTime(40, t);
    bass.frequency.exponentialRampToValueAtTime(300, t + 0.3);
    bass.frequency.exponentialRampToValueAtTime(60, t + 0.5);
    bass.start(t);
    bass.stop(t + 0.5);

    // Noise explosion
    const noiseGain = this.createGain(0, this.sfxGain!);
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.5, t + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    const lpFilter = this.createFilter('lowpass', 2000, 1, noiseGain);
    lpFilter.frequency.setValueAtTime(2000, t);
    lpFilter.frequency.exponentialRampToValueAtTime(200, t + 0.5);

    const noise = this.createNoiseSource();
    noise.connect(lpFilter);
    noise.start(t);
    noise.stop(t + 0.5);

    // Distorted square punch
    const punchGain = this.createGain(0, this.sfxGain!);
    punchGain.gain.setValueAtTime(0.2, t);
    punchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    const punch = this.createOsc('square', 80, punchGain);
    punch.frequency.setValueAtTime(80, t);
    punch.frequency.exponentialRampToValueAtTime(30, t + 0.15);
    punch.start(t);
    punch.stop(t + 0.15);
  }

  /**
   * Explosion: noise burst with low resonance ~300ms
   */
  playExplosion(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // Filtered noise burst
    const noiseGain = this.createGain(0, this.sfxGain!);
    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    const lpFilter = this.createFilter('lowpass', 1500, 2, noiseGain);
    lpFilter.frequency.setValueAtTime(1500, t);
    lpFilter.frequency.exponentialRampToValueAtTime(100, t + 0.3);

    const noise = this.createNoiseSource();
    noise.connect(lpFilter);
    noise.start(t);
    noise.stop(t + 0.3);

    // Low sine body
    const bodyGain = this.createGain(0, this.sfxGain!);
    bodyGain.gain.setValueAtTime(0.35, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    const body = this.createOsc('sine', 100, bodyGain);
    body.frequency.setValueAtTime(100, t);
    body.frequency.exponentialRampToValueAtTime(30, t + 0.25);
    body.start(t);
    body.stop(t + 0.25);

    // Mid crunch layer
    const crunchGain = this.createGain(0, this.sfxGain!);
    crunchGain.gain.setValueAtTime(0.15, t);
    crunchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    const crunch = this.createOsc('sawtooth', 300, crunchGain);
    crunch.frequency.setValueAtTime(300, t);
    crunch.frequency.exponentialRampToValueAtTime(50, t + 0.12);
    crunch.start(t);
    crunch.stop(t + 0.12);
  }

  /**
   * Boss phase transition: dramatic deep boom + ascending tone ~800ms
   */
  playBossPhase(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // Deep boom
    const boomGain = this.createGain(0, this.sfxGain!);
    boomGain.gain.setValueAtTime(0.5, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    const boom = this.createOsc('sine', 60, boomGain);
    boom.frequency.setValueAtTime(60, t);
    boom.frequency.exponentialRampToValueAtTime(20, t + 0.6);
    boom.start(t);
    boom.stop(t + 0.8);

    // Noise impact
    const noiseGain = this.createGain(0, this.sfxGain!);
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    const filter = this.createFilter('lowpass', 800, 3, noiseGain);
    filter.frequency.exponentialRampToValueAtTime(50, t + 0.4);

    const noise = this.createNoiseSource();
    noise.connect(filter);
    noise.start(t);
    noise.stop(t + 0.4);

    // Ascending dramatic tone (starts after 0.2s)
    const toneGain = this.createGain(0, this.sfxGain!);
    toneGain.gain.setValueAtTime(0.001, t + 0.15);
    toneGain.gain.linearRampToValueAtTime(0.25, t + 0.3);
    toneGain.gain.setValueAtTime(0.25, t + 0.6);
    toneGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    const tone = this.createOsc('triangle', 200, toneGain);
    tone.frequency.setValueAtTime(200, t + 0.15);
    tone.frequency.exponentialRampToValueAtTime(800, t + 0.7);
    tone.start(t + 0.15);
    tone.stop(t + 0.8);

    // High harmonic shimmer
    const shimGain = this.createGain(0, this.sfxGain!);
    shimGain.gain.setValueAtTime(0.001, t + 0.3);
    shimGain.gain.linearRampToValueAtTime(0.1, t + 0.45);
    shimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    const shim = this.createOsc('sine', 600, shimGain);
    shim.frequency.setValueAtTime(600, t + 0.3);
    shim.frequency.exponentialRampToValueAtTime(2000, t + 0.75);
    shim.start(t + 0.3);
    shim.stop(t + 0.8);
  }

  /**
   * Warning/boss incoming: low pulsing alarm, 3 pulses
   */
  playWarning(): void {
    const ctx = this.ensureContext();
    const t = this.now();
    const pulseDuration = 0.18;
    const pulseGap = 0.12;

    for (let i = 0; i < 3; i++) {
      const pulseStart = t + i * (pulseDuration + pulseGap);

      const gain = this.createGain(0, this.sfxGain!);
      gain.gain.setValueAtTime(0.001, pulseStart);
      gain.gain.linearRampToValueAtTime(0.3, pulseStart + 0.02);
      gain.gain.setValueAtTime(0.3, pulseStart + pulseDuration - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseStart + pulseDuration);

      const osc = this.createOsc('square', 180, gain);
      osc.start(pulseStart);
      osc.stop(pulseStart + pulseDuration);

      // Sub bass layer
      const subGain = this.createGain(0, this.sfxGain!);
      subGain.gain.setValueAtTime(0.001, pulseStart);
      subGain.gain.linearRampToValueAtTime(0.2, pulseStart + 0.02);
      subGain.gain.setValueAtTime(0.2, pulseStart + pulseDuration - 0.03);
      subGain.gain.exponentialRampToValueAtTime(0.001, pulseStart + pulseDuration);

      const sub = this.createOsc('sine', 90, subGain);
      sub.start(pulseStart);
      sub.stop(pulseStart + pulseDuration);
    }
  }

  /**
   * Menu confirm: bright short two-tone ascending
   */
  playUIConfirm(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // First tone
    const g1 = this.createGain(0, this.sfxGain!);
    g1.gain.setValueAtTime(0.2, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    const o1 = this.createOsc('sine', NOTE.E5, g1);
    o1.start(t);
    o1.stop(t + 0.08);

    // Second tone (higher)
    const g2 = this.createGain(0, this.sfxGain!);
    g2.gain.setValueAtTime(0.001, t + 0.06);
    g2.gain.linearRampToValueAtTime(0.2, t + 0.065);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    const o2 = this.createOsc('sine', NOTE.A5, g2);
    o2.start(t + 0.06);
    o2.stop(t + 0.14);
  }

  /**
   * Menu cancel: short descending tone
   */
  playUICancel(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    const gain = this.createGain(0, this.sfxGain!);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    const osc = this.createOsc('sine', NOTE.A5, gain);
    osc.frequency.setValueAtTime(NOTE.A5, t);
    osc.frequency.exponentialRampToValueAtTime(NOTE.E4, t + 0.1);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  /**
   * Menu cursor move: very subtle tick
   */
  playUIMove(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    const gain = this.createGain(0, this.sfxGain!);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    const osc = this.createOsc('sine', 1800, gain);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  /**
   * Player death: dramatic descending crash ~600ms
   */
  playDeath(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // Descending main tone
    const toneGain = this.createGain(0, this.sfxGain!);
    toneGain.gain.setValueAtTime(0.4, t);
    toneGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    const tone = this.createOsc('sawtooth', 800, toneGain);
    tone.frequency.setValueAtTime(800, t);
    tone.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    tone.start(t);
    tone.stop(t + 0.6);

    // Noise crash
    const noiseGain = this.createGain(0, this.sfxGain!);
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    const filter = this.createFilter('lowpass', 4000, 1, noiseGain);
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.5);

    const noise = this.createNoiseSource();
    noise.connect(filter);
    noise.start(t);
    noise.stop(t + 0.5);

    // Sub bass thud
    const subGain = this.createGain(0, this.sfxGain!);
    subGain.gain.setValueAtTime(0.35, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    const sub = this.createOsc('sine', 80, subGain);
    sub.frequency.exponentialRampToValueAtTime(20, t + 0.35);
    sub.start(t);
    sub.stop(t + 0.4);

    // Dissonant high scrape
    const scrapeGain = this.createGain(0, this.sfxGain!);
    scrapeGain.gain.setValueAtTime(0.15, t);
    scrapeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    const scrape = this.createOsc('square', 1200, scrapeGain);
    scrape.frequency.setValueAtTime(1200, t);
    scrape.frequency.exponentialRampToValueAtTime(80, t + 0.3);
    scrape.start(t);
    scrape.stop(t + 0.3);
  }

  /**
   * Continue/respawn: hopeful ascending tone
   */
  playContinue(): void {
    const ctx = this.ensureContext();
    const t = this.now();
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5];
    const spacing = 0.08;
    const dur = 0.2;

    notes.forEach((freq, i) => {
      const start = t + i * spacing;

      const gain = this.createGain(0, this.sfxGain!);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.01);
      gain.gain.setValueAtTime(0.22, start + dur * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      const osc = this.createOsc('triangle', freq, gain);
      osc.start(start);
      osc.stop(start + dur);

      // Soft sine doubling
      const sGain = this.createGain(0, this.sfxGain!);
      sGain.gain.setValueAtTime(0.001, start);
      sGain.gain.linearRampToValueAtTime(0.1, start + 0.01);
      sGain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      const sOsc = this.createOsc('sine', freq * 2, sGain);
      sOsc.start(start);
      sOsc.stop(start + dur);
    });
  }

  /**
   * Stage clear: triumphant short fanfare, ascending chord
   */
  playStageClear(): void {
    const ctx = this.ensureContext();
    const t = this.now();

    // Chord 1: C major (C5, E5, G5)
    const chord1 = [NOTE.C5, NOTE.E5, NOTE.G5];
    const chord1Start = t;
    const chord1Dur = 0.25;

    chord1.forEach((freq) => {
      const gain = this.createGain(0, this.sfxGain!);
      gain.gain.setValueAtTime(0.001, chord1Start);
      gain.gain.linearRampToValueAtTime(0.18, chord1Start + 0.01);
      gain.gain.setValueAtTime(0.18, chord1Start + chord1Dur * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, chord1Start + chord1Dur);

      const osc = this.createOsc('triangle', freq, gain);
      osc.start(chord1Start);
      osc.stop(chord1Start + chord1Dur);
    });

    // Chord 2: higher C major (C6, E6, G6)
    const chord2 = [NOTE.C6, NOTE.E6, NOTE.G6];
    const chord2Start = t + 0.2;
    const chord2Dur = 0.5;

    chord2.forEach((freq) => {
      const gain = this.createGain(0, this.sfxGain!);
      gain.gain.setValueAtTime(0.001, chord2Start);
      gain.gain.linearRampToValueAtTime(0.22, chord2Start + 0.01);
      gain.gain.setValueAtTime(0.22, chord2Start + chord2Dur * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, chord2Start + chord2Dur);

      const osc = this.createOsc('sine', freq, gain);
      osc.start(chord2Start);
      osc.stop(chord2Start + chord2Dur);
    });

    // Shimmering high tone
    const shimGain = this.createGain(0, this.sfxGain!);
    shimGain.gain.setValueAtTime(0.001, t + 0.25);
    shimGain.gain.linearRampToValueAtTime(0.08, t + 0.3);
    shimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    const shim = this.createOsc('sine', NOTE.C6 * 2, shimGain);
    shim.start(t + 0.25);
    shim.stop(t + 0.7);
  }

  // ── Music ───────────────────────────────────────────────────────

  /**
   * Simple looping bass-heavy beat pattern using oscillators.
   * Creates a dark, driving rhythm suitable for boss encounters.
   */
  playBossMusic(): void {
    this.stopMusic();

    const ctx = this.ensureContext();
    const bpm = 140;
    const beatDur = 60 / bpm; // ~0.43s per beat
    const patternLength = 8; // 8 beats per loop

    let beatIndex = 0;

    const playBeat = () => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const beat = beatIndex % patternLength;

      // Kick on beats 0, 2, 4, 6 (four-on-the-floor)
      if (beat % 2 === 0) {
        const kickGain = this.createGain(0, this.musicGain!);
        kickGain.gain.setValueAtTime(0.4, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        const kick = this.createOsc('sine', 150, kickGain);
        kick.frequency.setValueAtTime(150, t);
        kick.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        kick.start(t);
        kick.stop(t + 0.15);

        // Kick click
        const clickGain = this.createGain(0, this.musicGain!);
        clickGain.gain.setValueAtTime(0.2, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        const clickNoise = this.createNoiseSource();
        const clickFilter = this.createFilter('highpass', 3000, 1, clickGain);
        clickNoise.connect(clickFilter);
        clickNoise.start(t);
        clickNoise.stop(t + 0.02);
      }

      // Hi-hat on every beat, open on odd beats
      const hatGain = this.createGain(0, this.musicGain!);
      const hatDur = beat % 2 === 1 ? 0.12 : 0.04;
      hatGain.gain.setValueAtTime(beat % 2 === 1 ? 0.08 : 0.06, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + hatDur);

      const hatFilter = this.createFilter('highpass', 8000, 2, hatGain);
      const hat = this.createNoiseSource();
      hat.connect(hatFilter);
      hat.start(t);
      hat.stop(t + hatDur);

      // Bass line pattern (dark minor feel)
      const bassNotes = [55, 55, 0, 65.41, 55, 0, 73.42, 65.41]; // A1, A1, -, C2, A1, -, D2, C2
      const bassFreq = bassNotes[beat];
      if (bassFreq > 0) {
        const bassGain = this.createGain(0, this.musicGain!);
        bassGain.gain.setValueAtTime(0.001, t);
        bassGain.gain.linearRampToValueAtTime(0.2, t + 0.01);
        bassGain.gain.setValueAtTime(0.2, t + beatDur * 0.6);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + beatDur * 0.9);

        const bass = this.createOsc('sawtooth', bassFreq, bassGain);
        bass.start(t);
        bass.stop(t + beatDur * 0.9);

        // Sub bass
        const subGain = this.createGain(0, this.musicGain!);
        subGain.gain.setValueAtTime(0.001, t);
        subGain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + beatDur * 0.8);

        const sub = this.createOsc('sine', bassFreq, subGain);
        sub.start(t);
        sub.stop(t + beatDur * 0.8);
      }

      // Eerie pad every 4 beats
      if (beat === 0) {
        const padDur = beatDur * 4;
        const padFreqs = [220, 261.63, 329.63]; // A3, C4, E4 (A minor)

        padFreqs.forEach((freq) => {
          const padGain = this.createGain(0, this.musicGain!);
          padGain.gain.setValueAtTime(0.001, t);
          padGain.gain.linearRampToValueAtTime(0.04, t + padDur * 0.3);
          padGain.gain.setValueAtTime(0.04, t + padDur * 0.7);
          padGain.gain.exponentialRampToValueAtTime(0.001, t + padDur);

          const pad = this.createOsc('triangle', freq, padGain);
          pad.start(t);
          pad.stop(t + padDur);
        });
      }

      beatIndex++;
    };

    // Play first beat immediately and schedule subsequent beats
    playBeat();
    this.musicInterval = window.setInterval(playBeat, beatDur * 1000);
  }

  /**
   * Stop any looping audio (music)
   */
  stopMusic(): void {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    // Clean up any active music oscillators
    this.activeMusicNodes.forEach((node) => {
      try { node.stop(); } catch (_) { /* already stopped */ }
    });
    this.activeMusicNodes = [];
  }

  // ── Play by Name ────────────────────────────────────────────────

  /**
   * Play a sound effect by its string name.
   * Useful for data-driven sound triggers.
   */
  play(name: string): void {
    const methods: Record<string, () => void> = {
      shot: () => this.playShot(),
      enemyShot: () => this.playEnemyShot(),
      hit: () => this.playHit(),
      graze: () => this.playGraze(),
      pickup: () => this.playPickup(),
      bomb: () => this.playBomb(),
      explosion: () => this.playExplosion(),
      bossPhase: () => this.playBossPhase(),
      warning: () => this.playWarning(),
      uiConfirm: () => this.playUIConfirm(),
      uiCancel: () => this.playUICancel(),
      uiMove: () => this.playUIMove(),
      death: () => this.playDeath(),
      continue: () => this.playContinue(),
      stageClear: () => this.playStageClear(),
      bossMusic: () => this.playBossMusic(),
    };

    const fn = methods[name];
    if (fn) fn();
  }
}

/** Singleton audio manager instance */
export const audioManager = new AudioManager();
export { AudioManager };
