import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../Article';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent {
  allArticles: Article[] = [];
  filteredArticles: Article[] = [];
  displayedArticles: Article[] = [];

  searchKeyword: string = '';

  pageSize: number = 12;
  currentPage: number = 1;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Article[]>('http://localhost:8080/articles').subscribe({
      next: (response) => {
        this.allArticles = response;
        this.applyFilterAndPagination();
      },
      error: () => {
        alert('Access request failed, please try again later!');
      },
    });
  }

  applyFilterAndPagination(): void {
    const keyword = this.searchKeyword.toLowerCase().trim();
    this.filteredArticles = keyword
      ? this.allArticles.filter(article =>
          article.title.toLowerCase().includes(keyword)
        )
      : [...this.allArticles];

    this.currentPage = 1;
    this.updateDisplayedArticles();
  }

  updateDisplayedArticles(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedArticles = this.filteredArticles.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredArticles.length / this.pageSize) || 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedArticles();
    }
  }

  goToDetail(id: number): void {
    this.router.navigate(['/news', id]);
  }
}
