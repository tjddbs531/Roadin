
// routes/postLikes.js
const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 특정 소개글에 좋아요 추가
router.post('/', (req, res) => {
  const { users_id } = req.body;
  const { post_id } = req.params;

  // 중복 방지를 위한 체크
  db.query('SELECT * FROM Post_likes WHERE post_id = ? AND users_id = ?', [post_id, users_id], (err, results) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    if (results.length > 0) {
      return res.status(400).send('이미 좋아요를 누른 상태입니다.');
    }

    db.query('INSERT INTO Post_likes (post_id, users_id) VALUES (?, ?)', [post_id, users_id], (err, result) => {
      if (err) {
        return res.status(500).send('서버 오류');
      }
      res.status(201).send('좋아요가 추가되었습니다.');
    });
  });
});

// 특정 소개글에서 좋아요 취소
router.delete('/', (req, res) => {
  const { users_id } = req.body;
  const { post_id } = req.params;

  db.query('DELETE FROM Post_likes WHERE post_id = ? AND users_id = ?', [post_id, users_id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.send('좋아요가 취소되었습니다.');
  });
});

module.exports = router;

