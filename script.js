const form = document.getElementById("cardForm");
const gallery = document.getElementById("gallery");
const topGallery = document.getElementById("topGallery");
const error = document.getElementById("error");
let cards = [];

// Surse aprobate pentru imagini
const approvedSources = ["chatgpt.com/images/", "deepseek.ai/"];

// Încarcă date inițiale
fetch("cards.json")
  .then(res => res.json())
  .then(data => {
    cards = data;
    updateGalleries();
  });

// Validare URL imagine
function validateImage(url) {
  return approvedSources.some(src => url.includes(src));
}

// Adaugă card nou
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("imagine").value.trim();
  if(!validateImage(url)) {
    error.textContent = "URL invalid. Folosește doar imagini generate de ChatGPT sau DeepSeek.";
    return;
  }

  const card = {
    id: Date.now(),
    imagine: url,
    likes: 0,
    dislikes: 0
  };
  cards.push(card);
  form.reset();
  error.textContent = "";
  updateGalleries();
});

// Funcție Like / Dislike
function likeCard(id) {
  const card = cards.find(c => c.id === id);
  if(card) { card.likes++; updateGalleries(); }
}

function dislikeCard(id) {
  const card = cards.find(c => c.id === id);
  if(card) { card.dislikes++; updateGalleries(); }
}

// Afișare galerii
function updateGalleries() {
  const sorted = [...cards].sort((a,b) => b.likes - a.likes);

  // Top 5
  topGallery.innerHTML = "";
  sorted.slice(0,5).forEach(card => {
    topGallery.appendChild(createCardElement(card));
  });

  // Galerie completă
  gallery.innerHTML = "";
  sorted.forEach(card => {
    gallery.appendChild(createCardElement(card));
  });
}

// Creează element card
function createCardElement(card) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardDiv.innerHTML = `
    <img src="${card.imagine}" alt="Pokémon Card">
    <div>
      <button onclick="likeCard(${card.id})">👍 ${card.likes}</button>
      <button onclick="dislikeCard(${card.id})">👎 ${card.dislikes}</button>
    </div>
  `;
  return cardDiv;
}
