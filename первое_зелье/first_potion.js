document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ПРИНУДИТЕЛЬНЫЙ КУРСОР
    // =====================================================

    document.documentElement.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";

    document.body.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";


    // =====================================================
    // ДАННЫЕ ИГРЫ
    // =====================================================

    const potionID = "first_potion";

    const today =
        new Date().toDateString();

    const vkID = "guest";

    const storageKey =
        `lastPlayed_${vkID}_${potionID}`;


    // =====================================================
    // ПРОВЕРКА: ПРОХОДИЛ ЛИ ИГРОК ИГРУ
    // =====================================================

    const lastPlayed =
        localStorage.getItem(storageKey);

    if (lastPlayed === today) {

        showReplayWarning();

        return;
    }


    // =====================================================
    // МОДАЛЬНОЕ ОКНО ПОВТОРНОГО ПРОХОЖДЕНИЯ
    // =====================================================

    function showReplayWarning() {

        const modal =
            document.getElementById("wait-modal");

        const understandBtn =
            document.getElementById("understand-btn");

        if (!modal) return;

        modal.style.display = "flex";

        document.body.style.overflow = "hidden";

        if (understandBtn) {

            understandBtn.onclick = () => {

                window.location.href =
                    "../menu/menu.html";
            };
        }
    }


    // =====================================================
    // ЗАПУСК ИГРЫ
    // =====================================================

    initGame(vkID, potionID, storageKey);
});


// =====================================================
// ОСНОВНАЯ ИГРА
// =====================================================

function initGame(vkID, potionID, storageKey) {

    // =====================================================
    // АУДИО
    // =====================================================

    const bgMusic =
        new Audio("фоновая_мелодия.mp3");

    bgMusic.loop = true;

    bgMusic.volume = 0.3;

    const successSound =
        new Audio("успех.mp3");

    successSound.volume = 1.0;

    const failSound =
        new Audio("провал.mp3");

    failSound.volume = 0.3;


    // =====================================================
    // ИНГРЕДИЕНТЫ
    // =====================================================

    const ingredientData = {

        "badyan": {
            name: "бадьян",
            img: "../ингредиенты/ингредиент_бадьян.png"
        },

        "mandrake": {
            name: "мандрагора",
            img: "../ингредиенты/ингредиент_мандрагора.png"
        },

        "honey_water": {
            name: "медовая_вода",
            img: "../ингредиенты/ингредиент_медовая_вода.png"
        },

        "mint": {
            name: "мята",
            img: "../ингредиенты/ингредиент_мята.png"
        },

        "toadstool": {
            name: "прыгающая_поганка",
            img: "../ингредиенты/ингредиент_прыгающая_поганка.png"
        },

        "hellebore": {
            name: "чемерица",
            img: "../ингредиенты/ингредиент_чемерица.png"
        }
    };


    // =====================================================
    // ПРАВИЛЬНЫЙ РЕЦЕПТ
    // =====================================================

    const winRecipe = [
        "hellebore",
        "mint",
        "honey_water",
        "mandrake"
    ];


    // =====================================================
    // СОСТОЯНИЕ ИГРЫ
    // =====================================================

    let chosenSlots =
        [null, null, null, null];

    let isGameActive = false;

    let timeLeft = 30;

    let countdownInterval = null;


    // =====================================================
    // DOM ЭЛЕМЕНТЫ
    // =====================================================

    const overlay =
        document.getElementById("countdown-overlay");

    const countdownText =
        document.getElementById("countdown-text");

    const timerDisplay =
        document.getElementById("game-timer");

    const cellSlots =
        document.querySelectorAll(".cell-slot");

    const chosenSlotElements =
        document.querySelectorAll(".chosen-slot");

    const rotator =
        document.getElementById("slots-rotator");

    const loadingOverlay =
        document.getElementById("loading-overlay");

    const failGifContainer =
        document.getElementById("fail-gif-container");

    const potionModal =
        document.getElementById("potion-modal");

    const modalCloseBtn =
        document.getElementById("modal-tab-close-btn");


    // =====================================================
    // ЗАПУСК МУЗЫКИ
    // =====================================================

    bgMusic.play().catch(() => {});


    // =====================================================
    // ОБРАТНЫЙ ОТСЧЕТ
    // =====================================================

    runPreloadCountdown();

    function runPreloadCountdown() {

        let count = 3;

        countdownText.textContent = count;

        const stageInterval = setInterval(() => {

            count--;

            if (count > 0) {

                countdownText.textContent = count;

            } else if (count === 0) {

                countdownText.textContent = "СТАРТ!";

            } else {

                clearInterval(stageInterval);

                overlay.style.opacity = "0";

                setTimeout(() => {

                    overlay.style.display = "none";

                    startGameTimer();

                }, 500);
            }

        }, 1000);
    }


    // =====================================================
    // ТАЙМЕР
    // =====================================================

    function startGameTimer() {

        isGameActive = true;

        timerDisplay.textContent =
            `00:${timeLeft}`;

        countdownInterval = setInterval(() => {

            timeLeft--;

            if (timeLeft >= 0) {

                timerDisplay.textContent =
                    timeLeft >= 10
                    ? `00:${timeLeft}`
                    : `00:0${timeLeft}`;

            } else {

                clearInterval(countdownInterval);

                timerDisplay.textContent =
                    "00:00";

                startLoadingSequence();
            }

        }, 1000);
    }


    // =====================================================
    // ЭКРАН ЗАГРУЗКИ
    // =====================================================

    function startLoadingSequence() {

        isGameActive = false;

        rotator.classList.add("frozen");

        cellSlots.forEach(slot => {
            slot.classList.add("frozen");
        });

        loadingOverlay.classList.add("active");

        setTimeout(() => {

            loadingOverlay.classList.remove("active");

            showGameResult();

        }, 4000);
    }


    // =====================================================
    // РЕЗУЛЬТАТ ИГРЫ
    // =====================================================

    function showGameResult() {

        const isSuccess =

            winRecipe.every(item =>
                chosenSlots.includes(item)
            )

            &&

            chosenSlots.every(slot =>
                slot !== null &&
                winRecipe.includes(slot)
            );


        // =================================================
        // УСПЕХ
        // =================================================

        if (isSuccess) {

            successSound.play();

            bgMusic.pause();

            isGameActive = false;

            timerDisplay.textContent =
                "Успех!";

            timerDisplay.className =
                "game-timer win-status";


            // СОХРАНЯЕМ ФАКТ ПРОХОЖДЕНИЯ
            localStorage.setItem(
                storageKey,
                new Date().toDateString()
            );


            if (potionModal) {

                potionModal.style.display =
                    "flex";

                potionModal.classList.add(
                    "active"
                );

                if (modalCloseBtn) {

                    modalCloseBtn.onclick = () => {

                        window.location.href =
                            "../menu/menu.html";
                    };
                }
            }


        // =================================================
        // ПРОВАЛ
        // =================================================

        } else {

            failSound.play();

            timerDisplay.textContent =
                "Провал";

            timerDisplay.className =
                "game-timer lose-status";


            if (failGifContainer) {

                failGifContainer.classList.add(
                    "run-animation"
                );
            }


            setTimeout(() => {

                if (failGifContainer) {

                    failGifContainer.classList.remove(
                        "run-animation"
                    );

                    failGifContainer.style.backgroundImage =
                        "none";
                }

            }, 2500);
        }
    }


    // =====================================================
    // ВЫБОР ИНГРЕДИЕНТОВ
    // =====================================================

    cellSlots.forEach(slot => {

        slot.addEventListener("click", () => {

            if (!isGameActive) return;

            if (bgMusic.paused) {

                bgMusic.play().catch(() => {});
            }

            const type =
                slot.getAttribute("data-ingredient");

            if (chosenSlots.includes(type)) return;

            const freeIndex =
                chosenSlots.findIndex(
                    item => item === null
                );

            if (freeIndex !== -1) {

                chosenSlots[freeIndex] = type;

                slot.classList.remove(
                    "grayscale"
                );

                slot.classList.add(
                    "active-selected"
                );

                const targetSlot =
                    document.getElementById(
                        `slot-${freeIndex}`
                    );

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
    // УДАЛЕНИЕ ИНГРЕДИЕНТОВ
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

                    matchingCell.classList.add(
                        "grayscale"
                    );
                }
            }
        });
    });


    // =====================================================
    // МАГИЧЕСКИЙ ШЛЕЙФ
    // =====================================================

    const appleImages = [
        "../menu/apple 1.png",
        "../menu/apple 2.png"
    ];


    function createApple(x, y) {

        const apple =
            document.createElement("img");

        apple.src =
            appleImages[
                Math.floor(
                    Math.random() *
                    appleImages.length
                )
            ];

        apple.style.position = "fixed";

        apple.style.left =
            (x - 20) + "px";

        apple.style.top =
            (y - 20) + "px";

        apple.style.width =
            (25 + Math.random() * 25) + "px";

        apple.style.pointerEvents =
            "none";

        apple.style.opacity = "1";

        apple.style.zIndex =
            "999999";

        apple.style.transition =
            "transform 1.5s ease-out, opacity 1.5s ease-out";

        document.body.appendChild(apple);

        const randomX =
            (Math.random() - 0.5) * 120;

        const randomRotate =
            (Math.random() - 0.5) * 540;

        requestAnimationFrame(() => {

            apple.style.transform =
                `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;

            apple.style.opacity = "0";
        });

        setTimeout(() => {

            apple.remove();

        }, 1500);
    }


    document.addEventListener("click", e => {

        createApple(
            e.clientX,
            e.clientY
        );
    });


    let isMouseDown = false;


    document.addEventListener("mousedown", e => {

        if (e.button === 0) {

            isMouseDown = true;
        }
    });


    document.addEventListener("mouseup", e => {

        if (e.button === 0) {

            isMouseDown = false;
        }
    });


    let lastAppleTime = 0;


    document.addEventListener("mousemove", e => {

        if (
            isMouseDown &&
            Date.now() - lastAppleTime > 60
        ) {

            createApple(
                e.clientX,
                e.clientY
            );

            lastAppleTime = Date.now();
        }
    });
}
