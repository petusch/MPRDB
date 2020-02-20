import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';
import { OK } from 'http-status';
import authMiddleware from '../middleware/authMiddleware';


const router = new Router();

const authLocalMiddleware = (req, res, next) => {
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
    if (err) return next(err);
    req.user = user;
    next();
  })(req, res, next);
};

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authLocalMiddleware,
  authController.login,
);

router.post(
  '/logout',
  authMiddleware,
  async (req, res) => {
    req.logout();
    res.cookie('Authorization', null);
    return res.json(
      {
        message: 'Logout.',
        statusCode: OK
      });
  }
);
export default router;