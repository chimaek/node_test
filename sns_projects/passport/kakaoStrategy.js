const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        CallbackURL: "/auth/kakao/callback",
      },
      async (Token, refresh_token, profile, done) => {
        console.log(`kakao profile`, profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile.json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
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
