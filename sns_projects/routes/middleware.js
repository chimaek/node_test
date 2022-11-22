exports.isLoggedId = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};
exports.isNotLoggedId = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
