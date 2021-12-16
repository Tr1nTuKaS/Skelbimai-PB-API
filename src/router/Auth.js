const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const mysql = require("mysql2/promise");
const { dbConfig } = require("../config/config");

const { hashValue } = require("../helper/HashHelper");

router.post("/register", async (req, res) => {
  const { body } = req;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    INSERT INTO users (email, pass)
    VALUES ( ?, ? )
    `;
    // hash pass
    const result = await conn.execute(sql, [
      body.email,
      hashValue(body.password),
    ]);
    res.send({ msg: "user created", result });
    await conn.end();
  } catch (error) {
    console.log("errror registering", error.message);
    res.status(500).send({ error: "something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { body } = req;

  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = "SELECT * FROM users WHERE email = ?";
    const [foundUser] = await conn.execute(sql, [body.email]);
    await conn.end();

    if (foundUser.length === 0) {
      throw new Error("user not found");
    }
    console.log(foundUser);
    console.log(body.password, foundUser[0].pass);
    if (bcrypt.compareSync(body.password, foundUser[0].pass)) {
      const userToBeEncrypted = {
        email: foundUser[0].email,
        userId: foundUser[0].id,
      };

      const token = jwt.sign(
        userToBeEncrypted,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        msg: "user found",
        foundUser: foundUser[0].email,
        token,
      });
    }
    throw new Error("password do not match");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
