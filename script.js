let map;
let currentMarker;

// Initialize the map
function initMap() {
    map = L.map('map').setView([46.603354, 1.888334], 6); // Center of France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Update the map with a new position
function updateMap(lat, lon, cityName) {
    if (map) {
        map.setView([lat, lon], 12);

        // Remove the old marker if it exists
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Add a new marker
        currentMarker = L.marker([lat, lon]).addTo(map);
        currentMarker.bindPopup(`<b>${cityName}</b><br>Lat: ${lat.toFixed(4)}<br>Lon: ${lon.toFixed(4)}`).openPopup();
    }
}

// Function to get weather icon and status
function getWeatherIcon(data) {
    const rainProbability = data.probarain;
    const sunHours = data.sun_hours;

    if (rainProbability > 70) {
        return { icon: '🌧️', status: 'PLUVIEUX' };
    } else if (rainProbability > 40) {
        return { icon: '⛅', status: 'NUAGEUX' };
    } else if (sunHours > 6) {
        return { icon: '☀️', status: 'ENSOLEILLÉ' };
    } else {
        return { icon: '☁️', status: 'COUVERT' };
    }
}

// Form handling
document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const postalCode = document.getElementById('postal-code').value;
    const days = parseInt(document.getElementById('days-slider').value, 10);

    fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('No city found for this postal code.');
                return;
            }
            displayCities(data, days);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error while searching for cities.');
        });
});

function displayCities(cities, days) {
    const citySelection = document.getElementById('commune-selection');
    citySelection.innerHTML = '<h3>Sélectionnez une commune:</h3>';

    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = `${city.nom} (${city.codeDepartement})`;
        button.addEventListener('click', () => getWeatherData(city, days));
        citySelection.appendChild(button);
    });
}

function getWeatherData(city, days) {
    // Initialize the map if not already done
    if (!map) {
        initMap();
    }

    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=b74e672bf62232c203ec7c099904a9be6774f20dc2a10dedd7640b5961342570&insee=${city.code}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data.forecast.slice(0, days), city.nom);

            // Update the map with city coordinates
            if (data.forecast.length > 0) {
                const forecast = data.forecast[0];
                updateMap(forecast.latitude, forecast.longitude, city.nom);
            }

            // Hide city selection
            document.getElementById('commune-selection').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error while retrieving weather data.');
        });
}

function displayWeather(forecasts, cityName) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = `<h2>📊 Prévisions pour ${cityName}</h2>`;

    forecasts.forEach((data, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const dateString = date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const weatherInfo = getWeatherIcon(data);

        // Determine gradient class based on weather
        let gradientClass = '';
        if (weatherInfo.status === 'ENSOLEILLÉ') {
            gradientClass = 'sunny-gradient';
        } else if (weatherInfo.status === 'NUAGEUX') {
            gradientClass = 'cloudy-gradient';
        } else if (weatherInfo.status === 'PLUVIEUX') {
            gradientClass = 'rainy-gradient';
        }

        // Create weather card
        const weatherCard = document.createElement('div');
        weatherCard.className = `weather-card ${gradientClass}`;

        let optionalInfoHTML = '';
        let hasOptionalInfo = false;

        if (document.getElementById('latitude').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Latitude:</span><span>${data.latitude}</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('longitude').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Longitude:</span><span>${data.longitude}</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('rainfall').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Cumul pluie:</span><span>${data.rr10} mm</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('wind-speed').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Vent moyen (10m):</span><span>${data.wind10m || 'N/A'} km/h</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('wind-direction').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Direction du vent:</span><span>${data.dirwind10m || 'N/A'}°</span></div>`;
            hasOptionalInfo = true;
        }

        weatherCard.innerHTML = `
            <div class="weather-card-header">
                ${cityName.toUpperCase()} - ${dateString}
            </div>
            <div class="weather-card-content">
                <div class="weather-icon-section">
                    <div class="weather-icon">${weatherInfo.icon}</div>
                    <div class="weather-status">${weatherInfo.status}</div>
                </div>
                <div class="weather-details">
                    <div class="temp-section">
                        <div class="temp-min">T min: ${data.tmin}°C</div>
                        <div class="temp-max">T max: ${data.tmax}°C</div>
                    </div>
                    <div class="weather-info-grid">
                        <div class="weather-info-item">
                            <span>Ensoleillement:</span>
                            <span>${data.sun_hours} h</span>
                        </div>
                        <div class="weather-info-item">
                            <span>Probabilité de pluie:</span>
                            <span>${data.probarain} %</span>
                        </div>
                    </div>
                    ${hasOptionalInfo ? `
                        <div class="optional-info">
                            <div class="weather-info-grid">
                                ${optionalInfoHTML}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        weatherContainer.appendChild(weatherCard);
    });

    // Add button for new search
    const newSearchButton = document.createElement('button');
    newSearchButton.textContent = '🔄 Nouvelle recherche';
    newSearchButton.className = 'new-search-btn';
    newSearchButton.addEventListener('click', () => {
        document.getElementById('commune-selection').style.display = 'block';
        weatherContainer.innerHTML = '';
    });
    weatherContainer.appendChild(newSearchButton);
}

// Dark mode handling
document.getElementById('toggle-dark-mode').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Update days label
function updateDaysLabel(value) {
    const daysLabel = document.getElementById('days-label');
    daysLabel.textContent = value + (value > 1 ? ' days' : ' day');
}

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function () {
    initMap();
});
