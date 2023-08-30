import { Router } from 'express';
import { restrictedTo } from '../middlwares/auth';
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
router.patch('/:id', protect, restrictedTo('admin'), updateContactById);
router.delete('/:id', protect, restrictedTo('admin'), deleteContactById);

export default router;
