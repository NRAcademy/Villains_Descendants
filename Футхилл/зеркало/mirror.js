// ── Рандомная комбинация ──
const combos = [
  { bg: 'фон.png',   card: 'карта 1.png', ribbon: 'подпись 1.png',  btn: 'кнопка.png'   },
  { bg: 'фон 2.png', card: 'карта 2.png', ribbon: 'подпись 2.png',  btn: 'кнопка 2.png' },
  { bg: 'фон 2.png', card: 'карта 2.png', ribbon: 'подпись 3.png',  btn: 'кнопка 2.png' },
  { bg: 'фон 7.png', card: 'карта 3.png', ribbon: 'подпись 4.png',  btn: 'кнопка 7.png' },
  { bg: 'фон 2.png', card: 'карта 4.png', ribbon: 'подпись 5.png',  btn: 'кнопка 2.png' },
  { bg: 'фон.png',   card: 'карта 5.png', ribbon: 'подпись 6.png',  btn: 'кнопка.png'   },
  { bg: 'фон 7.png', card: 'карта 6.png', ribbon: 'подпись 7.png',  btn: 'кнопка 7.png' },
  { bg: 'фон 7.png', card: 'карта 6.png', ribbon: 'подпись 8.png',  btn: 'кнопка 7.png' },
  { bg: 'фон 2.png', card: 'карта 7.png', ribbon: 'подпись 9.png',  btn: 'кнопка 2.png' },
  { bg: 'фон.png',   card: 'карта 5.png', ribbon: 'подпись 10.png', btn: 'кнопка.png'   },
];

// ── Проверка localStorage — один раз в день ──
const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
const saved = JSON.parse(localStorage.getItem('mirrorDay') || 'null');

let combo;
let alreadyOpened = false;

if (saved && saved.date === today) {
  // Уже открывали сегодня — берём сохранённую комбинацию
  combo = combos[saved.index];
  alreadyOpened = true;
} else {
  // Первый раз сегодня — рандом и сохраняем
  const index = Math.floor(Math.random() * combos.length);
  combo = combos[index];
  localStorage.setItem('mirrorDay', JSON.stringify({ date: today, index }));
}

// Применяем комбинацию ко всем layout
document.getElementById('bg').src = combo.bg;
document.querySelectorAll('.card-img').forEach(el => el.src = combo.card);
document.querySelectorAll('.ribbon-img').forEach(el => el.src = combo.ribbon);
document.getElementById('pBtn').src = combo.btn;
document.getElementById('lBtn').src = combo.btn;
document.getElementById('dBtn').src = combo.btn;

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

// ── Fullscreen по двойному тапу ──
let lastTap = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTap < 300) {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen)
        .call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen)
        .call(document);
    }
  }
  lastTap = now;
}, { passive: true });

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

  // Всегда: анимация + кнопка
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
  window.location.href = '../Меню/foothill.html';
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
