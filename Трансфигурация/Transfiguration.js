/* =============================================
   TRANSFIGURATION.JS
   ============================================= */

// ── Видео: loop вручную
const bgVideo = document.getElementById('bgVideo');
bgVideo.addEventListener('ended', () => { bgVideo.currentTime = 0; bgVideo.play(); });

// ── Лепестки: спавн по клику / долгому нажатию
const petalImgs = [
  'petal1.png','petal2.png','petal3.png',
  'petal4.png','petal5.png','petal6.png',
  'petal7.png','petal8.png','petal9.png'
];
const stonesContainer = document.getElementById('stones-container');

let holdInterval = null;

function spawnStone(x, y) {
  const img = document.createElement('img');
  img.src = petalImgs[Math.floor(Math.random() * petalImgs.length)];
  img.className = 'stone';
  img.style.left = (x - 22 + (Math.random() * 30 - 15)) + 'px';
  img.style.top  = (y - 22) + 'px';
  stonesContainer.appendChild(img);
  img.addEventListener('animationend', () => img.remove());
}

// Mouse
document.addEventListener('mousedown', (e) => {
  spawnStone(e.clientX, e.clientY);
  holdInterval = setInterval(() => spawnStone(e.clientX, e.clientY), 80);
});
document.addEventListener('mouseup', () => { clearInterval(holdInterval); holdInterval = null; });
document.addEventListener('mousemove', (e) => {
  if (holdInterval) spawnStone(e.clientX, e.clientY);
});

// Touch
let touchX = 0, touchY = 0;
document.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  touchX = t.clientX; touchY = t.clientY;
  spawnStone(touchX, touchY);
  holdInterval = setInterval(() => spawnStone(touchX, touchY), 80);
}, { passive: true });
document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  touchX = t.clientX; touchY = t.clientY;
}, { passive: true });
document.addEventListener('touchend', () => { clearInterval(holdInterval); holdInterval = null; });

// ── Шапка: скрывать/показывать при скролле
const header = document.getElementById('header');
let lastScrollY = window.scrollY;
let lastTouchY = null;

window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (cur > lastScrollY + 5) {
    header.classList.add('header-hidden');
  } else if (cur < lastScrollY - 5) {
    header.classList.remove('header-hidden');
  }
  lastScrollY = cur;
});

document.addEventListener('touchstart', (e) => {
  lastTouchY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (lastTouchY === null) return;
  const delta = lastTouchY - e.touches[0].clientY;
  if (delta > 10) {
    header.classList.add('header-hidden');
  } else if (delta < -10) {
    header.classList.remove('header-hidden');
  }
}, { passive: true });

// ── Двойной тап = фуллскрин
let lastTap = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 350) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  }
  lastTap = now;
});

// ── Модалки
// ИНСТРУКЦИЯ
const instrPages = [
  'инструкция/инструкция 1.png',
  'инструкция/инструкция 2.png',
  'инструкция/инструкция 3.png',
  'инструкция/инструкция 4.png',
];
let instrIndex = 0;
const instrImg   = document.getElementById('instrImg');
const modalInstr = document.getElementById('modalInstruction');

document.getElementById('btnInstruction').addEventListener('click', (e) => {
  e.stopPropagation();
  instrIndex = 0;
  instrImg.src = instrPages[instrIndex];
  modalInstr.classList.add('active');
});
document.getElementById('closeInstruction').addEventListener('click', (e) => {
  e.stopPropagation();
  modalInstr.classList.remove('active');
});
document.getElementById('instrPrev').addEventListener('click', (e) => {
  e.stopPropagation();
  instrIndex = (instrIndex - 1 + instrPages.length) % instrPages.length;
  instrImg.src = instrPages[instrIndex];
});
document.getElementById('instrNext').addEventListener('click', (e) => {
  e.stopPropagation();
  instrIndex = (instrIndex + 1) % instrPages.length;
  instrImg.src = instrPages[instrIndex];
});
modalInstr.addEventListener('click', (e) => {
  if (e.target === modalInstr) modalInstr.classList.remove('active');
});

// СПРАВОЧНИК
const guidePages = [
  'инструкция/инструкция 1.png',
  'инструкция/инструкция 2.png',
  'инструкция/инструкция 3.png',
  'инструкция/инструкция 4.png',
];
let guideIndex = 0;
const guideImg   = document.getElementById('guideImg');
const modalGuide = document.getElementById('modalGuide');

document.getElementById('btnGuide').addEventListener('click', (e) => {
  e.stopPropagation();
  guideIndex = 0;
  guideImg.src = guidePages[guideIndex];
  modalGuide.classList.add('active');
});
document.getElementById('closeGuide').addEventListener('click', (e) => {
  e.stopPropagation();
  modalGuide.classList.remove('active');
});
document.getElementById('guidePrev').addEventListener('click', (e) => {
  e.stopPropagation();
  guideIndex = (guideIndex - 1 + guidePages.length) % guidePages.length;
  guideImg.src = guidePages[guideIndex];
});
document.getElementById('guideNext').addEventListener('click', (e) => {
  e.stopPropagation();
  guideIndex = (guideIndex + 1) % guidePages.length;
  guideImg.src = guidePages[guideIndex];
});
modalGuide.addEventListener('click', (e) => {
  if (e.target === modalGuide) modalGuide.classList.remove('active');
});
