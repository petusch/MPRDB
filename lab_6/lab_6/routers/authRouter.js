import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';

const router = new Router();

const authMiddleware = (req, res, next) => {
  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (!user) {
      return res.status(401).json(
        {
          message: 'Unauthorized',
          statusCode: 401,
          success: false,
        }
      );
    };
  })(req, res, next);

  return next();
};

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login,
);

export default router;