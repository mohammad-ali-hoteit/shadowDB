import { Router } from 'express';
import { login, register } from '../../controllers/auth.controller';
import { ROUTES } from '../../constants/routesConstants';

const router = Router();

router.post(ROUTES.AUTH.REGISTER, register);
router.post(ROUTES.AUTH.LOGIN, login);

export default router; 