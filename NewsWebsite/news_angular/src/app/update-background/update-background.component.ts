import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-background',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './update-background.component.html',
  styleUrls: ['./update-background.component.css'],
})

export class UpdateBackgroundComponent implements OnInit {
  backgroundImages: string[] = [];
  selectedImage: string | null = null;
  uploadFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadBackgroundImages();
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

  loadBackgroundImages(): void {
    this.backgroundImages = [];  // 清空旧数据
    this.http.get<string[]>('http://localhost:8080/images/getAllBackgroundImages', {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (response: string[]) => {
        const timestamp = new Date().getTime();  // 👈 当前时间戳
        response.forEach((url: string) => {
          this.backgroundImages.push(`http://localhost:8080${url}?t=${timestamp}`);  // 👈 加时间戳防缓存
        });
      }
    });
  }
  

  selectImage(imageUrl: string): void {
    this.selectedImage = this.selectedImage === imageUrl ? null : imageUrl;
  }

  deleteSelectedImage(): void {
    if (!this.selectedImage) return;
    this.selectedImage = this.selectedImage
    .replace('http://localhost:8080', '')
    .split('?')[0];
    const params = new HttpParams().set('imageUrl', this.selectedImage);
    this.http.post('http://localhost:8080/images/deleteBackgroundImage', null, { params,
      headers: this.getAuthHeaders() 
    })
      .subscribe(() => {
        this.selectedImage = null;
        this.loadBackgroundImages();
      });
  }

  onFileSelected(event: any): void {
    this.uploadFile = event.target.files[0];
  }

  uploadImage(): void {
    if (!this.uploadFile) return;
    const formData = new FormData();
    formData.append('file', this.uploadFile);
    this.http.post('http://localhost:8080/images/uploadBackgroundImage', formData, { responseType: 'text',
      headers: this.getAuthHeaders() 
     })
      .subscribe(()=>{
        this.uploadFile = null;
            // ✅ 延迟一会再加载，给服务器一点点时间处理文件系统写入
    setTimeout(() => {
      this.loadBackgroundImages();
    }, 1000); // 500ms 就够

  });
  }
}
