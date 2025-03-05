// routes/users.js
const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 모든 사용자 조회
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 특정 사용자 조회
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(result);
  });
});


// 새로운 사용자 추가
router.post('/', (req, res) => {
  const { name, email } = req.body;  // 예시 필드
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
      
    }
    res.status(201).send('사용자가 추가되었습니다.');
  });
});



module.exports = router;
