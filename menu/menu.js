/* =================================================================
   1. ИНИЦИАЛИЗАЦИЯ
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // кастомный курсор
    document.documentElement.style.cursor =
        "url('custom-cursor.png') 0 0, auto";

    document.body.style.cursor =
        "url('custom-cursor.png') 0 0, auto";

    // проверка блокировки (если используется)
    const block = localStorage.getItem("potion_daily_block");
    if (block && Date.now() < parseInt(block)) return;

    // запуск логики
    initSwipeHeader();
    initPotionClick();
});

/* =================================================================
   2. FULLSCREEN + СКРЫТИЕ ЗАГРУЗКИ
   ================================================================= */

document.addEventListener("touchstart", handleFirstTouch, { once: true });

function handleFirstTouch() {

    const root = document.documentElement;

    const requestFullscreen =
        root.requestFullscreen ||
        root.webkitRequestFullscreen ||
        root.mozRequestFullScreen ||
        root.msRequestFullscreen;

    if (requestFullscreen) {
        try {
            requestFullscreen.call(root);
        } catch (e) {}
    }

    hideLoader();
}

/* =================================================================
   3. СКРЫТИЕ ЭКРАНА ЗАГРУЗКИ
   ================================================================= */

function hideLoader() {
    const loader = document.getElementById("loading-screen");

    if (!loader) return;

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 1000);
}

/* =================================================================
   4. ЗЕЛЬЕ (ПЕРЕХОД В ИГРУ)
   ================================================================= */

function initPotionClick() {
    const potion = document.getElementById("potion-talkative");

    if (!potion) return;

    potion.addEventListener("click", () => {
        window.location.href = "../первое_зелье/first_potion.html";
    });
}

/* =================================================================
   5. СВАЙП ШАПКИ (ПОКАЗ / СКРЫТИЕ)
   ================================================================= */

function initSwipeHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let startY = 0;

    document.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", (e) => {
        const endY = e.changedTouches[0].clientY;
        const diff = endY - startY;

        if (Math.abs(diff) < 50) return;

        if (diff > 0) {
            header.classList.remove("hidden");
        } else {
            header.classList.add("hidden");
        }
    }, { passive: true });
}

/* =================================================================
   6. ЭФФЕКТ "МАГИЧЕСКИХ ЯБЛОК"
   ================================================================= */

const appleImages = [
    "apple 1.png",
    "apple 2.png",
    "apple 3.png"
];

document.addEventListener("click", (e) => {
    createApple(e.clientX, e.clientY);
});

let lastAppleTime = 0;

document.addEventListener("mousemove", (e) => {
    if (!isMouseDown()) return;

    if (Date.now() - lastAppleTime < 60) return;

    createApple(e.clientX, e.clientY);
    lastAppleTime = Date.now();
});

function isMouseDown() {
    return window.__mouseDown === true;
}

document.addEventListener("mousedown", (e) => {
    if (e.button === 0) window.__mouseDown = true;
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 0) window.__mouseDown = false;
});

function createApple(x, y) {

    const apple = document.createElement("div");
    const img = appleImages[Math.floor(Math.random() * appleImages.length)];

    apple.style.position = "fixed";
    apple.style.left = (x - 12) + "px";
    apple.style.top = (y - 12) + "px";
    apple.style.width = "30px";
    apple.style.height = "30px";
    apple.style.backgroundImage = `url('${img}')`;
    apple.style.backgroundSize = "contain";
    apple.style.backgroundRepeat = "no-repeat";
    apple.style.pointerEvents = "none";
    apple.style.zIndex = "999999";
    apple.style.transition = "transform 1.5s ease-out, opacity 1.5s ease-out";

    document.body.appendChild(apple);

    const dx = (Math.random() - 0.5) * 120;
    const rot = (Math.random() - 0.5) * 540;

    requestAnimationFrame(() => {
        apple.style.transform = `translate(${dx}px, -140px) rotate(${rot}deg)`;
        apple.style.opacity = "0";
    });

    setTimeout(() => apple.remove(), 1500);
}
