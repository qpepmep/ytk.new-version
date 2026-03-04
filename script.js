// Функция копирования текста в буфер обмена
function copyToClipboard(text, type) {
    // Используем современный API Clipboard
    navigator.clipboard.writeText(text).then(() => {
        // Показываем уведомление об успешном копировании
        showCopyNotification(`${type} скопирован в буфер обмена!`);
        
        // Добавляем эффект на карточку
        const activeCard = event.currentTarget;
        activeCard.classList.add('copy-success');
        
        // Убираем эффект через секунду
        setTimeout(() => {
            activeCard.classList.remove('copy-success');
        }, 500);
        
    }).catch(err => {
        // Если API не работает, используем запасной метод
        fallbackCopyText(text, type);
    });
}

// Запасной метод копирования для старых браузеров
function fallbackCopyText(text, type) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(`${type} скопирован в буфер обмена!`);
        
        const activeCard = event.currentTarget;
        activeCard.classList.add('copy-success');
        
        setTimeout(() => {
            activeCard.classList.remove('copy-success');
        }, 500);
        
    } catch (err) {
        showCopyNotification('Не удалось скопировать', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Функция показа уведомления
function showCopyNotification(message, type = 'success') {
    // Удаляем предыдущее уведомление, если есть
    const oldNotification = document.querySelector('.copy-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 2.5 секунды
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

// Добавляем поддержку touch-событий для мобильных устройств
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('touchstart', function(e) {
            // Для мобильных устройств показываем подсказку дольше
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 1000);
        });
    });
});

// Меню
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

if (burger && menu) {
    burger.addEventListener('click', () => {
        menu.classList.toggle('active');
        burger.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

// Снег
const snowCanvas = document.getElementById('snow');
const snowCtx = snowCanvas.getContext('2d');
const cursorCanvas = document.getElementById('cursorSnow');
const cursorCtx = cursorCanvas.getContext('2d');

let width, height;
let snowflakes = [];
let cursorSnowflakes = [];
let mouseX = 0;
let mouseY = 0;

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
    if (cursorSnowflakes.length > 150) {
        cursorSnowflakes = cursorSnowflakes.slice(-150);
    }
});

// Анимация
function animate() {
    snowCtx.clearRect(0, 0, width, height);
    cursorCtx.clearRect(0, 0, width, height);
    
    drawBackgroundSnow();
    drawCursorSnow();
    
    requestAnimationFrame(animate);
}

// Рисование фонового снега
function drawBackgroundSnow() {
    snowCtx.beginPath();
    
    snowflakes.forEach(flake => {
        snowCtx.moveTo(flake.x, flake.y);
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        
        flake.y += flake.speed;
        
        if (flake.y > height) {
            flake.y = 0;
            flake.x = Math.random() * width;
        }
        
        flake.x += Math.sin(flake.y * 0.01) * 0.2;
    });
    
    snowCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    snowCtx.fill();
}

// Рисование снега за курсором
function drawCursorSnow() {
    cursorCtx.beginPath();
    
    cursorSnowflakes = cursorSnowflakes.filter(flake => {
        flake.y += flake.speed;
        flake.x += (Math.random() - 0.5) * 0.5;
        flake.life -= 1;
        flake.opacity *= 0.99;
        
        cursorCtx.moveTo(flake.x, flake.y);
        cursorCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        
        return flake.life > 0 && flake.y < height + 50 && flake.opacity > 0.01;
    });
    
    cursorCtx.fillStyle = 'white';
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

// Запуск
init();

// Плавная прокрутка
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
document.querySelectorAll('.contact-card, .resource-card').forEach(card => {
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
