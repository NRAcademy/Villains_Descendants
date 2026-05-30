document.addEventListener("DOMContentLoaded", () => {

 const understandBtn = document.getElementById('understand-btn');
if (understandBtn) {
 understandBtn.addEventListener('click', () => {
window.location.href = '../menu/menu.html';
 });
}
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

 const userData =
 JSON.parse(localStorage.getItem('userProfile'));

 const vkID =
 userData ? userData.vkID : 'guest';

 const potionID = "first_potion";

 const today =
 new Date().toDateString();

 const lastPlayed = 
localStorage.GetItem( 
 `lastPlayed_${vkID}_${potionID}`
 );


 // =====================================================
 // ПРОВЕРКА: ИГРАЛ ЛИ СЕГОДНЯ
 // =====================================================

 if (lastPlayed === today) {

 const waitModal =
 document.getElementById('wait-modal');

 if (waitModal) {

 waitModal.style.display = 'flex';

 const understandBtn =
 document.getElementById('understand-btn');

 if (understandBtn) {

 understandBtn.addEventListener('щелчок', () => {

окно.Расположение.href = '../menu/menu.html';
 });
 }

 // ПОЛНОСТЬЮ ОСТАНАВЛИВАЕМ ИГРУ
 Возврат;
 }
 }


 // =====================================================
 // ЕСЛИ НЕ ИГРАЛ — ЗАПУСКАЕМ ИГРУ
 // =====================================================

 Инициализация игры (vkID, potionID);

});


// =========================================================
// ОСНОВНАЯ ИГРА
// =========================================================

функция initGame(vkID, potionID) {

 // =====================================================
 // АУДИО
 // =====================================================

 const bgMusic = new Audio('фоновая_мелодия.mp3');
 bgMusic.loop = true;
 bgMusic.volume = 0.3;
 const successSound = new Audio('успех.mp3');
 successSound.volume = 1.0;

 const failSound = new Audio('провал.mp3');
 failSound.volume = 0.3;

 // =====================================================
 // ИНГРЕДИЕНТЫ
 // =====================================================

 const ingredientData = {

 'бадьян': {
 name: 'бадьян',
 img: '../ингредиенты/ингредиент_бадьян.png'
 },

 'мандрагора': {
 name: 'мандрагора',
 img: '../ингредиенты/ингредиент_мандрагора.png'
 },

 'медовая_вода': {
 name: 'медовая_вода',
 img: '../ингредиенты/ингредиент_медовая_вода.png'
 },

 'мята': {
 name: 'мята',
 img: '../ингредиенты/ингредиент_мята.png'
 },

 'поганка': {
 name: 'прыгающая_поганка',
 img: '../ингредиенты/ингредиент_прыгающая_поганка.png'
 },

 'чемерица': {
 name: 'чемерица',
 img: '../ингредиенты/ингредиент_чемерица.png'
 }
 };

const readyBtn = document.getElementById('ready-btn');
if (readyBtn) {
 readyBtn.addEventListener('click', () => {
 возвращает if (!isGameActive);
 
 if (выбранные слоты.включает (null)) {
 alert("Вы выбрали не все ингредиенты!");
 Возврат;
 }

 Последовательность начальной загрузки();
 });
}

 // =====================================================
 // НАСТРОЙКИ ИГРЫ
 // =====================================================

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

 пусть countDownInterval = null;


 // =====================================================
 // DOM ЭЛЕМЕНТЫ
 // =====================================================

 const overlay =
 document.getElementById("обратный отсчет-наложение");

 const countdownText = 
 document.getElementById("обратный отсчет-текст");

 const timerDisplay =
 document.getElementById("таймер игры");

 const ячейки = 
 документ.querySelectorAll(".ячейка-слот");

 const chosenSlotElements =
 document.querySelectorAll(".chosen-slot");
 const rotator =
 document.getElementById("slots-rotator");

 // =====================================================
 // ЭЛЕМЕНТЫ ЗАГРУЗКИ
 // =====================================================

 const loadingOverlay =
 document.getElementById("loading-overlay");

 const coffinEls = [
 document.getElementById("coffin-1"),
 document.getElementById("coffin-2"),
 document.getElementById("coffin-3")
 ];

 const loadingTextEl =
 document.getElementById("loading-text");

 const centerStand =
 document.querySelector(".center-stand");

 const failGifContainer =
 document.getElementById("fail-gif-container");

 // =====================================================
 // МОДАЛЬНОЕ ОКНО
 // =====================================================

 const potionModal =
 document.getElementById("potion-modal");

 const modalCloseBtn =
 document.getElementById("modal-close-btn");

 // =====================================================
 // ЗАПУСК МУЗЫКИ
 // =====================================================

 bgMusic.play().catch(() => {
 console.log("Автовоспроизведение заблокировано");
 });


 // =====================================================
 // НАЧАЛО ОТСЧЕТА
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

 } else if (интервал времени > 0) {

 timerDisplay.textContent = `00:0${интеРвал времени}`;

 } else {

 timerDisplay.textContent = `00:00`;

 clearInterval (обратный отсчет времени);

 startLoadingSequence();
 }

 }, 1000);
 }


 // =====================================================
 // ЭКРАН ЗАГРУЗКИ
 // =====================================================

 function startLoadingSequence() {

 isGameActive = false;
 if (countdownInterval) {
 clearInterval(countdownInterval);
 }

 if (rotator) {
 rotator.classList.add("frozen");
 }

 cellSlots.forEach(slot => {
 slot.classList.add("замороженный");
 });

 if (loadingOverlay) {
 loadingOverlay.classList.add("активный");
 }

 const hasCoffins = coffinEls.every(el => el !== null);

 пусть coffinInterval = null;

 пусть currentStep = 0;

 if (hasCoffins) {

 coffinEls.forEach(el => {
 el.classList.remove("активный гроб");
 });

 coffinEls[0].classList.add("active-coffin");

 coffinInterval = setInterval(() => {

 coffinEls[currentStep]
 .classList.remove("active-coffin");

 currentStep = (currentStep + 1) % 3;

 coffinEls[currentStep]
 .classList.add("active-coffin");

 }, 500);
 }

 const fullText = "Загружаем результат...";

 if (loadingTextEl) {

 loadingTextEl.textContent = "";

 let charIndex = 0;

 const typeInterval = setInterval(() => {

 if (charIndex < fullText.length) {

 loadingTextEl.textContent +=
 fullText.charAt(charIndex);

 charIndex++;

 } else {

 clearInterval(typeInterval);
 }

 }, 900 / Полнотекст.длина);
 }

 setTimeout(() => {

 if (coffinInterval) {
 clearInterval(coffinInterval);
 }

 if (loadingOverlay) {
 loadingOverlay.classList.remove("активен");
 }

 showGameResult();

 }, 4000);
 }


 // =====================================================
 // РЕЗУЛЬТАТ ИГРЫ
 // =====================================================

 function showGameResult() {

 const isSuccess =
 winRecipe.every(ingredient =>
 chosenSlots.includes(ingredient)
 ) &&
 chosenSlots.every(slot =>
 slot !== null &&
 winRecipe.includes(slot)
 );

 if (failGifContainer) {

 failGifContainer.classList.remove("run-animation");

 void failGifContainer.offsetWidth;

 const uniqueGifPath =
 'провал_гиф.gif?t=' + Date.now();

 failGifContainer.style.backgroundImage =
 `url('${uniqueGifPath}')`;
 }


 // =================================================
 // УСПЕХ
 // =================================================

 if (isSuccess) {

 successSound.play();

 let userData = null;
 try {
 userData = JSON.parse(localStorage.getItem('userProfile'));
 } catch (e) {
 userData = null;
 }

 const playerName =
 userData?.name ||
 userData?.username ||
 "Гость";

 const timeSpent = startTime - timeLeft;
 saveResultToLeaderboard(playerName, timeSpent);

 // СОХРАНЯЕМ ПРОХОЖДЕНИЕ
 localStorage.setItem(
 `lastPlayed_${vkID}_${potionID}`,
 new Date().toDateString()
 );

 isGameActive = false;

 if (countdownInterval) {
 clearInterval(countdownInterval);
 }

 bgMusic.pause();
 bgMusic.currentTime = 0;

 timerDisplay.textContent = "Успех!";
 timerDisplay.className = "game-timer win-status";

 // ПОСЛЕДНЕЕ ЗЕЛЬЕ
 if (centerStand) {

 const finalPotion =
 document.createElement("div");

 finalPotion.className =
 "final-potion-result";

 centerStand.appendChild(finalPotion);
 }

 // =============================================
 // ПОЯВЛЕНИЕ СВИТКА
 // =============================================

 setTimeout(() => {

 if (potionModal) {

 potionModal.classList.add("active");

 const closeButton =
 modalCloseBtn ||
 potionModal.querySelector("button");

 if (closeButton) {

 closeButton.onclick = (e) => {

 e.preventDefault();

 potionModal.classList.remove("active");
 potionModal.style.display = "none";

 const waitModal =
 document.getElementById('wait-modal');

 if (waitModal) {

 waitModal.style.display = 'flex';

 if (understandBtn) {
 understandBtn.onclick = () => {
 окно.Расположение.href = '../menu/menu.html';
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
 timerDisplay.className = "состояние потери игрового таймера";

 if (failGifContainer) {
 failGifContainer.classList.add("запуск анимации");
 }

 setTimeout(() => {
 if (failGifContainer) {
 failGifContainer.classList.remove("выполнить анимацию");
 failGifContainer.style.backgroundImage = "none";
 }

 const waitModal = document.getElementById("wait-modal");
 if (waitModal) {
 waitModal.style.display = "flex";
 }
 }, 2500);
 }
 }

 // =====================================================
 // ВЫБОР ИНГРЕДИЕНТОВ
 // =====================================================

 cellSlots.forEach(slot => {

 slot.addEventListener("click", () => {

 if (bgMusic.paused) {
 bgMusic.play().catch(() => {});
 }

 if (!isGameActive) return;

 const type =
 slot.getAttribute("data-ingredient");

 if (chosenSlots.includes(type)) return;

 const freeIndex =
 chosenSlots.findIndex(item => item === null);

 if (freeIndex !== -1) {

 chosenSlots[freeIndex] = type;

 slot.classList.remove("grayscale");
 slot.classList.add("active-selected");

 const targetSlot =
 document.getElementById(`slot-${freeIndex}`);

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
 // ОЧИСТКА СЛОТОВ
 // =====================================================

 chosenSlotElements.forEach(slotElement => {

 slotElement.addEventListener("щелчок", () => {

 if (!isGameActive) возвращает;

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
 matchingCell.classList.remove("active-selected");
 matchingCell.classList.add("grayscale");
 }
 }
 });
 });


 // =====================================================
 // МАГИЧЕСКИЙ ШЛЕЙФ
 // =====================================================

 const appleImages = [ 
 '../меню/apple 1.png', 
 '../меню/apple 2.png'
 ];

 функция createApple(x, y) {

 const apple = document.createElement('img');

 apple.src =
 appleImages[
 Math.floor(Math.random() * appleImages.length)
 ];

 apple.style.position = 'fixed';
 apple.style.left = (x - 20) + 'px';
 apple.style.top = (y - 20) + 'px';
 apple.style.width = (25 + Math.random() * 25) + 'px';
 apple.style.pointerEvents = 'none';
 apple.style.opacity = '1';
 apple.style.zIndex = '999999';
 apple.style.transition =
 'transform 1.5s ease-out, opacity 1.5s ease-out';

 document.body.appendChild(apple);
 const randomX = (Math.random() - 0.5) * 120;
 const randomRotate = (Math.random() - 0.5) * 540;

 requestAnimationFrame(() => {
 apple.style.transform =
 `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;
 apple.style.opacity = '0';
 });

 setTimeout(() => { apple.remove(); }, 1500);
 }

 document.addEventListener('click', e => {
 createApple(e.clientX, e.clientY);
 });

 let isMouseDown = false;

 document.addEventListener('mousedown', e => {
 if (e.button === 0) isMouseDown = true;
 });

 document.addEventListener('mouseup', e => {
 if (e.button === 0) isMouseDown = false;
 });

 let lastAppleTime = 0;

 document.addEventListener('mousemove', e => {
 if (isMouseDown && Date.now() - Время последнего приложения > 60) {
 Создать Apple(например,clientX, например,clientY);
 lastAppleTime = Дата.сейчас();
 }
 });
}


// =====================================================
// ТАБЛИЦА ЛИДЕРОВ
// =====================================================

function saveResultToLeaderboard(name, time) {
 let leaderboard = JSON.parse(localStorage.getItem("potion_leaderboard")) || [];
 leaderboard.push({
 name: name,
 timeSpent: time,
 date: new Date().toLocaleDateString()
 });
 leaderboard.sort((a, b) => a.timeSpent - b.timeSpent);
 localStorage.setItem("potion_leaderboard", JSON.stringify(leaderboard));
}


// =====================================================
// МОБИЛЬНАЯ ВЕРСИЯ: свайп шапки + скроллинг
// Работает только на сенсорных устройствах
// =====================================================

(function () {

 var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
 if (!isTouch) return;

 var header = document.querySelector('.site-header');

 function isLandscape() {
 if (screen.orientation) {
 return screen.orientation.type.indexOf('landscape') !== -1;
 }
 return window.innerWidth > window.innerHeight
 }

 // ── Разрешаем/блокируем скролл по ориентации ──
 function applyScrollMode() {
 var gameContainer = document.querySelector('.game-контейнер');

 if (isLandscape()) {
 // Снимаем overflow:hidden с body (он задан в базовом CSS)
 document.body.style.overflowY = 'авто';
 document.body.style.overflowX = 'скрытый';
 document.body.style.height = 'auto';
 document.body.style.alignItems = 'flex-start';
 document.body.style.touchAction = 'pan-y';
 if (gameContainer) {
 gameContainer.style.height = '115vh';
 gameContainer.style.overflow = 'visible';
 gameContainer.style.paddingTop = '46px';
 gameContainer.style.boxSizing = 'border-box';
 gameContainer.style.touchAction = 'pan-y';
 }
 } else {
 // Портрет — исходное состояние
 document.body.style.overflowY = 'hidden';
 document.body.style.height = '100%';
 document.body.style.alignItems = 'center';
 document.body.style.touchAction = '';

 if (gameContainer) {
 gameContainer.style.height = '75vw';
 gameContainer.style.overflow = '';
 gameContainer.style.paddingTop = '';
 gameContainer.style.touchAction = '';
 }
 }
 }

 applyScrollMode();
 window.addEventListener('orientationchange', function () { setTimeout(applyScrollMode, 200); });
 window.addEventListener("изменить размер", applyScrollMode);

 // ── Свайп шапки вверх (скрыть) / вниз (показать) ──
 if (!заголовок) возвращает;

 var touchStartY = 0;
 var touchStartX = 0;
 var touchStartTime = 0;
 var isHidden = false;

 document.addEventListener('touchstart', function (e) {
 touchStartY = e.touches[0].clientY;
 touchStartX = e.touches[0].clientX;
 touchStartTime = Date.now();
 }, { passive: true });

 document.addEventListener('touchend', function (e) {
 if (!isLandscape()) return;

 var endY = e.changedTouches[0].clientY;
 var EndX = e.Измененные касания[0].clientX;
 var deltaY = touchStartY - endY; // > 0 = вверх
 var deltaX = Math.abs(touchStartX - EndX);
 var elapsed = Date.now() - Время запуска касания;

 если (истекло > 500) вернуть;
 if (Math.abs(deltaY) < 35) возвращает;
 if (deltaX > Math.abs(deltaY)) return; // горизонтальный свайп — игнор

 if (deltaY > 0 && !isHidden) {
 header.classList.add('скрытый заголовок');
 header.classList.remove('видимый заголовок');
 isHidden = true;
 } else if (deltaY < 0 && isHidden) {
 header.classList.remove('скрытый заголовок');
 header.classList.add('видимый заголовок');
 isHidden = false;
 } 
 }, { пассивный: true });

 // При повороте обратно в портрет — шапка всегда видна
 window.addEventListener('orientationchange', функция () { 
 setTimeout(функция () { 
 if (!isLandscape()) {
 header.classList.remove('скрытый заголовок');
 header.classList.add('видимый заголовок');
 isHidden = false;
 }
 }, 200);
 });

})();
