import { Router } from 'express';
import * as userController from '../controllers/userController';
import passport from 'passport';
import authMiddleware from '../middleware/authMiddleware';

const router = new Router();

router.get(
  '/users',
  authMiddleware,
  userController.find,
);

router.get(
  '/users/:user_id',
  authMiddleware,
  userController.findOneById,
);

router.post(
  '/users',
  userController.create,
);

router.put(
  '/users/:user_id',
  authMiddleware,
  userController.update
);

router.put(
  '/users/:user_id/role',
  authMiddleware,
  userController.updateRole
);

router.delete(
  '/users/:user_id',
  authMiddleware,
  userController.deleteById
);

export default router;