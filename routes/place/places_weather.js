const express = require('express');
const axios = require('axios');
const db = require('../../db');
const router = express.Router();

// 특정 장소 조회 (도시명으로 위도/경도 찾기)
router.get('/:place_name', async (req, res) => {
  const { place_name } = req.params;
  
  // DB에서 도시명 가져오기
  db.query('SELECT * FROM places WHERE place_name = ?', [place_name], async (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    try {
      if (result === 0) {
        return res.status(404).send('해당 도시의 위치 정보를 찾을 수 없습니다.');
      }

      const {place_lat, place_lon} = result[0];

      // 날씨 정보 요청 (예시: Open-Meteo)
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${place_lat}&longitude=${place_lon}&current=temperature_2m,weathercode`);

      // 날씨와 위치 정보 반환
      res.json({
        city: place_name,
        place_lat,
        place_lon,
        weather: weatherResponse.data.current
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('위치 정보나 날씨 정보를 가져오는 데 실패했습니다.');
    }
  });
});

module.exports = router;
