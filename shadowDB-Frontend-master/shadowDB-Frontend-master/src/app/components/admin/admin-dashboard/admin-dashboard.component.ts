import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  sidebarCollapsed = false;
  isMobile = false;
  currentUser: any = null;
  userInitial: string = 'A'; // Default initial

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);
    if (this.currentUser && this.currentUser.email) {
      // Set the initial character for the avatar
      this.userInitial = this.currentUser.email.charAt(0).toUpperCase();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile && !this.sidebarCollapsed) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  closeMenuOnMobile() {
    if (this.isMobile) {
      setTimeout(() => {
        this.sidebarCollapsed = true;
      }, 150);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}