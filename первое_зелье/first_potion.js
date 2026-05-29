document.addEventListener("DOMContentLoaded", () => {

    const understandBtn = document.getElementById('understand-btn');

    if (understandBtn) {
        understandBtn.addEventListener('click', () => {
            window.location.href = '../menu/menu.html';
        });
    }

    // ================= КУРСОР =================
    document.documentElement.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";

    document.body.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";

    // ================= ДАННЫЕ ИГРОКА =================
    const userData = JSON.parse(localStorage.getItem('userProfile'));
    const vkID = userData ? userData.vkID : 'guest';

    const potionID = "first_potion";
    const today = new Date().toDateString();

    const lastPlayed =
        localStorage.getItem(`lastPlayed_${vkID}_${potionID}`);

    // ================= ПОВТОРНАЯ ИГРА ЗА ДЕНЬ =================
    if (lastPlayed === today) {

        const waitModal = document.getElementById('wait-modal');

        if (waitModal) {
            waitModal.style.display = 'flex';
        }

        return;
    }

    initGame(vkID, potionID);
});


// =====================================================
// ОСНОВНАЯ ИГРА
// =====================================================

function initGame(vkID, potionID) {

    // ================= АУДИО =================
    const bgMusic = new Audio('фоновая_мелодия.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    const successSound = new Audio('успех.mp3');
    const failSound = new Audio('провал.mp3');

    successSound.volume = 1.0;
    failSound.volume = 0.3;

    // ================= ИНГРЕДИЕНТЫ =================
    const ingredientData = {
        badyan: { img: '../ингредиенты/ингредиент_бадьян.png' },
        mandrake: { img: '../ингредиенты/ингредиент_мандрагора.png' },
        honey_water: { img: '../ингредиенты/ингредиент_медовая_вода.png' },
        mint: { img: '../ингредиенты/ингредиент_мята.png' },
        toadstool: { img: '../ингредиенты/ингредиент_прыгающая_поганка.png' },
        hellebore: { img: '../ингредиенты/ингредиент_чемерица.png' }
    };

    // ================= НАСТРОЙКИ =================
    const winRecipe = [
        'hellebore',
        'mint',
        'honey_water',
        'mandrake'
    ];

    let chosenSlots = [null, null, null, null];
    let isGameActive = false;

    const startTime = 30;
    let timeLeft = startTime;
    let countdownInterval = null;

    // ================= DOM =================
    const overlay = document.getElementById("countdown-overlay");
    const countdownText = document.getElementById("countdown-text");

    const timerDisplay = document.getElementById("game-timer");
    const cellSlots = document.querySelectorAll(".cell-slot");
    const chosenSlotElements = document.querySelectorAll(".chosen-slot");
    const rotator = document.getElementById("slots-rotator");

    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingTextEl = document.getElementById("loading-text");

    const coffinEls = [
        document.getElementById("coffin-1"),
        document.getElementById("coffin-2"),
        document.getElementById("coffin-3")
    ];

    const centerStand = document.querySelector(".center-stand");
    const failGifContainer = document.getElementById("fail-gif-container");

    const potionModal = document.getElementById("potion-modal");

    const understandBtn = document.getElementById('understand-btn');

    const readyBtn = document.getElementById('ready-btn');

    // ================= READY BUTTON =================
    if (readyBtn) {
        readyBtn.addEventListener('click', () => {
            if (!isGameActive) return;

            if (chosenSlots.includes(null)) {
                alert("Вы не выбрали все ингредиенты!");
                return;
            }

            startLoadingSequence();
        });
    }

    // ================= МУЗЫКА =================
    bgMusic.play().catch(() => {});

    // ================= СТАРТ =================
    runCountdown();

    function runCountdown() {

        let count = 3;
        countdownText.textContent = count;

        const interval = setInterval(() => {

            count--;

            if (count > 0) {
                countdownText.textContent = count;
            } else if (count === 0) {
                countdownText.textContent = "СТАРТ!";
            } else {
                clearInterval(interval);

                if (overlay) {
                    overlay.style.display = "none";
                }

                startGameTimer();
            }

        }, 1000);
    }

    // ================= ТАЙМЕР =================
    function startGameTimer() {

        isGameActive = true;
        timerDisplay.textContent = `00:${timeLeft}`;

        countdownInterval = setInterval(() => {

            timeLeft--;

            if (timeLeft > 9) {
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

    // ================= ЗАГРУЗКА =================
    function startLoadingSequence() {

        isGameActive = false;
        clearInterval(countdownInterval);

        if (rotator) rotator.classList.add("frozen");
        cellSlots.forEach(s => s.classList.add("frozen"));

        loadingOverlay?.classList.add("active");

        let step = 0;

        const coffinInterval = setInterval(() => {

            coffinEls.forEach(c => c?.classList.remove("active-coffin"));

            if (coffinEls[step]) {
                coffinEls[step].classList.add("active-coffin");
            }

            step = (step + 1) % 3;

        }, 500);

        setTimeout(() => {
            clearInterval(coffinInterval);
            loadingOverlay?.classList.remove("active");
            showResult();
        }, 4000);
    }

    // ================= РЕЗУЛЬТАТ =================
    function showResult() {

        const isSuccess =
            winRecipe.every(i => chosenSlots.includes(i)) &&
            chosenSlots.every(i => winRecipe.includes(i));

        if (isSuccess) {

            successSound.play();

            const timeSpent = startTime - timeLeft;

            saveResultToLeaderboard(
                userData?.name || "Гость",
                timeSpent
            );

            localStorage.setItem(
                `lastPlayed_${vkID}_${potionID}`,
                new Date().toDateString()
            );

            timerDisplay.textContent = "УСПЕХ!";
            timerDisplay.className = "game-timer win-status";

            if (centerStand) {
                const el = document.createElement("div");
                el.className = "final-potion-result";
                centerStand.appendChild(el);
            }

        } else {

            failSound.play();

            timerDisplay.textContent = "ПРОВАЛ";
            timerDisplay.className = "game-timer lose-status";
        }

        setTimeout(() => {
            document.getElementById('wait-modal')?.style.display = 'flex';
        }, 2500);
    }

    // ================= ВЫБОР =================
    cellSlots.forEach(slot => {

        slot.addEventListener("click", () => {

            if (!isGameActive) return;

            const type = slot.dataset.ingredient;

            if (chosenSlots.includes(type)) return;

            const index = chosenSlots.findIndex(v => v === null);

            if (index !== -1) {

                chosenSlots[index] = type;

                const target = document.getElementById(`slot-${index}`);

                if (target && ingredientData[type]) {
                    target.style.background =
                        `url('${ingredientData[type].img}') no-repeat center`;
                    target.style.backgroundSize = "contain";
                }

                slot.classList.add("active-selected");
                slot.classList.remove("grayscale");
            }
        });
    });

    // ================= ОЧИСТКА =================
    chosenSlotElements.forEach(slot => {

        slot.addEventListener("click", () => {

            if (!isGameActive) return;

            const index = +slot.dataset.index;

            const ingredient = chosenSlots[index];

            if (!ingredient) return;

            chosenSlots[index] = null;

            slot.style.background =
                "url('../ингредиенты/ингредиент_пустой.png') no-repeat center";

            slot.style.backgroundSize = "contain";

            document
                .querySelector(`[data-ingredient="${ingredient}"]`)
                ?.classList.add("grayscale");
        });
    });
}


// ================= LEADERBOARD =================
function saveResultToLeaderboard(name, time) {

    let board = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

    board.push({
        name,
        timeSpent: time,
        date: new Date().toLocaleDateString()
    });

    board.sort((a, b) => a.timeSpent - b.timeSpent);

    localStorage.setItem("potion_leaderboard", JSON.stringify(board));
}
