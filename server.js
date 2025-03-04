const express = require('express');
const searchRouter = require('./routes/search');
const db = require('./db')

require('dotenv').config();

const app = express();
app.use(express.json());

// 라우터 등록
app.use('/search', searchRouter);

app.listen(process.env.PORT);
