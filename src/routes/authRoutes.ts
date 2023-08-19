import { Request, Response, Router } from 'express';
import { signup } from '../controllers/authControllers';
const router: Router = Router();

router.post('/', signup);

export default router;
