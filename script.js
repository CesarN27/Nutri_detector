document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATOS COMPLETOS (EXTRAÍDOS DEL PDF) ---
    // 'isHealthy: true' = Saludable
    // 'isHealthy: false' = SOS
    const initialFoodData = [
        {
            name: 'Nueces y Almendras',
            image: 'image/nueces.jpg',
            isHealthy: true,
            explanation: ' Un puñado de nueces y almendras. Saludable (NOVA 1 = mínimamente procesado) Beneficio.:¡Súper-Memoria! Grasas saludables que nutren tu cerebro para el examen.'

        },
        {
            name: 'Refresco Azucarado',
            image: 'image/coca.jpeg',
            isHealthy: false,
            explanation: 'Una lata de refresco azucarado. SOS (NOVA 4 = Ultra procesado) Guía 2025: ¡Fuera de tu plato diario! Limita las bebidas con azúcares añadidos.'
        },
        {
            name: 'Lentejas o Frijoles',
            image: 'image/Lentejas.jpeg',
            isHealthy: true,
            explanation: 'Un plato de lentejas o frijoles. Saludable (NOVA 1 mínimamente procesado) Guía 2025: ¡Proteína Sostenible! Base de la alimentación mexicana y aliada del planeta.'
        },
        {
            name: 'Barra de Cereal (Ultraprocesada)',
            image: 'image/barraProte.jpeg',
            isHealthy: false,
            explanation: 'Una barra de cereal con muchos ingredientes impronunciables. SOS (NOVA 4 = Ultra procesado) Clasificación NOVA: ¡Cuidado! Más de 5 ingredientes = Ultraprocesado. Léela bien.'
        },
        {
            name: 'Vaso de Agua Simple',
            image: 'image/agua.jpeg',
            isHealthy: true,
            explanation: 'Un vaso de agua simple. Saludable (NOVA 1 = mínimamente procesado) Beneficio.: ¡Mejor Concentración! Mantente hidratado, es clave para el enfoque.'
        },
        {
            name: 'Papas Fritas (Comerciales)',
            image: 'image/papitas.jpeg',
            isHealthy: false,
            explanation: 'Una bolsa de papas fritas comerciales. SOS (NOVA 4 = Ultra procesado) Clasificación NOVA: Alto en sodio y grasas. Evítalos para proteger tu corazón.'
        },
        {
            name: 'Aguacate en Tostada',
            image: 'image/aguacate.jpeg',
            isHealthy: true,
            explanation: 'Aguacate en una tostada. Saludable (NOVA 1 = mínimamente procesado) Beneficio.: ¡Omega-3 Power! Reduce la fatiga mental y el estrés.'
        },
        {
            name: 'Manzana Fresca',
            image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
            isHealthy: true,
            explanation: 'Un plátano o manzana fresca. Saludable (NOVA 1 = mínimamente procesado) Guía 2025: ¡5 al día! Comer frutas y verduras de temporada para tu salud.'
        },
        {
            name: 'Pan Blanco Industrial',
            image: 'image/Pan.jpeg',
            isHealthy: false,
            explanation: 'Una pieza de pan blanco industrial. SOS (NOVA 3 = Procesado) Guía 2025: Prefiere granos enteros para más fibra y energía duradera.'
        },
        {
            name: 'Semillas de Calabaza (Pepitas)',
            image: 'image/Semillas.jpeg',
            isHealthy: true,
            explanation: 'Un puñado de semillas de calabaza (pepitas). Saludable (NOVA 1 = mínimamente procesado). Beneficio.: ¡Fuente de hierro! Combate el cansancio y la anemia estudiantil.'
        }
    ];

    let foodData = [];
    let currentCardIndex = 0;
    let score = 0;
    let gameTimer = null;
    let lowTimeTimer = null; // Timer para la barra roja
    const TIME_LIMIT = 5000; // 5 segundos
    const LOW_TIME_THRESHOLD = 2000; // 2 segundos para barra roja

    // --- 2. REFERENCIAS A ELEMENTOS DEL DOM ---
    const cardDeck = document.getElementById('card-deck');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const scoreDisplay = document.getElementById('score');
    const timerBar = document.getElementById('timer-bar');
    const heartFeedback = document.getElementById('heart-feedback');
    const dislikeFeedback = document.getElementById('dislike-feedback');

    const feedbackScreen = document.getElementById('feedback-screen');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const nextBtn = document.getElementById('next-btn');

    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    // --- 3. FUNCIONES PRINCIPALES DEL JUEGO ---

    function startGame() {
        score = 0;
        currentCardIndex = 0;
        scoreDisplay.textContent = score;
        foodData = [...initialFoodData].sort(() => Math.random() - 0.5); // Desordenar
        
        gameOverScreen.classList.add('hidden');
        feedbackScreen.classList.add('hidden');
        
        loadNextCard();
    }

    function loadNextCard() {
        if (cardDeck.firstChild) {
            cardDeck.removeChild(cardDeck.firstChild);
        }

        clearTimers(); // Limpia timers anteriores

        if (currentCardIndex >= foodData.length) {
            endGame();
            return;
        }

        const item = foodData[currentCardIndex];
        const card = createCardElement(item);
        cardDeck.appendChild(card);

        startTimer();
    }

    function createCardElement(item) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
        `;
        return card;
    }

    function startTimer() {
        // Reiniciar la barra visual
        timerBar.classList.remove('low-time');
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        void timerBar.offsetWidth; // Forzar reflow
        timerBar.style.transition = `width ${TIME_LIMIT / 1000}s linear`;
        timerBar.style.width = '0%';

        // Temporizador de penalización (5 segundos)
        gameTimer = setTimeout(() => {
            handleChoice(null);
        }, TIME_LIMIT);

        // NUEVO: Temporizador para la barra roja
        lowTimeTimer = setTimeout(() => {
            timerBar.classList.add('low-time');
        }, TIME_LIMIT - LOW_TIME_THRESHOLD);
    }
    
    function clearTimers() {
        clearTimeout(gameTimer);
        clearTimeout(lowTimeTimer); // Limpiar también el timer de la barra roja
    }

    function handleChoice(userChoice) {
        clearTimers(); // Detener el conteo

        const card = cardDeck.firstChild;
        if (!card) return;

        const item = foodData[currentCardIndex];
        const isCorrect = userChoice === item.isHealthy;
        const isTimeout = userChoice === null;
        
        let swipeDirection = '';

        if (isTimeout) {
            swipeDirection = 'timeout';
        } else {
            swipeDirection = userChoice ? 'swipe-right' : 'swipe-left';
            if (isCorrect) {
                score++;
                scoreDisplay.textContent = score;
                // Activar animación de emoji correcta
                if (item.isHealthy) { 
                    animateHeart();
                } else {
                    animateDislike();
                }
            }
        }

        card.classList.add(swipeDirection);
        currentCardIndex++;

        // Mostrar el modal de explicación después de la animación de swipe
        setTimeout(() => {
            showFeedback(item, isCorrect, isTimeout);
        }, 400); // 400ms (coincide con la transición CSS)
    }

    function animateHeart() {
        heartFeedback.classList.remove('hidden');
        heartFeedback.classList.remove('heart-pulse-animation');
        void heartFeedback.offsetWidth;
        heartFeedback.classList.add('heart-pulse-animation');
        setTimeout(() => {
            heartFeedback.classList.add('hidden');
            heartFeedback.classList.remove('heart-pulse-animation');
        }, 1000); 
    }

    function animateDislike() {
        dislikeFeedback.classList.remove('hidden');
        dislikeFeedback.classList.remove('dislike-shake-animation');
        void dislikeFeedback.offsetWidth;
        dislikeFeedback.classList.add('dislike-shake-animation');
        setTimeout(() => {
            dislikeFeedback.classList.add('hidden');
            dislikeFeedback.classList.remove('dislike-shake-animation');
        }, 1000);
    }

    function showFeedback(item, isCorrect, isTimeout) {
        if (isTimeout) {
            feedbackTitle.textContent = "¡Tiempo Fuera!";
            feedbackTitle.className = 'incorrect-feedback';
        } else if (isCorrect) {
            feedbackTitle.textContent = "¡Correcto!";
            feedbackTitle.className = 'correct-feedback';
        } else {
            feedbackTitle.textContent = "¡Incorrecto!";
            feedbackTitle.className = 'incorrect-feedback';
        }

        // Carga la explicación del PDF
        feedbackExplanation.textContent = item.explanation;
        feedbackScreen.classList.remove('hidden');
    }

    function endGame() {
        finalScoreDisplay.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    // --- 4. EVENT LISTENERS ---
    btnLeft.addEventListener('click', () => handleChoice(false)); // false = SOS 
    btnRight.addEventListener('click', () => handleChoice(true)); // true = Saludable 
    restartBtn.addEventListener('click', startGame);

    nextBtn.addEventListener('click', () => {
        feedbackScreen.classList.add('hidden');
        loadNextCard();
    });

    // --- 5. INICIAR EL JUEGO ---
    startGame();
});