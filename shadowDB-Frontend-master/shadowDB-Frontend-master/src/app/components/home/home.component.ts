import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { trigger, transition, style, animate, query, stagger, keyframes, state } from '@angular/animations';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({ 
        opacity: 0, 
        transform: 'translateY(20px)' 
      })),
      state('visible', style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      })),
      transition('void => visible', [
        animate('400ms ease-out')
      ])
    ]),
    trigger('cardAnimation', [
      state('void', style({ 
        opacity: 0, 
        transform: 'translateY(30px)' 
      })),
      state('visible', style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      })),
      transition('void => visible', [
        animate('500ms {{delay}}ms ease-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  // Search state
  searchQuery: string = '';
  companies: Company[] = [];
  loading: boolean = false;
  error: string | null = null;
  noResults: boolean = false;
  isSearchFocused: boolean = false;
  activeFilter: string = 'name';
  
  // UI state
  isDarkMode: boolean = true;
  isLoaded: boolean = false;
  isUserMenuOpen: boolean = false;
  windowWidth: number = window.innerWidth;
  username: string = 'Admin'; // Default value
  
  // Store sanitized logo URLs
  private logoUrlMap: Map<string, SafeUrl> = new Map();
  
  // Company card colors
  private colorMap: Map<string, string> = new Map();
  private colors: string[] = [
    '#4f46e5', '#7c3aed', '#8b5cf6', '#c026d3', 
    '#db2777', '#f43f5e', '#ef4444', '#f97316', 
    '#f59e0b', '#10b981', '#14b8a6', '#0ea5e9'
  ];
  
  // Realtime search
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  // Footer copyright year
  currentYear = new Date().getFullYear();
  
  // Pagination data (for future implementation)
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  @ViewChild('searchInput') searchInput!: ElementRef;
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close user menu when clicking outside
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.user-menu')) {
      this.isUserMenuOpen = false;
    }
  }

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      // Get the username if authenticated
      this.loadUserInfo();
    }

    // Initialize search with debounce
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query) {
        this.onSearch();
      } else {
        this.companies = [];
        this.noResults = false;
      }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('shadowdb-theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // If no saved preference, ensure we use dark theme
      this.isDarkMode = true;
      // Save this preference for future sessions
      localStorage.setItem('shadowdb-theme', 'dark');
    }
    
    // Always apply theme on initialization
    this.applyTheme();
    
    // Auto-focus the search input immediately
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 300);
    
    // Activate loading animations
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.companies = [];
      this.noResults = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.noResults = false;

    this.companyService.searchCompanies(this.searchQuery.trim())
      .subscribe({
        next: (response: any) => {
          console.log('Search response:', response);
          
          // Handle different response formats
          if (response && typeof response === 'object') {
            if (Array.isArray(response)) {
              // Direct array response
              this.companies = response;
            } else if (response.data && Array.isArray(response.data.companies)) {
              // Format: { status: string, data: { companies: Company[] } }
              this.companies = response.data.companies;
            } else if (response.companies && Array.isArray(response.companies)) {
              // Format: { companies: Company[] }
              this.companies = response.companies;
            } else {
              console.error('Unexpected response format:', response);
              this.error = 'Received unexpected data format from server';
              this.companies = [];
            }
          } else {
            console.error('Invalid response:', response);
            this.error = 'Received invalid response from server';
            this.companies = [];
          }
          
          // Pre-sanitize all logo URLs
          this.companies.forEach(company => {
            if (company.logoUrl) {
              // Sanitize and store the URL
              this.logoUrlMap.set(company.logoUrl, this.getSafeUrl(company.logoUrl));
            }
          });
          
          this.loading = false;
          this.noResults = this.companies.length === 0;
          console.log('Processed companies:', this.companies);
        },
        error: (err) => {
          console.error('Error searching companies:', err);
          this.error = 'Failed to load companies. Please try again.';
          this.loading = false;
          this.companies = [];
        }
      });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.companies = [];
    this.error = null;
    this.noResults = false;
    
    // Refocus the search input after clearing
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }

  retrySearch(): void {
    if (this.searchQuery) {
      this.onSearch();
    }
  }
  
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('shadowdb-theme', this.isDarkMode ? 'dark' : 'light');
    
    // Add console log for debugging
    console.log('Theme toggled:', this.isDarkMode ? 'dark' : 'light');
  }

  /**
   * Apply the current theme to the app
   */
  applyTheme(): void {
    // For debugging
    console.log('Applied theme:', this.isDarkMode ? 'dark' : 'light');
  }

  /**
   * Toggle the user menu dropdown
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Format a date for display
   */
  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  getCompanyInitials(name: string): string {
    if (!name) return '';
    
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (name.substring(0, 2)).toUpperCase();
  }
  
  /**
   * Handle image loading errors
   */
  onLogoError(event: Event, company: Company): void {
    console.log('Logo error for company:', company.names[0], company.logoUrl);
    const imgElement = event.target as HTMLImageElement;
    
    if (!company.logoUrl) {
      // If URL is already empty, just show initials
      return;
    }
    
    // Check if the URL is valid
    const isValidUrl = (urlString: string): boolean => {
      try {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(urlString);
      } catch (e) {
        return false;
      }
    };
    
    // If URL is malformed, show initials immediately
    if (!isValidUrl(company.logoUrl)) {
      console.warn('Invalid company logo URL format:', company.logoUrl);
      this.showInitialsInstead(imgElement, company);
      return;
    }
    
    // First try: Use the CORS proxy
    if (!company.logoUrl.includes('corsproxy.io')) {
      try {
        const proxiedUrl = this.getProxiedImageUrl(company.logoUrl);
        
        // Only if proxy URL is different than original
        if (proxiedUrl !== company.logoUrl) {
          console.log('Trying with CORS proxy:', proxiedUrl);
          
          // Temporarily create a test image to check if proxy works
          const testImg = new Image();
          testImg.onload = () => {
            // Success! Update the src
            if (imgElement) {
              imgElement.src = proxiedUrl;
            }
          };
          testImg.onerror = () => {
            // Proxy didn't work, fall back to next option
            this.tryImageFallback(imgElement, company);
          };
          testImg.src = proxiedUrl;
          
          // Don't continue to other fallbacks yet
          return;
        }
      } catch (e) {
        console.error('Error with proxy URL:', e);
      }
    }
    
    // If we're here, try other fallback methods
    this.tryImageFallback(imgElement, company);
  }
  
  /**
   * Try additional fallback methods for loading images
   */
  tryImageFallback(imgElement: HTMLImageElement, company: Company): void {
    // Second try: Add cache-busting timestamp
    if (company.logoUrl && !company.logoUrl.includes('?t=')) {
      const timestamp = new Date().getTime();
      const newUrl = `${company.logoUrl}?t=${timestamp}`;
      
      console.log('Trying with timestamp:', newUrl);
      
      // Create a new image to test loading
      const testImg = new Image();
      testImg.onload = () => {
        // If it loads successfully, update the URL
        if (imgElement) {
          imgElement.src = newUrl;
        }
      };
      testImg.onerror = () => {
        // Nothing worked, show initials instead
        this.showInitialsInstead(imgElement, company);
      };
      testImg.src = newUrl;
      return;
    }
    
    // No fallback worked, show initials
    this.showInitialsInstead(imgElement, company);
  }
  
  /**
   * Show initials when all image loading attempts fail
   */
  showInitialsInstead(imgElement: HTMLImageElement, company: Company): void {
    console.log('All image loading attempts failed, showing initials');
    
    if (imgElement && imgElement.parentElement) {
      // Hide the image
      imgElement.style.display = 'none';
    }
    
    // Clear the URL to show initials
    company.logoUrl = '';
  }
  
  /**
   * Get a sanitized URL that's safe to use in templates
   */
  getSafeUrl(url: string): SafeUrl {
    if (!url) {
      return '';
    }
    
    // Validate URL format before attempting to proxy
    const isValidUrl = (urlString: string): boolean => {
      try {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(urlString);
      } catch (e) {
        return false;
      }
    };
    
    if (!isValidUrl(url)) {
      console.warn('Invalid URL format in getSafeUrl:', url);
      return '';
    }
    
    try {
      // First try to use a CORS proxy if the URL might have CORS issues
      const proxiedUrl = this.getProxiedImageUrl(url);
      return this.sanitizer.bypassSecurityTrustUrl(proxiedUrl);
    } catch (e) {
      console.error('Error in getSafeUrl:', e);
      return '';
    }
  }
  
  /**
   * Add a proxy to image URLs to avoid CORS issues
   * This uses a free CORS proxy service
   */
  getProxiedImageUrl(originalUrl: string): string {
    if (!originalUrl) return '';
    
    // Check if URL already has a proxy
    if (originalUrl.includes('cors-anywhere') || originalUrl.includes('corsproxy')) {
      return originalUrl;
    }
    
    // If it's a relative URL or a data URL, no need for proxy
    if (originalUrl.startsWith('/') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    // Check if the URL is valid before trying to parse it
    const isValidUrl = (urlString: string): boolean => {
      try {
        // Check for basic URL pattern with a protocol
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(urlString);
      } catch (e) {
        return false;
      }
    };

    // If URL is not valid, return as is
    if (!isValidUrl(originalUrl)) {
      console.warn('Invalid URL format:', originalUrl);
      return originalUrl;
    }

    // Try to use a CORS proxy service
    try {
      const url = new URL(originalUrl);
      
      // Add the original URL as a parameter to a proxy service
      // or return the original if it's already a safe domain
      if (url.hostname.includes('cloudfront.net') || 
          url.hostname.includes('amazonaws.com') ||
          url.hostname.includes('luxota.cloud')) {
        // These are typically CORS-friendly services
        return originalUrl;
      } else {
        // Use CORS proxy for other domains
        // Note: In production, you should use your own proxy service
        return `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
      }
    } catch (e) {
      console.error('Error parsing URL:', originalUrl, e);
      return originalUrl;
    }
  }
  
  /**
   * Check if a logo URL exists and return the sanitized version
   */
  getLogoUrl(company: Company): SafeUrl | string {
    try {
      if (!company || !company.logoUrl) return '';
      
      // Return cached sanitized URL if available
      if (this.logoUrlMap.has(company.logoUrl)) {
        return this.logoUrlMap.get(company.logoUrl) as SafeUrl;
      }
      
      // Validate URL
      const isValidUrl = (urlString: string): boolean => {
        try {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(urlString);
        } catch (e) {
          return false;
        }
      };
      
      if (!isValidUrl(company.logoUrl)) {
        console.warn('Invalid URL in getLogoUrl:', company.logoUrl);
        // Set to empty to show initials
        company.logoUrl = '';
        return '';
      }
      
      // Sanitize and cache URL
      const safeUrl = this.getSafeUrl(company.logoUrl);
      this.logoUrlMap.set(company.logoUrl, safeUrl);
      return safeUrl;
    } catch (e) {
      console.error('Error in getLogoUrl:', e);
      return '';
    }
  }

  /**
   * Generate initials from company name
   * @param names Array of company names
   * @returns String of initials (up to 2 characters)
   */
  getInitials(names: string[]): string {
    if (!names || names.length === 0) {
      return '??';
    }
    
    // Use the first name in the array
    const name = names[0];
    
    // Split the name by spaces
    const parts = name.split(' ');
    
    if (parts.length === 1) {
      // If single word, return first 2 characters
      return name.substring(0, 2).toUpperCase();
    } else {
      // If multiple words, return first letter of first two words
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
  }
  
  /**
   * Get a consistent color for a company based on its name
   * @param name Company name
   * @returns Hex color string
   */
  getRandomColor(name: string): string {
    if (!name) return this.colors[0];
    
    // Check if we already have a color for this company
    if (this.colorMap.has(name)) {
      return this.colorMap.get(name) as string;
    }
    
    // Generate a consistent index based on the name string
    const index = Math.abs(
      name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % this.colors.length;
    
    // Store and return the color
    const color = this.colors[index];
    this.colorMap.set(name, color);
    return color;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadUserInfo(): void {
    const userInfo = this.authService.getCurrentUser();
    if (userInfo && userInfo.email) {
      this.username = userInfo.email;
    }
  }
}