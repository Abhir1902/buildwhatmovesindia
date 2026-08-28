let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

function beep(frequency: number, duration: number, type: OscillatorType, gain: number, delay = 0) {
  const c = audio();
  if (!c) return;
  void c.resume();
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t0);
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.0008, t0 + duration);
  osc.connect(amp);
  amp.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playClick() {
  beep(2100, 0.035, "square", 0.035);
}

export function playDueNotice() {
  beep(880, 0.09, "triangle", 0.06, 0);
  beep(1174, 0.16, "triangle", 0.05, 0.1);
}
