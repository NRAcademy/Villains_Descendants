/* ================= FIREBASE ================= */

const firebaseConfig = {
    apiKey: "AIzaSyCDqgERmj0eVbwY2O5I1_cL8UtQ-KSlIUY",
    authDomain: "villains-descendants.firebaseapp.com",
    projectId: "villains-descendants",
    storageBucket: "villains-descendants.firebasestorage.app",
    messagingSenderId: "984025435773",
    appId: "1:984025435773:web:cf34da4c90876229a5eb14",
    measurementId: "G-18B62XXSZ5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("registration-overlay");
    const regForm = document.getElementById("registration-form");
    const charNameInput = document.getElementById("char-name");
    const vkProfileInput = document.getElementById("vk-profile");
    const errorMessage = document.getElementById("error-message");

    const header = document.querySelector(".site-header");
    const toggleBtn = document.getElementById("toggle-header-btn");

    const leaderboardOverlay = document.getElementById("leaderboard-overlay");
    const openLeaderboardBtn = document.getElementById("open-leaderboard");

    /* ================= HEADER TOGGLE ================= */

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            header.classList.toggle("hidden");
            toggleBtn.innerText = header.classList.contains("hidden") ? "▲" : "▼";
        });
    }

    /* ================= SWIPE GESTURE ================= */

    let startY = 0;

    document.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", (e) => {
        const endY = e.changedTouches[0].clientY;
        const diff = endY - startY;

        if (!header) return;

        // свайп вверх → скрыть
        if (diff < -40) {
            header.classList.add("hidden");
            toggleBtn.innerText = "▲";
        }

        // свайп вниз → показать
        if (diff > 40) {
            header.classList.remove("hidden");
            toggleBtn.innerText = "▼";
        }
    });


    /* ================= LEADERBOARD ================= */

    if (openLeaderboardBtn && leaderboardOverlay) {

        openLeaderboardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            leaderboardOverlay.style.display = "flex";
            updateLeaderboardDisplay();
        });

        leaderboardOverlay.addEventListener("click", (e) => {
            if (e.target === leaderboardOverlay) {
                leaderboardOverlay.style.display = "none";
            }
        });
    }


    function updateLeaderboardDisplay() {
        const listContainer = document.getElementById("leaderboard-list");
        if (!listContainer) return;

        let scoreBoard = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];

        scoreBoard.sort((a, b) => a.timeSpent - b.timeSpent);

        if (scoreBoard.length === 0) {
            listContainer.innerHTML =
                `<div style="text-align:center;color:white;font-family:Anticva;margin-top:100px;">
                    Книга рекордов пуста...
                </div>`;
            return;
        }

        listContainer.innerHTML = scoreBoard.map((player, idx) => {

            let bg = '../рейтинг/простые_места.png';
            if (idx === 0) bg = '../рейтинг/первое_место.png';
            else if (idx === 1) bg = '../рейтинг/второе_место.png';
            else if (idx === 2) bg = '../рейтинг/третье_место.png';

            return `
                <div class="rank-card" style="background-image:url('${bg}')">
                    <div class="rank-name">${player.name}</div>
                    <div class="rank-time">
                        ${formatTime(player.timeSpent)}
                    </div>
                </div>
            `;
        }).join("");
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }


    /* ================= REGISTRATION ================= */

    if (regForm) {

        regForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const charName = charNameInput.value.trim();
            const vkProfile = vkProfileInput.value.trim();

            errorMessage.textContent = "";

            const vkRegex = /^(https?:\/\/vk\.com\/)?@?[a-zA-Z0-9_]+$/;

            if (!vkRegex.test(vkProfile)) {
                errorMessage.textContent = "Профиль указан неверно";
                return;
            }

            const vk = vkProfile.toLowerCase();

            const vkBlockKey = `block_vk_${vk}`;
            const blockTime = localStorage.getItem(vkBlockKey);

            if (blockTime && Date.now() < parseInt(blockTime)) {
                errorMessage.textContent =
                    "Этот профиль уже выполнял задание сегодня";
                return;
            }

            sessionStorage.setItem("currentPlayerName", charName);
            sessionStorage.setItem("currentPlayerVk", vk);

            localStorage.setItem("userProfile", JSON.stringify({
                name: charName,
                vkID: vk
            }));

            overlay.style.opacity = "0";

            setTimeout(() => {
                overlay.style.display = "none";
            }, 400);
        });
    }


    /* ================= POTION START ================= */

    const potion = document.getElementById("potion-talkative");

    if (potion) {
        potion.addEventListener("click", () => {

            if (!sessionStorage.getItem("currentPlayerName")) {
                overlay.style.display = "flex";
                overlay.style.opacity = "1";
                return;
            }

            window.location.href = "../первое_зелье/first_potion.html";
        });
    }


    /* ================= GLOBAL CURSOR FIX ================= */

    document.documentElement.style.cursor =
        "url('custom-cursor.png') 0 0, auto";
    document.body.style.cursor =
        "url('custom-cursor.png') 0 0, auto";
});
