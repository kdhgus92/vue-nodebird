const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  const user = req.user;
  res.json(user);
});

router.post("/");

router.post("/", isNotLoggedIn, async (req, res, next) => {
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
    await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    }); // HTTP STATUS CODE
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
  } catch (err) {
    console.log(err);
    return next(err); // node 교과서 6장
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
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

router.post("/logout", isLoggedIn, (req, res) => {
  // 실제 주소는 /user/logout
  if (req.isAuthenticated()) {
    req.logout();
    req.session.destroy(); // 선택사항
    return res.status(200).send("로그아웃 되었습니다.");
  }
});

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {});

router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {});

router.patch("/:id/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        nickname: req.body.nickname,
      },
      { where: { id: req.user.id } }
    );
    res.send(req.body.nickname);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
