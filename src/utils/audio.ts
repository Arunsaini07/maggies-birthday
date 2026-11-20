// High-fidelity Web Audio API synthesizer for a soothing, romantic vintage acoustic birthday waltz
class VintageMusicSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private currentStep: number = 0;
  private gainNode: GainNode | null = null;
  private volume: number = 0.6;

  // Romantic acoustic waltz progression in F Major / D Minor (nostalgic, gentle, celebratory)
  // [pitch (Hz), duration (sec), isBass]
  private melody: Array<[number, number, boolean]> = [
    // Measure 1
    [174.61, 0.8, true],  // F3 bass
    [349.23, 0.4, false], // F4
    [440.00, 0.4, false], // A4
    [523.25, 0.7, false], // C5
    // Measure 2
    [146.83, 0.8, true],  // D3 bass
    [349.23, 0.4, false], // F4
    [440.00, 0.4, false], // A4
    [587.33, 0.7, false], // D5
    // Measure 3
    [130.81, 0.8, true],  // C3 bass
    [329.63, 0.4, false], // E4
    [392.00, 0.4, false], // G4
    [523.25, 0.7, false], // C5
    // Measure 4 (Maggie's Motif)
    [174.61, 0.8, true],  // F3 bass
    [440.00, 0.4, false], // A4
    [523.25, 0.4, false], // C5
    [659.25, 0.8, false], // E5
    [698.46, 0.9, false], // F5 high warmth
    // Measure 5
    [220.00, 0.8, true],  // A3 bass
    [392.00, 0.4, false], // G4
    [440.00, 0.4, false], // A4
    [523.25, 0.7, false], // C5
    // Measure 6
    [116.54, 0.8, true],  // Bb2 bass
    [349.23, 0.4, false], // F4
    [466.16, 0.4, false], // Bb4
    [587.33, 0.8, false], // D5
    // Measure 7
    [130.81, 0.8, true],  // C3 bass
    [392.00, 0.4, false], // G4
    [523.25, 0.5, false], // C5
    [659.25, 0.7, false], // E5
    // Measure 8 resolve
    [174.61, 1.2, true],  // F3 bass
    [349.23, 0.6, false], // F4
    [440.00, 0.6, false], // A4
    [523.25, 1.4, false], // C5
  ];

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  public play() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.scheduleNextNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playTone(freq: number, duration: number, isBass: boolean) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Warm, soft acoustic timbre
    osc.type = isBass ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm envelope
    const now = this.ctx.currentTime;
    const peak = isBass ? 0.35 : 0.25;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(peak, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying) return;

    const [freq, dur, isBass] = this.melody[this.currentStep];
    this.playTone(freq, dur, isBass);

    this.currentStep = (this.currentStep + 1) % this.melody.length;
    // Step interval in ms
    const delay = dur * 600;
    this.timer = window.setTimeout(this.scheduleNextNote, delay);
  };

  public playPageTurnSound() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Soft paper rustle noise synthesis
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.14);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // Graceful fallback if audio is blocked
    }
  }
}

export const musicPlayer = new VintageMusicSynthesizer();

