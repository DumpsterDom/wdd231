// Footer
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastMod").textContent = document.lastModified;

// DOM 
const town = document.querySelector('#town');
const description = document.querySelector('#description');
const temperature = document.querySelector('#temperature');
const graphic = document.querySelector('#graphic');
const forecastDisplay = document.querySelector('#forecastDisplay');
const spotlightContainer = document.querySelector('#spotlightContainer');

// API
const API_KEY = 'ca7124503a5e91444a72dd6d4a638fd3';
const LAT = 35.26214;
const LON = -81.18359;
const UNITS = 'imperial';

const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}`;

// Current weather
async function loadCurrentWeather() {
  try {
    const res = await fetch(currentURL);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    document.getElementById("currentWeather").innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" width="80">
      <p class="temp">${temp}°F</p>
      <p class="condition">${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
      <p class="details">High: ${Math.round(data.main.temp_max)}° Low: ${Math.round(data.main.temp_min)}°</p>
      <p class="details">Humidity: ${humidity}%</p>
      <p class="details">Sunrise: ${sunrise} | Sunset: ${sunset}</p>
    `;
  } catch (err) {
    document.getElementById("currentWeather").innerHTML = "<p>Weather unavailable</p>";
  }
}
// Forecast
async function loadForecast() {
  try {
    const res = await fetch(forecastURL);
    const data = await res.json();

    const daily = data.list
      .filter(item => item.dt_txt.includes("12:00:00"))
      .slice(0, 3);

    forecastDisplay.innerHTML = daily.map(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' });
      const temp = Math.round(day.main.temp);
      const icon = day.weather[0].icon;
      return `
        <div class="forecast-day">
          <strong>${date}</strong><br>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon"><br>
          ${temp}&deg;F
        </div>
      `;
    }).join('');
  } catch (err) {
    forecastDisplay.innerHTML = "<p>Forecast unavailable</p>";
  }
}

// Spotlights
async function loadSpotlights() {
  try {
    console.log('Fetching index.json...'); 
    const res = await fetch('data/index.json'); 
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const members = await res.json();
    console.log('Loaded members:', members); 

    const eligible = members.filter(m => m.membership === 'gold' || m.membership === 'silver');
    console.log('Eligible (gold/silver):', eligible); 
    const selected = eligible.sort(() => 0.5 - Math.random()).slice(0, 3);
    console.log('Randomly selected:', selected);  
    spotlightContainer.innerHTML = selected.map(m => `
      <div class="spotlight">
        <picture class="spotlight-hero">
          <img src="${m.highlightImg}" alt="${m.name} showcase" loading="lazy">
        </picture>
        <img src="${m.logo}" alt="${m.name} logo" class="spotlight-logo" loading="lazy">
        <h3>${m.name}</h3>
        <p>${m.tagline || 'Business Tag Line'}</p>
        <p><strong>${m.membership.toUpperCase()} Member</strong></p>
        <p>${m.address}</p>
        <p>${m.phone}</p>
        <a href="${m.website}" target="_blank">Visit Website</a>
      </div>
    `).join('');
    console.log('Spotlights rendered!'); 
  } catch (err) {
    console.error("Spotlights Error:", err); 
    spotlightContainer.innerHTML = `<p>Error loading spotlights: ${err.message}</p>`;
  }
}

// Run
loadCurrentWeather();
loadForecast();
loadSpotlights();