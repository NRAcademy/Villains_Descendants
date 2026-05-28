// Ждем, пока вся структура страницы полностью загрузится
document.addEventListener("DOMContentLoaded", () => {
   
    // ПРИНУДИТЕЛЬНЫЙ ВОЗВРАТ КУРСОРA ИЗ КОДА (Подстраховка для браузера)
    document.documentElement.style.cursor = "url('custom-cursor.png') 0 0, auto";
    document.body.style.cursor = "url('custom-cursor.png') 0 0, auto";

    // 1. ИНИЦИАЛИЗАЦИЯ И СВЯЗЬ ЭЛЕМЕНТОВ РЕГИСТРАЦИИ
    const overlay = document.getElementById("registration-overlay");
    const regForm = document.getElementById("registration-form");
    const charNameInput = document.getElementById("char-name");
    const vkProfileInput = document.getElementById("vk-profile");
    const errorMessage = document.getElementById("error-message");

// --- ДОБАВИТЬ В НАЧАЛО, ГДЕ ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ ---
const leaderboardOverlay = document.getElementById("leaderboard-overlay");
const openLeaderboardBtn = document.getElementById("open-leaderboard");

// --- ОТКРЫТИЕ И ЗАКРЫТИЕ ОКНА ---
if (openLeaderboardBtn) {
    openLeaderboardBtn.addEventListener("click", (e) => {
        e.preventDefault();
        leaderboardOverlay.style.display = "flex";
        updateLeaderboardDisplay(); // Обновляем при открытии
    });
}

// Закрытие при клике по оверлею (вне окна)
leaderboardOverlay.addEventListener("click", (e) => {
    if (e.target === leaderboardOverlay) {
        leaderboardOverlay.style.display = "none";
    }
});

/**
 * Обновленная функция отрисовки рейтинга
 */
function updateLeaderboardDisplay() {
    const listContainer = document.getElementById("leaderboard-list");
    if (!listContainer) return;

    let scoreBoard = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

    // Сортировка: статус успех -> время
    scoreBoard.sort((a, b) => a.timeSpent - b.timeSpent);

   if (scoreBoard.length === 0) {
        // Добавили margin-top: 100px — вы можете менять это число, чтобы настроить нужную высоту
        listContainer.innerHTML = `<div style="text-align:center; color:white; font-family: 'Anticva', serif; margin-top: 100px;">Книга рекордов пуста...</div>`;
        return;
    }

    listContainer.innerHTML = scoreBoard.map((player, idx) => {
        // Выбор картинки в зависимости от места
        let bgImage = '../рейтинг/простые_места.png';
        if (idx === 0) bgImage = '../рейтинг/первое_место.png';
        else if (idx === 1) bgImage = '../рейтинг/второе_место.png';
        else if (idx === 2) bgImage = '../рейтинг/третье_место.png';

        return `
            <div class="rank-card" style="background-image: url('${bgImage}');">
                <div class="rank-name">${player.name}</div>
                <div class="rank-time">Скорость приготовления зелья ${formatTime(player.timeSpent)}</div>
            </div>
        `;
    }).join("");
}

// Вспомогательная функция для форматирования времени (если нужно превратить секунды в 00:00)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

    // ПРОВЕРКА: Не заблокирован ли уже этот ПК в игре вообще (по дате)?
    const globalBlockExpiry = localStorage.getItem("potion_daily_block");
    if (globalBlockExpiry) {
        const now = new Date().getTime();
        if (now < parseInt(globalBlockExpiry)) {
            // Если дата блокировки еще не наступила — переводим окно в режим жесткого бана
            showLockoutScreen("Вы уже проходили занятие сегодня!<br>Доступ заблокирован до следующего дня.");
            return;
        } else {
            // Время бана вышло — очищаем блокировку
            localStorage.removeItem("potion_daily_block");
        }
    }

    // Обработка отправки формы (Кнопка "Готово")
    if (regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            const charName = charNameInput.value.trim();
            const vkProfile = vkProfileInput.value.trim();

            errorMessage.textContent = ""; // Очищаем старые ошибки

            // Регулярное выражение для валидации VK ID / Профиля
            // Проверяет строки вида id12345, либо короткие имена (только латиница, цифры, подчеркивания, от 3 до 32 символов)
const vkRegex = /^(https?:\/\/vk\.com\/)?@?[a-zA-Z0-9_]+$/;

            if (!vkRegex.test(vkProfile)) {
                errorMessage.textContent = "Такого пользователя нет или профиль указан неверно";
                return;
            }

            // ПРОВЕРКА НА УНИКАЛЬНОСТЬ БЛОКИРОВКИ ЭТОГО VK ID НА СЕГОДНЯ
            const lowercaseVk = vkProfile.toLowerCase();
            const vkBlockKey = `block_vk_${lowercaseVk}`;
            const userBlockTime = localStorage.getItem(vkBlockKey);

            if (userBlockTime) {
                const now = new Date().getTime();
                if (now < parseInt(userBlockTime)) {
                    errorMessage.textContent = "Этот профиль VK уже выполнял задание сегодня! Доступ закрыт.";
                    return;
                } else {
                    localStorage.removeItem(vkBlockKey);
                }
            }

            // УСПЕШНАЯ АВТОРИЗАЦИЯ
            // Сохраняем сессию текущего игрока для передачи на игровую страницу
            sessionStorage.setItem("currentPlayerName", charName);
            sessionStorage.setItem("currentPlayerVk", lowercaseVk);

            localStorage.setItem("userProfile", JSON.stringify({
    name: charName,
    vkID: lowercaseVk
}));

            // Плавно прячем окно регистрации
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.style.display = "none";
            }, 400);
        });
    }

    // Логика выбора зелья
    const talkativePotion = document.getElementById("potion-talkative");
    if (talkativePotion) {
        talkativePotion.addEventListener("click", () => {
            // Проверяем, авторизован ли игрок в этой сессии
            if (!sessionStorage.getItem("currentPlayerName")) {
                overlay.style.display = "flex";
                overlay.style.opacity = "1";
                return;
            }
            startPotionGame();
        });
    }
});

/**
 * Переводит форму в режим отображения блокировки
 */
function showLockoutScreen(message) {
    const form = document.getElementById("registration-form");
    if (form) {
        form.innerHTML = `<div class="error-text user-blocked-msg">${message}</div>`;
    }
}

/**
 * Перенаправление на страницу приготовления зелья
 */
function startPotionGame() {
    // Используем относительный путь: 
    // .. (выходим из папки menu) / первое_зелье (заходим в папку) / first_potion.html
    window.location.href = "../первое_зелье/first_potion.html"; 
}

/**
 * Функция обновления и отрисовки рейтинга из локальной памяти
 */
function updateLeaderboardDisplay() {
    const listContainer = document.getElementById("leaderboard-list");
    if (!listContainer) return;

    // Подгружаем сохраненный рейтинг (из localStorage) или пустой массив
    let scoreBoard = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

    // Сортируем: сначала те, у кого статус "Успех", затем по времени варки (меньшее время - лучше)
    scoreBoard.sort((a, b) => {
        if (a.status === b.status) {
            return a.timeSpent - b.timeSpent; // чем быстрее сварил, тем выше
        }
        return a.status === "Успех" ? -1 : 1; 
    });

    // Берем топ-5 лучших результатов
    const topPlayers = scoreBoard.slice(0, 5);

    if (topPlayers.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; font-style:italic; opacity:0.6;">Книга рекордов пуста...</div>`;
        return;
    }

    listContainer.innerHTML = topPlayers.map((player, idx) => `
        <div class="leaderboard-item">
            <span>${idx + 1}. ${player.name} (${player.vk})</span>
            <span style="color: ${player.status === 'Успех' ? '#5eff5e' : '#ff5e5e'}">${player.status}</span>
        </div>
    `).join("");
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
    apple.style.width = '24px';
    apple.style.height = '24px';
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
