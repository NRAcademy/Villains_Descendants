// ======================================================
// ЗАГРУЗОЧНЫЙ ЭКРАН
// ======================================================

window.addEventListener("load", () => {

    const loadingScreen = document.getElementById("loading-screen");

    const coffins = [
        document.getElementById("coffin-1"),
        document.getElementById("coffin-2"),
        document.getElementById("coffin-3")
    ];

    let activeIndex = 0;

    // Анимация гробов
    const coffinInterval = setInterval(() => {
        coffins.forEach(c => { c.classList.remove("active"); c.classList.add("dark"); });
        coffins[activeIndex].classList.remove("dark");
        coffins[activeIndex].classList.add("active");
        activeIndex = (activeIndex + 1) % coffins.length;
    }, 550);

    // Печатающийся текст
    const text = "Поверни телефон и нажми дважды на экран...";
    const loadingTextEl = document.getElementById("loading-text");
    let i = 0;

    const typeInterval = setInterval(() => {
        loadingTextEl.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(typeInterval);
    }, 60);

    // Скрытие экрана через 4.2s
    setTimeout(() => {
        clearInterval(coffinInterval);
        loadingScreen.classList.add("hide");
        setTimeout(() => { loadingScreen.remove(); }, 1000);
    }, 4200);
});

// ======================================================
// ТОЛЬКО ГОРИЗОНТАЛЬНАЯ ОРИЕНТАЦИЯ
// ======================================================

function checkOrientation() {
    const overlay = document.getElementById("rotate-overlay");
    if (!overlay) return;
    // Показываем overlay только в portrait на мобиле
    const isMobile = window.innerWidth <= 1000 || window.innerHeight <= 1000;
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.style.display = (isMobile && isPortrait) ? "flex" : "none";
}

window.addEventListener("orientationchange", () => { setTimeout(checkOrientation, 100); });
window.addEventListener("resize", checkOrientation);
checkOrientation();

// ======================================================
// FULLSCREEN ПО ДВОЙНОМУ НАЖАТИЮ
// ======================================================

function openFullscreen() {
    const doc = document.documentElement;
    if (doc.requestFullscreen)            doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
    else if (doc.mozRequestFullScreen)    doc.mozRequestFullScreen();
    else if (doc.msRequestFullscreen)     doc.msRequestFullscreen();
}

document.addEventListener("dblclick", () => { openFullscreen(); });

// Двойной тап на тач-экранах
let lastTap = 0;
document.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
        openFullscreen();
        e.preventDefault();
    }
    lastTap = now;
}, { passive: false });

// ======================================================
// СКРЫТИЕ ШАПКИ СВАЙПОМ (вверх / вниз)
// ======================================================

(function () {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let startY = 0, startX = 0;
    const THRESHOLD = 30;

    document.addEventListener("touchstart", e => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener("touchend", e => {
        const dy = e.changedTouches[0].clientY - startY;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dy) < THRESHOLD || Math.abs(dy) < Math.abs(dx)) return;

        if (dy < 0) header.classList.add("header-hidden");
        else        header.classList.remove("header-hidden");
    }, { passive: true });
})();

// ======================================================
// МОДАЛ СПРАВОЧНИК
// ======================================================

(function () {
    const pages = [
        "menu/справочник/страница 1.png",
        "menu/справочник/страница 2.png",
        "menu/справочник/страница 3.png",
        "menu/справочник/страница 4.png"
    ];

    let currentPage = 0;

    const overlay   = document.getElementById("handbook-overlay");
    const modal     = document.getElementById("handbook-modal");
    const pageImg   = document.getElementById("handbook-page-img");
    const prevBtn   = document.getElementById("handbook-prev");
    const nextBtn   = document.getElementById("handbook-next");
    const openBtn   = document.getElementById("open-handbook");

    if (!overlay || !openBtn) return;

    function showPage(index) {
        currentPage = ((index % pages.length) + pages.length) % pages.length;
        pageImg.src = pages[currentPage];
    }

    function openHandbook() {
        showPage(0);
        overlay.classList.add("active");
    }

    function closeHandbook() {
        overlay.classList.remove("active");
    }

    openBtn.addEventListener("click", e => { e.preventDefault(); openHandbook(); });

    prevBtn.addEventListener("click", e => { e.stopPropagation(); showPage(currentPage - 1); });
    nextBtn.addEventListener("click", e => { e.stopPropagation(); showPage(currentPage + 1); });

    // Закрыть при клике вне модального окна
    overlay.addEventListener("click", e => {
        if (!modal.contains(e.target)) closeHandbook();
    });

    // Закрыть при тапе вне на мобиле
    overlay.addEventListener("touchend", e => {
        if (!modal.contains(e.target)) closeHandbook();
    }, { passive: true });
})();

// ======================================================
// ОСНОВНАЯ ЛОГИКА СТРАНИЦЫ
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // Кастомный курсор
    document.documentElement.style.cursor = "url('custom-cursor.png') 0 0, auto";
    document.body.style.cursor = "url('custom-cursor.png') 0 0, auto";

    // Проверка глобальной блокировки
    const globalBlockExpiry = localStorage.getItem("potion_daily_block");
    if (globalBlockExpiry) {
        const now = new Date().getTime();
        if (now < parseInt(globalBlockExpiry)) {
            console.log("Доступ заблокирован до следующего дня.");
            return;
        } else {
            localStorage.removeItem("potion_daily_block");
        }
    }

    // Выбор зелья
    const talkativePotion = document.getElementById("potion-talkative");
    if (talkativePotion) {
        talkativePotion.addEventListener("click", () => { startPotionGame(); });
    }
});

function startPotionGame() {
    window.location.href = "../первое_зелье/first_potion.html";
}

// ======================================================
// МАГИЧЕСКИЙ ЭФФЕКТ: ЯБЛОКИ
// ======================================================

const appleImages = ['apple 1.png', 'apple 2.png', 'apple 3.png'];

function createApple(x, y) {
    const apple = document.createElement('div');
    const randomImg = appleImages[Math.floor(Math.random() * appleImages.length)];

    apple.style.cssText = `
        position: fixed;
        left: ${x - 12}px;
        top: ${y - 12}px;
        width: 30px;
        height: 30px;
        background-image: url('${randomImg}');
        background-size: contain;
        background-repeat: no-repeat;
        pointer-events: none;
        z-index: 999999;
        transition: transform 1.5s ease-out, opacity 1.5s ease-out;
    `;

    document.body.appendChild(apple);

    const randomX = (Math.random() - 0.5) * 120;
    const randomRotate = (Math.random() - 0.5) * 540;

    requestAnimationFrame(() => {
        apple.style.transform = `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;
        apple.style.opacity = '0';
    });

    setTimeout(() => { apple.remove(); }, 1500);
}

document.addEventListener('click', e => { createApple(e.clientX, e.clientY); });

let isMouseDown = false;
document.addEventListener('mousedown', e => { if (e.button === 0) isMouseDown = true; });
document.addEventListener('mouseup',   e => { if (e.button === 0) isMouseDown = false; });

document.addEventListener('mousemove', e => {
    if (isMouseDown && (!window.lastAppleTime || Date.now() - window.lastAppleTime > 60)) {
        createApple(e.clientX, e.clientY);
        window.lastAppleTime = Date.now();
    }
});
