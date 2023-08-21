import { Request, Response, Router } from 'express';
import { protect } from '../controllers/authControllers';
import { readMe } from '../controllers/userControllers';
const router: Router = Router();

router.get('/me', protect, readMe);

export default router;