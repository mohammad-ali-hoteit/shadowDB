import { ICompany, ICompanyRequest } from '../../types';

// Interface for pagination, filtering and search options
interface FindAllOptions {
  page: number;
  limit: number;
  filters: Record<string, any>;
  searchQuery: string;
}

// Interface for paginated response
interface PaginatedResult {
  companies: ICompany[];
  totalCount: number;
}

export interface ICompanyRepository {
  create(companyData: ICompanyRequest): Promise<ICompany>;
  findAll(): Promise<ICompany[]>;
  findById(companyId: string): Promise<ICompany>;
  update(companyId: string, companyData: ICompanyRequest): Promise<ICompany>;
  delete(companyId: string): Promise<void>;
  search(query: string): Promise<ICompany[]>;
  findAllWithOptions(options: FindAllOptions): Promise<PaginatedResult>;
}