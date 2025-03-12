const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const GEONAME_API_URL = process.env.GEONAME_API_URL;
const GEONAME_USERNAME = process.env.GEONAME_USERNAME; 

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

const searchRouter = require('./routes/search');

const cityRouter = require('./routes/place/place');
const placelikesRouter = require("./routes/place/placelikes");
const placesRoutes = require('./routes/place/places');
const popularRouter = require('./routes/place/popular_place');

const favoriteplacesRouter = require("./routes/user/favoriteplaces");
const favoritetagsRouter = require("./routes/user/favoritetags");
const userRouter = require("./routes/user/users");

const commentsRoutes = require('./routes/post/comments');
const postLikesRoutes = require('./routes/post/postLikes');
const postsRoutes = require('./routes/post/posts');
const postTagsRoutes = require('./routes/post/postTags');

app.use('/search', searchRouter);

app.use('/place', cityRouter);
app.use("/placelikes", placelikesRouter);
app.use('/places', placesRoutes);
app.use('/popular_place', popularRouter);

app.use("/mypage/favoriteplaces", favoriteplacesRouter);
app.use("/mypage/favoritetags", favoritetagsRouter);
app.use("/", userRouter);

app.use('/comments', commentsRoutes);
app.use('/posts/:post_id/like', postLikesRoutes);
app.use('/posts', postsRoutes);
app.use('/posts/:post_id/tags', postTagsRoutes);


app.listen(process.env.PORT);