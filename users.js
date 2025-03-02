const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const conn = require("./mariadb");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

router.use(cookieParser());
router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

const validationRules = {
  email: body("user_email")
    .notEmpty()
    .isEmail()
    .withMessage("이메일 형식을 맞춰주세요."),
  password: body("user_pwd")
    .notEmpty()
    .isString()
    .withMessage("비밀번호를 문자열로 입력해주세요."),
  name: body("user_name")
    .notEmpty()
    .isString()
    .withMessage("이름을 문자로 입력해주세요."),
  phone: body("user_phone")
    .notEmpty()
    .isString()
    .withMessage("연락처를 다시 확인해주세요."),
};
// 회원가입
router.post(
  "/join",
  [
    validationRules.email,
    validationRules.name,
    validationRules.password,
    validationRules.phone,
    validate,
  ],
  (req, res) => {
    const { user_email, user_name, user_pwd, user_phone } = req.body;
    const saltRounds = 10; //보안 강도 설정

    let checkDuplicate = `SELECT user_email FROM Users WHERE user_email = ?`;
    conn.query(checkDuplicate, user_email, (err, results) => {
      if (err)
        return res.status(500).json({ message: "서버 오류", error: err });

      if (results.length) {
        return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
      }

      bcrypt.hash(user_pwd, saltRounds, (err, hashedPwd) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        let sql = `INSERT INTO Users (user_email, user_name, user_pwd,user_phone) VALUES (?,?,?,?)`;
        let values = [user_email, user_name, hashedPwd, user_phone];

        conn.query(sql, values, function (err, results) {
          if (err) {
            console.log(err);
            return res.status(400).end();
          }
          res.status(201).json({ message: "회원가입 성공!" });
        });
      });
    });
  }
);

// 로그인
router.post(
  "/login",
  [validationRules.email, validationRules.password, validate],
  (req, res) => {
    const { user_email, user_pwd } = req.body;
    const token = req.cookies.token;
    // 토큰이 있으면 검증 후 자동 로그인 처리
    if (token) {
      jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
          console.error("토큰 검증 오류:", err);
          res.clearCookie("token"); //만료된 토큰 삭제
          return res
            .status(401)
            .json({ message: "세션이 만료되었습니다. 다시 로그인해주세요." });
        }
        return res.status(200).json({
          message: `${decoded.name}님 환영합니다. 메인 페이지로 이동합니다.`,
          token: token,
        });
      });
      return;
    }

    // 토큰이 없으면 비밀번호 확인 후 로그인 처리
    let sql = "SELECT * FROM Users WHERE user_email = ?";
    conn.query(sql, user_email, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "서버 오류", error: err });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
      }

      const loginUser = results[0];

      bcrypt.compare(user_pwd, loginUser.user_pwd, (err, isMatch) => {
        if (err) {
          console.error("비밀번호 검증 오류:", err);
          return res.status(500).json({ message: "서버 오류", error: err });
        }

        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
        }

        // 로그인 성공 시 토큰 발행
        const newToken = jwt.sign(
          {
            email: loginUser.user_email,
            name: loginUser.user_name,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "30m", // 30분
          }
        );

        res.cookie("token", newToken, { httpOnly: true });

        res.status(200).json({
          message: `${loginUser.user_name}님 환영합니다. 메인 페이지로 이동합니다.`,
          token: newToken,
        });
      });
    });
  }
);

// 회원 개별 조회
router.get("/user/info", (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  // 토큰 검증
  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      console.error("토큰 검증 오류:", err);
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const user_email = decoded.email;

    let sql =
      "SELECT user_email, user_name, user_phone FROM Users WHERE user_email = ?";
    conn.query(sql, user_email, function (err, results) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "서버 오류", error: err });
      }

      if (results.length) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: "존재하지 않는 회원입니다." });
      }
    });
  });
});

// 회원 개별 수정
router.put("/user/info", (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      console.error("토큰 검증 오류:", err);
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const user_email = decoded.email;
    const { user_name, user_phone } = req.body;

    let updates = [];
    let values = [];

    if (user_name) {
      updates.push("user_name = ?");
      values.push(user_name);
    }
    if (user_phone) {
      updates.push("user_phone = ?");
      values.push(user_phone);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "변경할 정보를 입력하세요." });
    }

    values.push(user_email);

    let sql = `UPDATE Users SET ${updates.join(", ")} WHERE user_email = ?`;
    conn.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "서버 오류", error: err });
      }
      res
        .status(200)
        .json({ message: "회원 정보가 성공적으로 수정되었습니다." });
    });
  });
});

// 회원 개별 삭제
router.delete("/user/info", [validationRules.email, validate], (req, res) => {
  let { user_email } = req.body;

  let sql = "DELETE FROM Users WHERE user_email = ?";
  conn.query(sql, user_email, function (err, results) {
    if (err) {
      console.log(err);
      return res.status(400).end();
    }
    if (results.affectedRows == 0) {
      return res
        .status(404)
        .json({ message: "해당 이메일을 가진 사용자가 존재하지 않습니다." });
    } else {
      res.clearCookie("token");
      res.status(200).json(results);
    }
  });
});

module.exports = router;
