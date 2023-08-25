import { Router } from 'express';
import { protect, restrictedTo } from '../middlwares/auth';
import {
  readUserMe,
  updateUserMe,
  deleteUserMe,
  readAllUsers,
  readUserById,
} from '../controllers/userControllers';
const router: Router = Router();

router.get('/me', protect, readUserMe);
router.patch('/updateMe', protect, updateUserMe);
router.delete('/deleteMe', protect, deleteUserMe);

router.get('/', protect, restrictedTo('admin'), readAllUsers);
router.get('/:id', protect, restrictedTo('admin'), readUserById);
//TODO update and delete user by id for admin roles

export default router;
