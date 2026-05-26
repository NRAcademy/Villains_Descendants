document.addEventListener("DOMContentLoaded", () => {
    
    // ПРИНУДИТЕЛЬНЫЙ ВОЗВРАТ КУРСОРA ИЗ КОДА
    document.documentElement.style.cursor = "url('../menu/custom-cursor.png') 0 0, auto";
    document.body.style.cursor = "url('../menu/custom-cursor.png') 0 0, auto";

    // Инициализация аудиофайлов
    const bgMusic = new Audio('фоновая_мелодия.mp3');
    bgMusic.loop = true; 
    bgMusic.volume = 0.3; 

    const successSound = new Audio('успех.mp3');
    successSound.volume = 1.0; 

    const failSound = new Audio('провал.mp3');
    failSound.volume = 0.3;

    // Справочник ингредиентов
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
    let timeLeft = 30; 
    let countdownInterval = null;

    // DOM Элементы
    const overlay = document.getElementById("countdown-overlay");
    const countdownText = document.getElementById("countdown-text");
    const timerDisplay = document.getElementById("game-timer");
    const cellSlots = document.querySelectorAll(".cell-slot");
    const chosenSlotElements = document.querySelectorAll(".chosen-slot");
    const rotator = document.getElementById("slots-rotator");

    // Элементы экрана загрузки результатов
    const loadingOverlay = document.getElementById("loading-overlay");
    const coffinEls = [
        document.getElementById("coffin-1"),
        document.getElementById("coffin-2"),
        document.getElementById("coffin-3")
    ];
    const loadingTextEl = document.getElementById("loading-text");
    const centerStand = document.querySelector(".center-stand");
    const failGifContainer = document.getElementById("fail-gif-container");

    // Модальное окно свитка и его родная кнопка закрытия
    const potionModal = document.getElementById("potion-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    bgMusic.play().catch(err => {
        console.log("Автоплеер заблокирован, включаем музыку по клику");
    });

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

    function showGameResult() {
        const isSuccess = winRecipe.every(ingredient => chosenSlots.includes(ingredient)) && 
                          chosenSlots.every(slot => slot !== null && winRecipe.includes(slot));

        if (failGifContainer) {
            failGifContainer.classList.remove("run-animation");
            void failGifContainer.offsetWidth; 
            const uniqueGifPath = 'провал_гиф.gif?t=' + Date.now();
            failGifContainer.style.backgroundImage = `url('${uniqueGifPath}')`;
        }

        if (isSuccess) {
            successSound.play();

            timerDisplay.textContent = "Успех!";
            timerDisplay.className = "game-timer win-status";

            if (centerStand) {
                const finalPotion = document.createElement("div");
                finalPotion.className = "final-potion-result";
                centerStand.appendChild(finalPotion);
            }

            // Появление свитка через секунду после успеха
setTimeout(() => {
    if (potionModal) {
        potionModal.classList.add("active");
        
        // Подстраховка: если modal-close-btn не найдется, ищем любую кнопку внутри свитка
        const closeButton = modalCloseBtn || potionModal.querySelector("button");

        if (closeButton) {
            closeButton.onclick = (e) => {
                e.preventDefault();
                
                // 1. Убираем класс активности
                potionModal.classList.remove("active");
                
                // 2. Жестко скрываем окно через стили (на случай проблем с CSS)
                potionModal.style.display = "none"; 
                
                // 3. Если "информация.png" добавлена картинкой внутри окна — скрываем и её
                const infoImg = potionModal.querySelector('img[src*="информация"]');
                if (infoImg) {
                    infoImg.style.display = "none";
                }
                
                console.log("Окно успешно закрыто.");
            };
        }
    }
}, 1000);

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
                location.reload(); // При провале раунд по-прежнему перезапускается
            }, 2500);
        }
    }

    // Добавление ingredients
    cellSlots.forEach(slot => {
        slot.addEventListener("click", () => {
            if(bgMusic.paused) { bgMusic.play().catch(() => {}); }
            if (!isGameActive) return; 

            const type = slot.getAttribute("data-ingredient");
            if (chosenSlots.includes(type)) return;
            const freeIndex = chosenSlots.findIndex(item => item === null);

            if (freeIndex !== -1) {
                chosenSlots[freeIndex] = type;
                slot.classList.remove("grayscale");
                slot.classList.add("active-selected");

                const targetSlot = document.getElementById(`slot-${freeIndex}`);
                if (targetSlot && ingredientData[type]) {
                    targetSlot.style.background = `url('${ingredientData[type].img}') no-repeat center center`;
                    targetSlot.style.backgroundSize = "contain";
                }
            }
        });
    });

    // Очистка слотов справа
    chosenSlotElements.forEach(slotElement => {
        slotElement.addEventListener("click", () => {
            if (!isGameActive) return;
            const index = parseInt(slotElement.getAttribute("data-index"));
            const currentIngredient = chosenSlots[index];

            if (currentIngredient) {
                chosenSlots[index] = null;
                slotElement.style.background = "url('../ингредиенты/ингредиент_пустой.png') no-repeat center center";
                slotElement.style.backgroundSize = "contain";

                const matchingCell = document.querySelector(`.cell-slot[data-ingredient="${currentIngredient}"]`);
                if (matchingCell) {
                    matchingCell.classList.remove("active-selected");
                    matchingCell.classList.add("grayscale");
                }
            }
        });
    });

    // Магический шлейф яблок
    const appleImages = ['../menu/apple 1.png', '../menu/apple 2.png'];
    function createApple(x, y) {
        const apple = document.createElement('img');
        apple.src = appleImages[Math.floor(Math.random() * appleImages.length)];
        apple.style.position = 'fixed';
        apple.style.left = (x - 20) + 'px';
        apple.style.top = (y - 20) + 'px';
        apple.style.width = (25 + Math.random() * 25) + 'px';
        apple.style.pointerEvents = 'none';
        apple.style.opacity = '1';
        apple.style.zIndex = '999999'; 
        apple.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';

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
    document.addEventListener('mouseup', e => { if (e.button === 0) isMouseDown = false; });
    let lastAppleTime = 0;
    document.addEventListener('mousemove', e => {
        if (isMouseDown && Date.now() - lastAppleTime > 60) {
            createApple(e.clientX, e.clientY);
            lastAppleTime = Date.now();
        }
    });
});