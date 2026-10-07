// Web Audio API Procedural Sound Synthesizer for W01F.EXE
// 100% lightweight procedural audio - no external assets required.

class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = true; // Default muted to respect browser autoplay policies; easily toggled by user!

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("w01f_audio_muted");
      if (saved !== null) {
        this.muted = saved === "true";
      } else {
        this.muted = false; // Enabled by default if user permits
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("w01f_audio_muted", String(muted));
      window.dispatchEvent(new CustomEvent("w01f_audio_change", { detail: { muted } }));
      if (!muted) {
        this.playAccessGranted();
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public playHover() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(680, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public playClick() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Ignore
    }
  }

  public playTerminalKey() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Subtle mechanical click
      osc.type = "square";
      osc.frequency.setValueAtTime(320 + Math.random() * 100, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {
      // Ignore
    }
  }

  public playAccessGranted() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.04, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.16);
      });
    } catch {
      // Ignore
    }
  }

  public playTrophyFanfare() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = [440, 554.37, 659.25, 880];

      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + i * 0.08 + 0.4);

        gain.gain.setValueAtTime(0.05, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.55);
      });
    } catch {
      // Ignore
    }
  }

  public playRadarPing() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch {
      // Ignore
    }
  }
}

export const cyberAudio = new CyberAudioEngine();
