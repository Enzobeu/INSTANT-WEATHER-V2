let map;
let currentMarker;

// Initialiser la carte
function initMap() {
    map = L.map('map').setView([46.603354, 1.888334], 6); // Centre de la France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Mettre à jour la carte avec une nouvelle position
function updateMap(lat, lon, communeName) {
    if (map) {
        map.setView([lat, lon], 12);

        // Supprimer l'ancien marqueur s'il existe
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Ajouter un nouveau marqueur
        currentMarker = L.marker([lat, lon]).addTo(map);
        currentMarker.bindPopup(`<b>${communeName}</b><br>Lat: ${lat.toFixed(4)}<br>Lon: ${lon.toFixed(4)}`).openPopup();
    }
}

// Fonction pour obtenir l'icône météo et le statut
function getWeatherIcon(data) {
    const rain = data.probarain;
    const sunHours = data.sun_hours;

    if (rain > 70) {
        return { icon: '🌧️', status: 'PLUVIEUX' };
    } else if (rain > 40) {
        return { icon: '⛅', status: 'NUAGEUX' };
    } else if (sunHours > 6) {
        return { icon: '☀️', status: 'ENSOLEILLÉ' };
    } else {
        return { icon: '☁️', status: 'COUVERT' };
    }
}

// Gestion du formulaire
document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const postalCode = document.getElementById('postal-code').value;
    const days = parseInt(document.getElementById('days-slider').value, 10);

    fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('Aucune commune trouvée pour ce code postal.');
                return;
            }
            displayCommunes(data, days);
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la recherche des communes.');
        });
});

function displayCommunes(communes, days) {
    const communeSelection = document.getElementById('commune-selection');
    communeSelection.innerHTML = '<h3>Sélectionnez une commune :</h3>';

    communes.forEach(commune => {
        const button = document.createElement('button');
        button.textContent = `${commune.nom} (${commune.codeDepartement})`;
        button.addEventListener('click', () => getWeatherData(commune, days));
        communeSelection.appendChild(button);
    });
}

function getWeatherData(commune, days) {
    // Initialiser la carte si ce n'est pas déjà fait
    if (!map) {
        initMap();
    }

    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=b74e672bf62232c203ec7c099904a9be6774f20dc2a10dedd7640b5961342570&insee=${commune.code}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data.forecast.slice(0, days), commune.nom);

            // Mettre à jour la carte avec les coordonnées de la commune
            if (data.forecast.length > 0) {
                const forecast = data.forecast[0];
                updateMap(forecast.latitude, forecast.longitude, commune.nom);
            }

            // Masquer la sélection des communes
            document.getElementById('commune-selection').style.display = 'none';
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la récupération des données météo.');
        });
}

function displayWeather(forecasts, communeName) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = `<h2>📊 Prévisions pour ${communeName}</h2>`;

    forecasts.forEach((data, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const dateStr = date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const weatherInfo = getWeatherIcon(data);

        // Déterminer la classe de dégradé en fonction de la météo
        let gradientClass = '';
        if (weatherInfo.status === 'ENSOLEILLÉ') {
            gradientClass = 'sunny-gradient';
        } else if (weatherInfo.status === 'NUAGEUX') {
            gradientClass = 'cloudy-gradient';
        } else if (weatherInfo.status === 'PLUVIEUX') {
            gradientClass = 'rainy-gradient';
        }

        // Créer la carte météo
        const weatherCard = document.createElement('div');
        weatherCard.className = `weather-card ${gradientClass}`;

        let optionalInfoHTML = '';
        let hasOptionalInfo = false;

        if (document.getElementById('latitude').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Latitude :</span><span>${data.latitude}</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('longitude').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Longitude :</span><span>${data.longitude}</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('rainfall').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Cumul pluie :</span><span>${data.rr10} mm</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('wind-speed').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Vent moyen (10m) :</span><span>${data.wind10m || 'N/A'} km/h</span></div>`;
            hasOptionalInfo = true;
        }
        if (document.getElementById('wind-direction').checked) {
            optionalInfoHTML += `<div class="weather-info-item"><span>Direction du vent :</span><span>${data.dirwind10m || 'N/A'}°</span></div>`;
            hasOptionalInfo = true;
        }

        weatherCard.innerHTML = `
            <div class="weather-card-header">
                ${communeName.toUpperCase()} - ${dateStr}
            </div>
            <div class="weather-card-content">
                <div class="weather-icon-section">
                    <div class="weather-icon">${weatherInfo.icon}</div>
                    <div class="weather-status">${weatherInfo.status}</div>
                </div>
                <div class="weather-details">
                    <div class="temp-section">
                        <div class="temp-min">T min : ${data.tmin}°C</div>
                        <div class="temp-max">T max : ${data.tmax}°C</div>
                    </div>
                    <div class="weather-info-grid">
                        <div class="weather-info-item">
                            <span>Ensoleillement :</span>
                            <span>${data.sun_hours} h</span>
                        </div>
                        <div class="weather-info-item">
                            <span>Probabilité de pluie :</span>
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

    // Ajouter un bouton pour faire une nouvelle recherche
    const newSearchBtn = document.createElement('button');
    newSearchBtn.textContent = '🔄 Nouvelle recherche';
    newSearchBtn.className = 'new-search-btn';
    newSearchBtn.addEventListener('click', () => {
        document.getElementById('commune-selection').style.display = 'block';
        weatherContainer.innerHTML = '';
    });
    weatherContainer.appendChild(newSearchBtn);
}
