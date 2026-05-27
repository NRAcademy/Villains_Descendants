document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // КНОПКА "ПОНЯЛ"
    // =========================

    const understandBtn = document.getElementById('understand-btn');

    if (understandBtn) {
        understandBtn.addEventListener('click', () => {
            window.location.href = '../menu/menu.html';
        });
    }

    // =========================
    // КУРСОР
    // =========================

    document.documentElement.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";

    document.body.style.cursor =
        "url('../menu/custom-cursor.png') 0 0, auto";

    // =========================
    // ДАННЫЕ ИГРОКА
    // =========================

    let userData = null;

    try {
        userData = JSON.parse(localStorage.getItem('userProfile'));
    } catch (e) {
        userData = null;
    }

    const vkID = userData?.vkID || 'guest';
    const potionID = "first_potion";

    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(`lastPlayed_${vkID}_${potionID}`);

    // =========================
    // БЛОК ПОВТОРНОЙ ИГРЫ
    // =========================

    if (lastPlayed === today) {

        const waitModal = document.getElementById('wait-modal');

        if (waitModal) {
            waitModal.style.display = 'flex';
        }

        const btn = document.getElementById('understand-btn');

        if (btn) {
            btn.onclick = () => {
                window.location.href = '../menu/menu.html';
            };
        }

        return;
    }

    initGame(vkID, potionID);
});


// ===============================
// ОСНОВНАЯ ИГРА
// ===============================

function initGame(vkID, potionID) {

    // ================= AUDIO =================

    const bgMusic = new Audio('фоновая_мелодия.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    const successSound = new Audio('успех.mp3');
    const failSound = new Audio('провал.mp3');

    // ================= DATA =================

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

    const readyBtn = document.getElementById("ready-btn");

    // ================= HEADER CONTROL =================

    const header = document.querySelector('.site-header');
    const toggleBtn = document.getElementById('toggle-header-btn');

    if (header && toggleBtn) {

        toggleBtn.addEventListener('click', () => {
            header.classList.toggle('hidden');
            toggleBtn.innerText =
                header.classList.contains('hidden') ? '▲' : '▼';
        });

        // свайп
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;

            if (diff > 60) {
                header.classList.add('hidden');
                toggleBtn.innerText = '▲';
            }

            if (diff < -60) {
                header.classList.remove('hidden');
                toggleBtn.innerText = '▼';
            }
        }, { passive: true });
    }

    // ================= START MUSIC =================

    bgMusic.play().catch(() => {});

    runCountdown();

    // ================= COUNTDOWN =================

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

                if (overlay) overlay.style.display = "none";

                startTimer();
            }

        }, 1000);
    }

    // ================= TIMER =================

    function startTimer() {

        isGameActive = true;
        timerDisplay.textContent = `00:${timeLeft}`;

        countdownInterval = setInterval(() => {

            timeLeft--;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                startResult();
                return;
            }

            timerDisplay.textContent =
                `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

        }, 1000);
    }

    // ================= READY =================

    if (readyBtn) {
        readyBtn.addEventListener('click', () => {
            if (!isGameActive) return;

            if (chosenSlots.includes(null)) {
                alert("Вы не выбрали все ингредиенты!");
                return;
            }

            startResult();
        });
    }

    // ================= RESULT =================

    function startResult() {

        isGameActive = false;
        clearInterval(countdownInterval);

        const isWin =
            winRecipe.every(i => chosenSlots.includes(i)) &&
            chosenSlots.every(i => winRecipe.includes(i));

        if (isWin) {

            successSound.play();

            localStorage.setItem(
                `lastPlayed_${vkID}_${potionID}`,
                new Date().toDateString()
            );

            timerDisplay.textContent = "УСПЕХ";
            timerDisplay.classList.add("win-status");

            if (centerStand) {
                const el = document.createElement("div");
                el.className = "final-potion-result";
                centerStand.appendChild(el);
            }

        } else {

            failSound.play();

            timerDisplay.textContent = "ПРОВАЛ";
            timerDisplay.classList.add("lose-status");

            if (failGifContainer) {
                failGifContainer.classList.add("run-animation");
            }

            setTimeout(() => {
                const wait = document.getElementById('wait-modal');
                if (wait) wait.style.display = 'flex';
            }, 2000);
        }
    }

    // ================= INGREDIENTS =================

    cellSlots.forEach(slot => {

        slot.addEventListener("click", () => {

            if (!isGameActive) return;

            const type = slot.dataset.ingredient;

            if (chosenSlots.includes(type)) return;

            const index = chosenSlots.findIndex(v => v === null);

            if (index !== -1) {

                chosenSlots[index] = type;

                const target = document.getElementById(`slot-${index}`);

                if (target) {
                    target.style.background =
                        `url('../ингредиенты/ингредиент_${type}.png') center/contain no-repeat`;
                }

                slot.classList.add("active-selected");
                slot.classList.remove("grayscale");
            }
        });

    });

}
