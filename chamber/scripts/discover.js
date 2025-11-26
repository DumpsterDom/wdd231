
import places from '../data/places.mjs';

const grid = document.getElementById('discoverGrid');
const visitMessage = document.getElementById('visit-message');

// Cards
places.forEach(place => {
  const card = document.createElement('article');
  card.className = 'discover-card';
  card.style.gridArea = place.area;  // now works!

  card.innerHTML = `
    <figure>
      <img src="${place.image}" alt="${place.name}" width="300" height="200" loading="lazy">
    </figure>
    <div class="card-content">
      <h2>${place.name}</h2>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button>Learn More</button>
    </div>
  `;
  grid.appendChild(card);
});

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

localStorage.setItem('lastVisit', now);

// Footer
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastMod').textContent = document.lastModified;