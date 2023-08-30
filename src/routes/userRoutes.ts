import { Router } from 'express';
import { protect, restrictedTo } from '../middlwares/auth';
import {
  readUserMe,
  updateUserMe,
  deleteUserMe,
  readAllUsers,
  readUserById,
  createUser,
} from '../controllers/userControllers';
import { create } from 'domain';
const router: Router = Router();

router.get('/me', protect, readUserMe);
router.patch('/me', protect, updateUserMe);
router.delete('/me', protect, deleteUserMe);

router.get('/', protect, restrictedTo('admin'), readAllUsers);
router.get('/:id', protect, restrictedTo('admin'), readUserById);
router.post('/', protect, restrictedTo('admin'), createUser);
//TODO update and delete user by id for admin roles

export default router;
