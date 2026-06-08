/* =============================================
   TRANSFIGURATION.JS
   ============================================= */

// ======================================================
// ЗАГРУЗОЧНЫЙ ЭКРАН (только мобайл portrait, при первом открытии)
// ======================================================

window.addEventListener('load', () => {
  const isMobile = window.innerWidth <= 1000 || ('ontouchstart' in window);
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile && isPortrait) {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    loadingScreen.style.display = 'flex';

    const coffins = [
      document.getElementById('coffin-1'),
      document.getElementById('coffin-2'),
      document.getElementById('coffin-3')
    ];

    let activeIndex = 0;

    // Анимация гробов
    const coffinInterval = setInterval(() => {
      coffins.forEach(c => { c.classList.remove('active'); c.classList.add('dark'); });
      coffins[activeIndex].classList.remove('dark');
      coffins[activeIndex].classList.add('active');
      activeIndex = (activeIndex + 1) % coffins.length;
    }, 550);

    // Печатающийся текст
    const text = 'Поверни телефон и нажми дважды на экран...';
    const loadingTextEl = document.getElementById('loading-text');
    let i = 0;

    const typeInterval = setInterval(() => {
      loadingTextEl.textContent += text.charAt(i);
      i++;
      if (i >= text.length) clearInterval(typeInterval);
    }, 60);

    // Скрытие экрана через 4.2s
    setTimeout(() => {
      clearInterval(coffinInterval);
      loadingScreen.classList.add('hide');
      setTimeout(() => { loadingScreen.remove(); }, 1000);
    }, 4200);
  }
});

// ======================================================
// OVERLAY "ПОВЕРНИ ТЕЛЕФОН" (при повторном повороте в portrait)
// ======================================================

function checkOrientation() {
  const overlay = document.getElementById('rotate-overlay');
  if (!overlay) return;
  const isMobile = window.innerWidth <= 1000 || ('ontouchstart' in window);
  const isPortrait = window.innerHeight > window.innerWidth;
  overlay.style.display = (isMobile && isPortrait) ? 'flex' : 'none';
}

window.addEventListener('orientationchange', () => { setTimeout(checkOrientation, 100); });
window.addEventListener('resize', checkOrientation);
checkOrientation();

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

const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

function spawnStone(x, y) {
  const img = document.createElement('img');
  img.src = petalImgs[Math.floor(Math.random() * petalImgs.length)];
  img.className = 'stone';
  img.style.left = (x - 22 + (Math.random() * 30 - 15)) + 'px';
  img.style.top  = (y - 22) + 'px';
  // На мобиле принудительно красим в красный
  if (isTouchDevice) {
    img.style.filter = 'sepia(1) saturate(8) hue-rotate(-20deg) brightness(0.85)';
  }
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

// ── Шапка: скрывать/показывать при скролле/свайпе
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (cur > lastScrollY + 5)       header.classList.add('header-hidden');
  else if (cur < lastScrollY - 5)  header.classList.remove('header-hidden');
  lastScrollY = cur;
});

(function() {
  let startY = 0, startX = 0;
  const THRESHOLD = 30;
  document.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - startY;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dy) < THRESHOLD || Math.abs(dy) < Math.abs(dx)) return;
    if (dy < 0) header.classList.add('header-hidden');
    else        header.classList.remove('header-hidden');
  }, { passive: true });
})();

// ── Двойной тап = фуллскрин
let lastTap = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 350) {
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      if (doc.requestFullscreen)            doc.requestFullscreen();
      else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
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
