import express from 'express';
import { auth, role } from '../middleware';
import { getUsers } from '../controllers/admin';

const router = express.Router();

router.get('/users', auth, role('admin'), getUsers);
// router.delete('/users/:id', auth, role('admin'), deleteUser);
// router.patch('/users/:id', auth, role('admin'), updateUserRole);

export default router;