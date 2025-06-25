import { Request, Response } from 'express';
import { ICompanyRequest } from '../types';
import {
  createCompany as createCompanyService,
  getAllCompanies,
  getCompanyById,
  updateCompany as updateCompanyService,
  deleteCompany as deleteCompanyService,
  searchCompanies as searchCompaniesService,
} from '../services/company.service';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const companyData: ICompanyRequest = req.body;
    const company = await createCompanyService(companyData);

    res.status(201).json({
      status: 'success',
      data: { company },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

export const getCompanies = async (req: Request, res: Response) => {
  try {
    // Extract pagination parameters from request body
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;
    
    // Extract search query from request body
    const searchQuery = req.body.search || '';
    
    // Extract filter parameters from request body
    const filters = req.body.filters || {};

    // Get companies with pagination, filtering and search
    const { companies, totalCount, totalPages } = await getAllCompanies({
      page,
      limit,
      filters,
      searchQuery
    });

    res.json({
      status: 'success',
      data: { 
        companies,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: page,
          limit
        }
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await getCompanyById(req.body.companyId);

    res.json({
      status: 'success',
      data: { company },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const companyData: ICompanyRequest = req.body;
    const company = await updateCompanyService(req.body.companyId, companyData);

    res.json({
      status: 'success',
      data: { company },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    await deleteCompanyService(req.body.companyId);

    res.json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

export const searchCompanies = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const companies = await searchCompaniesService(query as string);

    res.json({
      status: 'success',
      data: { companies },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};