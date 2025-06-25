import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../../controllers/user.controller';
import { adminAuth } from '../../middlewares/auth';
import { ROUTES } from '../../constants/routesConstants';

const router = Router();

// All routes are protected (admin only)
router.use(adminAuth);

router.post(ROUTES.USER.CREATE_USER, createUser);
router.post(ROUTES.USER.GET_ALL_USERS, getUsers);
router.post(ROUTES.USER.GET_USER_BY_ID, getUser);
router.post(ROUTES.USER.UPDATE_USER, updateUser);
router.post(ROUTES.USER.DELETE_USER, deleteUser);

export default router; 