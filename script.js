document.addEventListener('DOMContentLoaded', () => {

    // --- Definición de elementos del DOM ---
    const deckElement = document.getElementById('deck');
    const activeCardElement = document.getElementById('active-card');
    const cardActionText = document.getElementById('card-action');
    const actionButtons = document.getElementById('action-buttons');
    const passButton = document.getElementById('pass-btn');
    const completeButton = document.getElementById('complete-btn');
    const winMessageElement = document.getElementById('win-message');
    const restartButton = document.getElementById('restart-btn');
    const remainingCountElement = document.getElementById('remaining-count');

    // --- Definición de las cartas ---
    const cardActions = [
        "Choca esos 5", 
        "Puños de pez", 
        "Salmón feliz", 
        "Cambios"
    ];

    let playerDeck = [];
    let currentCard = null;

    // --- Funciones del Juego ---

    /**
     * Actualiza el texto del contador de cartas restantes.
     */
    function updateRemainingCount() {
        remainingCountElement.textContent = `Cartas restantes: ${playerDeck.length}`;
    }

    /**
     * Crea un mazo de 12 cartas (3 de cada tipo) y lo baraja.
     */
    function createAndShuffleDeck() {
        playerDeck = [];
        for (let i = 0; i < 3; i++) {
            playerDeck.push(...cardActions);
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
            updateRemainingCount();
            return;
        }

        // Saca la primera carta del mazo
        currentCard = playerDeck.shift();
        updateRemainingCount();
        
        // Muestra la carta y los botones
        cardActionText.textContent = currentCard;
        deckElement.classList.add('hidden');
        activeCardElement.classList.remove('hidden');
        actionButtons.classList.remove('hidden');
    }

    /**
     * Maneja la acción "Completada": la carta se descarta.
     */
    function handleComplete() {
        // La carta simplemente se descarta (no vuelve al mazo)
        showNextCard();
    }

    /**
     * Maneja la acción "Pasar": la carta actual va al final del mazo.
     */
    function handlePass() {
        if (currentCard) {
            playerDeck.push(currentCard);
        }
        showNextCard();
    }
    
    /**
     * Inicia o reinicia el juego.
     */
    function startGame() {
        createAndShuffleDeck();
        currentCard = null;
        winMessageElement.classList.add('hidden');
        activeCardElement.classList.add('hidden');
        actionButtons.classList.add('hidden');
        deckElement.classList.remove('hidden');
        updateRemainingCount();
    }


    // --- Asignación de Eventos ---
    deckElement.addEventListener('click', showNextCard);
    completeButton.addEventListener('click', handleComplete);
    passButton.addEventListener('click', handlePass);
    restartButton.addEventListener('click', startGame);

    // --- Iniciar el juego por primera vez ---
    startGame();

});
