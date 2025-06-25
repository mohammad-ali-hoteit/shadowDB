import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/SHADOWDB/API/V1/USER`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.post<any>(`${this.apiUrl}/GET_ALL_USERS`, {})
      .pipe(
        map(response => {
          // Handle different response formats
          if (Array.isArray(response)) {
            return response;
          } else if (response && typeof response === 'object') {
            if (response.data && Array.isArray(response.data.users)) {
              return response.data.users;
            } else if (response.data && Array.isArray(response.data)) {
              return response.data;
            }
          }
          return [];
        })
      );
  }

  getUserById(userId: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/GET_USER_BY_ID`, { userId })
      .pipe(
        map(response => {
          if (response && response.data && response.data.user) {
            return response.data.user;
          }
          return response;
        })
      );
  }

  createUser(userData: RegisterRequest): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/CREATE_USER`, userData)
      .pipe(
        map(response => {
          if (response && response.data && response.data.user) {
            return response.data.user;
          }
          return response;
        })
      );
  }

  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/UPDATE_USER`, {
      userId,
      ...userData
    }).pipe(
      map(response => {
        if (response && response.data && response.data.user) {
          return response.data.user;
        }
        return response;
      })
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/DELETE_USER`, { userId });
  }
} 