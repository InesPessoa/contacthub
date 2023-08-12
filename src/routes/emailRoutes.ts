import { Request, Response, Router } from 'express';
import { createEmail } from '../controllers/emailControllers';

const router: Router = Router();

router.post('/', createEmail);

export default router;
