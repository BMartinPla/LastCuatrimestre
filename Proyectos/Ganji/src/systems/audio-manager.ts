/**
 * Audio 100% procedural con WebAudio: SFX sintetizados y música ambiental en
 * escala Hirajoshi (japonesa). Sin assets ni dependencias de licencia.
 * El AudioContext se crea al primer gesto del usuario (política de autoplay).
 */

export type SfxName =
  | 'swing'
  | 'throw'
  | 'chime'
  | 'hit'
  | 'crit'
  | 'kill'
  | 'xp'
  | 'coin'
  | 'levelup'
  | 'hurt'
  | 'roar'
  | 'gameover'
  | 'victory';

const ROOT = 293.66; // Re4
const HIRAJOSHI = [0, 2, 3, 7, 8]; // semitonos: Re, Mi, Fa, La, Si bemol
const STEP_SEC = 0.14;
const MELODY_STEPS = new Set([0, 4, 6, 10, 12, 16, 20, 22, 26, 28]);

interface ToneOpts {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain: number;
  slideTo?: number;
  attack?: number;
  delay?: number;
}

interface NoiseOpts {
  dur: number;
  gain: number;
  filterFrom: number;
  filterTo?: number;
  filterType?: BiquadFilterType;
  delay?: number;
}

export class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = false;
  private seqStep = 0;
  private bar = 0;
  private nextStepTime = 0;
  private schedTimer: ReturnType<typeof setInterval> | null = null;

  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
        this.nextStepTime = this.ctx.currentTime + 0.1;
      }
      return;
    }
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 1;
    this.master.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.master);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.26;
    this.musicGain.connect(this.master);

    const len = Math.floor(this.ctx.sampleRate * 0.5);
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.startDrone();
    this.nextStepTime = this.ctx.currentTime + 0.15;
    this.schedTimer = setInterval(() => this.scheduleMusic(), 120);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, this.ctx.currentTime + 0.12);
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  destroy(): void {
    if (this.schedTimer !== null) clearInterval(this.schedTimer);
    void this.ctx?.close();
    this.ctx = null;
  }

  // ---------- SFX ----------

  play(name: SfxName, param = 0): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    switch (name) {
      case 'swing':
        this.noiseBurst({ dur: 0.13, gain: 0.22, filterFrom: 3200, filterTo: 700, filterType: 'bandpass' });
        break;
      case 'throw':
        this.noiseBurst({ dur: 0.08, gain: 0.15, filterFrom: 5200, filterTo: 2200, filterType: 'bandpass' });
        break;
      case 'chime':
        this.tone({ freq: 1318, dur: 0.22, type: 'sine', gain: 0.1, slideTo: 1568 });
        break;
      case 'hit':
        this.noiseBurst({ dur: 0.09, gain: 0.24, filterFrom: 900, filterTo: 300, filterType: 'lowpass' });
        this.tone({ freq: 180, dur: 0.09, type: 'triangle', gain: 0.22, slideTo: 90 });
        break;
      case 'crit':
        this.noiseBurst({ dur: 0.1, gain: 0.26, filterFrom: 1200, filterTo: 350, filterType: 'lowpass' });
        this.tone({ freq: 1046, dur: 0.16, type: 'sine', gain: 0.18, slideTo: 880 });
        break;
      case 'kill':
        this.tone({ freq: 520, dur: 0.13, type: 'square', gain: 0.13, slideTo: 240 });
        this.noiseBurst({ dur: 0.07, gain: 0.1, filterFrom: 1500, filterTo: 500, filterType: 'lowpass' });
        break;
      case 'xp': {
        const combo = Math.min(param, 12);
        const freq = 660 * Math.pow(2, combo / 12);
        this.tone({ freq, dur: 0.11, type: 'sine', gain: 0.12 });
        break;
      }
      case 'coin':
        this.tone({ freq: 988, dur: 0.07, type: 'sine', gain: 0.13 });
        this.tone({ freq: 1319, dur: 0.14, type: 'sine', gain: 0.13, delay: 0.07 });
        break;
      case 'levelup':
        [587, 698, 880, 1175].forEach((f, i) => {
          this.tone({ freq: f, dur: 0.18, type: 'triangle', gain: 0.16, delay: i * 0.07 });
        });
        break;
      case 'hurt':
        this.tone({ freq: 110, dur: 0.2, type: 'sawtooth', gain: 0.26, slideTo: 68 });
        this.noiseBurst({ dur: 0.12, gain: 0.16, filterFrom: 600, filterTo: 200, filterType: 'lowpass' });
        break;
      case 'roar':
        this.noiseBurst({ dur: 0.8, gain: 0.3, filterFrom: 420, filterTo: 90, filterType: 'lowpass' });
        this.tone({ freq: 65, dur: 0.7, type: 'sawtooth', gain: 0.3, slideTo: 44 });
        break;
      case 'gameover':
        [392, 311, 233, 196].forEach((f, i) => {
          this.tone({ freq: f, dur: 0.42, type: 'triangle', gain: 0.2, delay: i * 0.28 });
        });
        break;
      case 'victory':
        [587, 698, 880, 1175, 1397].forEach((f, i) => {
          this.tone({ freq: f, dur: 0.3, type: 'triangle', gain: 0.18, delay: i * 0.12 });
        });
        break;
    }
  }

  // ---------- Música ----------

  private scheduleMusic(): void {
    if (!this.ctx || this.ctx.state !== 'running' || !this.musicGain) return;
    let guard = 0;
    while (this.nextStepTime < this.ctx.currentTime + 0.35 && guard < 32) {
      this.playStep(this.nextStepTime);
      this.nextStepTime += STEP_SEC;
      this.seqStep += 1;
      if (this.seqStep >= 32) {
        this.seqStep = 0;
        this.bar += 1;
      }
      guard += 1;
    }
    if (guard >= 32) {
      this.nextStepTime = this.ctx.currentTime + 0.1;
    }
  }

  private playStep(t: number): void {
    if (!this.musicGain) return;
    if (!MELODY_STEPS.has(this.seqStep)) return;

    const idx = (this.bar * 3 + this.seqStep * 7) % HIRAJOSHI.length;
    const semi = HIRAJOSHI[idx] ?? 0;
    const octave = (this.bar + this.seqStep) % 7 === 0 ? 1 : 0;
    const freq = ROOT * Math.pow(2, (semi + octave * 12) / 12);
    this.pluck(freq, t, 0.16);

    if (this.seqStep === 0 || this.seqStep === 16) {
      const bass = ROOT * Math.pow(2, -24 / 12);
      this.pluck(bass, t, 0.1);
    }
  }

  private pluck(freq: number, t: number, gain: number): void {
    if (!this.ctx || !this.musicGain) return;
    const dur = 0.5;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 1.004;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(this.musicGain);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + dur + 0.05);
    osc2.stop(t + dur + 0.05);
  }

  private startDrone(): void {
    if (!this.ctx || !this.musicGain) return;
    const bass = ROOT * Math.pow(2, -24 / 12);
    for (const detune of [-3, 3]) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = bass;
      osc.detune.value = detune;
      const env = this.ctx.createGain();
      env.gain.value = 0.035;
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.08 + (detune > 0 ? 0.013 : 0);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.012;
      lfo.connect(lfoGain);
      lfoGain.connect(env.gain);
      osc.connect(env);
      env.connect(this.musicGain);
      osc.start();
      lfo.start();
    }
  }

  // ---------- Síntesis base ----------

  private tone(opts: ToneOpts): void {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const dur = opts.dur;
    const osc = this.ctx.createOscillator();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slideTo), t0 + dur);
    }
    const env = this.ctx.createGain();
    const attack = opts.attack ?? 0.005;
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(opts.gain, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  private noiseBurst(opts: NoiseOpts): void {
    if (!this.ctx || !this.sfxGain || !this.noiseBuffer) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = opts.filterType ?? 'bandpass';
    filter.frequency.setValueAtTime(opts.filterFrom, t0);
    if (opts.filterTo !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(30, opts.filterTo), t0 + opts.dur);
    }
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(opts.gain, t0);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.sfxGain);
    src.start(t0);
    src.stop(t0 + opts.dur + 0.03);
  }
}
