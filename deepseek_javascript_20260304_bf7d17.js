// Меню
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

if (burger && menu) {
    burger.addEventListener('click', () => {
        menu.classList.toggle('active');
        burger.classList.toggle('active');
    });
}

// Основной снег
const snowCanvas = document.getElementById('snow');
const snowCtx = snowCanvas.getContext('2d');

// Снег за курсором
const cursorCanvas = document.getElementById('cursorSnow');
const cursorCtx = cursorCanvas.getContext('2d');

let width, height;
let snowflakes = [];
let cursorSnowflakes = [];
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;

// Инициализация
function init() {
    resizeCanvas();
    createSnowflakes(200);
    createCursorSnowflakes(30);
    animate();
}

// Изменение размера канваса
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    snowCanvas.width = width;
    snowCanvas.height = height;
    cursorCanvas.width = width;
    cursorCanvas.height = height;
}

// Создание снежинок для фона
function createSnowflakes(count) {
    snowflakes = [];
    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
}

// Создание снежинок для курсора
function createCursorSnowflakes(count) {
    cursorSnowflakes = [];
    for (let i = 0; i < count; i++) {
        cursorSnowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 1 + 0.3,
            opacity: Math.random() * 0.8 + 0.2,
            life: Math.random() * 100
        });
    }
}

// Отслеживание мыши
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Добавляем новые снежинки за курсором
    for (let i = 0; i < 3; i++) {
        cursorSnowflakes.push({
            x: mouseX + (Math.random() - 0.5) * 30,
            y: mouseY + (Math.random() - 0.5) * 30,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5,
            opacity: 0.8,
            life: 100
        });
    }
    
    // Ограничиваем количество снежинок
    if (cursorSnowflakes.length > 100) {
        cursorSnowflakes = cursorSnowflakes.slice(-100);
    }
});

// Анимация
function animate() {
    // Очищаем канвасы
    snowCtx.clearRect(0, 0, width, height);
    cursorCtx.clearRect(0, 0, width, height);
    
    // Рисуем фоновый снег
    drawBackgroundSnow();
    
    // Рисуем снег за курсором
    drawCursorSnow();
    
    requestAnimationFrame(animate);
}

// Рисование фонового снега
function drawBackgroundSnow() {
    snowCtx.beginPath();
    
    snowflakes.forEach(flake => {
        snowCtx.moveTo(flake.x, flake.y);
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        
        // Движение снежинок
        flake.y += flake.speed;
        
        // Сброс вверх
        if (flake.y > height) {
            flake.y = 0;
            flake.x = Math.random() * width;
        }
        
        // Легкое покачивание
        flake.x += Math.sin(flake.y * 0.01) * 0.2;
    });
    
    snowCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    snowCtx.fill();
}

// Рисование снега за курсором
function drawCursorSnow() {
    cursorCtx.beginPath();
    
    // Обновляем и рисуем снежинки
    cursorSnowflakes = cursorSnowflakes.filter(flake => {
        // Движение
        flake.y += flake.speed;
        flake.x += (Math.random() - 0.5) * 0.5;
        flake.life -= 1;
        flake.opacity *= 0.99;
        
        // Рисуем
        cursorCtx.moveTo(flake.x, flake.y);
        cursorCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        
        // Удаляем старые снежинки
        return flake.life > 0 && flake.y < height + 50 && flake.opacity > 0.01;
    });
    
    cursorCtx.fillStyle = 'white';
    cursorCtx.fill();
    
    // Добавляем эффект свечения
    cursorCtx.shadowColor = 'white';
    cursorCtx.shadowBlur = 10;
    cursorCtx.fill();
    cursorCtx.shadowBlur = 0;
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    resizeCanvas();
    createSnowflakes(200);
});

// Добавляем снежинки вокруг курсора при клике
document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 50;
        
        cursorSnowflakes.push({
            x: e.clientX + Math.cos(angle) * radius,
            y: e.clientY + Math.sin(angle) * radius,
            radius: Math.random() * 4 + 2,
            speed: Math.random() * 3 + 1,
            opacity: 1,
            life: 50
        });
    }
});

// Запуск
init();

// Плавная прокрутка для якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Эффект параллакса для карточек
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-10px)';
    });
});