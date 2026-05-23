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
  if (playing) fadeOutAndPause();
  else playMusic();
});

function playMusic() {
  clearInterval(fading);
  bgMusic.volume = 0;
  bgMusic.play();

  playing = true;
  vinyl.classList.add('playing');

  const target = 0.8;
  const step = 0.05;

  fading = setInterval(() => {
    bgMusic.volume = Math.min(target, bgMusic.volume + step);
    if (bgMusic.volume >= target) clearInterval(fading);
  }, 120);
}

function fadeOutAndPause() {
  clearInterval(fading);

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
   ФАКУЛЬТЕТЫ
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const herbs = document.querySelectorAll(".herbs img");

  const background = document.querySelector(".third-block");
  const miniHerb = document.querySelector(".button-icon");
  const character = document.querySelector(".character");
  const cardBackground = document.querySelector(".background-card");
  const cardText = document.querySelector(".card-text");
  const faculty = document.querySelector(".faculty");
  const descSmall = document.querySelector(".description-small");
  const descBig = document.querySelector(".description-big");
  const buttonBox = document.querySelector(".button-box");

  const data = {
    1: {
      background: "фон 3.png",
      character: "персонаж 1.png",
      miniHerb: "мини герб 1.png",
      cardBg: "подкладка.png",
      faculty: "Heartslabyul",
      link: "https://vk.com/pages?oid=-237442725&p=Heartslabyul",
      descSmall: `По мотивам: Алиса в стране чудес<br>
                  Вдохновлен: Красная королева<br>
                  Сильные стороны: Дисциплина и порядок<br>
                  Описание:`,
      descBig: `Хартслабьюл, основанный на суровом наследии Червонной<br>
                Королевы, славится не только своей строгостью, но и<br>
                длинным списком законов.`
    },

    2: {
      background: "фон 3 2.png",
      character: "персонаж 2.png",
      miniHerb: "мини герб 2.png",
      cardBg: "подкладка 2.png",
      faculty: "Savanaclaw",
      link: "https://vk.com/pages?oid=-237442725&p=Savanaclaw",
      descSmall: `По мотивам: Король Лев<br>
                  Вдохновлен: Шрам<br>
                  Сильные стороны: Сила и выносливость`,
      descBig: `Саванаклоу славится силой и спортивными достижениями.`
    },

    3: {
      background: "фон 3 3.png",
      character: "персонаж 3.png",
      miniHerb: "мини герб 3.png",
      cardBg: "подкладка 3.png",
      faculty: "Octavinelle",
      link: "https://vk.com/pages?oid=-237442725&p=Octavinelle",
      descSmall: `По мотивам: Русалочка<br>
                  Вдохновлен: Урсула`,
      descBig: `Октавинель известен стратегами и торговцами.`
    },

    4: {
      background: "фон 3 4.png",
      character: "персонаж 4.png",
      miniHerb: "мини герб 4.png",
      cardBg: "подкладка 4.png",
      faculty: "Scarabia",
      link: "https://vk.com/pages?oid=-237442725&p=Scarabia",
      descSmall: `По мотивам: Аладдин`,
      descBig: `Скарабия ценит стратегию и интеллект.`
    },

    5: {
      background: "фон 3 5.png",
      character: "персонаж 5.png",
      miniHerb: "мини герб 5.png",
      cardBg: "подкладка 5.png",
      faculty: "Pomefiore",
      link: "https://vk.com/pages?oid=-237442725&p=Pomefiore",
      descSmall: `По мотивам: Белоснежка`,
      descBig: `Помфиор — красота и совершенство.`
    },

    6: {
      background: "фон 3 6.png",
      character: "персонаж 6.png",
      miniHerb: "мини герб 6.png",
      cardBg: "подкладка 6.png",
      faculty: "Ignihyde",
      link: "https://vk.com/pages?oid=-237442725&p=Ignihyde",
      descSmall: `По мотивам: Геркулес`,
      descBig: `Игнихайд — технологии и магия.`
    },

    7: {
      background: "фон 3 7.png",
      character: "персонаж 7.png",
      miniHerb: "мини герб 7.png",
      cardBg: "подкладка 7.png",
      faculty: "Diasomnia",
      link: "https://vk.com/pages?oid=-237442725&p=Diasomnia",
      descSmall: `По мотивам: Спящая красавица`,
      descBig: `Диасомния — магия и тайна.`
    }
  };

  /* кнопка подробнее */
  if (buttonBox) {
    buttonBox.onclick = () => window.open(data[1].link, "_blank");
  }

  /* =========================
     ПЕРЕКЛЮЧЕНИЕ ГЕРБОВ
  ========================= */

  herbs.forEach(herb => {
    herb.addEventListener("click", () => {
      const id = herb.dataset.id;
      const item = data[id];
      if (!item) return;

      /* fade out */
      character.style.opacity = "0";
      cardText.style.opacity = "0";

      setTimeout(() => {

        /* фон */
        background.style.backgroundImage =
          `url('third_block_home_page/${item.background}')`;

        cardBackground.src = `third_block_home_page/${item.cardBg}`;
        miniHerb.src = `third_block_home_page/${item.miniHerb}`;

        faculty.textContent = item.faculty;
        descSmall.innerHTML = item.descSmall;
        descBig.innerHTML = item.descBig;

        character.src = `third_block_home_page/${item.character}`;
        character.style.width = item.width || "420px";

        /* ВАЖНО: НИКАКИХ left/bottom изменений больше */
        character.style.transform = "translateX(200px)";
        character.style.opacity = "0";

        cardText.style.transform = "translateY(10px)";
        cardText.style.opacity = "0";

        if (buttonBox) {
          buttonBox.onclick = () => window.open(item.link, "_blank");
        }

        requestAnimationFrame(() => {
          character.style.transition = "transform 0.5s ease, opacity 0.5s ease";
          cardText.style.transition = "opacity 0.4s ease, transform 0.4s ease";

          character.style.transform = "translateX(0)";
          character.style.opacity = "1";

          cardText.style.transform = "translateY(0)";
          cardText.style.opacity = "1";
        });

      }, 300);
    });
  });
});

/* =========================
   КУРСОР
========================= */

document.body.style.cursor =
  "url('first_block_home_page/custom-cursor.png') 0 0, auto";

/* =========================
   ЛЕПЕСТКИ
========================= */

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
  petal.style.opacity = '1';
  petal.style.zIndex = "9999";
  petal.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';

  document.body.appendChild(petal);

  const randomX = (Math.random() - 0.5) * 100;
  const randomRotate = (Math.random() - 0.5) * 720;

  requestAnimationFrame(() => {
    petal.style.transform = `translate(${randomX}px, -150px) rotate(${randomRotate}deg)`;
    petal.style.opacity = '0';
  });

  setTimeout(() => petal.remove(), 1500);
}

/* mouse */
let isMouseDown = false;

document.addEventListener('mousedown', e => {
  if (e.button === 0) isMouseDown = true;
});

document.addEventListener('mouseup', e => {
  if (e.button === 0) {
    isMouseDown = false;
    createPetal(e.clientX, e.clientY);
  }
});

document.addEventListener('mousemove', e => {
  if (isMouseDown && (!window.lastPetalTime || Date.now() - window.lastPetalTime > 50)) {
    createPetal(e.clientX, e.clientY);
    window.lastPetalTime = Date.now();
  }
});

/* защита */
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
