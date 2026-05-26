// Ждем, пока вся страница и её структура полностью загрузятся

document.addEventListener("DOMContentLoaded", () => {

   

    // ПРИНУДИТЕЛЬНЫЙ ВОЗВРАТ КУРСОРA ИЗ КОДА (Подстраховка для браузера)

    document.documentElement.style.cursor = "url('custom-cursor.png') 0 0, auto";

    document.body.style.cursor = "url('custom-cursor.png') 0 0, auto";



    // 1. ЛОГИКА ДЛЯ ЗЕЛЬЕВАРЕНИЯ

    const talkativePotion = document.getElementById("potion-talkative");



    if (talkativePotion) {

        talkativePotion.addEventListener("click", () => {

            startPotionGame();

        });

    }



});



/**

 * Функция запускает процесс варки Болтливого зелья

 */

function startPotionGame() {

    alert("Вы выбрали Болтливое зелье! Начинаем зельеварение...");

}





// =================================================================

// 2. МАГИЧЕСКИЙ ЭФФЕКТ: ЯБЛОКИ ПРИ КЛИКЕ И ДВИЖЕНИИ

// =================================================================



// Массив с картинками яблок напрямую из текущей папки

const appleImages = [

    'apple 1.png',

    'apple 2.png'

];



// Функция создания одного падающего/взлетающего яблока

function createApple(x, y) {

    const apple = document.createElement('img');



    // Случайный выбор между apple 1.png и apple 2.png

    apple.src = appleImages[Math.floor(Math.random() * appleImages.length)];



    // Задаем начальные стили элемента на экране

    apple.style.position = 'fixed';

    apple.style.left = (x - 20) + 'px'; // Центрируем яблоко по кончику курсора

    apple.style.top = (y - 20) + 'px';

    apple.style.width = (25 + Math.random() * 25) + 'px'; // Случайный размер от 25px до 50px

    apple.style.pointerEvents = 'none'; // Эффект прозрачен для кликов и не мешает интерфейсу

    apple.style.opacity = '1';

    apple.style.zIndex = '9999'; // Отображается поверх всей игры и шапки

    apple.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';



    document.body.appendChild(apple);



    // Разброс в стороны и случайное вращение яблока в полете

    const randomX = (Math.random() - 0.5) * 120;

    const randomRotate = (Math.random() - 0.5) * 540;



    // Анимация полета вверх и плавного растворения

    requestAnimationFrame(() => {

        apple.style.transform = `translate(${randomX}px, -140px) rotate(${randomRotate}deg)`;

        apple.style.opacity = '0';

    });



    // Безопасное удаление элемента из памяти после завершения анимации

    setTimeout(() => {

        apple.remove();

    }, 1500);

}



// Появление яблока при одиночном клике мышкой

document.addEventListener('click', e => {

    createApple(e.clientX, e.clientY);

});



// Шлейф из яблок при зажатой левой кнопке мыши (ЛКМ)

let isMouseDown = false;



document.addEventListener('mousedown', e => {

    if (e.button === 0) {

        isMouseDown = true;

    }

});



document.addEventListener('mouseup', e => {

    if (e.button === 0) {

        isMouseDown = false;

    }

});



document.addEventListener('mousemove', e => {

    // Создаем яблоки при движении с зажатой ЛКМ, но не чаще чем раз в 60мс, чтобы не перегружать процессор

    if (isMouseDown && (!window.lastAppleTime || Date.now() - window.lastAppleTime > 60)) {

        createApple(e.clientX, e.clientY);

        window.lastAppleTime = Date.now();

    }

}); 

