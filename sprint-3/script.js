const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const CACHE_EXPIRATION_MS = 10 * 60 * 1000;

const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locateBtn');
const weatherDataContainer = document.getElementById('weatherData');
const loadingState = document.getElementById('loadingState');
const errorMessage = document.getElementById('errorMessage');
const statusDot = document.getElementById('statusDot');
const tiles = document.getElementById('tiles');
const tileDetail = document.getElementById('tileDetail');

let currentPayload = null;

const ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"></circle><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"></path></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 19a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.6 8.4 4 4 0 0 1 17.5 19h-11Z"></path></svg>',
  cloudSun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7.5" r="2.6"></circle><path d="M8 2.6v1.5M3.4 7.5h1.5M12.6 7.5h-1M4.6 4.1l1 1M11 11l1-1"></path><path d="M9 19a4.3 4.3 0 0 1-.4-8.58A5.2 5.2 0 0 1 18.6 9.4 3.8 3.8 0 0 1 19.5 19H9Z"></path></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 14.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.6 3.9 4 4 0 0 1 17.5 14.5h-11Z"></path><path d="M8 17.5 7 20M12 17.5l-1 2.5M16 17.5l-1 2.5"></path></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 13.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.6 2.9 4 4 0 0 1 17.5 13.5h-11Z"></path><path d="M8 17v4M6 18.5l4 1M10 18.5l-4 1M16 17v4M14 18.5l4 1M18 18.5l-4 1"></path></svg>',
  storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 13.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.6 2.9 4 4 0 0 1 17.5 13.5h-11Z"></path><path d="m13 15-3 5h3l-2 4"></path></svg>',
  fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 8h13M4 12h16M4 16h11"></path></svg>',
  unknown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.5 1-1.5 2.2M12 17h.01"></path></svg>'
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  initiateSearch(cityInput.value);
});

locateBtn.addEventListener('click', () => handleGeolocation(true));

tiles.addEventListener('click', (e) => {
  const tile = e.target.closest('.tile');
  if (!tile) return;
  showTileDetail(tile);
});

window.addEventListener('load', () => handleGeolocation(false));

async function initiateSearch(query) {
  const city = query.trim().toLowerCase();
  if (!city) return;

  hideError();

  const cachedData = checkCache(city);
  if (cachedData) {
    renderWeatherDOM(cachedData);
    return;
  }

  setBusy(true);

  try {
    const geoResponse = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!geoResponse.ok) throw new Error('Network response was not ok');
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError(`City "${query.trim()}" wasn't found. Check the spelling and try again.`);
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];
    const finalPayload = await fetchWeather(latitude, longitude, name);

    saveToCache(city, finalPayload);
    renderWeatherDOM(finalPayload);
  } catch (error) {
    console.error('Fetch error: ', error);
    showError("Couldn't reach the weather service. Try again in a moment.");
  } finally {
    setBusy(false);
  }
}

async function fetchWeather(latitude, longitude, cityName) {
  const [weatherResponse, airResponse] = await Promise.all([
    fetch(`${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&timezone=auto`),
    fetch(`${AIR_QUALITY_API_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi`).catch(() => null)
  ]);

  if (!weatherResponse.ok) throw new Error('Weather API failed');
  const weatherJson = await weatherResponse.json();

  let usAqi = null;
  if (airResponse && airResponse.ok) {
    const airJson = await airResponse.json();
    usAqi = airJson.current ? airJson.current.us_aqi : null;
  }

  return {
    cityName,
    temperature: Math.round(weatherJson.current.temperature_2m),
    feelsLike: Math.round(weatherJson.current.apparent_temperature),
    humidity: weatherJson.current.relative_humidity_2m,
    windSpeed: Math.round(weatherJson.current.wind_speed_10m),
    weatherCode: weatherJson.current.weather_code,
    usAqi,
    timestamp: Date.now()
  };
}

function renderWeatherDOM(data) {
  document.getElementById('cityName').textContent = data.cityName;
  document.getElementById('temperature').textContent = `${data.temperature}°`;
  document.getElementById('humidity').textContent = `${data.humidity}%`;
  document.getElementById('updatedAt').textContent = formatTime(data.timestamp);
  document.getElementById('feelsLikeValue').textContent = `${data.feelsLike}°`;
  document.getElementById('windValue').textContent = `${data.windSpeed} km/h`;

  const air = describeAirQuality(data.usAqi);
  document.getElementById('airValue').textContent = air.label;

  const { condition, theme, icon } = decodeWeatherCode(data.weatherCode);

  document.getElementById('condition').textContent = condition;
  document.getElementById('weatherIcon').innerHTML = ICONS[icon] || ICONS.unknown;

  document.body.className = theme;

  currentPayload = data;
  tileDetail.classList.add('hidden');
  tiles.querySelectorAll('.tile').forEach((t) => t.classList.remove('active'));

  hideError();
  loadingState.classList.add('hidden');
  weatherDataContainer.classList.remove('hidden');
}

function showTileDetail(tile) {
  if (!currentPayload) return;
  const wasActive = tile.classList.contains('active');
  tiles.querySelectorAll('.tile').forEach((t) => t.classList.remove('active'));

  if (wasActive) {
    tileDetail.classList.add('hidden');
    return;
  }

  tile.classList.add('active');
  tileDetail.textContent = getTileMessage(tile.dataset.metric, currentPayload);
  tileDetail.classList.remove('hidden');
}

function getTileMessage(metric, data) {
  if (metric === 'feelsLike') {
    const diff = data.feelsLike - data.temperature;
    if (Math.abs(diff) < 1) return `Feels about the same as the actual temperature of ${data.temperature}°.`;
    return diff > 0
      ? `Feels ${diff}° warmer than the actual ${data.temperature}° — humidity is likely trapping heat.`
      : `Feels ${Math.abs(diff)}° cooler than the actual ${data.temperature}°, probably from wind chill.`;
  }
  if (metric === 'wind') return describeWind(data.windSpeed);
  if (metric === 'humidity') return describeHumidity(data.humidity);
  if (metric === 'air') return describeAirQuality(data.usAqi).detail;
  return '';
}

function describeWind(speed) {
  if (speed == null) return 'Wind data is unavailable right now.';
  if (speed < 6) return `${speed} km/h — calm air, barely a breeze.`;
  if (speed < 20) return `${speed} km/h — a light, comfortable breeze.`;
  if (speed < 39) return `${speed} km/h — a moderate breeze, you'll feel it on your face.`;
  if (speed < 62) return `${speed} km/h — strong wind, loose objects may move.`;
  return `${speed} km/h — gale-force wind, take caution outdoors.`;
}

function describeHumidity(humidity) {
  if (humidity < 30) return `${humidity}% — dry air, skin and throat may feel parched.`;
  if (humidity < 60) return `${humidity}% — comfortable, balanced humidity.`;
  if (humidity < 80) return `${humidity}% — humid, the air may feel sticky.`;
  return `${humidity}% — very humid, expect heavy, muggy conditions.`;
}

function describeAirQuality(aqi) {
  if (aqi == null) return { label: '—', detail: 'Air quality data is unavailable right now.' };
  if (aqi <= 50) return { label: `${aqi} · Good`, detail: `US AQI ${aqi} — air quality is good, ideal for outdoor activity.` };
  if (aqi <= 100) return { label: `${aqi} · Moderate`, detail: `US AQI ${aqi} — acceptable, but sensitive groups should watch for symptoms.` };
  if (aqi <= 150) return { label: `${aqi} · Sensitive`, detail: `US AQI ${aqi} — unhealthy for sensitive groups; limit prolonged outdoor exertion.` };
  if (aqi <= 200) return { label: `${aqi} · Unhealthy`, detail: `US AQI ${aqi} — unhealthy; everyone may begin to feel effects.` };
  if (aqi <= 300) return { label: `${aqi} · Very poor`, detail: `US AQI ${aqi} — very unhealthy; avoid outdoor exertion.` };
  return { label: `${aqi} · Hazardous`, detail: `US AQI ${aqi} — hazardous air; stay indoors if possible.` };
}

function decodeWeatherCode(code) {
  if (code === 0) return { condition: 'Clear sky', theme: 'weather-clear', icon: 'sun' };
  if (code >= 1 && code <= 2) return { condition: 'Partly cloudy', theme: 'weather-clear', icon: 'cloudSun' };
  if (code === 3) return { condition: 'Overcast', theme: 'weather-cloudy', icon: 'cloud' };
  if (code === 45 || code === 48) return { condition: 'Fog', theme: 'weather-fog', icon: 'fog' };
  if (code >= 51 && code <= 67) return { condition: 'Rain', theme: 'weather-rain', icon: 'rain' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', theme: 'weather-snow', icon: 'snow' };
  if (code >= 80 && code <= 82) return { condition: 'Rain showers', theme: 'weather-rain', icon: 'rain' };
  if (code >= 85 && code <= 86) return { condition: 'Snow showers', theme: 'weather-snow', icon: 'snow' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', theme: 'weather-storm', icon: 'storm' };
  return { condition: 'Unknown', theme: 'weather-default', icon: 'unknown' };
}

function handleGeolocation(isManual) {
  if (!('geolocation' in navigator)) {
    if (isManual) showError('Location services are not available in this browser.');
    else initiateSearch('London');
    return;
  }

  if (isManual) {
    locateBtn.classList.add('locating');
    locateBtn.disabled = true;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        setBusy(true);
        const finalPayload = await fetchWeather(latitude, longitude, 'Your location');
        renderWeatherDOM(finalPayload);
      } catch (e) {
        console.error('Geolocation fetch failed', e);
        if (isManual) showError("Couldn't fetch weather for your location.");
      } finally {
        setBusy(false);
        locateBtn.classList.remove('locating');
        locateBtn.disabled = false;
      }
    },
    (error) => {
      console.log('Geolocation denied or failed.', error);
      locateBtn.classList.remove('locating');
      locateBtn.disabled = false;
      if (isManual) showError('Location access was denied.');
      else initiateSearch('London');
    }
  );
}

function checkCache(city) {
  const cacheKey = `weather_${city}`;
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return null;

  const parsedData = JSON.parse(cachedData);
  if (Date.now() - parsedData.timestamp > CACHE_EXPIRATION_MS) {
    localStorage.removeItem(cacheKey);
    return null;
  }
  return parsedData;
}

function saveToCache(city, data) {
  localStorage.setItem(`weather_${city}`, JSON.stringify(data));
}

function setBusy(isBusy) {
  searchBtn.disabled = isBusy;
  cityInput.disabled = isBusy;
  statusDot.style.opacity = isBusy ? '0.35' : '1';
  if (isBusy) {
    weatherDataContainer.classList.add('hidden');
    loadingState.classList.remove('hidden');
  } else {
    loadingState.classList.add('hidden');
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showError(msg) {
  weatherDataContainer.classList.add('hidden');
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}