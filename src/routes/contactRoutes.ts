import { Router } from 'express';
import { verifyContact } from '../middlwares/contact';
import {
  deleteContactById,
  readAllContacts,
  readContactById,
  readMyContact,
  updateContactById,
} from '../controllers/contactControllers';
import { protect } from '../middlwares/auth';
const router: Router = Router();

router.get('/', protect, readAllContacts);
router.get('/me', protect, readMyContact);
router.get('/:id', protect, readContactById);
router.patch('/:id', protect, verifyContact, updateContactById);
router.delete('/:id', protect, verifyContact, deleteContactById);

export default router;
