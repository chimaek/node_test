const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const session = require("express-session");
const multer = require("multer");
const { sequelize } = require("./models");
const app = express();
const fs = require("fs");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

const path = require("path");
app.set("port", process.env.PORT || 3000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db ok");
  })
  .catch((err) => {
    console.log(err);
  });

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("make uploads dir");
  fs.mkdirSync("uploads/");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
app.use(morgan("dev"));
// app.use("/", (req, res, next) => {
//   if (req.session.id) {
//     express.static(path.join(__dirname, "public-3000"))(req, res, next);
//   } else {
//     next();
//   }
// });
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().array());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
    },
  })
);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
// app.get("/", (req, res, next) => {
//   req.session.id = "hello";
//   res.json({
//     name: 123,
//     good: 1,
//     man: true,
//   });
// });
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart.html"));
});
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok");
});
app.listen(3000);

module.exports = {
  app,
  axios,
  express,
  cookieParser,
};
