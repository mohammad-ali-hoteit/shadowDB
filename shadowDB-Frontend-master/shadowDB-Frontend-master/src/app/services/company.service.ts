import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Company, CompanySearchRequest, CompanyCreateRequest, CompanyUpdateRequest } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/SHADOWDB/API/V1/COMPANY`;

  constructor(private http: HttpClient) {}

  searchCompanies(query: string): Observable<Company[]> {
    const request: CompanySearchRequest = { query };
    return this.http.post<any>(`${this.apiUrl}/SEARCH_COMPANIES`, request)
      .pipe(
        map(response => {
          console.log('Search companies response:', response);
          // Handle different response formats
          if (Array.isArray(response)) {
            return response;
          } else if (response && typeof response === 'object') {
            if (response.data && Array.isArray(response.data.companies)) {
              return response.data.companies;
            } else if (response.data && Array.isArray(response.data)) {
              return response.data;
            }
          }
          return [];
        })
      );
  }

  getAllCompanies(params?: { page?: number; limit?: number; search?: string }) {
    return this.http.post<any>(`${this.apiUrl}/GET_ALL_COMPANIES`, params || {});
  }

  getCompanyById(companyId: string): Observable<Company> {
    return this.http.post<any>(`${this.apiUrl}/GET_COMPANY_BY_ID`, { companyId })
      .pipe(
        map(response => {
          if (response && response.data && response.data.company) {
            return response.data.company;
          }
          return response;
        })
      );
  }

  createCompany(company: CompanyCreateRequest): Observable<Company> {
    return this.http.post<any>(`${this.apiUrl}/CREATE_COMPANY`, company)
      .pipe(
        map(response => {
          if (response && response.data && response.data.company) {
            return response.data.company;
          }
          return response;
        })
      );
  }

  updateCompany(company: CompanyUpdateRequest): Observable<Company> {
    return this.http.post<any>(`${this.apiUrl}/UPDATE_COMPANY`, company)
      .pipe(
        map(response => {
          if (response && response.data && response.data.company) {
            return response.data.company;
          }
          return response;
        })
      );
  }

  deleteCompany(companyId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/DELETE_COMPANY`, { companyId });
  }
}