import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Article } from '../Article';
import { Image } from '../Image';

@Component({
  selector: 'app-update-record',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent{
  recordId: number | null = null;
  record: Article | null = null;
  images: string[] = [];  // 存储图片 URL

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.recordId = +params.get('id')!;
    });
    
    const params = new HttpParams().set('id', this.recordId?.toString() || '');
    // 获取文章内容
    this.http.post<Article>(`http://localhost:8080/articles/getArticle`,{},{params}).subscribe({
      next: (response) => {
        this.record = response;
      },
      error: () => {
        alert('Please Try Again！');
      }
    });
  
    // 获取该文章的所有图片 ID
    this.http.post<Image[]>(`http://localhost:8080/articles/getImagesByArticleId`,{},{params}).subscribe({
      next: (response) => {
        if (response.length > 0) {
          response.forEach(image => this.images.push('http://localhost:8080'+image.url));
        }
      },
      error: () => {
        alert('Please Try Again！');
      }
    });
  }
  
}
