// Load recipes from JSON file
async function loadRecipes() {
  try {
    const response = await fetch('data/recipes.json');
    const recipes = await response.json();
    renderRecipes(recipes);
  } catch (error) {
    console.error('Error loading recipes:', error);
    document.getElementById('allRecipes').innerHTML = '<p>Could not load recipes. Please try again later.</p>';
  }
}

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

function renderRecipes(recipes) {
  const pantry = JSON.parse(localStorage.getItem('pantry') || '[]').map(i => i.toLowerCase());
  const recommendations = document.getElementById('recommendations');
  const container = document.getElementById('allRecipes');
  let matches = 0;

  // Clear previous content
  recommendations.innerHTML = '';
  container.innerHTML = '';

  // Create matches section
  const matchHeading = document.createElement('h2');
  matchHeading.textContent = 'You Can Make These Right Now!';
  matchHeading.style.cssText = 'text-align:center; color:var(--green); margin:2rem 0; font-size:2.2rem;';
  const matchGrid = document.createElement('div');
  matchGrid.className = 'spotlight-grid';

  recipes.forEach(recipe => {
    const missing = recipe.ingredients.filter(ing => !pantry.includes(ing.toLowerCase()));
    const hasAll = missing.length === 0;

    if (hasAll) matches++;

    const card = document.createElement('div');
    card.className = `spotlight card ${hasAll ? 'match' : ''}`;
    card.innerHTML = `
      <img src="${recipe.img}" alt="${recipe.name}" loading="lazy">
      <div class="recipe-info">
        <h3>${recipe.name}</h3>
        <p class="meta">Time: ${recipe.time} • Serves ${recipe.serves}</p>
        ${hasAll 
          ? '<p class="ready">Ready to cook!</p>' 
          : `<p class="missing">Missing: ${missing.join(', ') || 'None'}</p>`
        }
        <button class="cta-button view-recipe-btn">View Recipe</button>
      </div>
    `;

    if (hasAll) {
      matchGrid.appendChild(card);
    } else {
      container.appendChild(card);
    }
  });

  // Update match count
  document.getElementById('matchCount').textContent = matches;

  // Show matches section if any
  if (matches > 0) {
    recommendations.appendChild(matchHeading);
    recommendations.appendChild(matchGrid);
  } else {
    recommendations.innerHTML = '<p style="text-align:center; padding:4rem; font-size:1.2rem;">No perfect matches yet — add more ingredients to your pantry!</p>';
  }

  // Show "All Recipes" heading only if there are non-matches
  if (container.children.length > 0) {
    const allHeading = document.createElement('h2');
    allHeading.textContent = 'All Recipes';
    allHeading.style.cssText = 'text-align:center; margin:4rem 0 2rem; color:var(--darkgreen); font-size:2rem;';
    container.before(allHeading);
  }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', loadRecipes);