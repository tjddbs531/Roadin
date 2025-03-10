const express = require('express');
const axios = require('axios');
const db = require('../models/db');
const router = express.Router();

// 특정 장소 조회 (도시명으로 위도/경도 찾기)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  // DB에서 도시명 가져오기
  db.query('SELECT * FROM places WHERE id = ?', [id], async (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }

    const cityName = result[0].name;

    try {
      // Nominatim API를 사용해 도시명으로 위도, 경도 찾기
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json`);
      
      if (geoResponse.data.length === 0) {
        return res.status(404).send('해당 도시의 위치 정보를 찾을 수 없습니다.');
      }

      // 위도와 경도 추출
      const latitude = geoResponse.data[0].lat;
      const longitude = geoResponse.data[0].lon;

      // 날씨 정보 요청 (예시: Open-Meteo)
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`);

      // 날씨와 위치 정보 반환
      res.json({
        city: cityName,
        latitude,
        longitude,
        weather: weatherResponse.data.current
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('위치 정보나 날씨 정보를 가져오는 데 실패했습니다.');
    }
  });
});

module.exports = router;
