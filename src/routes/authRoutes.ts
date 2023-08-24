import { Router } from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/authControllers';
const router: Router = Router();

router.post('/singup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);

export default router;
