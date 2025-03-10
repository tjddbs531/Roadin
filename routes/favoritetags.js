const express = require("express");
const router = express.Router();
const conn = require("../config/mariadb");
const authMiddleware = require("../middlewares/authMiddleware");

// 전체 태그 조회
router.get("/tags", authMiddleware, (req, res) => {
  const user_email = req.user.email;

  let findUserSql = "SELECT id FROM users WHERE user_email = ?";
  conn.query(findUserSql, [user_email], (err, userResults) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const user_id = userResults[0].id;

    let sql = `
        SELECT 
          t.tag_name, 
          CASE 
            WHEN tl.user_id IS NOT NULL THEN true 
            ELSE false 
          END AS is_selected
        FROM tags t
        LEFT JOIN tags_likes tl ON t.id = tl.tag_id AND tl.user_id = ?
      `;

    conn.query(sql, [user_id], (err, results) => {
      if (err)
        return res.status(500).json({ message: "서버 오류", error: err });

      res.status(200).json({
        tags: results.map((row) => ({
          tag_name: row.tag_name,
          is_selected: row.is_selected,
        })),
      });
    });
  });
});

// 선호 태그 등록
router.post("/favoritetags", authMiddleware, (req, res) => {
  const { tag_names } = req.body;
  const user_email = req.user.email;

  if (!Array.isArray(tag_names) || tag_names.length === 0) {
    return res.status(400).json({ message: "태그 목록이 올바르지 않습니다." });
  }

  let findUserSql = "SELECT id FROM users WHERE user_email = ?";
  conn.query(findUserSql, [user_email], (err, userResults) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const user_id = userResults[0].id;
    let findTagsSql = `SELECT id, tag_name FROM tags WHERE tag_name IN (?)`;

    conn.query(findTagsSql, [tag_names], (err, tagResults) => {
      if (err)
        return res.status(500).json({ message: "서버 오류", error: err });

      if (tagResults.length === 0) {
        return res
          .status(404)
          .json({ message: "존재하지 않는 태그가 포함되어 있습니다." });
      }

      const tagIds = tagResults.map((tag) => tag.id);
      const tagNameMap = new Map(
        tagResults.map((tag) => [tag.id, tag.tag_name])
      );

      let checkExistingSql = `SELECT tag_id FROM tags_likes WHERE user_id = ? AND tag_id IN (?)`;
      conn.query(
        checkExistingSql,
        [user_id, tagIds],
        (err, existingResults) => {
          if (err)
            return res.status(500).json({ message: "서버 오류", error: err });

          const existingTagIds = new Set(
            existingResults.map((row) => row.tag_id)
          );
          const newTagIds = tagIds.filter((id) => !existingTagIds.has(id));

          if (newTagIds.length === 0) {
            return res.status(409).json({
              message: "중복된 태그 선택입니다.",
              duplicated_tags: tag_names,
            });
          }

          const newTagNames = newTagIds.map((id) => tagNameMap.get(id));

          let insertSql = "INSERT INTO tags_likes (tag_id, user_id) VALUES ?";
          const insertValues = newTagIds.map((tag_id) => [tag_id, user_id]);

          conn.query(insertSql, [insertValues], (err) => {
            if (err)
              return res.status(500).json({ message: "서버 오류", error: err });

            res.status(200).json({
              message: "선호 태그가 등록되었습니다.",
              added_tags: newTagNames,
              duplicated_tags: tag_names.filter(
                (tag) => !newTagNames.includes(tag)
              ),
            });
          });
        }
      );
    });
  });
});

// 선호 태그 조회
router.get("/favoritetags", authMiddleware, (req, res) => {
  const user_email = req.user.email;

  let findUserSql = "SELECT id FROM users WHERE user_email = ?";
  conn.query(findUserSql, [user_email], (err, userResults) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const user_id = userResults[0].id;

    let sql = `
        SELECT t.tag_name 
        FROM tags_likes tl
        JOIN tags t ON tl.tag_id = t.id
        WHERE tl.user_id = ?
      `;

    conn.query(sql, [user_id], (err, results) => {
      if (err)
        return res.status(500).json({ message: "서버 오류", error: err });

      const tags = results.map((row) => row.tag_name);
      res.status(200).json({ tags });
    });
  });
});

// 선호 태그 취소
router.delete("/favoritetags", authMiddleware, (req, res) => {
  const { tag_names } = req.body;
  const user_email = req.user.email;

  if (!Array.isArray(tag_names) || tag_names.length === 0) {
    return res.status(400).json({ message: "태그 목록이 올바르지 않습니다." });
  }

  let findUserSql = "SELECT id FROM users WHERE user_email = ?";
  conn.query(findUserSql, [user_email], (err, userResults) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const user_id = userResults[0].id;

    let findTagsSql = `SELECT id, tag_name FROM tags WHERE tag_name IN (?)`;
    conn.query(findTagsSql, [tag_names], (err, tagResults) => {
      if (err)
        return res.status(500).json({ message: "서버 오류", error: err });

      if (tagResults.length === 0) {
        return res
          .status(404)
          .json({ message: "존재하지 않는 태그가 포함되어 있습니다." });
      }

      const tagIds = tagResults.map((tag) => tag.id);
      const tagNameMap = new Map(
        tagResults.map((tag) => [tag.id, tag.tag_name])
      );

      let checkExistingSql = `SELECT tag_id FROM tags_likes WHERE user_id = ? AND tag_id IN (?)`;
      conn.query(
        checkExistingSql,
        [user_id, tagIds],
        (err, existingResults) => {
          if (err)
            return res.status(500).json({ message: "서버 오류", error: err });

          const existingTagIds = new Set(
            existingResults.map((row) => row.tag_id)
          );
          const removableTagIds = tagIds.filter((id) => existingTagIds.has(id));

          if (removableTagIds.length === 0) {
            return res.status(404).json({
              message: "선호 태그로 등록되지 않은 태그입니다.",
              not_registered_tags: tag_names,
            });
          }

          const removableTagNames = removableTagIds.map((id) =>
            tagNameMap.get(id)
          );

          let deleteSql =
            "DELETE FROM tags_likes WHERE tag_id IN (?) AND user_id = ?";
          conn.query(deleteSql, [removableTagIds, user_id], (err) => {
            if (err)
              return res.status(500).json({ message: "서버 오류", error: err });

            res.status(200).json({
              message: "선호 태그가 삭제되었습니다.",
              deleted_tags: removableTagNames,
              not_registered_tags: tag_names.filter(
                (tag) => !removableTagNames.includes(tag)
              ),
            });
          });
        }
      );
    });
  });
});

module.exports = router;
