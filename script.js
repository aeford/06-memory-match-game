// List of emojis to use in the game (6 pairs for 12 cards)
const emojis = ['🐶', '🐱', '🦊', '🐸', '🐵', '🦄'];

// Variables to keep track of game state
let deck = [];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let canFlip = true;

// Get DOM elements
const gameBoard = document.querySelector('#game-board');
const movesSpan = document.querySelector('#moves');
const winMessage = document.querySelector('#win-message');
const restartBtn = document.querySelector('#restart-btn');

// Function to shuffle the deck using Fisher-Yates algorithm
function shuffleDeck(array) {
  // Make a copy of the array
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index
    let j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    let temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

// Function to create the deck (each emoji appears twice)
function createDeck() {
  // Duplicate emojis to make pairs
  let doubleEmojis = emojis.concat(emojis);
  // Shuffle the deck
  deck = shuffleDeck(doubleEmojis);
}

// Function to set up the game board
function setupBoard() {
  // Clear the board
  gameBoard.innerHTML = '';
  // Loop through the deck and create card elements
  for (let i = 0; i < deck.length; i++) {
    // Create card container
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-index', i);
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Memory card');
    // Create inner card for flipping
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    // Create front and back faces
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    // Do not show the emoji until the card is flipped
    cardFront.textContent = '';
    cardFront.setAttribute('aria-hidden', 'true');
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    // Remove the question mark, leave blank
    cardBack.textContent = '';
    cardBack.setAttribute('aria-hidden', 'true');
    // Add faces to inner card
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    // Add inner card to card container
    card.appendChild(cardInner);
    // Add click event to flip the card
    card.addEventListener('click', function () {
      flipCard(card);
    });
    // Add keyboard support
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        flipCard(card);
      }
    });
    // Add card to the game board
    gameBoard.appendChild(card);
  }
}

// Function to flip a card
function flipCard(card) {
  // Only allow flipping if less than 2 cards are flipped and not already matched
  if (!canFlip || card.classList.contains('flipped') || flippedCards.includes(card)) {
    return;
  }
  // Show the emoji when the card is flipped
  const index = card.getAttribute('data-index');
  const cardFront = card.querySelector('.card-front');
  cardFront.textContent = deck[index];

  card.classList.add('flipped');
  flippedCards.push(card);

  // If two cards are flipped, check for a match
  if (flippedCards.length === 2) {
    canFlip = false;
    moves += 1;
    movesSpan.textContent = moves;
    checkForMatch();
  }
}

// Function to check if two flipped cards match
function checkForMatch() {
  // Get the indexes of the flipped cards
  const index1 = flippedCards[0].getAttribute('data-index');
  const index2 = flippedCards[1].getAttribute('data-index');
  // Compare the emojis
  if (deck[index1] === deck[index2]) {
    // It's a match!
    matchedCards += 2;
    // Add 'matched' class to both cards to highlight them green
    flippedCards[0].classList.add('matched');
    flippedCards[1].classList.add('matched');
    flippedCards = [];
    canFlip = true;
    // Check if all pairs are matched
    if (matchedCards === deck.length) {
      showWinMessage();
    }
  } else {
    // Not a match, flip back after a short delay
    setTimeout(function () {
      // Hide the emoji again when flipping back
      flippedCards[0].classList.remove('flipped');
      flippedCards[0].querySelector('.card-front').textContent = '';
      flippedCards[1].classList.remove('flipped');
      flippedCards[1].querySelector('.card-front').textContent = '';
      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}

// Function to show the win message
function showWinMessage() {
  winMessage.style.display = 'block';
}

// Function to hide the win message
function hideWinMessage() {
  winMessage.style.display = 'none';
}

// Function to restart the game
function restartGame() {
  // Reset variables
  moves = 0;
  matchedCards = 0;
  flippedCards = [];
  canFlip = true;
  movesSpan.textContent = moves;
  hideWinMessage();
  // Create new deck and setup board
  createDeck();
  setupBoard();
}

// Add event listener to restart button
restartBtn.addEventListener('click', function () {
  restartGame();
});

// Start the game when the page loads
restartGame();
