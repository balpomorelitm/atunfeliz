document.addEventListener('DOMContentLoaded', () => {

    // --- Definición de elementos del DOM ---
    const deckElement = document.getElementById('deck');
    const activeCardElement = document.getElementById('active-card');
    const cardIconElement = document.getElementById('card-icon');
    const cardActionText = document.getElementById('card-action');
    const actionButtons = document.getElementById('action-buttons');
    const passButton = document.getElementById('pass-btn');
    const completeButton = document.getElementById('complete-btn');
    const winMessageElement = document.getElementById('win-message');
    const restartButton = document.getElementById('restart-btn');
    const cardCountElement = document.getElementById('card-count');
    const changeToggleButton = document.getElementById('change-toggle-btn');

    let includeChangeCards = true;

    // --- Definición de las cartas ---
    const cardActions = [
        "Choca esos 5",
        "Puños de atún",
        "Atún feliz",
        "Cambio"
    ];

    const cardIcons = {
        "Choca esos 5": "✋",
        "Puños de atún": "🐟+👊",
        "Atún feliz": "🐟",
        "Cambio": "🔄"
    };


    let playerDeck = [];
    let currentCard = null;

    function cardClass(action) {
        switch (action.toLowerCase()) {
            case 'choca esos 5':
                return 'card-choca';
            case 'puños de atún':
                return 'card-punos';
            case 'atún feliz':
                return 'card-atun';
            case 'cambio':
            case 'cambios':
                return 'card-cambio';
            default:
                return '';
        }
    }

    function updateCardCount() {
        const total = playerDeck.length + (currentCard ? 1 : 0);
        cardCountElement.textContent = `Cartas restantes: ${total}`;
    }

    /**
     * Devuelve un color RGB aleatorio.
     */
    function randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // --- Funciones del Juego ---

    /**
     * Crea un mazo de 12 cartas (3 de cada tipo) y lo baraja.
     */
    function createAndShuffleDeck() {
        playerDeck = [];
        const actions = includeChangeCards ? cardActions : cardActions.filter(a => a !== "Cambio");
        for (let i = 0; i < 3; i++) {
            playerDeck.push(...actions);
        }

        // Algoritmo de barajado (Fisher-Yates)
        for (let i = playerDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playerDeck[i], playerDeck[j]] = [playerDeck[j], playerDeck[i]];
        }
    }

    /**
     * Muestra la siguiente carta del mazo.
     */
    function showNextCard() {
        if (playerDeck.length === 0) {
            // No quedan cartas, el jugador ha ganado
            activeCardElement.classList.add('hidden');
            actionButtons.classList.add('hidden');
            winMessageElement.classList.remove('hidden');
            cardCountElement.textContent = 'Cartas restantes: 0';
            return;
        }

        // Oculta el botón de cambios al comenzar la partida
        if (currentCard === null) {
            changeToggleButton.classList.add('hidden');
        }

        // Saca la primera carta del mazo
        currentCard = playerDeck.shift();

        // Muestra la carta y los botones

        cardIconElement.textContent = cardIcons[currentCard] || '';
        activeCardElement.className = 'card';

        cardActionText.textContent = currentCard;

        activeCardElement.classList.add(cardClass(currentCard));
        deckElement.classList.add('hidden');
        activeCardElement.classList.remove('hidden');
        actionButtons.classList.remove('hidden');

        updateCardCount();
    }

    /**
     * Maneja la acción "Completada": la carta se descarta.
     */
    function handleComplete() {
        const check = document.createElement('span');
        check.textContent = '✅';
        check.className = 'check-emoji';
        activeCardElement.appendChild(check);

        function onEnd() {
            activeCardElement.removeEventListener('animationend', onEnd);
            activeCardElement.classList.remove('animate-complete');
            showNextCard();
        }

        activeCardElement.addEventListener('animationend', onEnd);
        activeCardElement.classList.add('animate-complete');
        setTimeout(() => {
            activeCardElement.removeChild(check);
        }, 500);
    }

    /**
     * Maneja la acción "Pasar": la carta actual va al final del mazo.
     */
    function handlePass() {
        if (currentCard) {
            playerDeck.push(currentCard);
        }
        function onEnd() {
            activeCardElement.removeEventListener('animationend', onEnd);
            activeCardElement.classList.remove('animate-pass');
            showNextCard();
        }

        activeCardElement.addEventListener('animationend', onEnd);
        activeCardElement.classList.add('animate-pass');
    }
    
    /**
     * Inicia o reinicia el juego.
     */
    function startGame() {
        createAndShuffleDeck();
        currentCard = null;

        const playerColor = randomColor();
        deckElement.style.backgroundColor = playerColor;
        deckElement.style.borderColor = playerColor;
        winMessageElement.classList.add('hidden');
        activeCardElement.classList.add('hidden');
        actionButtons.classList.add('hidden');
        deckElement.classList.remove('hidden');
        changeToggleButton.classList.remove('hidden');
        changeToggleButton.disabled = false;
        changeToggleButton.textContent = includeChangeCards ? 'Cambios SÍ 🔄' : 'Cambios NO 🔄';
        changeToggleButton.style.backgroundColor = includeChangeCards ? '#28a745' : '#dc3545';
        changeToggleButton.style.color = '#fff';
        updateCardCount();
    }


    // --- Asignación de Eventos ---
    deckElement.addEventListener('click', showNextCard);
    completeButton.addEventListener('click', handleComplete);
    passButton.addEventListener('click', handlePass);
    restartButton.addEventListener('click', startGame);
    changeToggleButton.addEventListener('click', () => {
        includeChangeCards = !includeChangeCards;
        changeToggleButton.textContent = includeChangeCards ? 'Cambios SÍ 🔄' : 'Cambios NO 🔄';
        changeToggleButton.style.backgroundColor = includeChangeCards ? '#28a745' : '#dc3545';
        changeToggleButton.style.color = '#fff';
        createAndShuffleDeck();
        updateCardCount();
    });

    // --- Iniciar el juego por primera vez ---
    startGame();

});
