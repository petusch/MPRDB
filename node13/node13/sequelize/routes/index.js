import { Router } from 'express';


import userRouter from './userRouter'
import authRouter from './authRouter'
import doctorRouter from './doctorRouter'
import patientRouter from './patientRouter'

const router = new Router();

router.use(userRouter);
router.use(authRouter);
router.use(doctorRouter);
router.use(patientRouter);

export default router;