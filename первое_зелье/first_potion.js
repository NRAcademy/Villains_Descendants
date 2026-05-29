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

    const lastPlayed = localStorage.getItem(`lastPlayed_${vkID}_${potionID}`);

    // ================= БЛОК ДОСТУПА =================
    if (lastPlayed === today) {

        const waitModal = document.getElementById('wait-modal');

        if (waitModal) {
            waitModal.style.display = 'flex';
        }

        const btn = document.getElementById('understand-btn');

        if (btn) {
            btn.addEventListener('click', () => {
                window.location.href = '../menu/menu.html';
            });
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

    // ================= ДАННЫЕ ИГРЫ =================
    const ingredientData = {
        badyan: { img: '../ингредиенты/ингредиент_бадьян.png' },
        mandrake: { img: '../ингредиенты/ингредиент_мандрагора.png' },
        honey_water: { img: '../ингредиенты/ингредиент_медовая_вода.png' },
        mint: { img: '../ингредиенты/ингредиент_мята.png' },
        toadstool: { img: '../ингредиенты/ингредиент_прыгающая_поганка.png' },
        hellebore: { img: '../ингредиенты/ингредиент_чемерица.png' }
    };

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
    const coffinEls = [
        document.getElementById("coffin-1"),
        document.getElementById("coffin-2"),
        document.getElementById("coffin-3")
    ];

    const loadingTextEl = document.getElementById("loading-text");
    const centerStand = document.querySelector(".center-stand");

    const failGifContainer = document.getElementById("fail-gif-container");

    const potionModal = document.getElementById("potion-modal");
    const modalCloseBtn = document.getElementById("modal-tab-close-btn");

    const readyBtn = document.getElementById("ready-btn");

    // ================= ЗВУК =================
    bgMusic.play().catch(() => {});

    // ================= КНОПКА ГОТОВО =================
    if (readyBtn) {
        readyBtn.addEventListener('click', () => {

            if (!isGameActive) return;

            if (chosenSlots.includes(null)) {
                alert("Выберите все ингредиенты!");
                return;
            }

            startLoadingSequence();
        });
    }

    // ================= СТАРТ =================
    runCountdown();

    function runCountdown() {

        let count = 3;
        countdownText.textContent = count;

        const interval = setInterval(() => {

            count--;

            if (count > 0) {
                countdownText.textContent = count;
            }

            else if (count === 0) {
                countdownText.textContent = "СТАРТ!";
            }

            else {
                clearInterval(interval);

                overlay.style.opacity = "0";

                setTimeout(() => {
                    overlay.style.display = "none";
                    startTimer();
                }, 500);
            }

        }, 1000);
    }

    // ================= ТАЙМЕР =================
    function startTimer() {

        isGameActive = true;
        timerDisplay.textContent = `00:${timeLeft}`;

        countdownInterval = setInterval(() => {

            timeLeft--;

            if (timeLeft > 9) {
                timerDisplay.textContent = `00:${timeLeft}`;
            }
            else if (timeLeft > 0) {
                timerDisplay.textContent = `00:0${timeLeft}`;
            }
            else {
                timerDisplay.textContent = `00:00`;
                clearInterval(countdownInterval);
                startLoadingSequence();
            }

        }, 1000);
    }

    // ================= ЗАГРУЗКА =================
    function startLoadingSequence() {

        isGameActive = false;
        clearInterval(countdownInterval);

        rotator?.classList.add("frozen");
        cellSlots.forEach(s => s.classList.add("frozen"));

        loadingOverlay?.classList.add("active");

        let index = 0;

        const interval = setInterval(() => {

            coffinEls.forEach(c => c?.classList.remove("active-coffin"));

            coffinEls[index]?.classList.add("active-coffin");

            index = (index + 1) % 3;

        }, 500);

        setTimeout(() => {

            clearInterval(interval);
            loadingOverlay?.classList.remove("active");

            showResult();

        }, 3500);
    }

    // ================= РЕЗУЛЬТАТ =================
    function showResult() {

        const isSuccess =
            JSON.stringify([...chosenSlots].sort()) ===
            JSON.stringify([...winRecipe].sort());

        if (isSuccess) {

            successSound.play();

            localStorage.setItem(
                `lastPlayed_${vkID}_${potionID}`,
                new Date().toDateString()
            );

            timerDisplay.textContent = "Успех!";

            if (centerStand) {
                const el = document.createElement("div");
                el.className = "final-potion-result";
                centerStand.appendChild(el);
            }

            setTimeout(() => {
                potionModal?.classList.add("active");
            }, 1000);
        }

        else {
            failSound.play();
            timerDisplay.textContent = "Провал";
        }
    }

    // ================= ВЫБОР ИНГРЕДИЕНТОВ =================
    cellSlots.forEach(slot => {

        slot.addEventListener("click", () => {

            if (!isGameActive) return;

            const type = slot.dataset.ingredient;

            if (chosenSlots.includes(type)) return;

            const free = chosenSlots.indexOf(null);

            if (free !== -1) {

                chosenSlots[free] = type;

                const img = ingredientData[type]?.img;

                const target = document.getElementById(`slot-${free}`);

                if (target && img) {
                    target.style.background =
                        `url('${img}') center/contain no-repeat`;
                }

                slot.classList.add("active-selected");
            }
        });
    });

    // ================= ОЧИСТКА СЛОТОВ =================
    chosenSlotElements.forEach(slot => {

        slot.addEventListener("click", () => {

            if (!isGameActive) return;

            const index = +slot.dataset.index;

            const val = chosenSlots[index];

            if (!val) return;

            chosenSlots[index] = null;

            slot.style.background =
                "url('../ингредиенты/ингредиент_пустой.png') center/contain no-repeat";

            const cell =
                document.querySelector(`[data-ingredient="${val}"]`);

            cell?.classList.remove("active-selected");
        });
    });

    // ================= MAGIC EFFECT =================
    document.addEventListener("click", e => {

        const img = document.createElement("img");

        img.src = '../menu/apple 1.png';

        img.style.position = "fixed";
        img.style.left = e.clientX + "px";
        img.style.top = e.clientY + "px";
        img.style.width = "30px";
        img.style.pointerEvents = "none";

        document.body.appendChild(img);

        setTimeout(() => img.remove(), 1200);
    });

}

// ================= LEADERBOARD =================
function saveResultToLeaderboard(name, time) {

    let board =
        JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

    board.push({
        name,
        timeSpent: time,
        date: new Date().toLocaleDateString()
    });

    board.sort((a, b) => a.timeSpent - b.timeSpent);

    localStorage.setItem("potion_leaderboard", JSON.stringify(board));
}
