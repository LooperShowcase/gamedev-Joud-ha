const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
document.getElementById("score").textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    console.log(cards);
  });

function shuffleCards() {
  let randomIndex;
  let currentIndex = cards.length;
  let temp;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
      <img class="front-image" src="${card.image}" />
    </div>
    <div class="back"></div>
    `;
    cardsContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
    cardElement.addEventListener("touchstart", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;

  checkForMatch();

  document.getElementById("score").textContent = score;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCard();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("touchstart", flipCard);
  score++;
  if (score === 9) startConfetti();
  unlockBoard();
}

function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function unflipCard() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 1000);
}

function restart() {
  shuffleCards();
  unlockBoard();
  score = 0;
  document.getElementById("score").textContent = score;
  cardsContainer.innerHTML = "";
  generateCards();
  stopConfetti();
}
