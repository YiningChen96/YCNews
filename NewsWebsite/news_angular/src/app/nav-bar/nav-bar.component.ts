import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnChanges {
  logoUrl: string | null = null;  // 存储 logo 的 URL
  menuOpen = false;

  @Input() returnLink: string = '/home';

  navItems: { label: string, link: string }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.updateNavItems();

    // 获取 logo 图标
    this.http.get('http://localhost:8080/logo',{responseType : 'text'}).subscribe({
      next: (response) => {
        // 后端返回的 logo URL 直接使用
        this.logoUrl = response; // 使用完整的 URL，后端返回如 'http://localhost:8080/images/logos/current_logo.png'
      },
      error: (error) => {
        console.error('无法从后端获取 logo URL:', error);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['returnLink']) {
      this.updateNavItems();
    }
  }

  updateNavItems(): void {
    this.navItems = [
      { label: 'Home', link: '/home' },
      { label: 'Politics', link: '/politics' },
      { label: 'Business', link: '/business' },
      { label: 'Technology', link: '/technology' },
      { label: 'Sports', link: '/sports' },
      { label: 'Entertainment', link: '/entertainment' },
      { label: 'log_in', link: '/log_in' },
      { label: 'return', link: this.returnLink },
    ];
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
