import { Router } from 'express';
import { verifyContact } from '../middlwares/contact';
import {
  readAllContacts,
  readContactById,
  readMyContact,
} from '../controllers/contactControllers';
import { protect } from '../middlwares/auth';
const router: Router = Router();

router.get('/', protect, readAllContacts);
router.get('/me', protect, readMyContact);
router.get('/:id', protect, readContactById);
router.patch('/:id', protect, verifyContact, readContactById);
router.delete('/:id', protect, verifyContact, readContactById);

export default router;
