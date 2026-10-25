// Web Audio API and Audio helper for Tasbih, Adzan chime, and Quran audio recitation

class SoundService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Play a realistic soft bead/wooden tasbih click
  playTasbihClick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // ignore
    }
  }

  // Play subtle milestone chime when target is reached (e.g. 33, 99)
  playTargetChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch {
      // ignore
    }
  }

  // Soft spiritual bell chime for prayer time test
  playAdzanChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const freqs = [440, 554.37, 659.25];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + i * 0.15;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.82);
      });
    } catch {
      // ignore
    }
  }

  // Haptic feedback trigger
  vibrate(ms: number = 25) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {
        // unsupported or restricted
      }
    }
  }
}

export const soundService = new SoundService();

// Reciters for Quran Murattal audio
export interface QariOption {
  id: string;
  name: string;
  subname: string;
  audioBaseUrl: string; // e.g. everyayah base url pattern or standard cdn
}

export const QARI_OPTIONS: QariOption[] = [
  {
    id: 'alafasy',
    name: 'Misyari Rasyid Al-Afasy',
    subname: 'Tartil Jelas & Merdu',
    audioBaseUrl: 'https://everyayah.com/data/Alafasy_128kbps',
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamidi',
    subname: 'Makhraj Tajwid Fasih',
    audioBaseUrl: 'https://everyayah.com/data/Ghamadi_40kbps',
  },
  {
    id: 'sudais',
    name: 'Abdurrahman As-Sudais',
    subname: 'Imam Masjidil Haram',
    audioBaseUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps',
  },
];

// Helper to construct exact ayah audio URL formatted as {surah3digits}{ayah3digits}.mp3
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, qariId: string = 'alafasy'): string {
  const qari = QARI_OPTIONS.find((q) => q.id === qariId) || QARI_OPTIONS[0];
  const sStr = surahNumber.toString().padStart(3, '0');
  const aStr = ayahNumber.toString().padStart(3, '0');
  return `${qari.audioBaseUrl}/${sStr}${aStr}.mp3`;
}
