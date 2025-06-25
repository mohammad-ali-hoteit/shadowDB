import { ICompany, ICompanyRequest } from '../types';
import Company from '../models/Company';
import { AppError } from '../middlewares/error';
import { ICompanyRepository } from './interfaces/ICompanyRepository';

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

export class CompanyRepository implements ICompanyRepository {
  async create(companyData: ICompanyRequest): Promise<ICompany> {
    return Company.create(companyData);
  }

  async findAll(): Promise<ICompany[]> {
    return Company.find().sort({ createdAt: -1 });
  }

  async findById(companyId: string): Promise<ICompany> {
    const company = await Company.findOne({companyId});

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }

  async update(companyId: string, companyData: ICompanyRequest): Promise<ICompany> {
    const company = await Company.findOneAndUpdate({companyId}, companyData, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }

  async delete(companyId: string): Promise<void> {
    const company = await Company.findOneAndDelete({companyId});

    if (!company) {
      throw new AppError('Company not found', 404);
    }
  }

  async search(query: string): Promise<ICompany[]> {
    // Create a case-insensitive regex pattern for partial matching
    const searchRegex = new RegExp(query, 'i');
    
    // Search for partial matches in names, location, and owner fields
    return Company.find({
      $or: [
        { names: { $elemMatch: { $regex: searchRegex } } }, // Since names is an array
        { location: { $regex: searchRegex } },
        { owner: { $regex: searchRegex } },
      ]
    }).sort({ createdAt: -1 }); // Sort by most recent
  }

  async findAllWithOptions({ page, limit, filters, searchQuery }: FindAllOptions): Promise<PaginatedResult> {
    // Start building the query
    let query: any = {};

    // Add search conditions if searchQuery is provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchRegex = new RegExp(searchQuery, 'i');
      query.$or = [
        { names: { $elemMatch: { $regex: searchRegex } } },
        { location: { $regex: searchRegex } },
        { owner: { $regex: searchRegex } },
      ];
    }

    // Add filters
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        // Skip if value is undefined or empty string
        if (value === undefined || value === '') return;
        
        // Handle specific filter types differently if needed
        if (key === 'industry' && Array.isArray(value)) {
          query.industry = { $in: value };
        } else if (typeof value === 'string') {
          query[key] = new RegExp(value, 'i'); // Case-insensitive search for string filters
        } else {
          query[key] = value;
        }
      });
    }

    // Count total documents matching the query for pagination metadata
    const totalCount = await Company.countDocuments(query);

    // Apply pagination
    const skip = (page - 1) * limit;
    
    // Execute the query with pagination and sorting
    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      companies,
      totalCount
    };
  }
}