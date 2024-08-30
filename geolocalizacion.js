// Verificar si el navegador soporta la geolocalización
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert('La geolocalización no está soportada por este navegador.');
}

function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    // Usando el servicio Nominatim de OpenStreetMap para obtener el país
    let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let pais = data.address.country;
            document.getElementById('pais').textContent = pais;
        })
        .catch(err => {
            console.error('Error al obtener el país:', err);
            document.getElementById('pais').textContent = 'No se pudo determinar el país';
        });
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    document.getElementById('pais').textContent = 'No se pudo determinar el país';
}
