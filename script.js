const startBtn = document.getElementById("startBtn");
const bgMusic = document.getElementById("bgMusic");
const vinyl = document.getElementById("vinyl");

let playing = false;

/* ===== MUSIC ===== */
startBtn.addEventListener("click", () => {
  playMusic();
});

vinyl.addEventListener("click", () => {
  playing ? pauseMusic() : playMusic();
});

function playMusic() {
  bgMusic.volume = 0;
  bgMusic.play();

  let v = 0;
  const interval = setInterval(() => {
    v += 0.05;
    bgMusic.volume = Math.min(v, 0.8);
    if (v >= 0.8) clearInterval(interval);
  }, 100);

  playing = true;
  vinyl.classList.add("playing");
}

function pauseMusic() {
  bgMusic.pause();
  playing = false;
  vinyl.classList.remove("playing");
}

/* ===== DATA ===== */
const data = {
  1: {
    faculty: "Heartslabyul",
    descSmall: "Дисциплина и порядок",
    descBig: "Описание факультета 1",
    img: "персонаж 1.png",
    mini: "мини герб 1.png"
  },
  2: {
    faculty: "Savanaclaw",
    descSmall: "Сила и выносливость",
    descBig: "Описание факультета 2",
    img: "персонаж 2.png",
    mini: "мини герб 2.png"
  }
  // остальные по аналогии
};

/* ===== ELEMENTS ===== */
const character = document.getElementById("character");
const faculty = document.getElementById("faculty");
const descSmall = document.getElementById("descSmall");
const descBig = document.getElementById("descBig");
const miniHerb = document.getElementById("miniHerb");

/* ===== HERBS ===== */
document.querySelectorAll(".herbs img").forEach(img => {
  img.addEventListener("click", () => {
    const id = img.dataset.id;
    const item = data[id];
    if (!item) return;

    // fade out
    character.style.opacity = "0";

    setTimeout(() => {

      faculty.textContent = item.faculty;
      descSmall.textContent = item.descSmall;
      descBig.textContent = item.descBig;

      character.src = "third_block_home_page/" + item.img;
      miniHerb.src = "third_block_home_page/" + item.mini;

      character.style.opacity = "1";

    }, 300);
  });
});
