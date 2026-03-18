/**
 * Генерация звуков через Web Audio API
 * Все звуки синтезируются — никаких файлов не нужно
 */

let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicPlaying = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

// --- Звуковые эффекты ---

export function playJump() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = 'square';
  osc.frequency.setValueAtTime(300, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.1);
  gain.gain.setValueAtTime(0.15, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.15);
}

export function playCoin() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, c.currentTime);
  osc.frequency.setValueAtTime(1100, c.currentTime + 0.06);
  osc.frequency.setValueAtTime(1320, c.currentTime + 0.12);
  gain.gain.setValueAtTime(0.12, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.25);
}

export function playHeart() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(784, c.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.2);
  gain.gain.setValueAtTime(0.12, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.25);
}

export function playDamage() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.3);
  gain.gain.setValueAtTime(0.15, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.35);
}

export function playRescue() {
  const c = getCtx();
  const notes = [523, 659, 784]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0, c.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.12, c.currentTime + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.12 + 0.2);

    osc.start(c.currentTime + i * 0.12);
    osc.stop(c.currentTime + i * 0.12 + 0.2);
  });
}

export function playEnemyDeath() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  osc.type = 'square';
  osc.frequency.setValueAtTime(400, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.4);
  gain.gain.setValueAtTime(0.1, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.4);
}

export function playLevelComplete() {
  const c = getCtx();
  const melody = [523, 659, 784, 1047]; // C5 E5 G5 C6
  melody.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    osc.type = 'sine';
    const t = c.currentTime + i * 0.15;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.3);
  });
}

// --- Агрессивная фоновая музыка (E minor, 170 BPM) ---
// Стиль: Hotline Miami / Mega Man — быстрый темп, тяжёлый бит, дисторшн

const BPM = 170;
const BEAT = 60 / BPM;

// Мелодия — агрессивный рифф (square wave, яростная)
const MELODY: { note: number; beats: number }[] = [
  // Фраза 1 — бешеный рифф
  { note: 330, beats: 0.25 }, // E4 быстрые удары
  { note: 330, beats: 0.25 },
  { note: 0, beats: 0.25 },
  { note: 330, beats: 0.25 },
  { note: 392, beats: 0.25 }, // G4
  { note: 440, beats: 0.25 }, // A4
  { note: 392, beats: 0.5 },  // G4
  { note: 330, beats: 0.5 },  // E4
  // Фраза 2 — подъём с синкопами
  { note: 494, beats: 0.25 }, // B4
  { note: 494, beats: 0.25 },
  { note: 440, beats: 0.25 }, // A4
  { note: 392, beats: 0.25 }, // G4
  { note: 440, beats: 0.5 },  // A4
  { note: 330, beats: 0.25 }, // E4
  { note: 0, beats: 0.25 },
  { note: 330, beats: 0.5 },  // E4
  // Фраза 3 — нисходящая атака
  { note: 659, beats: 0.5 },  // E5 (крик!)
  { note: 587, beats: 0.25 }, // D5
  { note: 494, beats: 0.25 }, // B4
  { note: 440, beats: 0.25 }, // A4
  { note: 392, beats: 0.25 }, // G4
  { note: 330, beats: 0.5 },  // E4
  { note: 294, beats: 0.25 }, // D4
  { note: 330, beats: 0.75 }, // E4
  // Фраза 4 — финал с ускорением
  { note: 330, beats: 0.25 }, // E4
  { note: 392, beats: 0.25 }, // G4
  { note: 440, beats: 0.25 }, // A4
  { note: 494, beats: 0.25 }, // B4
  { note: 587, beats: 0.25 }, // D5
  { note: 659, beats: 0.25 }, // E5
  { note: 784, beats: 0.75 }, // G5 (кульминация!)
  { note: 659, beats: 0.25 }, // E5
  { note: 494, beats: 0.25 }, // B4
  { note: 392, beats: 0.25 }, // G4
  { note: 330, beats: 0.5 },  // E4
  { note: 0, beats: 0.5 },
];

// Бас — пулемётный, тяжёлый
const BASS: { note: number; beats: number }[] = [
  // Фраза 1 — пулемётный бас
  { note: 82, beats: 0.25 },  // E2
  { note: 82, beats: 0.25 },
  { note: 82, beats: 0.25 },
  { note: 0, beats: 0.25 },
  { note: 82, beats: 0.25 },
  { note: 82, beats: 0.25 },
  { note: 98, beats: 0.25 },  // G2
  { note: 110, beats: 0.25 }, // A2
  { note: 82, beats: 0.5 },   // E2
  // Фраза 2
  { note: 110, beats: 0.25 }, // A2
  { note: 110, beats: 0.25 },
  { note: 110, beats: 0.25 },
  { note: 0, beats: 0.25 },
  { note: 123, beats: 0.25 }, // B2
  { note: 110, beats: 0.25 },
  { note: 98, beats: 0.25 },  // G2
  { note: 82, beats: 0.25 },  // E2
  { note: 82, beats: 0.5 },
  // Фраза 3
  { note: 73, beats: 0.25 },  // D2
  { note: 82, beats: 0.25 },  // E2
  { note: 73, beats: 0.25 },
  { note: 82, beats: 0.25 },
  { note: 98, beats: 0.5 },   // G2
  { note: 82, beats: 0.25 },
  { note: 73, beats: 0.25 },
  { note: 82, beats: 0.5 },
  // Фраза 4
  { note: 82, beats: 0.25 },  // E2
  { note: 98, beats: 0.25 },  // G2
  { note: 110, beats: 0.25 }, // A2
  { note: 123, beats: 0.25 }, // B2
  { note: 82, beats: 0.25 },  // E2
  { note: 82, beats: 0.25 },
  { note: 65, beats: 0.5 },   // C2 (тяжёлый удар)
  { note: 73, beats: 0.25 },  // D2
  { note: 82, beats: 0.5 },   // E2
  { note: 0, beats: 0.25 },
];

let melodyTimeout: ReturnType<typeof setTimeout> | null = null;

function playNote(
  c: AudioContext, dest: AudioNode,
  freq: number, time: number, dur: number,
  type: OscillatorType, vol: number,
) {
  if (freq <= 0) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(dest);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.01);
  gain.gain.setValueAtTime(vol, time + dur * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

  osc.start(time);
  osc.stop(time + dur + 0.01);
}

function playDrumHit(c: AudioContext, dest: AudioNode, time: number, isKick: boolean) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(dest);

  if (isKick) {
    // Бочка — низкий удар
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.start(time);
    osc.stop(time + 0.2);
  } else {
    // Хай-хэт — шум через осциллятор
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.setValueAtTime(800, time + 0.02);
    gain.gain.setValueAtTime(0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.start(time);
    osc.stop(time + 0.06);
  }
}

function playMusicLoop() {
  if (!musicPlaying) return;
  const c = getCtx();
  const dest = musicGain!;

  let t = c.currentTime + 0.05;

  // Мелодия — square wave, резкая
  let melTime = t;
  for (const { note, beats } of MELODY) {
    const dur = beats * BEAT;
    playNote(c, dest, note, melTime, dur * 0.85, 'square', 0.06);
    melTime += dur;
  }

  // Бас — sawtooth, мощный
  let bassTime = t;
  for (const { note, beats } of BASS) {
    const dur = beats * BEAT;
    playNote(c, dest, note, bassTime, dur * 0.9, 'sawtooth', 0.08);
    bassTime += dur;
  }

  // Ударные — бочка на 1 и 3, хай-хэт на каждую 8-ю
  const totalBeats = MELODY.reduce((s, n) => s + n.beats, 0);
  const totalDur = totalBeats * BEAT;
  let drumTime = t;
  for (let beat = 0; beat < totalBeats; beat += 0.5) {
    const dt = drumTime + beat * BEAT;
    // Бочка на 1 и 3 (каждые 2 бита)
    if (beat % 2 < 0.01) {
      playDrumHit(c, dest, dt, true);
    }
    // Бочка на "и" 2 (синкопа для агрессивности)
    if (Math.abs(beat % 2 - 1.5) < 0.01) {
      playDrumHit(c, dest, dt, true);
    }
    // Хай-хэт на каждую 8-ю
    playDrumHit(c, dest, dt, false);
  }

  melodyTimeout = setTimeout(playMusicLoop, totalDur * 1000 - 50);
}

export function startMusic() {
  if (musicPlaying) return;
  const c = getCtx();
  musicGain = c.createGain();
  musicGain.gain.setValueAtTime(0.5, c.currentTime);
  musicGain.connect(c.destination);
  musicPlaying = true;
  playMusicLoop();
}

export function stopMusic() {
  musicPlaying = false;
  if (melodyTimeout) {
    clearTimeout(melodyTimeout);
    melodyTimeout = null;
  }
}
