import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { SECRET } from './constants/secret';

import User from './models/User'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
    },
    async (login, password, next) => {
      const user = await User.findOneByLogin(login);

      if (!user) {
        return next(null, false);
      }

      const userPassword = user.password;

      if (password !== userPassword) {
        return next(null, false);
      }
      console.log(user);
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
    async ({ _id }, next) => {
      const user = await User.findOneById(_id);

      if (!user) {
        return next(null, false);
      }
      console.log(user);
      return next(null, user);
    },
  ),
);