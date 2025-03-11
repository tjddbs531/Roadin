const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
    let sql = `SELECT p.*, count(pl.place_id) FROM places p 
                JOIN places_likes pl ON  p.geo_id = pl.place_id
                GROUP BY pl.place_id
                HAVING COUNT(pl.place_id) > 1;`

    db.execute(sql,(err, rows) => {
        console.log(rows)
        if (err) {
            console.error('장소 검색 실패:', err);
            res.status(500).send({ message: '장소 검색 실패' });
            return;
        }
        res.status(200).send({ message: '장소 목록', data: rows });
    });
});

module.exports = router;
