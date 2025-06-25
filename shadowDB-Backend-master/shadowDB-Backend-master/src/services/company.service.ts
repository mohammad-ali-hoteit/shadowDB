import { ICompany, ICompanyRequest } from '../types';
import { RepositoryFactory } from '../repositories/RepositoryFactory';

// Interface for pagination, filtering and search parameters
interface CompanyQueryOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  searchQuery?: string;
}

// Interface for paginated response
interface PaginatedCompanyResponse {
  companies: ICompany[];
  totalCount: number;
  totalPages: number;
}

export const createCompany = async (companyData: ICompanyRequest): Promise<ICompany> => {
  const companyRepository = RepositoryFactory.getCompanyRepository();
  return companyRepository.create(companyData);
};

export const getAllCompanies = async (options?: CompanyQueryOptions): Promise<PaginatedCompanyResponse> => {
  const companyRepository = RepositoryFactory.getCompanyRepository();
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const filters = options?.filters || {};
  const searchQuery = options?.searchQuery || '';

  // If no options are provided, return all companies without pagination
  if (!options) {
    const companies = await companyRepository.findAll();
    return {
      companies,
      totalCount: companies.length,
      totalPages: 1
    };
  }

  // Get paginated, filtered and searched results from repository
  const { companies, totalCount } = await companyRepository.findAllWithOptions({
    page,
    limit,
    filters,
    searchQuery
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  return {
    companies,
    totalCount,
    totalPages
  };
};

export const getCompanyById = async (id: string): Promise<ICompany> => {
  const companyRepository = RepositoryFactory.getCompanyRepository();
  return companyRepository.findById(id);
};

export const updateCompany = async (id: string, companyData: ICompanyRequest): Promise<ICompany> => {
  const companyRepository = RepositoryFactory.getCompanyRepository();
  return companyRepository.update(id, companyData);
};

export const deleteCompany = async (id: string): Promise<void> => {
  const companyRepository = RepositoryFactory.getCompanyRepository();
  return companyRepository.delete(id);
};

export const searchCompanies = async (query: string): Promise<ICompany[]> => {
  const companyRepository = RepositoryFactory.getCompanyRepository();
  return companyRepository.search(query);
};