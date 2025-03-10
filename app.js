const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const favoritetagsRouter = require("./routes/favoritetags");
// 라우터 통합
app.use(cookieParser());
app.use(express.json());
app.use("/", userRouter);
app.use("/mypage/", favoritetagsRouter);
