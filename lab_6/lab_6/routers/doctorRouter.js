import { Router } from 'express';
import passport from 'passport';
import * as doctorController from '../controllers/doctorController';
import authMiddleware from '../middleware/authMiddleware';

const router = new Router();

router.get(
    '/doctors',
    authMiddleware,
    doctorController.find,
);

router.get(
    '/doctors/:doctor_id',
    authMiddleware,
    doctorController.findOneById
);

router.post(
    '/doctors',
    authMiddleware,
    doctorController.create,
);

router.put(
    '/doctors/:doctor_id',
    authMiddleware,
    doctorController.update,
);

router.delete(
    '/doctors/:doctor_id',
    authMiddleware,
    doctorController.deleteById
);

export default router;