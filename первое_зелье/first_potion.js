document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ПРИНУДИТЕЛЬНЫЙ КУРСОР
    // =====================================================

    document.documentElement.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";

    document.body.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";


    // =====================================================
    // ДАННЫЕ ИГРОКА
    // =====================================================

    const userData = JSON.parse(localStorage.getItem('userProfile'));
    const vkID     = userData ? userData.vkID : 'guest';
    const potionID = "first_potion";
    const today    = new Date().toDateString();
    const lastPlayed = localStorage.getItem(`lastPlayed_${vkID}_${potionID}`);


    // =====================================================
    // ПРОВЕРКА: ИГРАЛ ЛИ СЕГОДНЯ → сразу wait-modal
    // =====================================================

    if (lastPlayed === today) {

        const waitModal    = document.getElementById('wait-modal');
        const understandBtn = document.getElementById('understand-btn');

        if (waitModal) {
            waitModal.style.display = 'flex';
        }

        if (understandBtn) {
            understandBtn.addEventListener('click', () => {
                window.location.href = '../menu/menu.html';
            });
        }

        return; // игра не запускается
    }


    // =====================================================
    // НЕ ИГРАЛ — ЗАПУСКАЕМ ИГРУ
    // =====================================================

    initGame(vkID, potionID);
});


// =========================================================
// ОСНОВНАЯ ИГРА
// =========================================================

function initGame(vkID, potionID) {


    // =====================================================
    // ДВОЙНОЙ ТАП / ДВОЙНОЙ КЛИК = FULLSCREEN
    // =====================================================

    (function setupFullscreen() {

        var lastTap = 0;

        document.addEventListener('touchend', function (e) {
            var now = Date.now();
            if (now - lastTap < 300) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(function () {});
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                }
            }
            lastTap = now;
        }, { passive: true });

        document.addEventListener('dblclick', function () {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(function () {});
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        });

    })();


    // =====================================================
    // АУДИО
    // =====================================================

    const bgMusic = new Audio('фоновая_мелодия.mp3');
    bgMusic.loop   = true;
    bgMusic.volume = 0.3;

    const successSound = new Audio('успех.mp3');
    successSound.volume = 1.0;

    const failSound = new Audio('провал.mp3');
    failSound.volume = 0.3;


    // =====================================================
    // ДАННЫЕ ИНГРЕДИЕНТОВ
    // =====================================================

    const ingredientData = {
        badyan:     { name: 'бадьян',             img: '../ингредиенты/ингредиент_бадьян.png' },
        mandrake:   { name: 'мандрагора',          img: '../ингредиенты/ингредиент_мандрагора.png' },
        honey_water:{ name: 'медовая_вода',        img: '../ингредиенты/ингредиент_медовая_вода.png' },
        mint:       { name: 'мята',                img: '../ингредиенты/ингредиент_мята.png' },
        toadstool:  { name: 'прыгающая_поганка',   img: '../ингредиенты/ингредиент_прыгающая_поганка.png' },
        hellebore:  { name: 'чемерица',            img: '../ингредиенты/ингредиент_чемерица.png' }
    };


    // =====================================================
    // НАСТРОЙКИ ИГРЫ
    // =====================================================

    const winRecipe = ['hellebore', 'mint', 'honey_water', 'mandrake'];

    let chosenSlots   = [null, null, null, null];
    let isGameActive  = false;
    const startTime   = 45;
    let timeLeft      = startTime;
    let countdownInterval = null;


    // =====================================================
    // DOM ЭЛЕМЕНТЫ
    // =====================================================

    const overlay           = document.getElementById("countdown-overlay");
    const countdownText     = document.getElementById("countdown-text");
    const timerDisplay      = document.getElementById("game-timer");
    const cellSlots         = document.querySelectorAll(".cell-slot");
    const chosenSlotElements = document.querySelectorAll(".chosen-slot");
    const rotator           = document.getElementById("slots-rotator");

    const loadingOverlay    = document.getElementById("loading-overlay");
    const coffinEls         = [
        document.getElementById("coffin-1"),
        document.getElementById("coffin-2"),
        document.getElementById("coffin-3")
    ];
    const loadingTextEl     = document.getElementById("loading-text");
    const centerStand       = document.querySelector(".center-stand");
    const failGifContainer  = document.getElementById("fail-gif-container");

    // Свиток информации (показывается при успехе)
    const potionModal       = document.getElementById("potion-modal");
    // кнопка закрытия свитка — в HTML id="modal-tab-close-btn"
    const modalCloseBtn     = document.getElementById("modal-tab-close-btn");


    // =====================================================
    // КНОПКА ГОТОВО
    // =====================================================

    const readyBtn = document.getElementById('ready-btn');

    if (readyBtn) {
        readyBtn.addEventListener('click', () => {
            if (!isGameActive) return;
            if (chosenSlots.includes(null)) {
                alert("Вы выбрали не все ингредиенты!");
                return;
            }
            startLoadingSequence();
        });
    }


    // =====================================================
    // ЗАПУСК МУЗЫКИ
    // =====================================================

    bgMusic.play().catch(() => {
        console.log("Автоплей заблокирован");
    });


    // =====================================================
    // ПРЕДСТАРТОВЫЙ ОТСЧЁТ
    // =====================================================

    runPreloadCountdown();

    function runPreloadCountdown() {

        let count = 3;
        countdownText.textContent = count;

        const stageInterval = setInterval(() => {

            bgMusic.play().catch(() => {});
            count--;

            if (count > 0) {
                countdownText.textContent = count;

            } else if (count === 0) {
                countdownText.textContent = "СТАРТ!";

            } else {
                clearInterval(stageInterval);

                if (overlay) {
                    overlay.style.opacity = "0";
                    setTimeout(() => {
                        overlay.style.display = "none";
                        startGameTimer();
                    }, 500);
                } else {
                    startGameTimer();
                }
            }

        }, 1000);
    }


    // =====================================================
    // ТАЙМЕР ИГРЫ
    // =====================================================

    function startGameTimer() {

        isGameActive = true;
        timerDisplay.textContent = `00:${timeLeft}`;

        countdownInterval = setInterval(() => {

            timeLeft--;

            if (timeLeft >= 10) {
                timerDisplay.textContent = `00:${timeLeft}`;
            } else if (timeLeft > 0) {
                timerDisplay.textContent = `00:0${timeLeft}`;
            } else {
                timerDisplay.textContent = "00:00";
                clearInterval(countdownInterval);
                startLoadingSequence();
            }

        }, 1000);
    }


    // =====================================================
    // ЭКРАН ЗАГРУЗКИ
    // =====================================================

    function startLoadingSequence() {

        isGameActive = false;

        if (countdownInterval) clearInterval(countdownInterval);

        if (rotator) rotator.classList.add("frozen");
        cellSlots.forEach(slot => slot.classList.add("frozen"));

        if (loadingOverlay) loadingOverlay.classList.add("active");

        const hasCoffins = coffinEls.every(el => el !== null);
        let coffinInterval = null;
        let currentStep = 0;

        if (hasCoffins) {
            coffinEls.forEach(el => el.classList.remove("active-coffin"));
            coffinEls[0].classList.add("active-coffin");

            coffinInterval = setInterval(() => {
                coffinEls[currentStep].classList.remove("active-coffin");
                currentStep = (currentStep + 1) % 3;
                coffinEls[currentStep].classList.add("active-coffin");
            }, 500);
        }

        const fullText = "Загружаем результат...";

        if (loadingTextEl) {
            loadingTextEl.textContent = "";
            let charIndex = 0;

            const typeInterval = setInterval(() => {
                if (charIndex < fullText.length) {
                    loadingTextEl.textContent += fullText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 900 / fullText.length);
        }

        setTimeout(() => {
            if (coffinInterval) clearInterval(coffinInterval);
            if (loadingOverlay) loadingOverlay.classList.remove("active");
            showGameResult();
        }, 4000);
    }


    // =====================================================
    // РЕЗУЛЬТАТ ИГРЫ
    // =====================================================

    function showGameResult() {

        const isSuccess =
            winRecipe.every(ing => chosenSlots.includes(ing)) &&
            chosenSlots.every(slot => slot !== null && winRecipe.includes(slot));

        // Подготовка гифки провала (сброс, чтобы анимация сработала заново)
        if (failGifContainer) {
            failGifContainer.classList.remove("run-animation");
            void failGifContainer.offsetWidth;
            failGifContainer.style.backgroundImage =
                `url('провал_гиф.gif?t=${Date.now()}')`;
        }


        // =================================================
        // УСПЕХ
        // =================================================

        if (isSuccess) {

            successSound.play();

            // Сохраняем в таблицу лидеров
            let uData = null;
            try { uData = JSON.parse(localStorage.getItem('userProfile')); } catch (e) {}
            const playerName = uData?.name || uData?.username || "Гость";
            const timeSpent  = startTime - timeLeft;
            saveResultToLeaderboard(playerName, timeSpent);

            // Фиксируем прохождение на сегодня
            localStorage.setItem(
                `lastPlayed_${vkID}_${potionID}`,
                new Date().toDateString()
            );

            isGameActive = false;
            if (countdownInterval) clearInterval(countdownInterval);

            bgMusic.pause();
            bgMusic.currentTime = 0;

            timerDisplay.textContent = "Успех!";
            timerDisplay.className   = "game-timer win-status";

            // Финальное зелье на подставке
            if (centerStand) {
                const finalPotion = document.createElement("div");
                finalPotion.className = "final-potion-result";
                centerStand.appendChild(finalPotion);
            }

            // Через 1 с — открываем свиток (информация.png)
            setTimeout(() => {

                if (potionModal) {

                    potionModal.classList.add("active");

                    const closeButton = modalCloseBtn || potionModal.querySelector("button");

                    if (closeButton) {

                        closeButton.onclick = (e) => {

                            e.preventDefault();
                            potionModal.classList.remove("active");
                            potionModal.style.display = "none";

                            // После свитка — модал успеха (успешно.png)
                            const successModal = document.getElementById('success-modal');

                            if (successModal) {
                                successModal.style.display = 'flex';

                                const successBtn = document.getElementById('success-btn');

                                if (successBtn) {
                                    successBtn.onclick = () => {
                                        successModal.style.display = 'none';

                                        // После кнопки успеха — модал ожидания
                                        const waitModal = document.getElementById('wait-modal');
                                        if (waitModal) waitModal.style.display = 'flex';

                                        const understandBtn = document.getElementById('understand-btn');
                                        if (understandBtn) {
                                            understandBtn.onclick = () => {
                                                window.location.href = '../menu/menu.html';
                                            };
                                        }
                                    };
                                }
                            }
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
            timerDisplay.className   = "game-timer lose-status";

            if (failGifContainer) {
                failGifContainer.classList.add("run-animation");
            }

            // Через 2.5 с гифка гаснет → модал провала (неудача.png)
            setTimeout(() => {

                if (failGifContainer) {
                    failGifContainer.classList.remove("run-animation");
                    failGifContainer.style.backgroundImage = "none";
                }

                const failModal = document.getElementById('fail-modal');

                if (failModal) {
                    failModal.style.display = 'flex';

                    const failBtn = document.getElementById('fail-btn');

                    if (failBtn) {
                        failBtn.onclick = () => {
                            failModal.style.display = 'none';

                            // После кнопки провала — модал ожидания
                            const waitModal = document.getElementById('wait-modal');
                            if (waitModal) waitModal.style.display = 'flex';

                            const understandBtn = document.getElementById('understand-btn');
                            if (understandBtn) {
                                understandBtn.onclick = () => {
                                    window.location.href = '../menu/menu.html';
                                };
                            }
                        };
                    }

                } else {
                    // fallback — если fail-modal вдруг не найден
                    const waitModal = document.getElementById('wait-modal');
                    if (waitModal) waitModal.style.display = 'flex';
                }

            }, 2500);
        }

    } // конец showGameResult


    // =====================================================
    // ВЫБОР ИНГРЕДИЕНТОВ (клик по ячейке круга)
    // =====================================================

    cellSlots.forEach(slot => {

        slot.addEventListener("click", () => {

            if (bgMusic.paused) bgMusic.play().catch(() => {});
            if (!isGameActive) return;

            const type = slot.getAttribute("data-ingredient");

            if (chosenSlots.includes(type)) return;

            const filledCount = chosenSlots.filter(s => s !== null).length;
            if (filledCount >= 4) return;

            const freeIndex = chosenSlots.findIndex(item => item === null);

            if (freeIndex !== -1) {

                chosenSlots[freeIndex] = type;
                slot.classList.remove("grayscale");
                slot.classList.add("active-selected");

                const targetSlot = document.getElementById(`slot-${freeIndex}`);

                if (targetSlot && ingredientData[type]) {
                    targetSlot.style.background     = `url('${ingredientData[type].img}') no-repeat center center`;
                    targetSlot.style.backgroundSize = "contain";
                }
            }
        });
    });


    // =====================================================
    // ОЧИСТКА СЛОТОВ (клик по слоту справа)
    // =====================================================

    chosenSlotElements.forEach(slotElement => {

        slotElement.addEventListener("click", () => {

            if (!isGameActive) return;

            const index = parseInt(slotElement.getAttribute("data-index"));
            const currentIngredient = chosenSlots[index];

            if (currentIngredient) {

                chosenSlots[index] = null;

                slotElement.style.background     = "url('../ингредиенты/ингредиент_пустой.png') no-repeat center center";
                slotElement.style.backgroundSize = "contain";

                const matchingCell = document.querySelector(
                    `.cell-slot[data-ingredient="${currentIngredient}"]`
                );

                if (matchingCell) {
                    matchingCell.classList.remove("active-selected");
                    matchingCell.classList.add("grayscale");
                }
            }
        });
    });


    // =====================================================
    // МАГИЧЕСКИЙ ШЛЕЙФ КУРСОРА
    // =====================================================

    const appleImages = [
        '../menu/apple 1.png',
        '../menu/apple 2.png'
    ];

    function createApple(x, y) {

        const apple       = document.createElement('img');
        apple.src         = appleImages[Math.floor(Math.random() * appleImages.length)];
        apple.style.cssText = `
            position: fixed;
            left: ${x - 20}px;
            top: ${y - 20}px;
            width: ${25 + Math.random() * 25}px;
            pointer-events: none;
            opacity: 1;
            z-index: 999999;
            transition: transform 1.5s ease-out, opacity 1.5s ease-out;
        `;
        document.body.appendChild(apple);

        const randomX      = (Math.random() - 0.5) * 120;
        const randomRotate = (Math.random() - 0.5) * 540;

        requestAnimationFrame(() => {
            apple.style.transform = `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;
            apple.style.opacity   = '0';
        });

        setTimeout(() => apple.remove(), 1500);
    }

    document.addEventListener('click', e => createApple(e.clientX, e.clientY));

    let isMouseDown  = false;
    let lastAppleTime = 0;

    document.addEventListener('mousedown', e => { if (e.button === 0) isMouseDown = true; });
    document.addEventListener('mouseup',   e => { if (e.button === 0) isMouseDown = false; });

    document.addEventListener('mousemove', e => {
        if (isMouseDown && Date.now() - lastAppleTime > 60) {
            createApple(e.clientX, e.clientY);
            lastAppleTime = Date.now();
        }
    });

} // конец initGame


// =====================================================
// ТАБЛИЦА ЛИДЕРОВ
// =====================================================

function saveResultToLeaderboard(name, time) {

    let leaderboard = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

    leaderboard.push({
        name:      name,
        timeSpent: time,
        date:      new Date().toLocaleDateString()
    });

    leaderboard.sort((a, b) => a.timeSpent - b.timeSpent);

    localStorage.setItem("potion_leaderboard", JSON.stringify(leaderboard));
}
