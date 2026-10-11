// ─────────────────────────────
// ЭЛЕМЕНТЫ
// ─────────────────────────────

const introVideo = document.getElementById('introVid');
const introMusic = document.getElementById('introMusic');
const bgMusic = document.getElementById('bgMusic');

const introScreen = document.getElementById('intro-video');
const scene = document.getElementById('scene');

const atelierButton = document.getElementById('atelier-button');

const unsupportedScreen = document.getElementById('unsupported-screen');
const returnText = document.getElementById('return-text');

const customCursor = document.getElementById('custom-cursor');

// ─────────────────────────────
// ЕЖЕДНЕВНЫЙ НАРЯД
// ─────────────────────────────

// Сюда добавляй новые наряды.
// Достаточно дописывать новые названия файлов.
const outfits = [
  'наряд 1.png',
  'наряд 2.png',
  'наряд 3.png',
  'наряд 4.png'
];


// ── Уникальный ID устройства ──

let atelierDeviceId = localStorage.getItem('atelierDeviceId');

if (!atelierDeviceId) {

  atelierDeviceId =
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2);

  localStorage.setItem(
    'atelierDeviceId',
    atelierDeviceId
  );
}


// ── Хэш строки → число ──

function atelierHashCode(str) {

  let h = 0;

  for (let i = 0; i < str.length; i++) {

    h =
      Math.imul(31, h) +
      str.charCodeAt(i) | 0;

  }

  return Math.abs(h);
}


// ── Получаем сегодняшнюю дату
// по местному времени устройства ──

const atelierNow = new Date();

const atelierToday = [
  atelierNow.getFullYear(),
  String(atelierNow.getMonth() + 1).padStart(2, '0'),
  String(atelierNow.getDate()).padStart(2, '0')
].join('-');


// ── Смотрим сохранённый результат ──

const savedOutfit = JSON.parse(
  localStorage.getItem('atelierDay') || 'null'
);


let outfitIndex;


// ── Если сегодня уже заходили ──

if (
  savedOutfit &&
  savedOutfit.date === atelierToday &&
  outfits[savedOutfit.index]
) {

  outfitIndex = savedOutfit.index;

}


// ── Если наступил новый день ──

else {

  let newIndex =
    atelierHashCode(
      atelierDeviceId + atelierToday
    ) % outfits.length;


  // Не позволяем вчерашнему наряду
  // выпасть повторно.

  if (
    savedOutfit &&
    outfits.length > 1 &&
    newIndex === savedOutfit.index
  ) {

    newIndex =
      (newIndex + 1) % outfits.length;

  }


  outfitIndex = newIndex;


  // Запоминаем сегодняшний результат.

  localStorage.setItem(
    'atelierDay',
    JSON.stringify({
      date: atelierToday,
      index: outfitIndex
    })
  );

}


// ── Устанавливаем сегодняшний наряд ──

const todayOutfit = outfits[outfitIndex];

document.getElementById('outfit').src = todayOutfit;

// ─────────────────────────────
// ПРОВЕРКА УСТРОЙСТВА
// ─────────────────────────────

function isMobilePortrait() {

  const isMobile =
    window.matchMedia('(max-width: 767px)').matches;

  const isPortrait =
    window.matchMedia('(orientation: portrait)').matches;

  return isMobile && isPortrait;
}


// ─────────────────────────────
// КАСТОМНЫЙ КУРСОР
// ─────────────────────────────

if (window.matchMedia('(pointer: fine)').matches) {

  customCursor.style.display = 'block';

  document.addEventListener('mousemove', function (event) {

    customCursor.style.left = event.clientX + 'px';
    customCursor.style.top = event.clientY + 'px';

  });

}


// ─────────────────────────────
// ВОЗВРАТ В ФУТХИЛЛ
// ─────────────────────────────

function returnToFoothill() {

  window.location.href = '../foothill.html';

}


// Надпись «ВЕРНУТЬСЯ»

returnText.addEventListener('click', returnToFoothill);


// Кнопка ателье

atelierButton.addEventListener('click', returnToFoothill);


// ─────────────────────────────
// ПЕРЕХОД К ОСНОВНОЙ СЦЕНЕ
// ─────────────────────────────

function showAtelier() {

  introMusic.pause();

  introMusic.currentTime = 0;

  bgMusic.currentTime = 0;

  bgMusic.play().catch(() => {
    // Браузер может запретить autoplay.
    // Попытка запуска будет повторена при первом касании.
  });


  introScreen.style.display = 'none';

  scene.classList.add('active');

}


// ─────────────────────────────
// ЗАПУСК МУЗЫКИ
// ─────────────────────────────

function startIntroMusic() {

  introMusic.volume = 1;

  introMusic.play().catch(() => {
    // Если браузер заблокировал звук,
    // он будет запущен после первого взаимодействия.
  });

}


// ─────────────────────────────
// ЗАПУСК ВИДЕО
// ─────────────────────────────

function startVideo() {

  if (!isMobilePortrait()) {
    return;
  }

  introVideo.muted = true;

  const videoPromise = introVideo.play();

  if (videoPromise !== undefined) {

    videoPromise
      .then(() => {

        startIntroMusic();

      })
      .catch(() => {

        // Видео не должно блокироваться,
        // поэтому пробуем запустить его после касания.

      });

  } else {

    startIntroMusic();

  }

}


// ─────────────────────────────
// ЗАВЕРШЕНИЕ ВИДЕО
// ─────────────────────────────

introVideo.addEventListener('ended', function () {

  showAtelier();

});


// ─────────────────────────────
// ПЕРВОЕ ВЗАИМОДЕЙСТВИЕ
// ─────────────────────────────

function unlockAudio() {

  if (!isMobilePortrait()) {
    return;
  }


  // Если вступительная музыка ещё не играет,
  // пытаемся запустить её.

  if (
    introScreen.style.display !== 'none' &&
    introVideo.currentTime < introVideo.duration
  ) {

    introMusic.play().catch(() => {});

  }


  // Если видео уже закончилось —
  // запускаем фоновую музыку.

  if (
    introVideo.ended ||
    introScreen.style.display === 'none'
  ) {

    bgMusic.play().catch(() => {});

  }

}


document.addEventListener('touchstart', unlockAudio, {
  passive: true
});

document.addEventListener('click', unlockAudio);


// ─────────────────────────────
// ЛЕПЕСТКИ / APPLE
// ─────────────────────────────

let appleInterval = null;

let isHolding = false;


// Создание одного яблока

function createApple(x, y) {

  const apple = document.createElement('div');

  apple.classList.add('apple-particle');


  // Чередуем два изображения

  const image =
    Math.random() < 0.5
      ? 'apple 1.png'
      : 'apple 2.png';

  apple.style.backgroundImage = `url("${image}")`;


  // Случайное направление

  const angle =
    Math.random() * Math.PI * 2;

  const distance =
    70 + Math.random() * 150;


  const moveX =
    Math.cos(angle) * distance;

  const moveY =
    Math.sin(angle) * distance;


  const rotation =
    -180 + Math.random() * 360;


  apple.style.left = x + 'px';
  apple.style.top = y + 'px';

  apple.style.setProperty(
    '--move-x',
    moveX + 'px'
  );

  apple.style.setProperty(
    '--move-y',
    moveY + 'px'
  );

  apple.style.setProperty(
    '--rotation',
    rotation + 'deg'
  );


  // Немного случайный размер

  const size =
    22 + Math.random() * 24;

  apple.style.width = size + 'px';
  apple.style.height = size + 'px';


  document.body.appendChild(apple);


  // Удаляем после окончания анимации

  setTimeout(() => {

    apple.remove();

  }, 3000);

}


// ─────────────────────────────
// НАЧАЛО УДЕРЖАНИЯ
// ─────────────────────────────

function startAppleEffect(x, y) {

  if (isHolding) {
    return;
  }

  isHolding = true;


  // Первый всплеск сразу

  createApple(x, y);


  // Затем бесконечно создаём новые

  appleInterval = setInterval(() => {

    if (!isHolding) {
      return;
    }


    createApple(
      x + (-20 + Math.random() * 40),
      y + (-20 + Math.random() * 40)
    );

  }, 180);

}


// ─────────────────────────────
// ОКОНЧАНИЕ УДЕРЖАНИЯ
// ─────────────────────────────

function stopAppleEffect() {

  isHolding = false;


  if (appleInterval !== null) {

    clearInterval(appleInterval);

    appleInterval = null;

  }

}


// ─────────────────────────────
// МЫШЬ
// ─────────────────────────────

document.addEventListener('mousedown', function (event) {

  startAppleEffect(
    event.clientX,
    event.clientY
  );

});


document.addEventListener('mouseup', function () {

  stopAppleEffect();

});


document.addEventListener('mouseleave', function () {

  stopAppleEffect();

});


// ─────────────────────────────
// СЕНСОРНЫЙ ЭКРАН
// ─────────────────────────────

document.addEventListener('touchstart', function (event) {

  const touch = event.touches[0];

  if (!touch) {
    return;
  }


  startAppleEffect(
    touch.clientX,
    touch.clientY
  );

}, {
  passive: true
});


document.addEventListener('touchend', function () {

  stopAppleEffect();

}, {
  passive: true
});


document.addEventListener('touchcancel', function () {

  stopAppleEffect();

}, {
  passive: true
});


// ─────────────────────────────
// ЕСЛИ ПОВЕРНУЛИ ТЕЛЕФОН
// ─────────────────────────────

function checkOrientation() {

  if (isMobilePortrait()) {

    unsupportedScreen.style.display = 'none';

  } else {

    unsupportedScreen.style.display = 'flex';

    introScreen.style.display = 'none';

    scene.classList.remove('active');

    introVideo.pause();
    introMusic.pause();
    bgMusic.pause();

  }

}


window.addEventListener('resize', checkOrientation);

window.addEventListener('orientationchange', function () {

  setTimeout(checkOrientation, 100);

});


// ─────────────────────────────
// ЗАПУСК
// ─────────────────────────────

checkOrientation();

if (isMobilePortrait()) {

  startVideo();

}