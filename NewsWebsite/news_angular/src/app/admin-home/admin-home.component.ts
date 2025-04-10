import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

@Component({
  selector: 'app-admin-home',
  imports: [HttpClientModule,  CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  role: UserRole | null = null;
  isSuperAdmin: boolean = false;
  showAccountFeature: boolean = false;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<{ role: string }>(token);  // 正确使用 jwtDecode
        this.role = decodedToken.role as UserRole;  
        this.isSuperAdmin = this.role === UserRole.SUPER_ADMIN;  
        this.showAccountFeature = this.isSuperAdmin;  
      } catch (error) {
        alert('Token is expired, please re-log-in')
        this.logout();
      }
    }
  }

  navigateTo(page: string) {
    this.router.navigate([`/admin/${page}`]);
  }

  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/log_in']);  
  }

}
