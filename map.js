let map; // 지도 객체를 전역에서 관리

function initializeMap(latitude, longitude) {
    // 기존 지도 제거
    if (map) {
        map.remove();
    }

    // 새로운 지도 생성
    map = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([latitude, longitude]).addTo(map);
}

document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('button');

    button.addEventListener('click', function() {
        const placeId = document.getElementById('placeId').value;
        
        axios.get(`http://localhost:3000/places/${placeId}`)
            .then(response => {
                const data = response.data;

                // 날씨 정보를 화면에 표시
                document.getElementById('weather').innerHTML = `
                    <h2>Weather in ${data.city}</h2>
                    <p>Temperature: ${data.weather.temperature_2m}°C</p>
                    <p>Latitude: ${data.latitude}, Longitude: ${data.longitude}</p>
                `;
                
                // 지도 초기화 및 위치 표시
                initializeMap(data.latitude, data.longitude);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
});
