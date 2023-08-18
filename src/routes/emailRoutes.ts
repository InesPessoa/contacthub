import { Request, Response, Router } from 'express';
import { createUser } from '../controllers/userControllers';
const router: Router = Router();

router.post('/', createUser);

export default router;
