// scripts/discover.js
import attractions from 'data/discover.json';

const grid = document.getElementById('discoverGrid');
const visitMessage = document.getElementById('visit-message');

// Render Cards
attractions.forEach(attr => {
  const card = document.createElement('article');
  card.className = 'discover-card';
  card.style.gridArea = attr.area;

  card.innerHTML = `
    <figure>
      <img src="${attr.image}" alt="${attr.name}" width="300" height="200" loading="lazy">
    </figure>
    <div class="card-content">
      <h2>${attr.name}</h2>
      <address>${attr.address}</address>
      <p>${attr.description}</p>
      <button>Learn More</button>
    </div>
  `;
  grid.appendChild(card);
});

// Visit Counter Logic
const lastVisit = localStorage.getItem('lastVisit');
const now = Date.now();

if (!lastVisit) {
  visitMessage.textContent = "Welcome! Let us know if you have any questions.";
} else {
  const daysBetween = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
  if (daysBetween < 1) {
    visitMessage.textContent = "Back so soon! Awesome!";
  } else if (daysBetween === 1) {
    visitMessage.textContent = "You last visited 1 day ago.";
  } else {
    visitMessage.textContent = `You last visited ${daysBetween} days ago.`;
  }
}

// Always update last visit time
localStorage.setItem('lastVisit', now);

// Footer
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastMod').textContent = document.lastModified;