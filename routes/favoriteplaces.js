const express = require("express");
const router = express.Router();
const conn = require("../config/mariadb");
const authMiddleware = require("../middlewares/authMiddleware");

// 좋아요 누른 여행지 조회
router.get("/", authMiddleware, (req, res) => {
  const userEmail = req.user.email;

  conn.query(
    "SELECT id FROM users WHERE user_email = ?",
    [userEmail],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "서버 오류", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      const userId = results[0].id;

      const sql = `
        SELECT places.*
        FROM places_likes
        JOIN places ON places_likes.place_id = places.id
        WHERE places_likes.user_id = ?;
      `;

      conn.query(sql, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "서버 오류", error: err });
        }
        res.status(200).json(results);
      });
    }
  );
});

module.exports = router;
