const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const conn = require("../config/mariadb");
const jwt = require("jsonwebtoken");
const { validate, validationRules } = require("../middlewares/validation");
const authMiddleware = require("../middlewares/authMiddleware");

// 비밀번호 해싱 함수
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// JWT 토큰 생성 함수
const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.user_email,
      name: user.user_name,
    },
    process.env.PRIVATE_KEY,
    { expiresIn: "30m" } // 30분 만료
  );
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

    let checkDuplicate = `SELECT user_email FROM Users WHERE user_email = ?`;
    conn.query(checkDuplicate, user_email, async (err, results) => {
      if (err)
        return res.status(500).json({ message: "서버 오류", error: err });

      if (results.length) {
        return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
      }

      try {
        const hashedPwd = await hashPassword(user_pwd);
        let sql = `INSERT INTO Users (user_email, user_name, user_pwd, user_phone) VALUES (?, ?, ?, ?)`;
        let values = [user_email, user_name, hashedPwd, user_phone];

        conn.query(sql, values, (err) => {
          if (err) {
            console.log(err);
            return res.status(400).end();
          }
          res.status(201).json({ message: "회원가입 성공!" });
        });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "비밀번호 해싱 오류", error: err });
      }
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
          res.clearCookie("token"); // 만료된 토큰 삭제
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
        const newToken = generateToken(loginUser);
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
router.get("/mypage", authMiddleware, (req, res) => {
  const user_email = req.user.email;

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
      console.log(err);
      res.status(404).json({ message: "존재하지 않는 회원입니다." });
    }
  });
});

// 회원 개별 수정
router.put(
  "/mypage",
  authMiddleware,
  [validationRules.phone, validate],
  (req, res) => {
    const user_email = req.user.email;
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
  }
);

// 회원 탈퇴
router.delete("/mypage", authMiddleware, (req, res) => {
  const user_email = req.user.email;

  let sql = "DELETE FROM Users WHERE user_email = ?";
  conn.query(sql, user_email, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "서버 오류", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  });
});

// 비밀번호 찾기
router.post(
  "/resetPwd",
  [
    validationRules.name,
    validationRules.phone,
    validationRules.new_password,
    validate,
  ],
  (req, res) => {
    const { user_name, user_phone, new_pwd } = req.body;

    let sql = "SELECT * FROM Users WHERE user_name = ? AND user_phone = ?";
    conn.query(sql, [user_name, user_phone], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "서버 오류", error: err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "일치하는 사용자 정보가 없습니다." });
      }

      try {
        const hashedPwd = await hashPassword(new_pwd);
        let updateSql = "UPDATE Users SET user_pwd = ? WHERE user_phone = ?";
        conn.query(updateSql, [hashedPwd, user_phone], (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "비밀번호 변경 오류", error: err });
          }
          res
            .status(200)
            .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
        });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "비밀번호 해싱 오류", error: err });
      }
    });
  }
);

module.exports = router;
