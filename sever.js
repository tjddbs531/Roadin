const express = require('express');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const postLikesRoutes = require('./routes/postLikes');
const postTagsRoutes = require('./routes/postTags');
const usersRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // JSON 요청 본문 파싱

// API 라우팅
app.use('/posts', postsRoutes);
app.use('/posts/:post_id/like', postLikesRoutes);
app.use('/posts/:post_id/tags', postTagsRoutes);
app.use('/users', usersRoutes);  // users 라우터 추가
app.use('/places', placesRoutes);  // places 라우터 추가

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});