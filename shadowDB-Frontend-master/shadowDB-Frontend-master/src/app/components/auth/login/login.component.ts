import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      
      // Clear previous error message
      this.errorMessage = '';
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          
          if (!response) {
            this.errorMessage = 'Empty response from server';
            return;
          }
          
          if (!response.data?.user) {
            this.errorMessage = 'Invalid response from server: missing user data';
            console.error('Invalid auth response:', response);
            return;
          }
          
          if (!response.data?.token) {
            this.errorMessage = 'Invalid response from server: missing token';
            console.error('Invalid auth response:', response);
            return;
          }
          
          if (response.data.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            console.log('User is not admin, navigating to home');
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}
