const express = require('express');
const { param,validationResult } = require('express-validator');
const axios = require('axios');
const db = require('../db');

const router = express.Router();

// GEONAME API 변수수
const username = process.env.GEONAME_USERNAME;
const maxRows = 10;
const restype = "json"

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    } else {
        return res.status(400).json({ errors: errors.array() })
    }
};

router.get('/place/:name',  
    [
        param('name').notEmpty().isString().withMessage('도시 이름을 입력하세요.'),
        validate
    ],
    (req, res) => {
    const placesname = req.params.name;

    // Geonames API를 사용하여 도시 검색
    axios.get(`http://api.geonames.org/searchJSON?`, {
        params: {
            q: placesname,
            username: username,
            maxRows : maxRows,
            restype : restype
        }
    })
    .then(response => {
        const placeData = response.data.geonames[0];
        console.log(placeData);
        if (!placeData) {
            res.status(404).send({ message: '도시를 찾을 수 없습니다.' });
            return;
        }

        // 해당 도시의 장소 조회
        const cityId = placeData.geonameId;
        const query = `SELECT p.place_name FROM places p WHERE p.geo_id = ?`;

        db.execute(query, [cityId], (err, rows) => {
            if (err) {
                console.error('장소 검색 실패:', err);
                res.status(500).send({ message: '장소 검색 실패' });
                return;
            }

            res.status(200).send({ message: '장소 목록', data: rows });
        });
    })
    .catch(error => {
        console.error('Geonames API 호출 실패:', error);
        res.status(500).send({ message: 'Geonames API 호출 실패' });
    });
});

router.get('/tag/:tag_name',
    [
        param('tag_name').notEmpty().isString().withMessage('태그 이름을 입력하세요.'),
        validate
    ],
    (req, res) => {
    const tag_name = req.params.tag_name;

    let sql = `SELECT p.* FROM places p 
                JOIN place_tags pt ON p.geo_id = pt.place_id 
                JOIN tags t ON pt.tag_id = t.id 
                WHERE t.tag_name = ?;`

    db.execute(sql, [tag_name], (err, rows) => {
        console.log(rows)
        if (err) {
            console.error('장소 검색 실패:', err);
            res.status(500).send({ message: '장소 검색 실패' });
            return;
        }
        if(rows.length == 0){
            console.error('장소 없음');
            res.status(404).send({ message: '장소 없음음' });
            return;
        }
        res.status(200).send({ message: '장소 목록', data: rows });
    });
});


module.exports = router;