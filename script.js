const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
const vinyl = document.getElementById('vinyl');

let playing = false;
let fading = null;

/* =========================
   МУЗЫКА
========================= */

startBtn.addEventListener('click', () => {
  playMusic();
  document.getElementById('second').scrollIntoView({ behavior: 'smooth' });
});

vinyl.addEventListener('click', () => {
  if (playing) {
    fadeOutAndPause();
  } else {
    playMusic();
  }
});

function playMusic() {
  if (fading) clearInterval(fading);

  bgMusic.volume = 0.0;

  const target = 0.8;
  const step = 0.05;

  const iv = setInterval(() => {
    bgMusic.volume = Math.min(target, bgMusic.volume + step);

    if (bgMusic.volume >= target) {
      clearInterval(iv);
    }
  }, 120);

  bgMusic.play();

  playing = true;
  vinyl.classList.add('playing');
}

function fadeOutAndPause() {
  if (fading) clearInterval(fading);

  fading = setInterval(() => {
    if (bgMusic.volume > 0.06) {
      bgMusic.volume = Math.max(0, bgMusic.volume - 0.06);
    } else {
      clearInterval(fading);

      bgMusic.pause();
      bgMusic.currentTime = 0;

      playing = false;
      vinyl.classList.remove('playing');

      bgMusic.volume = 0.8;
    }
  }, 120);
}

/* =========================
   ПЕРЕКЛЮЧЕНИЕ ФАКУЛЬТЕТОВ
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const herbs = document.querySelectorAll(".herbs img");
  const background = document.querySelector(".third-block");
  const miniHerb = document.querySelector(".button-icon");
  const character = document.querySelector(".character");
  const cardBackground = document.querySelector(".background-card");
  const cardText = document.querySelector(".card-text");
  const faculty = document.querySelector(".faculty");
  const descSmall = document.querySelector(".description-small");
  const descBig = document.querySelector(".description-big");

  const data = {
    1: {
      background: "фон 3.png",
      character: "персонаж 1.png",
      miniHerb: "мини герб 1.png",
      cardBg: "подкладка.png",
      faculty: "Heartslabyul",
      descSmall: `По мотивам: Алиса в стране чудес<br>
                  Вдохновлен: Красная королева<br>
                  Сильные стороны: Дисциплина и порядок<br>
                  Описание:`,
      descBig: `Хартслабьюл, основанный на суровом наследии Червонной<br>
                Королевы, славится не только своей строгостью, но и<br>
                длинным списком законов. Каждый студент обязан<br>
                соблюдать все 810 правил.`
    },

    2: {
      background: "фон 3 2.png",
      character: "персонаж 2.png",
      miniHerb: "мини герб 2.png",
      cardBg: "подкладка 2.png",
      faculty: "Savanaclaw",
      descSmall: `По мотивам: Король Лев<br>
                  Вдохновлен: Шрам<br>
                  Сильные стороны: Сила и выносливость<br>
                  Описание:`,
      descBig: `Саванаклоу славится физической мощью и спортом.`
    },

    3: {
      background: "фон 3 3.png",
      character: "персонаж 3.png",
      miniHerb: "мини герб 3.png",
      cardBg: "подкладка 3.png",
      faculty: "Octavinelle",
      descSmall: `По мотивам: Русалочка<br>
                  Вдохновлен: Урсула<br>
                  Сильные стороны: Хитрость<br>
                  Описание:`,
      descBig: `Октавинель известен стратегией и сделками.`
    },

    4: {
      background: "фон 3 4.png",
      character: "персонаж 4.png",
      miniHerb: "мини герб 4.png",
      cardBg: "подкладка 4.png",
      faculty: "Scarabia",
      descSmall: `По мотивам: Аладдин<br>
                  Вдохновлен: Джафар<br>
                  Сильные стороны: Харизма<br>
                  Описание:`,
      descBig: `Скарабия ценит планирование и интеллект.`
    },

    5: {
      background: "фон 3 5.png",
      character: "персонаж 5.png",
      miniHerb: "мини герб 5.png",
      cardBg: "подкладка 5.png",
      faculty: "Pomefiore",
      descSmall: `По мотивам: Белоснежка<br>
                  Вдохновлен: Злая Королева<br>
                  Описание:`,
      descBig: `Помфиор ценит красоту и алхимию.`
    },

    6: {
      background: "фон 3 6.png",
      character: "персонаж 6.png",
      miniHerb: "мини герб 6.png",
      cardBg: "подкладка 6.png",
      faculty: "Ignihyde",
      descSmall: `По мотивам: Геркулес<br>
                  Вдохновлен: Аид<br>
                  Описание:`,
      descBig: `Игнихайд — технологии и магия.`
    },

    7: {
      background: "фон 3 7.png",
      character: "персонаж 7.png",
      miniHerb: "мини герб 7.png",
      cardBg: "подкладка 7.png",
      faculty: "Diasomnia",
      descSmall: `По мотивам: Спящая красавица<br>
                  Вдохновлен: Малефисента<br>
                  Описание:`,
      descBig: `Диасомния — магия и тайна.`
    }
  };

  herbs.forEach(herb => {
    herb.addEventListener("click", () => {

      const id = herb.dataset.id;
      if (!data[id]) return;

      const item = data[id];

      /* ===== АНИМАЦИЯ ВЫХОДА ===== */
      character.style.transform = "translateX(-150px)";
      character.style.opacity = "0";

      cardText.style.opacity = "0";
      cardText.style.transform = "translateY(10px)";

      setTimeout(() => {

        /* ===== ОБНОВЛЕНИЕ КОНТЕНТА ===== */
        background.style.backgroundImage =
          `url('third_block_home_page/${item.background}')`;

        cardBackground.src =
          `third_block_home_page/${item.cardBg}`;

        miniHerb.src =
          `third_block_home_page/${item.miniHerb}`;

        faculty.textContent = item.faculty;
        descSmall.innerHTML = item.descSmall;
        descBig.innerHTML = item.descBig;

        character.src =
          `third_block_home_page/${item.character}`;

        /* ===== АНИМАЦИЯ ВХОДА ===== */
        character.style.transform = "translateX(150px)";
        character.style.opacity = "0";

        requestAnimationFrame(() => {
          character.style.transform = "translateX(0)";
          character.style.opacity = "1";

          cardText.style.opacity = "1";
          cardText.style.transform = "translateY(0)";
        });

      }, 400);
    });
  });
});

/* =========================
   КУРСОР + ЛЕПЕСТКИ
========================= */

document.body.style.cursor =
  "url('first_block_home_page/custom-cursor.png') 0 0, auto";

const petalImages = [
  'first_block_home_page/petal1.png',
  'first_block_home_page/petal2.png',
  'first_block_home_page/petal3.png',
  'first_block_home_page/petal4.png',
  'first_block_home_page/petal5.png'
];

function createPetal(x, y) {
  const petal = document.createElement('img');

  petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];

  petal.style.position = 'fixed';
  petal.style.left = (x - 15) + 'px';
  petal.style.top = (y - 15) + 'px';
  petal.style.width = (20 + Math.random() * 30) + 'px';
  petal.style.pointerEvents = 'none';
  petal.style.zIndex = 9999;
  petal.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';

  document.body.appendChild(petal);

  requestAnimationFrame(() => {
    petal.style.transform =
      `translate(${(Math.random() - 0.5) * 100}px, -150px)
       rotate(${(Math.random() - 0.5) * 720}deg)`;

    petal.style.opacity = '0';
  });

  setTimeout(() => petal.remove(), 1500);
}

/* click */
document.addEventListener('click', e => {
  createPetal(e.clientX, e.clientY);
});

/* hold */
let isMouseDown = false;

document.addEventListener('mousedown', e => {
  if (e.button === 0) isMouseDown = true;
});

document.addEventListener('mouseup', e => {
  if (e.button === 0) isMouseDown = false;
});

document.addEventListener('mousemove', e => {
  if (isMouseDown &&
    (!window.lastPetalTime || Date.now() - window.lastPetalTime > 50)) {
    createPetal(e.clientX, e.clientY);
    window.lastPetalTime = Date.now();
  }
});

/* security blocks */
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('copy', e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (
    (e.ctrlKey && ['c', 'u', 's', 'a'].includes(e.key.toLowerCase())) ||
    e.key === 'F12'
  ) {
    e.preventDefault();
  }
});
