
// routes/posts.js
const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 모든 소개글 조회
router.get('/', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 특정 소개글 조회
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(result);
  });
});

// 새로운 소개글 추가
router.post('/', (req, res) => {
  const {users_id, places_id, birth_at, content} = req.body;
  db.query('INSERT INTO posts (users_id, places_id, birth_at, content) VALUES (?, ?, ?, ?)', [users_id, places_id, birth_at, content], (err, result) => {
    if (err) {
      console.log(err);  // 오류를 콘솔에 출력
      return res.status(500).send('서버 오류');
    }
    res.status(201).send('소개글이 추가되었습니다.');
  });
});

// 소개글 수정
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.query('UPDATE posts SET content = ? WHERE id = ?', [content, id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.send('소개글이 수정되었습니다.');
  });
});

// 소개글 삭제
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.send('소개글이 삭제되었습니다.');
  });
});

module.exports = router;

