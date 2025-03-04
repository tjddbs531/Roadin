const express = require('express');
const { query, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    } else {
        return res.status(400).json({ errors: errors.array() })
    }
};

router.get('/',
    [
        query('q')
            .trim()
            .notEmpty().withMessage('검색어를 입력하세요.')
            .isLength({ min: 2 }).withMessage('검색어는 최소 2자 이상 입력해야 합니다.'),
        validate
    ],
    (req, res) => {
        const queryText = req.query.q;

        try {
            const connection = db;
            const [results] = connection.execute(
                "SELECT name FROM items WHERE name LIKE ? or tags LIKE ? LIMIT 5", 
                [`%${queryText}%`, `%${queryText}%`]
            );
            res.json(results);
        } catch (err) {
            console.error('검색 오류:', err);
            res.status(500).json({ error: '서버 오류' });
        }
    }
);

module.exports = router;