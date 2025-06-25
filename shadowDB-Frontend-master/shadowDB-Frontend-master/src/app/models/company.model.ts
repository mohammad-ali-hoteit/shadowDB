export interface Company {
  companyId?: string;
  names: string[];
  location: string;
  owner: string;
  phone: string;
  email: string;
  logoUrl: string;
  createdAt?: Date;
  notes?: string;
  blacklisted?: boolean;
  score?: number;
  _id?: string;
  updatedAt?: Date;
}

export interface CompanySearchRequest {
  query: string;
}

export interface CompanyCreateRequest {
  names: string[];
  location: string;
  owner: string;
  phone: string;
  email: string;
  logoUrl: string;
  notes?: string;
}

export interface CompanyUpdateRequest extends CompanyCreateRequest {
  companyId: string;
} 