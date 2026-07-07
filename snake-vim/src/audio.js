import { CONFIG } from "./config.js";

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTone({ frequency = 440, type = "sine", duration = 0.12, volume = 0.15 }) {
    if (!this.enabled) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  eat() {
    this.playTone({ frequency: 880, type: "triangle", duration: 0.1, volume: 0.12 });
    setTimeout(() => this.playTone({ frequency: 1320, type: "triangle", duration: 0.12, volume: 0.1 }), 60);
  }

  move() {
    this.playTone({ frequency: 220, type: "sine", duration: 0.04, volume: 0.04 });
  }

  gameOver() {
    this.playTone({ frequency: 300, type: "sawtooth", duration: 0.3, volume: 0.15 });
    setTimeout(() => this.playTone({ frequency: 200, type: "sawtooth", duration: 0.4, volume: 0.15 }), 250);
    setTimeout(() => this.playTone({ frequency: 100, type: "sawtooth", duration: 0.6, volume: 0.15 }), 550);
  }

  levelUp() {
    this.playTone({ frequency: 660, type: "square", duration: 0.1, volume: 0.1 });
    setTimeout(() => this.playTone({ frequency: 880, type: "square", duration: 0.15, volume: 0.1 }), 120);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
