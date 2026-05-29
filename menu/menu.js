// =================================================================
// 1. ИНИЦИАЛИЗАЦИЯ И СИСТЕМНЫЕ ФУНКЦИИ
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Принудительный курсор
    document.documentElement.style.cursor = "url('custom-cursor.png') 0 0, auto";
    document.body.style.cursor = "url('custom-cursor.png') 0 0, auto";

    // Проверка блокировки доступа
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

    // Инициализация событий (клик по зелью)
    const talkativePotion = document.getElementById("potion-talkative");
    if (talkativePotion) {
        talkativePotion.addEventListener("click", () => {
            startPotionGame();
        });
    }

    // Инициализация системы свайпов
    initSwipeLogic();
});

/**
 * Перенаправление на страницу приготовления зелья
 */
function startPotionGame() {
    window.location.href = "../первое_зелье/first_potion.html";
}

// =================================================================
// 2. ЗАГРУЗКА, ПОЛНОЭКРАННЫЙ РЕЖИМ И СВАЙПЫ
// =================================================================

// Логика первого касания (полноэкранный режим + убрать экран загрузки)
document.addEventListener('touchstart', function handleFirstTouch(e) {
    // Включаем полноэкранный режим
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log("Фулскрин недоступен"));
    }

    // Скрываем экран загрузки
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 1000);
    }

    // Удаляем слушатель, чтобы не срабатывало повторно
    document.removeEventListener('touchstart', handleFirstTouch);
}, { once: true });

// Логика управления шапкой (свайпы)
function initSwipeLogic() {
    let touchStartY = 0;
    const header = document.querySelector('.site-header');

    if (!header) return;

    document.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchEndY - touchStartY;

        // Если свайп значительный (более 50px)
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Свайп вниз - показать шапку
                header.classList.remove('hidden');
            } else {
                // Свайп вверх - скрыть шапку
                header.classList.add('hidden');
            }
        }
    }, { passive: true });
}

// =================================================================
// 3. МАГИЧЕСКИЙ ЭФФЕКТ: ЯБЛОКИ
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
