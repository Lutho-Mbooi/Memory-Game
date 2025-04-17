document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let movesCount = 0;
    let isProcessing = false;

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const movesCounter = document.getElementById('moves-count');
    const pairsCounter = document.getElementById('pairs-count');
    const winMessage = document.getElementById('win-message');
    const finalMoves = document.getElementById('final-moves');
    const restartBtn = document.getElementById('restart-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    //card letters (A-H, two of each)
    function generateCards() {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const cardContents = [...letters, ...letters]; 
        
        // Sort cards in random
        return cardContents.sort(() => Math.random() - 0.5);
    }

    // Create the game board
    function createGameBoard() {
        gameBoard.innerHTML = '';
        cards = generateCards();
        
        cards.forEach((letter, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-index', index);
            
            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');
            cardContent.textContent = letter;
            
            card.appendChild(cardContent);
            gameBoard.appendChild(card);
            
            card.addEventListener('click', () => flip_Card(card, index));
        });
    }

    // Flip a card
    function flip_Card(card, index) {
        // do not flip if processing, already flipped, or matched
        if (isProcessing || 
            flippedCards.length >= 2 || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched')) {
            return;
        }
        
        // Flipping the card
        card.classList.add('flipped');
        flippedCards.push({ card, index });
        
        // Checking for matches when two cards are flipped
        if (flippedCards.length === 2) {
            movesCount++;    
            movesCounter.textContent = movesCount;
            
            const [firstCard, secondCard] = flippedCards;
            
            if (cards[firstCard.index] === cards[secondCard.index]) {
                // When a Match is found the cards will remain facing up
                matchedPairs++;
                pairsCounter.textContent = `${matchedPairs} / 8`;
                
                firstCard.card.classList.add('matched');
                secondCard.card.classList.add('matched');
                
                flippedCards = [];
                
                // Checking if all pairs are matched and displaying the win message
                if (matchedPairs === 8) {
                    setTimeout(() => {
                        finalMoves.textContent = movesCount;
                        winMessage.style.display = 'flex';
                    }, 500);
                }
            } else {
                // No match is found close the card after 1 second and continue flipping
                isProcessing = true;
                
                setTimeout(() => {
                    firstCard.card.classList.remove('flipped');
                    secondCard.card.classList.remove('flipped');
                    flippedCards = [];
                    isProcessing = false;
                }, 1000);
            }
        }
    }

    // Reset the game back to the initial state
    function Initialize() {
        flippedCards = [];
        matchedPairs = 0;
        movesCount = 0;
        isProcessing = false;
        
        movesCounter.textContent = movesCount;
        pairsCounter.textContent = `${matchedPairs} / 8`;
        winMessage.style.display = 'none';
        
        createGameBoard();
    }

    // Event listeners for buttons
    restartBtn.addEventListener('click', Initialize);
    playAgainBtn.addEventListener('click', Initialize);

    // Initialize the game at the beginning and at the end of the match
    Initialize();
});
