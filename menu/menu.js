document.addEventListener("DOMContentLoaded", () => {
// LEADERBOARD
// =========================================================

function updateLeaderboardDisplay() {

    const listContainer = document.getElementById("leaderboard-list");

    if (!listContainer) return;

    let scoreBoard = JSON.parse(
        localStorage.getItem("potion_leaderboard")
    ) || [];

    scoreBoard.sort((a, b) => a.timeSpent - b.timeSpent);

    if (scoreBoard.length === 0) {

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

    listContainer.innerHTML = scoreBoard.map((player, idx) => {

        let bgImage = '../рейтинг/простые_места.png';

        if (idx === 0) {
            bgImage = '../рейтинг/первое_место.png';
        }
        else if (idx === 1) {
            bgImage = '../рейтинг/второе_место.png';
        }
        else if (idx === 2) {
            bgImage = '../рейтинг/третье_место.png';
        }

        return `
            <div class="rank-card"
                 style="background-image:url('${bgImage}')">

                <div class="rank-name">
                    ${player.name}
                </div>

                <div class="rank-time">
                    ${formatTime(player.timeSpent)}
                </div>

            </div>
        `;

    }).join("");
}

function formatTime(seconds) {

    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
