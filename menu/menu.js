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

        coffins.forEach(coffin => {
            coffin.classList.remove("active");
            coffin.classList.add("dark");
        });

        coffins[activeIndex].classList.remove("dark");
        coffins[activeIndex].classList.add("active");

        activeIndex++;

        if (activeIndex >= coffins.length) {
            activeIndex = 0;
        }

    }, 550);

    // Печатающийся текст

    const text = "Пожалуйста, поверните экран";
    const loadingText = document.getElementById("loading-text");

    let i = 0;

    const typeInterval = setInterval(() => {

        loadingText.textContent += text.charAt(i);

        i++;

        if (i >= text.length) {
            clearInterval(typeInterval);
        }

    }, 70);

    // Скрытие экрана

    setTimeout(() => {

        clearInterval(coffinInterval);

        loadingScreen.classList.add("hide");

        setTimeout(() => {
            loadingScreen.remove();
        }, 1000);

    }, 4200);

});

// ======================================================
// СКРЫТИЕ ШАПКИ СВАЙПОМ
// ======================================================

const header = document.querySelector(".site-header");

let startY = 0;
let endY = 0;

document.addEventListener("touchstart", e => {

    startY = e.touches[0].clientY;

}, { passive: true });

document.addEventListener("touchmove", e => {

    endY = e.touches[0].clientY;

}, { passive: true });

document.addEventListener("touchend", () => {

    const diff = startY - endY;

    // Свайп вверх

    if (diff > 50) {

        header.classList.add("hidden-header");

    }

    // Свайп вниз

    if (diff < -50) {

        header.classList.remove("hidden-header");

    }

});

// ======================================================
// FULLSCREEN MOBILE
// ======================================================

function openFullscreen() {

    const doc = document.documentElement;

    if (doc.requestFullscreen) {
        doc.requestFullscreen();
    }
    else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullscreen();
    }

}

// Android требует действие пользователя

document.addEventListener("touchstart", () => {

    openFullscreen();

}, { once: true });}


// ======================================================
// ЯБЛОЧНЫЙ ЭФФЕКТ
// ======================================================

const appleImages = ['apple 1.png', 'apple 2.png', 'apple 3.png'];

function createApple(x, y) {

    const apple = document.createElement('div');
    const randomImg = appleImages[Math.floor(Math.random() * appleImages.length)];

    apple.style.position = 'fixed';
    apple.style.left = `${x - 12}px`;
    apple.style.top = `${y - 12}px`;
    apple.style.width = '30px';
    apple.style.height = '30px';

    apple.style.backgroundImage = `url('${randomImg}')`;
    apple.style.backgroundSize = 'contain';
    apple.style.backgroundRepeat = 'no-repeat';

    apple.style.pointerEvents = 'none';
    apple.style.zIndex = '999999';

    apple.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';

    document.body.appendChild(apple);

    const randomX = (Math.random() - 0.5) * 120;
    const randomRotate = (Math.random() - 0.5) * 540;

    requestAnimationFrame(() => {
        apple.style.transform = `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;
        apple.style.opacity = '0';
    });

    setTimeout(() => apple.remove(), 1500);
}

document.addEventListener('click', e => createApple(e.clientX, e.clientY));

let isMouseDown = false;

document.addEventListener('mousedown', e => {
    if (e.button === 0) isMouseDown = true;
});

document.addEventListener('mouseup', e => {
    if (e.button === 0) isMouseDown = false;
});

document.addEventListener('mousemove', e => {
    if (isMouseDown && (!window.lastAppleTime || Date.now() - window.lastAppleTime > 60)) {
        createApple(e.clientX, e.clientY);
        window.lastAppleTime = Date.now();
    }
});


// ======================================================
// СВАЙП ШАПКИ
// ======================================================

const header = document.querySelector(".site-header");

let startY = 0;
let endY = 0;

document.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchmove", e => {
    endY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", () => {

    const diff = startY - endY;

    if (!header) return;

    if (diff > 50) header.classList.add("hidden-header");
    if (diff < -50) header.classList.remove("hidden-header");

});

// Ждем, пока вся структура страницы полностью загрузится

document.addEventListener("DOMContentLoaded", () => {

// ПРИНУДИТЕЛЬНЫЙ ВОЗВРАТ КУРСОРA ИЗ КОДА

document.documentElement.style.cursor = "url('custom-cursor.png') 0 0, auto";

document.body.style.cursor = "url('custom-cursor.png') 0 0, auto";



// ПРОВЕРКА: Не заблокирован ли уже этот ПК в игре вообще (по дате)?

const globalBlockExpiry = localStorage.getItem("potion_daily_block");

if (globalBlockExpiry) {

    const now = new Date().getTime();

    if (now < parseInt(globalBlockExpiry)) {

        // Если блокировка активна, можно добавить здесь логику показа окна "ожидание.png"

        console.log("Доступ заблокирован до следующего дня.");

        return;

    } else {

        localStorage.removeItem("potion_daily_block");

    }

}



// Логика выбора зелья

const talkativePotion = document.getElementById("potion-talkative");

if (talkativePotion) {

    talkativePotion.addEventListener("click", () => {

        startPotionGame();

    });

}

});

/**

Перенаправление на страницу приготовления зелья


*/

function startPotionGame() {

// Вариант 1 (если переименовали папку в first_potion):

window.location.href = "../первое_зелье/first_potion.html";

}

// =================================================================

// 2. МАГИЧЕСКИЙ ЭФФЕКТ: ЯБЛОКИ ПРИ КЛИКЕ И ДВИЖЕНИИ

// =================================================================

const appleImages = ['apple 1.png', 'apple 2.png', 'apple 3.png'];

function createApple(x, y) {

const apple = document.createElement('div');

const randomImg = appleImages[Math.floor(Math.random() * appleImages.length)];



apple.style.position = 'fixed';

apple.style.left = `${x - 12}px`; 

apple.style.top = `${y - 12}px`;  

apple.style.width = '30px';

apple.style.height = '30px';

apple.style.backgroundImage = `url('${randomImg}')`;

apple.style.backgroundSize = 'contain';

apple.style.backgroundRepeat = 'no-repeat';

apple.style.pointerEvents = 'none'; 

apple.style.zIndex = '999999'; 

apple.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';



document.body.appendChild(apple);



const randomX = (Math.random() - 0.5) * 120;

const randomRotate = (Math.random() - 0.5) * 540;



requestAnimationFrame(() => {

    apple.style.transform = `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;

    apple.style.opacity = '0';

});



setTimeout(() => {

    apple.remove();

}, 1500);

}

document.addEventListener('click', e => {

createApple(e.clientX, e.clientY);

});

let isMouseDown = false;

document.addEventListener('mousedown', e => {

if (e.button === 0) { isMouseDown = true; }

});

document.addEventListener('mouseup', e => {

if (e.button === 0) { isMouseDown = false; }

});

document.addEventListener('mousemove', e => {

if (isMouseDown && (!window.lastAppleTime || Date.now() - window.lastAppleTime > 60)) {

    createApple(e.clientX, e.clientY);

    window.lastAppleTime = Date.now();

}

});
