import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete-imagenews',
  imports:[CommonModule,HttpClientModule],
  templateUrl: './delete-imagenews.component.html',
  styleUrls: ['./delete-imagenews.component.css']
})
export class DeleteImagenewsComponent implements OnInit {
  imageNewsUrls: string[] = []; // 存储所有图片新闻的 URL 列表

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadImageNewsUrls();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')?.trim();
  
    if (!token || this.isTokenExpired(token)) {
      alert('Not logged in or session expired');
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
      return true; // 解码失败视为过期
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/log_in']);  
  }

  // 加载所有图片新闻的URL
  loadImageNewsUrls(): void {
    this.http.get<string[]>('http://localhost:8080/image-news/all',{ headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.imageNewsUrls = response;
      },
      error: (error) => {
        alert('Failed to load image news URLs.');
      }
    });
  }

  // 删除图片新闻
  deleteImageNews(imageUrl: string): void {
    const articleId = this.extractArticleIdFromUrl(imageUrl);

    this.http.post<void>(`http://localhost:8080/image-news/delete?articleId=${articleId}`, null,{ headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        // 删除成功后，更新列表
        alert('Delete successfully.');
        this.loadImageNewsUrls();
      },
      error: () => {
        alert('Failed to delete image news.');
      }
    });
  }

  // 从 URL 提取文章ID
  private extractArticleIdFromUrl(imageUrl: string): number {
    // 假设 URL 格式为 "/images/imagenews/{articleId}.jpg"
    const matches = imageUrl.match(/imagenews\/(\d+)\./);
    return matches ? parseInt(matches[1], 10) : NaN;
  }
}
