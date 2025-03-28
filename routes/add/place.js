const express = require('express');
const { validationResult, body } = require('express-validator');
const axios = require('axios');
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

// GEONAME API 변수
const username = process.env.GEONAME_USERNAME;
const maxRows = 10;
const restype = "json"

router.post('/add',  
    [
        body('place_name').notEmpty().isString().withMessage('도시 이름을 입력하세요.'),
        body('place_info').notEmpty().isString().withMessage('도시 설명을 입력하세요.'),
        body('korea').notEmpty().isBoolean().withMessage('국내인지 해외인지 입력하세요.(true = 1, false = 0)'),
        validate
    ],
    (req, res) => {
    const {place_name, place_info, korea} = req.body;

    // Geonames API를 사용하여 도시 검색
    axios.get(`http://api.geonames.org/searchJSON?`, {
        params: {
            q: place_name,
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


        db.query('SELECT * FROM places WHERE geo_id = ?', [placeData.geonameId], (err, results) => {
            if (err) {
              return res.status(500).send('서버 오류');
            }
            if (results.length > 0) {
              return res.status(400).send('이미 있는 도시입니다.');
            }
        })

        // 해당 도시의 장소 조회
        const place_geo_id = parseInt(placeData.geonameId)
        const place_lat = parseFloat(placeData.lat)
        const place_lon = parseFloat(placeData.lng)

        const place_values = [place_geo_id, place_name, place_info, place_lat, place_lon, korea]
        const query = `INSERT INTO places (geo_id, place_name, place_info, place_lat,place_lon, korea) VALUES (?,?,?,?,?,?)`;
        console.log(place_values)
        db.execute(query, place_values, (err, rows) => {
            if (err) {
                console.error('장소 추가 실패:', err);
                res.status(500).send({ message: '장소 추가 실패' });
                return;
            }

            res.status(200).send({ 
                message: '추가된 장소', 
                geo_id : place_geo_id,
                place_name : place_name,
                place_info : place_info,
                korea : korea
            });
        });
    })
    .catch(error => {
        console.error('Geonames API 호출 실패:', error);
        res.status(500).send({ message: 'Geonames API 호출 실패' });
    });
});

module.exports = router;