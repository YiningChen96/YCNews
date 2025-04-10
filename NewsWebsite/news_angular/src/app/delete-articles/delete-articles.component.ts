import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
interface Article {
  id: number;
  title: string;
}

@Component({
  selector: 'app-delete-articles',
  imports:[CommonModule ,FormsModule,HttpClientModule],
  templateUrl: './delete-articles.component.html',
  styleUrls: ['./delete-articles.component.css']
})
export class DeleteArticlesComponent implements OnInit {
  allArticles: Article[] = [];
  filteredArticles: Article[] = [];
  pagedArticles: Article[] = [];
  selectedArticles: Set<number> = new Set();

  currentPage: number = 1;
  pageSize: number = 30;
  searchKeyword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Article[]>('http://localhost:8080/articles',{ headers: this.getAuthHeaders() }).subscribe(data => {
      this.allArticles = data;
      this.filterArticles();
    });
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

  filterArticles() {
    const keyword = this.searchKeyword.trim().toLowerCase();
    this.filteredArticles = keyword
      ? this.allArticles.filter(article => article.title.toLowerCase().includes(keyword))
      : [...this.allArticles];
    this.currentPage = 1;
    this.updateDisplayedArticles();
  }

  updateDisplayedArticles() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedArticles = this.filteredArticles.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedArticles();
  }

  toggleSelection(id: number) {
    if (this.selectedArticles.has(id)) {
      this.selectedArticles.delete(id);
    } else {
      this.selectedArticles.add(id);
    }
  }

  isAllSelected(): boolean {
    return this.pagedArticles.every(article => this.selectedArticles.has(article.id));
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.pagedArticles.forEach(article => this.selectedArticles.add(article.id));
    } else {
      this.pagedArticles.forEach(article => this.selectedArticles.delete(article.id));
    }
  }

  deleteArticle(id: number) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    this.http.post<void>(`http://localhost:8080/articles/deleteArticle?id=${id}`, {},{ headers: this.getAuthHeaders() }).subscribe(() => {
      this.allArticles = this.allArticles.filter(article => article.id !== id);
      this.selectedArticles.delete(id);
      this.filterArticles();
    });
  }

  deleteSelectedArticles() {
    if (!confirm('Are you sure you want to delete the selected articles?')) return;
    const ids = Array.from(this.selectedArticles);
    ids.forEach(id => {
      this.http.post<void>(`http://localhost:8080/articles/deleteArticle?id=${id}`, {},{ headers: this.getAuthHeaders() }).subscribe(() => {
        this.allArticles = this.allArticles.filter(article => article.id !== id);
        this.selectedArticles.delete(id);
        this.filterArticles();
      });
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredArticles.length / this.pageSize) || 1;
  }
}
