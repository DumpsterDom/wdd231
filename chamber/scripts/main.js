let allMembers = [];

// ———————— 1. Mobile Menu Toggle ————————
document.getElementById('menuToggle').addEventListener('click', () => {
  document.querySelector('#mainNav ul').classList.toggle('show');
});

// ———————— 2. Grid / List View Toggle ————————
document.getElementById('viewToggle').addEventListener('click', () => {
  const container = document.getElementById('membersContainer');
  const btn = document.getElementById('viewToggle');
  container.classList.toggle('grid');
  container.classList.toggle('list');
  btn.textContent = container.classList.contains('list') ? 'Grid View' : 'List View';
});

// ———————— 3. Load Members from JSON ————————
async function loadMembers() {
  try {
    const res = await fetch('data/members.json');
    allMembers = await res.json();
    displayMembers(allMembers);
  } catch (err) {
    console.error('Failed to load members:', err);
    document.getElementById('membersContainer').innerHTML = '<p>Could not load directory. Please try again later.</p>';
  }
}

// ———————— 4. Render Members ————————
function displayMembers(members) {
  const container = document.getElementById('membersContainer');
  if (members.length === 0) {
    container.innerHTML = '<p>No businesses match your search.</p>';
    return;
  }

  container.innerHTML = members.map(member => `
    <article class="card" data-level="${member.level}" data-tags="${member.tags.join(' ')}">
      <img src="images/${member.image}" alt="${member.name}" loading="lazy">
      <div class="info">
        <h3>${member.name}</h3>
        <p class="address">${member.address}</p>
        <p class="phone">${member.phone}</p>
        <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
        <div class="tags">
          ${member.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <span class="level ${member.level === 3 ? 'gold' : member.level === 2 ? 'silver' : 'bronze'}">
          ${member.level === 3 ? 'Gold' : member.level === 2 ? 'Silver' : 'Bronze/NP'}
        </span>
      </div>
    </article>
  `).join('');
}

// ———————— 5. Search Box ————————
document.getElementById('searchBox').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allMembers.filter(m =>
    m.name.toLowerCase().includes(term) ||
    m.address.toLowerCase().includes(term) ||
    m.tags.some(t => t.toLowerCase().includes(term))
  );
  displayMembers(filtered);
});

// ———————— 6. Category Filter ————————
document.getElementById('categoryFilter').addEventListener('change', (e) => {
  const selected = e.target.value;
  if (!selected) {
    displayMembers(allMembers);
  } else {
    const filtered = allMembers.filter(m => m.tags.includes(selected));
    displayMembers(filtered);
  }
});

// ———————— 7. Membership Level Filter ————————
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const level = btn.dataset.level;
    const filtered = level === 'all'
      ? allMembers
      : allMembers.filter(m => m.level == level);
    displayMembers(filtered);
  });
});

// ———————— 8. Footer Dates ————————
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastMod').textContent = document.lastModified;

// ———————— 9. INIT ————————
loadMembers();