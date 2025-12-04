const input = document.getElementById('ingredientInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('pantryList');
const clearBtn = document.getElementById('clearBtn');

// Hamburger
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('mainNav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('nav-open');
    });
  }
});

function loadPantry() {
  const items = JSON.parse(localStorage.getItem('pantry') || '[]');
  list.innerHTML = '';
  items.forEach(item => addToList(item));
}

function savePantry() {
  const items = Array.from(list.children).map(li => li.dataset.ingredient);
  localStorage.setItem('pantry', JSON.stringify(items));
}

function addToList(ingredient) {
  const li = document.createElement('li');
  li.textContent = ingredient;
  li.dataset.ingredient = ingredient;

  const btn = document.createElement('button');
  btn.textContent = '×';
  btn.onclick = () => {
    li.remove();
    savePantry();
  };

  li.appendChild(btn);
  list.appendChild(li);
}

addBtn.onclick = () => {
  const value = input.value.trim();
  if (value) {
    addToList(value.toLowerCase());
    savePantry();
    input.value = '';
    input.focus();
  }
};

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') addBtn.click();
});

clearBtn.onclick = () => {
  if (confirm('Clear your entire pantry?')) {
    list.innerHTML = '';
    localStorage.removeItem('pantry');
  }
};

// Almost reeady //
async function showAlmostRecipes() {
  try {
    const response = await fetch('data/recipes.json');
    const allRecipes = await response.json();

    const pantry = JSON.parse(localStorage.getItem('pantry') || '[]').map(i => i.toLowerCase());
    const container = document.getElementById('almostRecipes');

    // Find recipes missing 1–2 ingredients
    const almost = allRecipes.filter(r => {
      const missing = r.ingredients.filter(i => !pantry.includes(i.toLowerCase()));
      return missing.length > 0 && missing.length <= 2;
    })
    .sort((a, b) => missingA.length - missingB.length)
    .slice(0, 6);

    if (almost.length === 0) {
      container.innerHTML = '<p style="text-align:center; padding:3rem; font-size:1.2rem; opacity:0.8;">No recipes close yet — keep adding ingredients!</p>';
      return;
    }

    container.innerHTML = almost.map(r => {
      const missing = r.ingredients.filter(i => !pantry.includes(i.toLowerCase()));
      return `
        <div class="almost-recipe">
          <h4>${r.name}</h4>
          <div class="missing-ingredients">
            ${missing.map(i => `<span>${i}</span>`).join(' ') }
          </div>
          <p class="meta">Time: ${r.time} • Serves ${r.serves}</p>
        </div>
      `;
    }).join('');
  } catch(e) {
    console.log('Could not load almost ready recipes');
  }
}

loadPantry();
showAlmostRecipes();