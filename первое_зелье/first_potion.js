document.addEventListener("DOMContentLoaded", () => {
    const understandBtn = document.getElementById('understand-btn');

    if (understandBtn) {
        understandBtn.addEventListener('click', () => {
            window.location.href = '../menu/menu.html';
        });
    }

    // =====================================================
    // ПРИНУДИТЕЛЬНЫЙ КУРСОР
    // =====================================================
    document.documentElement.style.cursor = "url('../menu/custom-cursor.png') 0 0, auto";
    document.body.style.cursor = "url('../menu/custom-cursor.png') 0 0, auto";

    // =====================================================
    // ДАННЫЕ ИГРОКА
    // =====================================================
    const potionID = "first_potion";
    const today = new Date().toDateString();
    // Используем 'guest', так как регистрация больше не требуется
    const vkID = 'guest'; 

    const lastPlayed = localStorage.getItem(`lastPlayed_${vkID}_${potionID}`);

    // =====================================================
    // ПРОВЕРКА: ИГРАЛ ЛИ СЕГОДНЯ
    // =====================================================
    if (lastPlayed === today) {
        const waitModal = document.getElementById('wait-modal');
        if (waitModal) {
            waitModal.style.display = 'flex';
            // Кнопка уже обработана в самом верху (DOMContentLoaded)
            return;
        }
    }

    // =====================================================
    // ЗАПУСК ИГРЫ
    // =====================================================
    initGame(vkID, potionID);
});

function initGame(vkID, potionID) {
    // Аудио
    const bgMusic = new Audio('фоновая_мелодия.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    const successSound = new Audio('успех.mp3');
    successSound.volume = 1.0;
    const failSound = new Audio('провал.mp3');
    failSound.volume = 0.3;

    // Ингредиенты
    const ingredientData = {
        'badyan': { name: 'бадьян', img: '../ингредиенты/ингредиент_бадьян.png' },
        'mandrake': { name: 'мандрагора', img: '../ингредиенты/ингредиент_мандрагора.png' },
        'honey_water': { name: 'медовая_вода', img: '../ингредиенты/ингредиент_медовая_вода.png' },
        'mint': { name: 'мята', img: '../ингредиенты/ингредиент_мята.png' },
        'toadstool': { name: 'прыгающая_поганка', img: '../ингредиенты/ингредиент_прыгающая_поганка.png' },
        'hellebore': { name: 'чемерица', img: '../ингредиенты/ингредиент_чемерица.png' }
    };

    const winRecipe = ['hellebore', 'mint', 'honey_water', 'mandrake'];
    let chosenSlots = [null, null, null, null];
    let isGameActive = false;
    const startTime = 30;
    let timeLeft = startTime;
    let countdownInterval = null;

    // DOM Элементы
    const overlay = document.getElementById("countdown-overlay");
    const countdownText = document.getElementById("countdown-text");
    const timerDisplay = document.getElementById("game-timer");
    const cellSlots = document.querySelectorAll(".cell-slot");
    const chosenSlotElements = document.querySelectorAll(".chosen-slot");
    const rotator = document.getElementById("slots-rotator");
    const loadingOverlay = document.getElementById("loading-overlay");
    const coffinEls = [document.getElementById("coffin-1"), document.getElementById("coffin-2"), document.getElementById("coffin-3")];
    const loadingTextEl = document.getElementById("loading-text");
    const centerStand = document.querySelector(".center-stand");
    const failGifContainer = document.getElementById("fail-gif-container");
    const potionModal = document.getElementById("potion-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    bgMusic.play().catch(() => {});
    runPreloadCountdown();

    function runPreloadCountdown() {
        let count = 3;
        countdownText.textContent = count;
        const stageInterval = setInterval(() => {
            count--;
            if (count > 0) countdownText.textContent = count;
            else if (count === 0) countdownText.textContent = "СТАРТ!";
            else {
                clearInterval(stageInterval);
                if (overlay) {
                    overlay.style.opacity = "0";
                    setTimeout(() => { overlay.style.display = "none"; startGameTimer(); }, 500);
                } else { startGameTimer(); }
            }
        }, 1000);
    }

    function startGameTimer() {
        isGameActive = true;
        timerDisplay.textContent = `00:${timeLeft}`;
        countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                timerDisplay.textContent = timeLeft >= 10 ? `00:${timeLeft}` : `00:0${timeLeft}`;
            } else {
                timerDisplay.textContent = `00:00`;
                clearInterval(countdownInterval);
                startLoadingSequence();
            }
        }, 1000);
    }

    function startLoadingSequence() {
        isGameActive = false;
        if (countdownInterval) clearInterval(countdownInterval);
        if (rotator) rotator.classList.add("frozen");
        cellSlots.forEach(slot => slot.classList.add("frozen"));
        if (loadingOverlay) loadingOverlay.classList.add("active");
        
        setTimeout(() => {
            if (loadingOverlay) loadingOverlay.classList.remove("active");
            showGameResult();
        }, 4000);
    }

    function showGameResult() {
        const isSuccess = winRecipe.every(i => chosenSlots.includes(i)) && 
                          chosenSlots.every(s => s !== null && winRecipe.includes(s));

        if (isSuccess) {
            successSound.play();
            // Сохраняем факт прохождения, чтобы сработал запрет на повтор
            localStorage.setItem(`lastPlayed_${vkID}_${potionID}`, new Date().toDateString());

            isGameActive = false;
            bgMusic.pause();
            timerDisplay.textContent = "Успех!";
            
            if (potionModal) {
                potionModal.style.display = "flex";
                potionModal.classList.add("active");
                const closeButton = modalCloseBtn || potionModal.querySelector("button");
                if (closeButton) {
                    closeButton.onclick = () => {
                        window.location.href = '../menu/menu.html';
                    };
                }
            }
        } else {
            failSound.play();
            timerDisplay.textContent = "Провал";
            setTimeout(() => {
                const waitModal = document.getElementById('wait-modal');
                if (waitModal) waitModal.style.display = 'flex';
            }, 2500);
        }
    }

window.location.href = '../menu/menu.html';
                                    };
                                }
                            };
                        };
                    }
                }

            }, 1000);


// =================================================
        // ПРОВАЛ
        // =================================================
        } else {
            failSound.play();

            timerDisplay.textContent = "Провал";
            timerDisplay.className = "game-timer lose-status";

            if (failGifContainer) {
                failGifContainer.classList.add("run-animation");
            }

            setTimeout(() => {
                if (failGifContainer) {
                    failGifContainer.classList.remove("run-animation");
                    failGifContainer.style.backgroundImage = "none";
                }

                const waitModal = document.getElementById('wait-modal');
                if (waitModal) {
                    waitModal.style.display = 'flex';
                }
            }, 2500);
        }
} // 👈 ВОТ ЭТОЙ СКОБКИ НЕ ХВАТАЕТ

// =====================================================
// ВЫБОР ИНГРЕДИЕНТОВ
// ============================================

    cellSlots.forEach(slot => {

        slot.addEventListener("click", () => {

            if (bgMusic.paused) {
                bgMusic.play().catch(() => {});
            }

            if (!isGameActive) return;

            const type =
                slot.getAttribute("data-ingredient");

            if (chosenSlots.includes(type)) return;

            const freeIndex =
                chosenSlots.findIndex(item => item === null);

            if (freeIndex !== -1) {

                chosenSlots[freeIndex] = type;

                slot.classList.remove("grayscale");

                slot.classList.add("active-selected");

                const targetSlot =
                    document.getElementById(`slot-${freeIndex}`);

                if (targetSlot && ingredientData[type]) {

                    targetSlot.style.background =
                        `url('${ingredientData[type].img}') no-repeat center center`;

                    targetSlot.style.backgroundSize =
                        "contain";
                }
            }
        });
    });


    // =====================================================
    // ОЧИСТКА СЛОТОВ
    // =====================================================

    chosenSlotElements.forEach(slotElement => {

        slotElement.addEventListener("click", () => {

            if (!isGameActive) return;

            const index = parseInt(
                slotElement.getAttribute("data-index")
            );

            const currentIngredient =
                chosenSlots[index];

            if (currentIngredient) {

                chosenSlots[index] = null;

                slotElement.style.background =
                    "url('../ингредиенты/ингредиент_пустой.png') no-repeat center center";

                slotElement.style.backgroundSize =
                    "contain";

                const matchingCell =
                    document.querySelector(
                        `.cell-slot[data-ingredient="${currentIngredient}"]`
                    );

                if (matchingCell) {

                    matchingCell.classList.remove(
                        "active-selected"
                    );

                    matchingCell.classList.add("grayscale");
                }
            }
        });
    });


    // =====================================================
    // МАГИЧЕСКИЙ ШЛЕЙФ
    // =====================================================

    const appleImages = [
        '../menu/apple 1.png',
        '../menu/apple 2.png'
    ];


    function createApple(x, y) {

        const apple = document.createElement('img');

        apple.src =
            appleImages[
                Math.floor(Math.random() * appleImages.length)
            ];

        apple.style.position = 'fixed';

        apple.style.left = (x - 20) + 'px';

        apple.style.top = (y - 20) + 'px';

        apple.style.width =
            (25 + Math.random() * 25) + 'px';

        apple.style.pointerEvents = 'none';

        apple.style.opacity = '1';

        apple.style.zIndex = '999999';

        apple.style.transition =
            'transform 1.5s ease-out, opacity 1.5s ease-out';

        document.body.appendChild(apple);

        const randomX =
            (Math.random() - 0.5) * 120;

        const randomRotate =
            (Math.random() - 0.5) * 540;

        requestAnimationFrame(() => {

            apple.style.transform =
                `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;

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

        if (e.button === 0) {
            isMouseDown = true;
        }
    });

    document.addEventListener('mouseup', e => {

        if (e.button === 0) {
            isMouseDown = false;
        }
    });

    let lastAppleTime = 0;

    document.addEventListener('mousemove', e => {

        if (
            isMouseDown &&
            Date.now() - lastAppleTime > 60
        ) {

            createApple(e.clientX, e.clientY);

            lastAppleTime = Date.now();
        }
    });
}

// Функция для записи результата в LocalStorage
function saveResultToLeaderboard(name, time) {
    // Получаем текущие данные или создаем пустой массив
    let leaderboard = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

    // Добавляем новый результат
    leaderboard.push({
        name: name,
        timeSpent: time,
        date: new Date().toLocaleDateString()
    });

    // Сортируем (по времени: чем меньше, тем лучше)
    leaderboard.sort((a, b) => a.timeSpent - b.timeSpent);

    // Сохраняем обратно
    localStorage.setItem("potion_leaderboard", JSON.stringify(leaderboard));
}
