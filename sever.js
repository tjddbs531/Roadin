const express = require('express');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const postLikesRoutes = require('./routes/postLikes');
const postTagsRoutes = require('./routes/postTags');
const usersRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');
const commentsRoutes = require('./routes/comments');

const axios = require('axios');
const cors = require('cors');



const app = express();
const port = 3000;

app.use(bodyParser.json()); // JSON 요청 본문 파싱
app.use(cors());

// API 라우팅
app.use('/posts', postsRoutes);
app.use('/posts/:post_id/like', postLikesRoutes);
app.use('/posts/:post_id/tags', postTagsRoutes);
app.use('/users', usersRoutes);  // users 라우터 추가
app.use('/places', placesRoutes);  // places 라우터 추가
app.use('/comments', commentsRoutes);

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});






// 여행지 데이터 (위도, 경도 포함)
const locations = {
    "서울": { lat: 37.5665, lon: 126.9780 },
    "부산": { lat: 35.1796, lon: 129.0756 },
    "제주": { lat: 33.4996, lon: 126.5312 },
    "New York": { lat: 40.7128, lon: -74.0060 },
    "Tokyo": { lat: 35.6762, lon: 139.6503 },
    "London": { lat: 51.5074, lon: -0.1278 }
};

app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    const location = locations[city];

    if (!location) {
        return res.status(404).json({ error: "해당 도시 정보를 찾을 수 없습니다." });
    }

    // 시간대 지정 없이 날씨 정보 요청
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weathercode`;

    try {
        const response = await axios.get(url);
        res.json({ city, weather: response.data.current });
    } catch (error) {
        res.status(500).json({ error: "날씨 정보를 가져오는 데 실패했습니다." });
    }
});

