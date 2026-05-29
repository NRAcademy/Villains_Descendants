const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

const leaves = [
  "../меню/лист1.png",
  "../меню/лист2.png",
  "../меню/лист3.png",
  "../меню/лист4.png",
  "../меню/лист5.png"
];

let mouseDown = false;

/* зажата ли мышь */
document.addEventListener("mousedown", () => {
  mouseDown = true;
});

document.addEventListener("mouseup", () => {
  mouseDown = false;
});

/* обычный клик */
document.addEventListener("click", (e) => {
  createBurst(e.clientX, e.clientY);
});

/* движение с зажатой мышью */
document.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    createLeaf(e.clientX, e.clientY);
  }
});

/* взрыв листьев */
function createBurst(x, y) {
  for (let i = 0; i < 7; i++) {
    createLeaf(x, y);
  }
}

/* создание одного листа */
function createLeaf(x, y) {

  const leaf = document.createElement("img");

  leaf.src = leaves[Math.floor(Math.random() * leaves.length)];

  leaf.style.position = "fixed";
  leaf.style.left = x + "px";
  leaf.style.top = y + "px";

  leaf.style.width = "32px";
  leaf.style.height = "auto";

  leaf.style.pointerEvents = "none";
  leaf.style.zIndex = "99999";

  document.body.appendChild(leaf);

  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 120 + 40;

  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  requestAnimationFrame(() => {

    leaf.style.transition =
      "transform 1s ease-out, opacity 1s ease-out";

    leaf.style.transform =
      `translate(${dx}px, ${dy}px)
       rotate(${Math.random() * 360}deg)`;

    leaf.style.opacity = "0";
  });

  setTimeout(() => {
    leaf.remove();
  }, 1000);
}

/* ================= РАСПИСАНИЕ МОДАЛКА ================= */

const scheduleBtn = document.getElementById("open-leaderboard");
const scheduleModal = document.getElementById("scheduleModal");
const scheduleContent = document.querySelector(".schedule-content");

/* открыть */
scheduleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  scheduleModal.classList.add("active");
});

/* закрытие по клику вне картинки */
scheduleModal.addEventListener("click", (e) => {
  if (!scheduleContent.contains(e.target)) {
    scheduleModal.classList.remove("active");
  }
});

/* защита от закрытия при клике по изображению */
scheduleContent.addEventListener("click", (e) => {
  e.stopPropagation();
});

/* ================= МОДАЛКА ПРАВИЛ ================= */

const rulesModal = document.getElementById("rulesModal");

const rulesBtn = document.getElementById("open-rules");

const rulesImage = document.getElementById("rulesImage");

const rulesPrev = document.getElementById("rulesPrev");
const rulesNext = document.getElementById("rulesNext");

const rulesContent = document.querySelector(".rules-content");

/* список страниц */
const rulesPages = [
  "../правила/правила 1.png",
  "../правила/правила 2.png",
  "../правила/правила 3.png",
  "../правила/правила 4.png",
  "../правила/правила 5.png"
];

let currentRulePage = 0;

/* открыть */
rulesBtn.addEventListener("click", (e) => {

  e.preventDefault();

  rulesModal.classList.add("active");

  rulesImage.src = rulesPages[currentRulePage];
});

/* вперед */
rulesNext.addEventListener("click", () => {

  currentRulePage++;

  if (currentRulePage >= rulesPages.length) {
    currentRulePage = 0;
  }

  rulesImage.src = rulesPages[currentRulePage];
});

/* назад */
rulesPrev.addEventListener("click", () => {

  currentRulePage--;

  if (currentRulePage < 0) {
    currentRulePage = rulesPages.length - 1;
  }

  rulesImage.src = rulesPages[currentRulePage];
});

/* закрытие вне окна */
rulesModal.addEventListener("click", (e) => {

  if (!rulesContent.contains(e.target)) {
    rulesModal.classList.remove("active");
  }
});

/* защита от закрытия */
rulesContent.addEventListener("click", (e) => {
  e.stopPropagation();
});
