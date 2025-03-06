//프론트 날씨 api 테스트용




async function getWeather(city) {
    const response = await fetch(`http://localhost:3000/weather/${city}`);
    const data = await response.json();
    
    // 응답 데이터 로그 확인
    console.log(data);
    
    if (data.error) {
        alert("날씨 정보를 가져오는 데 실패했습니다.");
        return;
    }

    // 날씨 정보 페이지 업데이트
    document.getElementById("weather").innerHTML = `
        <h3>${data.city}의 현재 날씨</h3>
        <p>온도: ${data.weather.temperature_2m}°C</p>
    `;
}

// 여행지 버튼 클릭 시 날씨 정보 가져오기
document.querySelectorAll(".city-button").forEach(button => {
    button.addEventListener("click", () => {
        getWeather(button.dataset.city);
    });
});
