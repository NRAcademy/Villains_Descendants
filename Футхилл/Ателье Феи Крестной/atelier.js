// ─────────────────────────────
// ЭЛЕМЕНТЫ
// ─────────────────────────────

const introVideo = document.getElementById('introVid');
const introMusic = document.getElementById('introMusic');
const bgMusic = document.getElementById('bgMusic');

const introScreen = document.getElementById('intro-video');
const introFlash = document.getElementById('intro-flash');

const scene = document.getElementById('scene');

const atelierButton = document.getElementById('atelier-button');

const unsupportedScreen =
  document.getElementById('unsupported-screen');

const returnText =
  document.getElementById('return-text');

const customCursor =
  document.getElementById('custom-cursor');


// ─────────────────────────────
// ЕЖЕДНЕВНЫЙ НАРЯД
// ─────────────────────────────

// Сюда добавляй новые наряды.

const outfits = [
  'наряд 1.png',
  'наряд 2.png',
  'наряд 3.png',
  'наряд 4.png'
  'наряд 5.png',
  'наряд 6.png',
  'наряд 7.png',
  'наряд 8.png',
  'наряд 9.png',
  'наряд 10.png',
  'наряд 11.png',
  'наряд 12.png',
  'наряд 13.png',
  'наряд 14.png',
  'наряд 15.png',
  'наряд 16.png'
];


// ─────────────────────────────
// УНИКАЛЬНЫЙ ID УСТРОЙСТВА
// ─────────────────────────────

let atelierDeviceId =
  localStorage.getItem('atelierDeviceId');

if (!atelierDeviceId) {

  atelierDeviceId =
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2);

  localStorage.setItem(
    'atelierDeviceId',
    atelierDeviceId
  );

}


// ─────────────────────────────
// ХЭШ
// ─────────────────────────────

function atelierHashCode(str) {

  let h = 0;

  for (let i = 0; i < str.length; i++) {

    h =
      Math.imul(31, h) +
      str.charCodeAt(i) | 0;

  }

  return Math.abs(h);

}


// ─────────────────────────────
// СЕГОДНЯШНЯЯ ДАТА
// ─────────────────────────────

const atelierNow = new Date();

const atelierToday = [
  atelierNow.getFullYear(),
  String(atelierNow.getMonth() + 1).padStart(2, '0'),
  String(atelierNow.getDate()).padStart(2, '0')
].join('-');


// ─────────────────────────────
// ВЫБОР НАРЯДА
// ─────────────────────────────

const savedOutfit = JSON.parse(
  localStorage.getItem('atelierDay') || 'null'
);

let outfitIndex;


if (
  savedOutfit &&
  savedOutfit.date === atelierToday &&
  outfits[savedOutfit.index]
) {

  // Сегодня уже был выбран наряд.
  outfitIndex = savedOutfit.index;

} else {

  // Новый день.

  let newIndex =
    atelierHashCode(
      atelierDeviceId + atelierToday
    ) % outfits.length;


  // Не повторяем вчерашний наряд.

  if (
    savedOutfit &&
    outfits.length > 1 &&
    newIndex === savedOutfit.index
  ) {

    newIndex =
      (newIndex + 1) % outfits.length;

  }


  outfitIndex = newIndex;


  localStorage.setItem(
    'atelierDay',
    JSON.stringify({
      date: atelierToday,
      index: outfitIndex
    })
  );

}


// Устанавливаем сегодняшний наряд.

document.getElementById('outfit').src =
  outfits[outfitIndex];


// ─────────────────────────────
// ПРОВЕРКА УСТРОЙСТВА
// ─────────────────────────────

function isMobilePortrait() {

  const isMobile =
    window.matchMedia(
      '(max-width: 767px)'
    ).matches;

  const isPortrait =
    window.matchMedia(
      '(orientation: portrait)'
    ).matches;

  return isMobile && isPortrait;

}


// ─────────────────────────────
// КАСТОМНЫЙ КУРСОР
// ─────────────────────────────

if (
  window.matchMedia('(pointer: fine)').matches
) {

  customCursor.style.display = 'block';

  document.addEventListener(
    'mousemove',
    function (event) {

      customCursor.style.left =
        event.clientX + 'px';

      customCursor.style.top =
        event.clientY + 'px';

    }
  );

}


// ─────────────────────────────
// ВОЗВРАТ В ФУТХИЛЛ
// ─────────────────────────────

function returnToFoothill() {

  window.location.href =
    '../foothill.html';

}


returnText.addEventListener(
  'click',
  returnToFoothill
);


atelierButton.addEventListener(
  'click',
  returnToFoothill
);


// ─────────────────────────────
// ОТКРЫТИЕ АТЕЛЬЕ
// ─────────────────────────────

function showAtelier() {

  // Видео исчезает.

  introScreen.style.display = 'none';


  // Появляется основная сцена.

  scene.classList.add('active');

}


// ─────────────────────────────
// ПОСЛЕ ОКОНЧАНИЯ ВСТУПИТЕЛЬНОЙ МУЗЫКИ
// ─────────────────────────────

introMusic.addEventListener(
  'ended',
  function () {

    // Только теперь запускаем
    // фоновую музыку.

    bgMusic.currentTime = 0;

    bgMusic.play().catch(() => {});

  }
);


// ─────────────────────────────
// ЗАПУСК ВСТУПИТЕЛЬНОЙ МУЗЫКИ
// ─────────────────────────────

function startIntroMusic() {

  introMusic.volume = 1;

  introMusic.play().catch(() => {

    // Если браузер заблокировал
    // автоматический звук,
    // он будет запущен после касания.

  });

}


// ─────────────────────────────
// ЗАПУСК ВИДЕО
// ─────────────────────────────

function startVideo() {

  if (!isMobilePortrait()) {
    return;
  }


  // Видео всегда без собственного звука.

  introVideo.muted = true;
  introVideo.volume = 0;


  // Начинаем с самого начала.

  introVideo.currentTime = 0;


  // Сначала запускаем видео.

  const videoPromise =
    introVideo.play();


  if (videoPromise !== undefined) {

    videoPromise
      .then(function () {

        // Видео успешно запустилось.
        // Теперь пытаемся запустить музыку.

        startIntroMusic();

      })
      .catch(function () {

        // Если браузер заблокировал запуск,
        // ждём первого касания.

      });

  }

}


// ─────────────────────────────
// ОКОНЧАНИЕ ВИДЕО
// ─────────────────────────────

introVideo.addEventListener(
  'ended',
  function () {

    // Белая вспышка.

    introFlash.classList.add(
      'flash-active'
    );


    // Через 150 мс,
    // когда вспышка уже яркая,
    // показываем ателье.

    setTimeout(
      function () {

        showAtelier();

      },
      150
    );


    // После полного исчезновения
    // вспышки убираем её.

    setTimeout(
      function () {

        introFlash.classList.remove(
          'flash-active'
        );

      },
      2300
    );

  }
);


// ─────────────────────────────
// ПЕРВОЕ ВЗАИМОДЕЙСТВИЕ
// ─────────────────────────────

function unlockAudio() {

  if (!isMobilePortrait()) {
    return;
  }


  // Пока вступительная музыка
  // не закончилась — запускаем именно её.

  if (!introMusic.ended) {

    introMusic.play().catch(() => {});

    return;

  }


  // Фоновую музыку запускаем
  // только после окончания вступительной.

  bgMusic.play().catch(() => {});

}


document.addEventListener(
  'touchstart',
  unlockAudio,
  {
    passive: true
  }
);


document.addEventListener(
  'click',
  unlockAudio
);


// ─────────────────────────────
// APPLE / ЛЕПЕСТКИ
// ─────────────────────────────

let appleInterval = null;

let isHolding = false;


function createApple(x, y) {

  const apple =
    document.createElement('div');

  apple.classList.add(
    'apple-particle'
  );


  const image =
    Math.random() < 0.5
      ? 'apple 1.png'
      : 'apple 2.png';

  apple.style.backgroundImage =
    `url("${image}")`;


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


  const size =
    22 + Math.random() * 24;

  apple.style.width =
    size + 'px';

  apple.style.height =
    size + 'px';


  document.body.appendChild(apple);


  setTimeout(
    function () {

      apple.remove();

    },
    3000
  );

}


// ─────────────────────────────
// НАЧАЛО УДЕРЖАНИЯ
// ─────────────────────────────

function startAppleEffect(x, y) {

  if (isHolding) {
    return;
  }

  isHolding = true;


  createApple(x, y);


  appleInterval =
    setInterval(
      function () {

        if (!isHolding) {
          return;
        }


        createApple(
          x + (-20 + Math.random() * 40),
          y + (-20 + Math.random() * 40)
        );

      },
      180
    );

}


// ─────────────────────────────
// ОКОНЧАНИЕ УДЕРЖАНИЯ
// ─────────────────────────────

function stopAppleEffect() {

  isHolding = false;


  if (appleInterval !== null) {

    clearInterval(
      appleInterval
    );

    appleInterval = null;

  }

}


// ─────────────────────────────
// МЫШЬ
// ─────────────────────────────

document.addEventListener(
  'mousedown',
  function (event) {

    startAppleEffect(
      event.clientX,
      event.clientY
    );

  }
);


document.addEventListener(
  'mouseup',
  function () {

    stopAppleEffect();

  }
);


document.addEventListener(
  'mouseleave',
  function () {

    stopAppleEffect();

  }
);


// ─────────────────────────────
// СЕНСОРНЫЙ ЭКРАН
// ─────────────────────────────

document.addEventListener(
  'touchstart',
  function (event) {

    const touch =
      event.touches[0];

    if (!touch) {
      return;
    }


    startAppleEffect(
      touch.clientX,
      touch.clientY
    );

  },
  {
    passive: true
  }
);


document.addEventListener(
  'touchend',
  function () {

    stopAppleEffect();

  },
  {
    passive: true
  }
);


document.addEventListener(
  'touchcancel',
  function () {

    stopAppleEffect();

  },
  {
    passive: true
  }
);


// ─────────────────────────────
// ПРОВЕРКА ОРИЕНТАЦИИ
// ─────────────────────────────

function checkOrientation() {

  if (isMobilePortrait()) {

    unsupportedScreen.style.display =
      'none';

    // На вертикальном телефоне
    // вступительный экран должен быть виден.

    if (
      !introVideo.ended &&
      introScreen.style.display === 'none'
    ) {

      introScreen.style.display =
        'flex';

    }

  } else {

    // ПК / горизонтальный телефон.

    unsupportedScreen.style.display =
      'flex';

    introScreen.style.display =
      'none';

    scene.classList.remove(
      'active'
    );

    introVideo.pause();
    introMusic.pause();
    bgMusic.pause();

  }

}


window.addEventListener(
  'resize',
  checkOrientation
);


window.addEventListener(
  'orientationchange',
  function () {

    setTimeout(
      checkOrientation,
      100
    );

  }
);


// ─────────────────────────────
// ЗАПУСК
// ─────────────────────────────

checkOrientation();


if (isMobilePortrait()) {

  startVideo();

}
