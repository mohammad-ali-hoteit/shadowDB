import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // Load user from local storage on service initialization
  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');
      
      console.log('Stored user:', storedUser);
      console.log('Stored token:', token);
      
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          this.currentUserSubject.next(parsedUser);
          console.log('User loaded from storage:', parsedUser);
        } else {
          console.warn('Invalid user data in storage');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
        }
      } else {
        console.warn('No user in storage or invalid user data');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/SHADOWDB/API/V1/AUTH/LOGIN`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          
          if (response?.status === 'success' && response?.data) {
            const { user, token } = response.data;
            
            if (user && token) {
              console.log('Saving auth data - Token:', token);
              console.log('Saving auth data - User:', user);
              
              localStorage.setItem('token', token);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/SHADOWDB/API/V1/AUTH/REGISTER`, userData)
      .pipe(
        tap(response => {
          console.log('Register response:', response);
          
          if (response?.status === 'success' && response?.data) {
            const { user, token } = response.data;
            
            if (user && token) {
              console.log('Saving auth data - Token:', token);
              console.log('Saving auth data - User:', user);
              
              localStorage.setItem('token', token);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
} 