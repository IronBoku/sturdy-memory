// === Fungsi umum untuk memainkan sound dari file JSON ===
async function playSoundFromFile(filePath) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const response = await fetch(filePath);
  const sound = await response.json();

  sound.pattern.forEach(note => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Jenis oscillator (sine, square, triangle, sawtooth)
    osc.type = sound.oscillator;

    // Frekuensi dan waktu mulai
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

    // Gain (volume)
    gain.gain.setValueAtTime(note.gain, ctx.currentTime + note.time);

    // Hubungkan ke output
    osc.connect(gain).connect(ctx.destination);

    // Start & stop sesuai durasi
    osc.start(ctx.currentTime + note.time);
    osc.stop(ctx.currentTime + note.time + note.duration);
  });
}

// === Event listener untuk hover dan click di arcade grid ===
document.querySelectorAll('.arcade-grid a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    playSoundFromFile('assets/sounds/soundhover.json');
  });

  link.addEventListener('click', () => {
    playSoundFromFile('assets/sounds/soundclick.json');
  });
});

// === Musik latar arcade ===
let bgMusicStarted = false;
async function playArcadeTheme() {
  if (bgMusicStarted) return; // Hindari double play
  bgMusicStarted = true;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const response = await fetch('assets/sounds/arcade-theme.json');
  const sound = await response.json();

  function schedulePattern(startTime) {
    sound.pattern.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sound.oscillator;
      osc.frequency.setValueAtTime(note.freq, startTime + note.time);
      gain.gain.setValueAtTime(note.gain, startTime + note.time);

      osc.connect(gain).connect(ctx.destination);
      osc.start(startTime + note.time);
      osc.stop(startTime + note.time + note.duration);
    });
  }

  // Durasi loop pattern (detik) → sesuaikan dengan panjang pattern JSON
  const loopDuration = 4; 
  function loop() {
    const start = ctx.currentTime;
    schedulePattern(start);
    setTimeout(loop, loopDuration * 1000);
  }
  loop();
}

// Mulai musik arcade setelah interaksi pertama
document.body.addEventListener('click', () => {
  playArcadeTheme();
}, { once: true });

// === Library tambahan: efek suara lain ===
function playGameOver() {
  playSoundFromFile('assets/sounds/gameover.json');
}

function playWin() {
  playSoundFromFile('assets/sounds/win.json');
}

function playCoin() {
  playSoundFromFile('assets/sounds/coin.json');
}

function playJump() {
  playSoundFromFile('assets/sounds/jump.json');
}

function playShoot() {
  playSoundFromFile('assets/sounds/shoot.json');
}

// === Contoh integrasi ke tombol khusus (opsional) ===
// document.getElementById('game-over-btn').addEventListener('click', playGameOver);
// document.getElementById('win-btn').addEventListener('click', playWin);
// document.getElementById('coin-btn').addEventListener('click', playCoin);
// document.getElementById('jump-btn').addEventListener('click', playJump);
// document.getElementById('shoot-btn').addEventListener('click', playShoot);
