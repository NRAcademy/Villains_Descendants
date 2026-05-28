// Ждем, пока вся структура страницы загрузится
document.addEventListener("DOMContentLoaded", () => {
    
    // 0. ИНИЦИАЛИЗАЦИЯ FIREBASE
    // !!! ВСТАВЬТЕ СЮДА ВАШ ОБЪЕКТ КОНФИГУРАЦИИ !!!
    const firebaseConfig = {
        apiKey: "AIzaSyCDqgERmj0eVbwY2O5I1_cL8UtQ-KSlIUY",
        authDomain: "villains-descendants.firebaseapp.com",
        databaseURL: "https://villains-descendants.firebaseio.com",
        projectId: "villains-descendants",
        storageBucket: "villains-descendants.firebasestorage.app",
        messagingSenderId: "984025435773",
        appId: "1:984025435773:web:cf34da4c90876229a5eb14",
        measurementId: "G-18B62XXSZ5"
    };
    
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Принудительный курсор
    document.documentElement.style.cursor = "url('custom-cursor.png') 0 0, auto";
    document.body.style.cursor = "url('custom-cursor.png') 0 0, auto";

    // Инициализация элементов
    const overlay = document.getElementById("registration-overlay");
    const regForm = document.getElementById("registration-form");
    const charNameInput = document.getElementById("char-name");
    const vkProfileInput = document.getElementById("vk-profile");
    const errorMessage = document.getElementById("error-message");
    const leaderboardOverlay = document.getElementById("leaderboard-overlay");
    const openLeaderboardBtn = document.getElementById("open-leaderboard");

    // --- ОТКРЫТИЕ И ЗАКРЫТИЕ РЕЙТИНГА ---
    if (openLeaderboardBtn) {
        openLeaderboardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            leaderboardOverlay.style.display = "flex";
            loadLeaderboard(); // Вызываем новую функцию для Firebase
        });
    }

    leaderboardOverlay.addEventListener("click", (e) => {
        if (e.target === leaderboardOverlay) {
            leaderboardOverlay.style.display = "none";
        }
    });

    // --- ОБРАБОТКА РЕГИСТРАЦИИ (FIREBASE) ---
    if (regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = charNameInput.value.trim();
            const vk = vkProfileInput.value.trim().toLowerCase();
            errorMessage.textContent = "Проверка...";

            // Проверка формата VK
            const vkRegex = /^(https?:\/\/vk\.com\/)?@?[a-zA-Z0-9_]+$/;
            if (!vkRegex.test(vk)) {
                errorMessage.textContent = "Профиль VK указан неверно";
                return;
            }

            // Проверка уникальности в Firebase
            database.ref('players').orderByChild('name').equalTo(name).once('value', (snapshot) => {
                if (snapshot.exists()) {
                    errorMessage.textContent = "Ошибка: Игрок с таким именем уже есть!";
                } else {
                    // Сохраняем в Firebase
                    database.ref('players').push({
                        name: name,
                        vk: vk,
                        date: new Date().toISOString()
                    }).then(() => {
                        sessionStorage.setItem("currentPlayerName", name);
                        sessionStorage.setItem("currentPlayerVk", vk);
                        
                        overlay.style.opacity = "0";
                        setTimeout(() => { overlay.style.display = "none"; }, 400);
                    }).catch(err => {
                        errorMessage.textContent = "Ошибка сохранения: " + err.message;
                    });
                }
            });
        });
    }

    // --- ЛОГИКА ИГРЫ ---
    const talkativePotion = document.getElementById("potion-talkative");
    if (talkativePotion) {
        talkativePotion.addEventListener("click", () => {
            if (!sessionStorage.getItem("currentPlayerName")) {
                overlay.style.display = "flex";
                overlay.style.opacity = "1";
                return;
            }
            window.location.href = "../первое_зелье/first_potion.html"; 
        });
    }

    // --- ФУНКЦИЯ ЗАГРУЗКИ РЕЙТИНГА ИЗ FIREBASE ---
    function loadLeaderboard() {
        const listElement = document.getElementById("leaderboard-list");
        listElement.innerHTML = "Загрузка...";

        database.ref('players/').once('value').then((snapshot) => {
            const data = snapshot.val();
            listElement.innerHTML = ""; 

            if (!data) {
                listElement.innerHTML = "Рекордов пока нет...";
                return;
            }

            // Вывод данных
            for (let key in data) {
                const user = data[key];
                listElement.innerHTML += `
                    <div class="rank-card">
                        <div class="rank-name">${user.name}</div>
                        <div class="rank-vk">@${user.vk}</div>
                    </div>`;
            }
        });
    }
});

// --- МАГИЧЕСКИЙ ЭФФЕКТ (ЯБЛОКИ) И СКРОЛЛ ОСТАЛИСЬ БЕЗ ИЗМЕНЕНИЙ ---
// (Ваш код с appleImages и обработчиком scroll можно оставить ниже)

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

let lastScrollTop = 0;
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        // Скролл вниз - скрываем
        header.classList.add('header-hidden');
    } else {
        // Скролл вверх - показываем
        header.classList.remove('header-hidden');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

