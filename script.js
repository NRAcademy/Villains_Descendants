const startBtn = document.getElementById('startBtn'); 
const bgMusic = document.getElementById('bgMusic'); 
const vinyl = document.getElementById('vinyl'); 

let playing = false; 
let fading = null; 

// Кнопка «НАЧАТЬ» — музыка + скролл
startBtn.addEventListener('click', () => { 
  playMusic(); 
  document.getElementById('second').scrollIntoView({ behavior: 'smooth' }); 
}); 

// Клик по пластинке — пауза/старт
vinyl.addEventListener('click', () => { 
  if (playing) { 
    fadeOutAndPause(); 
  } else { 
    playMusic(); 
  } 
}); 

function playMusic() { 
  clearInterval(fading); 
  bgMusic.volume = 0.0; 
  const target = 0.8; 
  const step = 0.05; 
  const iv = setInterval(() => { 
    bgMusic.volume = Math.min(target, bgMusic.volume + step); 
    if (bgMusic.volume >= target) clearInterval(iv); 
  }, 120); 
  bgMusic.play(); 
  playing = true; 
  vinyl.classList.add('playing'); 
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
  
  // НАХОДИМ КНОПКУ «ПОДРОБНЕЕ»
  const buttonBox = document.querySelector(".button-box");

  const data = {
    1: {
      background: "фон 3.png",
      character: "персонаж 1.png",
      miniHerb: "mini-herb-1.png",
      cardBg: "подкладка.png",
      faculty: "Heartslabiyul",
      link: "https://vk.com/pages?oid=-237442725&p=Heartslabyul",
      descSmall: `По мотивам: Алиса в стране чудес<br>
                  Вдохновлен: Красная королева<br>
                  Сильные стороны: Дисциплина и порядок<br>
                  Описание:`,
      descBig: `Хартслабьюл, основанный на суровом наследии Червонной<br>
                Королевы, славится не только своей строгостью, но и<br>
                длинным списком законов. Каждый студент обязан<br>
                соблюдать все 810 правил, составленных Королевой.<br>
                Нарушение хотя бы одного из них влечёт за собой суровое<br>
                наказание, символически именуемое «казнью».`
    },
    2: {
      background: "фон 3 2.png",
      character: "персонаж 2.png",
      width: "280px",
      miniHerb: "мини герб 2.png",
      cardBg: "подкладка 2.png",
      faculty: "Savanaclaw",
      link: "https://vk.com/pages?oid=-237442725&p=Savanaclaw",
      descSmall: `По мотивам: Король Лев<br>
                  Вдохновлен: Король зверей Шрам<br>
                  Сильные стороны: Сила и выносливость<br>
                  Описание:`,
      descBig: `Саванаклоу, основанный на принципах упрямства<br>
                и могущества Короля зверей, славится своей<br>
                силой и спортивными достижениями. Здесь превыше<br>
                всего ценятся выносливость, физическая форма<br>
                и боевые искусства.`
    },
    3: {
      background: "фон 3 3.png",
      character: "персонаж 3.png",
      width: "360px",
      miniHerb: "мини герб 3.png",
      cardBg: "подкладка 3.png",
      faculty: "Octavinelle",
      link: "https://vk.com/pages?oid=-237442725&p=Octavinelle",
      descSmall: `По мотивам: Русалочка<br>
                  Вдохновлен: Морская ведьма Урсула<br>
                  Сильные стороны: Хитрость и торговая жилка<br>
                  Описание:`,
      descBig: `Основанный в честь хитроумной Морской ведьмы,<br>
                Октавинель известен тем, что здесь учатся самые<br>
                находчивые и изворотливые студенты. Их умение<br>
                мыслить стратегически и заключать сделки делает<br>
                их незаменимыми посредниками и опасными противниками.`
    },
    4: {
      background: "фон 3 4.png",
      character: "персонаж 4.png",
      width: "360px",
      miniHerb: "мини герб 4.png",
      cardBg: "подкладка 4.png",
      faculty: "Scarabia",
      link: "https://vk.com/pages?oid=-237442725&p=Scarabia",
      descSmall: `По мотивам: Аладдин<br>
                  Вдохновлен: Колдун песков Джафар<br>
                  Сильные стороны: Харизма и убеждение<br>
                  Описание:`,
      descBig: `Скарабия, основанный на мудрости и скрупулёзном<br>
                планировании Колдуна Песков, объединяет студентов,<br>
                чья сила в хитрости и дальновидности. Девиз<br>
                общежития: «Планируй с предвкушением». Здесь ценят<br>
                способность продумывать каждую деталь перед действием`
    },
    5: {
      background: "фон 3 5.png",
      character: "персонаж 5.png",
      width: "360px",
      miniHerb: "мини герб 5.png",
      cardBg: "подкладка 5.png",
      faculty: "Pomefiore",
      link: "https://vk.com/pages?oid=-237442725&p=Pomefiore",
      descSmall: `По мотивам: Белоснежка и семь гномов<br>
                  Вдохновлен: Злая Королева<br>
                  Сильные стороны: Стремление к совершенству и красоте<br>
                  Описание:`,
      descBig: `Помфиор, основанный на идеалах Прекрасной Королевы,<br>
                воспитывает студентов в духе утончённости и стремления<br>
                к красоте. Здесь превыше всего ценится красота<br>
                во всех проявлениях, а также мастерство<br>
                в алхимии и зельеварении.`
    },
    6: {
      background: "фон 3 6.png",
      character: "персонаж 6.png",
      width: "360px",
      miniHerb: "мини герб 6.png",
      cardBg: "подкладка 6.png",
      faculty: "Ignihyde",
      link: "https://vk.com/pages?oid=-237442725&p=Ignihyde",
      descSmall: `По мотивам: Геркулес<br>
                  Вдохновлен: Подземный бог Аид<br>
                  Сильные стороны: Интеллект и изобретательность<br>
                  Описание:`,
      descBig: `Игнихайд, основанный на упорстве Короля<br>
                Подземного мира, объединяет студентов, посвятивших<br>
                себя исследованию интеграции магии и технологий.<br>
                Студенты факультета ведут отшельнический образ жизни,<br>
                предпочитая уединение и сосредоточенность.`
    },
    7: {
      background: "фон 3 7.png",
      character: "персонаж 7.png",
      width: "360px",
      miniHerb: "мини герб 7.png",
      cardBg: "подкладка 7.png",
      faculty: "Diasomnia",
      link: "https://vk.com/pages?oid=-237442725&p=Diasomnia",
      descSmall: `По мотивам: Спящая красавица<br>
                  Вдохновлен: Терновая ведьма Малефисента<br>
                  Сильные стороны: Могущество и талант в магии.<br>
                  Описание:`,
      descBig: `Диасомния, основанная на принципах элегантности<br>
                Терновой ведьмы, собирает студентов, преуспевающих<br>
                в общей магии. Это одно из самых загадочных и<br>
                таинственных open-общежитий, окутанное атмосферой<br>
                мрачного величия.`
    }
  };

  // ИНИЦИАЛИЗАЦИЯ ССЫЛКИ ПО УМОЛЧАНИЮ (При загрузке страницы для Heartslabyul)
  if (buttonBox && data[1]) {
    buttonBox.onclick = () => window.open(data[1].link, '_blank');
  }

  herbs.forEach(herb => {
    herb.addEventListener("click", () => {
      const id = herb.dataset.id;
      if (!data[id]) return;

      // 1. Скрываем персонажа и текст
      character.style.transition = "transform 0.5s ease, opacity 0.5s ease";
      character.style.transform = "translateX(-200px)";
      character.style.opacity = "0";

      cardText.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      cardText.style.opacity = "0";
      cardText.style.transform = "translateY(10px)";

      // 2. Через 500 мс — меняем контент и снова показываем
      setTimeout(() => {
        const item = data[id];

        // Обновляем фон, подкладку, мини-герб
        background.style.backgroundImage = `url('third_block_home_page/${item.background}')`;
        cardBackground.src = `third_block_home_page/${item.cardBg}`;
        miniHerb.src = `third_block_home_page/${item.miniHerb}`;

        // ДИНАМИЧЕСКИ ОБНОВЛЯЕМ ССЫЛКУ КНОПКИ
        if (buttonBox) {
          buttonBox.onclick = () => window.open(item.link, '_blank');
        }

        // По умолчанию размеры мини-герба
        miniHerb.style.width = "65px";
        miniHerb.style.height = "60px";

        // Отдельный размер для id "1", "2", "3"
        if (["1", "2", "3"].includes(id)) {
          miniHerb.style.width = "65px";
          miniHerb.style.height = "60px";
        }

        // Общий увеличенный размер для 4, 5, 6, 7
        if (["4", "5", "6", "7"].includes(id)) {
          miniHerb.style.width = "70px";
          miniHerb.style.height = "60px";
        }

        // Обновляем текст
        faculty.textContent = item.faculty;
        descSmall.innerHTML = item.descSmall;
        descBig.innerHTML = item.descBig;

        // Обновляем персонажа
        character.src = `third_block_home_page/${item.character}`;
        character.style.width = item.width || "420px";

        // Позиционируем персонажа
        if (id === "2") {
          character.style.left = "-30px";
          character.style.bottom = "-110px";
          character.style.width = "340px";
        } else if (id === "3") {
          character.style.left = "-90px";
          character.style.bottom = "-190px";
          character.style.width = "430px";
        } else if (id === "4") {
          character.style.left = "-70px";
          character.style.bottom = "-120px";
          character.style.width = "430px";
        } else if (id === "5") {
          character.style.left = "-90px";
          character.style.bottom = "-80px";
          character.style.width = "430px";
         } else if (id === "6") {
          character.style.left = "-80px";
          character.style.bottom = "-80px";
          character.style.width = "440px";
        } else if (id === "7") {
          character.style.left = "-100px";
          character.style.bottom = "-100px";
          character.style.width = "400px";
        } else {
          character.style.left = "-70px";
          character.style.bottom = "-200px";
        }

        // Готовим эффект появления персонажа и текста
        character.style.transform = "translateX(200px)";
        character.style.opacity = "0";

        cardText.style.transform = "translateY(10px)";
        cardText.style.opacity = "0";

        // 3. Плавно показываем персонажа и текст
        requestAnimationFrame(() => {
          character.style.transition = "transform 0.5s ease, opacity 0.5s ease";
          character.style.transform = "translateX(0)";
          character.style.opacity = "1";

          cardText.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          cardText.style.opacity = "1";
          cardText.style.transform = "translateY(0)";
        });
      }, 500);
    });
  });
});

document.body.style.cursor = "url('first_block_home_page/custom-cursor.png') 0 0, auto";

// Анимация лепестков при клике или зажатии
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
  petal.style.zIndex = 9999;
  petal.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';

  document.body.appendChild(petal);

  const randomX = (Math.random() - 0.5) * 100;
  const randomRotate = (Math.random() - 0.5) * 720;

  requestAnimationFrame(() => {
    petal.style.transform = `translate(${randomX}px, -150px) rotate(${randomRotate}deg)`;
    petal.style.opacity = '0';
  });

  setTimeout(() => {
    petal.remove();
  }, 1500);
}

// Один лепесток при клике
document.addEventListener('click', e => {
  createPetal(e.clientX, e.clientY);
});

// Следование лепестков за курсором при зажатии
let isMouseDown = false;

document.addEventListener('mousedown', e => {
  if (e.button === 0) isMouseDown = true;
});

document.addEventListener('mouseup', e => {
  if (e.button === 0) isMouseDown = false;
});

document.addEventListener('mousemove', e => {
  if (isMouseDown && (!window.lastPetalTime || Date.now() - window.lastPetalTime > 50)) {
    createPetal(e.clientX, e.clientY);
    window.lastPetalTime = Date.now();
  }
})

// Запрет правой кнопки мыши
document.addEventListener('contextmenu', e => e.preventDefault());

// Запрет копирования
document.addEventListener('copy', e => e.preventDefault());

// Запрет горячих клавиш (Ctrl+C, Ctrl+U, Ctrl+S, F12)
document.addEventListener('keydown', e => {
  if (
    (e.ctrlKey && ['c', 'u', 's', 'a'].includes(e.key.toLowerCase())) ||
    e.key === 'F12'
  ) {
    e.preventDefault();
  }
});
