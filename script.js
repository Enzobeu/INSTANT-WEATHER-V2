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

