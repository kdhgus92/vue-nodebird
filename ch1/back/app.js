const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

const db = require("./models");
const passportConfig = require("./passport");
const app = express();

db.sequelize.sync({ force: true }); // Model(테이블)이 변경되면 테이블 지우고 다시 만든다.
// db.sequelize.sync({ force: false }); // 배포시
passportConfig();

// Middleware 입력하는 자리
app.use(morgan("dev"));
app.use(cors("http://localhost:3000"));
app.use(express.json()); // app.use 는 res,req를 조작한다.
app.use(express.urlencoded({ extended: false }));
// passport 설정
app.use(cookie("cookiesecret"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "cookiesecret",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.status(200).send("안녕 백엔드");
});

app.post("/user", async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const exUser = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      //이미 회원가입되어있으면,
      return res.status(403).json({
        errorCode: 1,
        message: "이미 회원가입되어있습니다.",
      });
    }
    const newUser = await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    }); // HTTP STATUS CODE
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return next(err); // node 교과서 6장
  }
});

const user = {};

app.post("/user/login", (req, res, next) => {
  /*
  req.body.email;
  req.body.password;
  // email이랑 password 검사 
  await db.User.findOne();
  // 세션에 저장
  user[cookie] = 유저정보;
  // 프론트에 쿠키 내려보내주기
  */
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (err) => {
      // 세션에다 사용자 정보 저장(어떻게? serializeUser)
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.json(user);
    });
  })(req, res, next);
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});
