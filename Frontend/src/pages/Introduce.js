import React, { useState, useEffect } from "react";
import "./Introduce.css";

const Introduce = () => {
  // 더미 데이터
  const place = {
    name: "파리 에펠탑",
    image: `${process.env.PUBLIC_URL}/img/img1.png`,
    description: "파리는 로맨틱한 도시로 유명하며 에펠탑이 대표적인 명소입니다.",
    location: "프랑스, 파리",
    currency: "1,350",
    local_currency: "EUR",
    weather: {
      temperature: "15",
      description: "맑음 ☀️",
    },
    hashtags: ["파리", "에펠탑", "여행", "유럽"],
    reviews: [
      { user: "김철수", comment: "정말 멋진 곳이었어요!", rating: 5 },
      { user: "이영희", comment: "야경이 특히 아름다웠습니다.", rating: 4.5 },
    ],
  };

  const [likes, setLikes] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  // 기존 저장된 해시태그 불러오기
  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem("savedTags")) || [];
    setSelectedTags(savedTags);
  }, []);

  // 좋아요 버튼 클릭 시 증가
  const handleLike = () => setLikes(likes + 1);

  // 해시태그 클릭 시 저장 + 스타일 변경
  const handleTagClick = (tag) => {
    let savedTags = JSON.parse(localStorage.getItem("savedTags")) || [];

    if (!savedTags.includes(tag)) {
      savedTags.push(tag);
      localStorage.setItem("savedTags", JSON.stringify(savedTags));
      setSelectedTags(savedTags);
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="introduce-container">
          <h1>{place.name}</h1>
          <img src={place.image} alt={place.name} className="place-image" />
          <p>{place.description}</p>

          <div className="currency-info">
            <h3>환율 정보</h3>
            <p>1 USD = {place.currency} {place.local_currency}</p>
          </div>

          <div className="weather-info">
            <h3>현재 날씨</h3>
            <p>온도: {place.weather.temperature}°C</p>
            <p>날씨: {place.weather.description}</p>
          </div>

          <div className="map-container">
            <h3>위치</h3>
            <p>{place.location}</p>
            <div className="map-box">📍 지도 들어갈 자리</div>
          </div>

          <button className="like-button" onClick={handleLike}>
            ❤️ 좋아요 {likes}
          </button>

          {/* 해시태그 리스트 */}
          <div className="hashtags">
            {place.hashtags.map((tag, index) => (
              <span
                key={index}
                className={`hashtag ${selectedTags.includes(tag) ? "selected" : ""}`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="review-section">
            <h3>여행 후기</h3>
            <ul>
              {place.reviews.map((review, index) => (
                <li key={index}>
                  <strong>{review.user}:</strong> {review.comment} ⭐ {review.rating}/5
                </li>
              ))}
            </ul>

            <div className="review-form">
              <input type="text" placeholder="후기를 입력하세요..." />
              <button>등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
