const startBtn = document.getElementById('startBtn'); 
const bgMusic = document.getElementById('bgMusic'); 
const vinyl = document.getElementById('vinyl'); 

let playing = false; 
let fadingInterval = null; 

// ===== Кнопка «НАЧАТЬ» — музыка + скролл =====
startBtn.addEventListener('click', () => { 
  playMusic(); 
  document.getElementById('second').scrollIntoView({ behavior: 'smooth' }); 
}); 

// ===== Клик по винилу — пауза/старт =====
vinyl.addEventListener('click', () => { 
  if (playing) { 
    fadeOutAndPause(); 
  } else { 
    playMusic(); 
  } 
}); 

function playMusic() { 
  clearInterval(fadingInterval); 
  bgMusic.volume = 0; 
  const target = 0.8; 
  const step = 0.05; 

  const fadeIn = setInterval(() => { 
    bgMusic.volume = Math.min(target, bgMusic.volume + step); 
    if (bgMusic.volume >= target) clearInterval(fadeIn); 
  }, 120); 

  bgMusic.play(); 
  playing = true; 
  vinyl.classList.add('playing'); 
} 

function fadeOutAndPause() { 
  clearInterval(fadingInterval); 
  fadingInterval = setInterval(() => { 
    if (bgMusic.volume > 0.06) { 
      bgMusic.volume = Math.max(0, bgMusic.volume - 0.06); 
    } else { 
      clearInterval(fadingInterval); 
      bgMusic.pause(); 
      bgMusic.currentTime = 0; 
      playing = false; 
      vinyl.classList.remove('playing'); 
      bgMusic.volume = 0.8; 
    } 
  }, 120); 
}

// ===== Смена факультета при клике на гербы =====
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

  const data = { /* ... твой объект data ... */ };

  herbs.forEach(herb => {
    herb.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      if (!data[id]) return;

      const item = data[id];

      // ===== Скрываем элементы перед сменой =====
      [character, cardText].forEach(el => {
        el.style.transition = "transform 0.5s ease, opacity 0.5s ease";
        el.style.opacity = "0";
      });

      setTimeout(() => {
        // ===== Меняем контент =====
        background.style.backgroundImage = `url('third_block_home_page/${item.background}')`;
        cardBackground.src = `third_block_home_page/${item.cardBg}`;
        miniHerb.src = `third_block_home_page/${item.miniHerb}`;

        miniHerb.style.width = ["4","5","6","7"].includes(id) ? "70px" : "65px";
        miniHerb.style.height = "60px";

        faculty.textContent = item.faculty;
        descSmall.innerHTML = item.descSmall;
        descBig.innerHTML = item.descBig;

        character.src = `third_block_home_page/${item.character}`;
        character.style.width = item.width || "420px";

        // ===== Позиционирование персонажей =====
        const positions = {
          "2": { left: "-30px", bottom: "-110px", width: "340px" },
          "3": { left: "-90px", bottom: "-190px", width: "430px" },
          "4": { left: "-70px", bottom: "-120px", width: "430px" },
          "5": { left: "-90px", bottom: "-80px", width: "430px" },
          "6": { left: "-80px", bottom: "-80px", width: "440px" },
          "7": { left: "-100px", bottom: "-100px", width: "400px" }
        };
        const pos = positions[id] || { left: "-70px", bottom: "-200px" };
        character.style.left = pos.left;
        character.style.bottom = pos.bottom;
        character.style.width = pos.width || character.style.width;

        // ===== Плавное появление =====
        requestAnimationFrame(() => {
          [character, cardText].forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "translate(0,0)";
          });
        });
      }, 500);
    });
  });

  // ===== Кастомный курсор =====
  document.body.style.cursor = "url('first_block_home_page/custom-cursor.png'), auto";
  const interactive = document.querySelectorAll('button, a, input, textarea, select, label');
  interactive.forEach(el => el.style.cursor = "url('first_block_home_page/custom-cursor.png'), auto");

  // ===== Анимация лепестков =====
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

    setTimeout(() => petal.remove(), 1500);
  }

  document.addEventListener('click', e => createPetal(e.clientX, e.clientY));

  let isMouseDown = false;
  document.addEventListener('mousedown', e => { if (e.button === 0) isMouseDown = true; });
  document.addEventListener('mouseup', e => { if (e.button === 0) isMouseDown = false; });
  document.addEventListener('mousemove', e => {
    if (isMouseDown && (!window.lastPetalTime || Date.now() - window.lastPetalTime > 50)) {
      createPetal(e.clientX, e.clientY);
      window.lastPetalTime = Date.now();
    }
  });
});
