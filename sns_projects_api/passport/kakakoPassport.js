const passport = require("passport");
const kakao = require("passport-kakao").Strategy;
const User = require("../models/user");
const { where } = require("sequelize");

module.exports = () => {
  passport.use(
    new kakao(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
          }
        } catch (e) {
          console.error(e);
          done(e);
        }
      }
    )
  );
};
