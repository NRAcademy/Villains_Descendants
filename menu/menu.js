document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // КУРСОР
    // =========================
    document.documentElement.style.cursor =
        "url('custom-cursor.png') 0 0, auto";
    document.body.style.cursor =
        "url('custom-cursor.png') 0 0, auto";

    // =========================
    // ЛОГИКА ДОСТУПА К ИГРЕ
    // =========================
    const talkativePotion = document.getElementById("potion-talkative");

    if (talkativePotion) {
        talkativePotion.addEventListener("click", () => {

            const vkID = localStorage.getItem("vkID") || "guest";
            const potionID = "first_potion";
            const today = new Date().toDateString();

            const lastPlayed =
                localStorage.getItem(`lastPlayed_${vkID}_${potionID}`);

            // ❌ уже играл сегодня
            if (lastPlayed === today) {
                showWaitModal();
                return;
            }

            startPotionGame();
        });
    }
});


// =========================
// ПЕРЕХОД В ИГРУ
// =========================
function startPotionGame() {
    window.location.href = "../первое_зелье/first_potion.html";
}


// =========================
// УВЕДОМЛЕНИЕ (ОДИНАКОВОЕ ДЛЯ ВСЕХ)
// =========================
function showWaitModal(type = "wait") {

    const overlay = document.createElement("div");
    overlay.className = "wait-modal-overlay";

    let image = "";
    let button = "";

    if (type === "wait") {
        image = "../уведомление/ожидание.png";
        button = "../уведомление/понятно.png";
    }

    overlay.innerHTML = `
        <div class="wait-modal-content">
            <img src="${image}" class="wait-bg" alt="">
            <button class="understand-btn"></button>
        </div>
    `;

    document.body.appendChild(overlay);

    const btn = overlay.querySelector("button");

    btn.style.backgroundImage = `url('${button}')`;

    btn.addEventListener("click", () => {
        window.location.href = "../menu/menu.html";
    });
}


// =========================
// ПОКАЗ УСПЕХА / ПРОВАЛА
// =========================
function showResultModal(type) {

    const overlay = document.createElement("div");
    overlay.className = "wait-modal-overlay";

    let image = "";
    let button = "";

    if (type === "success") {
        image = "../уведомление/успешно.png";
        button = "../уведомление/успешно_кнопка.png";
    }

    if (type === "fail") {
        image = "../уведомление/неудача.png";
        button = "../уведомление/неудача_кнопка.png";
    }

    overlay.innerHTML = `
        <div class="wait-modal-content">
            <img src="${image}" class="wait-bg" alt="">
            <button class="understand-btn"></button>
        </div>
    `;

    document.body.appendChild(overlay);

    const btn = overlay.querySelector("button");

    btn.style.backgroundImage = `url('${button}')`;

    btn.addEventListener("click", () => {
        window.location.href = "../menu/menu.html";
    });
}
