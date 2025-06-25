import { Router } from 'express';
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
} from '../../controllers/company.controller';
import { adminAuth, auth } from '../../middlewares/auth';
import { ROUTES } from '../../constants/routesConstants';

const router = Router();

// Public routes
router.post(ROUTES.COMPANY.SEARCH_COMPANIES,auth, searchCompanies);

// Protected routes (admin only)
router.post(ROUTES.COMPANY.CREATE_COMPANY, adminAuth, createCompany);
router.post(ROUTES.COMPANY.GET_ALL_COMPANIES, adminAuth, getCompanies);
router.post(ROUTES.COMPANY.GET_COMPANY_BY_ID, adminAuth, getCompany);
router.post(ROUTES.COMPANY.UPDATE_COMPANY, adminAuth, updateCompany);
router.post(ROUTES.COMPANY.DELETE_COMPANY, adminAuth, deleteCompany);

export default router; 