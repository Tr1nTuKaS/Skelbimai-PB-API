require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// const mysql = require('mysql2/promise');
// const dbConfig = require('./dbConfig');

const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
console.log("path", path.resolve("public", "upload"));
app.use("/skelbiu-img", express.static(path.resolve("public", "upload")));

app.get("/", (req, res) => {
  res.send("Hello express");
});

app.post("/api/new-listing", upload.single("mainImg"), (req, res) => {
  console.log("req.body ===", req.body);
  console.log("req.file ===", req.file);
  // if (req.file.size >= 500000) {
  //   res.status(400).json({ error: "Too big" });
  // }
  res.json({ msg: "image saved", data: req.file.filename });
});

const regLog = require("./router/Auth");
const posts = require("./router/posts");

app.use("/post", posts);
app.use("/auth", regLog);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
