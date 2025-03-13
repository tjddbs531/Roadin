const express = require('express');
const { validationResult, body } = require('express-validator');

const db = require('../../db');
const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    } else {
        return res.status(400).json({ errors: errors.array() })
    }
};

router.post('/add', 
    [
        body('tag_name').notEmpty().isString().withMessage('태그 이름을 입력하세요.'),
        validate
    ],
    (req, res) => {
    const { tag_name } = req.body;
  
    db.query('SELECT * FROM tags WHERE tag_name = ?', [tag_name], (err, results) => {
        if (err) {
          return res.status(500).send('서버 오류');
        }
        if (results.length > 0) {
          return res.status(400).send('이미 있는 태그입니다.');
        }
    })

    db.query('INSERT INTO tags (tag_name) VALUES (?)', [tag_name], (err, result) => {
        if (err) {
            console.error('태그 추가 실패:', err);
            res.status(500).send({ message: '태그 추가 실패' });
            return;
        }

        res.status(200).send({ 
            message: '추가된 태그', 
            tag_name : tag_name
        });
    })
});

module.exports = router