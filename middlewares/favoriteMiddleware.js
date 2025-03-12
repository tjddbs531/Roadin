const db = require("../db");

const getUserId = (req, res, next) => {
  const user_email = req.user.email;

  let findUserSql = "SELECT id FROM users WHERE user_email = ?";
  db.query(findUserSql, [user_email], (err, userResults) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    req.user_id = userResults[0].id;
    next();
  });
};

const NotExistTags = (req, res, next) => {
  const { tag_names } = req.body;

  let findTagsSql = `SELECT id, tag_name FROM tags WHERE tag_name IN (?)`;
  db.query(findTagsSql, [tag_names], (err, tagResults) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });

    if (tagResults.length === 0) {
      return res
        .status(404)
        .json({ message: "존재하지 않는 태그가 포함되어 있습니다." });
    }

    req.tagResults = tagResults;
    next();
  });
};

module.exports = { getUserId, NotExistTags };
