document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    const projectDemos = document.querySelectorAll('.project-demo');
    const animatedBox = document.querySelector('.animated-box');
    
    // Анимация появления карточек навыков и проектов
    [...skillCards, ...projectDemos].forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 200);
    });

    // Инициализация часов
    initClock();

    // Инициализация куба 3D
    initCubeAnimation();

    // Инициализация интерфейса перетаскивания
    initDragAndDrop();

    // Инициализация кастомного слайдера
    initCustomSlider();

    // Инициализация карты скретча
    initScratchCard();

    // Анимация при наведении на анимированную коробку
    if (animatedBox) {
        animatedBox.addEventListener('mouseover', () => {
            animatedBox.style.backgroundColor = '#ff0044';
            animatedBox.style.transform = 'scale(1.1)';
        });

        animatedBox.addEventListener('mouseout', () => {
            animatedBox.style.backgroundColor = '#0077ff';
            animatedBox.style.transform = 'scale(1)';
        });
        
        // Обработка для мобильных устройств
        animatedBox.addEventListener('touchstart', () => {
            animatedBox.style.backgroundColor = '#ff0044';
            animatedBox.style.transform = 'scale(1.1)';
        });

        animatedBox.addEventListener('touchend', () => {
            animatedBox.style.backgroundColor = '#0077ff';
            animatedBox.style.transform = 'scale(1)';
        });
    }
});

// Функция для часов
function initClock() {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secondDegrees = ((seconds / 60) * 360) + 90;
        const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
        const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }

    setInterval(updateClock, 1000);
    updateClock();
}

// Функция для анимации куба 3D
function initCubeAnimation() {
    const cube = document.querySelector('.cube');
    let rotation = { x: 0, y: 0 };

    cube.addEventListener('mousemove', (event) => {
        const sensitivity = 0.1;
        rotation.x += event.movementY * sensitivity;
        rotation.y += event.movementX * sensitivity;
        cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    });

    // Поддержка для сенсорных экранов
    cube.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        const sensitivity = 0.1;
        rotation.x += touch.clientY * sensitivity;
        rotation.y += touch.clientX * sensitivity;
        cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    });
}

// Функция для интерфейса перетаскивания
function initDragAndDrop() {
    const draggable = document.querySelector('.draggable');
    const dropZone = document.querySelector('.drop-zone');

    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('over');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('over');
        dropZone.textContent = '¡Elemento soltado!';
    });

    // Поддержка для сенсорных устройств
    draggable.addEventListener('touchstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        draggable.style.left = `${touch.clientX - draggable.offsetWidth / 2}px`;
        draggable.style.top = `${touch.clientY - draggable.offsetHeight / 2}px`;
    });

    draggable.addEventListener('touchend', (event) => {
        event.preventDefault();
        draggable.classList.remove('dragging');
        
        // Проверка, находится ли draggable в dropZone
        const rect = dropZone.getBoundingClientRect();
        const draggableRect = draggable.getBoundingClientRect();

        if (
            draggableRect.left >= rect.left &&
            draggableRect.right <= rect.right &&
            draggableRect.top >= rect.top &&
            draggableRect.bottom <= rect.bottom
        ) {
            dropZone.textContent = '¡Elemento soltado!';
        }
    });
}

// Функция для кастомного слайдера
function initCustomSlider() {
    const slider = document.querySelector('.custom-slider');
    const sliderValue = document.querySelector('.slider-value');

    slider.addEventListener('input', () => {
        sliderValue.textContent = slider.value;
    });
}

// Функция для карты скретча с поддержкой сенсорных экранов
function initScratchCard() {
    const canvas = document.querySelector('.scratch-card');
    const container = document.querySelector('.demo-box');
    if (canvas && container) {
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = 'https://studionomad.kz/public/images/picture/blog/5507-web%20(1).jpg';

        // Подгоняем размер canvas под размер контейнера
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        image.onload = () => {
            // Отображаем изображение в canvas
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Создаем черный слой поверх изображения
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Устанавливаем режим для стирания
            ctx.globalCompositeOperation = 'destination-out';

            // Добавляем обработчики для мыши и сенсорных устройств
            addScratchListeners(canvas, ctx);
        };
    }
}

function addScratchListeners(canvas, ctx) {
    let isDrawing = false;

    function getCoordinates(event, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX ? event.clientX - rect.left : event.touches[0].clientX - rect.left;
        const y = event.clientY ? event.clientY - rect.top : event.touches[0].clientY - rect.top;
        return { x, y };
    }

    function startDrawing(event) {
        isDrawing = true;
        const { x, y } = getCoordinates(event, canvas);
        drawScratch(ctx, x, y);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function scratch(event) {
        if (!isDrawing) return;
        event.preventDefault();
        const { x, y } = getCoordinates(event, canvas);
        drawScratch(ctx, x, y);
    }

    function drawScratch(ctx, x, y) {
        const radius = 30; // Размер кисти

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    // Обработчики для мыши
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Обработчики для сенсорных устройств
    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startDrawing(event);
    }, { passive: false });

    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        scratch(event);
    }, { passive: false });

    canvas.addEventListener('touchend', (event) => {
        event.preventDefault();
        stopDrawing();
    }, { passive: false });
}