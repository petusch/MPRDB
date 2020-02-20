import { Router } from 'express';
import passport from 'passport';
import * as patientController from '../controllers/patientController';
import authMiddleware from '../middleware/authMiddleware';

const router = new Router();

router.get(
    '/patients',
    authMiddleware,
    patientController.find,
);

router.get(
    '/patients/:patient_id',
    authMiddleware,
    patientController.findOneById,
);

router.post(
    '/patients',
    authMiddleware,
    patientController.create,
);

router.put(
    '/patients/:patient_id',
    authMiddleware,
    patientController.update
);

router.delete(
    '/patients/:patient_id',
    authMiddleware,
    patientController.deleteById
);

export default router;