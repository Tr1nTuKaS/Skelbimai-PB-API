const express = require("express");
const { dbFail, dbSuccess, dbAction } = require("../helper/dbHelper");
const jwt = require("jsonwebtoken");

const router = express.Router();

function authenticateToken(req, res, next) {
  const result = req.get("Authorization");

  if (!result) return dbFail(res, "not authenticated", 400);
  const token = result.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      return dbFail(res, "token expired/invalid", 400);
    }
    // token valid and present
    req.email = data.email;
    next();
  });
}

router.get("/", authenticateToken, async (req, res) => {
  const sql = `
  SELECT posts.id, posts.imageURL, posts.adress, posts.category, posts.price posts.userId, posts.title, posts.timeStamp, users.email, users.id AS author
  FROM posts
  INNER JOIN users
  ON users.id = posts.userId
  WHERE users.email = ?
  `;
  const dbResult = await dbAction(sql);
  if (dbResult === false) return dbFail(res);
  dbSuccess(res, dbResult);
});

module.exports = router;
