import passport from 'passport';

const authMiddleware = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (!user) {
      return res.status(401).json(
        {
          message: 'Unauthorized',
          statusCode: 401,
          success: false,
        }
      );
    };
    if (err) return next(err);
    req.user = user;
    next();
  })(req, res, next);
};

export default authMiddleware;