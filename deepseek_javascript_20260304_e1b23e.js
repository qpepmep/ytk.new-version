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

// Новости
let newsData = [];

// Загрузка новостей из localStorage
function loadNews() {
    const saved = localStorage.getItem('newsData');
    if (saved) {
        newsData = JSON.parse(saved);
        displayNews();
    }
}

// Сохранение новостей в localStorage
function saveNews() {
    localStorage.setItem('newsData', JSON.stringify(newsData));
}

// Отображение новостей
function displayNews() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    newsData.forEach((news, index) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.style.animationDelay = `${index * 0.1}s`;
        
        let imageHtml = '';
        if (news.image) {
            imageHtml = `<img src="${news.image}" alt="${news.title}" class="news-image">`;
        }
        
        newsCard.innerHTML = `
            ${imageHtml}
            <div class="news-content">
                <h3>${escapeHtml(news.title)}</h3>
                <p>${escapeHtml(news.description)}</p>
                <div class="news-date">
                    <i class="far fa-calendar-alt"></i> ${formatDate(news.date)}
                </div>
            </div>
        `;
        
        container.appendChild(newsCard);
    });
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Форматирование даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Добавление новости
function addNews() {
    const title = document.getElementById('newsTitle');
    const desc = document.getElementById('newsDesc');
    const date = document.getElementById('newsDate');
    const imageInput = document.getElementById('newsImage');
    
    if (!title.value || !desc.value || !date.value) {
        showNotification('Пожалуйста, заполните все поля!', 'error');
        return;
    }
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const news = {
                title: title.value,
                description: desc.value,
                date: date.value,
                image: e.target.result
            };
            
            newsData.push(news);
            saveNews();
            displayNews();
            clearForm();
            showNotification('Новость успешно добавлена!', 'success');
        };
        
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const news = {
            title: title.value,
            description: desc.value,
            date: date.value,
            image: null
        };
        
        newsData.push(news);
        saveNews();
        displayNews();
        clearForm();
        showNotification('Новость успешно добавлена!', 'success');
    }
}

// Очистка формы
function clearForm() {
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsDesc').value = '';
    document.getElementById('newsDate').value = '';
    document.getElementById('newsImage').value = '';
    document.getElementById('imagePreview').innerHTML = '';
}

// Показ уведомления
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Предпросмотр изображения
document.getElementById('newsImage')?.addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            preview.appendChild(img);
        };
        
        reader.readAsDataURL(this.files[0]);
    }
});

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

// Загрузка новостей при старте
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    
    // Добавляем стили для уведомлений
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 2000;
            animation: slideIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .notification.success {
            background: linear-gradient(135deg, #40E0D0, #8A2BE2);
        }
        
        .notification.error {
            background: linear-gradient(135deg, #ff6b6b, #ee5253);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
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