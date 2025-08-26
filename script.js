// Lista cardurilor
let cards = [];

// Elemente HTML
const form = document.getElementById("addCardForm");
const urlInput = document.getElementById("cardUrl");
const gallery = document.getElementById("gallery");
const topGallery = document.getElementById("topGallery");

// Acceptă orice URL
const approvedSources = []; // gol = acceptă toate URL-urile

// Funcție validare URL (oricum acceptăm toate)
function validateImage(url) {
  return true; // acceptă orice URL
}

// Adaugă card nou
form.addEventListener("submit", function(e){
  e.preventDefault();
  const url = urlInput.value.trim();
  if(url === "" || !validateImage(url)) {
    alert("URL invalid.");
    return;
  }
  const card = {
    id: Date.now(),
    imagine: url,
    likes: 0,
    dislikes: 0,
    approved: false // nu este vizibil public până adminul aprobă
  };
  cards.push(card);
  urlInput.value = "";
  updateGalleries();
});

// Crează element card
function createCardElement(card){
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  cardDiv.innerHTML = `
    <img src="${card.imagine}" alt="Pokemon Card">
    <div class="buttons">
      <button onclick="likeCard(${card.id})">Like (${card.likes})</button>
      <button onclick="dislikeCard(${card.id})">Dislike (${card.dislikes})</button>
    </div>
  `;

  // Buton de moderare pentru admin
  if(!card.approved){
    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.onclick = function(){ approveCard(card.id); };
    cardDiv.appendChild(approveBtn);
  }

  return cardDiv;
}

// Like / Dislike
function likeCard(id){
  const card = cards.find(c => c.id === id);
  if(card) { card.likes++; updateGalleries(); }
}

function dislikeCard(id){
  const card = cards.find(c => c.id === id);
  if(card) { card.dislikes++; updateGalleries(); }
}

// Aprobare card (admin)
function approveCard(id){
  const card = cards.find(c => c.id === id);
  if(card){
    card.approved = true;
    updateGalleries();
  }
}

// Actualizare galerii
function updateGalleries(){
  // Top 5
  const approvedCards = cards.filter(c => c.approved);
  const sorted = [...approvedCards].sort((a,b) => b.likes - a.likes);

  topGallery.innerHTML = "";
  sorted.slice(0,5).forEach(card => {
    topGallery.appendChild(createCardElement(card));
  });

  // Galerie completă
  gallery.innerHTML = "";
  approvedCards.forEach(card => {
    gallery.appendChild(createCardElement(card));
  });
}

// Initializare galerie
updateGalleries();

