const express = require('express');
const searchRouter = require('./routes/search');
const popularRouter = require('./routes/popular_place');
const cityRouter = require('./routes/place');
const db = require('./db');

require('dotenv').config();

const GEONAME_API_URL = process.env.GEONAME_API_URL;
const GEONAME_USERNAME = process.env.GEONAME_USERNAME; 

const OPEN_TRIP_MAP_API_URL = process.env.OPEN_TRIP_MAP_API_URL;
const OPEN_TRIP_MAP_API_KEY = process.env.OPEN_TRIP_MAP_API_KEY;  


const app = express();
app.use(express.json());

// 라우터 등록
app.use('/search', searchRouter);
app.use('/popular_place', popularRouter);
app.use('/place', cityRouter);

app.listen(process.env.PORT);