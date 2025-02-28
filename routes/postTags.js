
// routes/postTags.js
const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 특정 소개글의 태그 조회
router.get('/', (req, res) => {
  const { post_id } = req.params;
  db.query('SELECT t.tags_name FROM Post_tags pt JOIN Tags t ON pt.tags_id = t.tags_id WHERE pt.post_id = ?', [post_id], (err, results) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 특정 소개글에 태그 추가
router.post('/', (req, res) => {
  const { post_id } = req.params;
  const { tags_id } = req.body;

  db.query('INSERT INTO Post_tags (post_id, tags_id) VALUES (?, ?)', [post_id, tags_id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.status(201).send('태그가 추가되었습니다.');
  });
});

// 특정 소개글에서 태그 삭제
router.delete('/:tag_id', (req, res) => {
  const { post_id } = req.params;
  const { tag_id } = req.params;

  db.query('DELETE FROM Post_tags WHERE post_id = ? AND tags_id = ?', [post_id, tag_id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.send('태그가 삭제되었습니다.');
  });
});

module.exports = router;

