import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User, RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  showAddForm = false;
  editingUser: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.editingUser ? [] : [Validators.required]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        console.log('Users response:', response);
        // Check if response is an array or has a data property
        let usersData: User[] = [];
        
        if (Array.isArray(response)) {
          usersData = response;
        } else if (response && typeof response === 'object') {
          // Check if response has a data property that is an array
          const anyResponse = response as any;
          if (anyResponse.data && Array.isArray(anyResponse.data.users)) {
            usersData = anyResponse.data.users;
          } else if (anyResponse.data && Array.isArray(anyResponse.data)) {
            usersData = anyResponse.data;
          }
        }
        
        console.log('Processed users data:', usersData);
        this.users = usersData;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.users = [];
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.editingUser) {
        const updateData: Partial<User> = {
          email: formValue.email,
          role: formValue.role
        };

        if (formValue.password) {
          updateData.password = formValue.password;
        }

        this.userService.updateUser(this.editingUser.userId!, updateData).subscribe({
          next: (response) => {
            console.log('Update user response:', response);
            this.loadUsers();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Failed to update user:', error);
          }
        });
      } else {
        const createRequest: RegisterRequest = {
          email: formValue.email,
          password: formValue.password,
          role: formValue.role
        };

        console.log('Creating user with data:', createRequest);
        this.userService.createUser(createRequest).subscribe({
          next: (response) => {
            console.log('Create user response:', response);
            this.loadUsers();
            this.showAddForm = false;
            this.userForm.reset();
          },
          error: (error) => {
            console.error('Failed to create user:', error);
          }
        });
      }
    }
  }

  editUser(user: User) {
    console.log('Editing user:', user);
    this.editingUser = user;
    this.userForm.patchValue({
      email: user.email,
      role: user.role
    });
    this.showAddForm = true;
  }

  deleteUser(user: User) {
    if (user.userId && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.editingUser = null;
    this.showAddForm = false;
    this.userForm.reset({
      role: 'user'
    });
  }
} 