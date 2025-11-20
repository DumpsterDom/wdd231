// Footer 
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastMod').textContent = document.lastModified;

// Timestamp 
const timestampField = document.getElementById('timestamp');
if (timestampField) {
  timestampField.value = new Date().toISOString();
}

// Card animation 
const cards = document.querySelectorAll('.level-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => observer.observe(card));

setTimeout(() => {
  cards.forEach(card => {
    if (card.getBoundingClientRect().top < window.innerHeight) {
      card.classList.add('visible');
    }
  });
}, 100);

// Modal function
document.querySelectorAll('.level-card button').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.closest('.level-card').dataset.modal;
    document.getElementById(modalId).style.display = 'flex';
  });
});

document.querySelectorAll('.modal .close').forEach(close => {
  close.addEventListener('click', () => {
    close.closest('.modal').style.display = 'none';
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Submit data 
const params = new URLSearchParams(location.search);
const dl = document.getElementById('submitted-data');

const fields = {
  firstname:    "First Name",
  lastname:     "Last Name", 
  email:        "Email",
  phone:        "Phone",
  businessname: "Business/Organization",
  timestamp:    "Submitted On"
};

let hasData = false;

for (const [key, label] of Object.entries(fields)) {
  const value = params.get(key);
  if (value) {
    hasData = true;
    
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    
    dt.textContent = label + ":";
    dd.textContent = (key === 'timestamp') 
      ? new Date(value).toLocaleString() 
      : value;
    
    dl.appendChild(dt);
    dl.appendChild(dd);
  }
}
