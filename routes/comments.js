
// routes/comments.js
const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 모든 댓글 조회
router.get('/', (req, res) => {
  db.query('SELECT * FROM comments', (err, results) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 특정 댓글 조회
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM comments WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.json(result);
  });
});

// 새로운 댓글 추가
router.post('/', (req, res) => {
  const {users_id, places_id, birth_at, content} = req.body;
  db.query('INSERT INTO comments (users_id, places_id, birth_at, content) VALUES (?, ?, ?, ?)', [users_id, places_id, birth_at, content], (err, result) => {
    if (err) {
      console.log(err);  // 오류를 콘솔에 출력
      return res.status(500).send('서버 오류');
    }
    res.status(201).send('댓글이 추가되었습니다.'); 
  });
});

// 댓글 수정
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.query('UPDATE comments SET content = ? WHERE id = ?', [content, id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.send('댓글이 수정되었습니다.');
  });
});

// 댓글 삭제
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM comments WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.send('댓글이 삭제되었습니다.');
  });
});

// 댓글 좋아요 추가
router.post('/', (req, res) => {
    const { users_id } = req.body;
    const { comments_id } = req.params;
  
    // 중복 방지를 위한 체크
    db.query('SELECT * FROM comments_like WHERE comments_id = ? AND users_id = ?', [comments_id, users_id], (err, results) => {
      if (err) {
        return res.status(500).send('서버 오류');
      }
      if (results.length > 0) {
        return res.status(400).send('이미 좋아요를 누른 상태입니다.');
      }
  
      db.query('INSERT INTO comments_like (comments_id, users_id) VALUES (?, ?)', [comments_id, users_id], (err, result) => {
        if (err) {
          return res.status(500).send('서버 오류');
        }
        res.status(201).send('좋아요가 추가되었습니다.');
      });
    });
  });
  
  // 댓글 좋아요 취소
  router.delete('/', (req, res) => {
    const { users_id } = req.body;
    const { comments_id } = req.params;
  
    db.query('DELETE FROM comments_like WHERE comments_id = ? AND users_id = ?', [comments_id, users_id], (err, result) => {
      if (err) {
        return res.status(500).send('서버 오류');
      }
      res.send('좋아요가 취소되었습니다.');
    });
  });
  
// 댓글 태그 추가
router.post('/:id/tags', (req, res) => {  
  const { id } = req.params;  // comments_id 가져오기  
  const { tags_id } = req.body;

  db.query('INSERT INTO comments_tags (comments_id, tags_id) VALUES (?, ?)', [id, tags_id], (err, result) => {  
    if (err) {  
      return res.status(500).send('서버 오류');  
    }  
    res.status(201).send('태그가 추가되었습니다.');  
  });  
});

// 댓글 태그 삭제
router.delete('/:id/tags/:tag_id', (req, res) => {  
  const { id, tag_id } = req.params;  //  comments_id와 tag_id 가져오기  

  db.query('DELETE FROM comments_tags WHERE comments_id = ? AND tags_id = ?', [id, tag_id], (err, result) => {  
    if (err) {  
      return res.status(500).send('서버 오류');  
    }  
    res.send('태그가 삭제되었습니다.');  
  });  
});





module.exports = router;

