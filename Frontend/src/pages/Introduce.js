import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Introduce.css";

const Introduce = () => {
  const { place_name } = useParams();
  const [place, setPlace] = useState(null);
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        console.log(`📌 현재 요청하는 도시 이름: ${place_name}`);

        const response = await axios.get(`http://localhost:3000/places_weather/${place_name}`);
        console.log("✅ 날씨 정보:", response.data);

        setPlace(response.data);
      } catch (err) {
        console.error("❌ 도시 정보 가져오기 실패:", err);
        setError("도시 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPlaceData();
  }, [place_name]);

  if (error) return <p className="error">{error}</p>;
  if (!place) return <p className="loading">로딩 중...</p>;

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="introduce-container">
          <h1>{place.city}</h1>
          <img src={place.image_url || `${process.env.PUBLIC_URL}/img/default.png`} alt={place.city} className="place-image" />
          
          <div className="weather-info">
            <h3>현재 날씨</h3>
            <p>🌡 온도: {place.weather.temperature}°C</p>
            <p>💨 바람 속도: {place.weather.windspeed} m/s</p>
            <p>☁️ 구름량: {place.weather.cloudcover} %</p>
            <p>💧 습도: {place.weather.humidity} %</p>
          </div>

          <button className="like-button" onClick={() => setLikes(likes + 1)}>
            ❤️ 좋아요 {likes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
