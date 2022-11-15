const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const Hashtag = require("../models/hashtag");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followingIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내정보 -NodeBird" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입" });
});
router.get("/", async (req, res, next) => {
  try {
    res.locals.user = req.user;
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "Nodebird",
      twits: posts,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hasgtag = await Hashtag.findOne({
      where: { title: query },
    });
    let posts = [];
    if (hasgtag) {
      posts = await hasgtag.getPosts({
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
          },
        ],
      });
    }
    return res.render("main", {
      title: `#${query} 검색 결과 | Nodebird`,
      twits: posts,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
