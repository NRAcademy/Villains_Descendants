/* =============================================
   FIRST_LESSON.JS
   ============================================= */

/* ---------- АУДИО ---------- */
const audioBg      = document.getElementById('audioBg');
const audioSuccess = document.getElementById('audioSuccess');
const audioFail    = document.getElementById('audioFail');

audioBg.volume = 0.5;

// Запускаем музыку сразу; если браузер требует жест — запустим при первом любом взаимодействии
function startBg() {
  if (audioBg.paused) audioBg.play().catch(() => {});
}
startBg();
document.addEventListener('pointerdown', startBg, { once: true });
document.addEventListener('touchstart',  startBg, { once: true });
document.addEventListener('keydown',     startBg, { once: true });

/* ---------- ЛЕПЕСТКИ ---------- */
const petalList       = ['petal1.png','petal2.png','petal3.png','petal4.png','petal5.png','petal6.png','petal7.png','petal8.png','petal9.png'];
const petalsContainer = document.getElementById('petals-container');
let holdPetal = null;

function spawnPetal(x, y) {
  const img     = document.createElement('img');
  img.src       = petalList[Math.floor(Math.random() * petalList.length)];
  img.className = 'petal';
  img.style.left = (x - 14 + (Math.random() * 24 - 12)) + 'px';
  img.style.top  = (y - 14) + 'px';
  petalsContainer.appendChild(img);
  img.addEventListener('animationend', () => img.remove());
}

document.addEventListener('mousedown', (e) => {
  spawnPetal(e.clientX, e.clientY);
  holdPetal = setInterval(() => spawnPetal(e.clientX, e.clientY), 80);
});
document.addEventListener('mouseup',   () => { clearInterval(holdPetal); holdPetal = null; });
document.addEventListener('mousemove', (e) => { if (holdPetal) spawnPetal(e.clientX, e.clientY); });

let tX = 0, tY = 0;
document.addEventListener('touchstart', (e) => {
  const t = e.touches[0]; tX = t.clientX; tY = t.clientY;
  spawnPetal(tX, tY);
  holdPetal = setInterval(() => spawnPetal(tX, tY), 80);
}, { passive: true });
document.addEventListener('touchmove', (e) => {
  const t = e.touches[0]; tX = t.clientX; tY = t.clientY;
}, { passive: true });
document.addEventListener('touchend', () => { clearInterval(holdPetal); holdPetal = null; });

/* ---------- ШАПКА ---------- */
const header    = document.getElementById('header');
let lastScrollY = window.scrollY;
let lastTouchHdr = null;

window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (cur > lastScrollY + 5)  header.classList.add('header-hidden');
  if (cur < lastScrollY - 5)  header.classList.remove('header-hidden');
  lastScrollY = cur;
});
document.addEventListener('touchstart', (e) => { lastTouchHdr = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (lastTouchHdr === null) return;
  const d = lastTouchHdr - e.touches[0].clientY;
  if (d > 10)  header.classList.add('header-hidden');
  if (d < -10) header.classList.remove('header-hidden');
}, { passive: true });

/* ---------- ДВОЙНОЙ ТАП = ФУЛЛСКРИН ---------- */
let lastTap = 0;
document.addEventListener('touchend', () => {
  const now = Date.now();
  if (now - lastTap < 350) {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  lastTap = now;
});

/* ---------- МОДАЛКИ ---------- */
function openModal(id)  { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

/* ---------- ОБУЧЕНИЕ (открывается сразу при загрузке) ---------- */
// modalLearn уже имеет class="active" в HTML
// При закрытии — показываем подсказку
document.getElementById('modalLearn').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalLearn')) {
    closeModal('modalLearn');
    showHintNow();
  }
});

/* ---------- СПРАВОЧНИК ---------- */
const guidePages = [
  '../../menu/справочник/страница 1.png',
  '../../menu/справочник/страница 2.png',
  '../../menu/справочник/страница 3.png',
  '../../menu/справочник/страница 4.png',
];
let guideIndex = 0;
document.getElementById('btnGuide').addEventListener('click', () => {
  guideIndex = 0;
  document.getElementById('guideImg').src = guidePages[0];
  openModal('modalGuide');
});
document.getElementById('closeGuide').addEventListener('click', () => closeModal('modalGuide'));
document.getElementById('modalGuide').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalGuide')) closeModal('modalGuide');
});
document.getElementById('guidePrev').addEventListener('click', () => {
  guideIndex = (guideIndex - 1 + guidePages.length) % guidePages.length;
  document.getElementById('guideImg').src = guidePages[guideIndex];
});
document.getElementById('guideNext').addEventListener('click', () => {
  guideIndex = (guideIndex + 1) % guidePages.length;
  document.getElementById('guideImg').src = guidePages[guideIndex];
});

/* ---------- КНОПКА "ОБУЧЕНИЕ" в шапке ---------- */
document.getElementById('btnLearn').addEventListener('click', () => openModal('modalLearn'));

/* ---------- "УЖЕ ПРОШЁЛ СЕГОДНЯ" ---------- */
const TODAY_KEY = 'fl_done_' + new Date().toDateString();
// Если уже играл сегодня — показываем модалку ожидания
if (localStorage.getItem(TODAY_KEY)) {
  openModal('modalWait');
}

/* ---------- ЭЛЕМЕНТЫ ИГРЫ ---------- */
const btn2          = document.getElementById('btn2');
const btn3          = document.getElementById('btn3');
const resultOverlay = document.getElementById('resultOverlay');
const ratImg        = document.getElementById('ratImg');
const flash         = document.getElementById('flash');
const hintWrap      = document.getElementById('hintWrap');

let gestureStrokes  = [];
let gestureComplete = false;
let hintVisible     = false;  // подсказка сейчас видна?
let touchedOnce     = false;  // первое касание после закрытия модалки

/* ---------- ПОДСКАЗКА ---------- */
// Показать подсказку немедленно
function showHintNow() {
  hintWrap.classList.remove('hidden');
  hintVisible = true;
  touchedOnce = false;
}

// Скрыть подсказку при первом касании экрана (не по кнопкам/шапке/модалке)
function hideHintOnTouch(e) {
  if (!hintVisible) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) return;
  if (el.closest('.site-header')) return;
  if (el.closest('.modal-overlay')) return;
  if (el.closest('.btn-row')) return;

  hintWrap.classList.add('hidden');
  hintVisible = false;
  touchedOnce = true;
}

document.addEventListener('pointerdown', hideHintOnTouch);

/* ---------- CANVAS ЖЕСТОВ ---------- */
const canvas = document.getElementById('gestureCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let drawing      = false;
let drawPath     = [];
let strokeStartY = 0;

document.addEventListener('pointerdown', (e) => {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) return;
  if (el.closest('.site-header')) return;
  if (el.closest('.modal-overlay')) return;
  if (el.closest('.btn-row')) return;

  drawing      = true;
  drawPath     = [{ x: e.clientX, y: e.clientY }];
  strokeStartY = e.clientY;
});

document.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  drawPath.push({ x: e.clientX, y: e.clientY });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth   = 3;
  ctx.lineCap     = 'round';
  drawPath.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();
});

document.addEventListener('pointerup', (e) => {
  if (!drawing) return;
  drawing = false;

  const dy = e.clientY - strokeStartY;
  const dx = Math.abs(e.clientX - (drawPath[0]?.x ?? e.clientX));

  if (dy > 60 && dx < 150) {
    gestureStrokes.push('down');
    if (gestureStrokes.length >= 3) {
      gestureComplete = true;
      gestureStrokes  = [];
    }
  }

  fadeCanvas();
});

function fadeCanvas() {
  const snapshot = [...drawPath];
  let op = 1;
  const id = setInterval(() => {
    op -= 0.1;
    if (op <= 0) { ctx.clearRect(0, 0, canvas.width, canvas.height); clearInterval(id); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = op;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth   = 3;
    ctx.lineCap     = 'round';
    snapshot.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, 40);
}

/* ---------- КНОПКА 3 — повторить (сбросить жест) ---------- */
btn3.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
btn3.addEventListener('click', () => {
  // Сбрасываем жест
  gestureStrokes  = [];
  gestureComplete = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Кнопка 3 больше не нужна — только кнопка 2
  btn3.classList.add('hidden');
});

/* ---------- КНОПКА 2 — завершить ---------- */
btn2.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
btn2.addEventListener('click', () => {
  showLoading(gestureComplete);
});

/* ---------- ВСПЫШКА ---------- */
function doFlash(cb) {
  flash.classList.add('active');
  setTimeout(() => { flash.classList.remove('active'); cb?.(); }, 300);
}

/* ---------- ЗАГРУЗКА ---------- */
function showLoading(success) {
  const overlay = document.getElementById('modalLoading');
  const coffins = [
    document.getElementById('cof1'),
    document.getElementById('cof2'),
    document.getElementById('cof3'),
    document.getElementById('cof4'),
    document.getElementById('cof5'),
  ];
  const textEl = document.getElementById('loadingText');
  const fullText = 'Загружаем результат...';

  // Сброс
  coffins.forEach(c => c.classList.remove('active'));
  textEl.textContent = '';
  overlay.classList.add('active');

  // Мигание гробов — каждый по 400мс, 5 гробов = 2000мс
  let cofIdx = 0;
  const cofTimer = setInterval(() => {
    coffins.forEach(c => c.classList.remove('active'));
    coffins[cofIdx].classList.add('active');
    cofIdx++;
    if (cofIdx >= coffins.length) cofIdx = 0;
  }, 400);

  // Эффект печатания — один раз, начинается сразу
  let charIdx = 0;
  const typeTimer = setInterval(() => {
    if (charIdx < fullText.length) {
      textEl.textContent += fullText[charIdx];
      charIdx++;
    } else {
      clearInterval(typeTimer);
    }
  }, 80);

  // Через 3 сек — закрыть загрузку, вспышка, затем результат
  setTimeout(() => {
    clearInterval(cofTimer);
    clearInterval(typeTimer);
    coffins.forEach(c => c.classList.remove('active'));
    overlay.classList.remove('active');
    doFlash(() => showResult(success));
  }, 3000);
}

/* ---------- РЕЗУЛЬТАТ ---------- */
function showResult(success) {
  resultOverlay.src = success ? 'удача.png' : 'неудача.png';
  resultOverlay.style.opacity = '0';
  resultOverlay.style.transform = 'translate(-50%, -50%) scale(0.2)';
  resultOverlay.classList.remove('hidden');

  // Крыса исчезает, результат появляется с анимацией масштаба
  ratImg.style.transition = 'opacity 0.5s ease';
  resultOverlay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  ratImg.style.opacity = '0';

  // Небольшая задержка чтобы браузер подхватил начальный transform
  requestAnimationFrame(() => requestAnimationFrame(() => {
    resultOverlay.style.opacity = '1';
    resultOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
  }));

  audioBg.volume = 0.2;
  if (success) audioSuccess.play();
  else         audioFail.play();

  setTimeout(() => {
    // Крыса не возвращается — скрываем её насовсем
    ratImg.style.transition = '';
    resultOverlay.style.transition = '';
    openModal(success ? 'modalSuccess' : 'modalFail');
  }, 2000);
}

/* ---------- КНОПКИ "ПОНЯТНО" ---------- */
['okSuccess','okFail','okWait'].forEach(id => {
  document.getElementById(id).addEventListener('pointerdown', (e) => e.stopPropagation());
});

document.getElementById('okSuccess').addEventListener('click', () => {
  closeModal('modalSuccess');
  audioBg.volume = 0.5;
  audioSuccess.pause(); audioSuccess.currentTime = 0;
  localStorage.setItem(TODAY_KEY, '1');
  setTimeout(() => openModal('modalWait'), 400);
});
document.getElementById('okFail').addEventListener('click', () => {
  closeModal('modalFail');
  audioBg.volume = 0.5;
  audioFail.pause(); audioFail.currentTime = 0;
  localStorage.setItem(TODAY_KEY, '1');
  setTimeout(() => openModal('modalWait'), 400);
});
document.getElementById('okWait').addEventListener('click', () => {
  window.location.replace('../Transfiguration.html');
});
