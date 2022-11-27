const jwt = require("jsonwebtoken");
const express = require("express");
const { verifyToken } = require("./middleware");
const { Domain, User } = require("../models");
const { Model } = require("sequelize");

const router = express.Router();

router.post("/token", async (req, res, next) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attributes: ["nick", "id"],
      },
    });
    if (!domain) {
      return res.status(400).json({
        code: 401,
        message: "등록되지 않는 도메인입니다.",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
        issuer: "nodeBird",
      }
    );
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (e) {
    console.error(e);
    return res.json({
      code: "500",
      message: "서버에러",
    });
  }
});

router.get("/test", verifyToken, async (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
