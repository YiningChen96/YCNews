import { Component, OnInit } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-logo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './update-logo.component.html',
  styleUrls: ['./update-logo.component.css']
})
export class UpdateLogoComponent implements OnInit {
  logoUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient , private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentLogo();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')?.trim();

    if (!token || this.isTokenExpired(token)) {
      alert('Not logged in or session expired');
      this.logout();
      return new HttpHeaders(); // 空 headers 避免出错
    }

    return new HttpHeaders({
      'Authorization': token // 只需要传递 Authorization header
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true; // 解码失败视为过期
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/log_in']);
  }

  loadCurrentLogo(): void {
    this.http.get('http://localhost:8080/logo', { responseType: 'text', headers: this.getAuthHeaders() }).subscribe({
      next: (url: string) => {
        console.log('Received URL:', url);
        this.logoUrl = url + '?t=' + new Date().getTime();

      },
      error: () => {
        this.logoUrl = null;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadLogo(): void {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/logo/replace', formData, { responseType: 'text' ,headers: this.getAuthHeaders()}).subscribe(() => {
      this.selectedFile = null;
      this.logoUrl=null;
          // ✅ 延迟一会再加载，给服务器一点点时间处理文件系统写入
    setTimeout(() => {
      this.loadCurrentLogo();
    }, 1000); // 500ms 就够
      
    });
  }
}
