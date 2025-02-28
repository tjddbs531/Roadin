// routes/places.js
const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 모든 장소 조회
router.get('/', (req, res) => {
  db.query('SELECT * FROM places', (err, results) => {
    if (err) {
        console.log(err);  // 오류를 콘솔에 출력
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 특정 장소 조회
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM places WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(result);
  });
});

// 새로운 장소 추가
router.post('/', (req, res) => {
  const { name, location } = req.body;  // 예시 필드
  db.query('INSERT INTO places (name, location) VALUES (?, ?)', [name, location], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.status(201).send('장소가 추가되었습니다.');
  });
});

module.exports = router;
