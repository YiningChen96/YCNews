import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-news.component.html',
  styleUrl: './image-news.component.css'
})
export class ImageNewsComponent {
  imageUrls: string[] = []; // 存储图片的 URL
  titles: { [key: string]: string } = {}; // 存储 ID 对应的新闻标题
  currentIndex: number = 0; // 轮播的当前索引
  intervalId: any; // 轮播定时器

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<string[]>('http://localhost:8080/image-news/all').subscribe({
      next: (response: string[]) => {
        this.imageUrls = response.map(url => `http://localhost:8080${url}`);
        this.imageUrls.forEach(url => this.findTitle(url)); // 获取标题
        this.startSlideshow(); // 开始轮播
      },
      error: (error) => {
        console.error('Cannot get image URLs from backend:', error);
      },
    });
  }

  /** 获取文章标题 */
  findTitle(imageUrl: string): void {
    const id = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('.')[0]; // 提取 ID（文件名去掉后缀）
    this.http.post('http://localhost:8080/image-news/get', {}, { 
      params: { articleId: id }, 
      responseType: 'text' // 确保返回的是纯文本
    }).subscribe({
      next: (title) => {
        this.titles[id] = title;
      },
      error: (error) => {
        console.error(`Cannot get title for image ${id}:`, error);
      },
    });
  }

  /** 点击图片跳转到新闻详情页 */
  goToNews(imageUrl: string): void {
    const id = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('.')[0];
    this.router.navigate(['/news', id]);
  }

  /** 开始轮播 */
  startSlideshow(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
    }, 3000); // 每 5 秒切换图片
  }

  extractIdFromUrl(url: string | undefined): string {
    if (!url) return '';  // 不能返回 null，返回空字符串
    const match = url.match(/(\d+)\.\w+$/);
    return match ? match[1] : ''; // 返回 '' 代替 null
  }
  
}
