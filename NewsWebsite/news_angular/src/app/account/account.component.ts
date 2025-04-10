import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  admins: any[] = [];
  adminForm!: FormGroup;
  changePasswordForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.changePasswordForm = this.fb.group({
      username: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });

    this.loadAdmins();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')?.trim();
  
    if (!token || this.isTokenExpired(token)) {
      this.errorMessage = 'Not logged in or session expired';
      this.logout();
      return new HttpHeaders(); // 空 headers 避免出错
    }
  
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
  }
  
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      console.error('Token decode failed:', e);
      return true; // 解码失败视为过期
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/log_in']);  
  }

  // ✅ 加载管理员列表
  loadAdmins(): void {
    this.http.get<any[]>('http://localhost:8080/admin/all', { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.admins = response;
      },
      error: (err) => {
        this.errorMessage = 'Failed to get administrator';
      }
    });
  }

  // ✅ 添加管理员
  addAdmin(): void {
    if (this.adminForm.valid) {
      const { username, password } = this.adminForm.value;
      this.http.post('http://localhost:8080/admin/create', null, {
        params: { username, password },
        headers: this.getAuthHeaders(),
        responseType: 'text'
      }).subscribe({
        next: () => {
          this.loadAdmins();
          this.adminForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Add failed';
        }
      });
    }
  }

  // ✅ 删除管理员
  deleteAdmin(id: number): void {
    const body = { id };
    this.http.post('http://localhost:8080/admin/delete', body, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.loadAdmins();
      },
      error: (err) => {
        this.errorMessage = 'Deletion failed';
      }
    });
  }

  // ✅ 修改管理员密码
  changePassword(): void {
    if (this.changePasswordForm.valid) {
      const body = this.changePasswordForm.value;
      this.http.post('http://localhost:8080/admin/change-password', body, {
        headers: this.getAuthHeaders(),
        responseType: 'text'
      }).subscribe({
        next: () => {
          alert('Password changed successfully');
          this.changePasswordForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Password modification failed';
        }
      });
    }
  }
}
