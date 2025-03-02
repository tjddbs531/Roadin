const express = require("express");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT);

// user-demo.js 호출
const userRouter = require("./users");

// 라우터 통합
app.use("/", userRouter);
