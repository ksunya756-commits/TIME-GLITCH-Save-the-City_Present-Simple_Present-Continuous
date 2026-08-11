import { loadSettings, saveSettings } from "./storage.js";

let context = null;
let unlocked = false;
let enabled = loadSettings().soundEnabled !== false;
let lastFootstep = 0;

const tones = {
  hover: [520, .025, "sine", .025],
  click: [390, .05, "triangle", .035],
  taskOpen: [430, .12, "sine", .05],
  correct: [690, .18, "sine", .075],
  incorrect: [180, .14, "triangle", .045],
  hint: [540, .16, "sine", .05],
  collect: [880, .38, "sine", .08],
  turnChange: [610, .11, "triangle", .05],
  portal: [310, .45, "sine", .065],
  coreCharge: [460, .6, "sine", .07],
  energyPulse: [240, .35, "sine", .075],
  restored: [760, .75, "sine", .09],
  resultsOpen: [600, .25, "triangle", .055],
  confirm: [720, .13, "sine", .06]
};

function ensureContext() {
  if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === "suspended") context.resume();
  unlocked = true;
}

export function unlockAudio() {
  if (!enabled || unlocked) return;
  try { ensureContext(); } catch { unlocked = false; }
}

export function isSoundEnabled() { return enabled; }

export function setSoundEnabled(value) {
  enabled = Boolean(value);
  const settings = loadSettings();
  saveSettings({ ...settings, soundEnabled: enabled });
  if (enabled) unlockAudio();
  return enabled;
}

export function toggleSound() { return setSoundEnabled(!enabled); }

export function playSound(id) {
  if (!enabled || !unlocked) return;
  const tone = tones[id];
  if (!tone) return;
  try {
    const [frequency, duration, type, volume] = tone;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (["correct", "collect", "restored"].includes(id)) oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.48, now + duration);
    if (["portal", "coreCharge"].includes(id)) oscillator.frequency.exponentialRampToValueAtTime(frequency * 2.05, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + .02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + .03);
  } catch (error) {
    console.warn("[TIME GLITCH] SFX unavailable", error);
  }
}

export function playFootstep() {
  const now = performance.now();
  if (now - lastFootstep < 310 + Math.random() * 90) return;
  lastFootstep = now;
  if (!enabled || !unlocked) return;
  try {
    const start = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(92 + Math.random() * 24, start);
    oscillator.frequency.exponentialRampToValueAtTime(55, start + .07);
    gain.gain.setValueAtTime(.035, start);
    gain.gain.exponentialRampToValueAtTime(.0001, start + .08);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + .09);
  } catch { /* Missing audio must stay non-fatal. */ }
}
