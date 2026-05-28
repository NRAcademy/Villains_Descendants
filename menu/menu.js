// ======================================================
// FIREBASE
// ======================================================

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

// ======================================================
// DOM READY
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // КАСТОМНЫЙ КУРСОР
    // ======================================================

    document.documentElement.style.cursor =
        "url('custom-cursor.png') 0 0, auto";

    document.body.style.cursor =
        "url('custom-cursor.png') 0 0, auto";

    // ======================================================
    // ЭЛЕМЕНТЫ
    // ======================================================

    const overlay =
        document.getElementById("registration-overlay");

    const regForm =
        document.getElementById("registration-form");

    const charNameInput =
        document.getElementById("char-name");

    const vkProfileInput =
        document.getElementById("vk-profile");

    const errorMessage =
        document.getElementById("error-message");

    const leaderboardOverlay =
        document.getElementById("leaderboard-overlay");

    const openLeaderboardBtn =
        document.getElementById("open-leaderboard");

    const siteHeader =
        document.getElementById("site-header");

    // ======================================================
    // FULLSCREEN MOBILE
    // ======================================================

    function enableFullscreen() {

        const docEl = document.documentElement;

        if (docEl.requestFullscreen) {

            docEl.requestFullscreen()
                .catch(() => {});
        }
    }

    document.addEventListener(
        "click",
        enableFullscreen,
        { once: true }
    );

    // ======================================================
    // СКРЫВАЕМ БРАУЗЕРНУЮ ШАПКУ
    // ======================================================

    setTimeout(() => {

        window.scrollTo(0, 1);

    }, 200);

    // ======================================================
    // SWIPE HEADER
    // ======================================================

    let touchStartY = 0;
    let touchCurrentY = 0;

    document.addEventListener(
        "touchstart",
        (e) => {

            touchStartY =
                e.changedTouches[0].clientY;
        },
        { passive: true }
    );

    document.addEventListener(
        "touchmove",
        (e) => {

            touchCurrentY =
                e.changedTouches[0].clientY;

            const delta =
                touchStartY - touchCurrentY;

            // свайп вверх
            if (delta > 15) {

                siteHeader.classList.add(
                    "hidden-header"
                );
            }

            // свайп вниз
            if (delta < -15) {

                siteHeader.classList.remove(
                    "hidden-header"
                );
            }

        },
        { passive: true }
    );

    // ======================================================
    // LEADERBOARD OPEN
    // ======================================================

    if (openLeaderboardBtn) {

        openLeaderboardBtn.addEventListener(
            "click",
            async (e) => {

                e.preventDefault();

                leaderboardOverlay.style.display =
                    "flex";

                await updateLeaderboardDisplay();
            }
        );
    }

    // ======================================================
    // CLOSE LEADERBOARD
    // ======================================================

    leaderboardOverlay.addEventListener(
        "click",
        (e) => {

            if (e.target === leaderboardOverlay) {

                leaderboardOverlay.style.display =
                    "none";
            }
        }
    );

    // ======================================================
    // REGISTRATION
    // ======================================================

    if (regForm) {

regForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const charName =
            charNameInput.value.trim();

        const vkProfile =
            vkProfileInput.value
                .trim()
                .toLowerCase();

        errorMessage.textContent = "";

        if (!charName) {

            errorMessage.textContent =
                "Введите имя";

            return;
        }

        const vkRegex =
            /^(https?:\/\/vk\.com\/)?@?[a-zA-Z0-9_]+$/;

        if (!vkRegex.test(vkProfile)) {

            errorMessage.textContent =
                "Некорректный VK профиль";

            return;
        }

        try {

            // =========================================
            // ИЩЕМ ИГРОКА ПО ИМЕНИ
            // =========================================

            const nameSnapshot =
                await db
                    .collection("players")
                    .where(
                        "nameLower",
                        "==",
                        charName.toLowerCase()
                    )
                    .limit(1)
                    .get();

            // =========================================
            // ИЩЕМ ИГРОКА ПО VK
            // =========================================

            const vkSnapshot =
                await db
                    .collection("players")
                    .where(
                        "vkLower",
                        "==",
                        vkProfile
                    )
                    .limit(1)
                    .get();

            const hasName =
                !nameSnapshot.empty;

            const hasVk =
                !vkSnapshot.empty;

            // =========================================
            // ЕСЛИ И ИМЯ И VK УЖЕ СУЩЕСТВУЮТ
            // =========================================

            if (hasName && hasVk) {

                const existingPlayer =
                    nameSnapshot.docs[0].data();

                // ТОТ ЖЕ САМЫЙ ИГРОК → ПУСКАЕМ
                if (
                    existingPlayer.vkLower ===
                    vkProfile
                ) {

                    sessionStorage.setItem(
                        "currentPlayerName",
                        charName
                    );

                    sessionStorage.setItem(
                        "currentPlayerVk",
                        vkProfile
                    );

                    overlay.style.pointerEvents =
                        "none";

                    overlay.style.opacity = "0";

                    setTimeout(() => {

                        overlay.style.display =
                            "none";

                    }, 350);

                    return;
                }

                // ИМЯ ЗАНЯТО ДРУГИМ VK
                errorMessage.textContent =
                    "Это имя уже занято";

                return;
            }

            // =========================================
            // ИМЯ ЗАНЯТО
            // =========================================

            if (hasName) {

                errorMessage.textContent =
                    "Это имя уже занято";

                return;
            }

            // =========================================
            // VK ЗАНЯТ
            // =========================================

            if (hasVk) {

                errorMessage.textContent =
                    "Этот VK уже зарегистрирован";

                return;
            }

            // =========================================
            // СОЗДАЕМ НОВОГО ИГРОКА
            // =========================================

            await db
                .collection("players")
                .add({

                    name: charName,

                    nameLower:
                        charName.toLowerCase(),

                    vk: vkProfile,

                    vkLower: vkProfile,

                    createdAt:
                        firebase.firestore.FieldValue.serverTimestamp()
                });

            sessionStorage.setItem(
                "currentPlayerName",
                charName
            );

            sessionStorage.setItem(
                "currentPlayerVk",
                vkProfile
            );

            overlay.style.pointerEvents =
                "none";

            overlay.style.opacity = "0";

            setTimeout(() => {

                overlay.style.display =
                    "none";

            }, 350);

        } catch (err) {

            console.error(err);

            errorMessage.textContent =
                "Ошибка Firebase";
        }
    }
);

    // ======================================================
    // START GAME
    // ======================================================

    const talkativePotion =
        document.getElementById(
            "potion-talkative"
        );

    if (talkativePotion) {

        talkativePotion.addEventListener(
            "click",
            () => {

                const currentPlayer =
                    sessionStorage.getItem(
                        "currentPlayerName"
                    );

                if (!currentPlayer) {

                    overlay.style.display =
                        "flex";

                    overlay.style.opacity = "1";

                    return;
                }

                startPotionGame();
            }
        );
    }

    // ======================================================
    // MAGIC APPLES
    // ======================================================

    const appleImages = [
        "apple 1.png",
        "apple 2.png",
        "apple 3.png"
    ];

    function createApple(x, y) {

        const apple =
            document.createElement("div");

        const randomImg =
            appleImages[
                Math.floor(
                    Math.random() *
                    appleImages.length
                )
            ];

        apple.style.position = "fixed";

        apple.style.left =
            `${x - 12}px`;

        apple.style.top =
            `${y - 12}px`;

        apple.style.width = "24px";
        apple.style.height = "24px";

        apple.style.backgroundImage =
            `url('${randomImg}')`;

        apple.style.backgroundSize =
            "contain";

        apple.style.backgroundRepeat =
            "no-repeat";

        apple.style.pointerEvents =
            "none";

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
                `translate(${randomX}px, -140px)
                 rotate(${randomRotate}deg)`;

            apple.style.opacity = "0";
        });

        setTimeout(() => {

            apple.remove();

        }, 1500);
    }

    document.addEventListener(
        "click",
        (e) => {

            createApple(
                e.clientX,
                e.clientY
            );
        }
    );

    // ======================================================
    // TOUCH EFFECT
    // ======================================================

    let lastAppleTime = 0;

    document.addEventListener(
        "touchmove",
        (e) => {

            const now = Date.now();

            if (now - lastAppleTime < 60) {
                return;
            }

            const touch =
                e.touches[0];

            createApple(
                touch.clientX,
                touch.clientY
            );

            lastAppleTime = now;
        },
        { passive: true }
    );
});

// ======================================================
// START GAME
// ======================================================

function startPotionGame() {

    window.location.href =
        "../первое_зелье/first_potion.html";
}

// ======================================================
// LEADERBOARD
// ======================================================

async function updateLeaderboardDisplay() {

    const listContainer =
        document.getElementById(
            "leaderboard-list"
        );

    if (!listContainer) return;

    try {

        const snapshot =
            await db
                .collection("leaderboard")
                .orderBy(
                    "timeSpent",
                    "asc"
                )
                .limit(50)
                .get();

        // ======================================================
        // ПУСТОЙ РЕЙТИНГ
        // ======================================================

        if (snapshot.empty) {

            listContainer.innerHTML = `
                <div style="
                    text-align:center;
                    color:white;
                    margin-top:100px;
                    font-family:'Anticva', serif;
                ">
                    Книга рекордов пуста...
                </div>
            `;

            return;
        }

        // ======================================================
        // МАССИВ ИГРОКОВ
        // ======================================================

        const players = [];

        snapshot.forEach((doc) => {

            players.push(doc.data());
        });

        // ======================================================
        // РЕНДЕР
        // ======================================================

        listContainer.innerHTML =
            players.map((player, idx) => {

                let bgImage =
                    "../рейтинг/простые_места.png";

                if (idx === 0) {

                    bgImage =
                        "../рейтинг/первое_место.png";
                }

                else if (idx === 1) {

                    bgImage =
                        "../рейтинг/второе_место.png";
                }

                else if (idx === 2) {

                    bgImage =
                        "../рейтинг/третье_место.png";
                }

                return `
                    <div class="rank-card"
                         style="
                            background-image:
                            url('${bgImage}')
                         ">

                        <div class="rank-name">
                            ${player.name}
                        </div>

                        <div class="rank-time">
                            Скорость приготовления:
                            ${formatTime(
                                player.timeSpent
                            )}
                        </div>

                    </div>
                `;
            })
            .join("");

    } catch (err) {

        console.error(err);

        listContainer.innerHTML = `
            <div style="
                text-align:center;
                color:red;
                margin-top:100px;
                font-family:'Anticva', serif;
            ">
                Ошибка загрузки рейтинга
            </div>
        `;
    }
}

// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(seconds) {

    const min =
        Math.floor(seconds / 60);

    const sec =
        seconds % 60;

    return `
        ${String(min).padStart(2, "0")}
        :
        ${String(sec).padStart(2, "0")}
    `;
}

// ======================================================
// СОХРАНЕНИЕ РЕЗУЛЬТАТА
// ======================================================

async function savePlayerResult(totalTime) {

    try {

        const playerName =
            sessionStorage.getItem(
                "currentPlayerName"
            );

        const playerVk =
            sessionStorage.getItem(
                "currentPlayerVk"
            );

        if (!playerName || !playerVk) {
            return;
        }

        await db
            .collection("leaderboard")
            .add({

                name: playerName,

                vk: playerVk,

                timeSpent: totalTime,

                createdAt: Date.now()
            });

        console.log(
            "Результат сохранен"
        );

    } catch (err) {

        console.error(
            "Ошибка сохранения результата",
            err
        );
    }
}
