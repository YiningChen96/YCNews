import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface Article {
  id: number;
  title: string;
}

interface Image {
  id: number;
  name: string;
  url: string; // 图片的 URL 地址
}

@Component({
  selector: 'app-upload-imagenews',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './upload-imagenews.component.html',
  styleUrl: './upload-imagenews.component.css',
})
export class UploadImagenewsComponent {
  allArticles: Article[] = [];
  filteredArticles: Article[] = [];
  displayedArticles: Article[] = [];

  selectedArticleId: number | null = null;
  articleImages: Image[] = [];
  selectedImage: Image | null = null;

  searchKeyword: string = '';
  currentPage: number = 1;
  pageSize: number = 20;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Article[]>('http://localhost:8080/articles', { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.allArticles = data;
        this.filteredArticles = [...data];
        this.updateDisplayedArticles();
      },
      error: () => alert('Failed to load articles.'),
    });
  }

  private getAuthHeaders(setJson: boolean = true): HttpHeaders {
    const token = localStorage.getItem('token')?.trim();

    if (!token || this.isTokenExpired(token)) {
      alert('Not logged in or session expired');
      this.logout();
      return new HttpHeaders();
    }

    let headers = new HttpHeaders({
      'Authorization': token
    });

    return setJson ? headers.set('Content-Type', 'application/json') : headers;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/log_in']);
  }

  updateDisplayedArticles(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedArticles = this.filteredArticles.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredArticles.length / this.pageSize) || 1;
  }

  changePage(step: number): void {
    const newPage = this.currentPage + step;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updateDisplayedArticles();
    }
  }

  searchArticles(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    this.filteredArticles = keyword
      ? this.allArticles.filter((a) => a.title.toLowerCase().includes(keyword))
      : [...this.allArticles];
    this.currentPage = 1;
    this.updateDisplayedArticles();
  }

  selectArticle(articleId: number): void {
    this.selectedArticleId = articleId;
    this.articleImages = [];

    const formData = new FormData();
    formData.append('id', articleId.toString());

    this.http.post<Image[]>('http://localhost:8080/articles/getImagesByArticleId', formData, {
      headers: this.getAuthHeaders(false)  // ❗不设置 Content-Type
    }).subscribe({
      next: (images) => {
        this.articleImages = images;
        this.selectedImage = null;
      },
      error: () => alert('Failed to load images.'),
    });
  }

  selectImage(image: Image): void {
    this.selectedImage = image;
  }

  setAsImageNews(imageId: number): void {
    if (!this.selectedArticleId || !this.selectedImage) return;
    const formData = new FormData();
    formData.append('articleId', this.selectedArticleId.toString());
    formData.append('imageId', imageId.toString());

    this.http.post('http://localhost:8080/image-news/set', formData, {
      responseType: 'text',
      headers: this.getAuthHeaders(false)  // ❗不设置 Content-Type
    }).subscribe({
      next: () => {
        alert('Set as image news successfully!');
      },
      error: () => {
        alert('Set as image news failed!');
      },
    });
  }
}
