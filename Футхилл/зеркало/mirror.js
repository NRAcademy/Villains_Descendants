// ── Cursor ──
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.addEventListener('touchmove', e => {
  const t = e.touches[0];
  cursor.style.left = t.clientX + 'px';
  cursor.style.top  = t.clientY + 'px';
}, { passive: true });

// ── Petals — летят ВВЕРХ ──
const petalImages = Array.from({length: 9}, (_, i) => `petal${i+1}.png`);
let holdInterval = null;
let holdX = 0, holdY = 0;

function spawnPetal(x, y) {
  const el = document.createElement('div');
  el.className = 'petal';
  el.style.backgroundImage = `url('${petalImages[Math.floor(Math.random() * petalImages.length)]}')`;
  el.style.left = (x - 16) + 'px';
  el.style.top  = (y - 16) + 'px';
  // tx: чуть в стороны, ty: ВВЕРХ (отрицательное значение)
  el.style.setProperty('--tx', ((Math.random() - 0.5) * 160) + 'px');
  el.style.setProperty('--ty', (-(Math.random() * 180 + 80)) + 'px');
  el.style.setProperty('--rot', ((Math.random() - 0.5) * 540) + 'deg');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function startHold(x, y) {
  holdX = x; holdY = y;
  spawnPetal(x, y);
  holdInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) spawnPetal(holdX, holdY);
  }, 80);
}
function stopHold() {
  clearInterval(holdInterval);
  holdInterval = null;
}

document.addEventListener('mousedown', e => startHold(e.clientX, e.clientY));
document.addEventListener('mousemove', e => { holdX = e.clientX; holdY = e.clientY; });
document.addEventListener('mouseup', stopHold);
document.addEventListener('mouseleave', stopHold);
document.addEventListener('touchstart', e => {
  const t = e.touches[0]; startHold(t.clientX, t.clientY);
}, { passive: true });
document.addEventListener('touchmove', e => {
  const t = e.touches[0]; holdX = t.clientX; holdY = t.clientY;
}, { passive: true });
document.addEventListener('touchend', stopHold);

// ── Запрет контекстного меню / перетаскивания ──
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

// ── Музыка ──
const bgMusic = document.getElementById('bgMusic');

function tryPlayMusic() {
  bgMusic.volume = 0.8;
  bgMusic.play().catch(() => {});
}

// ── Intro Video ──
const introWrap = document.getElementById('intro-video');
const introVid  = document.getElementById('introVid');
const scene     = document.getElementById('scene');

function showScene() {
  introWrap.classList.add('hidden');
  scene.classList.add('visible');
  document.querySelectorAll('.slide-in').forEach(el => {
    el.classList.add('slide-in-active');
  });
}

// Музыка стартует вместе с видео
introVid.addEventListener('canplay', tryPlayMusic, { once: true });

introVid.autoplay = true;
introVid.muted = false;
introVid.play().catch(() => {});

introVid.addEventListener('ended', showScene);
introVid.addEventListener('error', showScene);

// Fallback при клике
document.addEventListener('click', () => {
  if (introVid.paused && !scene.classList.contains('visible')) {
    introVid.play().catch(() => {});
    tryPlayMusic();
  }
  if (bgMusic.paused) tryPlayMusic();
});

// ── Кнопки ──
function navigate() {
  window.location.href = 'file:///C:/Users/user/Documents/%D0%A4%D1%83%D1%82%D1%85%D0%B8%D0%BB%D0%BB/%D0%9C%D0%B5%D0%BD%D1%8E/foothill.html';
}

function setupBtn(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
  btn.addEventListener('mouseup',   () => { btn.classList.remove('pressed'); navigate(); });
  btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
  btn.addEventListener('touchstart', () => btn.classList.add('pressed'), { passive: true });
  btn.addEventListener('touchend',   () => { btn.classList.remove('pressed'); navigate(); });
}

setupBtn('pBtn');
setupBtn('lBtn');
setupBtn('dBtn');
