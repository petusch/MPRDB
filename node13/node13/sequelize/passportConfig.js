import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { SECRET } from './constants/secret';

import User from './postgres/models/User'
import Role from './postgres/models/Role'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
    },
    async (login, password, next) => {
      const user = await User.findOne({
        include: [Role],
        where: { login }
      });

      if (!user) {
        return next(null, false);
      }

      const userPassword = user.password;

      if (password !== userPassword) {
        return next(null, false);
      }

      return next(null, user);
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    async ({ id }, next) => {
      const user = await User.findOne({
        include: [Role],
        where: { id }
      });

      if (!user) {
        return next(null, false);
      }

      return next(null, user);
    },
  ),
);