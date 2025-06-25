import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { Company, CompanyCreateRequest, CompanyUpdateRequest } from '../../../models/company.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  companyForm: FormGroup;
  isFormVisible = false;
  isEditing = false;
  currentCompanyId: string | null = null;
  
  // Pagination and search parameters
  page: number = 1;
  limit: number = 10;
  searchText: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      names: this.fb.array([this.createNameField()]),
      location: ['', Validators.required],
      owner: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+\\-() ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      logoUrl: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 1; // Reset to first page when searching
      this.loadCompanies();
    });
  }

  // Trigger search with debounce
  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  // Getter for the names FormArray
  get companyNames(): FormArray {
    return this.companyForm.get('names') as FormArray;
  }

  // Create a new FormControl for a name
  createNameField() {
    return this.fb.control('', Validators.required);
  }

  // Add a new name field
  addNameField(): void {
    this.companyNames.push(this.createNameField());
    console.log('Added name field. Controls count:', this.companyNames.controls.length);
  }

  // Remove a name field
  removeNameField(index: number): void {
    if (this.companyNames.length > 1) {
      this.companyNames.removeAt(index);
      console.log('Removed name field at index:', index);
      console.log('Current field count:', this.companyNames.controls.length);
    }
  }

  showAddForm(): void {
    this.isFormVisible = true;
    this.isEditing = false;
    this.currentCompanyId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.companyForm.reset();
    
    // Reset the names array to have just one empty control
    while (this.companyNames.length > 0) {
      this.companyNames.removeAt(0);
    }
    this.companyNames.push(this.createNameField());
    console.log('Form reset. Field count:', this.companyNames.controls.length);
  }

  loadCompanies(): void {
    const params = {
      page: this.page,
      limit: this.limit
    };
    
    // Only add search parameter if there's text to search
    if (this.searchText && this.searchText.trim() !== '') {
      Object.assign(params, { search: this.searchText.trim() });
    }
    
    console.log('Loading companies with params:', params);
    
    this.companyService.getAllCompanies(params).subscribe({
      next: (response) => {
        console.log('Companies response:', response);
        // Check if response is an array or has a data property
        let companiesData: Company[] = [];
        
        if (Array.isArray(response)) {
          companiesData = response;
        } else if (response && typeof response === 'object') {
          // Check if response has a data property that is an array
          const anyResponse = response as any;
          if (anyResponse.data && Array.isArray(anyResponse.data.companies)) {
            companiesData = anyResponse.data.companies;
          }
        }

        console.log('Processed companies data:', companiesData);
        
        // Process each company to ensure names is an array
        this.companies = companiesData.map(company => {
          if (!Array.isArray(company.names)) {
            console.warn('Company has non-array names, converting:', company);
            // Convert to array or use empty array if undefined
            return {
              ...company, 
              names: typeof company.names === 'string' 
                ? [company.names] 
                : (company.names ? [String(company.names)] : [])
            };
          }
          return company;
        });
        
        console.log('Final companies data:', this.companies);
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.companies = [];
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      const names = formData.names.filter((name: string) => name.trim() !== '');
      
      console.log('Names:', names);
      if (names.length === 0) {
        alert('Please add at least one company name');
        return;
      }
      
      if (this.isEditing && this.currentCompanyId) {
        const updateRequest: CompanyUpdateRequest = {
          companyId: this.currentCompanyId,
          names: names,
          location: formData.location,
          owner: formData.owner,
          phone: formData.phone,
          email: formData.email,
          logoUrl: formData.logoUrl || '',
          notes: formData.notes || ''
        };
        
        console.log('Updating company with data:', updateRequest);
        
        this.companyService.updateCompany(updateRequest).subscribe({
          next: () => {
            this.loadCompanies();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error updating company:', error);
          }
        });
      } else {
        const createRequest: CompanyCreateRequest = {
          names: names,
          location: formData.location,
          owner: formData.owner,
          phone: formData.phone,
          email: formData.email,
          logoUrl: formData.logoUrl || '',
          notes: formData.notes || ''
        };
        
        console.log('Creating company with data:', createRequest);
        
        this.companyService.createCompany(createRequest).subscribe({
          next: () => {
            this.loadCompanies();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error creating company:', error);
          }
        });
      }
    }
  }

  editCompany(company: Company): void {
    if (!company.companyId) {
      console.error('Cannot edit company: companyId is undefined');
      return;
    }
    
    console.log('Editing company:', company);
    
    this.isFormVisible = true;
    this.isEditing = true;
    this.currentCompanyId = company.companyId;
    
    // Reset the names FormArray
    while (this.companyNames.length > 0) {
      this.companyNames.removeAt(0);
    }
    
    // Add each company name to the FormArray
    if (Array.isArray(company.names)) {
      for (const name of company.names) {
        this.companyNames.push(this.fb.control(name, Validators.required));
      }
    } else {
      console.error('Company names is not an array:', company.names);
      // Create a default name field
      this.companyNames.push(this.fb.control('', Validators.required));
    }
    
    // Set other form values
    this.companyForm.patchValue({
      location: company.location,
      owner: company.owner,
      phone: company.phone,
      email: company.email,
      logoUrl: company.logoUrl,
      notes: company.notes || ''
    });
  }

  deleteCompany(companyId: string): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(companyId).subscribe({
        next: () => {
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Error deleting company:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.isFormVisible = false;
    this.isEditing = false;
    this.currentCompanyId = null;
    this.resetForm();
  }
}