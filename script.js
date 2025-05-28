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