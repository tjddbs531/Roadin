const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.listen(process.env.PORT);

// user-demo.js 호출
const userRouter = require("./routes/users");
// const conn = require("./config/mariadb");

// 라우터 통합
app.use(cookieParser());
app.use(express.json());
app.use("/", userRouter);
